'use client'
import { FC, use, useState } from 'react'
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
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Link, divider } from "@nextui-org/react";
import { Copy, CornerRightDown, Loader, Loader2, Pencil, PencilIcon, QrCode, Trash2 } from 'lucide-react';
import { set } from 'zod';
import { redirect, useRouter } from 'next/navigation';
import { redirectToMyUrls } from '~/app/lib/queries';
import { useRef } from 'react';

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
  const [qrConfig,SetQRconfig]=useState({});

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
                
                  
            <Dialog>
      <DialogTrigger asChild>
      <div  className=' relative cursor-pointer hover:bg-white hover:text-pink-700  rounded-full w-8 h-8 flex justify-center items-center'>
                  <QrCode />
               

                </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Qr code</DialogTitle>
          <DialogDescription>
            Share Your QR Code
          </DialogDescription>
        </DialogHeader>
        
          <div className="flex flex-row">
        <div className='p-2'  ref={qrRef}> <QRCode value={`${process.env.NEXT_PUBLIC_URL}/${slug}`}  /></div>
        
          <div className='flex flex-col justify-evenly justify-center'>
            <button  onClick={copyQRCode}>Copy</button>
            <button onClick={downloadQRCode}>Download</button>
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