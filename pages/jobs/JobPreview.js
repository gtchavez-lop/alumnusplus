import { AnimatePresence, motion } from "framer-motion";
import { icons } from "react-icons";
import { FiBookmark, FiMoreHorizontal, FiSearch, FiX } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import __supabase from "../../lib/supabase";
import dayjs from "dayjs";
import { useClient } from "react-supabase";
import { useRouter } from "next/router";
import uuidv4 from "../../lib/uuidv4";
import JobCard from "./jobCard";

const JobPreview = () => {
  const [jobListing, setJobListing] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchdata = async () => {
    const { data, error } = await __supabase.from("job_postings").select("*");
    if (data && !error) {
      setJobListing(data);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchResult([]);
    let query = e.target.searchInput.value;

    let results = jobListing.filter((item) => {
      return item.job_title.toLowerCase().includes(query);
    });
    setSearchResult(results);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="w-full">
      <form className="form-control mb-10" onSubmit={handleSearch}>
        <label className="input-group">
          <input
            type={"text"}
            name="searchInput"
            placeholder="Search Job Posting"
            className="input input-primary input-bordered"
          />
          <button className="btn btn-square text-lg" type={"submit"}>
            <FiSearch />
          </button>
        </label>
      </form>
      <div className="flex flex-col gap-5">
        {searchResult.length > 0
          ? searchResult.map((item) => <JobCard item={item} />)
          : jobListing.map((item) => <JobCard item={item} />)}
      </div>
    </div>
  );
};

export default JobPreview;
