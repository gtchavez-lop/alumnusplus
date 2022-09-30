import __supabase from "../lib/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useUser } from "./UserContext";

const FeedUserCard = ({ user }) => {
  const { $userData } = useUser();
  const router = useRouter();

  const ConnectToUser = ({ targetID, userID, connectionsString }) => {
    toast.loading("Connecting to user...");

    const currentConnections = JSON.parse(connectionsString);

    // check if user is already connected
    if (currentConnections.includes(targetID)) {
      console.log("already connected");
      return;
    }

    // add user to connections
    currentConnections.push(targetID);

    // update user connections
    __supabase
      .from("user_data")
      .update({ connections: JSON.stringify(currentConnections) })
      .eq("id", userID)
      .then((res) => {
        toast.dismiss();
        toast.success("Connected!");
        toast("Page will reload in a second");
        setTimeout(() => {
          router.reload();
        }, 1000);
      });
  };

  return (
    <div className="flex flex-row gap-x-2 items-center bg-base-200 p-4">
      <img
        src={`https://avatars.dicebear.com/api/micah/${user.user_handle}.svg`}
        className="w-10 h-10 rounded-full bg-gray-400"
      />
      <div className="flex flex-col">
        <p className="text-lg">@{user.user_handle}</p>
        <p className="text-sm text-gray-500">
          {user.name_given} {user.name_last}
        </p>
      </div>
      {/* add connection */}
      <button
        onClick={(e) =>
          ConnectToUser({
            targetID: user.id,
            userID: __supabase.auth.user().id,
            connectionsString: $userData.connections,
          })
        }
        className="btn btn-primary btn-sm ml-auto"
      >
        Connect
      </button>
    </div>
  );
};

export default FeedUserCard;
