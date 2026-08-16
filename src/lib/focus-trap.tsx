"use client"

import React, {
  useEffect,
  useRef,
  ReactNode,
} from "react"

import { tabbable } from "tabbable"


interface Props {
  children: ReactNode
  focusFirst?: boolean
}



export default function FocusTrap({
  children,
  focusFirst = false,
}: Props) {


  const root = useRef<HTMLDivElement>(null)

  const anchor = useRef<HTMLElement | null>(null)



  const returnFocus = () => {

    anchor.current?.focus()

  }



  const selectFirstFocusableEl = () => {

    const timer = setInterval(()=>{

      if(!root.current)
        return


      const elements = tabbable(root.current)


      if(elements.length){

        elements[0].focus()

        clearInterval(timer)

      }


    },100)



    setTimeout(()=>{

      clearInterval(timer)

    },6000)

  }




  const trapFocus = () => {

    root.current?.focus()


    if(focusFirst){

      selectFirstFocusableEl()

    }

  }





  useEffect(()=>{


    anchor.current =
      document.activeElement as HTMLElement



    setTimeout(
      trapFocus,
      20
    )



    return ()=>{

      returnFocus()

    }


  },[children])





  return (

    <div
      ref={root}
      className="outline-none focus-trap"
      tabIndex={-1}
    >

      {children}

    </div>

  )

}