import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { getProviders, getSession, useSession } from "next-auth/react";
import {
  PlusCircleIcon,
  PhotographIcon,
  EmojiHappyIcon,
  XCircleIcon,
  XIcon
} from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { publishBtnState } from "../../atoms/navbarAtom";
import {
  inputState,
  postSavedState,
  selectedFileState,
  titleState,
} from "../../atoms/createPostAtom";
import Alert from "../../components/Alert";
import Login from '../../components/Login';
const Index = ({providers}) => {
  const { data: session } = useSession();
  
  const [btnState, setBtnState] = useRecoilState(publishBtnState);
  const [input, setInput] = useRecoilState(inputState);
  const [title, setTitle] = useRecoilState(titleState);
  const [postSaved, setPostSaved] = useRecoilState(postSavedState);
  const [displayOptions, setDisplayOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileState);
  
  const filePickerRef = useRef(null);
  if (!session) return <Login providers={providers} />;
  setBtnState(true);
  const style = {
    height: "180px",
  };
  function resizeTextArea(ev) {
    console.log(ev.target.style.height);
    console.log(ev.target.scrollHeight);
    ev.target.style.height = ev.target.scrollHeight + 12 + "px";
  }

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <>
      <Navbar/>
      <div className="add-features  w-10 h-10 absolute md:left-40 md:top-60 cursor-pointer">
        <PlusCircleIcon
          onClick={() => {
            setDisplayOptions(!displayOptions);
          }}
        />
        {displayOptions && (
          <div className="feature-options md:w-[2rem] md:h-[10rem] md:static md:rotate-0 rotate-[-90deg] fixed top-9 left-[4rem]  h-[5rem] w-[2rem]  md:ml-1  border-2 border-purple-600">
            <ul>
              <li>
                <PhotographIcon
                  className="rotate-90 md:rotate-0"
                  onClick={() => filePickerRef.current.click()}
                />
                <input
                  type="file"
                  onChange={addImageToPost}
                  ref={filePickerRef}
                  hidden
                />
              </li>
              {/* <li>
                <EmojiHappyIcon className="rotate-90 md:rotate-0" />
              </li> */}
            </ul>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-12 md:mt-2">
        <div className="create-post-container md:w-[60vw] md:min-h-[90vh] min-h-[80vh] md:mt-5 border-2 border-red-500 ">
          {!postSaved && (
            <input
              type="text"
              name="title"
              id=""
              placeholder="Title"
              className="w-full text-5xl font-title font-bold"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          )}
          {selectedFile && (
            <div className="image-display  md:h-[50vh]  md:w-[60%] md:m-auto md:mt-4 flex">
              <img
                src={selectedFile}
                alt="Alt"
                className="max-h-[50vh] max-w-[70%]"
              />
              <XIcon className="w-7 h-7  cursor-pointer" onClick={()=>{setSelectedFile(null)}}/>
            </div>
          )}
          {postSaved && <Alert />}
          <textarea
            onKeyUp={resizeTextArea}
            name="post"
            placeholder="Write your blog"
            className="w-full  md:mt-6 font-3xl md:min-h-[60%] mt-4 min-h-[70%] overflow-hidden border-0 outline-none"
            style={style}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></textarea>
        </div>
      </div>
    </>
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
