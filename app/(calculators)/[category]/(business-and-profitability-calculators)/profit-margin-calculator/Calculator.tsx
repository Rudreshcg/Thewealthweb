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
import { PROFIT_CALCULATOR_API_URL, PROFIT_CALCULATOR_QUERY_KEY } from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateProfitCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { profitCalculatorFormDataScheme } from "@/schemas";
import { IProfitCalculatorFormData, ProfitCalculatorProps } from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FaDownload } from "react-icons/fa";
import React from "react";
import Report from "./Report";
import { ProfitCalculator } from "@prisma/client";

const defaultValues: IProfitCalculatorFormData = {
    revenue: 100000,
    expenses: 80000,
};

const handlePrint = () => {
    window.print();
};

const Calculator = () => {
    const form = useForm<IProfitCalculatorFormData>({
        resolver: zodResolver(profitCalculatorFormDataScheme),
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
        IProfitCalculatorFormData,
        ProfitCalculatorProps,
        ProfitCalculator
    >({
        apiUrl: PROFIT_CALCULATOR_API_URL,
        queryKey: PROFIT_CALCULATOR_QUERY_KEY,
        defaultValues,
        form,
        calcFn: calculateProfitCalculator,
    });

    const { status: sessionStatus } = useSession();

    const {
        data: calculations,
        isLoading: isCalculationsLoading,
        isFetching,
    } = useQuery<ProfitCalculatorProps[] | null>({
        queryKey: [PROFIT_CALCULATOR_QUERY_KEY],
        queryFn: () => getCalculations(PROFIT_CALCULATOR_API_URL),
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
                                name="revenue"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Revenue</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="revenue"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("revenue", 100000);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expenses"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Expenses</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="expenses"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("expenses", 80000);
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