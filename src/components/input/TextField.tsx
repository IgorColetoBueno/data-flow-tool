import classNames from "classnames";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { ColorType, ColorVariant } from "../colors";

interface ITextFieldProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  color: ColorType;
  variant: ColorVariant;
  id: string;
  label?: string;
}

const TextField = ({
  color,
  variant,
  id,
  label,
  ...props
}: ITextFieldProps) => {
  const className = classNames(
    "w-full border-2 rounded-md p-1 focus:outline-none transition-colors",
    `bg-${color}-${variant}`,
    `border-${color}-${+variant - 300}`,
    `hover:bg-${color}-${+variant + 100}`,
    `focus:bg-${color}-${+variant - 200}`,
    {}
  );
  return (
    <>
      {!!label && (
        <label className="text-sm" htmlFor={id}>
          {label}
        </label>
      )}
      <input {...props} id={id} className={className} />
    </>
  );
};

export default TextField;
