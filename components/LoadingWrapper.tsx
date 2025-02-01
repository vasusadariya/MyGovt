"use client"

import type React from "react"
import Loading from "./Loading"
import { useLoading } from "@/app/hooks/useLoading"

export default function LoadingWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoading = useLoading(1000) 

  return (
    <>
      <Loading isVisible={isLoading} />
      {!isLoading && children}
    </>
  )
}

