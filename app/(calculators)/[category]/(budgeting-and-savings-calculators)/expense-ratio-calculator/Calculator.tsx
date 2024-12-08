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
import {
    EXPENSE_RATIO_CALCULATOR_API_URL,
    EXPENSE_RATIO_CALCULATOR_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateExpenseRatioCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { expenseRatioCalculatorFormDataScheme } from "@/schemas";
import {
  IExpenseRatioCalculatorFormData,
    ExpenseRatioCalculatorProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import {ExpenseRatioCalculator} from "@prisma/client";
//ExpenseRatioCalculator
const defaultValues: IExpenseRatioCalculatorFormData = {
    initialInvestment: 100000,
    yearlyInvestment: 25000,
    durationYrs: 10,
    expectedReturn: 12,
    expenseRatio: 1,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IExpenseRatioCalculatorFormData>({
    resolver: zodResolver(expenseRatioCalculatorFormDataScheme),
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
    IExpenseRatioCalculatorFormData,
      ExpenseRatioCalculatorProps,
      ExpenseRatioCalculator
  >({
    apiUrl: EXPENSE_RATIO_CALCULATOR_API_URL,
    queryKey: EXPENSE_RATIO_CALCULATOR_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateExpenseRatioCalculator,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<ExpenseRatioCalculator[] | null>({
    queryKey: [EXPENSE_RATIO_CALCULATOR_QUERY_KEY],
    queryFn: () => getCalculations(EXPENSE_RATIO_CALCULATOR_API_URL),
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
                          name="initialInvestment"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Initial Investment</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="initialInvestment"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("initialInvestment", 100000);
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
                          name="yearlyInvestment"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Yearly Investment</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="yearlyInvestment"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("yearlyInvestment", 25000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="durationYrs"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Duration (Yr)</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="durationYrs"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={40}
                                          min={1}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("durationYrs", 10);
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
                          name="expectedReturn"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Return</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="expectedReturn"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={40}
                                          min={1}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("expectedReturn", 12);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="expenseRatio"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expense Ratio</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="expenseRatio"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={40}
                                          min={1}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("expenseRatio", 1);
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
