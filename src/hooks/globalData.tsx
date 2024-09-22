import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import React, { useState, createContext, useContext } from "react";

interface GlobalDataType {
  isLoading: boolean;
  emailSend?: string
  messageApi: MessageInstance
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setEmailSend: React.Dispatch<React.SetStateAction<string | undefined>>
}

const GlobalDataContext = createContext<GlobalDataType | undefined>(undefined);

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSend, setEmailSend] = useState<string>();
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <GlobalDataContext.Provider value={{ isLoading, setIsLoading, messageApi, emailSend, setEmailSend }}>
      {contextHolder}
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