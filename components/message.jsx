import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import {
  faRobot,
  faUser,
  faThumbsUp as solidThumbsUp,
  faThumbsDown as solidThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp as outlineThumbsUp,
  faThumbsDown as outlineThumbsDown,
} from "@fortawesome/free-regular-svg-icons";

export const Message = ({ role, content, source }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
  };

  const handleDislikeClick = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    setModalIsOpen(true); // Open the modal on dislike click
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleFeedbackSubmit = () => {
    // Add your logic for handling the feedback submission
    console.log("Message Content:", content);
    console.log("Feedback submitted:", feedbackText);
    closeModal();
  };

  return (
    <div
      className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${
        role === "SRBD-BOT" ? "bg-gradient-to-r from-blue-50 to-blue-100" : ""
      }`}
    >
      <div>
        {role === "user" && (
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full shadow-md shadow-blue-500/50 bg-blue-500">
            <FontAwesomeIcon icon={faUser} className="text-blue-200" />
          </div>
        )}
        {role === "SRBD-BOT" && (
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full shadow-md shadow-blue-500/50 bg-blue-800">
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
              <FontAwesomeIcon
                icon={isLiked ? solidThumbsUp : outlineThumbsUp}
                className={`cursor-pointer text-xl px-2 ${
                  isLiked
                    ? "text-blue-600"
                    : "text-blue-400 hover:text-blue-600"
                }`}
                onClick={handleLikeClick}
              />

              {/* Thumbs Down */}
              <FontAwesomeIcon
                icon={isDisliked ? solidThumbsDown : outlineThumbsDown}
                className={`cursor-pointer text-xl px-2 ${
                  isDisliked
                    ? "text-slate-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                onClick={handleDislikeClick}
              />
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Feedback Modal"
                className="custom-modal"
                overlayClassName="custom-modal-overlay"
              >
                <div className="modal-content">
                  <h2 className="modal-header">Feedback Form</h2>
                  <p>Please provide your feedback or report an incident:</p>
                  {/* Include the original message content in the feedback textarea */}
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Type your feedback here..."
                    rows={4}
                    className="feedback-textarea"
                  />
                  <div className="button-container">
                    <button onClick={handleFeedbackSubmit} className="btn">
                      Submit
                    </button>
                    {/* <button onClick={closeModal} className="close-btn">
                      <span>&times;</span>
                    </button> */}
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
