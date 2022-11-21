import { useEffect, useState } from "react";

import { FiEdit2 } from "react-icons/fi";
import ThemeSwticher from "./ThemeSwticher";
import __supabase from "../lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const MeSettings = ({ data }) => {
	const router = useRouter();
	const [userData, setUserData] = useState(data);
	const [isDarkMode, setDarkMode] = useState();

	const { user_metadata, id, email } = userData;

	const SignOutUser = () => {
		toast.loading("Signing out...");
		__supabase.auth.signOut().then(({ error }) => {
			if (error) {
				toast.error(error.message);
			} else {
				toast.dismiss();
				toast.success("Signed out!");
				router.push("/login");
			}
		});
	};

	const updateUserPosts = async (e) => {
		// update all posts with new username
		toast.loading("Updating posts...");

		const { data, error } = await __supabase
			.from("user_feed")
			.update({ uploader_handler: user_metadata.username })
			.eq("uploader_id", id);

		if (error) {
			toast.error(error.message);
		}

		toast.dismiss();
		toast.success("Updated posts!");
		router.reload();
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
					// update user data
					setUserData({
						...userData,
						user_metadata: {
							...user_metadata,
							first_name: first_name.value,
							last_name: last_name.value,
							username: username.value,
						},
					});

					toast.dismiss();
					toast.success("Updated user!");

					// only update posts if username changed
					if (username.value !== user_metadata.username) {
						updateUserPosts();
					} else {
						router.reload();
					}
				}
			});
	};

	useEffect(() => {
		if (localStorage.getItem("theme") === "stability") {
			setDarkMode(true);
		}
	}, []);

	useEffect(() => {
		if (isDarkMode) {
			document.body.setAttribute("data-theme", "stability");
			localStorage.setItem("theme", "stability");
		} else {
			document.body.setAttribute("data-theme", "success");
			localStorage.setItem("theme", "success");
		}
	}, [isDarkMode]);

	return (
		<>
			{/* <ThemeSwticher isOpen={themeOpen} setOpen={setThemeOpen} /> */}

			<div className="flex flex-col gap-[70px]">
				<div className="flex flex-col gap-2">
					<p className="text-xl">User Settings</p>
					<div className="grid grid-cols-2 gap-5 items-center">
						{/* change theme toggler */}
						<div className="">
							<label className="flex items-center justify-between">
								<span className="ml-2">Dark Mode</span>
								<input
									type="checkbox"
									className="toggle toggle-primary"
									checked={isDarkMode}
									onChange={(e) => {
										setDarkMode(e.target.checked);
										// setTheme();
									}}
								/>
							</label>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<p className="text-xl">User Information</p>

					{/* user information input fields */}
					<form onSubmit={(e) => editUser(e)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-">
						{/* <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2 col-start-1">
              <label htmlFor="submit">Confirm Edit</label>
              <button className="btn btn-primary">
                <FiEdit2 />
                <span className="ml-2">Edit</span>
              </button>
            </div> */}
						<div className="flex flex-col gap-2">
							<label htmlFor="submit">Sign out current session</label>
							<label htmlFor="signOutModal" className="btn btn-warning modal-button">
								Sign Out
							</label>
						</div>
					</form>
				</div>
			</div>

			{/* sign out modal */}
			<input type="checkbox" id="signOutModal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Sign out account</h3>
					<p className="py-4">Are you sure you want to sign out of your account?</p>
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
