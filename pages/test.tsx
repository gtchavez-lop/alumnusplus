import { useEffect, useState } from "react";

import Link from "next/link";
import { NextPage } from "next";
import { motion } from "framer-motion";

const TestPage: NextPage = () => {
	return (
		<>
			<div className="py-24">
				<Link href={"/h/feed/post?id=1"}>Go to page</Link>
			</div>
		</>
	);
};

export default TestPage;
