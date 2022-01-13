import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import BlogItem from "../../components/BlogItem";
import Login from '../../components/Login';
import {
  getProviders,
  getSession,
  SessionProvider,
  useSession,
} from "next-auth/react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import { publishBtnState } from "../../atoms/navbarAtom";
const Index = ({providers}) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [publishBtn,setPublishBtn]=useRecoilState(publishBtnState);
  setPublishBtn(false);

  
  const sessionUserId = session ? session.user.uid : "1";
  
  useEffect(() => {
    const getBlogData = async () => {
      const q = query(
        collection(db, "posts"),
        where("id", "==", sessionUserId)
      );

      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs);
    };
    getBlogData();
  }, [sessionUserId]);
  if (!session) return <Login providers={providers} />;
  

  return (
    <div>
      
      {posts.map((post) => (
        <BlogItem
          blogTitle={post.data().title}
          blogBody={post.data().postBody}
          blogId={post.id}
          key={post.id}
        />
      ))}
    </div>
  );
};




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



export default Index;


