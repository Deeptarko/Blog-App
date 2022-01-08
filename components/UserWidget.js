import React from "react";
import Image from "next/image";
import testImg from  '../public/test-img.png';
const UserWidget = ({name,img}) => {
  return (
    <div className="flex mt-4  ">
      <Image
        src={img}
        alt="Picture of the author"
        width="50"
        height="50"
        className="rounded-full"
      />
      <div>
            <p className="font-bold ml-2">{name}</p>
            <p className="ml-2">Tech Lead</p>
      </div>
      <div className=" ml-[30%]">
          <button className="border-2 border-black rounded-full p-2 w-[6rem] cursor-pointer ">Follow</button>
      </div>
    </div>
  );
};

export default UserWidget;
