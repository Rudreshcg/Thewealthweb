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
    CHILD_EDUCATION_FUND_CALCULATOR_API_URL,
    CHILD_EDUCATION_FUND_CALCULATOR_QUERY_KEY,
} from "@/constants/api";
//childEducationFundCalculator
import useCalculator from "@/hooks/useCalculator";
import { calculateChildEducationFundCalculator } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { childEducationFundCalculatorFormDataScheme } from "@/schemas";
import {
  IChildEducationFundCalculatorFormData,
    ChildEducationFundCalculatorProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import {ChildEducationFundCalculator} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import { FaDownload } from "react-icons/fa";
import React from "react";
import {Input} from "@/components/ui/input";

const defaultValues: IChildEducationFundCalculatorFormData = {
    currentAgeOfChild: 10,
    ageForHigherEducation: 18,
    expectedAnnualRateOfReturn: 12,
    presentCostOfHigherEducation: 20000,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IChildEducationFundCalculatorFormData>({
    resolver: zodResolver(childEducationFundCalculatorFormDataScheme),
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
    IChildEducationFundCalculatorFormData,
    ChildEducationFundCalculatorProps,
    ChildEducationFundCalculator
  >({
    apiUrl: CHILD_EDUCATION_FUND_CALCULATOR_API_URL,
    queryKey: CHILD_EDUCATION_FUND_CALCULATOR_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateChildEducationFundCalculator,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<ChildEducationFundCalculator[] | null>({
    queryKey: [CHILD_EDUCATION_FUND_CALCULATOR_QUERY_KEY],
    queryFn: () => getCalculations(CHILD_EDUCATION_FUND_CALCULATOR_API_URL),
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
                          name="currentAgeOfChild"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Current Age of Child:</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="currentAgeOfChild"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={40}
                                          min={1}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("currentAgeOfChild", 10);
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
                          name="ageForHigherEducation"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Age When Child Will go for Higher Education:</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="ageForHigherEducation"
                                          placeholder="18"
                                          step="0.01"
                                          type="number"
                                          max={57}
                                          min={18}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("ageForHigherEducation", 18);
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
                          name="expectedAnnualRateOfReturn"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Annual Rate of Return</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="expectedAnnualRateOfReturn"
                                          iconType="percentage"
                                          placeholder="12"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("expectedAnnualRateOfReturn", 12);
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
                          name="presentCostOfHigherEducation"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Annual Rate Of Return (P.A)</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="presentCostOfHigherEducation"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("presentCostOfHigherEducation", 20000);
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
