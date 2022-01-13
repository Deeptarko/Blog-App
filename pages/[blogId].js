import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from '../components/Login';
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
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import { publishBtnState } from "../atoms/navbarAtom";
import testImg from "../public/test-img.png";
const BlogDisplayPage = ({providers}) => {
  const { data: session } = useSession();
  
  const router = useRouter();
  const { blogId } = router.query;
  const [blogData, setBlogData] = useState({});
  const [publishBtn, setPublishBtn] = useRecoilState(publishBtnState);
  setPublishBtn(false);
  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "posts", blogId);
     
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {

        setBlogData(docSnap.data());
      }
    }
    fetchData();
  }, [db]);
  if (!session) return <Login providers={providers} />;
  return (
    <>
      <Navbar />
      <div className=" w-[80vw] lg:w-[45vw] min-h-[85vh] flex flex-col mx-auto">
        <h1 className=" font-bold text-xl  lg:text-3xl font-mono mx-auto">
          {blogData.title}
        </h1>
        {blogData.image && (
          <Image
            src={blogData.image}
            alt="Picture of the author"
            width={300}
            height={300}
          />
        )}
        <p className=" mt-[2rem] lg:mt-[5rem] min-h-[30vh] mx-auto">
          {blogData.postBody}
        </p>
      </div>
    </>
  );
};

export default BlogDisplayPage;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      providers,
      session,
    },
  };
}


