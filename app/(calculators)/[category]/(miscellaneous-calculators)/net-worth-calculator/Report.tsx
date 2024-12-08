import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';
import { NetWorthCalculatorProps } from '@/types/calculations';

interface ReportProps {
    report: NetWorthCalculatorProps;
}

const COLORS = ['#0088FE', '#FFBB28'];

const Report = ({ report }: ReportProps) => {
    const { currency } = useCurrencyStore();

    const {
        totalAssets,
        totalLiabilities,
        netWorth,
    } = report;

    const data = [
        { name: 'Total Assets', value: totalAssets },
        { name: 'Total Liabilities', value: totalLiabilities },
    ];

    const barData = [
        { name: 'Total Assets', value: totalAssets },
        { name: 'Total Liabilities', value: totalLiabilities },
        { name: 'Net Worth', value: netWorth },
    ];

    return (
        <ReportSection>
            <ReportGroup
                header={`Total Assets ${currency}`}
                value={formatCurrency(totalAssets, currency)}
            />
            <ReportGroup
                header={`Total Liabilities ${currency}`}
                value={formatCurrency(totalLiabilities, currency)}
            />
            <ReportGroup
                header={`Net Worth ${currency}`}
                value={formatCurrency(netWorth, currency)}
            />
            <ReportDivider />

            <h3>Net Worth Analysis</h3>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData} margin={{ top: 10, right: 30, left: 15, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </ReportSection>
    );
};

export default Report;
