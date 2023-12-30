import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  ChatState,
  setNewRoom,
  setNotifications,
  setPreviousRoom,
  setPrivateId,
  setShowLeftTab,
  setTypeRoom,
} from "@/redux/chatSlice/chatSlice";
import { AuthState } from "@/redux/authSlice/authSlice";

const rooms: string[] = [
  "Public Discussion",
  "Technology",
  "Stock Market",
  "Science",
];

const LeftTab = () => {
  const [totalNotificationsPublic, setTotalNotificationsPublic] =
    useState<number>(0);
  const [totalNotificationsPrivate, setTotalNotificationsPrivate] =
    useState<number>(0);

  const { _id, name, avatar } = useSelector<RootState, AuthState>(
    (store) => store.auth
  );
  const { members, newRoom, notifications, privateId, showLeftTab } =
    useSelector<RootState, ChatState>((store) => store.chat);

  const dispatch = useDispatch();

  const joinPublicChat = (room: string) => {
    const pRoom = newRoom;
    dispatch(
      setNotifications({ type: "remove", sender: "chatroom", room: room })
    );
    dispatch(setPreviousRoom(pRoom));
    dispatch(setPrivateId(""));
    dispatch(setNewRoom(room));
    dispatch(setTypeRoom("chatroom"));
    dispatch(setShowLeftTab(false));
  };

  useEffect(() => {
    for (let key in notifications) {
      if (key === "chatroom") {
        let num1 = 0;
        for (let key2 in notifications[key]) {
          num1 += Number(notifications[key][key2]);
        }
        setTotalNotificationsPublic(num1);
      } else if (key === "private") {
        let num2 = 0;
        for (let key2 in notifications[key]) {
          num2 += Number(notifications[key][key2]);
        }
        setTotalNotificationsPrivate(num2);
      }
    }
  }, [notifications]);

  const joinPrivateChat = (e: any) => {
    if (_id == e._id) {
      return;
    }
    dispatch(
      setNotifications({ type: "remove", sender: "private", room: e._id })
    );
    const pRoom = newRoom;
    dispatch(setPreviousRoom(pRoom));
    dispatch(setPrivateId(e));

    if (_id > e._id) {
      dispatch(setNewRoom(_id + "-" + e._id));
    } else {
      dispatch(setNewRoom(e._id + "-" + _id));
    }
    dispatch(setTypeRoom("private"));

    dispatch(setShowLeftTab(false));
  };

  return (
    <Tabs
      isFitted
      variant="enclosed"
      display={{
        base: showLeftTab ? "block" : "none",
        sm: showLeftTab ? "block" : "none",
        md: "block",
      }}
      h={"100%"}
    >
      <TabList mb="1em">
        <Tab>
          Public Rooms{" "}
          {totalNotificationsPublic != 0 ? (
            <Flex
              as="span"
              width={"25px"}
              height={"25px"}
              display="flex"
              borderRadius={"50%"}
              bg={"blue.400"}
              color={"white"}
              p={"5px"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {totalNotificationsPublic}
            </Flex>
          ) : (
            <></>
          )}
        </Tab>
        <Tab>
          Private Chats{" "}
          {totalNotificationsPrivate != 0 ? (
            <Flex
              as="span"
              width={"25px"}
              height={"25px"}
              display="flex"
              borderRadius={"50%"}
              bg={"blue.400"}
              color={"white"}
              p={"5px"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {totalNotificationsPrivate}
            </Flex>
          ) : (
            <></>
          )}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {rooms.map((e, ind) => {
            return (
              <Flex
                key={ind}
                onClick={() => joinPublicChat(e)}
                bg={e == newRoom ? "gray.400" : ""}
                _hover={{
                  cursor: "pointer",
                  bg: e == newRoom ? "gray.400" : "gray.200",
                }}
                borderRadius={"10px"}
                p={"10px"}
                gap={"10px"}
                alignItems={"center"}
                // justifyContent={"space-between"}
              >
                <Flex
                  w="50px"
                  h="50px"
                  borderRadius="50%"
                  // border={"1px solid red"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  bg={"blue.300"}
                  color={"white"}
                  fontWeight={"700"}
                >
                  {e.substring(0, 2).toUpperCase()}
                </Flex>
                <Box>{e} </Box>
                {notifications.chatroom[e] && (
                  <Flex
                    as="span"
                    width={"25px"}
                    height={"25px"}
                    display="flex"
                    borderRadius={"50%"}
                    bg={"blue.400"}
                    color={"white"}
                    p={"5px"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {notifications.chatroom[e]}
                  </Flex>
                )}
              </Flex>
            );
          })}
        </TabPanel>
        <TabPanel>
          {members.map((e) => {
            return (
              <Flex
                key={e._id}
                onClick={() => joinPrivateChat(e)}
                bg={e._id == privateId._id ? "gray.400" : ""}
                _hover={{
                  cursor: "pointer",
                  bg: e._id == privateId._id ? "gray.400" : "gray.200",
                }}
                p={"10px"}
                gap={"10px"}
                alignItems={"center"}
                alignSelf={e._id === _id ? "flex-start" : ""}
                borderRadius={"10px"}
              >
                <Image
                  alt=""
                  w="50px"
                  h="50px"
                  borderRadius="50%"
                  src={e.avatar}
                />
                <Box color={e._id == _id ? "gray.400" : ""}>
                  {e.name} {e._id == _id ? "(You)" : `(${e.status})`}
                </Box>
                {notifications.private[e._id] && (
                  <Flex
                    as="span"
                    width={"25px"}
                    height={"25px"}
                    display="flex"
                    borderRadius={"50%"}
                    bg={"blue.400"}
                    color={"white"}
                    p={"5px"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {notifications.private[e._id]}
                  </Flex>
                )}
              </Flex>
            );
          })}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default LeftTab;
