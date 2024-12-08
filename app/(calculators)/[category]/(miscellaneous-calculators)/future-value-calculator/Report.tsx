import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import {formatCurrency, getDurationType} from '@/lib/utils';
import { FutureValueCalculatorProps } from '@/types/calculations';

interface ReportProps {
    report: FutureValueCalculatorProps;
}

const COLORS = ['#0088FE', '#00C49F'];

const Report = ({ report }: ReportProps) => {
    const { currency } = useCurrencyStore();

    const {
        initialValue,
        annualContribution,
        interestRate,
        numberOfPeriods,
        compoundFrequency,
        totalPrincipal,
        totalInterest,
        futureValue,
    } = report;

    const data = [
        { name: 'Total Principal', value: totalPrincipal },
        { name: 'Total Interest', value: totalInterest },
    ];

    const barData = [
        { name: 'Initial Value', value: initialValue },
        { name: 'Total Principal', value: totalPrincipal },
        { name: 'Future Value', value: futureValue },
    ];

    return (
        <ReportSection>
            <ReportGroup
                header={`Compound Frequency ${currency}`}
                value={formatCurrency(compoundFrequency, currency)}
            />
            <ReportGroup
                header={`Annual Contribution ${currency}`}
                value={formatCurrency(annualContribution, currency)}
            />
            <ReportGroup
                header={`Interest Rate %`}
                value={formatCurrency(interestRate, currency)}
            />
            <ReportGroup
                header={`Period (Years)`}
                value={formatCurrency(numberOfPeriods, currency)}
            />
            <ReportGroup
                header={`Compound Frequency`}
                value={getDurationType(compoundFrequency)}
            />s
            <ReportDivider/>
            <ReportGroup
                header={`Total Principal ${currency}`}
                value={formatCurrency(totalPrincipal, currency)}
            />
            <ReportGroup
                header={`Total Interest ${currency}`}
                value={formatCurrency(totalInterest, currency)}
            />
            <ReportGroup
                header={`Future Value ${currency}`}
                value={formatCurrency(futureValue, currency)}
            />
            <ReportDivider/>

            <h3>Investment Analysis</h3>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'}}>
                <div style={{width: '100%', maxWidth: '600px'}}>
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
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value as number, currency)}/>
                            <Legend/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{width: '100%', maxWidth: '600px'}}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData} margin={{top: 10, right: 30, left: 15, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis label={{value: 'Value ($)', angle: -90, position: 'insideLeft'}}/>
                            <Tooltip formatter={(value) => formatCurrency(value as number, currency)}/>
                            <Legend/>
                            <Bar dataKey="value" fill="#82ca9d"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </ReportSection>
    );
};

export default Report;
