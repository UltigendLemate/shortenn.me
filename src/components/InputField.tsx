import React from 'react'
interface IInputFieldProps{
    name:string;
    type:'color'|'range'|'text';
    min?:number;
    max?: number;
    step?:number;
    defaultValue?:string|number;
    handleChange:(target:any)=> void;
    hideLabel?:boolean;
    value?:string|number;
    tag?:string

}
export const InputField= ({name,type,tag, handleChange,min,max,step,defaultValue,hideLabel,value}:IInputFieldProps)=>{
 return (
    <div className='flex flex-col p-1'>
        {!hideLabel&&<label  className='text-fuchsia-500 font-semibold'>{tag}</label>}
        <input
         type={type}
         name={name}
         id={name}
         onChange={handleChange}
         min={min}
         max={max}
         step={step}
         defaultValue={defaultValue}
         value={value}
          />
    </div>
 )
}