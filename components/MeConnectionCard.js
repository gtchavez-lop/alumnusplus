import __supabase from "../lib/auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const MeConnectionCard = ({
  connection,
  index,
  connectionArr,
  setConnections,
}) => {
  const removeConnection = () => {
    toast.loading("Removing connection...");
    const userSession = window.localStorage.getItem("supabase.auth.token");
    const { currentSession } = JSON.parse(userSession);
    const userID = currentSession.user.id;

    // remove connection from connectionArr
    let filteredConnections = connectionArr.filter(
      (x) => x.id !== connection.id
    );
    // update user_data table
    __supabase
      .from("user_data")
      .update({
        connections: JSON.stringify(filteredConnections.map((c) => c.id)),
      })
      .eq("id", userID)
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }

        // update auth table
        toast.dismiss();
        toast.success("Connection removed!");
        setConnections(filteredConnections);
      });
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-2 relative opacity-0"
      animate={{
        y: [0, -10, 0],
        opacity: [0, 1],
        transition: {
          duration: 0.5,
          delay: 0.1 * index,
          ease: "circOut",
        },
      }}
    >
      <img
        src={`https://avatars.dicebear.com/api/micah/${connection.user_handle}.svg`}
        alt="profile pic"
        className="w-20 h-20 rounded-full bg-gray-500"
      />
      <p className="text-center">@{connection.user_handle}</p>

      {/* modal */}
      <label
        htmlFor={`connection-${index}`}
        className="btn modal-button btn-xs btn-warning"
      >
        unconnect
      </label>

      <input
        type="checkbox"
        id={`connection-${index}`}
        className="modal-toggle"
      />
      <label htmlFor={`connection-${index}`} className="modal cursor-pointer">
        <label className="modal-box relative" for="">
          <h3 className="text-lg font-bold">
            Do you want to remove @
            <span className="underline underline-offset-4">
              {connection.user_handle}
            </span>{" "}
            from your connections?
          </h3>
          <div className="flex justify-end gap-2 mt-10">
            <label
              htmlFor={`connection-${index}`}
              onClick={removeConnection}
              className="btn btn-sm btn-error"
            >
              Yes
            </label>
            <label
              htmlFor={`connection-${index}`}
              className="btn btn-sm btn-success"
            >
              No
            </label>
          </div>
        </label>
      </label>
    </motion.div>
  );
};

export default MeConnectionCard;
