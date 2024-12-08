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
import { FUTURE_VALUE_CALCULATOR_API_URL, FUTURE_VALUE_CALCULATOR_QUERY_KEY } from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateFutureValue } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { futureValueCalculatorFormDataScheme } from "@/schemas";
import { IFutureValueCalculatorFormData, FutureValueCalculatorProps } from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import { FaDownload } from "react-icons/fa";
import React from "react";
import DynamicFormLabel from "@/components/Form/DynamicFormLabel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FutureValueCalculator } from "@prisma/client";
import {durationType} from "@/constants/data";

const defaultValues: IFutureValueCalculatorFormData = {
    initialValue: 500,
    annualContribution: 100,
    interestRate: 6.5,
    numberOfPeriods: 5,
    compoundFrequency: 1,
};

const handlePrint = () => {
    window.print();
};

const Calculator = () => {
    const form = useForm<IFutureValueCalculatorFormData>({
        resolver: zodResolver(futureValueCalculatorFormDataScheme),
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
        IFutureValueCalculatorFormData,
        FutureValueCalculatorProps,
        FutureValueCalculator
    >({
        apiUrl: FUTURE_VALUE_CALCULATOR_API_URL,
        queryKey: FUTURE_VALUE_CALCULATOR_QUERY_KEY,
        defaultValues,
        form,
        calcFn: calculateFutureValue,
    });

    const { status: sessionStatus } = useSession();

    const {
        data: calculations,
        isLoading: isCalculationsLoading,
        isFetching,
    } = useQuery<FutureValueCalculatorProps[] | null>({
        queryKey: [FUTURE_VALUE_CALCULATOR_QUERY_KEY],
        queryFn: () => getCalculations(FUTURE_VALUE_CALCULATOR_API_URL),
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
                                name="initialValue"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Initial Value</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="initialValue"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("initialValue", 500);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="annualContribution"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Annual Contribution</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="annualContribution"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("annualContribution", 100);
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
                                        <FormLabel>Interest Rate %</FormLabel>
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
                                name="numberOfPeriods"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Number of Periods (Years)</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="numberOfPeriods"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("numberOfPeriods", 5);
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
                                name="compoundFrequency"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <DynamicFormLabel label="Compound Interest Frequency" shortLabel="Frequency" />

                                        <Select
                                            onValueChange={field.onChange}
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a frequency" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {durationType.map((option) => (
                                                    <SelectItem
                                                        key={`frequencyOption-${option.value}`}
                                                        value={String(option.value)}
                                                    >
                                                        {option.label}
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