import { GetServerSideProps } from "next";
import { supabase } from "@/lib/supabase";

type IProps = {
	children: string | JSX.Element | JSX.Element[];
};

export const getServerSideProps: GetServerSideProps = async () => {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return {
			props: {},
			redirect: {
				destination: "/login",
			},
		};
	}

	return {
		props: {
			session,
		},
	};
};

const ProtectedRoute = ({ children }: IProps) => {
	return <>{children}</>;
};

export default ProtectedRoute;
