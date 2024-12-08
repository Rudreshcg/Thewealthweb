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
    EMERGENCY_FUND_CALCULATOR_API_URL,
    EMERGENCY_FUND_CALCULATOR_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateEmergencyFundCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { emergencyFundCalculatorFormDataScheme } from "@/schemas";
import {
  IEmergencyFundCalculatorFormData,
    EmergencyFundCalculatorProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import React from "react";
import {EmergencyFundCalculator} from "@prisma/client";
import {Input} from "@/components/ui/input";

const defaultValues: IEmergencyFundCalculatorFormData = {
    averageMonthlyExpenses: 20000,
    monthsOfSavingsDesired: 6,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IEmergencyFundCalculatorFormData>({
    resolver: zodResolver(emergencyFundCalculatorFormDataScheme),
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
    IEmergencyFundCalculatorFormData,
      EmergencyFundCalculatorProps,
      EmergencyFundCalculator
  >({
    apiUrl: EMERGENCY_FUND_CALCULATOR_API_URL,
    queryKey: EMERGENCY_FUND_CALCULATOR_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateEmergencyFundCalculator,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<EmergencyFundCalculator[] | null>({
    queryKey: [EMERGENCY_FUND_CALCULATOR_QUERY_KEY],
    queryFn: () => getCalculations(EMERGENCY_FUND_CALCULATOR_API_URL),
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
                          name="averageMonthlyExpenses"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Average Monthly Expenses</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="averageMonthlyExpenses"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("averageMonthlyExpenses", 20000);
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
                          name="monthsOfSavingsDesired"
                          render={({ field }) => (
                              <FormItem className="w-full">
                                  <FormLabel>Months of Savings Desired</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="monthsOfSavingsDesired"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={200}
                                          min={0}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue('monthsOfSavingsDesired', 6);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage />
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
