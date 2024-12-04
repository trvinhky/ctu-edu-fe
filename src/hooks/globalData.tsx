import React, { useState, createContext, useContext } from "react";

interface GlobalDataType {
  isLoading: boolean;
  emailSend?: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setEmailSend: React.Dispatch<React.SetStateAction<string | undefined>>
}

const GlobalDataContext = createContext<GlobalDataType | undefined>(undefined);

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSend, setEmailSend] = useState<string>();

  return (
    <GlobalDataContext.Provider
      value={{
        isLoading,
        setIsLoading,
        emailSend,
        setEmailSend
      }}>
      {children}
    </GlobalDataContext.Provider>
  )
}

export const useGlobalDataContext = () => {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error('useGlobalDataContext must be used within a GlobalDataProvider');
  }
  return context;
};