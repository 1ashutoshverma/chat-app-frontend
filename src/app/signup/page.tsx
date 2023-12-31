"use client";
import Navbar from "@/components/Navbar";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  useImage,
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
import { FaPlus } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "../../../configs";

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

const Page = () => {
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

  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth]);

  const [profile, setProfile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setProfile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (profile) {
      // Create a reference to the storage bucket
      const storageRef = ref(storage, `images/${Date.now()}${profile.name}`);

      // Upload the file
      await uploadBytes(storageRef, profile);

      // Get the download URL
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (profile) {
      // Create a reference to the storage bucket
      const storageRef = ref(storage, `images/${Date.now()}${profile.name}`);

      // Upload the file
      await uploadBytes(storageRef, profile);

      // Get the download URL
      const url = await getDownloadURL(storageRef);
      if (url) {
        console.log(url);
        const { confirmPassword, ...rest } = user;
        signUp(baseUrl + "/user/signup", { ...rest, avatar: url });
      } else {
        console.log("Something went wrong in firebase!");
      }
    } else {
      toast({
        description: "Select your profile pic",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box>
      <Flex
        width={"100vw"}
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        maxW={"1280px"}
        m={"auto"}
      >
        <Grid
          gridTemplateColumns={["1fr", "1fr", "0.8fr 1fr"]}
          boxShadow={"rgba(99, 99, 99, 0.4) 0px 2px 8px 0px"}
          borderRadius={"10px"}
          // h={"500px"}
          width={["90%", "80%", "80%"]}
          // h={["600px", "600px", "700px"]}
          // maxH={"95%"}
        >
          <Box
            bgGradient="linear(to-t, purple.400, blue.300 ,green.300)"
            color={"white"}
            borderLeftRadius={"10px"}
            display={["none", "none", "block"]}
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
                <Icon as={IoMdChatbubbles} w={"70px"} h={"70px"} />
                <Heading fontSize={"2.7rem"}>Chat App</Heading>
              </Flex>
              <Text
                textAlign={"center"}
                fontSize={["1.2rem", "1.3rem", "1.5rem"]}
              >
                Share Your Smile With This World and Loved Ones
              </Text>
              <Flex flexDir={"column"} alignItems={"center"}>
                <Icon as={VscCoffee} w={"70px"} h={"70px"} />
                <Text
                  textAlign={"center"}
                  fontSize={["1.2rem", "1.3rem", "1.5rem"]}
                >
                  Enjoy..!
                </Text>
              </Flex>
            </Flex>
          </Box>

          <form onSubmit={handleSubmit}>
            <Flex
              flexDir={"column"}
              p={["15px", "25px", "30px"]}
              gap={"15px"}
              justifyContent={"center"}
              h={"100%"}
              // maxW={"70%"}
              m={"auto"}
            >
              <Flex justifyContent={"center"}>
                <Icon
                  as={IoMdChatbubbles}
                  w={"70px"}
                  h={"70px"}
                  color={"blue.500"}
                />
              </Flex>
              <Heading
                textAlign={"center"}
                color={"purple.500"}
                p={"10px 0"}
                fontSize={["1.6rem", "1.8rem", "2.5rem"]}
              >
                SIGN UP HERE
              </Heading>
              <Box
                position={"relative"}
                // border={"1px solid red"}
                maxW={"fit-content"}
                m={"auto"}
              >
                {profile && (
                  <Box mt="4">
                    <Image
                      src={URL.createObjectURL(profile)}
                      alt="Preview"
                      w={["100px", "120px"]}
                      h={["100px", "120px"]}
                      objectFit="cover"
                      borderRadius={"50%"}
                    />
                  </Box>
                )}
                {!profile && (
                  <Image
                    src="/download.jpeg"
                    w={["100px", "120px"]}
                    h={["100px", "120px"]}
                    objectFit="cover"
                    borderRadius={"50%"}
                  />
                )}

                <label htmlFor="image-input">
                  <Input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <IconButton
                    as="span"
                    aria-label="Add Image"
                    icon={<FaPlus />}
                    bg={"blue.500"}
                    color={"green.100"}
                    fontSize="20px"
                    position="absolute"
                    bottom="0"
                    right="0"
                    borderRadius={"50%"}
                  />
                </label>
              </Box>

              <FormControl isRequired>
                {/* <FormLabel color={"gray.600"}>Name</FormLabel> */}
                <Input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={user.name}
                  onChange={handleUser}
                  // border={"1px solid grey"}
                  fontSize={["1.2rem", "1.3rem", "1.5rem"]}
                  py={["6", "6", "7"]}
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
                  fontSize={["1.2rem", "1.3rem", "1.5rem"]}
                  py={["6", "6", "7"]}
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
                  fontSize={["1.2rem", "1.3rem", "1.5rem"]}
                  py={["6", "6", "7"]}
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
                  fontSize={["1.2rem", "1.3rem", "1.5rem"]}
                  py={["6", "6", "7"]}
                />
              </FormControl>
              <Button
                type="submit"
                bgGradient="linear(to-l, purple.400, blue.300 ,green.300)"
                _hover={{
                  bgGradient: "linear(to-l, purple.500, blue.400 ,green.400)",
                }}
                fontSize={["1.2rem", "1.3rem", "1.5rem"]}
                py={["6", "6", "7"]}
              >
                Sign up
              </Button>
              <Text
                textAlign={"center"}
                fontSize={["1.1rem", "1.25rem", "1.5rem"]}
              >
                Already Signed Up?{" "}
                <Box
                  as="span"
                  fontWeight={"700"}
                  color={"purple.500"}
                  _hover={{ color: "green.400", cursor: "pointer" }}
                  onClick={() => {
                    router.push("/login");
                  }}
                  fontSize={["1.1rem", "1.25rem", "1.5rem"]}
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

export default Page;
