"use client"

import cn from "clsx"
import { useEffect, useRef } from "react"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import s from "./Sidebar.module.css"


interface SidebarProps {
  children: React.ReactNode
  onClose: () => void
}


const Sidebar = ({ children, onClose }: SidebarProps) => {

  const sidebarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)


  const onKeyDownSidebar = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {

    if(event.key === "Escape"){
      onClose()
    }

  }



  useEffect(()=>{

    sidebarRef.current?.focus()


    if(contentRef.current){

      disableBodyScroll(
        contentRef.current,
        {
          reserveScrollBarGap:true
        }
      )

    }


    return ()=>{

      clearAllBodyScrollLocks()

    }


  },[])



  return (

    <div
      className={cn(s.root)}
      ref={sidebarRef}
      onKeyDown={onKeyDownSidebar}
      tabIndex={-1}
    >

      <div className="absolute inset-0 overflow-hidden">


        <div
          className={s.backdrop}
          onClick={onClose}
        />


        <section className="
          absolute inset-y-0 right-0
          w-full md:w-auto
          max-w-full flex
          outline-none md:pl-10
        ">


          <div className="
            h-full w-full
            md:w-screen
            md:max-w-md
          ">


            <div
              className={s.sidebar}
              ref={contentRef}
            >

              {children}

            </div>


          </div>


        </section>


      </div>


    </div>

  )

}


export default Sidebar