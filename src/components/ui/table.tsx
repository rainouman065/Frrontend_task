import type {
  FC,
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";

export const Table: FC<TableHTMLAttributes<HTMLTableElement>> = ({
  className = "",
  ...props
}) => (
  <table
    className={`w-full border-collapse text-sm ${className}`.trim()}
    {...props}
  />
);

export const TableHeader: FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  className = "",
  ...props
}) => (
  <thead
    className={`bg-gray-50 text-gray-600 ${className}`.trim()}
    {...props}
  />
);

export const TableBody: FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  className = "",
  ...props
}) => <tbody className={className} {...props} />;

export const TableRow: FC<HTMLAttributes<HTMLTableRowElement>> = ({
  className = "",
  ...props
}) => (
  <tr
    className={`border-b last:border-0 hover:bg-gray-50 ${className}`.trim()}
    {...props}
  />
);

export const TableHead: FC<ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  ...props
}) => (
  <th
    className={`py-2 px-3 text-left font-medium ${className}`.trim()}
    {...props}
  />
);

export const TableCell: FC<TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  ...props
}) => (
  <td className={`py-2 px-3 align-middle ${className}`.trim()} {...props} />
);

