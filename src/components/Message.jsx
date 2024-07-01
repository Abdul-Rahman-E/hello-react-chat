import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const convertTimestampToTime = (date) => {
    const { seconds, nanoseconds } = date;
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    const dateObject = new Date(milliseconds);

    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const getTimeDifference = (date) => {
    const { seconds, nanoseconds } = date;
    const messageTime = new Date(seconds * 1000 + nanoseconds / 1000000);
    const now = new Date();
    return Math.floor((now - messageTime) / 1000);
  };

  const [time, setTime] = useState(() => {
    const timeDifference = getTimeDifference(message.date);
    return timeDifference < 60
      ? "just now"
      : convertTimestampToTime(message.date);
  });

  const handleDelete = async (mesg) => {
    try {
      const chatRef = doc(db, "chats", data.chatId);

      const chatDoc = await getDoc(chatRef);
      const chatData = chatDoc.data();

      const updatedMessages = chatData.messages.filter(
        (message) => message.id !== mesg.id
      );

      await updateDoc(chatRef, {
        messages: updatedMessages,
      });

      const newLastMessage =
        updatedMessages.length > 0
          ? updatedMessages[updatedMessages.length - 1]
          : null;

      const userChatUpdate = {
        [data.chatId + ".lastMessage"]: newLastMessage
          ? { text: newLastMessage.text, date: newLastMessage.date }
          : {},
        [data.chatId + ".date"]: newLastMessage ? newLastMessage.date : null,
      };

      await updateDoc(doc(db, "userChats", currentUser.uid), userChatUpdate);
      await updateDoc(doc(db, "userChats", data.user.uid), userChatUpdate);
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const timeDifference = getTimeDifference(message.date);
      if (timeDifference < 60) {
        setTime("just now");
      } else {
        setTime(convertTimestampToTime(message.date));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [message.date]);

  return (
    <div
      className={`message ${
        message.senderId === currentUser.uid ? "owner" : ""
      }`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{time}</span>
      </div>
      <div className="messageContent">
        <div>
          <p>{message.text}</p>
          {message.senderId === currentUser.uid && (
            <span>
              <MdDelete
                onClick={() => {
                  handleDelete(message);
                }}
              />
            </span>
          )}
        </div>

        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
