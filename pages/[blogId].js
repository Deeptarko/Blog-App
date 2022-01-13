import React,{useEffect,useState} from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    setDoc,
    collection,
    getDoc,
    deleteDoc,
  } from "firebase/firestore";
  import app, { db, storage } from "../firebase";
  import { useRecoilState, useRecoilValue } from "recoil";
import { publishBtnState } from "../atoms/navbarAtom";
const BlogDisplayPage = () => {
  const router = useRouter();
  const { blogId } = router.query;
  const [blogData,setBlogData]=useState({});
  const [publishBtn,setPublishBtn]=useRecoilState(publishBtnState);
  setPublishBtn(false);
  useEffect( () => {
    async function fetchData(){
      const docRef = doc(db, "posts", blogId);
    const docSnap = await getDoc(docRef);
    setBlogData(docSnap.data());
    }
    fetchData();
    
     
  }, []);
 
  return (
    <div className="border-2 border-green-600 w-[80vw] lg:w-[45vw] min-h-[85vh] flex flex-col mx-auto">
      <h1 className=" font-bold text-xl  lg:text-3xl font-mono">
        {blogData.title}
      </h1>

      <p className="border-2 border-red-500  mt-[2rem] lg:mt-[5rem] min-h-[30vh]">
          {blogData.postBody}
      </p>
    </div>
  );
};

export default BlogDisplayPage;
