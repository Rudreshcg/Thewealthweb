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
    WEALTH_GAIN_CALCULATIONS_API_URL,
    WEALTH_GAIN_CALCULATIONS_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateWealthGainCalculation} from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { wealthGainCalculationFormDataScheme } from "@/schemas";
import {
  IWealthGainCalculationFormData,
  WealthGainCalculationProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import DynamicFormLabel from "@/components/Form/DynamicFormLabel";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { investmentFrequencies } from "@/constants/data";
import React from "react";
import {WealthGainCalculation} from "@prisma/client";

const defaultValues: IWealthGainCalculationFormData = {
    initialInvestment:0,
    periodicInvestment: 10000,
    investmentFrequency: 12,
    expectedRateOfGrowth: 12,
    timePeriod: 10,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IWealthGainCalculationFormData>({
    resolver: zodResolver(wealthGainCalculationFormDataScheme),
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
    IWealthGainCalculationFormData,
    WealthGainCalculationProps,
    WealthGainCalculation
  >({
    apiUrl: WEALTH_GAIN_CALCULATIONS_API_URL,
    queryKey: WEALTH_GAIN_CALCULATIONS_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateWealthGainCalculation,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<WealthGainCalculation[] | null>({
    queryKey: [WEALTH_GAIN_CALCULATIONS_QUERY_KEY],
    queryFn: () => getCalculations(WEALTH_GAIN_CALCULATIONS_API_URL),
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
                                          iconType="currency"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("initialInvestment", 0);
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
                          name="periodicInvestment"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Periodic Investment</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="periodicInvestment"
                                          iconType="currency"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("periodicInvestment", 10000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="investmentFrequency"
                          render={({ field }) => (
                              <FormItem className="w-full">
                                  <DynamicFormLabel
                                      label="investmentFrequency"
                                      shortLabel="Frequency"
                                  />

                                  <Select
                                      onValueChange={field.onChange}
                                      value={String(field.value)}
                                  >
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select a duration type" />
                                          </SelectTrigger>
                                      </FormControl>

                                      <SelectContent>
                                          {investmentFrequencies.map((multiplier) => (
                                              <SelectItem
                                                  key={`investmentFrequency-${multiplier.value}`}
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
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="expectedRateOfGrowth"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Rate of Growth</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="expectedRateOfGrowth"
                                          iconType="percentage"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("expectedRateOfGrowth", 12);
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
                          name="timePeriod"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Time Period (Yr)</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="timePeriod"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={40}
                                          min={1}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("timePeriod", 10);
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
