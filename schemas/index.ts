import { z } from 'zod';

export const calculationNameStringSchema = z
	.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name is has to be a string',
	})
	.trim()
	.min(1, {
		message: 'Name cannot be empty',
	})
	.max(30, {
		message: 'Name cannot be longer than 30 characters',
	});

export const calculationNameFormDataSchema = z.object({
	name: calculationNameStringSchema,
});

const numberFieldSchema = (fieldName = 'Number') => {
	return z.coerce.number({
		required_error: `${fieldName} is required`,
		invalid_type_error: `${fieldName} has to be a number`,
	});
};

const booleanValidation = (fieldName = 'Boolean') => {
	return z.coerce.boolean({
		required_error: `${fieldName} is required`,
	});
};

const positiveNumberFieldSchema = (fieldName = 'Number') => {
	return z.coerce
		.number({
			required_error: `${fieldName} is required`,
			invalid_type_error: `${fieldName} has to be a number`,
		})
		.min(0, {
			message: `${fieldName} cannot be negative`,
		});
};

const positiveIntegerFieldSchema = (fieldName = 'Number') => {
	return z.coerce
		.number({
			required_error: `${fieldName} is required`,
			invalid_type_error: `${fieldName} has to be a number`,
		})
		.int()
		.min(0, {
			message: `${fieldName} cannot be negative`,
		});
};

const positiveNumberFieldSchemaWithMax = (fieldName = 'Number', max: number) => {
	return positiveNumberFieldSchema(fieldName).max(max, {
		message: `${fieldName} cannot be greater than ${max}`,
	});
};

const positiveNumberFieldSchemaWithMaxAndMin = (fieldName = 'Number', min: number, max: number) => {
	return positiveNumberFieldSchema(fieldName).max(max, {
		message: `${fieldName} cannot be greater than ${max}`,
	})
		.min(min, {message: `${fieldName} cannot be smaller than ${min}`});
};

export const markupFormDataSchema = z.object({
	cost: positiveNumberFieldSchema('Cost'),
	salesPrice: positiveNumberFieldSchema('Sales price'),
});

export const breakEvenPointFormDataSchema = z.object({
	fixedCosts: positiveNumberFieldSchema('Fixed costs'),
	variableCostPerUnit: positiveNumberFieldSchema('Variable cost per unit'),
	pricePerUnit: positiveNumberFieldSchema('Price per unit'),
});

export const investmentTimeFormDataSchema = z
	.object({
		startingBalance: positiveNumberFieldSchema('Initial value'),
		endingBalance: positiveNumberFieldSchema('Ending value'),
		annualInterestRate: positiveNumberFieldSchema('Annual interest rate'),
	})
	.superRefine((data, ctx) => {
		if (
			data.startingBalance >= data.endingBalance &&
			data.endingBalance > 0 &&
			data.startingBalance > 0
		) {
			ctx.addIssue({
				message: 'Future value must be greater than starting value',
				code: z.ZodIssueCode.custom,
				path: ['endingBalance'],
			});
			ctx.addIssue({
				message: 'Starting value must be less than future value',
				code: z.ZodIssueCode.custom,
				path: ['startingBalance'],
			});
		}
	});

export const presentValueFormDataSchema = z.object({
	startingBalance: positiveNumberFieldSchema('Future value'),
	duration: positiveNumberFieldSchemaWithMax('Duration', 200),
	durationMultiplier: positiveNumberFieldSchema('Duration multiplier'),
	discountRate: positiveNumberFieldSchema('Discount rate'),
});

export const annualizedReturnFormDataSchema = z.object({
	startingBalance: positiveNumberFieldSchema('Initial value'),
	endingBalance: positiveNumberFieldSchema('Ending value'),
	duration: positiveNumberFieldSchemaWithMax('Duration', 200),
	durationMultiplier: positiveNumberFieldSchema('Duration multiplier'),
});

export const compoundInterestFormDataSchema = z.object({
	startingBalance: positiveNumberFieldSchema('Initial value'),
	contribution: positiveNumberFieldSchema('Contributions'),
	contributionMultiplier: z.coerce
		.number({
			required_error: 'Contribution multiplier is required',
			invalid_type_error: 'Contribution multiplier has to be a number',
		})
		.min(-1, {
			message: `Contribution multiplier must be either -1 or 1`,
		})
		.max(1, {
			message: `Contribution multiplier must be either -1 or 1`,
		})
		.superRefine((value, ctx) => {
			if (value === 0) {
				ctx.addIssue({
					message: 'Contribution multiplier must be either -1 or 1',
					code: z.ZodIssueCode.custom,
					path: ['contributionMultiplier'],
				});
			}
		}),
	contributionFrequency: positiveNumberFieldSchema('Contribution frequency'),
	interestRate: positiveNumberFieldSchema('Interest rate'),
	compoundFrequency: positiveNumberFieldSchema('Compound frequency'),
	duration: positiveNumberFieldSchemaWithMax('Duration', 200),
	durationMultiplier: positiveNumberFieldSchema('Duration multiplier'),
});

export const eventProbabilityFormDataSchema = z.object({
	eventProbabilityPercent: positiveNumberFieldSchema('Event probability').max(100, {
		message: 'Event probability cannot be greater than 100',
	}),
	eventTries: positiveIntegerFieldSchema('Event tries'),
});

export const priceToEarningsRatioFormDataSchema = z.object({
	sharePrice: positiveNumberFieldSchema('Share price'),
	earningsPerShare: numberFieldSchema('Earnings per share'),
});

export const dollarCostAverageFormDataSchema = z.object({
	initialInvestment: positiveNumberFieldSchema('Initial investment'),
	sharePrice: positiveNumberFieldSchema('Share price'),
	deposit: positiveNumberFieldSchema('Deposit'),
	depositFrequency: positiveNumberFieldSchema('Deposit frequency'),
	interestRate: positiveNumberFieldSchema('Interest rate'),
	compoundFrequency: positiveNumberFieldSchema('Compound frequency'),
	duration: positiveNumberFieldSchema('Duration'),
	durationMultiplier: positiveNumberFieldSchema('Duration multiplier'),
});

export const enterpriseValueFormDataSchema = z.object({
	sharePrice: positiveNumberFieldSchema('Share price'),
	sharesOutstanding: positiveIntegerFieldSchema('Shares outstanding'),
	cash: positiveNumberFieldSchema('Cash'),
	debt: positiveNumberFieldSchema('Debt'),
});

export const sipCalculationFormDataScheme = z.object({
	monthlyInvestment: positiveNumberFieldSchemaWithMaxAndMin('Monthly Investment', 100, 10000000),
	expectedReturnRate: positiveNumberFieldSchemaWithMaxAndMin('Expected Return Rate', 1, 30),
	timePeriod: positiveNumberFieldSchemaWithMaxAndMin('Time Period', 1, 40),
});

export const lumpsumCalculationFormDataScheme = z.object({
	totalInvestment: positiveNumberFieldSchemaWithMaxAndMin('Monthly Investment', 500, 10000000),
	expectedReturnRate: positiveNumberFieldSchemaWithMaxAndMin('Expected Return Rate', 1, 30),
	timePeriod: positiveNumberFieldSchemaWithMaxAndMin('Time Period', 1, 40),
});

export const stepUpSipCalculationFormDataScheme = z.object({
	monthlyInvestment: positiveNumberFieldSchemaWithMaxAndMin('Monthly Investment', 100, 10000000),
	annualStepUp: positiveNumberFieldSchemaWithMaxAndMin('Annual Step Up', 1, 50),
	expectedReturnRate: positiveNumberFieldSchemaWithMaxAndMin('Expected Return Rate', 1, 30),
	timePeriod: positiveNumberFieldSchemaWithMaxAndMin('Time Period', 1, 40),
});

export const xirrCalculationFormDataScheme = z.object({
	amountInvested: positiveNumberFieldSchemaWithMaxAndMin('Amount Invested', 100, 10000000000),
	amountAtMaturity: positiveNumberFieldSchemaWithMaxAndMin('Amount Invested', 100, 10000000000),
	timePeriod: positiveNumberFieldSchemaWithMaxAndMin('Time Period', 1, 40),
});

export const retirmentPlanningCalculationFormDataScheme = z.object({
	currentAge: positiveNumberFieldSchemaWithMaxAndMin("Current Age", 15, 60),
	desiredRetirementAge: positiveNumberFieldSchemaWithMaxAndMin("desiredRetirementAge", 15, 70),
	lifeExpectancy: positiveNumberFieldSchemaWithMaxAndMin("Life Expectancy", 30, 100),
	monthlyIncomeRequiredInRetirementYears: positiveNumberFieldSchemaWithMaxAndMin("Monthly Income Required In Retirement Years", 1, 1000000000),
	expectedInflationRate: positiveNumberFieldSchemaWithMaxAndMin("Expected Inflation Rate", 3, 15),
	expectedReturnOnInvestmentPreRetirement: positiveNumberFieldSchemaWithMaxAndMin("Expected Return On Investment Pre-Retirement", 1, 30),
	expectedReturnOnInvestmentPostRetirement: positiveNumberFieldSchemaWithMaxAndMin("Expected Return On Investment Post-Retirement", 1, 30),
	existingRetirementFund: positiveNumberFieldSchemaWithMaxAndMin("Expected Return On Investment Post-Retirement", 0, 10000000000),
});

export const wealthGainCalculationFormDataScheme = z.object({
	initialInvestment:positiveNumberFieldSchemaWithMaxAndMin("Initial Investment", 0, 10000000000),
	periodicInvestment: positiveNumberFieldSchemaWithMaxAndMin("Periodic Investment", 0, 100000000),
	investmentFrequency: positiveNumberFieldSchema('Investment frequency'),
	expectedRateOfGrowth: positiveNumberFieldSchemaWithMaxAndMin("Expected Rate Of Growth", 1, 30),
	timePeriod: positiveNumberFieldSchemaWithMaxAndMin("Time Period", 1, 40),
});

export const recurringDepositCalculationFormDataScheme = z.object({
	monthlyInvestment: positiveNumberFieldSchemaWithMaxAndMin('Monthly Investment', 100, 10000000),
	rateOfInterest: positiveNumberFieldSchemaWithMaxAndMin('Expected Return Rate', 1, 30),
	duration: positiveNumberFieldSchemaWithMaxAndMin('Time Period', 1, 25),
	durationType: positiveNumberFieldSchema('Investment frequency'),
});

export const fixedDepositCalculationFormDataScheme = z.object({
	totalInvestment: positiveNumberFieldSchemaWithMaxAndMin('Monthly Investment', 5000, 100000000),
	rateOfInterest: positiveNumberFieldSchemaWithMaxAndMin('Expected Return Rate', 1, 30),
	duration: positiveNumberFieldSchemaWithMaxAndMin('Time Period', 1, 25),
	durationType: positiveNumberFieldSchema('Investment frequency'),
});

export const ppfCalculationFormDataScheme = z.object({
	yearlyInvestment: positiveNumberFieldSchemaWithMaxAndMin('Monthly Investment', 500, 200000),
	timePeriod: positiveNumberFieldSchemaWithMaxAndMin('Time Period', 15, 50),
	RateOfInterest: positiveNumberFieldSchemaWithMaxAndMin('Expected Return Rate', 7.1, 7.1),
});

export const homeLoanEmiCalculationFormDataScheme = z.object({
	loanAmount: positiveNumberFieldSchemaWithMaxAndMin('Loan Amount', 100000, 100000000),
	rateOfInterest: positiveNumberFieldSchemaWithMaxAndMin('Rate of Interest', 1, 20),
	loanTenure: positiveNumberFieldSchemaWithMaxAndMin('Load Tenure', 1, 30),
	tenureType: positiveNumberFieldSchema('tenureType'),

});

export const personalLoanEmiCalculationFormDataScheme = z.object({
	loanAmount: positiveNumberFieldSchemaWithMaxAndMin('Loan Amount', 100000, 100000000),
	rateOfInterest: positiveNumberFieldSchemaWithMaxAndMin('Rate of Interest', 1, 20),
	loanTenure: positiveNumberFieldSchemaWithMaxAndMin('Load Tenure', 1, 30),
	tenureType: positiveNumberFieldSchema('Tenure Type'),

});

export const swpCalculationFormDataScheme = z.object({
	totalInvestment: positiveNumberFieldSchemaWithMaxAndMin('Total Investment', 10000, 10000000),
	withdrawalPerMonth: positiveNumberFieldSchemaWithMaxAndMin('Withdrawal Per Month', 500, 1000000),
	expectedReturnRate: positiveNumberFieldSchemaWithMaxAndMin('Expected Return Rate', 1, 30),
	timePeriod: positiveNumberFieldSchemaWithMaxAndMin('Time Period', 1, 30),
});

export const goalPlannerSipFormDataScheme = z.object({
	targetedWealth: positiveNumberFieldSchemaWithMaxAndMin('Targeted Wealth', 1000, 1000000000000),
	investmentFrequency: positiveNumberFieldSchema('Investment frequency'),
	expectedRateOfReturn: positiveNumberFieldSchemaWithMaxAndMin('Expected Return Rate', 1, 30),
	tenure: positiveNumberFieldSchemaWithMaxAndMin('Tenure in Year', 1, 30),
});

export const cagrCalculationFormDataScheme = z.object({
	initialInvestment: positiveNumberFieldSchemaWithMaxAndMin('Initial Investment', 1000, 10000000),
	finalInvestment: positiveNumberFieldSchemaWithMaxAndMin('Final Investment', 1000, 10000000),
	durationOfInvestment: positiveNumberFieldSchemaWithMaxAndMin('Duration of Investment', 1, 40),
});

export const navCalculationFormDataScheme = z.object({
	totalAssets: positiveNumberFieldSchemaWithMaxAndMin('Total Assets', 1, 10000000),
	totalLiabilities: positiveNumberFieldSchemaWithMaxAndMin('Total Liabilities', 1, 10000000),
	sharesOutstanding: positiveNumberFieldSchemaWithMaxAndMin('Shares Outstanding', 1, 10000000),
});

export const sipDelayCalculatorFormDataScheme = z.object({
	monthlySipAmount: positiveNumberFieldSchemaWithMaxAndMin('Monthly Sip Amount', 1000, 100000),
	sipPeriodInYear: positiveNumberFieldSchemaWithMaxAndMin('Sip Period in Year', 1, 40),
	expectedReturnsOnInvestment: positiveNumberFieldSchemaWithMaxAndMin('expected Returns on Investment', 5, 20),
	periodOfDelayMonth: positiveNumberFieldSchemaWithMaxAndMin('Period of Delay Month', 1, 40),
});

export const riskAdjustedReturnCalculatorFormDataScheme = z.object({
	investmentAmount: positiveNumberFieldSchemaWithMaxAndMin('Investment Amount', 1000, 1000000000),
	expectedReturn: positiveNumberFieldSchemaWithMaxAndMin('Expected Return', 1, 40),
	riskFreeRate: positiveNumberFieldSchemaWithMaxAndMin('Risk Free Rate', 1, 40),
	investmentRisk: positiveNumberFieldSchemaWithMaxAndMin('Investment Risk', 1, 40),
});

export const inflationAdjustedReturnCalculatorFormDataScheme = z.object({
	investmentAmount: positiveNumberFieldSchemaWithMaxAndMin('Investment Amount', 1000, 1000000000),
	inflationRate: positiveNumberFieldSchemaWithMaxAndMin('Inflation Rate', 1, 40),
	numberOfYears: positiveNumberFieldSchemaWithMaxAndMin('Number of Years', 1, 40),
});

export const childEducationFundCalculatorFormDataScheme = z.object({
	currentAgeOfChild: positiveNumberFieldSchemaWithMaxAndMin('Inflation Rate', 0, 17),
	ageForHigherEducation: positiveNumberFieldSchemaWithMaxAndMin('Inflation Rate', 18, 57),
	expectedAnnualRateOfReturn: positiveNumberFieldSchemaWithMaxAndMin('Inflation Rate', 1, 40),
	presentCostOfHigherEducation: positiveNumberFieldSchemaWithMaxAndMin('Investment Amount', 1000, 10000000),
});

export const monthlyBudgetCalculatorFormDataScheme = z.object({
	monthlyIncome: positiveNumberFieldSchemaWithMaxAndMin('Monthly Income', 1000, 10000000),
	housingExpenses: positiveNumberFieldSchema('Housing Expenses'),
	utilitiesExpenses: positiveNumberFieldSchema('Utilities Expenses'),
	groceriesExpenses: positiveNumberFieldSchema('Groceries Expenses'),
	transportationExpenses: positiveNumberFieldSchema('Transportation Expenses'),
	otherExpenses: positiveNumberFieldSchema('Other Expenses'),
});

export const emergencyFundCalculatorFormDataScheme = z.object({
	averageMonthlyExpenses: positiveNumberFieldSchemaWithMaxAndMin('Average Monthly Expenses', 1000, 10000000),
	monthsOfSavingsDesired: positiveNumberFieldSchemaWithMaxAndMin('Months of Savings Desired', 1, 100),
});


export const expenseRatioCalculatorFormDataScheme = z.object({
	initialInvestment: positiveNumberFieldSchemaWithMaxAndMin('Initial Investment', 1000, 10000000),
	yearlyInvestment: positiveNumberFieldSchemaWithMaxAndMin('Yearly Investment', 1000, 10000000),
	durationYrs: positiveNumberFieldSchemaWithMaxAndMin('Duration Yrs', 1, 40),
	expectedReturn: positiveNumberFieldSchemaWithMaxAndMin('Expected Return', 1, 30),
	expenseRatio: positiveNumberFieldSchemaWithMaxAndMin('Expense Ratio', 0, 10),
});
export const breakEvenCalculatorFormDataScheme = z.object({

	fixedCosts: positiveNumberFieldSchemaWithMaxAndMin('Fixed Costs', 1000, 10000000),
	variableCostPerUnit: positiveNumberFieldSchemaWithMaxAndMin('Variable Cost per Unit', 1, 10000000),
	sellingPricePerUnit: positiveNumberFieldSchemaWithMaxAndMin('Selling Price per Unit', 1, 10000000),
	expectedUnitSales: positiveNumberFieldSchemaWithMaxAndMin('Expected Unit Sales', 1, 10000000),
});

export const rOICalculatorFormDataScheme = z.object({

	amountInvested: positiveNumberFieldSchemaWithMaxAndMin('Amount Invested', 1000, 10000000),
	amountReturned: positiveNumberFieldSchemaWithMaxAndMin('Amount Returned', 1000, 10000000),
	investmentPeriodYears: positiveNumberFieldSchemaWithMaxAndMin('Investment Period Years', 1, 40),
});

export const profitCalculatorFormDataScheme = z.object({

	revenue: positiveNumberFieldSchemaWithMaxAndMin('Revenue', 1, 1000000000),
	expenses: positiveNumberFieldSchemaWithMaxAndMin('Expenses', 1, 1000000000),
});

export const markUpCalculatorFormDataScheme = z.object({

	costPrice: positiveNumberFieldSchemaWithMaxAndMin('Cost Price', 1, 1000000000),
	sellingPrice: positiveNumberFieldSchemaWithMaxAndMin('Selling Price', 1, 1000000000),
});

export const simpleInterestCalculatorFormDataScheme = z.object({
	principalAmount: positiveNumberFieldSchemaWithMaxAndMin('Principal Amount', 1, 1000000000),
	interestRate: positiveNumberFieldSchemaWithMaxAndMin('Interest Rate', 1, 40),
	period: positiveNumberFieldSchemaWithMaxAndMin('period', 1, 40),
	periodType:positiveNumberFieldSchema('Period type'),
	interestDurationType: positiveNumberFieldSchema('Interest Duration type'),
});

export const futureValueCalculatorFormDataScheme = z.object({

	initialValue: positiveNumberFieldSchemaWithMaxAndMin('Initial Value', 1, 1000000000),
	annualContribution: positiveNumberFieldSchemaWithMaxAndMin('Annual Contribution', 1, 1000000000),
	interestRate: positiveNumberFieldSchemaWithMaxAndMin('Interest Rate', 1, 40),
	numberOfPeriods: positiveNumberFieldSchemaWithMaxAndMin('Period', 1, 40),
	compoundFrequency: positiveNumberFieldSchema('Compound Frequency'),
});

export const netWorthCalculatorFormDataScheme = z.object({

	primaryIncome: positiveNumberFieldSchemaWithMaxAndMin('Primary Income', 0, 1000000000),
	realEstateIncome: positiveNumberFieldSchemaWithMaxAndMin('Real Estate Income', 0, 1000000000),
    sharesInvestments: positiveNumberFieldSchemaWithMaxAndMin('Shares Investments', 0, 1000000000),
    vehicleAssets: positiveNumberFieldSchemaWithMaxAndMin('Vehicle Assets', 0, 1000000000),
    otherAssets: positiveNumberFieldSchemaWithMaxAndMin('Other Assets', 0, 1000000000),
	savingsAccounts: positiveNumberFieldSchemaWithMaxAndMin('Savings Accounts', 0, 1000000000),
    otherInvestments: positiveNumberFieldSchemaWithMaxAndMin('Other Investments', 0, 1000000000),
    cashEquivalents: positiveNumberFieldSchemaWithMaxAndMin('Cash Equivalents', 0, 1000000000),
    providentFund: positiveNumberFieldSchemaWithMaxAndMin('Provident Fund', 0, 1000000000),
    insurancePolicies: positiveNumberFieldSchemaWithMaxAndMin('Insurance Policies', 0, 1000000000),
    homeLoan: positiveNumberFieldSchemaWithMaxAndMin('Home Loan', 0, 1000000000),
    carLoan: positiveNumberFieldSchemaWithMaxAndMin('Car Loan', 0, 1000000000),
    personalLoan: positiveNumberFieldSchemaWithMaxAndMin('Personal Loan', 0, 1000000000),
    studentLoan: positiveNumberFieldSchemaWithMaxAndMin('Loan Against Property', 0, 1000000000),
    loanAgainstProperty: positiveNumberFieldSchemaWithMaxAndMin('Credit Card Debt', 0, 1000000000),
    creditCardDebt: positiveNumberFieldSchemaWithMaxAndMin('Initial Value', 0, 1000000000),
    otherDebts: positiveNumberFieldSchemaWithMaxAndMin('Other Debts', 0, 1000000000),
    emis: positiveNumberFieldSchemaWithMaxAndMin('EMIs', 0, 1000000000),
});
