"use client";

import Sidebar from "@/app/Sidebar";
import store, { persistor } from "@/store";
import { addNode } from "@/store/editorSlice";
import { generateUUID } from "@/util/generateUUID";
import { useCallback } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Editor from "./Editor";

const BaseComponent = () => {
  const dispatch = useDispatch();

  const onNewDataSource = useCallback(
    () =>
      dispatch(
        addNode({
          data: null,
          id: generateUUID(),
          type: "inputNode",
          position: { x: 0, y: 0 },
        })
      ),
    [dispatch]
  );
  const onNewOutput = useCallback(
    () =>
      dispatch(
        addNode({
          data: null,
          id: generateUUID(),
          position: { x: 0, y: 0 },
        })
      ),
    [dispatch]
  );
  const onNewSelectNodeStep = useCallback(
    () =>
      dispatch(
        addNode({
          data: null,
          id: generateUUID(),
          type: "selectNode",
          position: { x: 0, y: 0 },
        })
      ),
    [dispatch]
  );
  const onNewGroupNodeStep = useCallback(
    () =>
      dispatch(
        addNode({
          data: null,
          id: generateUUID(),
          type: "groupNode",
          position: { x: 0, y: 0 },
        })
      ),
    [dispatch]
  );
  const onNewSortNodeStep = useCallback(
    () =>
      dispatch(
        addNode({
          data: null,
          id: generateUUID(),
          type: "sortNode",
          position: { x: 0, y: 0 },
        })
      ),
    [dispatch]
  );

  return (
    <>
      <Sidebar />

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
