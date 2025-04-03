"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CSVPreviewProps {
  headers: string[];
  rows: string[][];
  maxRows?: number;
}

export function CSVPreview({ headers, rows, maxRows = 5 }: CSVPreviewProps) {
  const previewRows = rows.slice(0, maxRows);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {previewRows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length > maxRows && (
        <div className="p-4 text-center text-sm text-muted-foreground border-t">
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
}