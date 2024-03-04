import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
export const Message = ({ role, content }) => {
  return (
    <div
      className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${
        role === "SRBD-BOT" ? "bg-blue-50" : ""
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
      <div>{content}</div>
    </div>
  );
};
