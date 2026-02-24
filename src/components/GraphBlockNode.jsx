import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { useAppContext } from '../context/AppContext';
import {
    LineChart, ScatterChart, BarChart, AreaChart,
    Line, Scatter, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const SERIES_COLORS = ['#B7684C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function GraphBlockNode(props) {
    const { chartData } = useAppContext();
    const { chartType, xAxisKey, yAxisKey, rowLimit, xAxisLabel, yAxisLabel, legends } = props.node.attrs;

    const plottedData = (chartData || []).slice(0, rowLimit);

    // Determine which data keys to plot as series lines/bars/areas
    const seriesKeys = (() => {
        if (legends && legends.length > 0) return legends;
        if (yAxisKey) return [yAxisKey];
        return [];
    })();

    const renderChart = () => {
        const effectiveXKey = xAxisKey || (plottedData.length > 0 ? Object.keys(plottedData[0])[0] : '');

        if (!effectiveXKey || seriesKeys.length === 0 || plottedData.length === 0) {
            return (
                <div className="flex items-center justify-center p-4 text-center text-gray-400 h-full w-full bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No data available to plot. Import a CSV or add a table first.
                </div>
            );
        }

        const xAxisProps = {
            dataKey: effectiveXKey,
            stroke: '#6B7280',
            fontSize: 12,
            tickLine: false,
            axisLine: false,
            label: xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10, fontSize: 11, fill: '#6B7280', fontWeight: 600 } : undefined,
        };

        const yAxisProps = {
            stroke: '#6B7280',
            fontSize: 12,
            tickLine: false,
            axisLine: false,
            label: yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#6B7280', fontWeight: 600 } : undefined,
        };

        const tooltipProps = {
            contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
        };

        const margin = { top: 20, right: 20, bottom: xAxisLabel ? 35 : 20, left: yAxisLabel ? 35 : 20 };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={plottedData} margin={margin}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        <Tooltip {...tooltipProps} />
                        {seriesKeys.length > 1 && <Legend verticalAlign="top" height={36} />}
                        {seriesKeys.map((key, i) => (
                            <Line key={key} type="monotone" dataKey={key} stroke={SERIES_COLORS[i % SERIES_COLORS.length]} strokeWidth={2.5} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} name={key} />
                        ))}
                    </LineChart>
                );
            case 'scatter':
                return (
                    <ScatterChart data={plottedData} margin={margin}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis {...xAxisProps} />
                        <YAxis dataKey={seriesKeys[0]} {...yAxisProps} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} {...tooltipProps} />
                        {seriesKeys.length > 1 && <Legend verticalAlign="top" height={36} />}
                        {seriesKeys.map((key, i) => (
                            <Scatter key={key} name={key} data={plottedData} fill={SERIES_COLORS[i % SERIES_COLORS.length]} dataKey={key} />
                        ))}
                    </ScatterChart>
                );
            case 'bar':
                return (
                    <BarChart data={plottedData} margin={margin}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        <Tooltip cursor={{ fill: '#F3F4F6' }} {...tooltipProps} />
                        {seriesKeys.length > 1 && <Legend verticalAlign="top" height={36} />}
                        {seriesKeys.map((key, i) => (
                            <Bar key={key} dataKey={key} fill={SERIES_COLORS[i % SERIES_COLORS.length]} radius={[4, 4, 0, 0]} name={key} />
                        ))}
                    </BarChart>
                );
            case 'area':
                return (
                    <AreaChart data={plottedData} margin={margin}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        <Tooltip {...tooltipProps} />
                        {seriesKeys.length > 1 && <Legend verticalAlign="top" height={36} />}
                        {seriesKeys.map((key, i) => (
                            <Area key={key} type="monotone" dataKey={key} stroke={SERIES_COLORS[i % SERIES_COLORS.length]} strokeWidth={2.5} fill={SERIES_COLORS[i % SERIES_COLORS.length]} fillOpacity={0.15} name={key} />
                        ))}
                    </AreaChart>
                );
            default:
                return null;
        }
    };

    return (
        <NodeViewWrapper className="custom-resizable-graph relative group">
            <div className="flex-1 w-full h-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </NodeViewWrapper>
    );
}
