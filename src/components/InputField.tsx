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
    const colorStyle="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
    const rangeStyle=" accent-violet-500 active:accent-violet-600 "
    let style=""
    if(type=='color')style=colorStyle
    else if(type=='range')style=rangeStyle

    return (
    <div className='flex flex-col p-0.5'>
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
         className={`max-w-44 min-w-20 ${style}`}
          />
    </div>
 )
}