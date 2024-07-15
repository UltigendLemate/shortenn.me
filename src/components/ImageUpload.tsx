import exp from "constants";
import React from "react";
import toast from "react-hot-toast";
interface IImageUploadFieldProps{
    name:string;
    tag:string
    handleChange:(target:any)=>void;
}
export const ImageUploadField=({name,tag,handleChange}:IImageUploadFieldProps)=>{

    const retrievePathFile=(files:any)=>{
        const file =files[0];
        if(file.type!=='image/png'&&file.type!=='image/jpeg'){
            toast.error('Only png and jpg/jpeg allowed')

        }
        else {
            const target:any={}
            const reader=new FileReader()
            reader.readAsDataURL(file);
            reader.onloadend=(e)=>{
                target.name=name;
                target.value=reader.result
                target.logoName=file.name;
                handleChange({target});
            }
        }
    }
    return (
        <div className="flex flex-col p-1">
            <label className="text-fuchsia-500 font-semibold" >{tag}</label>
            <input 
            type="file"
            accept="image/*"
            name={name}
            onChange={e=>retrievePathFile(e.target.files)}
            />
        </div>
    )
}