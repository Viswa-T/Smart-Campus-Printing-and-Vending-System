import React, { createContext, useContext, useEffect, useState } from 'react';
import { College, Machine, PricingQuote, UploadedDocument } from '../types';
import { pricingApi } from '../services/api';

interface PrintOptions {
  colorMode: 'BW' | 'COLOR';
  printSides: 'SINGLE' | 'DOUBLE';
  copies: number;
}

interface PrintOrderContextType {
  selectedCollege: College | null;
  selectedMachine: Machine | null;
  selectedDocuments: UploadedDocument[];
  printOptions: PrintOptions;
  quote: PricingQuote | null;
  calculatingQuote: boolean;
  setSelectedCollege: (college: College | null) => void;
  setSelectedMachine: (machine: Machine | null) => void;
  setSelectedDocuments: (docs: UploadedDocument[]) => void;
  addDocument: (doc: UploadedDocument) => void;
  removeDocument: (docId: number) => void;
  clearDocuments: () => void;
  updatePrintOptions: (options: Partial<PrintOptions>) => void;
  resetWorkflow: () => void;
  refreshQuote: () => Promise<void>;
}

const PrintOrderContext = createContext<PrintOrderContextType | undefined>(undefined);

export const PrintOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<UploadedDocument[]>([]);
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    colorMode: 'BW',
    printSides: 'SINGLE',
    copies: 1,
  });
  const [quote, setQuote] = useState<PricingQuote | null>(null);
  const [calculatingQuote, setCalculatingQuote] = useState<boolean>(false);

  // Recalculate authoritative price whenever documents or print options change
  useEffect(() => {
    let active = true;

    const fetchQuote = async () => {
      if (selectedDocuments.length === 0) {
        setQuote(null);
        return;
      }

      setCalculatingQuote(true);
      try {
        const docIds = selectedDocuments.map((d) => d.id);
        const serverQuote = await pricingApi.getQuote({
          documentIds: docIds,
          colorMode: printOptions.colorMode,
          printSides: printOptions.printSides,
          copies: printOptions.copies,
        });

        if (active) {
          setQuote(serverQuote);
        }
      } catch {
        // Fallback provisional calculation if unauthenticated or offline
        if (active) {
          const totalPages = selectedDocuments.reduce((sum, d) => sum + d.pageCount, 0);
          const rate = printOptions.colorMode === 'COLOR' ? 5 : 1;
          const totalChargeable = totalPages * printOptions.copies;
          const base = totalChargeable * rate;
          const discount = printOptions.printSides === 'DOUBLE' ? Math.round(base * 0.3) : 0;
          const finalAmt = base - discount;

          setQuote({
            documentCount: selectedDocuments.length,
            totalPages,
            copies: printOptions.copies,
            totalChargeablePages: totalChargeable,
            colorMode: printOptions.colorMode,
            printSides: printOptions.printSides,
            ratePerPage: rate,
            baseAmount: base,
            discountPercentage: printOptions.printSides === 'DOUBLE' ? 30 : 0,
            discountAmount: discount,
            finalAmount: finalAmt,
            currency: 'INR',
            pricingVersion: 'v1.0',
          });
        }
      } finally {
        if (active) {
          setCalculatingQuote(false);
        }
      }
    };

    fetchQuote();

    return () => {
      active = false;
    };
  }, [selectedDocuments, printOptions]);

  const addDocument = (doc: UploadedDocument) => {
    setSelectedDocuments((prev) => {
      if (prev.some((d) => d.id === doc.id)) return prev;
      return [...prev, doc];
    });
  };

  const removeDocument = (docId: number) => {
    setSelectedDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const clearDocuments = () => {
    setSelectedDocuments([]);
  };

  const updatePrintOptions = (updates: Partial<PrintOptions>) => {
    setPrintOptions((prev) => ({
      ...prev,
      ...updates,
      copies: updates.copies !== undefined ? Math.min(10, Math.max(1, updates.copies)) : prev.copies,
    }));
  };

  const resetWorkflow = () => {
    setSelectedDocuments([]);
    setPrintOptions({
      colorMode: 'BW',
      printSides: 'SINGLE',
      copies: 1,
    });
    setQuote(null);
  };

  const refreshQuote = async () => {
    if (selectedDocuments.length === 0) return;
    try {
      const docIds = selectedDocuments.map((d) => d.id);
      const serverQuote = await pricingApi.getQuote({
        documentIds: docIds,
        colorMode: printOptions.colorMode,
        printSides: printOptions.printSides,
        copies: printOptions.copies,
      });
      setQuote(serverQuote);
    } catch {
      // Ignored
    }
  };

  return (
    <PrintOrderContext.Provider
      value={{
        selectedCollege,
        selectedMachine,
        selectedDocuments,
        printOptions,
        quote,
        calculatingQuote,
        setSelectedCollege,
        setSelectedMachine,
        setSelectedDocuments,
        addDocument,
        removeDocument,
        clearDocuments,
        updatePrintOptions,
        resetWorkflow,
        refreshQuote,
      }}
    >
      {children}
    </PrintOrderContext.Provider>
  );
};

export const usePrintOrder = () => {
  const context = useContext(PrintOrderContext);
  if (!context) {
    throw new Error('usePrintOrder must be used within a PrintOrderProvider');
  }
  return context;
};
