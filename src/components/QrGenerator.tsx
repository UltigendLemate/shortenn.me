/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";
import { useState, useRef } from "react";
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
import { InputField } from "./InputField";
import { SelectField } from "./SelectInput";
import { ImageUploadField } from "./ImageUpload";
import { QrCode } from "lucide-react";
export interface QrConfig {
  ecLevel: EcLevel;
  size: number;
  quietZone: number;
  bgColor: string;
  eyeColor: string;
  qrStyle: QrStyle;
  fgColor: string;
  logoPaddingStyle: LogoPaddingStyle;
  logoPadding: number;
  logoOpacity: number;
  logoHeight: number;
  logoWidth: number;
  logoImage: string;
  eyeradius_corner_1: number;
  eyeradius_corner_2: number;
  eyeradius_corner_3: number;
  eyeradius_corner_4: number;
}
export type EcLevel = "L" | "M" | "Q" | "H";
export const ecLevels: EcLevel[] = ["L", "M", "Q", "H"];
export type QrStyle = "squares" | "dots" | "fluid";
export type LogoPaddingStyle = "square" | "circle";
interface QrGeneratorFieldProps {
  slug: string | undefined;
}

const QrGenerator = ({ slug }: QrGeneratorFieldProps) => {
  const qrRef = useRef<HTMLDivElement>(null);





  const [qrConfig, SetQRconfig] = useState<QrConfig>({
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    SetQRconfig((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const eyeRadiusInput = (id: keyof QrConfig) => {
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
          if (blob) {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
            toast.success("QR code copied to clipboard");
          } else {
            toast.error("Failed to copy QR Code: Blob is null");
          }
        });
      } catch (error) {
        toast.error("Failed to copy QR code");
        console.error("Failed to copy QR code to clipboard", error);
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
              options={ecLevels}
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
