import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { SipDelayCalculatorProps } from "@/types/calculations";

interface ReportProps {
	report: SipDelayCalculatorProps;
}

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		monthlySipAmount,
		sipPeriodInYear,
		expectedReturnsOnInvestment,
		periodOfDelayMonth,
		withoutDelay,
		costOfDelay,
		projectedValue,
		sipAmountWithDelay,
		totalAmountWithDelay,
		chartData
	} = report;

	return (
		<ReportSection>
			<ReportGroup
				header={`Monthly SIP Amount ${getCurrencySymbol(currency)}`}
				value={formatCurrency(monthlySipAmount, currency)}
			/>
			<ReportGroup
				header={`SIP Period in Years`}
				value={`${sipPeriodInYear} Years`}
			/>

			<ReportGroup
				header={`Expected Returns on Investment %`}
				value={isFinite(expectedReturnsOnInvestment) ? formatPercentage(expectedReturnsOnInvestment) : 'N/A'}
			/>
			<ReportGroup
				header={`Period of Delay (Months)`}
				value={`${periodOfDelayMonth} Months`}
			/>
			<ReportDivider />

			<ReportGroup
				header={`Without Delay ${getCurrencySymbol(currency)}`}
				value={formatCurrency(withoutDelay, currency)}
			/>
			<ReportGroup
				header={`Cost of Delay ${getCurrencySymbol(currency)}`}
				value={formatCurrency(costOfDelay, currency)}
			/>
			<ReportGroup
				header={`Projected Value (Original SIP) ${getCurrencySymbol(currency)}`}
				value={formatCurrency(projectedValue, currency)}
			/>
			<ReportGroup
				header={`Increased SIP Amount To Cover The Delay ${getCurrencySymbol(currency)}`}
				value={formatCurrency(sipAmountWithDelay, currency)}
			/>
			<ReportGroup
				header={`Total Amount with Delay (Adjusted SIP) ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalAmountWithDelay, currency)}
			/>

			<ReportDivider />

			<h3>Investment Growth Over Time</h3>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<ResponsiveContainer width="100%" height={400}>
					<LineChart
						data={chartData}
						margin={{ top: 10, right: 30, left: 15, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
						<YAxis label={{ value: 'Balance (₹)', angle: -90, position: 'insideLeft' }} />
						<Tooltip formatter={(value) => formatCurrency(value as number, currency)} />
						<Legend />
						<Line type="monotone" dataKey="withoutDelay" stroke="#8884d8" activeDot={{ r: 8 }} name="Without Delay" />
						<Line type="monotone" dataKey="withDelay" stroke="#82ca9d" activeDot={{ r: 8 }} name="With Delay (Adjusted SIP)" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</ReportSection>
	);
};

export default Report;