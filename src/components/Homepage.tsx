"use client";
import { Box, Button, Flex, Grid, Image, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { baseUrl } from "../../configs";
import { io } from "socket.io-client";
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
  // console.log(notifications);

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

  socket.off("notification").on("notification", (room, type, sender) => {
    if (newRoom != room) {
      dispatch(
        setNotifications({
          room,
          type,
          sender,
        })
      );
    }
  });

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
    <Box h={"calc(100vh - 72px)"}>
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
          // border={"1px solid red"}
          borderRadius={"10px"}
          h={"calc(100vh - 115px)"}
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
                <Flex
                  flexDir={"column"}
                  key={e._id}
                  padding={"10Px"}
                  // borderRadius={"10px"}
                  // border={"1px solid red"}
                >
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

          <Box
            bg={"white"}
            padding={"6px"}
            borderRadius={"10px"}
            m={"5px"}
            // h={"75px"}
          >
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
