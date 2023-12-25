"use client";
import Navbar from "@/components/Navbar";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { baseUrl } from "../../../configs";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { login } from "@/redux/authSlice/authSlice";
import Axios from "../../../axios";
import { IoMdChatbubbles } from "react-icons/io";
import { VscCoffee } from "react-icons/vsc";

interface IntialState {
  email: string;
  password: string;
}

const userInitialObject: IntialState = {
  email: "",
  password: "",
};

const page = () => {
  const [user, setUser] = useState(userInitialObject);
  const handleUser = (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const isAuth = useSelector<RootState>((store) => store.auth.isAuth);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const toast = useToast();

  const loginRequest = async (url: string, obj: object) => {
    try {
      let res = await Axios.post(url, obj);
      toast({
        description: res.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      dispatch(login());
    } catch (error: any) {
      // console.log(error);
      toast({
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    loginRequest(baseUrl + "/user/login", user);
  };

  const HandleGoogleLogin = () => {
    window.location.href = baseUrl + "/user/google";
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
          h={"450px"}
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
                Login Here
              </Heading>

              <FormControl isRequired>
                <Input
                  type="email"
                  placeholder="First name"
                  name="email"
                  value={user.email}
                  onChange={handleUser}
                />
              </FormControl>
              <FormControl isRequired>
                <Input
                  type="password"
                  placeholder="First name"
                  name="password"
                  value={user.password}
                  onChange={handleUser}
                />
              </FormControl>
              <Text>Forget password? </Text>
              {/* <Flex
                width={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Button
                  type="submit"
                  bgGradient="linear(to-l, purple.400, blue.300 ,green.300)"
                  _hover={{
                    bgGradient: "linear(to-l, purple.500, blue.400 ,green.400)",
                  }}
                  w={"47%"}
                  borderRadius={"none"}
                >
                  Login
                </Button>
                <Image
                  src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*u0bwdudgoyKjSLntsRcqiw.png"
                  alt=""
                  w={"53%"}
                />
              </Flex> */}
              <Button
                type="submit"
                color={"white"}
                bgGradient="linear(to-l, purple.400, blue.300 ,green.300)"
                _hover={{
                  bgGradient: "linear(to-l, purple.500, blue.400 ,green.400)",
                }}
              >
                Login
              </Button>
              <Button
                bg={"#5086EC"}
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-l, purple.500, blue.400 ,green.400)",
                }}
                onClick={HandleGoogleLogin}
              >
                Login With Google
              </Button>
              <Text textAlign={"center"}>
                New Here?{" "}
                <Box
                  as="span"
                  fontWeight={"700"}
                  color={"purple.500"}
                  _hover={{ color: "green.400", cursor: "pointer" }}
                  onClick={() => {
                    router.push("/signup");
                  }}
                >
                  Sign Up Please!
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
