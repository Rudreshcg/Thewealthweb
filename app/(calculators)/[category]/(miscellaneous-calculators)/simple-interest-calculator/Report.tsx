import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import {formatCurrency, formatPercentage, getCurrencySymbol, getDurationType} from '@/lib/utils';
import { SimpleInterestCalculatorProps } from '@/types/calculations';

interface ReportProps {
    report: SimpleInterestCalculatorProps;
}

const Report = ({ report }: ReportProps) => {
    const { currency } = useCurrencyStore();

    const {
        principalAmount,
        interestRate,
        period,
        periodType,
        interestDurationType,
        simpleInterest,
        totalAmount,
    } = report;

    const data = [
        { name: 'Principal', value: principalAmount },
        { name: 'Simple Interest', value: simpleInterest },
        { name: 'Total Amount', value: totalAmount },
    ];

    return (
        <ReportSection>
            <ReportGroup
                header={`Principal Amount ${getCurrencySymbol(currency)}`}
                value={formatCurrency(principalAmount, currency)}
            />
            <ReportGroup
                header={`Interest Rate %  (${getDurationType(interestDurationType)})`}
                value={formatPercentage(interestRate)}
            />
            <ReportGroup
                header={`Duration (${getDurationType(periodType)})`}
                value={`${period.toString()}`}
            />
            <ReportDivider />

            <ReportGroup
                header={`Simple Interest ${getCurrencySymbol(currency)}`}
                value={formatCurrency(simpleInterest, currency)}
            />
            <ReportGroup
                header={`Total Amount ${getCurrencySymbol(currency)}`}
                value={formatCurrency(totalAmount, currency)}
            />
            <ReportDivider />

            <h3>Simple Interest Analysis</h3>
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