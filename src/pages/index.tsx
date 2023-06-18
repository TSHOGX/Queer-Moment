import { NextPage } from "next";
import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import StyledDatePicker from "~/component/datePicker";

const Home: NextPage = () => {
  const [click, setClick] = useState(0);
  const [btnYou, setBtnYou] = useState(false);
  const [btnWe, setBtnWe] = useState(false);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { name, content };
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        console.log("something went wrong");
        //set an error banner
      } else {
        setContent("");
        setName("");
        console.log("form submitted successfully !!!");
        // close the form
      }
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };

  // const handleClickBtnWe = async (e: MouseEvent, id: number) => {
  const fetchOne = async (e: MouseEvent, id: number) => {
    try {
      const response = await fetch("/api/inquiry", {
        method: "GET",
        headers: { "data-range": String(id) },
      });

      if (response.status !== 200) {
        console.log("Something went wrong");
      } else {
        const data = await response.json();
        console.log("Fetched content:", data.oneMsg);
      }
    } catch (error) {
      console.log("There was an error fetching:", error);
    }
  };

  // const handleClickBtnWe = async (e: MouseEvent) => {
  const fetchAll = async (e: MouseEvent) => {
    try {
      const response = await fetch("/api/inquiry", {
        method: "GET",
        headers: { "data-range": "all" },
      });

      if (response.status !== 200) {
        console.log("Something went wrong");
      } else {
        const data = await response.json();
        console.log("Fetched content:", data.allMsg);
      }
    } catch (error) {
      console.log("There was an error fetching:", error);
    }
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

  const controls = useAnimationControls();

  useEffect(() => {
    controls.start((i) => i);
  }, []);

  return (
    <main>
      <motion.img
        src="./Rectangle 7.png"
        alt="background"
        custom={{ scale: 2.5, transition: { duration: 0.5, delay: 1 * 0.5 } }}
        animate={controls}
        className="background-container"
        initial={{
          scale: 1,
        }}
        onClick={handleClick}
      />

      <motion.div
        custom={{
          marginTop: 40,
          transition: { duration: 0.5, delay: 2 * 0.5 },
        }}
        animate={controls}
        // className="homepage"
        initial={{
          marginTop: 385,
        }}
        onClick={handleClick}
      >
        <div>
          <h1>QUEER MOMENT</h1>
        </div>
        <div className="container">
          <p>共同</p>
          <p>度过</p>
        </div>
      </motion.div>

      <button onClick={handleClickBtnYou}>
        <motion.img
          src={btnYou ? "./youOpen.svg" : "./you.svg"}
          alt="btnYou"
          custom={{ opacity: 1, transition: { duration: 0.5, delay: 3 * 0.5 } }}
          animate={controls}
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
          {/* <div className=" ml-[16px] mt-4 flex h-[43px] w-[242px] items-center justify-between bg-[#F3D1F9] text-sm text-[#7C7C7C] ">
            <div>添加至</div>
            <div>time</div>
          </div> */}
          <StyledDatePicker />
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
                disabled={!content || !name}
                className={`rounded-md px-4 py-[1px] text-sm text-white shadow-sm ${
                  !content || !name ? "bg-black" : "bg-[#BE6AFF]"
                }`}
              >
                提 交
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div></div>
      )}

      {/* <button onClick={(e) => handleClickBtnWe(e, 2)}> */}
      <button onClick={handleClickBtnWe}>
        <motion.img
          src={btnWe ? "./weOpen.svg" : "./we.svg"}
          alt="btnWe"
          custom={{ opacity: 1, transition: { duration: 0.5, delay: 3 * 0.5 } }}
          animate={controls}
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
        <div className="intro">
          <div className="intro-container">
            <div className="intro-logo">
              <img src="./image/Screenshot 2023-06-11 at 10.09.17 PM.png" />
            </div>
            <div className="intro-content">
              <p>
                由酷儿群体共同撰写的时刻日记。我们希望文字可以连接时间和故事，连接着曾经、当下和未来的属于酷儿的瞬间。在声音不断被屏蔽、删除的时代，希望这里成为你的安全之地。
                既在，记载，勿忘。 让我们共同度过。
              </p>
            </div>
          </div>
          <div className="intro-contact">联系方式 邮箱： Ins： 小红书： </div>
        </div>
      ) : (
        <div></div>
      )}

      <motion.img
        src="./calendar.svg"
        alt="calendar"
        custom={{ top: 0, transition: { duration: 2, delay: 3 * 0.5 } }}
        animate={controls}
        initial={{
          position: "fixed",
          left: 136,
          top: 1057,
        }}
        onClick={handleClick}
      />
    </main>
  );
};

export default Home;
