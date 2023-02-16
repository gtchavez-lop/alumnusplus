import skills from "@/schemas/skills.json";

const handler = (req, res) => {
	const query = req.query;
	const { q, limit } = query;

	const results = skills.filter((skill) => skill.toLowerCase().includes(q.toLowerCase()));
	const filteredSkills = limit ? results.slice(0, limit) : results;

	res.status(200).json(filteredSkills);
};

export default handler;
