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
    FIXED_DEPOSIT_CALCULATIONS_API_URL,
    FIXED_DEPOSIT_CALCULATIONS_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateFixedDepositCalculation } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { fixedDepositCalculationFormDataScheme } from "@/schemas";
import {
  IFixedDepositCalculationFormData,
  FixedDepositCalculationProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import React, {useState} from "react";
import DynamicFormLabel from "@/components/Form/DynamicFormLabel";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {durationType} from "@/constants/data";
import {FixedDepositCalculation} from "@prisma/client";

const defaultValues: IFixedDepositCalculationFormData = {
    totalInvestment: 100000,
    rateOfInterest: 6.5,
    duration: 5,
    durationType: 12,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IFixedDepositCalculationFormData>({
    resolver: zodResolver(fixedDepositCalculationFormDataScheme),
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
    IFixedDepositCalculationFormData,
    FixedDepositCalculationProps,
    FixedDepositCalculation
  >({
    apiUrl: FIXED_DEPOSIT_CALCULATIONS_API_URL,
    queryKey: FIXED_DEPOSIT_CALCULATIONS_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateFixedDepositCalculation,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<FixedDepositCalculation[] | null>({
    queryKey: [FIXED_DEPOSIT_CALCULATIONS_QUERY_KEY],
    queryFn: () => getCalculations(FIXED_DEPOSIT_CALCULATIONS_API_URL),
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
                          name="totalInvestment"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Total Investment</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="totalInvestment"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("totalInvestment", 100000);
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
                                              form.setValue("rateOfInterest", 12);
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
                          name="duration"
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
                                              ifFieldIsEmpty(e) && form.setValue("duration", 5);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="durationType"
                          render={({ field }) => (
                              <FormItem className="w-full">
                                  <DynamicFormLabel label="Duration Type" shortLabel="Type" />

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
