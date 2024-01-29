
import { and, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth';
import { db } from '~/server/db';
import { urls } from '~/server/db/schema';

export async function POST(req : Request){
    try{
    const {slug}  = await req.json() as {slug : string};
    const session = await getServerSession(authOptions);
    if(!session){
        return new Response(JSON.stringify({error : "You are not logged in"}),{status:401});
    }
    const res = await db.delete(urls).where(
        and(
            eq(urls.slug, slug),
            eq(urls.userId, session.user.id)
        )
        ).returning({id : urls.id});

        console.log(res, "res \n\n\n\n\n")
    if(res.length > 0){
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