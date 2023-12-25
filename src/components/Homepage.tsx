import { logout } from "@/redux/authSlice/authSlice";
import { AppDispatch } from "@/redux/store";
import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { baseUrl } from "../../configs";
import Axios from "../../axios";
import { socket } from "../../socket";

const Homepage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const logoutRequest = async (url: string) => {
    try {
      let res = await Axios.get(url);
      console.log(res);
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("chatMsg", (msg) => {
      setMessages((prevMessages: any) => [...prevMessages, msg]);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("chatMsg", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Hello this is home page</h1>
      <Button
        onClick={() => {
          logoutRequest(baseUrl + "/user/logout");
        }}
      >
        Logout
      </Button>

      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        <input
          type="text"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Homepage;
