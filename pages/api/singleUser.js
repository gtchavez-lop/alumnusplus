import __supabase from "../../lib/supabase";

const singleUser = (req, res) => {
  const { id } = req.query;
  __supabase
    .from("user_data")
    .select("*")
    .eq("user_id", id)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(data);
      }
    });
};

export default singleUser;
