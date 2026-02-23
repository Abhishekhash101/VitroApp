import React, { useState, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { useAppContext } from '../context/AppContext';
import {
    LineChart, ScatterChart, BarChart, AreaChart,
    Line, Scatter, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function GraphBlockNode(props) {
    const { chartData } = useAppContext();
    const { chartType, xAxisKey, yAxisKey, rowLimit } = props.node.attrs;

    const availableColumns = chartData && chartData.length > 0 ? Object.keys(chartData[0] || {}) : [];

    const plottedData = (chartData || []).slice(0, rowLimit);

    const renderChart = () => {
        if (!xAxisKey || !yAxisKey || plottedData.length === 0) {
            return (
                <div className="flex items-center justify-center p-4 text-center text-gray-400 h-full w-full bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No data available to plot. Import a CSV or add a table first.
                </div>
            );
        }

        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={plottedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey={yAxisKey} stroke="#B7684C" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                );
            case 'scatter':
                return (
                    <ScatterChart data={plottedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis dataKey={yAxisKey} stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Scatter name="Data" data={plottedData} fill="#B7684C" />
                    </ScatterChart>
                );
            case 'bar':
                return (
                    <BarChart data={plottedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey={yAxisKey} fill="#B7684C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'area':
                return (
                    <AreaChart data={plottedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey={yAxisKey} stroke="#B7684C" strokeWidth={3} fill="#B7684C" fillOpacity={0.2} />
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
