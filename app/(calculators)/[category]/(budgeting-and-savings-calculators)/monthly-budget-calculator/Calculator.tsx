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
    MONTHLY_BUDGET_CALCULATOR_API_URL,
    MONTHLY_BUDGET_CALCULATOR_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateMonthlyBudgetCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { monthlyBudgetCalculatorFormDataScheme } from "@/schemas";
import {
  IMonthlyBudgetCalculatorFormData,
    MonthlyBudgetCalculatorProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import React from "react";
import {MonthlyBudgetCalculator} from "@prisma/client";

const defaultValues: IMonthlyBudgetCalculatorFormData = {
    monthlyIncome:25000,
    housingExpenses: 5000,
    utilitiesExpenses: 3000,
    groceriesExpenses: 1000,
    transportationExpenses: 1000,
    otherExpenses: 1000,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IMonthlyBudgetCalculatorFormData>({
    resolver: zodResolver(monthlyBudgetCalculatorFormDataScheme),
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
    IMonthlyBudgetCalculatorFormData,
      MonthlyBudgetCalculatorProps,
      MonthlyBudgetCalculator
  >({
    apiUrl: MONTHLY_BUDGET_CALCULATOR_API_URL,
    queryKey: MONTHLY_BUDGET_CALCULATOR_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateMonthlyBudgetCalculator,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<MonthlyBudgetCalculator[] | null>({
    queryKey: [MONTHLY_BUDGET_CALCULATOR_QUERY_KEY],
    queryFn: () => getCalculations(MONTHLY_BUDGET_CALCULATOR_API_URL),
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
                          name="monthlyIncome"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Monthly Income</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="monthlyIncome"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("monthlyIncome", 25000);
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
                          name="housingExpenses"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Housing Expenses</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="housingExpenses"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("housingExpenses", 5000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="utilitiesExpenses"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>utilitiesExpenses</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="utilitiesExpenses"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("utilitiesExpenses", 3000);
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
                          name="groceriesExpenses"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Groceries Expenses</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="groceriesExpenses"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("groceriesExpenses", 1000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="transportationExpenses"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Transportation Expenses</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="transportationExpenses"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("transportationExpenses", 1000);
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
                          name="otherExpenses"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Other Expenses</FormLabel>
                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="otherExpenses"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("otherExpenses", 1000);
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
