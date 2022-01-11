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
const index = ({providers}) => {
  const { data: session } = useSession();
  if (!session) return <Login providers={providers} />;
  const [posts, setPosts] = useState([]);

  
  const sessionUserId = session ? session.user.uid : "1";
  console.log(sessionUserId);
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

  return (
    <div>
      <Navbar />
      {posts.map((post) => (
        <BlogItem
          blogTitle={post.data().title}
          blogBody={post.data().postBody}
          blogId={post.id}
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



export default index;


