import { FiEdit2 } from "react-icons/fi";
import __supabase from "../lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";

const MeSettings = ({ data }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(data);

  const { user_metadata, id, email } = data;

  const SignOutUser = () => {
    toast.loading("Signing out...");
    __supabase.auth.signOut().then(({ error }) => {
      if (error) {
        toast.error(error.message);
      } else {
        toast.dismiss();
        toast.success("Signed out!");
        router.push("/signin");
      }
    });
  };

  const editUser = (e) => {
    e.preventDefault();

    const { first_name, last_name, username } = e.target;

    toast.loading("Updating user...");

    __supabase.auth
      .update({
        data: {
          first_name: first_name.value,
          last_name: last_name.value,
          username: username.value,
        },
      })
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
        } else {
          toast.dismiss();
          toast.success("Updated user!");
        }
      });
  };

  return (
    <>
      <div className="flex flex-col gap-[70px]">
        <div className="flex flex-col gap-2">
          <p className="text-xl">User Information</p>

          {/* user information input fields */}
          <form
            onSubmit={(e) => editUser(e)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                name="first_name"
                className="input input-primary input-bordered"
                value={user_metadata.first_name}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    user_metadata: {
                      ...user_metadata,
                      first_name: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="input input-primary input-bordered"
                value={user_metadata.last_name}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    user_metadata: { last_name: e.target.value },
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                className="input input-primary input-bordered"
                value={user_metadata.username}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    user_metadata: { username: e.target.value },
                  })
                }
              />
            </div>

            {/* submit edit */}
            <div className="flex flex-col gap-2 col-start-1 mt-10">
              <label htmlFor="submit">Confirm Edit</label>
              <button className="btn btn-primary">
                <FiEdit2 />
                <span className="ml-2">Edit</span>
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xl">User Settings</p>
          <div className="grid grid-cols-2 gap-5">
            {/* sign out button */}
            <label htmlFor="signOutModal" className="btn modal-button">
              Sign Out
            </label>
          </div>
        </div>
      </div>

      {/* sign out modal */}
      <input type="checkbox" id="signOutModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Sign out account</h3>
          <p className="py-4">
            Are you sure you want to sign out of your account?
          </p>
          <div className="modal-action">
            <label htmlFor="signOutModal" className="btn btn-ghost">
              Cancel
            </label>
            <button className="btn btn-primary" onClick={SignOutUser}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeSettings;
