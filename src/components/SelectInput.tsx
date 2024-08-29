/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { QrConfig } from "./QrGenerator";

interface ISelectFieldProps {
  name: keyof QrConfig;
  options: string[];
  hideLabel?: boolean;
  tag: string;
  conf?: QrConfig;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField = ({
  name,
  tag,
  options,
  hideLabel,
  handleChange,
  conf,
}: ISelectFieldProps) => {
  return (
    <div className="flex flex-col p-0.5">
      {!hideLabel && (
        <label className="pb-1.5 text-sm font-semibold text-pink-100">
          {tag}
        </label>
      )}
      <select
        name={name}
        onChange={handleChange}
        value={conf ? conf[name] : ""}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        {options.map((option: string, index: number) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
