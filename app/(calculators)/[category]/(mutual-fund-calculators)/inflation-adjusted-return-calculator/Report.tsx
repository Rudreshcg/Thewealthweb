import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';
import { InflationAdjustedReturnCalculatorProps } from "@/types/calculations";

interface ReportProps {
	report: InflationAdjustedReturnCalculatorProps;
}

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		investmentAmount,
		inflationRate,
		numberOfYears,
		inflationAdjustedReturn,
		data,
	} = report;

	return (
		<ReportSection>
			<ReportGroup
				header={`Investment Amount ${getCurrencySymbol(currency)}`}
				value={formatCurrency(investmentAmount, currency)}
			/>
			<ReportGroup
				header={`Inflation Rate %`}
				value={formatCurrency(inflationRate, currency)}
			/>
			<ReportGroup
				header={`Number of Years`}
				value={formatCurrency(numberOfYears, currency)}
			/>
			<ReportDivider />

			<ReportGroup
				header={`Inflation Adjusted Return ${getCurrencySymbol(currency)}`}
				value={formatCurrency(inflationAdjustedReturn, currency)}
			/>

			<ReportDivider />

			<h3>Investment Value Over Time</h3>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={data} margin={{ top: 10, right: 30, left: 15, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
						<YAxis label={{ value: 'Value (₹)', angle: -90, position: 'insideLeft' }} />
						<Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
						<Legend />
						<Line type="monotone" dataKey="nominalValue" stroke="#8884d8" name="Nominal Value" />
						<Line type="monotone" dataKey="adjustedValue" stroke="#82ca9d" name="Inflation Adjusted Value" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</ReportSection>
	);
};

export default Report;
