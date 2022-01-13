import React from "react";
import { BookmarkIcon, BellIcon } from "@heroicons/react/outline";
import { Menu } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { publishBtnState } from "../atoms/navbarAtom";
import {
  inputState,
  titleState,
  postSavedState,
  selectedFileState,
} from "../atoms/createPostAtom";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import Link from "next/link";
import Image from "next/image";
import Alert from "./Alert";

const Navbar = () => {
  const { data: session } = useSession();
  const [btnState, setBtnState] = useRecoilState(publishBtnState);
  const [postSaved, setPostSaved] = useRecoilState(postSavedState);
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileState);
  const title = useRecoilValue(titleState);
  const input = useRecoilValue(inputState);

  const sendPost = async () => {
    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      title: title,
      postBody: input,
      timestamp: serverTimestamp(),
    });
    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadUrl,
        });
      });
    }
    if (docRef) {
      setPostSaved(true);
    }
    setSelectedFile(null);
  };
  return (
    <div className="flex h-[7vh] md:h-[10vh] md:shadow-md ">
      <div className="icon w-[30vw]  flex items-center justify-center">
        <h1 className="font-cursive text-3xl ml-5 md:ml-0">TechBlogs</h1>
      </div>
      <div className="flex w-[70vw]  justify-end ">
        <div className="menu flex items-center gap-4">
          {btnState && (
            <button
              className="rounded-2xl p-1 bg-green-600 text-white text-xs md:w-[4rem] w-[4rem] hover:bg-green-800"
              onClick={sendPost}
            >
              Publish
            </button>
          )}
          <Link href="/library">
          <a className="cursor-pointer" >
            <BookmarkIcon className="w-7 h-7" />
          </a>
          </Link>
          <BellIcon className="w-7 h-7" />
          <div className="profile w-10 h-10  rounded-full  md:mr-4 mr-5 lg:mr-[15rem] ">
            <Menu>
              <Menu.Button>
                {" "}
                <Image
                  src={session ? session.user.image : "/public/test-img.png"}
                  width="70"
                  height="70"
                  className="rounded-full"
                />
              </Menu.Button>
              <Menu.Items className="flex flex-col bg-white transition ease-in-out delay-150 md:gap-3 w-[50vw] md:w-[10vw] top-[3.25rem] left-[10.25rem] absolute md:fixed md:left-[80%] z-10   md:mt-7 shadow-md items-center justify-center ">
                <Menu.Item>
                  {({}) => (
                    <Link href="/">
                      <a className="hover:font-extrabold">Home</a>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({}) => (
                    <Link href="/myPost">
                      <a className="hover:font-extrabold">My Posts</a>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({}) => (
                    <Link href="/createPost">
                      <a className="hover:font-extrabold">Create Post</a>
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({}) => (
                    <Link href="/">
                      <a className="hover:font-extrabold" onClick={signOut}>
                        Logout
                      </a>
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
