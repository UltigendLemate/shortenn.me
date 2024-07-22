"use client";
import { useState } from "react";

import toast from "react-hot-toast";
import { QRCode } from "react-qrcode-logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import html2canvas from "html2canvas";
import React from "react";
import { useRef } from "react";
import { InputField } from "./InputField";
import { SelectField } from "./SelectInput";
import { ImageUploadField } from "./ImageUpload";
import { QrCode } from "lucide-react";

const QrGenerator = ({ slug }: { slug: string }) => {
  const qrRef = useRef(null);
  // const [qrConfig,SetQRconfig]=useState<{[key:string]:any}>({});
  const [qrConfig, SetQRconfig] = useState({
    ecLevel: "L",
    size: 150,
    quietZone: 2,
    bgColor: "#ffffff",
    eyeColor: "#000000",
    qrStyle: "squares",
    fgColor: "#000000",
    logoPaddingStyle: "square",
    logoPadding: 2,
    logoOpacity: 1,
    logoHeight: 20,
    logoWidth: 20,
    logoImage: "",
    eyeradius_corner_1: 0,
    eyeradius_corner_2: 0,
    eyeradius_corner_3: 0,
    eyeradius_corner_4: 0,
  });
  const handleChange = ({ target }: any) => {
    // if(target.name==="eyeradius_inner"||"eyeradius_outer")
    SetQRconfig((preState) => ({
      ...preState,
      [target.name]: target.value,
    }));
  };
  const eyeRadiusInput = (id: string) => {
    return (
      <InputField
        name={id}
        type="range"
        handleChange={handleChange}
        min={0}
        max={50}
        conf={qrConfig}
      />
    );
  };

  const copyQRCode = async () => {
    if (qrRef.current) {
      try {
        const canvas = await html2canvas(qrRef.current);
        canvas.toBlob((blob) => {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]);
          toast.success("Qr code copied to clipboard");
        });
      } catch (error) {
        toast.error("Faild to copy QR code");
        console.error("failed to copy QR code to clipboard", error);
      }
    }
  };
  const downloadQRCode = async () => {
    if (qrRef.current) {
      try {
        const canvas = await html2canvas(qrRef.current);
        const link = document.createElement("a");
        link.download = `${slug}-qrcode.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        toast.error("Failed to download QR code");
        console.error("Failed to download QR code", error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className=" relative flex h-8 w-8  cursor-pointer items-center justify-center rounded-full hover:bg-white hover:text-pink-700">
          <QrCode />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[1000px] bg-purple-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            QR Code
          </DialogTitle>
          <DialogDescription className="text-gray-200">
            <span className="font-bold text-pink-300">Design </span>Your QR Code
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[65vh] grid-cols-10 flex-row justify-between gap-7 overflow-y-auto ">
          <div className="col-span-2 flex flex-col space-y-3">
            <p className="p-.5 font-bold text-pink-300">General </p>

            <SelectField
              name="ecLevel"
              tag="Ec Level"
              options={["L", "M", "Q", "H"]}
              conf={qrConfig}
              handleChange={handleChange}
            />
            <InputField
              name="size"
              tag="Size"
              type="range"
              handleChange={handleChange}
              min={150}
              max={275}
              conf={qrConfig}
            />
            <InputField
              name="quietZone"
              tag="Quiet Zone"
              type="range"
              handleChange={handleChange}
              min={0}
              max={20}
              conf={qrConfig}
            />
            <InputField
              name="bgColor"
              type="color"
              tag="Background Color"
              defaultValue="#ffffff"
              handleChange={handleChange}
              conf={qrConfig}
            />
            <InputField
              name="fgColor"
              type="color"
              tag="Foreground Color"
              handleChange={handleChange}
              conf={qrConfig}
            />
          </div>

          <div className="col-span-2 flex flex-col space-y-3">
            <p className="font-bold text-pink-300">Brand </p>
            <ImageUploadField
              name="logoImage"
              tag="Logo"
              conf={qrConfig}
              handleChange={handleChange}
            />
            <InputField
              name="logoWidth"
              type="range"
              tag="Width"
              handleChange={handleChange}
              min={20}
              max={60}
              conf={qrConfig}
            />
            <InputField
              name="logoHeight"
              tag="Height"
              type="range"
              handleChange={handleChange}
              min={20}
              max={60}
              conf={qrConfig}
            />
            <InputField
              name="logoOpacity"
              type="range"
              tag="Opacity"
              handleChange={handleChange}
              min={0}
              max={1}
              step={0.1}
              conf={qrConfig}
            />
            <InputField
              name="logoPadding"
              type="range"
              tag="Padding"
              handleChange={handleChange}
              min={0}
              max={10}
              step={1}
              conf={qrConfig}
            />
            {/* <SelectField
                  name="logoPaddingStyle"
                  tag="Padding Stlyle"
                  handleChange={handleChange}
                  conf={qrConfig}
                  options={["square", "circle"]}
                /> */}
            <SelectField
              name="qrStyle"
              tag="QR Style"
              options={["squares", "dots", "fluid"]}
              conf={qrConfig}
              handleChange={handleChange}
            />
          </div>

          <div className="col-span-2 flex flex-col space-y-3">
            <p className="font-bold text-pink-300"> Eye Configration</p>
            <div className="flex flex-col space-y-3">
              <div>
                {" "}
                <p className="p-1  font-semibold text-pink-100">
                  Corner-1 Radius{" "}
                </p>
                {eyeRadiusInput("eyeradius_corner_1")}
              </div>
              <div>
                {" "}
                <p className="p-1  font-semibold text-pink-100">
                  Corner-2 Radius{" "}
                </p>
                {eyeRadiusInput("eyeradius_corner_2")}
              </div>
              <div>
                {" "}
                <p className="p-1  font-semibold text-pink-100">
                  Corner-3 Radius{" "}
                </p>
                {eyeRadiusInput("eyeradius_corner_3")}
              </div>
              <div>
                {" "}
                <p className="p-1  font-semibold text-pink-100">
                  Corner-4 Radius{" "}
                </p>
                {eyeRadiusInput("eyeradius_corner_4")}
              </div>

              {/* </div> */}
              <div>
                <InputField
                  name="eyeColor"
                  type="color"
                  tag="Color"
                  conf={qrConfig}
                  handleChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-3 justify-center">

            <div ref={qrRef} className="w-full !*:w-full ">
              <QRCode
                value={`${process.env.NEXT_PUBLIC_URL}/${slug}`}
                {...{
                  ...qrConfig,
                  eyeRadius: [
                    {
                      outer: [
                        qrConfig.eyeradius_corner_1,
                        qrConfig.eyeradius_corner_2,
                        qrConfig.eyeradius_corner_3,
                        qrConfig.eyeradius_corner_4,
                      ],
                      inner: [
                        qrConfig.eyeradius_corner_1,
                        qrConfig.eyeradius_corner_2,
                        qrConfig.eyeradius_corner_3,
                        qrConfig.eyeradius_corner_4,
                      ],
                    },
                    {
                      outer: [
                        qrConfig.eyeradius_corner_1,
                        qrConfig.eyeradius_corner_2,
                        qrConfig.eyeradius_corner_3,
                        qrConfig.eyeradius_corner_4,
                      ],
                      inner: [
                        qrConfig.eyeradius_corner_1,
                        qrConfig.eyeradius_corner_2,
                        qrConfig.eyeradius_corner_3,
                        qrConfig.eyeradius_corner_4,
                      ],
                    },
                    {
                      outer: [
                        qrConfig.eyeradius_corner_1,
                        qrConfig.eyeradius_corner_2,
                        qrConfig.eyeradius_corner_3,
                        qrConfig.eyeradius_corner_4,
                      ],
                      inner: [
                        qrConfig.eyeradius_corner_1,
                        qrConfig.eyeradius_corner_2,
                        qrConfig.eyeradius_corner_3,
                        qrConfig.eyeradius_corner_4,
                      ],
                    },
                  ],
                }}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex flex-row justify-center gap-5">
                <button
                  className="m-1 min-w-20 rounded-md bg-gradient-to-tr from-purple-700 to-pink-600 p-2 font-semibold text-white"
                  onClick={copyQRCode}
                >
                  Copy
                </button>
                <button
                  className="m-1 min-w-20 rounded-md bg-gradient-to-tr from-purple-700 to-pink-600 p-2 font-semibold text-white"
                  onClick={downloadQRCode}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default QrGenerator;
