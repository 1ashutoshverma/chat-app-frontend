import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Input,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { Socket, io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AuthState } from "@/redux/authSlice/authSlice";
import {
  ChatState,
  setContent,
  setMembers,
  setMessage,
  setNotifications,
} from "@/redux/chatSlice/chatSlice";
import LeftTab from "./LeftTab";
import { baseUrl } from "../../configs";
import { url } from "inspector";
import Navbar from "./Navbar";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const Homepage = () => {
  const { _id, name, avatar } = useSelector<RootState, AuthState>(
    (store) => store.auth
  );

  const {
    messages,
    content,
    newRoom,
    typeRoom,
    previousRoom,
    privateId,
    showLeftTab,
  } = useSelector<RootState, ChatState>((store) => store.chat);

  const dispatch = useDispatch();

  const socket = useMemo(() => io(baseUrl), []);

  const handleClick = useCallback(() => {
    let time = new Date();
    const year = time.getFullYear().toString().padStart(2, "0");
    const month = (time.getMonth() + 1).toString().padStart(2, "0");
    const date = time.getDate().toString().padStart(2, "0");
    const fullDate = date + "/" + month + "/" + year;
    const hours = time.getHours().toString().padStart(2, "0");
    const min = time.getMinutes().toString().padStart(2, "0");
    const sec = time.getSeconds().toString().padStart(2, "0");
    const fullTime = hours + ":" + min + ":" + sec;

    socket.emit("message-room", {
      room: newRoom,
      content,
      sender: { _id, avatar, name },
      time: fullTime,
      date: fullDate,
      type: typeRoom,
    });

    dispatch(setContent(""));

    socket.off("room-messages").on("room-messages", (msg) => {
      dispatch(setMessage(msg));
    });
  }, [dispatch, name, newRoom, content, typeRoom, _id, avatar]);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (name) {
      socket.emit("new-user");
      socket.off("new-user").on("new-user", (members) => {
        dispatch(setMembers(members));
      });
    } else {
      socket.disconnect();
    }
  }, [dispatch, name, socket]);

  useEffect(() => {
    socket.emit("join-room", { newRoom, previousRoom });
    socket.off("room-messages").on("room-messages", (msg) => {
      // console.log(msg);
      dispatch(setMessage(msg));
    });
  }, [socket, newRoom, typeRoom, previousRoom, dispatch]);

  useEffect(() => {
    socket.off("notification").on("notification", (room, type, sender) => {
      if (newRoom !== room) {
        dispatch(
          setNotifications({
            room,
            type,
            sender,
          })
        );
      }
    });
  }, [socket, newRoom, dispatch]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, messages]);

  // console.log(privateId);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      justifyContent={["", "", "center"]}
      alignItems={["", "", "center"]}
    >
      <Box w={"100vw"} h={"100vh"} position={"fixed"} zIndex={"-1"}>
        <Box w={"100vw"} h={"30vh"} bg={"blue.400"}></Box>
        <Box w={"100vw"} h={"70vh"}></Box>
      </Box>

      <Box
        boxShadow={"rgba(0, 0, 0, 0.2) 0px 4px 12px"}
        w={["100%", "100%", "96%"]}
        maxH={["100%", "100%", "95%"]}
        borderRadius={"10px"}
        bg={"white"}
        // border={"1px solid green"}
      >
        <Navbar height={"72px"} />
        <Grid
          m={"auto"}
          gridTemplateColumns={{
            base: "1fr",
            sm: "1fr",
            md: "0.5fr 1fr",
          }}
          gap={"5px"}
          padding={{
            base: 0,
            md: 5,
          }}
        >
          <LeftTab />

          <Flex
            display={{
              base: showLeftTab ? "none" : "flex",
              sm: showLeftTab ? "none" : "flex",
              md: "flex",
            }}
            flexDir={"column"}
            justifyContent={"space-between"}
            bg={"gray.100"}
            borderRadius={"10px"}
            h={[
              "calc(100vh - 77px)",
              "calc(100vh - 77px)",
              "calc(100vh - 150px)",
            ]}
          >
            <Flex
              gap={"20px"}
              p={"15px"}
              bg={"white"}
              alignItems={"center"}
              borderTopRadius={"10px"}
              border={"1px solid rgba(105, 105, 105, 0.2)"}
              h={"70px"}
            >
              <Box position={"relative"}>
                <Image
                  alt=""
                  w="50px"
                  h="50px"
                  borderRadius="50%"
                  src={
                    privateId === ""
                      ? "https://via.placeholder.com/200x200.png"
                      : privateId.avatar
                  }
                />
                <Box
                  h={"10px"}
                  w={"10px"}
                  style={{
                    backgroundColor:
                      privateId?.status === "online" ? "green" : "#C53030",
                    display: privateId ? "block" : "none",
                  }}
                  borderRadius={"50%"}
                  position={"absolute"}
                  top={"40px"}
                  zIndex={10}
                  left={"5px"}
                ></Box>
              </Box>
              <Text fontWeight={"500"} fontSize={["1rem", "1.1rem", "1.3rem"]}>
                {privateId === "" ? newRoom : privateId.name}
              </Text>
            </Flex>

            <Box
              overflow={"auto"}
              h={"calc(100% - 140px)"}
              ref={chatContainerRef}
            >
              {messages.map((e) => {
                return (
                  <Flex flexDir={"column"} key={e._id} padding={"10px"}>
                    <Box
                      bg={"gray.300"}
                      w={"fit-content"}
                      margin={"auto"}
                      padding={"2px 10px"}
                      borderRadius={"5px"}
                      textAlign={"center"}
                    >
                      {e._id}
                    </Box>
                    {e.messageByDate?.map((ele: any, ind: number) => {
                      return (
                        <Box
                          w={"fit-content"}
                          padding={"10px"}
                          margin={"5px 2px"}
                          key={ind}
                          borderRadius={"10px"}
                          backgroundColor={"white"}
                          alignSelf={ele.from._id == _id ? "end" : ""}
                          maxWidth={"60%"}
                        >
                          <Text
                            fontWeight={"600"}
                            color={"blue"}
                            display={ele.from._id == _id ? "none" : ""}
                          >
                            {ele.from.name}
                          </Text>
                          <Text pr={"40px"}>{ele.content}</Text>
                          <Text
                            fontSize={"0.7rem"}
                            color={"gray.500"}
                            textAlign={"end"}
                            mt={"-12px"}
                          >
                            {ele.time.substring(0, 5)}
                          </Text>
                        </Box>
                      );
                    })}
                  </Flex>
                );
              })}
            </Box>

            {/* <Box bg={"white"} padding={"6px"} borderRadius={"10px"} m={"5px"}>
              <form
                onSubmit={(e) => {
                  handleClick();
                  e.preventDefault();
                }}
              >
                <Flex>
                  <Input
                    placeholder="Type your message"
                    value={content}
                    onChange={(e) => {
                      dispatch(setContent(e.target.value));
                    }}
                    border={"none"}
                    focusBorderColor="transparent"
                  />
                  <Button type="submit">Send</Button>
                </Flex>
              </form>
            </Box> */}
            <Box
              bg="white"
              padding="6px"
              borderRadius="10px"
              m="5px"
              position="relative"
            >
              <form
                onSubmit={(e) => {
                  handleClick();
                  e.preventDefault();
                }}
              >
                <Flex>
                  <Button
                    // position="absolute"
                    // right="10px"
                    // bottom="10px"
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  >
                    😀
                  </Button>
                  <Input
                    placeholder="Type your message"
                    value={content}
                    onChange={(e) => dispatch(setContent(e.target.value))}
                    border="none"
                    focusBorderColor="transparent"
                  />

                  <Button type="submit">Send</Button>
                </Flex>
                <Box position={"absolute"} bottom={"55px"}>
                  {isEmojiPickerOpen && (
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: any) => {
                        dispatch(setContent(content + emoji.native));
                        setIsEmojiPickerOpen(false);
                      }}
                      theme={"light"}
                    />
                  )}
                </Box>
              </form>
            </Box>
          </Flex>
        </Grid>
      </Box>
    </Flex>
  );
};

export default Homepage;
