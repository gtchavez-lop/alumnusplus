import { FiHeart } from "react-icons/fi";
import __supabase from "../lib/supabase";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const PageTest = (e) => {
  useEffect(() => {
    // fetchUser();
    // fetchFeed();
    // fetchRecommendedUsers();
  }, []);

  return (
    <>
      {/* card */}
      <div className="mt-16">
        <div className="feed-card">
          <div className="feed-card-body">
            <p>asdjaklsjlkasjd</p>
          </div>
          <div className="feed-card-footer">
            <button className="p-3 rounded-full bg-base-100 hover:bg-base-200 transition-all">
              <FiHeart />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageTest;
