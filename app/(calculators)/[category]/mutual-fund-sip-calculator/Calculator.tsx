"use client";

import FormContainer from "@/components/Form/FormContainer";
import FormControlsTop from "@/components/Form/FormControlsTop";
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
  MUTUAL_FUND_SIP_CALCULATIONS_API_URL,
  MUTUAL_FUND_SIP_CALCULATIONS_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateSIPCalculation } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { sipCalculationFormDataScheme } from "@/schemas";
import {
  ISipCalculationFormData,
  SipCalculationProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { SipCalculation } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Info from "./Info";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";

const defaultValues: ISipCalculationFormData = {
  monthlyInvestment: 25000,
  expectedReturnRate:12,
  timePeriod: 10,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<ISipCalculationFormData>({
    resolver: zodResolver(sipCalculationFormDataScheme),
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
    ISipCalculationFormData,
    SipCalculationProps,
    SipCalculation
  >({
    apiUrl: MUTUAL_FUND_SIP_CALCULATIONS_API_URL,
    queryKey: MUTUAL_FUND_SIP_CALCULATIONS_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateSIPCalculation,
  });

  const { status: sessionStatus } = useSession();

  const [calcType, setCalcType] = useState('SIP');
  const handleOptionChange = (newCalcType: string) => {
  setCalcType(newCalcType);
        form.handleSubmit(onCalculate)();
   };
    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     onCalculate();
    // };

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<SipCalculation[] | null>({
    queryKey: [MUTUAL_FUND_SIP_CALCULATIONS_QUERY_KEY],
    queryFn: () => getCalculations(MUTUAL_FUND_SIP_CALCULATIONS_API_URL),
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
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                      <Button
                      onClick={() => handleOptionChange('SIP')}
                      className={`option-button ${calcType === 'SIP' ? 'active' : ''}`}>SIP</Button>
                      <Button
                      onClick={() => handleOptionChange('Lumpsum')}
                      className={`option-button ${calcType === 'Lumpsum' ? 'active' : ''}`}>Lumpsum</Button>
                  </div>
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="monthlyInvestment"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Monthly Investment</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="monthlyInvestment"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("monthlyInvestment", 25000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="expectedReturnRate"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Expected Return Rate</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="expectedReturnRate"
                                          iconType="percentage"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("expectedReturnRate", 12);
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
