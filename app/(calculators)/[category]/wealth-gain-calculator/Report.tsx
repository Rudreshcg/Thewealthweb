import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import {
	formatCurrency,
	formatPercentage,
	getContributionFrequencyShortLabel,
	getCurrencySymbol, getInvestmentFrequencyShortLabel,
} from '@/lib/utils';
import {LumpsumCalculationProps, WealthGainCalculationProps} from '@/types/calculations';
import {CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis} from "recharts";

interface ReportProps {
	report: WealthGainCalculationProps;
}

const COLORS = ['#5367ff', '#88D66C'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		initialInvestment,
		periodicInvestment,
		investmentFrequency,
		expectedRateOfGrowth,
		timePeriod,
		investedAmount,
		estimatedReturn,
		totalValue
	} = report;

	// For Pie Chart
	const data = [
		{ name: 'Total Invested', value: investedAmount },
		{ name: 'Estimated Return', value: estimatedReturn },
	];

	/*// For Line Chart
	const lineChartData: Array<{ period: number, value: number }> = [];
	const ratePerPeriod = expectedRateOfGrowth / 100 / (12 / investmentFrequency);
	let cumulativeValue = initialInvestment;

	for (let i = 1; i <= timePeriod * (12 / investmentFrequency); i++) {
		cumulativeValue = cumulativeValue * (1 + ratePerPeriod) + periodicInvestment;
		lineChartData.push({ period: i, value: cumulativeValue });
	}*/

	return (
		<ReportSection>
			<ReportGroup
				header={`Initial Investment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(initialInvestment, currency)}
			/>
			<ReportGroup
				header="Periodic Investment"
				value={`${formatCurrency(
					periodicInvestment,
					currency
				)}/${getInvestmentFrequencyShortLabel(investmentFrequency)}`}
			/>
			<ReportGroup
				header={`Expected Rate of Growth %`}
				value={isFinite(expectedRateOfGrowth) ? formatPercentage(expectedRateOfGrowth) : 'N/A'}
			/>
			<ReportGroup
				header="Duration (Yr)"
				value={`${timePeriod.toFixed(2)} Years`}
			/>

			<ReportDivider/>

			<ReportGroup
				header={`Total Invested Amount ${getCurrencySymbol(currency)}`}
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
						startAngle={90}
						endAngle={-270}
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
						))}
					</Pie>
					<Tooltip formatter={(value) => formatCurrency(value as number, currency)}/>
					<Legend/>
				</PieChart>
			</div>

			{/*<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
				<LineChart width={600} height={300} data={lineChartData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="period" label={{ value: 'Periods', position: 'insideBottom', offset: -5 }}/>
					<YAxis label={{value: 'Value', angle: -90, position: 'insideLeft'}}/>
					<Tooltip formatter={(value) => formatCurrency(value as number, currency)}/>
					<Legend/> <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{r: 8}}/>
				</LineChart>
			</div>*/}
		</ReportSection>
	);
};

export default Report;
