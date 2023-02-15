"use client";

import Sidebar from "@/app/Sidebar";
import store, { persistor } from "@/store";
import { addNode } from "@/store/editorSlice";
import { generateUUID } from "@/util/generateUUID";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Editor from "./Editor";

const BaseComponent = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Sidebar
        onNewDataSource={() =>
          dispatch(
            addNode({
              data: { label: "Input 1" },
              id: generateUUID(),
              type: "inputNode",
              position: { x: 0, y: 0 },
            })
          )
        }
        onNewOutput={() =>
          dispatch(
            addNode({
              data: { label: "Output 1" },
              id: generateUUID(),
              position: { x: 0, y: 0 },
            })
          )
        }
        onNewStep={() =>
          dispatch(
            addNode({
              data: { label: "Step 1" },
              id: generateUUID(),
              position: { x: 0, y: 0 },
            })
          )
        }
      />

      <div className="sm:ml-64 h-full">
        <Editor />
      </div>
    </>
  );
};

const HomePage = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BaseComponent />
      </PersistGate>
    </Provider>
  );
};

export default HomePage;
