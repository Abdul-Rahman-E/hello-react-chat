import React, { useContext, useEffect, useState } from "react";
import { IoIosMore } from "react-icons/io";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        {data.chatId !== "null" && (
          <div className="chatIcons">
            <div className="more">
              <IoIosMore />
            </div>
          </div>
        )}
      </div>
      <Messages />
      {data.chatId !== "null" && <Input />}
    </div>
  );
};

export default Chat;
