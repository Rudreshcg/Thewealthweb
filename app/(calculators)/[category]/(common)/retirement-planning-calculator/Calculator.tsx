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
    RETIRMENT_PLANNING_CALCULATIONS_API_URL,
    RETIRMENT_PLANNING_CALCULATIONS_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { getCalculations } from "@/lib/queryFns/calculations";
import {
  IRetirmentPlanningCalculationFormData,
  RetirmentPlanningCalculationProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import React from "react";
import {calculateRetirmentPlanningCalculation} from "@/lib/calculatorFns";
import {retirmentPlanningCalculationFormDataScheme} from "@/schemas";
import {RetirmentPlanningCalculation} from "@prisma/client";

const defaultValues: IRetirmentPlanningCalculationFormData = {
    currentAge: 30,
    desiredRetirementAge: 60,
    lifeExpectancy: 80,
    monthlyIncomeRequiredInRetirementYears: 10000,
    expectedInflationRate: 6,
    expectedReturnOnInvestmentPreRetirement: 15,
    expectedReturnOnInvestmentPostRetirement: 6,
    existingRetirementFund: 0,
};
const handlePrint = () => {
    window.print();
};


const Calculator = () => {
  const form = useForm<IRetirmentPlanningCalculationFormData>({
    resolver: zodResolver(retirmentPlanningCalculationFormDataScheme),
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
    IRetirmentPlanningCalculationFormData,
      RetirmentPlanningCalculationProps,
      RetirmentPlanningCalculation
  >({
    apiUrl: RETIRMENT_PLANNING_CALCULATIONS_API_URL,
    queryKey: RETIRMENT_PLANNING_CALCULATIONS_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateRetirmentPlanningCalculation,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<RetirmentPlanningCalculation[] | null>({
    queryKey: [RETIRMENT_PLANNING_CALCULATIONS_QUERY_KEY],
    queryFn: () => getCalculations(RETIRMENT_PLANNING_CALCULATIONS_API_URL),
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
                  {/*currentAge, desiredRetirementAge*/}
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="currentAge"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Your Current Age   (between 15-60 Years)</FormLabel>
                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="currentAge"
                                          placeholder="30"
                                          step="0.01"
                                          type="number"
                                          max={60}
                                          min={15}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("currentAge", 30);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="desiredRetirementAge"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Desired Retirement Age (Upto 70 Years)</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="desiredRetirementAge"
                                          placeholder="60"
                                          step="0.01"
                                          type="number"
                                          max={70}
                                          min={15}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("desiredRetirementAge", 60);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  </FormGroup>
                  {/*lifeExpectancy*/}
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="lifeExpectancy"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Life Expectancy (Upto 100 Years)</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="lifeExpectancy"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={80}
                                          min={30}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("lifeExpectancy", 80);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  </FormGroup>
                  {/*monthlyIncomeRequiredInRetirementYears*/}
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="monthlyIncomeRequiredInRetirementYears"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Monthly Income Required In Retirement Years</FormLabel>
                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="monthlyIncomeRequiredInRetirementYears"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("monthlyIncomeRequiredInRetirementYears", 10000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  </FormGroup>
                  {/*expectedInflationRate*/}
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="expectedInflationRate"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Inflation Rate (%) (Normal Inflation Rate In India Is 3%-15%)</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="expectedInflationRate"
                                          iconType="percentage"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("expectedInflationRate", 6);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  </FormGroup>
                  {/*expectedReturnOnInvestmentPostRetirement, expectedReturnOnInvestmentPreRetirement*/}
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="expectedReturnOnInvestmentPreRetirement"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Return On Investment (Pre-retirement)</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="expectedReturnOnInvestmentPreRetirement"
                                          iconType="percentage"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("expectedReturnOnInvestmentPreRetirement", 15);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="expectedReturnOnInvestmentPostRetirement"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Return On Investment (Post-retirement)</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="expectedReturnOnInvestmentPostRetirement"
                                          iconType="percentage"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("expectedReturnOnInvestmentPostRetirement", 6);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />

                  </FormGroup>
                  {/*anyExistingSavingOrInvestmentForRetirement*/}
                  {/*  <FormGroup>
                      <FormField
                          control={form.control}
                          name="anyExistingSavingOrInvestmentForRetirement"
                          render={({ field }) => (
                              <FormItem className="w-full">
                                  <DynamicFormLabel
                                      label="Do You Have Any Existing Saving Or Investment For Retirement?"
                                      shortLabel="Do You Have Any Existing Saving Or Investment For Retirement?"
                                  />
                                  <SelectContent>
                                      <SelectItem key= 'n' value= 'n'>No</SelectItem>
                                      <SelectItem key= 'y' value= 'y'>Yes</SelectItem>
                                  </SelectContent>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </FormGroup>*/}
                  {/*existingRetirementFund*/}
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="existingRetirementFund"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Do You Have Any Existing Saving Or Investment For Retirement?</FormLabel>
                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="existingRetirementFund"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("existingRetirementFund", 0);
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
