"use client";

import FormContainer from "@/components/Form/FormContainer";
import FormGroup from "@/components/Form/FormGroup";
import NumberInputWithIcon from "@/components/Form/NumberInputWithIcon";
import SubmitButton from "@/components/Form/SubmitButton";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import useCalculator from "@/hooks/useCalculator";
import {calculateNetWorth, calculateSimpleInterest} from "@/lib/calculatorFns";
import { netWorthCalculatorFormDataScheme } from "@/schemas";
import { INetWorthCalculatorFormData, NetWorthCalculatorProps } from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Report from "./Report";
import { FaDownload } from "react-icons/fa";
import React from "react";
import { NetWorthCalculator } from "@prisma/client";
import {NETWORTH_CALCULATOR_API_URL, NETWORTH_CALCULATOR_QUERY_KEY} from "@/constants/api";

const defaultValues: INetWorthCalculatorFormData = {
    primaryIncome: 10000,
    realEstateIncome: 0,
    sharesInvestments: 0,
    vehicleAssets: 0,
    otherAssets: 0,
    savingsAccounts: 0,
    otherInvestments: 0,
    cashEquivalents: 0,
    providentFund: 0,
    insurancePolicies: 0,
    homeLoan: 0,
    carLoan: 0,
    personalLoan: 0,
    studentLoan: 0,
    loanAgainstProperty: 0,
    creditCardDebt: 0,
    otherDebts: 0,
    emis: 0,
};

const handlePrint = () => {
    window.print();
};

const Calculator = () => {
    const form = useForm<INetWorthCalculatorFormData>({
        resolver: zodResolver(netWorthCalculatorFormDataScheme),
        defaultValues,
    });

    const {
        onCalculate,
        resetForm,
        report,
    } = useCalculator<
        INetWorthCalculatorFormData,
        NetWorthCalculatorProps,
        NetWorthCalculator
    >({
        apiUrl: NETWORTH_CALCULATOR_API_URL,
        queryKey: NETWORTH_CALCULATOR_QUERY_KEY,
        defaultValues,
        form,
        calcFn: calculateNetWorth,
    });

    return (
        <>
            <FormContainer>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-4">
                        <h3>Assets</h3>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="primaryIncome"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Primary Income</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="primaryIncome"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="realEstateIncome"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Real Estate Income</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="realEstateIncome"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="sharesInvestments"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Shares and Financial Investments</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="sharesInvestments"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicleAssets"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Vehicle Assets</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="vehicleAssets"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="otherAssets"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Other Assets</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="otherAssets"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="savingsAccounts"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Savings Accounts</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="savingsAccounts"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="otherInvestments"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Other Investments</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="otherInvestments"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cashEquivalents"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Cash and Cash Equivalents</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="cashEquivalents"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="providentFund"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Provident Fund</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="providentFund"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="insurancePolicies"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Insurance Policies (Surrender Value)</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="insurancePolicies"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>

                        <h3>Liabilities</h3>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="homeLoan"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Home Loan</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="homeLoan"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="carLoan"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Car Loan</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="carLoan"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="personalLoan"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Personal Loan</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="personalLoan"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="studentLoan"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Student Loan</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="studentLoan"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="loanAgainstProperty"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Loan Against Property</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="loanAgainstProperty"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="creditCardDebt"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Credit Card Debt and Bank Overdraft</FormLabel>
                                            <FormControl>
                                                <NumberInputWithIcon
                                                    {...field}
                                                    name="creditCardDebt"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                    </FormItem>
                                    )}
                                />
                        </FormGroup>
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="otherDebts"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Other Debts</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="otherDebts"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="emis"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>EMIs</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="emis"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <SubmitButton />
                    </form>
                </Form>
            </FormContainer>

            {report && <Report report={report} />}
            <button className="print-button" onClick={handlePrint} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                margin: "20px",
                padding: "10px 20px",
                fontSize: "16px",
                color: "white",
                backgroundColor: "#634587",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            }}>
                Download <FaDownload />
            </button>
        </>
);
};

export default Calculator;