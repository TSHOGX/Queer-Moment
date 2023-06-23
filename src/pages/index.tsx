import { NextPage } from "next";
import React, {
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useAnimationControls,
  MotionValue,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { interpolate } from "flubber";

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

// animate svg
const getIndex = (_: any, index: number) => index;

function useFlubber(progress: MotionValue<number>, paths: string[]) {
  return useTransform(progress, paths.map(getIndex), paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 }),
  });
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
  const [newPost, setNewPost] = useState(""); // only for scroll
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostId, setNewPostId] = useState(-1);
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

  // animate button "we"
  const we =
    "M13.8565 35.7128L13.8565 8.00002L37.8565 21.8564L13.8565 35.7128Z";
  const weOpen =
    "M35.7129 29.8564L8.00008 29.8564L21.8565 5.85641L35.7129 29.8564Z";
  const wePaths = [we, weOpen];
  const weColors = ["#ffffff", "#8C24DE"];
  const [wePathIndex, setWePathIndex] = useState(0);
  const weProgress = useMotionValue(wePathIndex);
  const weFill = useTransform(weProgress, wePaths.map(getIndex), weColors);
  const wePath = useFlubber(weProgress, wePaths);
  useEffect(() => {
    const animation = animate(weProgress, wePathIndex, {
      duration: 0.5,
      ease: "easeInOut",
      onComplete: () => {
        if (btnWe === true) {
          weProgress.set(1);
          setWePathIndex(0);
        } else {
          weProgress.set(0);
          setWePathIndex(1);
        }
      },
    });
    return () => animation.stop();
  }, [btnWe]);

  // animate button "you"
  const you = "M18 0L31.8564 24L4.14359 24L18 0Z";
  const youOpen = "M32 16L8 29.8564L8 2.14359L32 16Z";
  const youPaths = [you, youOpen];
  const youColors = ["#ffffff", "#8C24DE"];
  const [youPathIndex, setYouPathIndex] = useState(0);
  const youProgress = useMotionValue(youPathIndex);
  const youFill = useTransform(youProgress, youPaths.map(getIndex), youColors);
  const youPath = useFlubber(youProgress, youPaths);
  React.useEffect(() => {
    const animation = animate(youProgress, youPathIndex, {
      duration: 0.5,
      ease: "easeInOut",
      onComplete: () => {
        if (btnYou === true) {
          youProgress.set(1);
          setYouPathIndex(0);
        } else {
          youProgress.set(0);
          setYouPathIndex(1);
        }
      },
    });
    return () => animation.stop();
  }, [btnYou]);

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
        setNewPost(selectedDate?.toString() + name + content);
        console.log("form submitted successfully !!!");
        setTimeout(() => {
          setShowBar(false);
        }, 2000);
        fetchAll();
        setTimeout(() => {
          console.log("scroll animation", scrollToRef.current?.value);
          if (scrollToRef.current) {
            scrollToRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 1000);
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
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setPosts(data.allMsg);
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

  // automatically play animation
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start((i) => i);
  }, []);

  // new post animation
  const postVariants = {
    pre: {
      opacity: 1,
      // backgroundColor: "rgba(0, 0, 0, 0)",
      // textcolor: "rgba(255, 255, 255, 1)",
    },
    visible: {
      opacity: [0, 1],
      // backgroundColor: [
      //   "rgba(255, 255, 255, 1)",
      //   "rgba(255, 255, 255, 0.5)",
      //   "rgba(0, 0, 0, 0)",
      // ],
      // textcolor: [
      //   "rgba(175, 72, 255, 1)",
      //   "rgba(175, 72, 255, 1)",
      //   "rgba(255, 255, 255, 1)",
      // ],
      transition: { duration: 1, delay: 1 },
    },
  };

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
          {/* <motion.div
            custom={{
              opacity: 1,
              transition: { duration: 0.8, delay: 3 * 0.5 },
            }}
            animate={controls}
            initial={{
              position: "fixed",
              height: 44,
              width: 33,
              left: 19,
              top: "30%",
              opacity: 0,
            }}
          >
            <svg
              width="36"
              height="44"
              viewBox="0 0 36 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_51_1005)">
                <motion.path fill={youFill} d={youPath} />
                <path
                  d={btnYou ? youOpen : you}
                  fill={btnYou ? youColors[1] : youColors[0]}
                />
              </g>
              <path
                d="M11.124 42.5907C10.5528 42.4296 10.1455 42.1732 9.90236 41.8217C9.66213 41.4701 9.54201 41.0438 9.54201 40.5428V39.6464C9.54201 39.3417 9.47316 39.1044 9.33547 38.9344C9.2007 38.7645 8.98977 38.6796 8.70266 38.6796V37.8929C8.98977 37.8929 9.2007 37.8094 9.33547 37.6425C9.47316 37.4725 9.54201 37.2323 9.54201 36.9218V36.0253C9.54201 35.5243 9.66213 35.0995 9.90236 34.7509C10.1455 34.3993 10.5528 34.1429 11.124 33.9818L11.3394 34.597C11.0581 34.6937 10.8589 34.8651 10.7417 35.1112C10.6275 35.3573 10.5703 35.662 10.5703 36.0253V36.9218C10.5703 37.2294 10.5059 37.5004 10.377 37.7347C10.2481 37.9691 10.0547 38.1522 9.79689 38.2841C10.0547 38.4218 10.2481 38.6093 10.377 38.8466C10.5059 39.0809 10.5703 39.3475 10.5703 39.6464V40.5428C10.5703 40.9061 10.6275 41.2094 10.7417 41.4525C10.8589 41.6986 11.0581 41.8715 11.3394 41.9711L11.124 42.5907ZM18.1806 33.4849L18.8466 33.6289C18.4956 35.0689 17.9286 36.4549 17.2356 37.3729C17.1186 37.2559 16.8486 37.0399 16.6956 36.9409C17.3616 36.1039 17.8836 34.8079 18.1806 33.4849ZM18.0276 37.3009L18.6846 37.4359C18.4056 38.6149 17.9196 39.7579 17.3706 40.5139C17.2356 40.4059 16.9476 40.2259 16.7856 40.1449C17.3436 39.4519 17.7756 38.3809 18.0276 37.3009ZM18.0996 35.1769H22.1496V35.8069H17.8386L18.0996 35.1769ZM19.4946 35.4379H20.1696V40.9009C20.1696 41.2879 20.0886 41.4859 19.8366 41.5939C19.5936 41.7109 19.2066 41.7289 18.6486 41.7289C18.6036 41.5399 18.5046 41.2429 18.4056 41.0449C18.8286 41.0629 19.2156 41.0539 19.3416 41.0539C19.4586 41.0539 19.4946 41.0179 19.4946 40.9009V35.4379ZM20.8176 37.4359L21.4206 37.2379C21.9426 38.1829 22.3926 39.4249 22.5456 40.2619L21.9066 40.4779C21.7626 39.6499 21.3126 38.3809 20.8176 37.4359ZM21.9516 35.1769H22.0416L22.1586 35.1589L22.6266 35.2579C22.5006 35.9239 22.3476 36.6979 22.2306 37.1839L21.6456 37.0759C21.7446 36.6259 21.8616 35.8699 21.9516 35.2759V35.1769ZM16.3716 33.4759L17.0106 33.6739C16.4166 35.2039 15.4896 36.7249 14.5176 37.7329C14.4456 37.5799 14.2566 37.2199 14.1306 37.0669C15.0216 36.1939 15.8676 34.8439 16.3716 33.4759ZM15.4356 35.7979L16.0656 35.1589L16.0836 35.1679V41.7109H15.4356V35.7979ZM25.854 42.5907L25.6387 41.9711C25.914 41.8715 26.1103 41.6986 26.2275 41.4525C26.3447 41.2094 26.4033 40.9061 26.4033 40.5428V39.6464C26.4033 39.3387 26.4692 39.0677 26.6011 38.8334C26.7358 38.599 26.9409 38.4174 27.2163 38.2885C26.9409 38.1595 26.7358 37.9779 26.6011 37.7435C26.4692 37.5092 26.4033 37.2352 26.4033 36.9218V36.0253C26.4033 35.662 26.3447 35.3573 26.2275 35.1112C26.1103 34.8651 25.914 34.6937 25.6387 34.597L25.854 33.9818C26.4223 34.1429 26.8281 34.3993 27.0713 34.7509C27.3144 35.0995 27.436 35.5243 27.436 36.0253V36.9218C27.436 37.2323 27.5034 37.4725 27.6382 37.6425C27.7729 37.8094 27.9839 37.8929 28.271 37.8929V38.6796C27.9839 38.6796 27.7729 38.7645 27.6382 38.9344C27.5034 39.1044 27.436 39.3417 27.436 39.6464V40.5428C27.436 41.0438 27.3144 41.4701 27.0713 41.8217C26.8281 42.1732 26.4223 42.4296 25.854 42.5907Z"
                fill="white"
              />
              <defs>
                <filter
                  id="filter0_d_51_913"
                  x="4"
                  y="2.14355"
                  width="32"
                  height="35.7129"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.729412 0 0 0 0 0.192157 0 0 0 0 0.815686 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_51_1005"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_51_1005"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </motion.div> */}
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
            }}
          />
          {/* <motion.div
            custom={{
              opacity: 1,
              transition: { duration: 0.8, delay: 3 * 0.5 },
            }}
            animate={controls}
            initial={{
              position: "fixed",
              height: 56,
              width: 53,
              left: "80%",
              top: "80%",
              opacity: 0,
              zIndex: 999,
            }}
          >
            <svg
              width="53"
              height="56"
              viewBox="0 0 53 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_51_1002)">
                <motion.path fill={weFill} d={wePath} />
                <path
                  d={btnWe ? weOpen : we}
                  fill={btnWe ? weColors[1] : weColors[0]}
                />
              </g>
              <path
                d="M5.42154 54.5908C4.85025 54.4297 4.44303 54.1733 4.19986 53.8218C3.95963 53.4702 3.83951 53.0439 3.83951 52.543V51.6465C3.83951 51.3418 3.77066 51.1045 3.63297 50.9346C3.4982 50.7646 3.28727 50.6797 3.00016 50.6797V49.8931C3.28727 49.8931 3.4982 49.8096 3.63297 49.6426C3.77066 49.4727 3.83951 49.2324 3.83951 48.9219V48.0254C3.83951 47.5244 3.95963 47.0996 4.19986 46.751C4.44303 46.3994 4.85025 46.1431 5.42154 45.9819L5.63688 46.5972C5.35563 46.6938 5.15641 46.8652 5.03922 47.1113C4.92496 47.3574 4.86783 47.6621 4.86783 48.0254V48.9219C4.86783 49.2295 4.80338 49.5005 4.67447 49.7349C4.54557 49.9692 4.35221 50.1523 4.09439 50.2842C4.35221 50.4219 4.54557 50.6094 4.67447 50.8467C4.80338 51.0811 4.86783 51.3477 4.86783 51.6465V52.543C4.86783 52.9062 4.92496 53.2095 5.03922 53.4526C5.15641 53.6987 5.35563 53.8716 5.63688 53.9712L5.42154 54.5908ZM10.1381 47.474H15.4301V48.122H10.1381V47.474ZM9.80511 49.67H15.7991V50.309H9.80511V49.67ZM13.1171 49.886C13.5311 51.47 14.4581 52.649 16.0061 53.126C15.8441 53.27 15.6461 53.54 15.5471 53.72C13.9361 53.135 13.0001 51.839 12.5321 50.012L13.1171 49.886ZM14.4491 45.458L15.1511 45.701C14.8271 46.277 14.4311 46.943 14.1161 47.366L13.5671 47.141C13.8641 46.691 14.2421 45.962 14.4491 45.458ZM10.5071 45.827L11.0561 45.548C11.4341 46.007 11.8301 46.646 11.9921 47.069L11.4071 47.393C11.2541 46.961 10.8671 46.304 10.5071 45.827ZM12.3881 47.627H13.0901V49.499C13.0901 50.885 12.7571 52.604 9.99411 53.756C9.89511 53.594 9.68811 53.36 9.52611 53.225C12.2081 52.208 12.3881 50.66 12.3881 49.499V47.627ZM17.9141 49.04H25.9421V49.706H17.9141V49.04ZM21.6491 46.313H22.3601V52.739C22.3601 53.234 22.2251 53.441 21.8831 53.558C21.5501 53.666 20.9561 53.684 20.0381 53.684C19.9931 53.486 19.8581 53.171 19.7591 52.973C20.4971 52.991 21.1811 52.991 21.3881 52.982C21.5771 52.973 21.6491 52.919 21.6491 52.739V46.313ZM18.5441 46.088H25.3121V46.754H18.5441V46.088ZM32.8901 46.034L33.4031 45.683C33.9341 46.133 34.5641 46.772 34.8611 47.186L34.3031 47.582C34.0331 47.15 33.4211 46.502 32.8901 46.034ZM27.0581 48.104H35.0771V48.752H27.0581V48.104ZM26.9231 50.75C27.9941 50.552 29.6861 50.192 31.2701 49.85L31.3241 50.462C29.8481 50.804 28.2551 51.173 27.1211 51.425L26.9231 50.75ZM28.9931 46.358H29.6681V52.856C29.6681 53.297 29.5601 53.495 29.2721 53.603C28.9841 53.711 28.5071 53.738 27.7601 53.729C27.7241 53.549 27.6071 53.243 27.5081 53.045C28.0841 53.072 28.6151 53.063 28.7771 53.054C28.9391 53.054 28.9931 53.009 28.9931 52.847V46.358ZM30.7031 45.548L31.1801 46.115C30.1361 46.475 28.6061 46.754 27.3191 46.934C27.2831 46.781 27.2021 46.529 27.1121 46.376C28.3811 46.178 29.8391 45.872 30.7031 45.548ZM31.6031 45.521H32.3051C32.2871 49.652 33.1691 53.072 34.2671 53.072C34.5101 53.072 34.6181 52.604 34.6721 51.443C34.8161 51.596 35.0591 51.749 35.2481 51.821C35.1221 53.315 34.8791 53.756 34.2041 53.756C32.4401 53.756 31.6391 49.805 31.6031 45.521ZM34.0421 49.166L34.6451 49.418C33.7631 51.065 32.2781 52.514 30.6221 53.387C30.5141 53.216 30.3251 53 30.1541 52.847C31.7561 52.073 33.2411 50.687 34.0421 49.166ZM40.8731 45.773H43.5821V46.394H40.8731V45.773ZM43.3211 45.773H43.9961V52.874C43.9961 53.279 43.8971 53.477 43.6181 53.585C43.3481 53.693 42.8891 53.702 42.1781 53.702C42.1511 53.531 42.0521 53.234 41.9621 53.054C42.4751 53.081 42.9701 53.072 43.1231 53.063C43.2671 53.054 43.3211 53.009 43.3211 52.865V45.773ZM39.1181 45.737L39.6401 45.449C40.0361 45.989 40.5131 46.727 40.7201 47.177L40.1621 47.501C39.9641 47.042 39.5141 46.286 39.1181 45.737ZM38.7401 47.258H39.3971V53.72H38.7401V47.258ZM37.7141 45.494L38.3441 45.665C37.8941 47.222 37.1921 48.806 36.3821 49.859C36.3191 49.706 36.1301 49.346 36.0131 49.175C36.7241 48.266 37.3451 46.88 37.7141 45.494ZM37.0031 47.762L37.6241 47.132L37.6511 47.15V53.72H37.0031V47.762ZM47.5565 54.5908L47.3412 53.9712C47.6165 53.8716 47.8128 53.6987 47.93 53.4526C48.0472 53.2095 48.1058 52.9062 48.1058 52.543V51.6465C48.1058 51.3389 48.1717 51.0679 48.3036 50.8335C48.4383 50.5991 48.6434 50.4175 48.9188 50.2886C48.6434 50.1597 48.4383 49.978 48.3036 49.7437C48.1717 49.5093 48.1058 49.2354 48.1058 48.9219V48.0254C48.1058 47.6621 48.0472 47.3574 47.93 47.1113C47.8128 46.8652 47.6165 46.6938 47.3412 46.5972L47.5565 45.9819C48.1248 46.1431 48.5306 46.3994 48.7738 46.751C49.0169 47.0996 49.1385 47.5244 49.1385 48.0254V48.9219C49.1385 49.2324 49.2059 49.4727 49.3407 49.6426C49.4754 49.8096 49.6864 49.8931 49.9735 49.8931V50.6797C49.6864 50.6797 49.4754 50.7646 49.3407 50.9346C49.2059 51.1045 49.1385 51.3418 49.1385 51.6465V52.543C49.1385 53.0439 49.0169 53.4702 48.7738 53.8218C48.5306 54.1733 48.1248 54.4297 47.5565 54.5908Z"
                fill="white"
              />
              <defs>
                <filter
                  id="filter0_d_51_914"
                  x="9.85645"
                  y="8"
                  width="32"
                  height="35.7128"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.729412 0 0 0 0 0.192157 0 0 0 0 0.815686 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_51_914"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_51_914"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </motion.div> */}
        </button>

        <motion.div
          className="intro"
          initial={{ opacity: 0, zIndex: -9999, left: "100%" }}
          animate={
            btnWe
              ? { opacity: 1, zIndex: 888, left: "10%" }
              : { opacity: 0, zIndex: -9999, left: "100%" }
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
            layout
            variants={postVariants}
            key={post.id}
            value={post.id}
            onClick={
              !showPost ? (e) => fetchOne(e, post.id) : (e) => fetchOne(e, -999)
            }
            ref={scrollToRef}
            animate={"visible"}
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
          <div className=" w-4/5 flex-auto ">
            <div className=" h-auto py-24 text-center">{newPostContent}</div>
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
