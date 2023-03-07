"use client";
import Sidebar from "@/app/Sidebar";
import { BoardDbHandler } from "@/storage/boardDbHandler";
import { useEffect } from "react";
import Editor from "../../../components/editor/Editor";
import { useDispatch } from "react-redux";
import { resetDataSlice } from "@/store/dataSlice";
import { closeModal } from "@/store/modalPreviewSlice";
import { resetEditorSlice } from "@/store/editorSlice";

interface IHomePageProps {
  params: {
    id: string;
  };
}

const HomePage = ({ params }: IHomePageProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    BoardDbHandler.getOne(params.id, window.indexedDB).then((item) => {
      debugger;
      if (!item.board) {
        dispatch(
          resetEditorSlice({ boardId: params.id, edges: [], nodes: [] })
        );
        return;
      }

      dispatch(resetDataSlice(item.board?.data!));
      dispatch(
        resetEditorSlice({ ...item.board?.editor!, boardId: params.id })
      );
      dispatch(closeModal());
    });
  }, [dispatch, params.id]);

  return (
    <>
      <Sidebar id={params.id} />
      <div className="sm:ml-64 h-full">
        <Editor />
      </div>
    </>
  );
};

export default HomePage;
