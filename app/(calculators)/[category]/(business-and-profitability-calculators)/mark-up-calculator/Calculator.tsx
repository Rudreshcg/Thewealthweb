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
import { MARK_UP_CALCULATOR_API_URL, MARK_UP_CALCULATOR_QUERY_KEY } from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateMarkupCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { markUpCalculatorFormDataScheme } from "@/schemas";
import { IMarkUpCalculatorFormData, MarkUpCalculatorProps } from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import { FaDownload } from "react-icons/fa";
import React from "react";
import { MarkUpCalculator } from "@prisma/client";

const defaultValues: IMarkUpCalculatorFormData = {
    costPrice: 100,
    sellingPrice: 150,
};

const handlePrint = () => {
    window.print();
};

const Calculator = () => {
    const form = useForm<IMarkUpCalculatorFormData>({
        resolver: zodResolver(markUpCalculatorFormDataScheme),
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
        IMarkUpCalculatorFormData,
        MarkUpCalculatorProps,
        MarkUpCalculator
    >({
        apiUrl: MARK_UP_CALCULATOR_API_URL,
        queryKey: MARK_UP_CALCULATOR_QUERY_KEY,
        defaultValues,
        form,
        calcFn: calculateMarkupCalculator,
    });

    const { status: sessionStatus } = useSession();

    const {
        data: calculations,
        isLoading: isCalculationsLoading,
        isFetching,
    } = useQuery<MarkUpCalculatorProps[] | null>({
        queryKey: [MARK_UP_CALCULATOR_QUERY_KEY],
        queryFn: () => getCalculations(MARK_UP_CALCULATOR_API_URL),
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
                                name="costPrice"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Cost Price</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="costPrice"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("costPrice", 100);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sellingPrice"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Selling Price</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="sellingPrice"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("sellingPrice", 150);
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