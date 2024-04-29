'use client'
import Link from "next/link"
import React from "react"

export default function Homepage(){
  return(
    <div>
    <h2>Welcome to OfferHaus</h2>
    <Link href="/payments">Make a Payment</Link>
    </div>
  )
}

