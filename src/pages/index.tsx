import { NextPage } from "next";
import React, { FormEvent, useState } from "react";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  const [click, setClick] = useState(0);
  const [btnYou, setBtnYou] = useState(false);
  const [btnWe, setBtnWe] = useState(false);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Content:", content);
    console.log("Name:", name);
    setContent("");
    setName("");
  };

  const handleClick = () => {
    setClick(click + 1);
  };

  const handleClickBtnYou = () => {
    setBtnYou(!btnYou);
  };

  // TODO: only one button can be active at a time
  const handleClickBtnWe = () => {
    setBtnWe(!btnWe);
  };

  return (
    <>
      <motion.img
        src="./Rectangle 7.png"
        alt="background"
        animate={click >= 1 ? { scale: 2.5 } : { scale: 1.1 }}
        transition={{ duration: 0.5 }}
        initial={{
          position: "fixed",
          top: 240,
        }}
        onClick={handleClick}
      />

      <motion.img
        src="./title.svg"
        alt="title"
        animate={click >= 2 ? { top: 52 } : { top: 385 }}
        transition={{ duration: 0.5 }}
        initial={{
          position: "fixed",
          height: 74.15,
          width: 339.88,
          left: 25,
          top: 385,
        }}
        onClick={handleClick}
      />

      <button onClick={handleClickBtnYou}>
        <motion.img
          src={btnYou ? "./youOpen.svg" : "./you.svg"}
          alt="btnYou"
          animate={click >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          initial={{
            position: "fixed",
            height: 44,
            width: 33,
            left: 19,
            top: 321,
            opacity: 0,
          }}
          onClick={handleClick}
        />
      </button>

      {btnYou ? (
        <div
          style={{
            backgroundImage: "url(./formBg.svg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "fixed",
            height: 331,
            width: 273,
            left: 59,
            top: 278,
            zIndex: 999,
          }}
        >
          <div className=" ml-[16px] mt-4 flex h-[43px] w-[242px] items-center justify-between bg-[#F3D1F9] text-sm text-[#7C7C7C] ">
            <div>添加至</div>
            <div>time</div>
          </div>
          <form
            onSubmit={handleSubmit}
            className=" ml-[16px] mt-1 flex h-60 w-[242px] flex-col gap-2"
          >
            <input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="grow bg-transparent text-center text-sm"
              placeholder="写点什么"
            />

            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-5 bg-[#F3D1F9] text-center text-sm"
              placeholder="你的名字"
            />

            <div className="flex w-full justify-center">
              <button
                type="submit"
                className=" rounded-md bg-[#BE6AFF] px-4 py-[1px] text-sm text-white shadow-sm"
              >
                提 交
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div></div>
      )}

      <button onClick={handleClickBtnWe}>
        <motion.img
          src={btnWe ? "./weOpen.svg" : "./we.svg"}
          alt="btnWe"
          animate={click >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          initial={{
            position: "fixed",
            height: 56,
            width: 53,
            left: 316,
            top: 706,
            opacity: 0,
          }}
          onClick={handleClick}
        />
      </button>

      {btnWe ? (
        <img
          src={"./about.svg"}
          alt="about"
          style={{
            position: "fixed",
            left: 19,
            top: 150,
            zIndex: 999,
          }}
          onClick={handleClick}
        />
      ) : (
        <div></div>
      )}

      <motion.img
        src="./calendar.svg"
        alt="calendar"
        animate={click >= 3 ? { top: 0 } : { top: 1057 }}
        transition={{ duration: 2 }}
        initial={{
          position: "fixed",
          left: 136,
          top: 1057,
        }}
        onClick={handleClick}
      />
    </>
  );
};

export default Home;
