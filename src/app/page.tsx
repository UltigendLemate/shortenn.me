'use client'
import { signIn, useSession } from "next-auth/react";
import Shortener from "../components/Shortener";


export default function HomePage() {
  const session = useSession();
  return (

    <main className="flex flex-col h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-[2.5rem] text-center font-extrabold tracking-tight max-w-2xl w-full text-white sm:text-[4.7rem]">
          Create <span className="text-[hsl(280,100%,70%)]">Short</span> Links
        </h1>
        {session.data ?
          <Shortener /> :
          <button className="px-6 py-3 bg-gradient-to-br  from-indigo-500 to-pink-500 rounded-md md:text-xl " onClick={() => signIn('google')}>Sign In with Google</button>
        }

      </div>
    </main>

  );
}
