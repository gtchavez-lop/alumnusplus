// fetch feed from supabase

import __supabase from "../../lib/supabase";

const getFeed = (req, res) => {
  const { connectionsList, id } = req.query;

  const list = connectionsList ? JSON.parse(connectionsList) : [];

  // fetch feed from user_feed table in supabase
  // filter by connectionList based on uploader_id
  __supabase
    .from("user_feed")
    .select("*")
    .in("uploader_id", connectionsList ? list : [id])
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({
          data: data,
          list: list,
        });
      }
    });
};

export default getFeed;
