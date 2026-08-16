"use client"
import { useEffect } from 'react'
import { useUIStore } from "@store/ui/ui.store"
import { getRandomPairOfColors } from '@lib/colors'

export const useUserAvatar = (name = 'userAvatar') => {
   console.log("useUserAvatar running")

 const { userAvatar, setUserAvatar } = useUIStore()
  useEffect(() => {
      console.log("USE EFFECT START")

    if (!userAvatar && localStorage.getItem(name)) {
      // Get bg from localStorage and push it to the context.
      setUserAvatar(localStorage.getItem(name)  ?? ""  )
    }
    if (!localStorage.getItem(name)) {
      // bg not set locally, generating one, setting localStorage and context to persist.
      const bg = getRandomPairOfColors()
         console.log("effect running")

      const value = `linear-gradient(140deg, ${bg[0]}, ${bg[1]} 100%)`
      localStorage.setItem(name, value)
      setUserAvatar(value)
    }
  }, [name, setUserAvatar, userAvatar])

  return {
    userAvatar,
    setUserAvatar,
  }
}