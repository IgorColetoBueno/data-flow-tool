import Sidebar from "@/app/Sidebar";
import Editor from "../../../components/editor/Editor";

interface IHomePageProps {
  params: {
    id: string;
  };
}

const HomePage = ({ params }: IHomePageProps) => {
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
