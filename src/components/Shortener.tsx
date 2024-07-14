// import { type User } from 'next-auth'
import { useRef, useState } from "react";
import { Check, Loader2, X, XCircle } from "lucide-react";
import { urlSchema } from "~/server/zodschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { type urls } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

export type Url = InferSelectModel<typeof urls>;
type Status = "available" | "unavailable" | "checking" | "idle";
type FormData = z.infer<typeof urlSchema>;
const Shortener = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [available, setAvailable] = useState<Status>("idle");
  const [slug, setSlug] = useState<string>("");
  const [successUrl, setSuccessUrl] = useState<string>("");

  const {
    handleSubmit,
    clearErrors,
    reset: formReset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(urlSchema),
    defaultValues: { slug: "", url: "" },
  });

  function createSlug(text: string) {
    // Define slug rules using a regular expression
    const slugRegex = /^[a-z0-9\-_]+(?:\.[a-z0-9\-_]+)*$/;
    // Convert text to lowercase and remove disallowed characters
    const safeText = text.toLowerCase().replace(/[^a-z0-9\-_]+/g, "");
    // Check if the cleaned text matches the slug pattern
    return safeText;
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearErrors("slug");
    if (e.target.value == "") {
      setAvailable("idle");
      setSlug("");
      return;
    }
    setSlug(createSlug(e.target.value));

    setAvailable("checking");

    if (timerRef) clearTimeout(timerRef.current);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/getURLfromSlug", {
          method: "POST",
          body: JSON.stringify({ slug: e.target.value }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) setAvailable("available");
        else setAvailable("unavailable");
      } catch (error) {
        setAvailable("idle");
        console.log(error);
      }
    }, 450);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify({ slug: data.slug, url: data.url }),
      });
      console.log(res);
      const result = (await res.json()) as Url;
      if (res.ok) {
        setSuccessUrl(result.slug);
      } else {
        setAvailable("unavailable");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    formReset();
    setSlug("");
    setAvailable("idle");
    setSuccessUrl("");
  };

  return (
    <div className="mx-3 grid w-full max-w-2xl gap-3">
      <h2 className=" text-2xl font-semibold md:text-3xl">
        Shorten a long URL
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <input
          type="text"
          placeholder="Paste the long URL"
          className={`w-full  rounded-lg bg-pink-300 bg-opacity-30 px-4 py-2 font-medium text-white outline-none
    placeholder:font-normal placeholder:text-pink-100 ${errors.url ? "border-2 border-red-500" : ""}`}
          {...register("url", {
            required: true,
            onChange(event) {
              clearErrors("url");
            },
          })}
        />

        {errors.url?.message && (
          <p className="rounded-md p-1 text-xs font-medium text-red-600 md:text-sm">
            {errors.url?.message}
          </p>
        )}

        <div className="md:mt=0 mt-2 flex items-end justify-between gap-5 ">
          <div className="">
            <label htmlFor="slug" className="block py-2 font-medium">
              Domain
            </label>
            <input
              id="slug"
              disabled
              type="text"
              className="w-full rounded-md px-2.5 py-1 text-white outline-none"
              value="shortenn.me"
            />
          </div>
          <span className="text-2xl">/</span>
          <div className="w-full">
            <label htmlFor="slug" className="block py-2 font-medium">
              Enter backlink
            </label>
            <div
              className={`relative flex rounded-lg bg-pink-300 bg-opacity-30 font-medium ${errors.slug ? "border-2 border-red-500" : ""}`}
            >
              <input
                id="slug"
                type="text"
                className="w-full rounded-lg bg-transparent  px-3 py-1 text-white outline-none "
                value={slug}
                {...register("slug", {
                  onChange: onChangeHandler,
                })}
              />

              <div className="flex w-9 items-center justify-end p-1">
                {available === "idle" ? (
                  <p className="text-sm text-gray-300"> </p>
                ) : available === "checking" ? (
                  <Loader2 className="h-6  w-6 animate-spin" />
                ) : available === "available" ? (
                  <Check className="h-6 w-6 text-green-500" />
                ) : available === "unavailable" ? (
                  <X className="h-6  w-6 text-red-600" />
                ) : (
                  <XCircle />
                )}
              </div>
            </div>
            {errors.slug?.message && (
              <p className=" absolute rounded-md p-1 font-medium text-red-600">
                {errors.slug?.message}
              </p>
            )}
          </div>
        </div>

        {successUrl && (
          <div className="text-md  my-5 rounded-md bg-purple-800 p-4 font-medium text-pink-100  md:text-xl">
            <p className="">Your short URL is ready!</p>
            <a
              className=" underline"
              href={`/${successUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              {`${process.env.NEXT_PUBLIC_URL}/${successUrl}`}{" "}
            </a>
          </div>
        )}

        {successUrl ? (
          <button
            type="reset"
            className="mb-4 w-fit rounded-md bg-yellow-300 px-4 py-2  font-bold text-pink-500 disabled:opacity-50"
          >
            Shorten one more!
          </button>
        ) : (
          <button
            disabled={
              available == "unavailable" ||
              available == "checking" ||
              isSubmitting ||
              successUrl != "" ||
              errors.url != undefined ||
              errors.slug != undefined
            }
            type="submit"
            className="mb-4 mt-4 w-fit rounded-md bg-pink-100 px-4 py-2 font-bold text-pink-500 disabled:opacity-50"
          >
            Shorten My Link
          </button>
        )}
      </form>
    </div>
  );
};

export default Shortener;
