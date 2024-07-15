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