"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"

const COOKIE_NAME = "accept_cookies"

export const useAcceptCookies = () => {
  const [acceptedCookies, setAcceptedCookies] = useState(true)

  useEffect(() => {
    setAcceptedCookies(!!Cookies.get(COOKIE_NAME))
  }, [])

  const acceptCookies = () => {
    Cookies.set(COOKIE_NAME, "accepted", {
      expires: 365,
    })

    setAcceptedCookies(true)
  }

  return {
    acceptedCookies,
    onAcceptCookies: acceptCookies,
  }
}