'use client'
import { FC, MutableRefObject, use, useState } from 'react'
import { Url } from './Shortener'
import copy from 'clipboard-copy'
import toast from 'react-hot-toast';
import {QRCode} from 'react-qrcode-logo'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "./ui/dialog"
import html2canvas from 'html2canvas'
import React from "react";
import { useRef } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectInput';
import { ImageUploadField } from './ImageUpload';
import { QrCode } from 'lucide-react';
import { string } from 'zod';
const QrGenerator=({slug}:{slug:string})=>{
  const qrRef=useRef(null)
  const [qrConfig,SetQRconfig]=useState<{[key:string]:any}>({});
  const handleChange=({target}:any)=>{
    // if(target.name==="eyeradius_inner"||"eyeradius_outer")
    SetQRconfig((preState)=>({
      ...preState,
      [target.name]:target.value
    }))

  }
  const eyeRadiusInput=(id:string)=>{
    return <InputField
    name={id}
    type='range'
    handleChange={handleChange}
    min={0}
    max={50}
    defaultValue={(qrConfig as any)[id]|0}/>

  }


const copyQRCode =async ()=>{
  if(qrRef.current){
    try {
      const canvas=await html2canvas(qrRef.current)
      canvas.toBlob(blob=>{
        const item =new ClipboardItem({'image/png':blob})
        navigator.clipboard.write([item]);
        toast.success('Qr code copied to clipboard')
      })
    }
    catch(error){
      toast.error("Faild to copy QR code")
      console.error("failed to copy QR code to clipboard",error)
    }

  }
}
const downloadQRCode =async ()=>{
  if (qrRef.current) {
    try {
      const canvas = await html2canvas(qrRef.current);
      const link = document.createElement('a');
      link.download = `${slug}-qrcode.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      toast.error('Failed to download QR code');
      console.error('Failed to download QR code', error);
    }
  }
}

return (
  <Dialog >
  <DialogTrigger asChild>
  <div  className=' relative cursor-pointer hover:bg-white hover:text-pink-700  rounded-full w-8 h-8 flex justify-center items-center'>
              <QrCode />
           

            </div>
  </DialogTrigger>
  <DialogContent className="w-full max-w-[1000px] bg-purple-900">
    <DialogHeader>
      <DialogTitle className='font-bold text-2xl text-white'>QR Code</DialogTitle>
      <DialogDescription className='text-gray-200'>
     <span className='text-pink-300 font-bold'>Design </span>Your QR Code
      </DialogDescription>
    </DialogHeader>
    
  <div className='flex flex-row justify-evenly max-h-[65vh] overflow-y-auto'>
    <div className='flex flex-wrap gap-5  '>
      
        <div className='flex flex-col m-1 '>
          <div className='flex flex-col'>
          <p className='text-pink-300 font-bold p-.5'>General </p>
            <SelectField
            name='ecLevel'
            tag="Ec Level"
            options={['L','M','Q','H']}

            handleChange={handleChange}
            />
            <InputField
            name='size'
            tag="Size"
            type='range'
            handleChange={handleChange}
            min={150}
            max={275}
            defaultValue={qrConfig['size']|200}

            />
            <InputField
            name='quietZone'
            tag='Quiet Zone'
            type='range'
            handleChange={handleChange}
            min={0}
            max={20}
            defaultValue={qrConfig['quietZone']|2}
            />
            <InputField
            name='bgColor'
            type='color'
            tag="Background Color"
            defaultValue="#ffffff"
            handleChange={handleChange}
            />
            <InputField
            name='fgColor'
            type='color'
            tag="Foreground Color"
            defaultValue='#000000'
            handleChange={handleChange}
            />
            <SelectField
            name='qrStyle'
            tag='QR Style'
            options={['squares','dots','fluid']}
            handleChange={handleChange}
            />

          </div>
         
        </div>

        <div className='flex flex-col m-1'>
          <div className='flex flex-col'>
          <p className='text-pink-300  font-bold p-.5'>Brand </p>
          <ImageUploadField
          name='logoImage'
          tag="Logo"
          handleChange={handleChange}
          />
          <InputField 
          name='logoWidth'
          type='range'
          tag='Width'
          handleChange={handleChange}
          min={20}
          max={100}
          defaultValue={qrConfig['logoWidth']|20}
          />
          <InputField
          name='logoHeight'
          tag="Height"
          type='range'
          handleChange={handleChange}
          min={20}
          max={100}
          defaultValue={qrConfig['logoHeight']|20}
          />
          <InputField
          name='logoOpacity'
          type='range'
          tag="Opacity"
          handleChange={handleChange}
          min={0}
          max={1}
          step={0.1}
          defaultValue={qrConfig['logoOpacity']|1}
          />
          <InputField
          name='logoPadding'
          type='range'
          tag="Padding"
          handleChange={handleChange}
          min={0}
          max={20}
          step={1}
          defaultValue={qrConfig['logoPadding']|2}
          />
          <SelectField 
          name='logoPaddingStyle'
          tag="Padding Stlyle"
          handleChange={handleChange}
          options={['square','circle']}

                          />
          </div>
        


        </div>
        <div className='flex flex-col m-1'>
          <p className='text-pink-300  font-bold p-.5'> Eye Configration</p>
            <div className='flex flex-col'>
              {/* <div> */}
              <p className='text-pink-100  font-semibold p-1' >Radius</p>
              <div className='flex flex-col'>

               <div> <p className='text-pink-100  font-semibold p-1'>Corner-1 </p>
              {eyeRadiusInput("eyeradius_corner_1")}
              </div>
              <div> <p className='text-pink-100  font-semibold p-1'>Corner-2 </p>
              {eyeRadiusInput("eyeradius_corner_2")}
              </div>
              <div> <p className='text-pink-100  font-semibold p-1'>Corner-3 </p>
              {eyeRadiusInput("eyeradius_corner_3")}
              </div>
              <div> <p className='text-pink-100  font-semibold p-1'>Corner-4 </p>
              {eyeRadiusInput("eyeradius_corner_4")}
              </div>

             
            
              </div>
                
              {/* </div> */}
              <div>
             
            <InputField

            name='eyeColor'
            type='color'
            tag="Color"
            defaultValue={qrConfig.fgColor??"#000000"}
            handleChange={handleChange}
          />
              </div>
            </div>

          </div>

        
      </div>
      <div className='' >
      <p className='text-pink-300  font-bold p-1'>Good To Go </p>
    
          <div>
          
            <span ref={qrRef} 
            className='inline-block'
            >

         
             <QRCode  value={`${process.env.NEXT_PUBLIC_URL}/${slug}`}  
      {
        ...{
          ...qrConfig,
          eyeRadius:[
            {
              outer:[qrConfig.eyeradius_corner_1,qrConfig.eyeradius_corner_2,qrConfig.eyeradius_corner_3,qrConfig.eyeradius_corner_4],
              inner:[qrConfig.eyeradius_corner_1,qrConfig.eyeradius_corner_2,qrConfig.eyeradius_corner_3,qrConfig.eyeradius_corner_4],
            },
            {
              outer:[qrConfig.eyeradius_corner_1,qrConfig.eyeradius_corner_2,qrConfig.eyeradius_corner_3,qrConfig.eyeradius_corner_4],
              inner:[qrConfig.eyeradius_corner_1,qrConfig.eyeradius_corner_2,qrConfig.eyeradius_corner_3,qrConfig.eyeradius_corner_4],
            },
            {
              outer:[qrConfig.eyeradius_corner_1,qrConfig.eyeradius_corner_2,qrConfig.eyeradius_corner_3,qrConfig.eyeradius_corner_4],
              inner:[qrConfig.eyeradius_corner_1,qrConfig.eyeradius_corner_2,qrConfig.eyeradius_corner_3,qrConfig.eyeradius_corner_4],
            }
            
          ]
          
        }
      }
      />
         </span>
      </div>
      <div className='flex flex-col'>
          <div className='flex flex-row justify-evenly'>
          <button className='p-2 m-1 rounded-md text-white font-semibold min-w-20 bg-gradient-to-tr from-purple-700 to-pink-600'  onClick={copyQRCode}>Copy</button>
          <button className='p-2 m-1 rounded-md text-white font-semibold min-w-20 bg-gradient-to-tr from-purple-700 to-pink-600' onClick={downloadQRCode}>Download</button>
          </div>
         

          </div>
      </div>
      </div>

  </DialogContent>
</Dialog>

)

}
export default QrGenerator
