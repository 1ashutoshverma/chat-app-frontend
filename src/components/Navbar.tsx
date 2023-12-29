"use client";
import React, { JSXElementConstructor, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Axios from "../../axios";
import { logout } from "@/redux/authSlice/authSlice";
import { baseUrl } from "../../configs";
import { IoMdChatbubbles } from "react-icons/io";
import { Icon } from "@chakra-ui/react";
import { useAppSelector } from "@/redux/providers";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import { BiAlignLeft, BiChevronLeft } from "react-icons/bi";
import { ChatState, setShowLeftTab } from "@/redux/chatSlice/chatSlice";

type NavbarInterface = {
  height: string;
};

const Navbar: JSXElementConstructor<NavbarInterface> = ({ height }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginComponent, setLoginComponent] = useState<any>();
  const isAuth = useAppSelector((store) => store.auth.isAuth);
  const _id = useAppSelector((store) => store.auth._id);
  const avatar = useAppSelector((store) => store.auth.avatar);
  const name = useAppSelector((store) => store.auth.name);
  // console.log(isAuth);

  // const dispatch = useDispatch();
  const { showLeftTab } = useSelector<RootState, ChatState>(
    (store) => store.chat
  );

  const logoutRequest = async (url: string, obj: object) => {
    console.log(url, obj);
    try {
      let res = await Axios.post(url, obj);
      console.log(res);
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  //login and logout component update
  useEffect(() => {
    setLoginComponent(
      isAuth ? (
        <Flex justifyContent="center" alignItems="center" gap="10px">
          <Image
            src={`${avatar}`}
            alt=""
            w="50px"
            h="50px"
            borderRadius="50%"
          />
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {`${name}`}
            </MenuButton>
            <MenuList mt="10px">
              <MenuGroup title="Profile">
                <MenuItem>My Account</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem
                  onClick={() => {
                    logoutRequest(baseUrl + "/user/logout", {
                      _id: _id,
                      newMessages: {},
                    });
                  }}
                >
                  Logout
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <Flex>
          <Link href="/login">Login</Link>
        </Flex>
      )
    );
  }, [isAuth]);

  return (
    <Box h={height}>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        borderBottom={"1px solid red"}
        padding={"10px 15px"}
        maxW={"1200px"}
        m={"auto"}
      >
        <Link href={"/"}>
          {showLeftTab ? (
            <Icon
              as={BiAlignLeft}
              w={10}
              h={10}
              color="blue.500"
              display={["block", "block", "none"]}
              onClick={() => dispatch(setShowLeftTab(true))}
            />
          ) : (
            <Icon
              as={BiChevronLeft}
              w={10}
              h={10}
              color="blue.500"
              display={["block", "block", "none"]}
              onClick={() => dispatch(setShowLeftTab(true))}
            />
          )}

          <Icon
            as={IoMdChatbubbles}
            w={10}
            h={10}
            color="blue.500"
            display={["none", "none", "block"]}
          />
        </Link>
        <Box>{loginComponent}</Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
