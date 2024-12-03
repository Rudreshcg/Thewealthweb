import ReportDivider from '@/components/Report/ReportDivider';
import ReportGroup from '@/components/Report/ReportGroup';
import ReportSection from '@/components/Report/ReportSection';
import useCurrencyStore from '@/hooks/useCurrency';
import { formatCurrency, formatPercentage, getCurrencySymbol, getDurationLabel } from '@/lib/utils';
import { HomeLoanEmiCalculationProps } from '@/types/calculations';
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import React from 'react';
import { FaMinus, FaPlus } from "react-icons/fa";

interface ReportProps {
	report: HomeLoanEmiCalculationProps;
}

const COLORS = ['#5367ff', '#88D66C'];

const Report = ({ report }: ReportProps) => {
	const { currency } = useCurrencyStore();
	const [expandedYear, setExpandedYear] = useState<number | null>(null);
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;  // Adding 1 because getMonth() returns 0-based month index

	const {
		loanAmount,
		rateOfInterest,
		loanTenure,
		tenureType,
		monthlyEmi,
		principalAmount,
		totalInterest,
		totalAmount,
		monthlyBreakdown,
		yearlyBreakdown
	} = report;

	const data = [
		{ name: 'Principal Amount', value: principalAmount },
		{ name: 'Total Interest', value: totalInterest }
	];

	// Calculate totals for the remaining months of the current year
	const currentYearMonthlyData = monthlyBreakdown.filter(m => m.year === 1 && m.month >= currentMonth);
	const currentYearTotals = currentYearMonthlyData.reduce((acc, curr) => {
		acc.principalPaid += curr.principalPaid;
		acc.interestCharged += curr.interestCharged;
		acc.totalPayment += curr.totalPayment;
		acc.balance = curr.balance;  // Update balance to the last month's balance
		return acc;
	}, { principalPaid: 0, interestCharged: 0, totalPayment: 0, balance: 0 });

	return (
		<ReportSection>
			<ReportGroup
				header={`Loan Amount ${getCurrencySymbol(currency)}`}
				value={formatCurrency(loanAmount, currency)}
			/>
			<ReportGroup
				header={`Rate of Interest %`}
				value={isFinite(rateOfInterest) ? formatPercentage(rateOfInterest) : 'N/A'}
			/>
			<ReportGroup
				fullWidth
				header={`Loan Tenure (${getDurationLabel(tenureType)})`}
				value={`${loanTenure.toFixed(2)} `}
			/>
			<ReportDivider/>
			<ReportGroup
				header={`Monthly EMI ${getCurrencySymbol(currency)}`}
				value={formatCurrency(monthlyEmi, currency)}
			/>
			<ReportGroup
				header={`Total Interest ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalInterest, currency)}
			/>
			<ReportGroup
				header={`Total Payment ${getCurrencySymbol(currency)}`}
				value={formatCurrency(totalAmount, currency)}
			/>

			<ReportDivider/>

			<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
				<PieChart width={340} height={340}>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={75}
						outerRadius={120}
						fill="#8884d8"
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

			<ReportDivider/>
			<h3>Yearly Breakdown</h3>
			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Year</TableHead>
							<TableHead>Principal (A)</TableHead>
							<TableHead>Interest (B)</TableHead>
							<TableHead>Total Paid (A+B)</TableHead>
							<TableHead>Balance</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{yearlyBreakdown.map((yearlyData, index) => (
							<React.Fragment key={index}>
								<TableRow
									onClick={() => setExpandedYear(expandedYear === index ? null : index)}
									style={{cursor: 'pointer'}}
								>
									<TableCell>
										{currentYear + yearlyData.year - 1} {expandedYear === index ? <FaMinus/> : <FaPlus/>}
									</TableCell>
									<TableCell>{yearlyData.year === 1 ? formatCurrency(currentYearTotals.principalPaid, currency) : formatCurrency(yearlyData.principalPaid, currency)}</TableCell>
									<TableCell>{yearlyData.year === 1 ? formatCurrency(currentYearTotals.interestCharged, currency) : formatCurrency(yearlyData.interestCharged, currency)}</TableCell>
									<TableCell>{yearlyData.year === 1 ? formatCurrency(currentYearTotals.totalPayment, currency) : formatCurrency(yearlyData.totalPayment, currency)}</TableCell>
									<TableCell>{yearlyData.year === 1 ? formatCurrency(currentYearTotals.balance, currency) : formatCurrency(yearlyData.balance, currency)}</TableCell>
								</TableRow>
								{expandedYear === index && (
									<>
										{monthlyBreakdown.filter(m => m.year === yearlyData.year && (yearlyData.year > 1 || (yearlyData.year === 1 && m.month >= currentMonth))).map((monthlyData, i) => {
											const displayMonth = new Date(currentYear, monthlyData.month - 1).toLocaleString('default', { month: 'short' });

											return (
												<TableRow key={i}>
													<TableCell style={{paddingLeft: '40px'}}>{displayMonth}</TableCell>
													<TableCell>{formatCurrency(monthlyData.principalPaid, currency)}</TableCell>
													<TableCell>{formatCurrency(monthlyData.interestCharged, currency)}</TableCell>
													<TableCell>{formatCurrency(monthlyData.totalPayment, currency)}</TableCell>
													<TableCell>{formatCurrency(monthlyData.balance, currency)}</TableCell>
												</TableRow>
											);
										})}
									</>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</div>
		</ReportSection>
	);
};

export default Report;
