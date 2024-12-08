import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { ProfitCalculatorProps } from '@/types/calculations';

interface ReportProps {
    report: ProfitCalculatorProps;
}

const Report = ({ report }: ReportProps) => {
    const { currency } = useCurrencyStore();

    const {
        revenue,
        expenses,
        netProfit,
        netProfitMargin,
        profitPercentage,
    } = report;

    const data = [
        { name: 'Revenue', value: revenue },
        { name: 'Expenses', value: expenses },
        { name: 'Net Profit', value: netProfit },
    ];

    return (
        <ReportSection>
            <ReportGroup
                header={`Revenue ${getCurrencySymbol(currency)}`}
                value={formatCurrency(revenue, currency)}
            />
            <ReportGroup
                header={`Expenses ${getCurrencySymbol(currency)}`}
                value={formatCurrency(expenses, currency)}
            />
            <ReportDivider />

            <ReportGroup
                header={`Net Profit ${getCurrencySymbol(currency)}`}
                value={formatCurrency(netProfit, currency)}
            />
            <ReportGroup
                header={`Net Profit Margin %`}
                value={formatPercentage(netProfitMargin)}
            />
            <ReportGroup
                header={`Profit Percentage %`}
                value={formatPercentage(profitPercentage)}
            />
            <ReportDivider />

            <h3>Profit Analysis</h3>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ReportSection>
    );
};

export default Report;