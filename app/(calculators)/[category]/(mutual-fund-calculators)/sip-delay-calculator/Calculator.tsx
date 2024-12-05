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
    SIP_DELAY_CALCULATOR_API_URL,
    SIP_DELAY_CALCULATOR_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateSipDelayCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { sipDelayCalculatorFormDataScheme } from "@/schemas";
import {
  ISipDelayCalculatorFormData,
    SipDelayCalculatorProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import {SipDelayCalculator} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import { FaDownload } from "react-icons/fa";
import React from "react";

const defaultValues: ISipDelayCalculatorFormData = {
    monthlySipAmount: 25000,
    sipPeriodInYear: 10,
    expectedReturnsOnInvestment: 12,
    periodOfDelayMonth: 10,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<ISipDelayCalculatorFormData>({
    resolver: zodResolver(sipDelayCalculatorFormDataScheme),
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
    ISipDelayCalculatorFormData,
      SipDelayCalculatorProps,
      SipDelayCalculator
  >({
    apiUrl: SIP_DELAY_CALCULATOR_API_URL,
    queryKey: SIP_DELAY_CALCULATOR_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateSipDelayCalculator,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<SipDelayCalculator[] | null>({
    queryKey: [SIP_DELAY_CALCULATOR_QUERY_KEY],
    queryFn: () => getCalculations(SIP_DELAY_CALCULATOR_API_URL),
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
                          name="monthlySipAmount"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Monthly Sip Amount</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="monthlySipAmount"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("monthlySipAmount", 25000);
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
                          name="sipPeriodInYear"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>SIP Period (in Years)</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="sipPeriodInYear"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("sipPeriodInYear", 10);
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
                          name="expectedReturnsOnInvestment"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Returns on Investment</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="expectedReturnsOnInvestment"
                                          iconType="percentage"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("expectedReturnsOnInvestment", 12);
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
                          name="periodOfDelayMonth"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Period of Delay (in Month)</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="periodOfDelayMonth"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("sipPeriodInYear", 10);
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
