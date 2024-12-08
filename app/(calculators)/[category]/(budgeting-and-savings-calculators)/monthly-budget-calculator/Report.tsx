import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';
import { MonthlyBudgetCalculatorProps } from '@/types/calculations';

interface ReportProps {
	report: MonthlyBudgetCalculatorProps;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		monthlyIncome,
		housingExpenses,
		utilitiesExpenses,
		groceriesExpenses,
		transportationExpenses,
		otherExpenses,
		totalMonthlyExpenses,
		remainingBudget,
	} = report;

	const data = [
		{ name: 'Housing', value: housingExpenses },
		{ name: 'Utilities', value: utilitiesExpenses },
		{ name: 'Groceries', value: groceriesExpenses },
		{ name: 'Transportation', value: transportationExpenses },
		{ name: 'Other', value: otherExpenses }
	];

	return (
		<ReportSection>

			<ReportDivider />

			<ReportGroup
				fullWidth
				header={`Monthly Income ${getCurrencySymbol(currency)}`}
				value={formatCurrency(monthlyIncome, currency)}
			/>
			<ReportGroup
				header={`Housing Expenses ${getCurrencySymbol(currency)}`}
				value={formatCurrency(housingExpenses, currency)}
			/>
			<ReportGroup
				header={`Utilities Expenses ${getCurrencySymbol(currency)}`}
				value={formatCurrency(utilitiesExpenses, currency)}
			/>
			<ReportGroup
				header={`Groceries Expenses ${getCurrencySymbol(currency)}`}
				value={formatCurrency(groceriesExpenses, currency)}
			/>
			<ReportGroup
				header={`Transportation Expenses ${getCurrencySymbol(currency)}`}
				value={formatCurrency(transportationExpenses, currency)}
			/>
			<ReportGroup
				header={`Other Expenses ${getCurrencySymbol(currency)}`}
				value={formatCurrency(otherExpenses, currency)}
			/>

			<ReportDivider />

			<ReportGroup
				header={`Total Monthly Expenses ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalMonthlyExpenses, currency)}
			/>
			<ReportGroup
				header={`Remaining Budget ${getCurrencySymbol(currency)}`}
				value={formatCurrency(remainingBudget, currency)}
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