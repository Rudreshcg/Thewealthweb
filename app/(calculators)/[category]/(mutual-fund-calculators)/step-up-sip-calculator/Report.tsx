import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol, getDurationLabel } from '@/lib/utils';
import {StepUpSipCalculationProps} from '@/types/calculations';
import {Cell, Legend, Pie, PieChart, Tooltip} from "recharts";

interface ReportProps {
	report: StepUpSipCalculationProps;
}

const COLORS = ['#5367ff', '#88D66C'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		monthlyInvestment,
		annualStepUp,
		expectedReturnRate,
		timePeriod,
		investedAmount,
		estimatedReturn,
		totalValue
	} = report;

	const data = [
		{ name: 'Invested Amount', value: investedAmount },
		{ name: 'Estimated Return', value: estimatedReturn },
	];
	return (
		<ReportSection>
			<ReportGroup
				header={`Monthly Investment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(monthlyInvestment, currency)}
			/>
			<ReportGroup
				header={`Annual Step-Up %`}
				value={isFinite(annualStepUp) ? formatPercentage(annualStepUp) : 'N/A'}
			/>
			<ReportGroup
				header={`Expected Return Rate %`}
				value={isFinite(expectedReturnRate) ? formatPercentage(expectedReturnRate) : 'N/A'}
			/>
			<ReportGroup
				fullWidth
				header="Duration (Yr)"
				value={`${timePeriod.toFixed(2)} Years`}
			/>

			<ReportDivider/>

			<ReportGroup
				header={`Invested Amount ${getCurrencySymbol(currency)}`}
				value={formatCurrency(investedAmount, currency)}
			/>
			<ReportGroup
				header={`Estimated Return Rate ${getCurrencySymbol(currency)}`}
				value={formatCurrency(estimatedReturn, currency)}
			/>
			<ReportGroup
				header={`Total Value ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalValue, currency)}
			/>
			<ReportDivider/>
			<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
				{/*backgroundColor: '#ECEBDE'}*/}
				<PieChart width={340} height={340}>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={75}
						outerRadius={120}
						fill="#8884d8"
						// paddingAngle={2}
						dataKey="value"
						startAngle={90} // Adjust the start angle
						endAngle={-270} // Adjust the end angle
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
						))}
					</Pie>
					<Tooltip formatter={(value) => formatCurrency(value as number, currency)}/>
					<Legend/>
				</PieChart>
			</div>
		</ReportSection>
);
};

export default Report;
