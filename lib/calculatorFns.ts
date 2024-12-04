import {
	AnnualizedReturnReportProps,
	BreakEvenPointReportProps,
	CompoundInterestReportProps,
	DollarCostAverageReportProps,
	EnterpriseValueReportProps,
	EventProbabilityReportProps,
	IAnnualizedReturnFormData,
	IBreakEvenPointFormData,
	ICompoundInterestFormData,
	IDollarCostAverageFormData,
	IEnterpriseValueFormData,
	IEventProbabilityFormData,
	IInvestmentTimeFormData,
	IMarkupFormData,
	IPresentValueFormData,
	IPriceToEarningsRatioFormData,
	InvestmentTimeReportProps,
	MarkupReportProps,
	PresentValueReportProps,
	PriceToEarningsRatioReportProps,
	ISipCalculationFormData,
	SipCalculationProps,
	LumpsumCalculationProps,
	ILumpsumCalculationFormData,
	IStepUpSipCalculationFormData,
	StepUpSipCalculationProps,
	XirrCalculationProps,
	IXirrCalculationFormData,
	IRetirmentPlanningCalculationFormData,
	RetirmentPlanningCalculationProps,
	IWealthGainCalculationFormData,
	WealthGainCalculationProps,
	IRecurringDepositCalculationFormData,
	RecurringDepositCalculationProps,
	IFixedDepositCalculationFormData,
	FixedDepositCalculationProps,
	IPpfCalculationFormData,
	PpfCalculationProps,
	IHomeLoanEmiCalculationFormData,
	HomeLoanEmiCalculationProps,
	SwpCalculationProps,
	ISwpCalculationFormData,
	IGoalPlannerSipFormData,
	GoalPlannerSipProps,
	ICagrCalculationFormData, CagrCalculationProps, INavCalculationFormData, NavCalculationProps,
} from '@/types/calculations';

export const calculateMarkup = (formData: IMarkupFormData): MarkupReportProps => {
	const { cost, salesPrice } = formData;

	const profit = salesPrice - cost;
	const markup = (profit / cost) * 100;

	return { cost, salesPrice, profit, markup };
};

export const calculateAnnualizedReturn = (
	formData: IAnnualizedReturnFormData
): AnnualizedReturnReportProps => {
	const { startingBalance, endingBalance, duration, durationMultiplier } = formData;

	// Time in years
	const t = (duration * durationMultiplier) / 12;
	const annualizedReturn = ((endingBalance / startingBalance) ** (1 / t) - 1) * 100;
	const percentReturn = ((endingBalance - startingBalance) / startingBalance) * 100;

	return {
		startingBalance,
		endingBalance,
		duration,
		durationMultiplier,
		annualizedReturn,
		percentReturn,
	};
};

export const calcualteBreakEvenPoint = (
	formData: IBreakEvenPointFormData
): BreakEvenPointReportProps => {
	const { fixedCosts, variableCostPerUnit, pricePerUnit } = formData;

	// BEP = Fixed costs / (Sales price per unit – Variable cost per unit)
	const BEP = fixedCosts / (pricePerUnit - variableCostPerUnit);
	// Break even point in currency
	const BEPM = BEP * pricePerUnit;

	// Contribution margin
	const CM = pricePerUnit - variableCostPerUnit;
	const CMP = (CM / pricePerUnit) * 100;

	return {
		fixedCosts,
		variableCostPerUnit,
		pricePerUnit,
		breakEvenPointUnits: BEP,
		breakEvenPointMoney: BEPM,
		contributionMarginMoney: CM,
		contributionMarginPercent: CMP,
	};
};

export const calculateInvestmentTime = (
	formData: IInvestmentTimeFormData
): InvestmentTimeReportProps => {
	const { startingBalance, endingBalance, annualInterestRate } = formData;

	const r = annualInterestRate / 100;
	const T = Math.log(endingBalance / startingBalance) / Math.log(1 + r);

	return {
		startingBalance,
		endingBalance,
		annualInterestRate,
		yearsRequired: T,
		monthsRequired: T * 12,
		daysRequired: T * 365,
	};
};

export const calculatePresentValue = (formData: IPresentValueFormData): PresentValueReportProps => {
	const { startingBalance, discountRate, duration, durationMultiplier } = formData;

	// PV = FV * (1 / (1 + r) ^ n)
	const FV = startingBalance;
	const r = discountRate / 100;
	const n = (duration * durationMultiplier) / 12;
	const PV = FV * (1 / (1 + r) ** n);

	return { startingBalance, discountRate, duration, durationMultiplier, presentValue: PV };
};

export const calcualteCoumpoundInterest = (
	formData: ICompoundInterestFormData
): CompoundInterestReportProps => {
	const {
		startingBalance,
		contribution,
		contributionMultiplier,
		contributionFrequency,
		interestRate,
		compoundFrequency,
		duration,
		durationMultiplier,
	} = formData;

	// Compounded Interest for Principal
	// CI = P(1 + r/n)^(nt)

	// Future Value of a Series
	// FV = PMT * (((1 + r / n) ** (n * t) - 1) / (r / n))

	// Total amount
	// T = CI + FV

	// Where:
	// PMT = addition freq / compound freq
	// CI = the future value of the investment/loan, including interest
	// P = Principal investment amount (the initial deposit or loan amount)
	// r = Annual interest rate (decimal)
	// n = Compound frequency per year
	// t = Investment time in years

	const depositting = contributionMultiplier > -1;

	const PMT = contributionMultiplier * contribution * (contributionFrequency / compoundFrequency);
	const P = startingBalance;
	const r = interestRate / 100;
	const n = compoundFrequency;
	const t = (duration * durationMultiplier) / 12;

	const CI = P * (1 + r / n) ** (n * t);
	const FV = PMT * (((1 + r / n) ** (n * t) - 1) / (r / n));
	const T = CI + FV;
	const APY = ((1 + r / n) ** n - 1) * 100;

	const additionalContributions =
		contributionMultiplier * contribution * contributionFrequency * t;

	const totalContribution = additionalContributions + P;
	const totalProfit = T - totalContribution;

	// If no rate is provides show the future future value of investment
	const noRateT = additionalContributions + P;

	const totalReturnPercent =
		(totalProfit / (Math.abs(depositting ? additionalContributions : 0) + startingBalance)) *
		100;

	return {
		startingBalance,
		compoundFrequency,
		contribution,
		contributionFrequency,
		contributionMultiplier,
		interestRate,
		duration,
		durationMultiplier,
		totalContribution,
		futureValue: r !== 0 ? T : noRateT,
		totalProfit,
		totalReturn: APY,
		principal: P,
		additionalContributions,
		depositting,
		totalReturnPercent,
	};
};

export const calculateEventProbability = (
	formData: IEventProbabilityFormData
): EventProbabilityReportProps => {
	// At least once probability
	// AOP = 1 - ( ( 1 - P ) ^ T )
	// P = Odds of event occurring in a single trial
	// T = Number of trials

	// More than once probability
	// MOP = AOP - EOP

	// Exactly once probability
	// EOP = T * P * (1 - P) ^ (T - 1)

	const { eventProbabilityPercent, eventTries: T } = formData;
	const P = eventProbabilityPercent / 100;

	const AOP = 1 - (1 - P) ** T;
	const EOP = T * P * (1 - P) ** (T - 1);
	const MOP = AOP - EOP;

	return {
		...formData,
		atLeastOnceProbabilityPercent: AOP * 100,
		neverOccuresProbabilityPercent: (1 - AOP) * 100,
		moreThanOnceProbabilityPercent: MOP * 100,
		exactlyOnceProbabilityPercent: EOP * 100,
	};
};

export const calculateEarningsPerShare = (
	formData: IPriceToEarningsRatioFormData
): PriceToEarningsRatioReportProps => {
	const { sharePrice, earningsPerShare } = formData;

	const peRatio = sharePrice / earningsPerShare;

	return { sharePrice, earningsPerShare, peRatio };
};

export const calculateDollarCostAverage = (
	formData: IDollarCostAverageFormData
): DollarCostAverageReportProps => {
	const {
		compoundFrequency,
		deposit,
		depositFrequency,
		duration,
		durationMultiplier,
		initialInvestment,
		interestRate,
		sharePrice,
	} = formData;

	// r = Annual interest rate (decimal)
	// n = Compound frequency per year

	const duationInDays = duration * durationMultiplier * (365 / 12);
	const depositCount = Math.floor(duationInDays / depositFrequency);
	const r = interestRate / 100;
	const n = compoundFrequency;

	let newSharePrice = sharePrice;
	let totalShares = initialInvestment / sharePrice;
	let dollarCostAverage = initialInvestment / totalShares;
	let totalInvested = initialInvestment;
	let endingValue = initialInvestment;

	// Loop through each deposit
	for (let i = 0; i < depositCount; i++) {
		newSharePrice = newSharePrice * (1 + r / n) ** (n * (depositFrequency / 365));

		totalShares += deposit / newSharePrice;
		dollarCostAverage = (initialInvestment + deposit * (i + 1)) / totalShares;
		totalInvested = initialInvestment + deposit * i;
		endingValue = newSharePrice * totalShares;
	}

	return {
		...formData,
		sharePrice: sharePrice,
		newSharePrice: newSharePrice,
		totalShares,
		dollarCostAverage,
		totalInvested,
		endingValue,
		totalReturnPercent: ((endingValue - totalInvested) / totalInvested) * 100,
		totalReturn: endingValue - totalInvested,
		AbosluteReturnPercent: ((newSharePrice - sharePrice) / sharePrice) * 100,
	};
};

export const calculateEnterpriseValue = (
	formData: IEnterpriseValueFormData
): EnterpriseValueReportProps => {
	const { sharePrice, sharesOutstanding, cash, debt } = formData;

	const marketCap = sharePrice * sharesOutstanding;
	const enterpriseValue = marketCap + debt - cash;

	return { sharePrice, sharesOutstanding, cash, debt, marketCap, enterpriseValue };
};

export const calculateSIPCalculation = (
	formData: ISipCalculationFormData
): SipCalculationProps => {
	const {monthlyInvestment, expectedReturnRate, timePeriod} = formData;

	const months = timePeriod * 12;
	const ratePerMonth = expectedReturnRate / (12 * 100);
	const investedAmount = monthlyInvestment * months;
	const totalValue = monthlyInvestment * ((Math.pow(1 + ratePerMonth, months) - 1) / ratePerMonth) * (1 + ratePerMonth);
	const estimatedReturn = totalValue - investedAmount;

	return { monthlyInvestment, expectedReturnRate, timePeriod, investedAmount, estimatedReturn, totalValue };
};

export const calculateLumpsumCalculation = (
	formData: ILumpsumCalculationFormData
): LumpsumCalculationProps => {
	const {totalInvestment, expectedReturnRate, timePeriod} = formData;

	const timePeriodInYears = timePeriod;
	const ratePerYear = expectedReturnRate / 100;
	const totalValue = totalInvestment * Math.pow((1 + ratePerYear), timePeriodInYears);
	const estimatedReturn = totalValue - totalInvestment;

	return { totalInvestment, expectedReturnRate, timePeriod, estimatedReturn, totalValue };
};

export const calculateStepUpSIPCalculation = (
	formData: IStepUpSipCalculationFormData
): StepUpSipCalculationProps => {
	const { monthlyInvestment, annualStepUp, expectedReturnRate, timePeriod } = formData;
	let totalValue = 0;
	let investedAmount = 0;

	const stepUpRate = annualStepUp / 100;
	const ratePerMonth = expectedReturnRate / (12 * 100);

	for (let year = 1; year <= timePeriod; year++) {
		// Adjust the investment amount for the current year
		const currentInvestment = monthlyInvestment * Math.pow(1 + stepUpRate, year - 1);
		// Total investment for this year
		const yearlyInvestment = currentInvestment * 12;
		investedAmount += yearlyInvestment;

		// Calculate the value for each month in the current year
		let yearlyValue = 0;
		for (let month = 1; month <= 12; month++) {
			yearlyValue += currentInvestment * Math.pow(1 + ratePerMonth, (timePeriod * 12) - ((year - 1) * 12 + month));
		}
		totalValue += yearlyValue;
	}

	const estimatedReturn = totalValue - investedAmount;

	return { monthlyInvestment, annualStepUp, expectedReturnRate, timePeriod, investedAmount, estimatedReturn, totalValue };
};


export const calculateXirrCalculation = (
	formData: IXirrCalculationFormData
): XirrCalculationProps => {
	const { amountInvested, amountAtMaturity, timePeriod } = formData;
	// Total Return Calculation
	const totalReturn = ((amountAtMaturity / amountInvested) - 1) * 100;

	// XIRR Calculation using Newton-Raphson Method
	const xirrFunction = (rate: number) => {
		return amountInvested * Math.pow(1 + rate, timePeriod) - amountAtMaturity;
	};
	const xirrFunctionDerivative = (rate: number) => {
		return amountInvested * timePeriod * Math.pow(1 + rate, timePeriod - 1);
	};
	let xirr = 0;
	let guess = 0.1;
	// Initial guess for the rate
	const tolerance = 0.0001;
	// Tolerance level for convergence
	const maxIterations = 100;
	// Maximum number of iterations
	for (let i = 0; i < maxIterations; i++) {
		const value = xirrFunction(guess);
		const derivative = xirrFunctionDerivative(guess);
		const newGuess = guess - value / derivative;
		if (Math.abs(newGuess - guess) < tolerance) {
			xirr = newGuess; break;
		} guess = newGuess;
	}
	// Convert XIRR to percentage
	xirr = xirr * 100;
	return { amountInvested, amountAtMaturity, timePeriod, xirr, totalReturn};
};

export const calculateRetirmentPlanningCalculation = (
	formData: IRetirmentPlanningCalculationFormData
): RetirmentPlanningCalculationProps => {

	const { currentAge, desiredRetirementAge, lifeExpectancy, monthlyIncomeRequiredInRetirementYears, expectedInflationRate, expectedReturnOnInvestmentPreRetirement, expectedReturnOnInvestmentPostRetirement, existingRetirementFund} = formData;
	// Calculate the number of years in retirement
	const retirementYears = lifeExpectancy - desiredRetirementAge;
	// Calculate the number of years to retirement
	const yearsToRetirement = desiredRetirementAge - currentAge;
	// Calculate the annual inflation-adjusted income required immediately after retirement
	const AnnualIncomeRequiredImmediatelyAfterRetirement = monthlyIncomeRequiredInRetirementYears * 12 * Math.pow(1 + expectedInflationRate / 100, yearsToRetirement);
	// Calculate the corpus required at the beginning of retirement to sustain the retirement income
	const additionalRetirementFundWhichNeedsToBeAccumulatedIs = AnnualIncomeRequiredImmediatelyAfterRetirement * ( (1 - Math.pow(1 + expectedReturnOnInvestmentPostRetirement / 100, -retirementYears)) / (expectedReturnOnInvestmentPostRetirement / 100) );
	// Calculate the monthly savings required to accumulate the retirement fund
	const futureValue = additionalRetirementFundWhichNeedsToBeAccumulatedIs - existingRetirementFund;
	const monthlySavingsRequiredToAccumulateTheFundIs = futureValue * (expectedReturnOnInvestmentPreRetirement / 100 / 12) / (Math.pow(1 + expectedReturnOnInvestmentPreRetirement / 100 / 12, yearsToRetirement * 12) - 1);

	return {currentAge, desiredRetirementAge, lifeExpectancy, monthlyIncomeRequiredInRetirementYears, expectedInflationRate, expectedReturnOnInvestmentPreRetirement, expectedReturnOnInvestmentPostRetirement, existingRetirementFund, AnnualIncomeRequiredImmediatelyAfterRetirement, additionalRetirementFundWhichNeedsToBeAccumulatedIs, monthlySavingsRequiredToAccumulateTheFundIs};



};

export const calculateWealthGainCalculation = (
	formData: IWealthGainCalculationFormData
): WealthGainCalculationProps => {
	const {
		initialInvestment,
		periodicInvestment,
		investmentFrequency,
		expectedRateOfGrowth,
		timePeriod,
	} = formData;

	let investedAmount = initialInvestment;
	let totalValue = initialInvestment;
	const ratePerPeriod = expectedRateOfGrowth / (investmentFrequency * 100);
	const periods = timePeriod * investmentFrequency;
	for (let i = 1; i <= periods; i++) {
		totalValue = totalValue * (1 + ratePerPeriod) + periodicInvestment;
		investedAmount += periodicInvestment;
	}
	const estimatedReturn = totalValue - investedAmount;
	return {
		initialInvestment,
		periodicInvestment,
		investmentFrequency,
		expectedRateOfGrowth,
		timePeriod,
		investedAmount,
		estimatedReturn,
		totalValue
	};
};

export const calculateRecurringDepositCalculation = (
	formData: IRecurringDepositCalculationFormData
): RecurringDepositCalculationProps => {
	const {
		monthlyInvestment,
		rateOfInterest,
		duration,
		durationType,

	} = formData;

	// Convert annual rate of interest to monthly rate of interest
	const monthlyRateOfInterest = rateOfInterest / 100 / 12;
	// Calculate the total number of months
	const totalMonths = durationType * duration;
	// Calculate the total invested amount
	const investedAmount = monthlyInvestment * totalMonths;
	// Calculate the total value (maturity amount) using the correct RD formula
	const totalValue = monthlyInvestment * ((Math.pow(1 + monthlyRateOfInterest, totalMonths) - 1) / monthlyRateOfInterest) * (1 + monthlyRateOfInterest);
	// Calculate the estimated return
	const estimatedReturn = totalValue - investedAmount;



	console.log("input: ");
	console.log("monthlyInvestment: "+monthlyInvestment);
	console.log("rateOfInterest: "+rateOfInterest);
	console.log("duration: "+duration);
	console.log("durationType: "+durationType);

	console.log("output: ");
	console.log("investedAmount: "+investedAmount);
	console.log("estimatedReturn: "+estimatedReturn);
	console.log("totalValue: "+totalValue);

	return {
		monthlyInvestment,
		rateOfInterest,
		duration,
		durationType,
		investedAmount,
		estimatedReturn,
		totalValue,
	};
};


export const calculateFixedDepositCalculation = (
	formData: IFixedDepositCalculationFormData
): FixedDepositCalculationProps => {
	const {
		totalInvestment,
		rateOfInterest,
		duration,
		durationType,

	} = formData;
	const annualRateOfInterest = rateOfInterest / 100;
	const totalYears = durationType === 12 ? duration : duration / 12;
	const totalValue = totalInvestment * Math.pow((1 + annualRateOfInterest), (totalYears));
	const estimatedReturn = totalValue - totalInvestment;

	return {
		totalInvestment,
		rateOfInterest,
		duration,
		durationType,
		estimatedReturn,
		totalValue,
	};
};

export const calculatePpfCalculation = (
	formData: IPpfCalculationFormData
): PpfCalculationProps => {
	const {
		yearlyInvestment,
		timePeriod,
		RateOfInterest,
	} = formData;

	const annualRateOfInterest = RateOfInterest / 100;
	let investedAmount = 0;
	let maturityValue = 0;
	let totalInterest;

	for (let year = 1; year <= timePeriod; year++) {
		investedAmount += yearlyInvestment;
		maturityValue = (maturityValue + yearlyInvestment) * (1 + annualRateOfInterest);
	}
	totalInterest = maturityValue - investedAmount;

	return {
		yearlyInvestment,
		timePeriod,
		RateOfInterest,
		investedAmount,
		totalInterest,
		maturityValue,
	};
};


export const calculateHomeLoanEmiCalculation = (
	formData: IHomeLoanEmiCalculationFormData
): HomeLoanEmiCalculationProps => {
	const { loanAmount, rateOfInterest, loanTenure, tenureType } = formData;

	const monthlyRate = rateOfInterest / (12 * 100);
	const numPayments = loanTenure * tenureType;

	const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / (Math.pow(1 + monthlyRate, numPayments) - 1);
	let balance = loanAmount;
	let totalInterest = 0;
	let totalPrincipal = 0;

	const monthlyBreakdown: Array<any> = [];
	const yearlyBreakdown: Array<any> = [];

	for (let i = 0; i < numPayments; i++) {
		const interest = balance * monthlyRate;
		const principal = emi - interest;
		balance -= principal;
		totalInterest += interest;
		totalPrincipal += principal;

		monthlyBreakdown.push({
			month: i + 1,
			year: Math.floor(i / 12) + 1,
			principalPaid: principal,
			interestCharged: interest,
			totalPayment: emi,
			balance: balance < 0 ? 0 : balance
		});

		if ((i + 1) % 12 === 0 || i === numPayments - 1) {
			const yearlyPrincipal = monthlyBreakdown.filter(m => m.year === Math.floor(i / 12) + 1).reduce((acc, curr) => acc + curr.principalPaid, 0);
			const yearlyInterest = monthlyBreakdown.filter(m => m.year === Math.floor(i / 12) + 1).reduce((acc, curr) => acc + curr.interestCharged, 0);

			yearlyBreakdown.push({
				year: Math.floor(i / 12) + 1,
				principalPaid: yearlyPrincipal,
				interestCharged: yearlyInterest,
				totalPayment: emi * (i === numPayments - 1 ? (i % 12 + 1) : 12),
				balance: balance < 0 ? 0 : balance
			});
		}
	}

	return {
		loanAmount,
		rateOfInterest,
		loanTenure,
		tenureType,
		monthlyEmi: emi,
		principalAmount: loanAmount,
		totalInterest,
		totalAmount: emi * numPayments,
		monthlyBreakdown,
		yearlyBreakdown
	};
};

export const calculateSwpCalculation = (
	formData: ISwpCalculationFormData
): SwpCalculationProps => {
	const {
		totalInvestment,
		withdrawalPerMonth,
		expectedReturnRate,
		timePeriod,
	} = formData;

	const monthlyRate = expectedReturnRate / 12 / 100;
	let balance = totalInvestment;
	let totalWithdrawal = 0;
	const totalMonths = timePeriod * 12;

	for (let i = 0; i < totalMonths; i++) {
		if (balance <= 0) break;

		const interestEarned = balance * monthlyRate;
		balance += interestEarned;
		if (balance < withdrawalPerMonth) {
			totalWithdrawal += balance;
			balance = 0;
		} else {
			balance -= withdrawalPerMonth;
			totalWithdrawal += withdrawalPerMonth;
		}
	}

	const finalValue = balance;
	return {
		totalInvestment,
		withdrawalPerMonth,
		expectedReturnRate,
		timePeriod,
		totalWithdrawal,
		finalValue,
	};
};

export const calculateGoalPlannerSip = (
	formData: IGoalPlannerSipFormData
): GoalPlannerSipProps => {
	const {
		targetedWealth,
		investmentFrequency,
		expectedRateOfReturn,
		tenure,
	} = formData;

	let periodicRate: number;
	let totalPeriods: number;

	if (investmentFrequency === 12) {
		periodicRate = expectedRateOfReturn / (12 * 100);
		totalPeriods = tenure * 12;
	} else {
		periodicRate = expectedRateOfReturn / 100;
		totalPeriods = tenure;
	}

	const investmentPerTenure = targetedWealth * periodicRate / (Math.pow(1 + periodicRate, totalPeriods) - 1);

	console.log("targetedWealth: " + targetedWealth);
	console.log("investmentFrequency: " + investmentFrequency);
	console.log("expectedRateOfReturn: " + expectedRateOfReturn);
	console.log("tenure: " + tenure);
	console.log("investmentPerTenure: " + investmentPerTenure);

	return {
		targetedWealth,
		investmentFrequency,
		expectedRateOfReturn,
		tenure,
		investmentPerTenure,
	};
};

export const calculateCagrCalculation = (
	formData: ICagrCalculationFormData
): CagrCalculationProps => {
	const {
		initialInvestment,
		finalInvestment,
		durationOfInvestment,
	} = formData;

	const cagr = (Math.pow(finalInvestment / initialInvestment, 1 / durationOfInvestment) - 1) * 100;

	console.log("initialInvestment: " + initialInvestment);
	console.log("finalInvestment: " + finalInvestment);
	console.log("durationOfInvestment: " + durationOfInvestment);
	console.log("cagr: " + cagr.toFixed(2) + "%");

	return {
		initialInvestment,
		finalInvestment,
		durationOfInvestment,
		cagr: parseFloat(cagr.toFixed(2)),
	};
};

export const calculateNavCalculation = (
	formData: INavCalculationFormData
): NavCalculationProps => {
	const {
		totalAssets,
		totalLiabilities,
		sharesOutstanding,
	} = formData;

	const navPerShare = (totalAssets - totalLiabilities) / sharesOutstanding;

	return {
		totalAssets,
		totalLiabilities,
		sharesOutstanding,
		navPerShare,
	};
};
