/**
 * Export utilities: convert the editor JSON tree to HTML (for PDF) or LaTeX
 * (for a .tex file). Handles paragraphs, headings, lists, tables, math
 * equations, citations, smart variables, and inline marks.
 */

// ---- Inline marks ---------------------------------------------------------
function renderInlineMarks(node, inner) {
    let out = inner;
    const marks = node.marks || [];
    for (const mark of marks) {
        switch (mark.type) {
            case 'bold': out = `<strong>${out}</strong>`; break;
            case 'italic': out = `<em>${out}</em>`; break;
            case 'underline': out = `<u>${out}</u>`; break;
            case 'strike': out = `<s>${out}</s>`; break;
            case 'superscript': out = `<sup>${out}</sup>`; break;
            case 'subscript': out = `<sub>${out}</sub>`; break;
            case 'link': out = `<a href="${mark.attrs.href || '#'}">${out}</a>`; break;
            case 'comment': out = `<span class="comment" data-comment-id="${mark.attrs.commentId || ''}">${out}</span>`; break;
            default: break;
        }
    }
    return out;
}

function renderInlineLatexMarks(node, inner) {
    let out = inner;
    const marks = node.marks || [];
    for (const mark of marks) {
        switch (mark.type) {
            case 'bold': out = `\\textbf{${out}}`; break;
            case 'italic': out = `\\textit{${out}}`; break;
            case 'underline': out = `\\underline{${out}}`; break;
            case 'strike': out = `\\sout{${out}}`; break;
            case 'superscript': out = `\\textsuperscript{${out}}`; break;
            case 'subscript': out = `\\textsubscript{${out}}`; break;
            case 'link': out = `\\href{${mark.attrs.href || '#'}}{${out}}`; break;
            default: break;
        }
    }
    return out;
}

// ---- HTML -----------------------------------------------------------------
function nodeToHtml(node) {
    switch (node.type) {
        case 'paragraph': {
            const inner = (node.content || []).map(nodeToHtml).join('');
            return `<p>${inner}</p>`;
        }
        case 'heading': {
            const level = node.attrs?.level || 1;
            const inner = (node.content || []).map(nodeToHtml).join('');
            return `<h${level}>${inner}</h${level}>`;
        }
        case 'bulletList': {
            const inner = (node.content || []).map(nodeToHtml).join('');
            return `<ul>${inner}</ul>`;
        }
        case 'orderedList': {
            const inner = (node.content || []).map(nodeToHtml).join('');
            return `<ol>${inner}</ol>`;
        }
        case 'listItem': {
            const inner = (node.content || []).map(nodeToHtml).join('');
            return `<li>${inner}</li>`;
        }
        case 'text': {
            return renderInlineMarks(node, node.text || '');
        }
        case 'table': {
            const rows = (node.content || []).map(nodeToHtml).join('');
            return `<table><tbody>${rows}</tbody></table>`;
        }
        case 'tableRow': {
            const cells = (node.content || []).map(nodeToHtml).join('');
            return `<tr>${cells}</tr>`;
        }
        case 'tableHeader': {
            const inner = (node.content || []).map(nodeToHtml).join('');
            return `<th>${inner}</th>`;
        }
        case 'tableCell': {
            const inner = (node.content || []).map(nodeToHtml).join('');
            return `<td>${inner}</td>`;
        }
        case 'mathEquation': {
            return `<div class="math-equation">$${node.attrs?.latex || ''}$</div>`;
        }
        case 'citation': {
            return `<div class="citation">${node.attrs?.text || ''}</div>`;
        }
        case 'smartVariable': {
            return `<span class="smart-variable">${node.attrs?.label || node.attrs?.columnName || 'Variable'}</span>`;
        }
        case 'horizontalRule': return '<hr/>';
        case 'blockquote': {
            const inner = (node.content || []).map(nodeToHtml).join('');
            return `<blockquote>${inner}</blockquote>`;
        }
        default: {
            if (node.content) return (node.content || []).map(nodeToHtml).join('');
            return '';
        }
    }
}

// ---- LaTeX ----------------------------------------------------------------
function nodeToLatex(node) {
    switch (node.type) {
        case 'paragraph': {
            const inner = (node.content || []).map(nodeToLatex).join('');
            return `${inner}\n\n`;
        }
        case 'heading': {
            const level = node.attrs?.level || 1;
            const cmd = level === 1 ? 'section' : level === 2 ? 'subsection' : 'subsubsection';
            const inner = (node.content || []).map(nodeToLatex).join('');
            return `\\${cmd}{${inner}}\n\n`;
        }
        case 'bulletList': {
            const inner = (node.content || []).map(nodeToLatex).join('');
            return `\\begin{itemize}\n${inner}\\end{itemize}\n\n`;
        }
        case 'orderedList': {
            const inner = (node.content || []).map(nodeToLatex).join('');
            return `\\begin{enumerate}\n${inner}\\end{enumerate}\n\n`;
        }
        case 'listItem': {
            const inner = (node.content || []).map(nodeToLatex).join('');
            return `  \\item ${inner}\n`;
        }
        case 'text': {
            return renderInlineLatexMarks(node, escapeLatex(node.text || ''));
        }
        case 'table': {
            const rows = node.content || [];
            if (rows.length === 0) return '';
            const numCols = rows[0].content?.length || 1;
            const colSpec = '|' + 'c|'.repeat(numCols);
            let out = `\\begin{tabular}{${colSpec}}\n\\hline\n`;
            rows.forEach((row) => {
                const cells = (row.content || []).map(c => nodeToLatex(c).trim()).join(' & ');
                out += `${cells} \\\\ \\hline\n`;
            });
            out += `\\end{tabular}\n\n`;
            return out;
        }
        case 'tableHeader':
        case 'tableCell': {
            return (node.content || []).map(nodeToLatex).join('');
        }
        case 'mathEquation': {
            return `\\[${node.attrs?.latex || ''}\\]\n\n`;
        }
        case 'citation': {
            return `\\textit{${escapeLatex(node.attrs?.text || '')}}\n\n`;
        }
        case 'smartVariable': {
            return escapeLatex(node.attrs?.label || node.attrs?.columnName || 'Variable');
        }
        case 'horizontalRule': return '\\hrulefill\n\n';
        case 'blockquote': {
            const inner = (node.content || []).map(nodeToLatex).join('');
            return `\\begin{quote}\n${inner}\\end{quote}\n\n`;
        }
        default: {
            if (node.content) return (node.content || []).map(nodeToLatex).join('');
            return '';
        }
    }
}

function escapeLatex(str) {
    return str
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/([&%$#_{}])/g, '\\$1')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
}

export function jsonToHtml(json) {
    return (json.content || []).map(nodeToHtml).join('');
}

export function jsonToLatex(json) {
    return (json.content || []).map(nodeToLatex).join('');
}

export function buildLatexDocument(json, title = 'Untitled') {
    return `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage[utf8]{inputenc}
\\usepackage{hyperref}
\\usepackage[normalem]{ulem}
\\title{${escapeLatex(title)}}
\\begin{document}
\\maketitle

${jsonToLatex(json)}
\\end{document}
`;
}
