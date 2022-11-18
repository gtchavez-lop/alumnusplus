import { FiLoader, FiMail, FiSearch, FiUserMinus, FiUsers } from "react-icons/fi";
import { useEffect, useState } from "react";

import MeConnectionCard from "./MeConnectionsCard";
import toast from "react-hot-toast";
import { useSelect } from "react-supabase";

const MeConnections = ({ connections }) => {
	const [userList, setUserList] = useState([]);
	const [{ data: userData, error: userError, fetching: userLoading }] = useSelect("user_hunters", {
		columns: "*",
		order: "created_at",
	});

	useEffect(() => {
		if (userError) {
			toast.error(userError.message);
		}

		if (userData) {
			const filtered = userData.filter((item) => {
				return connections.includes(item.id);
			});

			setUserList(filtered);
		}
	}, [userData]);

	if (userLoading || !userList) {
		return (
			<div className="flex items-center justify-center">
				<FiLoader className="animate-spin w-8 h-8 " />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
			{userList.map((e, index) => (
				<MeConnectionCard key={`user_${index + 1}`} userData={e} />
			))}

			{userList.length === 0 && (
				<div className="flex items-center justify-center gap-4 col-span-full">
					<FiUsers className="w-8 h-8" />
					<p className="text-xl font-semibold">No connections</p>
				</div>
			)}
		</div>
	);
};

export default MeConnections;
