import {
  updateDoc,
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useContext, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { RiAttachment2 } from "react-icons/ri";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    try {
      let fileURL = null;
      let imgURL = null;

      if (!text && !file && !img) {
        alert("Atleast text is required to send a message.");
        return;
      }

      if (file) {
        const fileRef = ref(storage, uuid());
        const uploadFileTask = uploadBytesResumable(fileRef, file);
        await uploadFileTask;
        fileURL = await getDownloadURL(fileRef);
      }

      if (img) {
        const imgRef = ref(storage, uuid());
        const uploadImgTask = uploadBytesResumable(imgRef, img);
        await uploadImgTask;
        imgURL = await getDownloadURL(imgRef);
      }

      const messageData = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      };

      if (fileURL) {
        messageData.file = fileURL;
      }

      if (imgURL) {
        messageData.img = imgURL;
      }

      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(messageData),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      setText("");
      setFile(null);
      setImg(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        value={text}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <div className="send">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt,.rtf"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file">
          <RiAttachment2 className="doc-icon" />
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          style={{ display: "none" }}
          id="image"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="image">
          <RiImageAddLine className="doc-icon" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
