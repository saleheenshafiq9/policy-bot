import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faUser,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export const Message = ({ role, content, source }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLikeInvisible, setIsLikeInvisible] = useState(false);
  const [isDislikeInvisible, setIsDislikeInvisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDislikeClick = () => {
    setIsDisliked(true);
    setIsLikeInvisible(true);
    setShowDropdown(true);
  };

  const handleDropdownOptionClick = (option) => {
    // Handle logic based on the selected dropdown option
    console.log(`Selected option: ${option}`);

    // You can add more specific logic based on the selected option, e.g., open a modal, send a request, etc.

    // Close the dropdown after handling the option
    setShowDropdown(false);
  };

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
      <div className="flex flex-col relative">
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
              {!isDislikeInvisible && (
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  className={`cursor-pointer ${
                    isDisliked
                      ? "text-slate-600 text-xl px-2"
                      : "text-slate-400 hover:text-slate-600 text-xl px-2"
                  }`}
                  onClick={handleDislikeClick}
                />
              )}
              {showDropdown && (
                <div className="absolute top-23 right-0 bg-white border border-gray-300 rounded-md shadow-md p-2">
                  <div
                    className="cursor-pointer text-slate-400 hover:text-white hover:bg-blue-600"
                    onClick={() => handleDropdownOptionClick("Report Issue")}
                  >
                    Report Issue
                  </div>
                  <div
                    className="cursor-pointer text-slate-400 hover:text-white hover:bg-blue-600"
                    onClick={() => handleDropdownOptionClick("Give Feedback")}
                  >
                    Give Feedback
                  </div>
                  {/* Add other options as needed */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
