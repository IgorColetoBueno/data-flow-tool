"use client"
import Sidebar from "@/app/Sidebar";
import { BoardDbHandler } from "@/storage/boardDbHandler";
import { useEffect } from "react";
import Editor from "../../../components/editor/Editor";
import {useDispatch} from 'react-redux'
import { resetDataSlice } from "@/store/dataSlice";

interface IHomePageProps {
  params: {
    id: string;
  };
}

const HomePage = ({ params }: IHomePageProps) => {
  const dispatch = useDispatch()
  useEffect(() => {
    BoardDbHandler.getOne(params.id, window.indexedDB)
    .then(item => {
      debugger
      dispatch(resetDataSlice())
    })
  }, [])
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
