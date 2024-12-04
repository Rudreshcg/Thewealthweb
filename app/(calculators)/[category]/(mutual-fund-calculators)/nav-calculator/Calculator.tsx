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
    NAV_CALCULATIONS_API_URL,
    NAV_CALCULATIONS_QUERY_KEY
} from "@/constants/api";
import useCalculator from "@/hooks/useCalculator";
import { getCalculations } from "@/lib/queryFns/calculations";
import { navCalculationFormDataScheme } from "@/schemas";
import {
  INavCalculationFormData,
    NavCalculationProps,
} from "@/types/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Report from "./Report";
import {FaDownload} from "react-icons/fa";
import {NavCalculation} from "@prisma/client";
import {calculateNavCalculation} from "@/lib/calculatorFns";

const defaultValues: INavCalculationFormData = {
    totalAssets: 25000,
    totalLiabilities: 2500,
    sharesOutstanding: 50,
};
const handlePrint = () => {
    window.print();
};

const Calculator = () => {
  const form = useForm<INavCalculationFormData>({
    resolver: zodResolver(navCalculationFormDataScheme),
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
    INavCalculationFormData,
    NavCalculationProps,
    NavCalculation
  >({
    apiUrl: NAV_CALCULATIONS_API_URL,
    queryKey: NAV_CALCULATIONS_QUERY_KEY,
    defaultValues,
    form,
    calcFn: calculateNavCalculation,
  });

  const { status: sessionStatus } = useSession();

  const {
    data: calculations,
    isLoading: isCalculationsLoading,
    isFetching,
  } = useQuery<NavCalculation[] | null>({
    queryKey: [NAV_CALCULATIONS_QUERY_KEY],
    queryFn: () => getCalculations(NAV_CALCULATIONS_API_URL),
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
                          name="totalAssets"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Total Assets</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="totalAssets"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("totalAssets", 25000);
                                          }}
                                      />
                                  </FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  </ FormGroup>
                  <FormGroup>
                      <FormField
                          control={form.control}
                          name="totalAssets"
                          render={({field}) => (
                              <FormItem className="w-full">
                                  <FormLabel>Total Assets</FormLabel>

                                  <FormControl>
                                      <NumberInputWithIcon
                                          {...field}
                                          name="totalAssets"
                                          onBlur={(e) => {
                                              ifFieldIsEmpty(e) &&
                                              form.setValue("totalAssets", 2500);
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
                      name="sharesOutstanding"
                      render={({field}) => (
                          <FormItem className="w-full">
                              <FormLabel>Shares Outstanding</FormLabel>

                              <FormControl>
                                  <NumberInputWithIcon
                                      {...field}
                                      name="sharesOutstanding"
                                      onBlur={(e) => {
                                          ifFieldIsEmpty(e) &&
                                          form.setValue("sharesOutstanding", 50);
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
