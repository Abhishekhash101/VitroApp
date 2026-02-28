import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

const COLORS = ['#8B5F54', '#E07A5F', '#3D405B', '#81B29A', '#F2CC8F']; // Brand color palette

export default function GraphBlockNode(props) {
    const { data, type, xAxisKey, seriesKeys, xLabel, yLabel } = props.node.attrs;
    if (!data || data.length === 0) return <NodeViewWrapper>Empty Graph</NodeViewWrapper>;

    const ChartComponent = type === 'line' ? LineChart : BarChart;
    const DataComponent = type === 'line' ? Line : Bar;

    return (
        <NodeViewWrapper className="my-8 p-4 bg-white border border-stone-200 rounded-xl shadow-sm" contentEditable={false}>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartComponent data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey={xAxisKey} tick={{ fill: '#6B7280' }}>
                            {xLabel && <Label value={xLabel} offset={-15} position="insideBottom" fill="#4B5563" fontWeight="bold" />}
                        </XAxis>
                        <YAxis tick={{ fill: '#6B7280' }}>
                            {yLabel && <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#4B5563" fontWeight="bold" />}
                        </YAxis>
                        <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="top" height={36} />
                        {seriesKeys.map((key, index) => (
                            <DataComponent key={key} type="monotone" dataKey={key} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={3} radius={type === 'bar' ? [4, 4, 0, 0] : 0} />
                        ))}
                    </ChartComponent>
                </ResponsiveContainer>
            </div>
        </NodeViewWrapper>
    );
}
