"use client";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../configs";
import { io } from "socket.io-client";
import { useAppSelector } from "@/redux/providers";

const socket = io(baseUrl);
const rooms: string[] = [
  "Public Discussion",
  "Technology",
  "Stock Market",
  "Science",
];

const Homepage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [newRoom, setNewRoom] = useState<string>("Public Discussion");
  const [typeRoom, setTypeRoom] = useState<string>("chatroom");
  const [previousRoom, setPreviousRoom] = useState<string>("");
  const [notifications, setNotifications] = useState<any>({});
  const [privateId, setPrivateId] = useState<string>("");

  const _id: any = useAppSelector((store) => store.auth._id);
  const avatar = useAppSelector((store) => store.auth.avatar);
  const name = useAppSelector((store) => store.auth.name);

  useEffect(() => {
    socket.emit("new-user");
    socket.off("new-user").on("new-user", (members) => {
      setMembers(members);
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
    setContent("");
    socket.off("room-messages").on("room-messages", (msg) => {
      setMessages(msg);
    });
  };

  useEffect(() => {
    socket.emit("join-room", { newRoom, previousRoom });
    socket.off("room-messages").on("room-messages", (msg) => {
      setMessages(msg);
    });
  }, [newRoom, typeRoom, previousRoom]);

  const joinPublicChat = (room: string) => {
    const pRoom = newRoom;
    setPreviousRoom(pRoom);
    setPrivateId("");
    setNewRoom(room);
    setTypeRoom("chatroom");
    const { [room]: del, ...left } = notifications;
    setNotifications({ ...left });
  };

  socket.off("notification").on("notification", (room) => {
    if (newRoom != room) {
      setNotifications({
        ...notifications,
        [room]: notifications[room] ? notifications[room] + 1 : 1,
      });
    }
  });

  const joinPrivateChat = (room: string) => {
    if (_id == room) {
      return;
    }

    const pRoom = newRoom;
    setPreviousRoom(pRoom);
    setPrivateId(room);
    if (_id > room) {
      setNewRoom(_id + "-" + room);
    } else {
      setNewRoom(room + "-" + _id);
    }
    setTypeRoom("private");
  };

  return (
    <Box>
      <Grid
        gridTemplateColumns={"0.6fr 1fr"}
        gap={"5px"}
        padding={5}
        h={"85vh"}
      >
        <Box border={"1px solid red"}>
          <Heading>Public Rooms</Heading>
          {rooms.map((e, ind) => {
            return (
              <Box
                key={ind}
                onClick={() => joinPublicChat(e)}
                bg={e == newRoom ? "blue.400" : ""}
              >
                {e} {notifications[e] ? notifications[e] : ""}
              </Box>
            );
          })}
          <Heading>Individual Chats</Heading>
          {members.map((e) => {
            return (
              <Box
                key={e._id}
                onClick={() => joinPrivateChat(e._id)}
                bg={e._id == privateId ? "blue.400" : ""}
              >
                {e.name} {e._id == _id ? "(You)" : `(${e.status})`}
              </Box>
            );
          })}
        </Box>
        <Flex
          // border={"1px solid red"}
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
            <form>
              <Flex>
                <Input
                  placeholder="Type your message"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  border={"none"}
                  focusBorderColor="transparent"
                />
                <Button onClick={handleClick}>Send</Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};

export default Homepage;
