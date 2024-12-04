import React from 'react';
import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';
import { NavCalculationProps } from '@/types/calculations';

interface ReportProps {
	report: NavCalculationProps;
}

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();

	const {
		totalAssets,
		totalLiabilities,
		sharesOutstanding,
		navPerShare,
	} = report;

	return (
		<ReportSection>
			<ReportGroup
				fullWidth
				header={`Total Assets ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalAssets, currency)}
			/>
			<ReportGroup
				fullWidth
				header={`Total Liabilities ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalLiabilities, currency)}
			/>
			<ReportGroup
				fullWidth
				header="Number of Outstanding Shares"
				value={`${sharesOutstanding}`}
			/>

			<ReportDivider />
			<ReportGroup
				header={`Net Asset Value (NAV) Per Share`}
				value={isFinite(navPerShare) ? formatCurrency(navPerShare, currency) : 'N/A'}
			/>
			<ReportDivider />

			<h3>NAV Summary</h3>
			<p>
				The Net Asset Value (NAV) per share is calculated by subtracting the total liabilities from the total assets
				and dividing the result by the number of outstanding shares. This gives us the value of each share.
			</p>
		</ReportSection>
	);
};

export default Report;
