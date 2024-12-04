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
    CAGR_CALCULATIONS_API_URL,
    CAGR_CALCULATIONS_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { calculateCagrCalculation } from "@/lib/calculatorFns";
import { getCalculations } from "@/lib/queryFns/calculations";
import { cagrCalculationFormDataScheme } from "@/schemas";
import {
  ICagrCalculationFormData,
    CagrCalculationProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import {CagrCalculation} from "@prisma/client";

const defaultValues: ICagrCalculationFormData = {
    initialInvestment: 5000,
    finalInvestment: 25000,
    durationOfInvestment: 5,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<ICagrCalculationFormData>({
    resolver: zodResolver(cagrCalculationFormDataScheme),
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
    ICagrCalculationFormData,
    CagrCalculationProps,
    CagrCalculation
  >({
    apiUrl: CAGR_CALCULATIONS_API_URL,
    queryKey: CAGR_CALCULATIONS_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateCagrCalculation,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<CagrCalculation[] | null>({
    queryKey: [CAGR_CALCULATIONS_QUERY_KEY],
    queryFn: () => getCalculations(CAGR_CALCULATIONS_API_URL),
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
                                              form.setValue("initialInvestment", 5000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  </FormGroup>
                  <FormField
                      control={form.control}
                      name="finalInvestment"
                      render={({field}) => (
                          <FormItem className="w-full">
                              <FormLabel>Final Investment</FormLabel>

                              <FormControl>
                                  <NumberInputWithIcon
                                      {...field}
                                      name="finalInvestment"
                                      onBlur={(e) => {
                                          ifFieldIsEmpty(e) &&
                                          form.setValue("finalInvestment", 25000);
                                      }}
                                  />
                              </FormControl>
                              <FormMessage/>
                          </FormItem>
                      )}
                  />
                  <FormGroup />
                  <FormGroup inline>
                      <FormField
                          control={form.control}
                          name="durationOfInvestment"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Duration of Investment (Yr)</FormLabel>

                                  <FormControl>
                                      <Input
                                          {...field}
                                          name="durationOfInvestment"
                                          placeholder="10"
                                          step="0.01"
                                          type="number"
                                          max={40}
                                          min={1}
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) && form.setValue("durationOfInvestment", 5);
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
