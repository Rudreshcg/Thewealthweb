import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import { XirrCalculationProps} from '@/types/calculations';
import {Cell, Legend, Pie, PieChart, Tooltip} from "recharts";

interface ReportProps {
	report: XirrCalculationProps;
}

const COLORS = ['#5367ff', '#88D66C'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		amountInvested,
		amountAtMaturity,
		timePeriod,
		xirr,
		totalReturn,
	} = report;

	const data = [
		{ name: 'Amount Invested', value: amountInvested },
		{ name: 'Estimated Return', value: amountAtMaturity -amountInvested },
	];
	return (
		<ReportSection>
			<ReportGroup
				header={`Amount Invested ${getCurrencySymbol(currency)}`}
				value={formatCurrency(amountInvested, currency)}
			/>
			<ReportGroup
				header={`Amount At Maturity ${getCurrencySymbol(currency)}`}
				value={formatCurrency(amountAtMaturity, currency)}
			/>
			<ReportGroup
				fullWidth
				header="Duration (Yr)"
				value={`${timePeriod.toFixed(2)} Years`}
			/>

			<ReportDivider/>
			<ReportGroup
				header={`Xirr or Annualised Return %`}
				value={isFinite(xirr) ? formatPercentage(xirr) : 'N/A'}
			/>

			<ReportGroup
				header={`Total Return %`}
				value={isFinite(totalReturn) ? formatPercentage(totalReturn) : 'N/A'}
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
