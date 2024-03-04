"use client";
import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Message } from "@/components/message";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [messageText, setMessageText] = useState("");
  const [response, setResponse] = useState("");
  const [newMsg, setNewMsg] = useState<
    { _id: string; role: string; content: string }[]
  >([]);
  const [generateResponse, setGenerateResponse] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerateResponse(true);

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
      return newMsg; // Add this line to return the new array
    });
    setMessageText("");

    try {
      const res = await axios.post("http://localhost:8000/question", {
        input_text: messageText,
      });

      setResponse(res.data.response);
      setGenerateResponse(false);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>SRBD Bot</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <div className="bg-blue-500 text-white flex flex-col items-center justify-center">
          {/* Using size attribute */}
          <FontAwesomeIcon icon={faRobot} className="text-blue-200" size="7x" />

          {/* Text underneath */}
          <div className="mt-2 text-xl">SRBD-BOT</div>
        </div>

        <div className="bg-zinc-50 flex flex-col overflow-hidden">
          <div className="flex-1 text-black overflow-scroll">
            {newMsg.map((message) => (
              <React.Fragment key={message._id}>
                <Message role={message.role} content={message.content} />
                {!!response && <Message role="SRBD-BOT" content={response} />}
              </React.Fragment>
            ))}
          </div>
          <footer className="bg-blue-50 p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generateResponse}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={generateResponse ? "" : "Ask me anything..."}
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
