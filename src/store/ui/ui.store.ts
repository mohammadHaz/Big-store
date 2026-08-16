import { create } from "zustand";


type SidebarView =
  | "CART_VIEW"
  | "CHECKOUT_VIEW"
  | "PAYMENT_METHOD_VIEW"
  | "MOBILE_MENU_VIEW";


type ModalView =
  | "LOGIN_VIEW"
  | "SIGNUP_VIEW"
  | "FORGOT_VIEW"
  | "NEW_SHIPPING_ADDRESS"
  | "NEW_PAYMENT_METHOD";


interface UIStore {

  displaySidebar:boolean;
  displayDropdown:boolean;
  displayModal:boolean;

  sidebarView:SidebarView;
  modalView:ModalView;
  userAvatar: string;

  openSidebar:()=>void;
  closeSidebar:()=>void;

  openModal:()=>void;
  closeModal:()=>void;

  setSidebarView:(view:SidebarView)=>void;
  setModalView:(view:ModalView)=>void;

  setUserAvatar: (value: string) => void
  closeSidebarIfPresent: () => void
}


export const useUIStore=create<UIStore>((set, get)=>({

displaySidebar:false,
displayDropdown:false,
displayModal:false,

sidebarView:"CART_VIEW",
modalView:"LOGIN_VIEW",
userAvatar: '',

openSidebar(){
 set({
  displaySidebar:true
 })
},


closeSidebar(){
 set({
  displaySidebar:false
 })
},


openModal(){
 set({
  displayModal:true,
  displaySidebar:false
 })
},


closeModal(){
 set({
  displayModal:false
 })
},


setSidebarView(view){
 set({
  sidebarView:view
 })
},


setModalView(view){
 set({
  modalView:view
 })
},

 setUserAvatar(value) {
   set({ userAvatar: value })
  },

  closeSidebarIfPresent() {
    if (get().displaySidebar) set({ displaySidebar: false })
  },
}));