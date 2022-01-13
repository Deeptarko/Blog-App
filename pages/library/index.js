import React, { useEffect, useState } from "react";
import { getProviders, getSession, useSession } from "next-auth/react";
import { doc, getDoc } from "@firebase/firestore";
import { db, storage } from "../../firebase";
import Login from "../../components/Login";
import Navbar from "../../components/Navbar";
import BlogItem from "../../components/BlogItem";
import { fetchData } from "next-auth/client/_utils";
import { useRecoilState, useRecoilValue } from "recoil";
import { publishBtnState } from "../../atoms/navbarAtom";
const Index = () => {
  
  const { data: session } = useSession();
  const userId = session.user.uid;
  const [blogId, setBlogId] = useState([]);
  const [publishBtn,setPublishBtn]=useRecoilState(publishBtnState);
  const [posts, setPosts] = useState([]);
  setPublishBtn(false);
  useEffect(async () => {
    async function fetchData(){
      const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());
    setBlogId(docSnap.data().bookmarks);
    }
    fetchData();
  }, []);

  useEffect(async () => {
    const tempArr = posts.slice();
    for (let i = 0; i < blogId.length; i++) {
      const docRef = doc(db, "posts", blogId[i]);
      const docSnap = await getDoc(docRef);

      tempArr.push(docSnap);
    }
    setPosts(tempArr);
  }, [blogId]);
  if (!session) return <Login providers={providers} />;
  





  return (
    <div>
     
      {posts.map((post) => (
        <BlogItem
          blogTitle={post.data().title}
          blogBody={post.data().postBody}
          blogId={post.id}
          imageUrl={post.data().image}
          key={post.id}
        />
      ))}
    </div>
  );
};

export default Index;

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
