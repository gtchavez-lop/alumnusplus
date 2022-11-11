import {
  FiFilter,
  FiHeart,
  FiLoader,
  FiMessageSquare,
  FiMoreHorizontal,
  FiPlusCircle,
  FiX
} from "react-icons/fi";
import { useClient, useFilter, useRealtime, useSelect } from "react-supabase";

import FeedCard from "./FeedCard";
import Image from "next/image";
import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import reactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { useState } from "react";
import uuidv4 from "../../lib/uuidv4";

const FeedPage = () => {
  const [blogContent, setBlogContent] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterMode, setFilterMode] = useState('content');
  const supabaseClient = useClient();

  const feedFilter = useFilter(
    (query) => query.order("created_at", { ascending: false }),
    []
  );

  const [
    {
      count: blogCount,
      data: blogData,
      error: blogError,
      fetching: blogLoading
    },
    reexecuteHunterBlog
  ] = useSelect("hunt_blog", { filter: feedFilter });

  const addPost = async (e) => {
    e.preventDefault();

    if (blogContent.length < 1) {
      toast.error("Please enter some content");
      return;
    }

    const uploaderMetadata = supabaseClient.auth.user().user_metadata;

    toast.loading("Uploading post...");

    const { error } = await __supabase.from("hunt_blog").insert({
      id: uuidv4(),
      uploaderData: {
        address: uploaderMetadata.address_address,
        birthdate: uploaderMetadata.birthdate,
        city: uploaderMetadata.address_city,
        email: supabaseClient.auth.user().email,
        firstName: uploaderMetadata.firstName,
        gender: uploaderMetadata.gender,
        lastName: uploaderMetadata.lastName,
        middleName: uploaderMetadata.middleName,
        postalCode: uploaderMetadata.address_postalCode,
        university: uploaderMetadata.university,
        username: uploaderMetadata.username,
      },
      created_at: new Date().getUTCDate(),
      content: blogContent,
      uploader_email: supabaseClient.auth.user().email
    });

    toast.dismiss();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Post uploaded!");
      reexecuteHunterBlog();
    }
  };

  if (blogLoading) {
    return (
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed w-full h-screen flex flex-col justify-center items-center top-0 left-0"
      >
        <FiLoader className="animate-spin text-4xl " />
        <p>Loading...</p>
      </motion.main>
    );
  }

  const filterPostHandler = e => {
    const input = e.target.value;
    if (input.length >= 3) {
      const filtered = filterMode === 'content'
        ? blogData.filter(post => post.content.toLowerCase().includes(input.toLowerCase()))
        : filterMode === 'uploader_email'
          ? blogData.filter(post => post.uploader_email.toLowerCase().includes(input.toLowerCase()))
          : filterMode === 'username'
            ? blogData.filter(post => post.uploaderData.username.toLowerCase().includes(input.toLowerCase()))
            : filterMode === 'fullname'
              ? blogData.filter(post => post.uploaderData.firstName.toLowerCase().includes(input.toLowerCase()) || post.uploaderData.lastName.toLowerCase().includes(input.toLowerCase()))
              : blogData.filter(post => post.content.toLowerCase().includes(input.toLowerCase()));

      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]);
    }
  }

  return (
    !blogLoading &&
    blogData && (
      <>
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="pb-16 lg:pt-24 pt-36"
        >
          <div className="flex items-end gap-2 w-full">
            <div className="flex flex-col">
              <label className="ml-4">
                Search for something
              </label>
              <input
                type="text"
                placeholder="Search posts..."
                className="flex w-full input input-primary"
                onChange={filterPostHandler}
              />
            </div>
            <select onChange={e => {
              setFilterMode(e.target.value);
            }} className="select select-primary select-bordered">
              <option disabled selected>Set Filter Options</option>
              <option value="content">Content</option>
              <option value="uploader_email">Uploader Email</option>
              <option value="username">Username</option>
              <option value="fullname">Fullname</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
            {/* add post modal toggler */}
            <label
              htmlFor="addPostModal"
              className="cursor-pointer hover:scale-95 transition-all bg-base-200 rounded-box min-h-[175px] md:min-h-[250px] py-3 px-4 flex flex-col gap-2 justify-center items-center"
            >
              <div className="flex justify-center items-center flex-col gap-2 ">
                <FiPlusCircle className="text-6xl" />
                <p>Add Post</p>
              </div>
            </label>

            {/* mini blogs */}
            {
              filteredPosts.length >= 1 ? (
                filteredPosts.map((blog, index) => (
                  <FeedCard
                    key={`feedcard_${index + 1}`}
                    feedData={blog}
                    index={index}
                  />
                ))
              ) : (
                blogData?.map((blog, index) => (
                  <FeedCard
                    key={`feedcard_${index + 1}`}
                    feedData={blog}
                    index={index}
                  />
                ))
              )
            }
          </div>
        </motion.main>

        {/* add post modal */}
        <input type="checkbox" id="addPostModal" className="modal-toggle" />
        <div className="modal" id="addPostModal">
          <div className="modal-box">
            <div className="modal-title flex justify-between items-center">
              <h5>
                Add Post as{" "}
                <span className="text-secondary underline underline-offset-4">
                  {supabaseClient.auth.user().user_metadata?.username}
                </span>
              </h5>
              <label
                className="btn btn-ghost btn-circle"
                htmlFor="addPostModal"
              >
                <FiX />
              </label>
            </div>
            <div className="modal-body flex flex-col gap-2">
              <form onSubmit={(e) => addPost(e)}>
                <textarea
                  name="content"
                  className="textarea textarea-bordered w-full"
                  onChange={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;

                    const content = e.target.value;
                    const newContent = content.replace(/\n/g, "<br />");
                    setBlogContent(newContent);
                  }}
                // onKeyUp={(e) => {
                //   if (e.key === "Enter") {
                //     e.preventDefault();
                //     const val = e.target.value;
                //     const newVal = val.replace(/\r?\n/g, "<br/>");
                //     e.target.value = newVal;
                //   }
                // }}
                />
                <p className="text-sm opacity-40">
                  You can add markdown syntax here
                </p>
                <div className="modal-action">
                  <label className="btn btn-ghost" htmlFor="addPostModal">
                    Cancel
                  </label>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default FeedPage;
