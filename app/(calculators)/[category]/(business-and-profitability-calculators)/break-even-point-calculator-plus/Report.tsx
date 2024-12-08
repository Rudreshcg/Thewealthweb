import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';
import { BreakEvenCalculatorProps } from '@/types/calculations';

interface ReportProps {
    report: BreakEvenCalculatorProps;
}
const Report = ({ report }: ReportProps) => {
    const { currency } = useCurrencyStore();
    const {
        fixedCosts,
        variableCostPerUnit,
        sellingPricePerUnit,
        expectedUnitSales,
        breakEvenUnits,
        totalRevenue,
        totalCosts,
        netProfit,
        monthlyBreakdown,
    } = report;

    return (
        <ReportSection>
            <ReportGroup
                header={`Fixed Costs ${getCurrencySymbol(currency)}`}
                value={formatCurrency(fixedCosts, currency)}
            />
            <ReportGroup
                header={`Variable Cost Per Unit ${getCurrencySymbol(currency)}`}
                value={formatCurrency(variableCostPerUnit, currency)}
            />
            <ReportGroup
                header={`Selling Price Per Unit ${getCurrencySymbol(currency)}`}
                value={formatCurrency(sellingPricePerUnit, currency)}
            />
            <ReportGroup
                header={`Expected Unit Sales`}
                value={expectedUnitSales.toString()}
            />
            <ReportDivider />

            <ReportGroup
                header={`Break Even Units`}
                value={breakEvenUnits.toFixed(2)}
            />
            <ReportGroup
                header={`Total Revenue ${getCurrencySymbol(currency)}`}
                value={formatCurrency(totalRevenue, currency)}
            />
            <ReportGroup
                header={`Total Costs ${getCurrencySymbol(currency)}`}
                value={formatCurrency(totalCosts, currency)}
            />
            <ReportGroup
                header={`Net Profit ${getCurrencySymbol(currency)}`}
                value={formatCurrency(netProfit, currency)}
            />
            <ReportDivider />

            <h3>Break-Even Analysis</h3>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyBreakdown} margin={{ top: 10, right: 30, left: 15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="units" label={{ value: 'Units', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
                        <Legend />
                        <Line type="monotone" dataKey="totalCosts" stroke="#ff7300" name="Total Costs" />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#387908" name="Total Revenue" />
                        <Line type="monotone" dataKey="netProfit" stroke="#8884d8" name="Net Profit" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </ReportSection>
    );
};

export default Report;