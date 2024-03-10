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
  const [chatList, setChatList] = useState([
    // Sample chat history data
    {
      _id: uuid(),
      content: "Hello, SRBD-BOT!",
    },
    {
      _id: uuid(),
      content: "Hi there! How can I help you today?",
    },
    // Add more dummy messages as needed
  ] as any[]);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Create a ref for the textarea

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
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [messageText, generateResponse]);

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewChatClick = () => {
    // Add a new chat to chatList
    const newChat = {
      _id: uuid(),
      content: messageTitle, // Set content to the current messageText state
    };

    // Update the chatList state with the new chat
    setChatList((prevChatList) => [newChat, ...prevChatList]);

    // Reset necessary states
    setResponses([]);
    setNewMsg([]);
    setResponseIndex(0);
    setGenerateResponse(false);
    setMessageText(""); // Optionally reset messageText to empty string
    setMessageTitle("");
  };
  return (
    <>
      <Head>
        <title>SRBD Bot</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white flex flex-col overflow-hidden">
          <Link
            href="/"
            onClick={handleNewChatClick} // Add the click handler to reset states
            className="side-menu-item bg-zinc-50 hover:bg-blue-100 text-blue-600"
          >
            <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
            New Chat
          </Link>
          <div className="flex-1 overflow-auto">
            {chatList.map((chatItem, index) => (
              <Link
                key={index}
                href="/chat" // Update the href based on your requirements
                className="side-menu-item bg-blue-500 hover:bg-blue-700 text-white"
              >
                {/* Display chat item content here, adjust as needed */}
                <FontAwesomeIcon icon={faMessage} className="text-white" />
                {chatItem.content}
              </Link>
            ))}
          </div>
          {/* Using size attribute */}
          <FontAwesomeIcon
            icon={faRobot}
            className="text-blue-200 pt-5"
            size="4x"
          />

          {/* Text underneath */}
          <div className="mt-2 text-xl justify-center items-center flex flex-col p-3">
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
                    ref={(el) =>
                      el && el.scrollIntoView({ behavior: "smooth" })
                    }
                  />
                  {/* Add ref for auto-scroll */}
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

          <footer className="bg-gradient-to-r from-blue-50 to-blue-100 p-10">
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
                  placeholder={generateResponse ? "" : "Ask me anything..."}
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
