import React from 'react';
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { SwpCalculationProps } from '@/types/calculations';

interface ReportProps {
	report: SwpCalculationProps;
}

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		totalInvestment,
		withdrawalPerMonth,
		expectedReturnRate,
		timePeriod,
		totalWithdrawal,
		finalValue,
	} = report;

	// Generate data for the chart
	const chartData = [];
	let balance = totalInvestment;
	const monthlyRate = expectedReturnRate / 12 / 100;
	const totalMonths = timePeriod * 12;
	let totalWithdrawn = 0;

	for (let i = 0; i < totalMonths; i++) {
		if (balance <= 0) break;
		const interestEarned = balance * monthlyRate;
		balance += interestEarned;

		if (balance < withdrawalPerMonth) {
			totalWithdrawn += balance;
			balance = 0;
		} else {
			balance -= withdrawalPerMonth;
			totalWithdrawn += withdrawalPerMonth;
		}

		const monthName = new Date(2023, i).toLocaleString('default', { month: 'short', year: 'numeric' });

		chartData.push({
			month: monthName,
			Balance: Math.max(balance, 0),
			"Total Withdrawal": totalWithdrawn,
		});
	}

	return (
		<ReportSection>
			<ReportGroup
				header={`Total Investment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalInvestment, currency)}
			/>
			<ReportGroup
				header={`Withdrawal Per Month ${getCurrencySymbol(currency)}`}
				value={formatCurrency(withdrawalPerMonth, currency)}
			/>
			<ReportGroup
				header={`Expected Return Rate %`}
				value={isFinite(expectedReturnRate) ? formatPercentage(expectedReturnRate) : 'N/A'}
			/>
			<ReportGroup
				header="Duration (Yr)"
				value={`${timePeriod.toFixed(2)} Years`}
			/>

			<ReportDivider/>

			<ReportGroup
				fullWidth
				header={`Total Withdrawal ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalWithdrawal, currency)}
			/>
			<ReportGroup
				header={`Final Value ${getCurrencySymbol(currency)}`}
				value={formatCurrency(finalValue, currency)}
			/>

			<ReportDivider/>

			<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
				<ResponsiveContainer width="100%" height={400}>
					<LineChart
						data={chartData}
						margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
						<Legend />
						<Line type="monotone" dataKey="Balance" stroke="#8884d8" activeDot={{ r: 8 }} />
						<Line type="monotone" dataKey="Total Withdrawal" stroke="#82ca9d" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</ReportSection>
	);
};

export default Report;