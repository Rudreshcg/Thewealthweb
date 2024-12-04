import React from 'react';
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol, getDurationLabel } from '@/lib/utils';
import { GoalPlannerSipProps } from "@/types/calculations";

interface ReportProps {
	report: GoalPlannerSipProps;
}

const COLORS = ['#5367ff', '#88D66C'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		targetedWealth,
		investmentFrequency,
		expectedRateOfReturn,
		tenure,
		investmentPerTenure,
	} = report;

	// Generate data for the chart
	const chartData = [];
	let balance = 0;
	const periodicRate = expectedRateOfReturn / (12 / investmentFrequency) / 100;
	const totalPeriods = tenure * investmentFrequency;

	for (let i = 0; i < totalPeriods; i++) {
		balance += investmentPerTenure;
		const interestEarned = balance * periodicRate;
		balance += interestEarned;

		const periodName = investmentFrequency === 12
			? new Date(2023, i).toLocaleString('default', { month: 'short', year: 'numeric' })
			: `Year ${i + 1}`;

		chartData.push({
			period: periodName,
			balance: balance,
		});
	}

	return (
		<ReportSection>
			<ReportGroup
				fullWidth
				header={`Targeted Wealth ${getCurrencySymbol(currency)}`}
				value={formatCurrency(targetedWealth, currency)}
			/>
			<ReportGroup
				header={`Expected Rate of Return %`}
				value={isFinite(expectedRateOfReturn) ? formatPercentage(expectedRateOfReturn) : 'N/A'}
			/>

			<ReportDivider/>

			<ReportGroup
				header={`Investment Per ${investmentFrequency === 1 ? 'Yr' : 'Month'} ${getCurrencySymbol(currency)}`}
				value={formatCurrency(investmentPerTenure, currency)}
			/>

			<ReportDivider/>

			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<ResponsiveContainer width="100%" height={400}>
					<LineChart
						data={chartData}
						margin={{ top: 10, right: 30, left: 15, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="period" />
						<YAxis />
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