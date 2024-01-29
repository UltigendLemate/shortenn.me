import { eq } from 'drizzle-orm';
import { db } from './index';
import { urls } from './schema';
export const checkSlugAvailable = async (slug: string) => {
    const res = db.select().from(urls).where(
        eq(urls.slug, slug)
    );

    return res;
}