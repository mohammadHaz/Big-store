"use client"

import { FC, useRef, useEffect, useCallback, ReactNode } from "react"

import s from "./Modal.module.css"

import FocusTrap from "@/lib/focus-trap"
import { Cross } from "@/components/icons"

import {
  disableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock"



interface ModalProps {
  className?: string
  children?: ReactNode
  onClose: () => void
}



const Modal: FC<ModalProps> = ({
  children,
  onClose,
}) => {


  const ref = useRef<HTMLDivElement>(null)



  const handleKey = useCallback(
    (event: KeyboardEvent)=>{

      if(event.key === "Escape"){
        onClose()
      }

    },
    [onClose]
  )



  useEffect(()=>{

    const modal = ref.current


    if(modal){

      disableBodyScroll(
        modal,
        {
          reserveScrollBarGap:true
        }
      )


      window.addEventListener(
        "keydown",
        handleKey
      )

    }



    return ()=>{

      clearAllBodyScrollLocks()


      window.removeEventListener(
        "keydown",
        handleKey
      )

    }


  },[handleKey])




  return (

    <div className={s.root}>


      <div
        className={s.modal}
        role="dialog"
        ref={ref}
      >


        <button
          onClick={onClose}
          aria-label="Close modal"
          className={s.close}
        >

          <Cross className="h-6 w-6"/>

        </button>



        <FocusTrap focusFirst>

          {children}

        </FocusTrap>



      </div>


    </div>

  )

}


export default Modal