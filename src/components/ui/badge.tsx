import type { FC, HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "default" | "secondary" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

const baseClasses =
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

const variantClasses: Record<BadgeVariant, string> = {
  default: "border border-blue-100 bg-blue-50 text-blue-700",
  secondary: "border border-gray-200 bg-gray-100 text-gray-700",
  outline: "border border-gray-300 bg-transparent text-gray-800",
};

export const Badge: FC<BadgeProps> = ({
  className = "",
  children,
  variant = "default",
  ...props
}) => {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;


