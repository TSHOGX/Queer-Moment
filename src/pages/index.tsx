import { NextPage } from "next";
import React, {
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useAnimationControls } from "framer-motion";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface Post {
  id: number;
  name: string;
  date: string;
}

interface Datas {
  allMsg: Post[];
}

interface Data {
  oneMsg: Post[];
}

const Home: NextPage = () => {
  const [btnYou, setBtnYou] = useState(false);
  const [btnWe, setBtnWe] = useState(false);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [posts, setPosts] = useState<Post[]>([]);
  // const [showBar, setShowBar] = useState(false);
  const [newPost, setNewPost] = useState("");
  const scrollToRef = useRef<HTMLLIElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { selectedDate, name, content };
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        console.log("something went wrong");
      } else {
        setContent("");
        setName("");
        setBtnYou(false);
        // setShowBar(true);
        setNewPost(selectedDate?.toString() + name + content);
        console.log("form submitted successfully !!!");
      }
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };

  const fetchOne = async (e: MouseEvent, id: number) => {
    try {
      const response = await fetch("/api/inquiry", {
        method: "GET",
        headers: { "data-range": String(id) },
      });

      if (response.status !== 200) {
        console.log("Something went wrong");
      } else {
        const data: Data = await response.json();
        console.log("Fetched content:", data.oneMsg);
      }
    } catch (error) {
      console.log("There was an error fetching:", error);
    }
  };

  const fetchAll = async () => {
    try {
      const response = await fetch("/api/inquiry", {
        method: "GET",
        headers: { "data-range": "all" },
      });
      if (response.status !== 200) {
        console.log("Something went wrong");
      } else {
        const data: Datas = await response.json();
        console.log("Fetched", data.allMsg);
        data.allMsg.sort((a: Post, b: Post) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const yearDiff = dateA.getFullYear() - dateB.getFullYear();
          if (yearDiff !== 0) {
            return yearDiff;
          }
          const monthDiff = dateA.getMonth() - dateB.getMonth();
          if (monthDiff !== 0) {
            return monthDiff;
          }
          const dayDiff = dateA.getDate() - dateB.getDate();
          if (dayDiff !== 0) {
            return dayDiff;
          }
          return dateA.getTime() - dateB.getTime();
        });
        setPosts(data.allMsg);
      }
    } catch (error) {
      console.log("There was an error fetching:", error);
    }
  };

  const handleClickBtnYou = () => {
    if (!btnWe) {
      setBtnYou(!btnYou);
    }
  };

  const handleClickBtnWe = () => {
    if (!btnYou) {
      setBtnWe(!btnWe);
    }
  };

  // scroll animation
  useEffect(() => {
    fetchAll();
    console.log("scroll animation", scrollToRef.current);
    setTimeout(() => {
      if (scrollToRef.current) {
        scrollToRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  }, [newPost]);

  // automatically play animation
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start((i) => i);
  }, []);

  // new post animation
  const postVariants = {
    pre: { opacity: 0, backgroundColor: "white" },
    visible: {
      opacity: 1,
      backgroundColor: "transparent",
      transition: { duration: 1.5, delay: 0.5 },
    },
  };

  return (
    <main>
      <motion.img
        src="./background.png"
        alt="background"
        custom={{ scale: 2.5, transition: { duration: 0.5, delay: 1 * 0.5 } }}
        animate={controls}
        className="background-container"
        initial={{
          scale: 1,
        }}
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
        />
      </button>

      {btnYou && (
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
          <div className="ml-[16px] mt-4 flex h-[43px] w-[242px] items-center justify-between bg-[#F3D1F9] px-2 text-sm text-[#7C7C7C] ">
            <div>添加至</div>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  defaultValue={dayjs()}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  sx={{ width: "55%" }}
                  slotProps={{ textField: { variant: "standard" } }}
                />
              </LocalizationProvider>
            </ThemeProvider>
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
      )}

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
        />
      </button>

      {btnWe && (
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
          <div className="intro-contact">
            <div>联系方式</div>
            <div>邮箱: </div>
            <div>Ins: </div>
            <div>小红书：</div>
          </div>
        </div>
      )}

      <motion.ul
        layout
        custom={{ top: 0, transition: { duration: 2, delay: 3 * 0.5 } }}
        animate={controls}
        className="posts"
        initial={{
          position: "fixed",
          left: "34%",
          top: "100%",
          overflow: "scroll",
          height: "100%",
        }}
      >
        {posts.map((post) => (
          <motion.li
            layout
            variants={postVariants}
            initial="pre"
            animate="visible"
            key={post.id}
            onClick={(e) => fetchOne(e, post.id)}
            ref={scrollToRef}
          >
            {`${new Date(post.date).getFullYear()} {${(
              new Date(post.date).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}/${new Date(post.date)
              .getDate()
              .toString()
              .padStart(2, "0")}} {${post.name}}`}
          </motion.li>
        ))}
      </motion.ul>

      {/* {showBar && (
        <motion.div
          animate={{ opacity: 1, transition: { duration: 1 } }}
          initial={{
            width: "60%",
            height: "10px",
            backgroundColor: "white",
            position: "fixed",
            top: "40%",
            // left: "30%",
            opacity: 0,
          }}
        />
      )} */}
    </main>
  );
};

export default Home;

const theme = createTheme({
  palette: {
    primary: {
      main: "#F3D1F9",
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color: "#7C7C7C",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        inputAdornedEnd: {
          color: "#7C7C7C",
        },
      },
    },
  },
});
