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
    GOAL_PLANNER_SIP_API_URL,
    GOAL_PLANNER_SIP_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateGoalPlannerSip } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { goalPlannerSipFormDataScheme } from "@/schemas";
import {
  IGoalPlannerSipFormData,
    GoalPlannerSipProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import {GoalPlannerSip} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import { FaDownload } from "react-icons/fa";
import React from "react";
import DynamicFormLabel from "@/components/Form/DynamicFormLabel";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {durationType, tenureFrequency} from "@/constants/data";

const defaultValues: IGoalPlannerSipFormData = {
    targetedWealth: 1000000,
    investmentFrequency: 1,
    expectedRateOfReturn: 12,
    tenure: 10,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<IGoalPlannerSipFormData>({
    resolver: zodResolver(goalPlannerSipFormDataScheme),
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
    IGoalPlannerSipFormData,
    GoalPlannerSipProps,
    GoalPlannerSip
  >({
    apiUrl: GOAL_PLANNER_SIP_API_URL,
    queryKey: GOAL_PLANNER_SIP_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateGoalPlannerSip,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<GoalPlannerSip[] | null>({
    queryKey: [GOAL_PLANNER_SIP_QUERY_KEY],
    queryFn: () => getCalculations(GOAL_PLANNER_SIP_API_URL),
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
                          name="targetedWealth"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Targeted Wealth</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="targetedWealth"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("targetedWealth", 1000000);
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
                                  <DynamicFormLabel label="Investment Frequency" shortLabel="Frequency" />

                                  <Select
                                      onValueChange={field.onChange}
                                      value={String(field.value)}
                                  >
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select a Investment Frequency" />
                                          </SelectTrigger>
                                      </FormControl>

                                      <SelectContent>
                                          {tenureFrequency.map((multiplier) => (
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
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="expectedRateOfReturn"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Rate of Return</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="expectedRateOfReturn"
                                          iconType="percentage"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("expectedRateOfReturn", 12);
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
                          name="tenure"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Tenure (in Years)</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="tenure"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("tenure", 10);
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
