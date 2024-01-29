'use client'

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import {NextUIProvider} from "@nextui-org/react";

export default function Provider ({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}): React.ReactNode {
  return <SessionProvider session={session}>
    <NextUIProvider>
    {children}
      </NextUIProvider>
    
  </SessionProvider>
}