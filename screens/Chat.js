import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";

import { TouchableOpacity, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { chatId } = route.params || {}; // Get the chat id from the route params

  const onSignOut = () => {
    signOut(auth)
      .then(() => console.log("User signed out"))
      .catch((error) => console.log("Error logging out: ", error));
  };
  const onDeleteMessage = async () => {
    if (selectedMessageId) {
      try {
        await deleteDoc(doc(database, `chats/${chatId}`, selectedMessageId));
        setMessages((previousMessages) =>
          previousMessages.filter(
            (message) => message._id !== selectedMessageId
          )
        );
        setSelectedMessageId(null); // Reset the selected message id
      } catch (error) {
        console.log("Error deleting message: ", error);
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={selectedMessageId ? onDeleteMessage : onSignOut}
        >
          <AntDesign name="logout" size={24} color={colors.gray} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!chatId) {
      return;
    }
    const collectionRef = collection(database, `chats/${chatId}`);
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return unsubscribe;
  }, [chatId]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, `chats/${chatId}`), {
      _id,
      createdAt,
      text,
      user
    })
      .then(() => console.log("Message sent"))
      .catch((error) => console.log("Error sending message: ", error));
  }, [chatId]);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={(messages) => onSend(messages)}
      onLongPress={(context, message) => {
        setSelectedMessageId(message._id); // Set the selected message id when a message is long-pressed
      }}
      messagesContainerStyle={{ backgroundColor: "#fff" }}
      textInputStyle={{ backgroundColor: "#fff", borderRadius: 20 }}
      user={{
        _id: auth?.currentUser?.uid,
        avatar: "https://i.pravatar.cc/300",
      }}
    />
  );
}
