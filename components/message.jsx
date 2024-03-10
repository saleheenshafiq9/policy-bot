import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faUser,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useState } from "react";

export const Message = ({ role, content, source }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLikeInvisible, setIsLikeInvisible] = useState(false);
  const [isDislikeInvisible, setIsDislikeInvisible] = useState(false);

  return (
    <div
      className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${
        role === "SRBD-BOT" ? "bg-gradient-to-r from-blue-50 to-blue-100" : ""
      }`}
    >
      <div>
        {role === "user" && (
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm shadow-md shadow-blue-500/50 bg-blue-500">
            <FontAwesomeIcon icon={faUser} className="text-blue-200" />
          </div>
        )}
        {role === "SRBD-BOT" && (
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm shadow-md shadow-blue-500/50 bg-blue-800">
            <FontAwesomeIcon icon={faRobot} className="text-blue-200" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div>{content}</div>
        {role === "SRBD-BOT" && (
          <div className="text-sm text-gray-500 mt-4">
            {source}
            <div className="text-right">
              {!isLikeInvisible ? (
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className={`cursor-pointer ${
                    isLiked
                      ? "text-blue-600 text-xl px-2"
                      : "text-blue-400 hover:text-blue-600 text-xl px-2"
                  }`}
                  onClick={() => {
                    setIsLiked(true);
                    setIsDislikeInvisible(true);
                  }}
                />
              ) : (
                ""
              )}
              {!isDislikeInvisible ? (
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  className={`cursor-pointer ${
                    isDisliked
                      ? "text-slate-600 text-xl px-2"
                      : "text-slate-400 hover:text-slate-600 text-xl px-2"
                  }`}
                  onClick={() => {
                    setIsDisliked(true);
                    setIsLikeInvisible(true);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
