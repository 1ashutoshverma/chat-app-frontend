import React from "react";
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

  const joinPrivateChat = (e: any) => {
    if (_id == e._id) {
      return;
    }
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
                onClick={() => joinPrivateChat(e)}
                bg={e._id == privateId._id ? "gray.400" : ""}
                _hover={{
                  cursor: "pointer",
                  bg: e._id == privateId._id ? "gray.400" : "gray.200",
                }}
                p={"10px"}
                // justifyContent={"space-between"}
                gap={"10px"}
                alignItems={"center"}
                alignSelf={e._id === _id ? "flex-start" : ""}
              >
                <Image
                  alt=""
                  w="50px"
                  h="50px"
                  borderRadius="50%"
                  src={e.avatar}
                />
                <Box>
                  {e.name} {e._id == _id ? "(You)" : `(${e.status})`}
                </Box>
              </Flex>
            );
          })}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default LeftTab;
