/* eslint-disable @typescript-eslint/no-explicit-any */
import exp from "constants";
import React from "react";
import toast from "react-hot-toast";
import { QrConfig } from "./QrGenerator";

interface IImageUploadFieldProps {
    name: keyof QrConfig;
    tag: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    conf?: QrConfig;
  }
  
  export const ImageUploadField = ({ name, tag, handleChange, conf }: IImageUploadFieldProps) => {
  
    const retrievePathFile = (files: FileList | null) => {
        if (!files) return;
        const file = files[0];
        
        if ( !file || files.length === 0) return;
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.error('Only png and jpg/jpeg allowed');
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const event = {
          target: {
            name: name,
            value: reader.result as string,
          },
        } as React.ChangeEvent<HTMLInputElement>;
  
        handleChange(event);
      };
    };
    return (
        <div className="flex flex-col p-0.5">
            <label className="text-pink-100 font-semibold text-sm pb-1.5" >{tag}</label>
            <input 
            type="file"
            accept="image/*"
            name={name}
          
            onChange={e=>retrievePathFile(e.target.files)}
            className="block max-w-50 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
        </div>
    )
}