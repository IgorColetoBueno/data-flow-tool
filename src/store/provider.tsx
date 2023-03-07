"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from ".";

interface IDftProviderProps {
  children: ReactNode | ReactNode[] | null;
}

const DftProvider = ({ children }: IDftProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default DftProvider;
