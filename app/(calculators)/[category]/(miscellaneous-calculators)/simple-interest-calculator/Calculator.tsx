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
import { Input } from "@/components/ui/input";
import { SIMPLE_INTEREST_CALCULATOR_API_URL, SIMPLE_INTEREST_CALCULATOR_QUERY_KEY } from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateSimpleInterest } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { simpleInterestCalculatorFormDataScheme } from "@/schemas";
import { ISimpleInterestCalculatorFormData, SimpleInterestCalculatorProps } from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import { FaDownload } from "react-icons/fa";
import React from "react";
import DynamicFormLabel from "@/components/Form/DynamicFormLabel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { durationType } from "@/constants/data";
import { SimpleInterestCalculator } from "@prisma/client";
const defaultValues: ISimpleInterestCalculatorFormData = {
    principalAmount: 100000,
    interestRate: 6.5,
    period: 5,
    periodType: 12,
    interestDurationType: 12,
};

const handlePrint = () => {
    window.print();
};

const Calculator = () => {
    const form = useForm<ISimpleInterestCalculatorFormData>({
        resolver: zodResolver(simpleInterestCalculatorFormDataScheme),
        defaultValues,
    });

    const {
        onCalculate,
        resetForm,
        handleSaveUpdateStart,
        closeSaveModal,
        handleSave,
        handleRename,
        handleClose,
        handleDelete,
        handleImport,
        report,
        saveModalOpen,
        importModalOpen,
        renameModalOpen,
        setRenameModalOpen,
        activeCalculation,
        ifFieldIsEmpty,
        closeRenameModal,
        handleImportStart,
        closeImportModal,
    } = useCalculator<
        ISimpleInterestCalculatorFormData,
        SimpleInterestCalculatorProps,
        SimpleInterestCalculator
    >({
        apiUrl: SIMPLE_INTEREST_CALCULATOR_API_URL,
        queryKey: SIMPLE_INTEREST_CALCULATOR_QUERY_KEY,
        defaultValues,
        form,
        calcFn: calculateSimpleInterest,
    });

    const { status: sessionStatus } = useSession();

    const {
        data: calculations,
        isLoading: isCalculationsLoading,
        isFetching,
    } = useQuery<SimpleInterestCalculatorProps[] | null>({
        queryKey: [SIMPLE_INTEREST_CALCULATOR_QUERY_KEY],
        queryFn: () => getCalculations(SIMPLE_INTEREST_CALCULATOR_API_URL),
        staleTime: 1_000 * 60 * 10, // 10 minutes
        enabled: sessionStatus === "authenticated",
    });

    return (
        <>
            <FormContainer>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-4">
                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="principalAmount"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Principal Amount</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="principalAmount"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("principalAmount", 100000);
                                                }}
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
                                name="interestRate"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Interest Rate</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="interestRate"
                                                iconType="percentage"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("interestRate", 6.5);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="interestDurationType"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <DynamicFormLabel label="Interest Duration type" shortLabel="Type" />

                                        <Select
                                            onValueChange={field.onChange}
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a duration Type" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {durationType.map((multiplier) => (
                                                    <SelectItem
                                                        key={`durationMultiplier-${multiplier.value}`}
                                                        value={String(multiplier.value)}
                                                    >
                                                        {multiplier.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>

                        <FormGroup inline>
                            <FormField
                                control={form.control}
                                name="period"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Period</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                name="period"
                                                placeholder="5"
                                                step="0.01"
                                                type="number"
                                                max={10}
                                                min={1}
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("period", 5);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="periodType"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <DynamicFormLabel label="Period Type" shortLabel="Type" />

                                        <Select
                                            onValueChange={field.onChange}
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a period type" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {durationType.map((multiplier) => (
                                                    <SelectItem
                                                        key={`durationMultiplier-${multiplier.value}`}
                                                        value={String(multiplier.value)}
                                                    >
                                                        {multiplier.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
