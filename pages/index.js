import Navbar from "../components/Navbar";
import Blogs from "../components/Blogs";
import React, { useState, useEffect } from "react";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/Login";
import Head from "next/head";

export default function Home({ providers }) {
  const { data: session } = useSession();
 

  if (!session) return <Login providers={providers} />;

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="../public/blog-icon.jpeg" />
      </Head>
      <Navbar />
      <Blogs />
      {/*  <Widgets/> */}
    </>
  );
}

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
