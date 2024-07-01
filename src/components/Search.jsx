import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  startAt,
  endAt,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  const handleSearch = async () => {
    setErr(false);
    setUsers([]);

    if (username.trim() === "") {
      setErr(true);
      return;
    }

    const q = query(
      collection(db, "users"),
      orderBy("displayName"),
      startAt(username.trim()),
      endAt(username.trim() + "\uf8ff")
    );

    try {
      const querySnapshot = await getDocs(q);
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push(doc.data());
      });

      const filteredUsers = usersList.filter((user) =>
        user.displayName.toLowerCase().includes(username.trim().toLowerCase())
      );

      if (filteredUsers.length === 0) {
        setErr(true);
      } else {
        setUsers(filteredUsers);
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async (u) => {
    if (!u) return;
    dispatch({ type: "CHANGE_USER", payload: u });
    const combinedId =
      currentUser.uid > u.uid
        ? currentUser.uid + u.uid
        : u.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: u.uid,
            displayName: u.displayName,
            photoURL: u.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", u.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error selecting user:", err);
    }

    setUsers([]);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && (
        <span
          style={{
            padding: "2px",
            justifySelf: "center",
            border: "2px solid red",
          }}
        >
          User not found!
        </span>
      )}
      {users.length > 0 &&
        users.map((u) => (
          <div className="userChat" key={u.uid} onClick={() => handleSelect(u)}>
            <img src={u.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{u.displayName}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Search;
