"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Axios from "../../axios";
import { logout } from "@/redux/authSlice/authSlice";
import { baseUrl } from "../../configs";
import { IoMdChatbubbles } from "react-icons/io";
import { Icon } from "@chakra-ui/react";
import { useAppSelector } from "@/redux/providers";
import Cookies from "js-cookie";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginComponent, setLoginComponent] = useState<any>();
  const isAuth = useAppSelector((store) => store.auth.isAuth);
  const avatar = useAppSelector((store) => store.auth.avatar);
  const name = useAppSelector((store) => store.auth.name);
  // console.log(isAuth);
  const logoutRequest = async (url: string) => {
    try {
      let res = await Axios.get(url);
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
                    logoutRequest(baseUrl + "/user/logout");
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
    <Box>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        borderBottom={"1px solid red"}
        padding={"10px 15px"}
        maxW={"1200px"}
        m={"auto"}
      >
        <Link href={"/"}>
          <Icon as={IoMdChatbubbles} w={10} h={10} color="blue.500" />
        </Link>
        <Box>{loginComponent}</Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
