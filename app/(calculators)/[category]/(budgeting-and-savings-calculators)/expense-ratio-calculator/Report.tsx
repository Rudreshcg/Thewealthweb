import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { ExpenseRatioCalculatorProps } from '@/types/calculations';

interface ReportProps {
	report: ExpenseRatioCalculatorProps;
}

const COLORS = ['#5367ff', '#88D66C'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		initialInvestment,
		yearlyInvestment,
		durationYrs,
		expectedReturn,
		expenseRatio,
		futureValueOfTotalInvestment,
		totalCostOfETF,
	} = report;

	const data = [
		{ name: 'Future Value of Total Investment', value: futureValueOfTotalInvestment },
		{ name: 'Total Cost of ETF', value: totalCostOfETF },
	];

	return (
		<ReportSection>
			<ReportGroup
				header={`Initial Investment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(initialInvestment, currency)}
			/>
			<ReportGroup
				header={`Yearly Investment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(yearlyInvestment, currency)}
			/>
			<ReportGroup
				header={`Duration (Years)`}
				value={durationYrs.toString()}
			/>
			<ReportGroup
				header={`Expected Return %`}
				value={isFinite(expectedReturn) ? formatPercentage(expectedReturn) : 'N/A'}
			/>
			<ReportGroup
				header={`Expense Ratio %`}
				value={isFinite(expenseRatio) ? formatPercentage(expenseRatio) : 'N/A'}
			/>
			<ReportDivider />

			<ReportGroup
				header={`Future Value of Total Investment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(futureValueOfTotalInvestment, currency)}
			/>
			<ReportGroup
				header={`Total Cost of ETF ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalCostOfETF, currency)}
			/>
			<ReportDivider />

			<h3>Investment and Cost Breakdown</h3>
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
							startAngle={90} // Adjust the start angle
							endAngle={-270} // Adjust the end angle
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