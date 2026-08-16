import {create} from "zustand";


interface WishlistStore {


count:number;


setCount:(count:number)=>void;


}


export const useWishlistStore=create<WishlistStore>((set)=>({


count:0,


setCount(count){

set({
count
})

}


}));