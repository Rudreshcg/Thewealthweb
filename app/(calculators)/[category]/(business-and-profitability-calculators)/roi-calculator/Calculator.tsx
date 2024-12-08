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
import {ROI_CALCULATOR_API_URL, ROI_CALCULATOR_QUERY_KEY} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import {calculateROICalculator} from "@/lib/calculatorFns";
import {getCalculations} from "@/lib/queryFns/calculations";
import {rOICalculatorFormDataScheme} from "@/schemas";
import {IROICalculatorFormData, ROICalculatorProps} from "@/types/calculations";
import {zodResolver} from "@hookform/resolvers/zod";
import {useQuery} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import {useForm} from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import React from "react";
import {ROICalculator} from "@prisma/client";

const defaultValues: IROICalculatorFormData = {
    amountInvested: 50000,
    amountReturned: 70000,
    investmentPeriodYears: 8,
};

const handlePrint = () => {
    window.print();
};

const Calculator = () => {
    const form = useForm<IROICalculatorFormData>({
        resolver: zodResolver(rOICalculatorFormDataScheme),
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
        IROICalculatorFormData,
        ROICalculatorProps,
        ROICalculator
    >({
        apiUrl: ROI_CALCULATOR_API_URL,
        queryKey: ROI_CALCULATOR_QUERY_KEY,
        defaultValues,
        form,
        calcFn: calculateROICalculator,
    });

    const {status: sessionStatus} = useSession();

    const {
        data: calculations,
        isLoading: isCalculationsLoading,
        isFetching,
    } = useQuery<ROICalculatorProps[] | null>({
        queryKey: [ROI_CALCULATOR_QUERY_KEY],
        queryFn: () => getCalculations(ROI_CALCULATOR_API_URL),
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
                                name="amountInvested"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Amount Invested</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="amountInvested"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("amountInvested", 50000);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amountReturned"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Amount Returned</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="amountReturned"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("amountReturned", 70000);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormField
                                control={form.control}
                                name="investmentPeriodYears"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Investment Period (Years)</FormLabel>
                                        <FormControl>
                                            <NumberInputWithIcon
                                                {...field}
                                                name="investmentPeriodYears"
                                                onBlur={(e) => {
                                                    ifFieldIsEmpty(e) && form.setValue("investmentPeriodYears", 8);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <SubmitButton/>
                    </form>
                </Form>
            </FormContainer>

            {report && <Report report={report}/>}
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
                Download <FaDownload/>
            </button>
        </>
    );
};

export default Calculator;