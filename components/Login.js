import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import blogIcon from '../public/blog-icon.jpeg';
const Login = ({ providers }) => {
  // console.log(providers)
  return (
    <div className="bg-[#111827] h-[100vh]">
      <div className="flex flex-col items-center space-y-20 pt-48 ">
        <Image
          src={blogIcon}
          width={150}
          height={150}
          objectFit="contain"
          alt="Blog Icon"
        />
        <div className="">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <a
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                href="#_"
                className="relative inline-flex mb-4 items-center justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all bg-blue-600 rounded-full hover:bg-white group"
              >
                <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600">
                  Sign in with {provider.name}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;

