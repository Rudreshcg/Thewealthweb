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
import {
    INFLATION_ADJUSTED_RETURN_CALCULATOR_API_URL,
    INFLATION_ADJUSTED_RETURN_CALCULATOR_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateInflationAdjustedReturnCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { inflationAdjustedReturnCalculatorFormDataScheme } from "@/schemas";
import {
  IInflationAdjustedReturnCalculatorFormData,
    InflationAdjustedReturnCalculatorProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import { FaDownload } from "react-icons/fa";
import React from "react";
import {InflationAdjustedReturnCalculator} from "@prisma/client";
import {Input} from "@/components/ui/input";

const defaultValues: IInflationAdjustedReturnCalculatorFormData = {
    investmentAmount: 100000,
    inflationRate: 6,
    numberOfYears: 10,

};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IInflationAdjustedReturnCalculatorFormData>({
    resolver: zodResolver(inflationAdjustedReturnCalculatorFormDataScheme),
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
    IInflationAdjustedReturnCalculatorFormData,
    InflationAdjustedReturnCalculatorProps,
    InflationAdjustedReturnCalculator
  >({
    apiUrl: INFLATION_ADJUSTED_RETURN_CALCULATOR_API_URL,
    queryKey: INFLATION_ADJUSTED_RETURN_CALCULATOR_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateInflationAdjustedReturnCalculator,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<InflationAdjustedReturnCalculator[] | null>({
    queryKey: [INFLATION_ADJUSTED_RETURN_CALCULATOR_QUERY_KEY],
    queryFn: () => getCalculations(INFLATION_ADJUSTED_RETURN_CALCULATOR_API_URL),
    staleTime: 1_000 * 60 * 10, // 10 minutes
    enabled: sessionStatus === "authenticated",
  });

  return (
      <>
        <FormContainer>
          {/*<FormControlsTop<ISipCalculationFormData, SipCalculation>
              reset={resetForm}
              handleSaveUpdateStart={handleSaveUpdateStart}
              activeCalculation={activeCalculation}
              closeCalculation={handleClose}
              renameStart={() => setRenameModalOpen(true)}
              isSaveModalOpen={saveModalOpen}
              handleCloseSaveModal={closeSaveModal}
              handleSave={handleSave}
              isRenameModalOpen={renameModalOpen}
              handleCloseRenameModal={closeRenameModal}
              handleRename={handleRename}
              isImportModalOpen={importModalOpen}
              handleImportStart={handleImportStart}
              handleDelete={handleDelete}
              calculations={calculations}
              isLoading={isCalculationsLoading || isFetching}
              handleImport={handleImport}
              closeImportModal={closeImportModal}
          />*/}

          <Form {...form}>
              <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-4">
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="investmentAmount"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Investment Amount</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="investmentAmount"
                                          placeholder="100000"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("investmentAmount", 100000);
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
                          name="inflationRate"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Return</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="inflationRate"
                                          iconType="percentage"
                                          placeholder="6"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("inflationRate", 6);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  </FormGroup>
                  <FormGroup inline>
                      <FormField
                          control={form.control}
                          name="numberOfYears"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Number of Years</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="numberOfYears"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={40}
                                          min={1}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("numberOfYears", 10);
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
              Download <FaDownload />
          </button>
          {/*<Info />*/}
      </>
  );
};

export default Calculator;
