"use client";
import Navbar from "@/components/Navbar";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { baseUrl } from "../../../configs";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Axios from "../../../axios";
import { IoMdChatbubbles } from "react-icons/io";
import { VscCoffee } from "react-icons/vsc";
import { useToast } from "@chakra-ui/react";

const userInitialObject: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
} = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const page = () => {
  const [user, setUser] = useState(userInitialObject);
  const handleUser = (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const isAuth = useSelector<RootState>((store) => store.auth.isAuth);
  const router = useRouter();
  const toast = useToast();

  const signUp = async (url: string, obj: object) => {
    try {
      let res = await Axios.post(url, obj);
      // console.log(res);
      toast({
        description: res.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      // console.log(error);
    }
  };

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    const { confirmPassword, ...rest } = user;
    signUp(baseUrl + "/user/signup", rest);
  };

  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth]);

  return (
    <Box>
      <Navbar />
      <Flex
        width={"100vw"}
        height={"90vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid
          gridTemplateColumns={"0.75fr 1fr"}
          boxShadow={"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}
          borderRadius={"10px"}
          h={"500px"}
        >
          <Box
            bgGradient="linear(to-t, purple.400, blue.300 ,green.300)"
            color={"white"}
            borderLeftRadius={"10px"}
          >
            <Flex
              flexDir={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              w={"100%"}
              h={"100%"}
              p={"20px"}
              gap={"25px"}
            >
              <Flex flexDir={"column"} alignItems={"center"}>
                <Icon as={IoMdChatbubbles} w={"50px"} h={"50px"} />
                <Heading>Chat App</Heading>
              </Flex>
              <Text textAlign={"center"}>
                Share Your Smile With This World and Loved Ones
              </Text>
              <Flex flexDir={"column"} alignItems={"center"}>
                <Icon as={VscCoffee} w={"50px"} h={"50px"} />
                <Text textAlign={"center"}>Enjoy..!</Text>
              </Flex>
            </Flex>
          </Box>

          <form onSubmit={handleSubmit}>
            <Flex
              flexDir={"column"}
              p={"30px"}
              gap={"15px"}
              justifyContent={"center"}
              h={"100%"}
            >
              <Heading
                textAlign={"center"}
                color={"purple.500"}
                fontSize={"1.8rem"}
              >
                SIGN UP HERE
              </Heading>
              <FormControl isRequired>
                {/* <FormLabel color={"gray.600"}>Name</FormLabel> */}
                <Input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={user.name}
                  onChange={handleUser}
                />
              </FormControl>
              <FormControl isRequired>
                {/* <FormLabel color={"gray.600"}>Email</FormLabel> */}
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={user.email}
                  onChange={handleUser}
                />
              </FormControl>
              <FormControl isRequired>
                {/* <FormLabel color={"gray.600"}>Password</FormLabel> */}
                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={user.password}
                  onChange={handleUser}
                />
              </FormControl>
              <FormControl isRequired>
                {/* <FormLabel color={"gray.600"}>Confirm Password</FormLabel> */}
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleUser}
                />
              </FormControl>
              <Button
                type="submit"
                bgGradient="linear(to-l, purple.400, blue.300 ,green.300)"
                _hover={{
                  bgGradient: "linear(to-l, purple.500, blue.400 ,green.400)",
                }}
              >
                Sign up
              </Button>
              <Text textAlign={"center"}>
                Already Signed Up?{" "}
                <Box
                  as="span"
                  fontWeight={"700"}
                  color={"purple.500"}
                  _hover={{ color: "green.400", cursor: "pointer" }}
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Login Please!
                </Box>
              </Text>
            </Flex>
          </form>
        </Grid>
      </Flex>
    </Box>
  );
};

export default page;
