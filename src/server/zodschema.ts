import z from 'zod';
export const urlSchema = z.object({
    url : z.string().url({message : "Enter a valid URL, for ex : https://long-url.com/shorten-me"}),
    slug : z.string().max(255).regex(/^[a-zA-Z0-9_-]*$/).nullable(),
})