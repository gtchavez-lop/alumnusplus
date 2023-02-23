import Fuse from "fuse.js";
import Skills from "@/schemas/skills.json";
import { motion } from "framer-motion";
import { useState } from "react";

const TestPage = () => {
	const fuse = new Fuse(Skills, {
		threshold: 0.3,
	});
	const [selected, setSelected] = useState([]);
	const [results, setResults] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="py-32">
			<input
				onChange={(e) => {
					const result = fuse.search(e.target.value);
          const filtered = result.filter(item => !selected.includes(item.item))
          
          setResults(filtered.slice(0, 10));
				}}
				className="input input-primary"
			/>

			<div className="mt-4 flex flex-wrap gap-2">
				{selected?.map((item, index) => (
					<div
          onClick={() => {
            setSelected(selected.filter(s => s !== item))
          }}
						className="btn btn-secondary"
						key={`selected-${index}`}
					>
						{item}
					</div>
				))}
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				{results?.map((result, index) => (
					<motion.div
						animate={{ scale: [0.95, 1], opacity: [0, 1] }}
						onClick={() => {
							setSelected([...selected, result.item]);
							setResults([]);
						}}
						className="btn btn-primary"
						key={`key-${index}`}
					>
						{result.item}
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default TestPage;
