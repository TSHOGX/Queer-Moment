import { NextPage } from "next";
import React, { useState } from "react";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  const [click, setClick] = useState(0);

  const handleClick = () => {
    setClick(click + 1);
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
        src="./title.png"
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

      <motion.img
        src="./you.png"
        alt="title"
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

      <motion.img
        src="./we.png"
        alt="title"
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
    </>
  );
};

export default Home;
