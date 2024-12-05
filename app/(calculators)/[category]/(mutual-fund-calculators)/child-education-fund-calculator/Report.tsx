import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { ChildEducationFundCalculatorProps } from "@/types/calculations";

interface ReportProps {
	report: ChildEducationFundCalculatorProps;
}

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		currentAgeOfChild,
		ageForHigherEducation,
		expectedAnnualRateOfReturn,
		presentCostOfHigherEducation,
		monthlyInvestmentRequired,
		costOfEducationConsideringInflation,
		yearsHaveToHigherEducation,
	} = report;

	// Generate data for the chart
	const chartData = [];
	let balance = 0;
	const monthlyRateOfReturn = expectedAnnualRateOfReturn / 12 / 100;
	const totalMonths = yearsHaveToHigherEducation * 12;

	for (let month = 1; month <= totalMonths; month++) {
		balance += monthlyInvestmentRequired;
		balance *= 1 + monthlyRateOfReturn;

		chartData.push({
			month: month,
			balance: Math.round(balance),
		});
	}

	return (
		<ReportSection>
			<ReportGroup
				header={`Current Age of Child`}
				value={currentAgeOfChild.toString()}
			/>
			<ReportGroup
				header={`Age for Higher Education`}
				value={ageForHigherEducation.toString()}
			/>
			<ReportGroup
				header={`Expected Annual Rate of Return %`}
				value={isFinite(expectedAnnualRateOfReturn) ? formatPercentage(expectedAnnualRateOfReturn) : 'N/A'}
			/>
			<ReportGroup
				header={`Present Cost of Higher Education ${getCurrencySymbol(currency)}`}
				value={formatCurrency(presentCostOfHigherEducation, currency)}
			/>
			<ReportDivider />

			<ReportGroup
				header={`Monthly Investment Required ${getCurrencySymbol(currency)}`}
				value={formatCurrency(monthlyInvestmentRequired, currency)}
			/>
			<ReportGroup
				fullWidth
				header={`Cost of Education after ${yearsHaveToHigherEducation} years considering inflation ${getCurrencySymbol(currency)}`}
				value={`${formatCurrency(costOfEducationConsideringInflation, currency)} (${(costOfEducationConsideringInflation / 1000).toFixed(2)} Thousands)`}
			/>
			<ReportDivider />

			<h3>Investment Growth Over Time</h3>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={chartData} margin={{ top: 10, right: 30, left: 15, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
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
