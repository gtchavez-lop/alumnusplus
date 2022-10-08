import __supabase from "../../lib/supabase";

const fetchUserData = async (req, res) => {
  const { idList } = req.query;
  const list = idList ? JSON.parse(idList) : [];

  // res.status(200).json(list);
  await __supabase
    .from("user_data")
    .select("*")
    .in("user_id", list)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(data);
      }
    });
};

export default fetchUserData;
