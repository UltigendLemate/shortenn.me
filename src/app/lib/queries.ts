'use server'
import { desc, eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "~/server/auth"
import { db } from "~/server/db"
import { Url } from "../../components/Shortener"
import { urls } from "~/server/db/schema"
import { permanentRedirect, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export const getMyUrls = async (page: number, limit: number): Promise<Url[] | null> => {
  const session = await getServerSession(authOptions);
  console.log("session \n\n\n\n", session)
  if (!session) return null;
    const res = await db.query.urls.findMany({
      where(fields, operators) {
        return eq(fields.userId, session.user.id);
      },
      orderBy : [desc(urls.updatedAt)],
      limit: limit, // Limit results per page
      offset: (page - 1) * limit, // Skip to page
    });
  
    return res as Url[];
  };

export const totalUrls = async (userId: string) => {
    const res = await db.query.urls.findMany({
      where(fields, operators) {
        return eq(fields.userId, userId);
      },
    });
  
    return res.length;
  };


 export async function redirectToMyUrls (){
  revalidatePath('/my-urls');
    permanentRedirect('/my-urls');
  }