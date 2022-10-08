import __supabase from "../../lib/supabase";

const fetchRecommendedUsers = async (req, res) => {
  const { id, connectionsList } = req.query;
  let list = connectionsList ? JSON.parse(connectionsList) : [];

  // fetch recommended users from user_data table in supabase
  __supabase
    .from("user_data")
    .select("*")
    .limit(6)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      } else {
        // exclude users in connectionsList and exclude current user
        const filteredData = data.filter(
          (item) => item.user_id !== id && !list.includes(item.user_id)
        );
        const parsed = filteredData.map((item) => {
          return {
            user_id: item.user_id,
            data: JSON.parse(item.data),
          };
        });
        res.status(200).json(parsed);
      }
    })
    .then(() => {
      console.log("done");
    });
};

export default fetchRecommendedUsers;
