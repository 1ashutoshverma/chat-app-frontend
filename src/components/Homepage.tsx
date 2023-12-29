"use client";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { baseUrl } from "../../configs";
import { io } from "socket.io-client";
import { useAppSelector } from "@/redux/providers";
import { RootState } from "@/redux/store";
import { AuthState } from "@/redux/authSlice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatState,
  setContent,
  setMembers,
  setMessage,
  setNewRoom,
  setNotifications,
  setPreviousRoom,
  setPrivateId,
  setTypeRoom,
} from "@/redux/chatSlice/chatSlice";
import LeftTab from "./LeftTab";

const socket = io(baseUrl);
const rooms: string[] = [
  "Public Discussion",
  "Technology",
  "Stock Market",
  "Science",
];

const Homepage = () => {
  const { _id, name, avatar } = useSelector<RootState, AuthState>(
    (store) => store.auth
  );
  const {
    messages,
    content,
    members,
    newRoom,
    typeRoom,
    previousRoom,
    notifications,
    privateId,
    showLeftTab,
  } = useSelector<RootState, ChatState>((store) => store.chat);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("new-user");
    socket.off("new-user").on("new-user", (members) => {
      dispatch(setMembers(members));
    });
  }, []);

  const handleClick = () => {
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
  };

  useEffect(() => {
    socket.emit("join-room", { newRoom, previousRoom });
    socket.off("room-messages").on("room-messages", (msg) => {
      console.log(msg);
      dispatch(setMessage(msg));
      // setMessages(msg);
    });
  }, [newRoom, typeRoom, previousRoom]);

  const joinPublicChat = (room: string) => {
    const pRoom = newRoom;
    dispatch(setPreviousRoom(pRoom));
    dispatch(setPrivateId(""));
    dispatch(setNewRoom(room));
    dispatch(setTypeRoom("chatroom"));

    const { [room]: del, ...left } = notifications;
    dispatch(setNotifications({ ...left }));
  };

  socket.off("notification").on("notification", (room) => {
    if (newRoom != room) {
      dispatch(
        setNotifications({
          ...notifications,
          [room]: notifications[room] ? notifications[room] + 1 : 1,
        })
      );
    }
  });

  const joinPrivateChat = (room: string) => {
    if (_id == room) {
      return;
    }
    const pRoom = newRoom;
    dispatch(setPreviousRoom(pRoom));
    dispatch(setPrivateId(room));

    if (_id > room) {
      dispatch(setNewRoom(_id + "-" + room));
    } else {
      dispatch(setNewRoom(room + "-" + _id));
    }
    dispatch(setTypeRoom("private"));
  };

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Scroll to the bottom when component mounts or when new messages are added
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    // Scroll to the bottom of the container
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <Box>
      <Grid
        maxW={"1370px"}
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
        h={"85vh"}
      >
        <LeftTab />

        <Flex
          // border={"1px solid red"}
          display={{
            base: showLeftTab ? "none" : "flex",
            sm: showLeftTab ? "none" : "flex",
            md: "flex",
          }}
          flexDir={"column"}
          justifyContent={"space-between"}
          // p={"10px"}
          bg={"gray.100"}
        >
          {messages.map((e) => {
            return (
              <Flex
                flexDir={"column"}
                key={e._id}
                overflow={"auto"}
                padding={"10Px"}
                maxH={"78vh"}
                ref={chatContainerRef}
              >
                <Box
                  bg={"gray.300"}
                  // w={"100%"}
                  w={"fit-content"}
                  margin={"auto"}
                  padding={"2px 10px"}
                  borderRadius={"5px"}
                  // border={"1px solid red"}
                  textAlign={"center"}
                >
                  {e._id}
                </Box>
                {e.messageByDate?.map((ele: any, ind: number) => {
                  return (
                    <Box
                      w={"fit-content"}
                      padding={"10px"}
                      // border={"1px solid green"}
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
                      {/* <Box border={"1px solid red"} pr={"50px"}> */}
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
                    // </Box>
                  );
                })}
              </Flex>
            );
          })}

          <Box bg={"white"} padding={"6px"} borderRadius={"10px"} m={"5px"}>
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
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};

export default Homepage;
