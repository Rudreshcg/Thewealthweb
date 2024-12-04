import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { CagrCalculationProps } from '@/types/calculations';

interface ReportProps {
	report: CagrCalculationProps;
}

const COLORS = ['#5367ff', '#88D66C'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		initialInvestment,
		finalInvestment,
		durationOfInvestment,
		cagr,
	} = report;

	// Generate data for the chart
	const chartData = [];
	const yearlyInvestment = initialInvestment;
	const yearlyGrowthRate = Math.pow(finalInvestment / initialInvestment, 1 / durationOfInvestment);
	let balance = initialInvestment;

	for (let year = 0; year <= durationOfInvestment; year++) {
		chartData.push({
			year: `Year ${year}`,
			balance: balance,
		});
		balance *= yearlyGrowthRate;
	}

	return (
		<ReportSection>
			<ReportGroup
				header={`Initial Investment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(initialInvestment, currency)}
			/>
			<ReportGroup
				header={`Final Investment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(finalInvestment, currency)}
			/>
			<ReportGroup
				fullWidth
				header="Duration of Investment (Yr)"
				value={`${durationOfInvestment.toFixed(2)} Years`}
			/>

			<ReportDivider />
			<ReportGroup
				header={`CAGR %`}
				value={isFinite(cagr) ? formatPercentage(cagr) : 'N/A'}
			/>
			<ReportDivider />

			<h3>Investment Growth Over Time</h3>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<ResponsiveContainer width="100%" height={400}>
					<LineChart
						data={chartData}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
						<YAxis label={{ value: 'Balance (₹)', angle: -90, position: 'insideLeft' }} />
						<Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
						<Legend />
						<Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</ReportSection>
	);
};

export default Report;
