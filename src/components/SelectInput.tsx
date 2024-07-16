import React from "react";
interface ISelectFieldProps{
    name:string;
    options:string[];
    hideLabel?:boolean;
    tag:string;

    handleChange:(target:any)=>void;
}
export const SelectField=({name,tag,options,hideLabel,handleChange}:ISelectFieldProps)=>{
    return (
        <div className="flex flex-col p-1">
           {!hideLabel&& <label className="text-fuchsia-500 font-semibold" >{tag}</label>}
            <select 
            name={name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                {options.map((option:string,index:number)=>(
                    <option key={index}
                    value={option}
                    >{option}</option>
                ))}
            </select>
        </div>
    )

}