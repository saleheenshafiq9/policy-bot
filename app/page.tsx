"use client";
import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Message } from "@/components/Message";
import { SkeletonMessage } from "@/components/SkeletonMessage";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faPlus, faMessage } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface ResponseData {
  response: string;
  source: string;
}

export default function Home() {
  const [messageText, setMessageText] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [newMsg, setNewMsg] = useState<
    { _id: string; role: string; content: string }[]
  >([]);
  const [responseIndex, setResponseIndex] = useState(0);
  const [generateResponse, setGenerateResponse] = useState(false);
  const [chatList, setChatList] = useState(() => {
    const storedChatList = localStorage.getItem("chatList");
    return storedChatList ? JSON.parse(storedChatList) : [];
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Create a ref for the textarea
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load chat history from local storage when the component mounts
    const storedChatList = localStorage.getItem("chatList");
    if (storedChatList) {
      setChatList(JSON.parse(storedChatList));
    }

    // ... (remaining useEffect logic)
  }, []);

  useEffect(() => {
    // Save chat history to local storage whenever newMsg or responses change
    localStorage.setItem("chatList", JSON.stringify(chatList));
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [newMsg, responses, chatList]);

  useEffect(() => {
    console.log(currentSessionId);
  }, [currentSessionId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [messageText, generateResponse]);

  useEffect(() => {
    if (newMsg.length > 0) {
      updateChatList(newMsg, responses);
    }
  }, [responses]);

  const updateChatList = (newMsg: any[], responses: ResponseData[]) => {
    const existingChatSessionsString = localStorage.getItem("chatSessions");
    const existingChatSessions = existingChatSessionsString
      ? JSON.parse(existingChatSessionsString)
      : [];

    const existingChatIndex = chatList.findIndex(
      (chat: { _id: string }) => chat._id === currentSessionId
    );
    console.log(existingChatIndex);

    if (existingChatIndex !== -1) {
      // Update the existing chat session in chatList
      const updatedChatList = chatList.map((chat: any, index: any) => {
        if (index === existingChatIndex) {
          // Update content and creation timestamp of the existing session
          return {
            ...chat,
            content: newMsg[0].content,
            createdAt: new Date().toISOString(),
          };
        }
        return chat;
      });

      // Update chatList state with the updated chat session
      setChatList(updatedChatList);

      // Update corresponding existingChatSession
      const updatedExistingChatSession = {
        ...existingChatSessions[existingChatIndex],
        messageTexts: newMsg.map((msg) => msg.content),
        responses,
        createdAt: new Date().toISOString(),
      };

      // Update existing chat sessions with the modified session
      const updatedChatSessions = [
        ...existingChatSessions.slice(0, existingChatIndex),
        updatedExistingChatSession,
        ...existingChatSessions.slice(existingChatIndex + 1),
      ];

      // Save the updated chat sessions to local storage
      localStorage.setItem("chatSessions", JSON.stringify(updatedChatSessions));
    } else {
      const sessionId = uuid(); // Assuming you have the uuid library available
      setCurrentSessionId(sessionId);

      const newChat = {
        _id: sessionId,
        content: newMsg[0].content, // Set content to the current messageText state
        createdAt: new Date().toISOString(), // Add the creation timestamp
      };

      // Update the chatList state with the new chat
      setChatList((prevChatList: any) => [newChat, ...prevChatList]);

      const currentChatSession = {
        sessionId,
        messageTexts: newMsg.map((msg) => msg.content),
        responses,
        createdAt: new Date().toISOString(), // Add the creation timestamp
      };

      // Add the current session to the existing chat sessions
      const updatedChatSessions = [currentChatSession, ...existingChatSessions];

      // Save the updated chat sessions to local storage
      localStorage.setItem("chatSessions", JSON.stringify(updatedChatSessions));
    }
  };

  const cleanThingsUp = () => {
    setResponses([]);
    setNewMsg([]);
    setResponseIndex(0);
    setGenerateResponse(false);
    setMessageText(""); // Optionally reset messageText to empty string
    setMessageTitle("");
    setCurrentSessionId(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerateResponse(true);
    setMessageTitle(messageText);
    // Update this line to include the 'return' statement
    setNewMsg((prev) => {
      const newMsg = [
        ...prev,
        {
          _id: uuid(),
          role: "user",
          content: messageText,
        },
      ];
      return newMsg;
    });
    setMessageText("");

    try {
      const res = await axios.post("http://localhost:8000/question", {
        input_text: messageText,
      });

      // Update the responses array with the new response object
      setResponses((prev) => [...prev, res.data as ResponseData]);

      // Reset the responseIndex to the last index in the responses array
      setResponseIndex(responses.length);
      setGenerateResponse(false);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const handleNewChatClick = () => {
    if (messageTitle.trim() === "" && newMsg.length === 0) {
      return;
    }

    if (messageTitle.trim() === "" && newMsg.length > 0) {
      cleanThingsUp();
    } else {
      // updateChatList(newMsg, responses);
      cleanThingsUp();
    }
  };

  const handlePreviousChat = (sessionId: any) => {
    setCurrentSessionId(sessionId);
    // When you need to retrieve the specific chat data
    const existingChatSessionsString = localStorage.getItem("chatSessions");
    const existingChatSessions = existingChatSessionsString
      ? JSON.parse(existingChatSessionsString)
      : [];

    // Find the chat session with the specified sessionId
    const chatSession = existingChatSessions.find(
      (session: { sessionId: any }) => session.sessionId === sessionId
    );

    if (chatSession) {
      // Now, `chatSession` contains the data for the specified session
      const messageTexts = chatSession.messageTexts;
      const responses = chatSession.responses;
      setNewMsg(
        messageTexts.map((content: any, index: any) => ({
          _id: `${sessionId}_${index}`, // Assuming each message has a unique _id
          role: "user",
          content,
        }))
      );
      setResponses(responses);
      // Use the data as needed in your application logic
      // ...
    } else {
      console.error(`Chat session with sessionId ${sessionId} not found`);
    }
  };

  const formatTimestamp = (timestamp: string | number | Date) => {
    const currentDate = new Date();
    const providedDate = new Date(timestamp);

    const timeDifferenceInSeconds = Math.floor(
      (currentDate.getTime() - providedDate.getTime()) / 1000
    );

    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 1) {
      return `${days} d`;
    } else if (hours >= 1) {
      return `${hours} hr`;
    } else if (minutes >= 1) {
      return `${minutes} min`;
    } else {
      return "now";
    }
  };

  const sortChatListByTimestamp = (chatList: any[]) => {
    return chatList
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  // Call the function to sort chatList before rendering and store the sorted data
  const sortedChatList = sortChatListByTimestamp(chatList);

  return (
    <>
      <Head>
        <title>SRBD Bot</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <div className="bg-gradient-to-r from-blue-50 to-blue-200 text-blue-600 flex flex-col overflow-hidden">
          <div className="flex justify-center items-center p-5">
            <Image
              src="/logo_blue.png" // Path to the image from the public folder
              alt="logo"
              width={160} // Adjust the width of the image
              height={80} // Adjust the height of the image
              objectFit="contain" // Preserve the aspect ratio and center the image
              style={{ opacity: 0.7 }}
            />
          </div>
          <Link
            href="/"
            onClick={handleNewChatClick} // Add the click handler to reset states
            className="side-menu-item bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
            New Chat
          </Link>
          <div className="flex-1 overflow-auto">
            {sortedChatList.map(
              (
                chatItem: { _id: any; content: string; createdAt: string },
                index: React.Key | null | undefined
              ) => (
                <Link
                  key={index}
                  href="/" // Update the href based on your requirements
                  onClick={() => handlePreviousChat(chatItem._id)}
                  className="side-menu-item bg-blue-50 hover:bg-blue-100 text-blue-600"
                >
                  <div className="items-center">
                    <div className="chat-content">
                      <FontAwesomeIcon
                        icon={faMessage}
                        className="text-blue-600"
                      />
                      <span className="ml-2 font-semibold">
                        {chatItem.content.length > 25
                          ? chatItem.content.substring(0, 25) + "..."
                          : chatItem.content}
                      </span>
                    </div>
                    {/* This will push the timestamp to the right */}
                    <div className="timestamp text-xs text-gray-500 ml-40 pl-3 text-right p-1">
                      {formatTimestamp(chatItem.createdAt)}
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>

          {/* Using size attribute */}
          <FontAwesomeIcon
            icon={faRobot}
            className="text-blue-600 pt-5"
            size="4x"
          />

          {/* Text underneath */}
          <div className="mt-2 text-xl justify-center items-center flex flex-col p-3 font-semibold">
            SRBD-BOT
          </div>
        </div>

        <div className="bg-zinc-50 flex flex-col overflow-hidden">
          <div
            className="flex-1 text-black overflow-y-scroll"
            id="message-list"
          >
            {newMsg.length > 0 ? (
              newMsg.map((message, index) => (
                <React.Fragment key={message._id}>
                  <Message
                    role={message.role}
                    content={message.content}
                    source=""
                  />
                  {responses.length > 0 && responses[index] ? (
                    <Message
                      role="SRBD-BOT"
                      content={responses[index].response}
                      source={responses[index].source}
                    />
                  ) : (
                    generateResponse && <SkeletonMessage />
                  )}

                  <div
                    ref={(el) => {
                      if (el && !document.querySelector(":focus")) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  />
                </React.Fragment>
              ))
            ) : (
              <div className="alternate-style">
                <div className="center-container">
                  <FontAwesomeIcon
                    icon={faRobot}
                    className="text-slate-400 p-5"
                    size="6x"
                  />
                  <p className="no-messages p-5 text-xl">
                    Hello, SRBDian! I'm SRBD-Bot. <br></br>
                    <br></br>Ask me anything you want related to:
                  </p>
                  <div className="list-container">
                    <div className="list-column">
                      <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                      </ul>
                    </div>
                    <div className="list-column">
                      <ul>
                        <li>Item 4</li>
                        <li>Item 5</li>
                        <li>Item 6</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {errorMessage && (
            <div
              className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{errorMessage}</span>
            </div>
          )}
          <footer className="bg-gradient-to-r from-blue-50 to-blue-100 p-7">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generateResponse}>
                <textarea
                  ref={textareaRef} // Assign the ref to the textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    // Check if the Enter key is pressed
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Prevent the default behavior (e.g., newline)
                      handleSubmit(e); // Call your submit function
                    }
                  }}
                  placeholder={generateResponse ? "" : "Ask me about SRBD policies..."}
                  autoFocus
                  className="w-full resize-none rounded-md bg-blue-50 text-black focus:border-blue-500 focus:bg-zinc-50 focus:outline-blue-500 p-1"
                />
                <button type="submit" className="btn">
                  Send
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}
