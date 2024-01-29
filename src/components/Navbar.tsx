"use client"
import { useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
    const session = useSession();
    return (
        <div className="text-pink-200 absolute w-full font-semibold bg-gradient-to-t from-[#2e026d] to-purple-900 flex justify-between px-12 py-4 text-2xl">
            <Link href={'/'}>
                shorten.
                </Link>
               {session.data?
                  
           
                <Link href={'/my-urls'} className=" flex items-center gap-3 hover:underline underline-offset-4">
                my urls
               
              
                <div>
                    <img src={session.data?.user.image ?? ""} className="rounded-full w-7 h-7" alt="pfp" />
                </div>
                </Link>
        : <></>
                }
        </div>
    )
}

export default Navbar