import React from "react";
import {
  Box,
  Flex,
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
  const { _id, name, avatar } = useSelector<RootState, AuthState>(
    (store) => store.auth
  );
  const { members, newRoom, notifications, privateId, showLeftTab } =
    useSelector<RootState, ChatState>((store) => store.chat);

  const dispatch = useDispatch();

  const joinPublicChat = (room: string) => {
    const pRoom = newRoom;
    dispatch(setPreviousRoom(pRoom));
    dispatch(setPrivateId(""));
    dispatch(setNewRoom(room));
    dispatch(setTypeRoom("chatroom"));

    const { [room]: del, ...left } = notifications;
    dispatch(setNotifications({ ...left }));
    dispatch(setShowLeftTab(false));
  };

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
        <Tab>Public Rooms</Tab>
        <Tab>Private Chats</Tab>
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
                p={"10px"}
                justifyContent={"space-between"}
              >
                <Box>{e} </Box>
                {notifications[e] && (
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
                    {notifications[e]}
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
                onClick={() => joinPrivateChat(e._id)}
                bg={e._id == privateId ? "gray.400" : ""}
                _hover={{
                  cursor: "pointer",
                  bg: e._id == privateId ? "gray.400" : "gray.200",
                }}
                p={"10px"}
                justifyContent={"space-between"}
              >
                {e.name} {e._id == _id ? "(You)" : `(${e.status})`}
              </Flex>
            );
          })}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default LeftTab;
