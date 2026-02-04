import type { FC, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input: FC<InputProps> = ({ className = "", ...props }) => {
  const baseClasses =
    "flex h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";

  return <input className={`${baseClasses} ${className}`.trim()} {...props} />;
};

export default Input;

