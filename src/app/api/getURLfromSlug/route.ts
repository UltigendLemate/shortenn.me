
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { urls } from '~/server/db/schema';

export async function POST(req : Request){
    try{
    const {slug}  = await req.json() as {slug : string};

    const res = await db.query.urls.findFirst({
        where(fields, operators) {
            return eq(fields.slug, slug);
        },
    });


    if(res){
        return new Response(JSON.stringify(res),{status:200});
    }
    else{
        return new Response(JSON.stringify(res),{status:404});
    }
    }

    catch(error){
        console.log(error);
        return new Response(JSON.stringify(error),{status:500});
    }
}