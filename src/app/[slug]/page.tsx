
import { notFound, permanentRedirect, redirect, useRouter } from "next/navigation";
import { type Url } from "../../components/Shortener";
import { NextResponse } from "next/server";


export default async function SlugPage({ params }: { params: { slug: string } }) {
    let url = `${process.env.NEXT_PUBLIC_URL}/404`
    if (params.slug in ['404','my-urls']) return NextResponse.next();
    try {
        console.log(params.slug)
        console.log(`${process.env.NEXT_PUBLIC_URL}/api/getURLfromSlug`)
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getURLfromSlug`, {
            method: 'POST',
            body: JSON.stringify({ slug: params.slug }),
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("api called \n\n\n")
        const resJson = await res.json() as Url;
        console.log(resJson)
        if (!resJson) {
            notFound();
        }
        url = resJson.url;
    }
    catch (error) {
        console.log("this is ", params.slug)
        console.log(error);
        return notFound();
    }
    finally{
        return redirect(url);
    }
}