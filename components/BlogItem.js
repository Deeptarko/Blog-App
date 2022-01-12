import React, { useEffect, useState } from "react";
import Image from "next/image";
import testImg from "../public/test-img.png";
import {
  SaveIcon,
  DotsVerticalIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/outline";
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
import { getProviders, getSession, useSession } from "next-auth/react";
const BlogItem = ({ blogTitle, blogBody, blogId }) => {
  const { data: session } = useSession();
  if (!session) return <Login providers={providers} />;

  const [added, setAdded] = useState(false);
  const [deleteActive, setDeleteActive] = useState(false);

  const router = useRouter();
  useEffect(async () => {
    const docRef = doc(db, "users", session.user.uid);
    const docSnap = await getDoc(docRef);
    const blodIds = docSnap.data().bookmarks;
    setAdded(blodIds.includes(blogId));
  }, []);

  useEffect(async () => {
    const docRef = doc(db, "posts", blogId);
    const docSnap = await getDoc(docRef);
    const idFromDatabase = docSnap.data().id;
    setDeleteActive(idFromDatabase == session.user.uid);
  }, []);

  const manageLibrary = async (e) => {
    e.stopPropagation();
    const sessionUserId = session ? session.user.uid : 1;
    const docReference = doc(db, "users", `${sessionUserId}`);
    const docSnap = await getDoc(docReference);
    if (!added) {
      if (docSnap.exists()) {
        const ref = await updateDoc(doc(db, "users", `${sessionUserId}`), {
          username: session.user.name,
          userid: session.user.uid,
          bookmarks: arrayUnion(blogId),
          userImg: session.user.image,
        });
      } else {
        const ref = await setDoc(doc(db, "users", `${sessionUserId}`), {
          username: session.user.name,
          userid: session.user.uid,
          bookmarks: arrayUnion(blogId),
          userImg: session.user.image,
        });
      }
    } else {
      const ref = await updateDoc(doc(db, "users", `${sessionUserId}`), {
        bookmarks: arrayRemove(blogId),
      });
    }
    setAdded(!added);
  };
  const deletePost = async (e) => {
    e.stopPropagation();
    const sessionUserId = session ? session.user.uid : 1;
    const docReference = doc(db, "users", `${sessionUserId}`);
    const docSnap = await getDoc(docReference);
    if (docSnap.exists()) {
      const ref = await updateDoc(doc(db, "users", `${sessionUserId}`), {
        bookmarks: arrayRemove(blogId),
      });
    }
    await deleteDoc(doc(db, "posts", blogId));
  };

  return (
    <div
      className=" w-[100%] h-[15vh] md:ml-[5rem] md:h-[20vh] md:w-[90%] border-2  cursor-pointer border-lime-500 flex mb-4"
      onClick={() => router.push(`/${blogId}`)}
    >
      <div className="heading border-2 border-pink-400 w-[75%]">
        <h1 className=" text-xl font-bold font-Pacifico ">{blogTitle}</h1>
        {/* <p className="font-lobster hidden md:flex"> {blogBody}</p> */}
        <div className="blog-item-bottom flex gap-3  md:mt-5 ">
          <p className="">25 Dec</p>
          <p>12 min read</p>
          {!added && (
            <SaveIcon
              className="w-7 h-7 cursor-pointer"
              onClick={manageLibrary}
            />
          )}
          {added && (
            <CheckIcon
              className="w-7 h-7 cursor-pointer"
              onClick={manageLibrary}
            />
          )}
          <DotsVerticalIcon className="w-7 h-6 cursor-pointer" />
          {deleteActive && (
            <TrashIcon
              className="w-7 h-6 cursor-pointer"
              onClick={deletePost}
            />
          )}
        </div>
      </div>
      <div className="blog-image w-[25%] h-[100%] relative m-0 p-0">
        <Image src={testImg} alt="me" layout="fill" />
      </div>
    </div>
  );
};

export default BlogItem;
