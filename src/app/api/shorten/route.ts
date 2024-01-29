import { db } from "~/server/db";
import { urls } from "~/server/db/schema";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export async function POST(req : Request){
    const {url, slug}  = await req.json() as {slug : string, url : string};
    const finalSlug = slug ? slug : nanoid(6);
    const session = await getServerSession(authOptions)
    
    if(!session){
        return new Response(JSON.stringify({error : "Not authenticated"}), {
            status : 401
        })
    }


    try{

        const newUrl = {
            userId : session?.user.id,
            url : url,
            slug : finalSlug,
        }
        await db.insert(urls).values(newUrl);

    return new Response(JSON.stringify(newUrl), {
        status : 200
    })
}
catch(error){
    console.log(error)
    return new Response(JSON.stringify(error), {
        status : 500
    })
}
    
}