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
    PERSONAL_LOAN_EMI_CALCULATIONS_API_URL,
    PERSONAL_LOAN_EMI_CALCULATIONS_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateHomeLoanEmiCalculation } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { personalLoanEmiCalculationFormDataScheme } from "@/schemas";
import {
    IPersonalLoanEmiCalculationFormData,
    PersonalLoanEmiCalculationProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import React from "react";
import DynamicFormLabel from "@/components/Form/DynamicFormLabel";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {durationType} from "@/constants/data";
import {PersonalLoanEmiCalculation} from "@prisma/client";

const defaultValues: IPersonalLoanEmiCalculationFormData = {
    loanAmount: 1000000,
    rateOfInterest: 6.5,
    loanTenure: 5,
    tenureType: 12,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IPersonalLoanEmiCalculationFormData>({
    resolver: zodResolver(personalLoanEmiCalculationFormDataScheme),
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
    IPersonalLoanEmiCalculationFormData,
      PersonalLoanEmiCalculationProps,
      PersonalLoanEmiCalculation
  >({
    apiUrl: PERSONAL_LOAN_EMI_CALCULATIONS_API_URL,
    queryKey: PERSONAL_LOAN_EMI_CALCULATIONS_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateHomeLoanEmiCalculation,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<PersonalLoanEmiCalculation[] | null>({
    queryKey: [PERSONAL_LOAN_EMI_CALCULATIONS_QUERY_KEY],
    queryFn: () => getCalculations(PERSONAL_LOAN_EMI_CALCULATIONS_API_URL),
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
                          name="loanAmount"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Loan Amount</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="loanAmount"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("loanAmount", 100000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="rateOfInterest"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Rate of Interest</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="rateOfInterest"
                                          iconType="percentage"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("rateOfInterest", 6.5);
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
                          name="loanTenure"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Duration</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="duration"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={10}
                                          min={1}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("loanTenure", 5);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="tenureType"
                          render={({ field }) => (
                              <FormItem className="w-full">
                                  <DynamicFormLabel label="Tenure Type" shortLabel="Type" />

                                  <Select
                                      onValueChange={field.onChange}
                                      value={String(field.value)}
                                  >
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select a Tenure type" />
                                          </SelectTrigger>
                                      </FormControl>

                                      <SelectContent>
                                          {durationType.map((multiplier) => (
                                              <SelectItem
                                                  key={`durationMultiplier-${multiplier.value}`}
                                                  value={String(multiplier.value)}
                                              >
                                                  {multiplier.label}
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
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
