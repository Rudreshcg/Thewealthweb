import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';
import { EmergencyFundCalculatorProps } from '@/types/calculations';

interface ReportProps {
	report: EmergencyFundCalculatorProps;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		averageMonthlyExpenses,
		monthsOfSavingsDesired,
		emergencyFund,
	} = report;

	const data = [
		{ name: 'Housing', value: averageMonthlyExpenses * 0.30 }, // Example percentages
		{ name: 'Utilities', value: averageMonthlyExpenses * 0.10 },
		{ name: 'Groceries', value: averageMonthlyExpenses * 0.20 },
		{ name: 'Transportation', value: averageMonthlyExpenses * 0.15 },
		{ name: 'Other', value: averageMonthlyExpenses * 0.25 }
	];

	return (
		<ReportSection>

			<ReportDivider />

			<ReportGroup
				header={`Average Monthly Expenses ${getCurrencySymbol(currency)}`}
				value={formatCurrency(averageMonthlyExpenses, currency)}
			/>
			<ReportGroup
				header={`Months of Savings Desired`}
				value={monthsOfSavingsDesired.toString()}
			/>
			<ReportDivider />
			<ReportGroup
				header={`Emergency Fund Required ${getCurrencySymbol(currency)}`}
				value={formatCurrency(emergencyFund, currency)}
			/>

			<ReportDivider />

			<h3>Monthly Expenses Breakdown</h3>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<ResponsiveContainer width="100%" height={400}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={75}
							outerRadius={120}
							fill="#8884d8"
							dataKey="value"
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</ReportSection>
	);
};

export default Report;
