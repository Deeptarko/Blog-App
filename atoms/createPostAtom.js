import { atom } from "recoil";

export const titleState=atom({
    key:"titleState",
    default:''
})
export const inputState=atom({
    key:"ipnutState",
    default:''
})
export const postSavedState=atom({
    key:"postSavedState",
    default:false
})
export const selectedFileState=atom({
    key:"selectedFileState",
    default:null
})