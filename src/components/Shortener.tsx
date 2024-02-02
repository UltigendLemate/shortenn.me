import { type User } from 'next-auth'
import { type FC, useRef, useState, useMemo } from 'react'
import { Check, Loader2, X, XCircle } from 'lucide-react'
import { urlSchema } from '~/server/zodschema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { set, type z } from 'zod';
import { type urls } from '~/server/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { clear } from 'console';




export type Url = InferSelectModel<typeof urls>;
type Status = 'available' | 'unavailable' | 'checking' | 'idle';
type FormData = z.infer<typeof urlSchema>;
const Shortener = () => {
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const [available, setAvailable] = useState<Status>('idle');
    const [slug, setSlug] = useState<string>('');
    const [successUrl, setSuccessUrl] = useState<string>('');


    const { handleSubmit, clearErrors, reset: formReset, setValue, resetField, register, formState: { errors, isSubmitting } } = useForm<FormData>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(urlSchema),
        defaultValues: { slug: '', url: '' },
    })

    function createSlug(text: string) {
        // Define slug rules using a regular expression
        const slugRegex = /^[a-z0-9\-_]+(?:\.[a-z0-9\-_]+)*$/;
        // Convert text to lowercase and remove disallowed characters
        const safeText = text.toLowerCase().replace(/[^a-z0-9\-_]+/g, '');
        // Check if the cleaned text matches the slug pattern
        return safeText;
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearErrors('slug')
        if (e.target.value == '') {
            setAvailable('idle');
            setSlug('');
            return;
        }
        setSlug(createSlug(e.target.value));

        setAvailable('checking');

        if (timerRef) clearTimeout(timerRef.current);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        timerRef.current = setTimeout(async () => {
            try {
                const res = await fetch('/api/getURLfromSlug', {
                    method: 'POST',
                    body: JSON.stringify({ slug: e.target.value }),
                    headers: {
                        'Content-Type': 'application/json'
                    }

                });

                if (!res.ok) setAvailable('available');
                else setAvailable('unavailable');
            }
            catch (error) {
                setAvailable('idle');
                console.log(error)
            }

        }, 450);
    };

    const onSubmit = async (data: FormData) => {

        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                body: JSON.stringify({ slug: data.slug, url: data.url }),
            });
            console.log(res);
            const result = await res.json() as Url;
            if (res.ok) {
                setSuccessUrl(result.slug);
            }
            else {
                setAvailable('unavailable');
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const reset = () => {
        formReset();
        setSlug('');
        setAvailable('idle');
        setSuccessUrl('');
    }



    return <div className='gap-3 grid mx-3 w-full max-w-2xl'>
        <h2 className=' text-2xl md:text-3xl font-semibold'>Shorten a long URL</h2>
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>

            <input type="text" placeholder='Paste the long URL' className={`outline-none  px-4 py-2 bg-opacity-30 bg-pink-300 font-medium rounded-lg text-white w-full
    placeholder:text-pink-100 placeholder:font-normal ${errors.url ? "border-red-500 border-2" : ""}`} {...register('url', {
                required: true, onChange(event) {
                    clearErrors('url');
                },
            })} />

            {errors.url?.message && <p className='text-red-600 font-medium rounded-md p-1 text-xs md:text-sm'>{errors.url?.message}</p>}



            <div className='flex justify-between mt-2 md:mt=0 gap-5 items-end '>
                <div className=''>
                    <label htmlFor="slug" className='block py-2 font-medium'>Domain</label>
                    <input id='slug' disabled type="text" className='text-white w-full px-2.5 py-1 rounded-md outline-none' value="shortenn.me"
                    />

                </div>
                <span className='text-2xl'>/</span>
                <div className='w-full'>
                    <label htmlFor="slug" className='block py-2 font-medium'>Enter backlink</label>
                    <div className={`flex relative bg-opacity-30 bg-pink-300 font-medium rounded-lg ${errors.slug ? "border-red-500 border-2" : ""}`}>
                        <input id='slug' type="text" className='bg-transparent rounded-lg text-white  w-full px-3 py-1 outline-none ' value={slug}
                            {...register('slug', {
                                onChange: onChangeHandler
                            })} />


                        <div className='w-9 flex justify-end items-center p-1'>
                            {
                                available === 'idle' ? <p className='text-sm text-gray-300'> </p> :
                                    available === 'checking' ? <Loader2 className='animate-spin  h-6 w-6' /> :
                                        available === 'available' ? <Check className='text-green-500 h-6 w-6' /> :
                                            available === 'unavailable' ? <X className='text-red-600  h-6 w-6' /> :
                                                <XCircle />

                            }
                        </div>
                    </div>
                    {errors.slug?.message && <p className=' absolute text-red-600 font-medium rounded-md p-1'>{errors.slug?.message}</p>}
                </div>
            </div>

            {successUrl &&
                <div className='bg-purple-800  text-pink-100 text-md md:text-xl font-medium p-4 my-5  rounded-md'>
                    <p className=''>Your short URL is ready!</p>
                    <a className=' underline' href={`/${successUrl}`} target='_blank' rel="noreferrer">{`${process.env.NEXT_PUBLIC_URL}/${successUrl}`} </a>
                </div>
            }

            {successUrl ?
                <button type='reset' className='text-pink-500 disabled:opacity-50 bg-yellow-300 font-bold w-fit py-2  px-4 mb-4 rounded-md'>Shorten one more!</button>
                :
                <button disabled={available == 'unavailable' || available == "checking" || isSubmitting || successUrl != '' || errors.url != undefined || errors.slug != undefined} type='submit' className='text-pink-500 disabled:opacity-50 bg-pink-100 font-bold w-fit mt-4 py-2 px-4 mb-4 rounded-md'>Shorten My Link</button>
            }











        </form>
    </div>
}

export default Shortener