import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol } from '@/lib/utils';
import {RetirmentPlanningCalculationProps} from '@/types/calculations';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";

interface ReportProps {
	report: RetirmentPlanningCalculationProps;
}

const COLORS = ['#5367ff', '#88D66C'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		currentAge,
		desiredRetirementAge,
		lifeExpectancy,
		monthlyIncomeRequiredInRetirementYears,
		expectedInflationRate,
		expectedReturnOnInvestmentPreRetirement,
		expectedReturnOnInvestmentPostRetirement,
		existingRetirementFund,

		AnnualIncomeRequiredImmediatelyAfterRetirement,
		additionalRetirementFundWhichNeedsToBeAccumulatedIs,
		monthlySavingsRequiredToAccumulateTheFundIs
	} = report;

	const data = [
		{ name: 'Annual Income Required', value: AnnualIncomeRequiredImmediatelyAfterRetirement },
		{ name: 'Additional Retirement Fund', value: additionalRetirementFundWhichNeedsToBeAccumulatedIs },
		{ name: 'Monthly Savings Required', value: monthlySavingsRequiredToAccumulateTheFundIs },
	];
	return (
		<ReportSection>

			<ReportGroup
				header="Current Age (Yr)"
				value={`${currentAge.toFixed(2)} Years`}
			/>
			<ReportGroup
				header="Desired Retirement Age (Yr)"
				value={`${desiredRetirementAge.toFixed(2)} Years`}
			/>
			<ReportGroup
				header="Life Expectancy (Yr)"
				value={`${lifeExpectancy.toFixed(2)} Years`}
			/>
			<ReportGroup
				header={`Monthly Income Required In Retirement Years ${getCurrencySymbol(currency)}`}
				value={formatCurrency(monthlyIncomeRequiredInRetirementYears, currency)}
			/>
			<ReportGroup
				header="Expected Inflation Rate %"
				value={isFinite(expectedInflationRate) ? formatPercentage(expectedInflationRate) : 'N/A'}
			/>
			<ReportGroup
				header="Expected Return On Investment Pre-Retirement %"
				value={isFinite(expectedReturnOnInvestmentPreRetirement) ? formatPercentage(expectedReturnOnInvestmentPreRetirement) : 'N/A'}
			/>
			<ReportGroup
				header="Expected Return On Investment Post-Retirement"
				value={isFinite(expectedReturnOnInvestmentPostRetirement) ? formatPercentage(expectedReturnOnInvestmentPostRetirement) : 'N/A'}
			/>
			<ReportGroup
				header={`Existing Retirement Fund ${getCurrencySymbol(currency)}`}
				value={formatCurrency(existingRetirementFund, currency)}
			/>

			<ReportDivider/>
			<ReportGroup
				fullWidth
				header={`Annual Income Required Immediately After Retirement ${getCurrencySymbol(currency)}`}
				value={formatCurrency(AnnualIncomeRequiredImmediatelyAfterRetirement, currency)}
			/>
			<ReportGroup
				fullWidth
				header={`Additional Retirement Fund Which Needs To Be Accumulated ${getCurrencySymbol(currency)}`}
				value={formatCurrency(additionalRetirementFundWhichNeedsToBeAccumulatedIs, currency)}
			/>
			<ReportGroup
				fullWidth
				header={`Monthly Savings Required To Accumulate The Fund ${getCurrencySymbol(currency)}`}
				value={formatCurrency(monthlySavingsRequiredToAccumulateTheFundIs, currency)}
			/>

			<ReportDivider/>
			<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
				<BarChart width={600} height={300} data={data}>
				<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="name"/>
					<YAxis/>
					<Tooltip formatter={(value) => formatCurrency(value as number, currency)}/>
					<Legend/>
					<Bar dataKey="value" fill="#8884d8"/>
			</BarChart></div>
		</ReportSection>
	);
};

export default Report;
