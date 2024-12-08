import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { ROICalculatorProps } from '@/types/calculations';

interface ReportProps {
    report: ROICalculatorProps;
}

const Report = ({ report }: ReportProps) => {
    const { currency } = useCurrencyStore();

    const {
        amountInvested,
        amountReturned,
        investmentPeriodYears,
        gainOrLoss,
        roi,
        simpleAnnualRoi,
        compoundAnnualRoi,
    } = report;

    const data = [
        { name: 'Investment', value: amountInvested },
        { name: 'Return', value: amountReturned },
        { name: 'Gain or Loss', value: gainOrLoss },
    ];

    return (
        <ReportSection>
            <ReportGroup
                header={`Amount Invested ${getCurrencySymbol(currency)}`}
                value={formatCurrency(amountInvested, currency)}
            />
            <ReportGroup
                header={`Amount Returned ${getCurrencySymbol(currency)}`}
                value={formatCurrency(amountReturned, currency)}
            />
            <ReportGroup
                header={`Investment Period (Years)`}
                value={investmentPeriodYears.toString()}
            />
            <ReportDivider />

            <ReportGroup
                header={`Gain or Loss ${getCurrencySymbol(currency)}`}
                value={formatCurrency(gainOrLoss, currency)}
            />
            <ReportGroup
                header={`Return on Investment (ROI) %`}
                value={formatPercentage(roi)}
            />
            <ReportGroup
                header={`Simple Annual ROI %`}
                value={formatPercentage(simpleAnnualRoi)}
            />
            <ReportGroup
                header={`Compound Annual ROI %`}
                value={formatPercentage(compoundAnnualRoi)}
            />
            <ReportDivider />

            <h3>Investment Analysis</h3>
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