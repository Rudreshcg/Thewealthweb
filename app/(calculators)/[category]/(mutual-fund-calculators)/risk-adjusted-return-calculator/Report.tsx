import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { RiskAdjustedReturnCalculatorProps } from "@/types/calculations";

interface ReportProps {
	report: RiskAdjustedReturnCalculatorProps;
}

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		investmentAmount,
		expectedReturn,
		riskFreeRate,
		investmentRisk,
		riskAdjustedReturn,
	} = report;

	// Sample data for the bar chart
	const data = [
		{
			name: 'Risk Adjusted Return',
			riskAdjustedReturn: riskAdjustedReturn,
		},
	];

	return (
		<ReportSection>
			<ReportGroup
				header={`Investment Amount ${getCurrencySymbol(currency)}`}
				value={formatCurrency(investmentAmount, currency)}
			/>
			<ReportGroup
				header={`Expected Return %`}
				value={isFinite(expectedReturn) ? formatPercentage(expectedReturn) : 'N/A'}
			/>
			<ReportGroup
				header={`Risk Free Rate %`}
				value={isFinite(riskFreeRate) ? formatPercentage(riskFreeRate) : 'N/A'}
			/>
			<ReportGroup
				header={`Investment Risk %`}
				value={isFinite(investmentRisk) ? formatPercentage(investmentRisk) : 'N/A'}
			/>

			<ReportDivider />

			<ReportGroup
				header={`Risk Adjusted Return %`}
				value={isFinite(riskAdjustedReturn) ? formatPercentage(riskAdjustedReturn) : 'N/A'}
			/>

			<ReportDivider />

			<h3>Risk Adjusted Return</h3>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<ResponsiveContainer width="100%" height={400}>
					<BarChart data={data} margin={{ top: 10, right: 30, left: 15, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis label={{ value: 'Sharpe Ratio', angle: -90, position: 'insideLeft' }} />
						<Tooltip formatter={(value) => formatPercentage(value as number)} />
						<Legend />
						<Bar dataKey="riskAdjustedReturn" fill="#8884d8" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</ReportSection>
	);
};

export default Report;