import classNames from "classnames";
import { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import { ColorType, ColorVariant } from "../colors";

interface ISelectFieldProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  color: ColorType;
  variant: ColorVariant;
  id: string;
  label?: string;
}

const SelectField = ({
  color,
  variant,
  id,
  label,
  children,
  ...props
}: ISelectFieldProps) => {
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
        <label className="text-xs" htmlFor={id}>
          {label}
        </label>
      )}
      <select {...props} id={id} className={className}>
        {children}
      </select>
    </>
  );
};

export default SelectField;
