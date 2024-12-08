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
import { BREAK_EVEN_CALCULATOR_API_URL,
    BREAK_EVEN_CALCULATOR_QUERY_KEY } from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateBreakEvenCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { breakEvenCalculatorFormDataScheme } from "@/schemas";
import {
    IBreakEvenCalculatorFormData,
    BreakEvenCalculatorProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FaDownload } from "react-icons/fa";
import React from "react";
import { BreakEvenCalculator } from "@prisma/client";
import Report from "./Report";

const defaultValues: IBreakEvenCalculatorFormData = {
    fixedCosts: 40000,
    variableCostPerUnit: 5,
    sellingPricePerUnit: 10,
    expectedUnitSales: 15000,
};

const handlePrint = () => {
    window.print();
};

const Calculator = () => {
    const form = useForm<IBreakEvenCalculatorFormData>({
        resolver: zodResolver(breakEvenCalculatorFormDataScheme),
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
        IBreakEvenCalculatorFormData,
        BreakEvenCalculatorProps,
        BreakEvenCalculator
    >({
        apiUrl: BREAK_EVEN_CALCULATOR_API_URL,
        queryKey: BREAK_EVEN_CALCULATOR_QUERY_KEY,
        defaultValues,
        form,
        calcFn: calculateBreakEvenCalculator,
    });

    const { status: sessionStatus } = useSession();

    const {
        data: calculations,
        isLoading: isCalculationsLoading,
        isFetching,
    } = useQuery<BreakEvenCalculatorProps[] | null>({
        queryKey: [BREAK_EVEN_CALCULATOR_QUERY_KEY],
        queryFn: () => getCalculations(BREAK_EVEN_CALCULATOR_API_URL),
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
                                name="fixedCosts"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Fixed Costs</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="fixedCosts"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("fixedCosts", 40000);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="variableCostPerUnit"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Variable Cost Per Unit</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="variableCostPerUnit"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("variableCostPerUnit", 5);
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
                                name="sellingPricePerUnit"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Selling Price Per Unit</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="sellingPricePerUnit"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("sellingPricePerUnit", 10);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expectedUnitSales"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Expected Unit Sales</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="expectedUnitSales"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("expectedUnitSales", 15000);
                                                }}
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