import { closeModal } from "@/store/modalPreviewSlice";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";

interface IModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode | ReactNode[] | null;
  footer?: ReactNode | ReactNode[] | null;
}

const Modal = ({ open, title, children, onClose, footer }: IModalProps) => {
  const dispatch = useDispatch();
  return (
    <div
      tabIndex={-1}
      aria-hidden="true"
      aria-modal="true"
      className={classNames(
        "fixed z-50 w-full h-full overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full bg-gray-900/80",
        { hidden: !open }
      )}
    >
      <div className="flex align-items-center w-full h-full">
        <div className="relative mx-auto my-auto bg-white max-w-[95vw] rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={() => {
                onClose();
                dispatch(closeModal());
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <XMarkIcon strokeWidth={3} className="w-5 h-5" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {children}
            </div>
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default Modal;
