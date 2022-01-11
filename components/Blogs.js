import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db, storage } from "../firebase";
import ReactPaginate from "react-paginate";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import BlogItem from "../components/BlogItem";
import UserWidget from "./UserWidget";
import { useRouter } from "next/router";
const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const postsperPage = 4;
  const postsVisited = pageNumber * postsperPage;
  const pageCount = Math.ceil(posts.length / postsperPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayPosts = posts
    .slice(postsVisited, postsVisited + postsperPage)
    .map((post) => (
      <BlogItem
        blogTitle={post.data().title}
        blogBody={post.data().postBody}
        blogId={post.id}
      />
    ));

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "users")), (snapshot) => {
        setUsers(snapshot.docs);
      }),
    [db]
  );

  return (
    <div className="flex">
      <div className="lg:w-[60vw] h-[93vh] md:h-[90vh] w-[97vw]">
        <div className="head flex w-[100%]  justify-center  gap-3 border-2 md:gap-4  md:ml-[5rem] md:w-[30%] ">
          <Link href="">
            <a className="active:font-bold">Following</a>
          </Link>
          <Link href="">
            <a className="active:font-bold ">Recommended</a>
          </Link>
        </div>
        <div className="mt-2">
          <hr />
        </div>

        <div className="blog-content">
          {displayPosts}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>
      </div>
      <div className="border-2 border-red-600 lg:w-[40vw] lg:flex flex-col   min-h-[93vh]  hidden">
        <div className="bg-[#E1F0FF] lg:w-[50%] lg:h-[35%] lg:mt-6 lg:ml-[3rem]">
          <h1 className="font-bold ml-3 mt-3">Writing on TechBlogs</h1>
          <p className="ml-3 mt-2 font-normal cursor-pointer">New Writer FAQ</p>
          <p className="ml-3 mt-2 font-normal cursor-pointer">
            Expert Writing Advice
          </p>
          <p className="ml-3 mt-2 font-normal cursor-pointer">
            Grow your readership
          </p>
          <button className=" text-white bg-black rounded-full p-2 text-xs w-[35%] mt-5 ml-4 cursor-pointer">
            Start Writing
          </button>
        </div>
        <div className="lg:w-[60%] lg:mt-6 lg:h-[35%] lg:ml-[3rem]">
          <h1 className="lg:ml-4 font-xl font-extrabold">Recommended Topics</h1>
          <button className=" rounded-full w-[30%] m-3 bg-[#E6E6E6] h-[20%]">
            Python3
          </button>
          <button className=" rounded-full w-[30%] m-3 bg-[#E6E6E6] h-[20%]">
            Leetcode
          </button>
          <button className=" rounded-full w-[50%] m-3 bg-[#E6E6E6] h-[20%] ">
            Software Architecture
          </button>
          <button className="rounded-full w-[30%] m-3 bg-[#E6E6E6] h-[20%]">
            Nodejs
          </button>
          <button className=" rounded-full w-[30%] m-3 bg-[#E6E6E6] h-[20%]">
            Remote Work
          </button>
          <button className=" rounded-full w-[50%] m-3 bg-[#E6E6E6] h-[20%]">
            Product Development
          </button>
        </div>
        <div className=" mt-6">
          <div className=" w-[70%] ml-[4rem]">
            <h1 className="font-extrabold">Who to follow</h1>
            {users.map((user) => (
              <UserWidget
                name={user.data().username}
                img={user.data().userImg}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
