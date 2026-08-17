"""
Semantic Validator Engine
=========================
Extracts statistical claims from natural-language text (via RegEx + a small
keyword lexicon) and cross-checks them against the actual math computed from
the live data tables (via SciPy).

This is the "peer reviewer" that lives inside the editor. It flags scientific
contradictions such as:

  * Claiming "significant" while the written/computed P-value is > 0.05
  * Writing a P-value that does not match the value computed from the data
  * Stating a mean/statistic that does not match the data

spaCy can be swapped in later for richer dependency parsing; the current
implementation is intentionally lightweight (RegEx + lexicon) so the MVP runs
with a minimal dependency footprint.
"""

import re
from typing import Any, Dict, List, Optional, Tuple

from scipy import stats

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SIGNIFICANCE_THRESHOLD = 0.05  # conventional alpha level

# Words/phrases that assert a statistically significant result.
SIGNIFICANCE_CLAIM_PATTERNS = [
    r"statistically\s+significant",
    r"significant(?:ly)?\b",
    r"meaningful(?:ly)?\b",
    r"strong\s+effect",
    r"reject(?:s|ed)?\s+the\s+null",
]

# Words/phrases that assert a NON-significant result.
NON_SIGNIFICANCE_CLAIM_PATTERNS = [
    r"not\s+significant",
    r"no\s+significant",
    r"non-?significant",
    r"fail(?:s|ed)?\s+to\s+reject",
    r"insignificant",
]

# P-value written in text, e.g. "p = 0.08", "P<0.05", "p-value 0.03".
P_VALUE_PATTERN = re.compile(
    r"\bp(?:-value)?\s*([=<>])\s*([0-9]*\.?[0-9]+)\b", re.IGNORECASE
)

# A bare numeric mean claim, e.g. "mean = 4.2", "average of 3.1".
MEAN_PATTERN = re.compile(
    r"\b(?:mean|average)\s*(?:of|is|=|:)?\s*([0-9]*\.?[0-9]+)\b", re.IGNORECASE
)

# A written t-statistic, e.g. "t = 2.31", "t(28) = 2.31".
T_STAT_PATTERN = re.compile(
    r"\bt\s*(?:\(\s*[0-9]+\s*\))?\s*[=:]\s*([0-9]*\.?[0-9]+)\b", re.IGNORECASE
)


# ---------------------------------------------------------------------------
# Claim extraction
# ---------------------------------------------------------------------------
def _has_any(text: str, patterns: List[str]) -> bool:
    return any(re.search(p, text, re.IGNORECASE) for p in patterns)


def extract_claims(text: str) -> Dict[str, Any]:
    """Pull the statistical claims a researcher has written into the text."""
    claims = {
        "claims_significance": _has_any(text, SIGNIFICANCE_CLAIM_PATTERNS),
        "claims_non_significance": _has_any(text, NON_SIGNIFICANCE_CLAIM_PATTERNS),
        "written_p": None,
        "written_p_operator": None,
        "written_mean": None,
        "written_t": None,
    }

    p_match = P_VALUE_PATTERN.search(text)
    if p_match:
        claims["written_p_operator"] = p_match.group(1)
        claims["written_p"] = float(p_match.group(2))

    mean_match = MEAN_PATTERN.search(text)
    if mean_match:
        claims["written_mean"] = float(mean_match.group(1))

    t_match = T_STAT_PATTERN.search(text)
    if t_match:
        claims["written_t"] = float(t_match.group(1))

    return claims


# ---------------------------------------------------------------------------
# Math engine
# ---------------------------------------------------------------------------
def _numeric_columns(table: Dict[str, Any]) -> List[Tuple[str, List[float]]]:
    """Return (column_name, numeric_values) pairs for a table's numeric columns."""
    headers = table.get("headers", [])
    rows = table.get("rows", [])
    columns: Dict[str, List[float]] = {h: [] for h in headers}

    for row in rows:
        for header in headers:
            raw = row.get(header)
            if raw is None:
                continue
            try:
                val = float(raw)
                columns[header].append(val)
            except (TypeError, ValueError):
                continue

    return [(h, vals) for h, vals in columns.items() if len(vals) >= 2]


def compute_actual_stats(tables: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compute the real statistics from the live data.

    For each table we attempt an independent two-sample t-test between the
    first two numeric columns (the most common research comparison). We also
    record per-column means so mean claims can be verified.
    """
    result: Dict[str, Any] = {
        "tables": [],
        "best_p": None,          # lowest p across all comparisons
        "best_t": None,
        "best_table": None,
        "best_columns": None,
    }

    for table in tables:
        numeric = _numeric_columns(table)
        table_stats = {
            "tableId": table.get("tableId"),
            "tableName": table.get("tableName", "Table"),
            "columns": {},
            "comparisons": [],
        }

        for name, values in numeric:
            arr = [float(v) for v in values]
            mean = sum(arr) / len(arr)
            variance = (
                sum((v - mean) ** 2 for v in arr) / (len(arr) - 1)
                if len(arr) > 1
                else 0.0
            )
            table_stats["columns"][name] = {
                "mean": mean,
                "std": variance ** 0.5,
                "n": len(arr),
            }

        # Independent two-sample t-test between the first two numeric columns.
        if len(numeric) >= 2:
            (name_a, vals_a), (name_b, vals_b) = numeric[0], numeric[1]
            if len(vals_a) >= 2 and len(vals_b) >= 2:
                t_stat, p_value = stats.ttest_ind(
                    [float(v) for v in vals_a],
                    [float(v) for v in vals_b],
                    equal_var=False,
                )
                table_stats["comparisons"].append(
                    {
                        "columnA": name_a,
                        "columnB": name_b,
                        "t": float(t_stat),
                        "p": float(p_value),
                    }
                )
                if result["best_p"] is None or abs(p_value) < abs(result["best_p"]):
                    result["best_p"] = float(p_value)
                    result["best_t"] = float(t_stat)
                    result["best_table"] = table.get("tableName", "Table")
                    result["best_columns"] = (name_a, name_b)

        result["tables"].append(table_stats)

    return result


# ---------------------------------------------------------------------------
# Logic checks (the novelty)
# ---------------------------------------------------------------------------
def _build_error(message: str, match: str) -> Dict[str, Any]:
    return {"hasError": True, "errorMessage": message, "match": match}


def verify_semantics(text: str, tables: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Run the full verification pipeline and return a verdict."""
    claims = extract_claims(text)
    actual = compute_actual_stats(tables)

    # --- 1. Significance claim vs. written P-value -------------------------
    if claims["claims_significance"] and claims["written_p"] is not None:
        written_p = claims["written_p"]
        if written_p > SIGNIFICANCE_THRESHOLD:
            return _build_error(
                f"Logic Error: You claimed 'significance', but the P-value you "
                f"wrote is {written_p:.3f} (> {SIGNIFICANCE_THRESHOLD}). A result "
                f"is typically only significant when P < {SIGNIFICANCE_THRESHOLD}.",
                f"P = {written_p}",
            )

    # --- 2. Significance claim vs. computed P-value ------------------------
    if claims["claims_significance"] and actual["best_p"] is not None:
        if actual["best_p"] > SIGNIFICANCE_THRESHOLD:
            return _build_error(
                f"Logic Error: You claimed 'significance', but the live data "
                f"calculates P = {actual['best_p']:.3f} (> {SIGNIFICANCE_THRESHOLD}) "
                f"for the comparison {actual['best_columns'][0]} vs "
                f"{actual['best_columns'][1]} in '{actual['best_table']}'.",
                "significant",
            )

    # --- 3. Written P-value vs. computed P-value ---------------------------
    if claims["written_p"] is not None and actual["best_p"] is not None:
        written_p = claims["written_p"]
        if round(written_p, 2) != round(actual["best_p"], 2):
            return _build_error(
                f"Data Mismatch: You wrote P = {written_p}, but the live data "
                f"calculates P = {actual['best_p']:.3f} for the comparison "
                f"{actual['best_columns'][0]} vs {actual['best_columns'][1]} in "
                f"'{actual['best_table']}'.",
                f"P = {written_p}",
            )

    # --- 4. Written mean vs. computed mean ---------------------------------
    if claims["written_mean"] is not None:
        for table_stats in actual["tables"]:
            for col_name, col_stats in table_stats["columns"].items():
                if round(claims["written_mean"], 2) != round(col_stats["mean"], 2):
                    return _build_error(
                        f"Data Mismatch: You wrote a mean of "
                        f"{claims['written_mean']}, but the live data calculates "
                        f"the mean of '{col_name}' in '{table_stats['tableName']}' "
                        f"as {col_stats['mean']:.3f}.",
                        f"{claims['written_mean']}",
                    )

    return {"hasError": False}
