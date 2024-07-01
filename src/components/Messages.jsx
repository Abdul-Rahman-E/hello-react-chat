import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="messages"
      style={
        data.chatId === "null"
          ? { height: "calc(100% - 50px)" }
          : { height: "calc(100% - 100px)" }
      }
    >
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
