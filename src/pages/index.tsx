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
  content?: string;
}

interface Datas {
  allMsg: Post[];
}

interface Data {
  oneMsg: Post;
}

const Home: NextPage = () => {
  const [btnYou, setBtnYou] = useState(false);
  const [btnWe, setBtnWe] = useState(false);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [posts, setPosts] = useState<Post[]>([]);
  const [showBar, setShowBar] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostId, setNewPostId] = useState(-1);
  const [fetchCount, setFetchCount] = useState(-1);
  const scrollToRef = useRef<HTMLLIElement>(null);

  // white bar
  let whiteTracker = 0;
  useEffect(() => {
    let isFirstClick = true;
    let previousLi: HTMLLIElement | null = null;

    const liElements = document.querySelectorAll("li");
    // console.log("liElements", liElements);

    const handleClick = (li: HTMLLIElement) => {
      // Add a click event listener to each li element
      if (!btnWe && !btnYou) {
        // console.log("in", btnWe, btnYou);
        li.addEventListener("click", () => {
          console.log("enter event listener");
          if (whiteTracker === 1) {
            liElements.forEach((li) => {
              li.style.backgroundColor = "";
              li.style.color = "";
            });
            whiteTracker = 0;
          }
          // Check if it's the first click
          if (isFirstClick) {
            // Change the background color to purple
            li.style.backgroundColor = "white";
            // Change the font color to white
            li.style.color = "#BD68FE";
            // Set isFirstClick to false
            isFirstClick = false;
          } else {
            // Reset styles of the previous li element
            if (previousLi) {
              console.log("change back");
              previousLi.style.backgroundColor = "";
              previousLi.style.color = "";
            }

            // Change the background color to white
            li.style.backgroundColor = "white";
            // Change the font color to purple
            li.style.color = "#BD68FE";
          }
          // Set the current li element as the previousLi
          previousLi = li;
          whiteTracker = 1;
        });
      }
    };

    // console.log("out", btnWe, btnYou);
    if (!btnWe && !btnYou) {
      liElements.forEach((li) => {
        li.addEventListener("click", handleClick.bind(null, li));
      });
    }

    return () => {
      liElements.forEach((li) => {
        li.removeEventListener("click", handleClick.bind(null, li));
      });
    };
  }, [posts]);

  // close & show animation
  const showPostDivRef = useRef<HTMLDivElement>(null);
  const resetStyle = async () => {
    const liElements = document.querySelectorAll("li");
    liElements.forEach((li) => {
      li.style.backgroundColor = "";
      li.style.color = "";
    });
  };
  useEffect(() => {
    if (!showPost) {
      resetStyle();
      return;
    }
    function handleClick(event: { target: any }) {
      if (
        showPostDivRef.current &&
        !showPostDivRef.current.contains(event.target)
      ) {
        setShowPost(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [showPost]);

  // const showFormDivRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (!btnYou) return;
  //   function handleClick(event: { target: any }) {
  //     if (
  //       showFormDivRef.current &&
  //       !showFormDivRef.current.contains(event.target)
  //     ) {
  //       setBtnYou(false);
  //     }
  //   }
  //   window.addEventListener("click", handleClick);
  //   return () => window.removeEventListener("click", handleClick);
  // }, [btnYou]);

  const showAboutDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!btnWe) return;
    function handleClick(event: { target: any }) {
      if (
        showAboutDivRef.current &&
        !showAboutDivRef.current.contains(event.target)
      ) {
        setBtnWe(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [btnWe]);

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
        setShowBar(true);
        setTimeout(() => {
          setShowBar(false);
        }, 2000);
        fetchAll();
        console.log("form submitted successfully !!!");
      }
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };

  const fetchOne = async (e: MouseEvent, id: number) => {
    // console.log(id);
    if (id === -999) {
      return;
    }
    if (!btnWe && !btnYou) {
      try {
        const response = await fetch("/api/inquiry", {
          method: "GET",
          headers: { "data-range": String(id) },
        });

        if (response.status !== 200) {
          console.log("Something went wrong");
        } else {
          const data: Data = await response.json();
          // console.log("Fetched content:", data.oneMsg || "null");
          setNewPostContent(data.oneMsg.content || "null");
          setNewPostId(data.oneMsg.id || -1);
          setShowPost(true);
        }
      } catch (error) {
        console.log("There was an error fetching:", error);
      }
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
        // console.log("Fetched", data.allMsg);
        data.allMsg.sort((a: Post, b: Post) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setPosts(data.allMsg);
        setFetchCount(fetchCount + 1);
      }
    } catch (error) {
      console.log("There was an error fetching:", error);
    }
  };

  const handleClickBtnYou = () => {
    if (!btnWe && !showPost) {
      setBtnYou(!btnYou);
    }
  };

  const handleClickBtnWe = () => {
    if (!btnYou && !showPost) {
      setBtnWe(!btnWe);
    }
  };

  const handleClickBtnR = (e: MouseEvent) => {
    const currentPost = posts.find((post) => post.id === newPostId);
    const liElements = document.querySelectorAll("li");
    var currentPostId = -1;
    if (currentPost) {
      currentPostId = currentPost.id;
    }
    const currentIndex = posts.findIndex((post) => post.id === currentPostId);
    const nextIndex = (currentIndex + 1) % posts.length;
    fetchOne(e, posts[nextIndex]?.id || -1);

    let currentLi = liElements[currentIndex + 1];
    let oldLi = liElements[currentIndex];
    if (currentLi) {
      currentLi.style.backgroundColor = "white";
      currentLi.style.color = "#BD68FE";
    }
    if (oldLi) {
      oldLi.style.color = "white";
      oldLi.style.backgroundColor = "";
    }

    setTimeout(() => {
      if (currentLi) {
        currentLi.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const handleClickBtnL = (e: MouseEvent) => {
    const currentPost = posts.find((post) => post.id === newPostId);
    const liElements = document.querySelectorAll("li");

    var currentPostId = -1;
    if (currentPost) {
      currentPostId = currentPost.id;
    }
    const currentIndex = posts.findIndex((post) => post.id === currentPostId);
    // console.log(currentIndex);

    var nextIndex = currentIndex - 1;
    if (nextIndex === -1) {
      nextIndex = posts.length - 1;
    }
    fetchOne(e, posts[nextIndex]?.id || -1);
    let currentLi = liElements[currentIndex - 1];
    let oldLi = liElements[currentIndex];
    if (currentLi) {
      currentLi.style.backgroundColor = "white";
      currentLi.style.color = "#BD68FE";
    }
    if (oldLi) {
      oldLi.style.backgroundColor = "";
      oldLi.style.color = "white";
    }

    setTimeout(() => {
      if (currentLi) {
        currentLi.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  // first fetch
  useEffect(() => {
    fetchAll();
  }, []);

  // other fetches - scroll to new post position
  useEffect(() => {
    if (fetchCount) {
      console.log("scroll animation", scrollToRef.current?.value);
      if (scrollToRef.current) {
        scrollToRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [posts]);

  // automatically play animation
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start((i) => i);
  }, []);

  return (
    <main>
      <motion.img
        src="./background.png"
        alt="background"
        custom={{ scale: 2.3, transition: { duration: 0.8, delay: 1 * 0.8 } }}
        animate={controls}
        className="background-container"
        initial={{
          scale: 1,
        }}
      />

      <motion.img
        src="./backgroundCover.svg"
        alt="backgroundCover"
        custom={{ opacity: 1, transition: { delay: 2 * 0.8 } }}
        animate={controls}
        className="background-cover"
        initial={{
          opacity: 0,
        }}
      />

      {/* header */}
      <motion.div
        custom={{
          marginTop: "3vh",
          transition: { duration: 0.8, delay: 2 * 0.8 },
        }}
        animate={controls}
        className="homepage"
        initial={{
          marginTop: "50vh",
        }}
      >
        <div className="container">
          <h1>QUEER</h1>
          <h1>MOMENT</h1>
        </div>
        <div className="container">
          <p>共同</p>
          <p>度过</p>
        </div>
      </motion.div>

      <div>
        {/* <div ref={showFormDivRef}> */}
        <button onClick={handleClickBtnYou}>
          <motion.img
            src={btnYou ? "./youOpen.svg" : "./you.svg"}
            alt="btnYou"
            custom={{
              opacity: 1,
              transition: { duration: 0.8, delay: 3 * 0.8 + 2 },
            }}
            animate={controls}
            initial={{
              position: "fixed",
              height: 44,
              width: 33,
              right: "85%",
              top: "30%",
              opacity: 0,
            }}
          />
        </button>

        <motion.div
          className="form-div"
          style={{
            backgroundImage: "url(./formBg.svg)",
            backgroundRepeat: "no-repeat",
            // backgroundColor: "rgba(255, 255, 255, 0.8)",
            backgroundSize: "cover",
            // backdropFilter: "blue(5px)",
            zIndex: btnYou ? 100 : -9999,
          }}
          initial={{ opacity: 0 }}
          animate={btnYou ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
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
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="grow bg-transparent py-20 text-center text-sm"
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
        </motion.div>
      </div>

      <div ref={showAboutDivRef} className={btnWe ? "z-20" : " "}>
        <button onClick={handleClickBtnWe}>
          <motion.img
            src={btnWe ? "./weOpen.svg" : "./we.svg"}
            alt="btnWe"
            custom={{
              opacity: 1,
              transition: { duration: 0.8, delay: 3 * 0.8 + 2 },
            }}
            animate={controls}
            initial={{
              position: "fixed",
              height: 56,
              width: 53,
              left: "82%",
              top: "80%",
              opacity: 0,
              zIndex: 999,
            }}
          />
        </button>

        <motion.div
          className="intro"
          initial={{ opacity: 0, zIndex: -9999, left: "100%" }}
          animate={
            btnWe
              ? { opacity: 1, zIndex: 888, left: "10%" }
              : { opacity: 0, zIndex: -888, left: "100%" }
          }
          transition={{ duration: 0.5 }}
        >
          <div className="intro-container">
            <div className="intro-logo">
              <img src="./aboutIcon.svg" />
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
        </motion.div>
      </div>

      {/* calendar */}
      <motion.ul
        layout
        custom={{ top: 0, transition: { duration: 2, delay: 3 * 0.8 } }}
        animate={controls}
        className="posts"
        initial={{
          top: "100%",
        }}
      >
        {posts.map((post) => (
          <motion.li
            key={post.id}
            value={post.id}
            onClick={
              !showPost ? (e) => fetchOne(e, post.id) : (e) => fetchOne(e, -999)
            }
            ref={scrollToRef}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 1],
            }}
            transition={{ duration: 1, delay: 0.5 }}
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

      {showBar && (
        <motion.div
          animate={{ opacity: [1, 0], transition: { duration: 1.5 } }}
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
      )}

      {/* show post */}
      <motion.div
        initial={{ opacity: 0, zIndex: -9999, top: "40%", position: "fixed" }}
        animate={
          showPost && !btnWe && !btnYou
            ? { opacity: 1, zIndex: 888 }
            : { opacity: 0, zIndex: -9999 }
        }
        // transition={{ duration: 0.5 }}
        ref={showPostDivRef}
      >
        <div className=" absolute flex h-full w-full flex-row">
          <button
            onClick={handleClickBtnL}
            className="h-full w-1/5 flex-auto"
            id="showpost-left"
          >
            <img className=" mx-auto" src="./showPostL.svg" alt="showPostL" />
          </button>
          <div className="my-auto flex h-3/5 w-4/5 justify-center overflow-scroll">
            <textarea
              disabled
              name="showpost-textarea"
              className=" flex-auto break-words bg-transparent text-center "
              value={newPostContent}
            />
          </div>
          <button
            className="h-full w-1/5 flex-auto "
            id="showpost-right"
            onClick={handleClickBtnR}
          >
            <img className=" mx-auto" src="./showPostR.svg" alt="showPostR" />
          </button>
        </div>
        <img className=" static" src="./showPostBg.svg" alt="showPostBg" />
      </motion.div>
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
