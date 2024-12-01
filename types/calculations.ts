import {
	annualizedReturnFormDataSchema,
	breakEvenPointFormDataSchema,
	calculationNameFormDataSchema,
	calculationNameStringSchema,
	compoundInterestFormDataSchema,
	dollarCostAverageFormDataSchema,
	enterpriseValueFormDataSchema,
	eventProbabilityFormDataSchema,
	investmentTimeFormDataSchema,
	markupFormDataSchema,
	presentValueFormDataSchema,
	priceToEarningsRatioFormDataSchema,
	sipCalculationFormDataScheme,
	lumpsumCalculationFormDataScheme,
	stepUpSipCalculationFormDataScheme,
	xirrCalculationFormDataScheme,
	retirmentPlanningCalculationFormDataScheme,
	wealthGainCalculationFormDataScheme,
} from '@/schemas';
import {
	AnnualizedReturnCalculation,
	BreakEvenPointCalculation,
	CompoundInterestCalculation,
	DollarCostAverageCalculation,
	EnterpriseValueCalculation,
	EventProbabilityCalculation,
	InvestmentTimeCalculation, LumpsumCalculation,
	MarkupCalculation,
	PresentValueCalculation,
	PriceToEarningsRatioCalculation,
	SipCalculation,
	XirrCalculation,
} from '@prisma/client';
import { z } from 'zod';

export interface IHasId {
	id: string;
}

export interface IHasName {
	name: string;
}

export interface IHasFormData<TFormData> extends IHasId {
	formData: TFormData;
}

export interface IHasFormDataAndName<TFormData> extends IHasFormData<TFormData>, IHasName {}

export type ICalculationNameString = z.infer<typeof calculationNameStringSchema>;

export type ICalculationNameFormData = z.infer<typeof calculationNameFormDataSchema>;

// Break Even Point Calculator
export type IBreakEvenPointFormData = z.infer<typeof breakEvenPointFormDataSchema>;

export interface BreakEvenPointReportProps extends IBreakEvenPointFormData {
	breakEvenPointUnits: number;
	breakEvenPointMoney: number;
	contributionMarginMoney: number;
	contributionMarginPercent: number;
}

// Markup Calculator
export type IMarkupFormData = z.infer<typeof markupFormDataSchema>;

export interface MarkupReportProps extends IMarkupFormData {
	profit: number;
	markup: number;
}

// Investment Time Calculation
export type IInvestmentTimeFormData = z.infer<typeof investmentTimeFormDataSchema>;

export interface InvestmentTimeReportProps extends IInvestmentTimeFormData {
	yearsRequired: number;
	monthsRequired: number;
	daysRequired: number;
}

// Present Value Calculation
export type IPresentValueFormData = z.infer<typeof presentValueFormDataSchema>;

export interface PresentValueReportProps extends IPresentValueFormData {
	presentValue: number;
}

// Annualized Return Calculation
export type IAnnualizedReturnFormData = z.infer<typeof annualizedReturnFormDataSchema>;

export interface AnnualizedReturnReportProps extends IAnnualizedReturnFormData {
	annualizedReturn: number;
	percentReturn: number;
}

// Compound Interest Calculation
export type ICompoundInterestFormData = z.infer<typeof compoundInterestFormDataSchema>;

export interface CompoundInterestReportProps extends ICompoundInterestFormData {
	totalContribution: number;
	futureValue: number;
	totalProfit: number;
	totalReturn: number;
	principal: number;
	additionalContributions: number;
	depositting: boolean;
	totalReturnPercent: number;
}

// Event Probability Calculation
export type IEventProbabilityFormData = z.infer<typeof eventProbabilityFormDataSchema>;

export interface EventProbabilityReportProps extends IEventProbabilityFormData {
	atLeastOnceProbabilityPercent: number;
	moreThanOnceProbabilityPercent: number;
	exactlyOnceProbabilityPercent: number;
	neverOccuresProbabilityPercent: number;
}

// Price to Earnings Ratio Calculation
export type IPriceToEarningsRatioFormData = z.infer<typeof priceToEarningsRatioFormDataSchema>;

export interface PriceToEarningsRatioReportProps extends IPriceToEarningsRatioFormData {
	peRatio: number;
}

// Dollar Cost Average Calculation
export type IDollarCostAverageFormData = z.infer<typeof dollarCostAverageFormDataSchema>;

export interface DollarCostAverageReportProps extends IDollarCostAverageFormData {
	newSharePrice: number;
	dollarCostAverage: number;
	totalShares: number;
	totalInvested: number;
	totalReturnPercent: number;
	endingValue: number;
	totalReturn: number;
	AbosluteReturnPercent: number;
}

// Enterprise Value Calculation
export type IEnterpriseValueFormData = z.infer<typeof enterpriseValueFormDataSchema>;

export interface EnterpriseValueReportProps extends IEnterpriseValueFormData {
	marketCap: number;
	enterpriseValue: number;
}

// SIP Calculation
export type ISipCalculationFormData = z.infer<typeof sipCalculationFormDataScheme>;

export interface SipCalculationProps extends ISipCalculationFormData {
	investedAmount: number;
	estimatedReturn: number;
	totalValue: number;
}

export type ILumpsumCalculationFormData = z.infer<typeof lumpsumCalculationFormDataScheme>;

export interface LumpsumCalculationProps extends ILumpsumCalculationFormData {
	estimatedReturn: number;
	totalValue: number;
}

// SIP Calculation
export type IStepUpSipCalculationFormData = z.infer<typeof stepUpSipCalculationFormDataScheme>;

export interface StepUpSipCalculationProps extends IStepUpSipCalculationFormData {
	investedAmount: number;
	estimatedReturn: number;
	totalValue: number;
}

export type IXirrCalculationFormData = z.infer<typeof xirrCalculationFormDataScheme>;

export interface XirrCalculationProps extends IXirrCalculationFormData {
	xirr: number;
	totalReturn: number;
}

export interface StepUpSipCalculationProps extends IStepUpSipCalculationFormData {
	investedAmount: number;
	estimatedReturn: number;
	totalValue: number;
}

export type IRetirmentPlanningCalculationFormData = z.infer<typeof retirmentPlanningCalculationFormDataScheme>;

export interface RetirmentPlanningCalculationProps extends IRetirmentPlanningCalculationFormData {
	AnnualIncomeRequiredImmediatelyAfterRetirement: number;
	additionalRetirementFundWhichNeedsToBeAccumulatedIs: number;
	monthlySavingsRequiredToAccumulateTheFundIs: number;
}

export type IWealthGainCalculationFormData = z.infer<typeof wealthGainCalculationFormDataScheme>;

export interface WealthGainCalculationProps extends IWealthGainCalculationFormData {
	investedAmount: number;
	estimatedReturn: number;
	totalValue: number;
}

export type CalculationType =
	| BreakEvenPointCalculation
	| MarkupCalculation
	| InvestmentTimeCalculation
	| PresentValueCalculation
	| AnnualizedReturnCalculation
	| CompoundInterestCalculation
	| EventProbabilityCalculation
	| PriceToEarningsRatioCalculation
	| DollarCostAverageCalculation
	| EnterpriseValueCalculation
	| SipCalculation
	| LumpsumCalculation
	| XirrCalculation;
