import { useEffect, useState } from "react";

import Link from "next/link";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const TestPage: NextPage = () => {
	const router = useRouter();

	const fetchURLParams = () => {
		const { id } = router.query;

		console.log(id);
	};

	useEffect(() => {
		fetchURLParams();
	}, []);

	return (
		<>
			<div className="py-24">
				<Link href={"/h/feed/post?id=1"}>Go to page</Link>
			</div>
		</>
	);
};

export default TestPage;
