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
} from "../components/ui/dialog"
import html2canvas from 'html2canvas'



import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Link, divider, Input } from "@nextui-org/react";
import { Copy, CornerRightDown, Loader, Loader2, Pencil, PencilIcon, QrCode, Trash2 } from 'lucide-react';
import { set, string } from 'zod';
import { redirect, useRouter } from 'next/navigation';
import { redirectToMyUrls } from '~/app/lib/queries';
import { useRef } from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectInput';
import { ImageUploadField } from './ImageUpload';

function isValidUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    return url.protocol !== ''; // Ensure a protocol is present
  } catch (error) {
    return false; // Invalid URL
  }
}


const UrlCard: FC<Partial<Url> & { loading: boolean }> = ({ url, slug, loading }) => {
  // const loading = true;
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    // defaultOpen: true
  });
  const [newUrl, setNewUrl] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>(); // ['Invalid URL'
  const qrRef=useRef(null)
  const changeUrlSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // e.stopPropagation();
    setIsLoading(true);
    try {
      console.log(newUrl);
      if (!isValidUrl(newUrl)) {
        setError('Please enter a valid URL!');
        return;
      }

      const res = await fetch('/api/editUrl', {
        method: 'POST',
        body: JSON.stringify({ slug: slug, url: newUrl }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.status === 404) {
        setError('There seems to be an error!');
      }
      if (res.status === 500) {
        setError('There seems to be an error on our server!');
      }
      if (res.status === 200) {
        await redirectToMyUrls();
        toast.success('URL changed successfully!');
      }

    }
    catch (error) {
      console.log("error occured: ", error)
    }
    finally {
      setIsLoading(false);
    }


  }
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
    defaultValue={(qrConfig as any)[id]}/>

  }

  const copyClipboard=async ()=> {
    try {
      await copy(`${process.env.NEXT_PUBLIC_URL}/${slug}`)
      toast.success("Link copied to clipboard")
    }
    catch (error){
      toast.error("Failed to copy text")
      console.error("Failed to copy text to clipboard",error)
    }

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

  const deleteUrl = async () => {
    try {
      const res = await fetch('/api/deleteUrl', {
        method: 'POST',
        body: JSON.stringify({ slug: slug }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.status === 404) {
        toast.error('There seems to be an error!');

      }
      if (res.status === 500) {
        toast.error('There seems to be an error on our server!');
      }
      if (res.status === 200) {
        await redirectToMyUrls();
        toast.success('URL deleted successfully!');
      }

    }
    catch (error) {
      toast.error('There seems to be an error!');
      console.log("error occured: ", error)
    }
  }

  return (
    <>
      <div className='p-5 max-w-full overflow-hidden rounded-md bg-gradient-to-tr from-purple-700 to-pink-600 '>
        {loading ?
          <>
            <div className=' flex justify-between'>
              <div className='bg-pink-300 w-1/2 animate-pulse rounded-md h-8' />
              <div className='bg-pink-300 w-1/4 animate-pulse rounded-md h-8' />

            </div>
            <div className=' mt-3  bg-pink-300 w-full animate-pulse rounded-md h-6 '>

            </div>
          </>

          :
          <>
            <div className='text-2xl flex justify-between'>
              <div className='flex items-end gap-6 text-ellipsis'>
                <a href={`${process.env.NEXT_PUBLIC_URL}/${slug}`}>
                  /{slug}
                </a>
                <CornerRightDown />
              </div>
              <div className='flex gap-3 items-end '>
                
                  
            <Dialog >
      <DialogTrigger asChild>
      <div  className=' relative cursor-pointer hover:bg-white hover:text-pink-700  rounded-full w-8 h-8 flex justify-center items-center'>
                  <QrCode />
               

                </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[800px] bg-pink-100">
        <DialogHeader>
          <DialogTitle className='font-semibold text-2xl'>QR Code</DialogTitle>
          <DialogDescription>
         <span className='text-violet-700 font-bold'>Design </span>Your QR Code
          </DialogDescription>
        </DialogHeader>
        
      
        <div className='flex flex-row justify-evenly'>
            <div className='flex flex-col'>
              <div className='flex flex-col'>
              <p className='text-violet-700 font-bold p-.5'>General </p>
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
                min={100}
                max={250}
                />
                <InputField
                name='quietZone'
                tag='Quiet Zone'
                type='range'
                handleChange={handleChange}
                min={0}
                max={20}
                />
                <InputField
                name='bgColor'
                type='color'
                tag="Background Color"
                defaultValue='#ffffff'
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
              <div className='flex flex-col'>
              <p className='text-violet-700 font-bold p-.5'> Eye Configration</p>
                <div className='flex flex-row'>
                  <div>
                  <p className='text-fuchsia-500 font-semibold p-1' >Radius</p>
                    <p className='text-fuchsia-500 font-semibold p-1'>Corner-1 </p>
                  {eyeRadiusInput("eyeradius_corner_1")}
                  <p className='text-fuchsia-500 font-semibold p-1'>Corner-2 </p>
                  {eyeRadiusInput("eyeradius_corner_2")}
                  <p className='text-fuchsia-500 font-semibold p-1'>Corner-3 </p>
                  {eyeRadiusInput("eyeradius_corner_3")}
                  <p className='text-fuchsia-500 font-semibold p-1'>Corner-4 </p>
                  {eyeRadiusInput("eyeradius_corner_4")}
                
                  </div>
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

            <div className='flex flex-col'>
              <div className='flex flex-col'>
              <p className='text-violet-700 font-bold p-.5'>Brand </p>
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
              />
              <InputField
              name='logoHeight'
              tag="Height"
              type='range'
              handleChange={handleChange}
              min={20}
              max={100}
              />
              <InputField
              name='logoOpacity'
              type='range'
              tag="Opacity"
              handleChange={handleChange}
              min={0}
              max={1}
              step={0.1}
              defaultValue={1}
              />
              <InputField
              name='logoPadding'
              type='range'
              tag="Padding"
              handleChange={handleChange}
              min={0}
              max={20}
              step={1}
              defaultValue={2}
              />
              <SelectField 
              name='logoPaddingStyle'
              tag="Padding Stlyle"
              handleChange={handleChange}
              options={['square','circle']}

                              />
              </div>
              <div className='flex flex-col'>
              <p className='text-violet-700 font-bold p-1'>Good To Go </p>
              <div className='flex flex-row'>
              <button className='p-2 m-1 rounded-md text-white font-semibold min-w-20 bg-gradient-to-tr from-purple-700 to-pink-600'  onClick={copyQRCode}>Copy</button>
              <button className='p-2 m-1 rounded-md text-white font-semibold min-w-20 bg-gradient-to-tr from-purple-700 to-pink-600' onClick={downloadQRCode}>Download</button>
              </div>
              <div className='p-1' >
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

              </div>


            </div>
            
          </div>

      </DialogContent>
    </Dialog>


                <div onClick={copyClipboard} className='cursor-pointer hover:bg-white hover:text-pink-700  rounded-full w-8 h-8 flex justify-center items-cenhttps://www.youtube.com/watch?v=R3phIupkMBMter'>
                  <Copy />
                </div>
                <div onClick={onOpen} className='cursor-pointer hover:bg-white hover:text-pink-700  rounded-full w-8 h-8 flex justify-center items-center'>
                  <Pencil />
                </div>
                <Trash2 onClick={deleteUrl} className='cursor-pointer hover:bg-white hover:text-pink-700 p-1 rounded-full w-8 h-8' />
              </div>
            </div>
            <div className=' mt-3  '>
              <Link href={url} className='underline  block truncate text-white underline-offset-4'>
                {url}
              </Link>
            </div>
          </>
        }

      </div>





      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        classNames={{
          base: "bg-pink-200 rounded-md mx-5 md:mx-0",
        }}

      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl">Edit your shortlink</ModalHeader>
              <form onSubmit={async (e) => {
                await changeUrlSubmitForm(e);
                if (!error) {
                  onClose();
                }
              }}>
                <ModalBody >


                  <div className='flex items-end gap-6 text-2xl font-semibold text-ellipsis'>
                    <a href={`${process.env.NEXT_PUBLIC_URL}/${slug}`}>
                      /{slug}
                    </a>
                    <CornerRightDown />
                  </div>
                  <input type="url" placeholder='Paste the new long URL' className={`outline-none  px-4 py-2  bg-violet-400 font-medium rounded-lg text-white w-full ${error ? "border-red-500 border-2" : ""}
    placeholder:text-pink-100 placeholder:font-normal`} value={newUrl}
                    onChange={(e) => { setError(''); setNewUrl(e.target.value) }}
                  />

                  {error && <p className='text-red-600 -my-3 font-medium rounded-md p-1 text-xs md:text-sm'>{error}</p>}

                </ModalBody>
                <ModalFooter className='flex justify-start '>
                  <Button type='submit' className='rounded-md px-3 py-2 bg-gradient-to-tr from-purple-700 to-pink-600 text-white disabled:opacity-55' disabled={isLoading} >
                    {isLoading && <Loader2 className='animate-spin mr-2' />}
                    Confirm
                  </Button>
                  <Button className='rounded-md px-3 py-2 bg-red-600 text-white' onPress={onClose}>
                    Close
                  </Button>

                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


// const UrlCasdfrd: FC<Url> = ({url,slug,createdAt}) => {
//   return <div className='p-4 border-4 border-black'>
//     {url} , {slug}
//   </div>
// }

export default UrlCard