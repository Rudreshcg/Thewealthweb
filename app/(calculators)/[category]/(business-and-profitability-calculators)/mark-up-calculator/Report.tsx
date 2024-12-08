import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { MarkupCalculatorProps } from '@/types/calculations';

interface ReportProps {
    report: MarkupCalculatorProps;
}

const Report = ({ report }: ReportProps) => {
    const { currency } = useCurrencyStore();

    const {
        costPrice,
        sellingPrice,
        markupPrice,
        markupPercentage,
    } = report;

    const data = [
        { name: 'Cost Price', value: costPrice },
        { name: 'Selling Price', value: sellingPrice },
        { name: 'Markup Price', value: markupPrice },
    ];

    return (
        <ReportSection>
            <ReportGroup
                header={`Cost Price ${getCurrencySymbol(currency)}`}
                value={formatCurrency(costPrice, currency)}
            />
            <ReportGroup
                header={`Selling Price ${getCurrencySymbol(currency)}`}
                value={formatCurrency(sellingPrice, currency)}
            />
            <ReportDivider />

            <ReportGroup
                header={`Markup Price ${getCurrencySymbol(currency)}`}
                value={formatCurrency(markupPrice, currency)}
            />
            <ReportGroup
                header={`Markup Percentage %`}
                value={formatPercentage(markupPercentage)}
            />
            <ReportDivider />

            <h3>Markup Analysis</h3>
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