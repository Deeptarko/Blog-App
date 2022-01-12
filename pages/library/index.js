import React, { useEffect, useState } from "react";
import { getProviders, getSession, useSession } from "next-auth/react";
import { doc, getDoc } from "@firebase/firestore";
import { db, storage } from "../../firebase";
import Login from "../../components/Login";
import Navbar from "../../components/Navbar";
import BlogItem from "../../components/BlogItem";
const index = () => {
  const { data: session } = useSession();
  if (!session) return <Login providers={providers} />;
  const userId = session.user.uid;
  const [blogId, setBlogId] = useState([]);

  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());
    setBlogId(docSnap.data().bookmarks);
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



  return (
    <div>
     
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

export default index;

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
