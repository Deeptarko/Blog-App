import React, { useEffect, useState } from "react";
import { getProviders, getSession, useSession } from "next-auth/react";
import {

  doc,
  getDoc,
} from "@firebase/firestore";
import { db, storage } from "../../firebase";
import Login from "../../components/Login";
const index = () => {
  const { data: session } = useSession();
  if (!session) return <Login providers={providers} />;
  const userId = session.user.uid;
  const [blogId, setBlogId] = useState([]);

  useEffect(async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    setBlogId(docSnap.data().bookmarks);
  }, []);

  return (
    <div>
      <h1>Library</h1>
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
