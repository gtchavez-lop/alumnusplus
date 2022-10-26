// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import ContentEditable from "react-contenteditable";
import __supabase from "../lib/supabase";
import toast from "react-hot-toast";
import { useState } from "react";

const RichTextEditor = () => {
  const [content, setContent] = useState("");
  const [isCharMax, setIsCharMax] = useState(false);

  const handlePost = async () => {
    const user = await __supabase.auth.user();
    toast.loading("Posting...");

    const { error } = await __supabase.from("feed_data").insert([
      {
        uploader_email: user.email,
        uploader_details: {
          email: user.email,
          id: user.id,
          user_metadata: {
            first_name: user.user_metadata.first_name,
            last_name: user.user_metadata.last_name,
            username: user.user_metadata.username,
          },
        },
        content: {
          text: content,
        },
      },
    ]);

    toast.dismiss();

    if (error && editorState) {
      toast.error(error.message);
    } else {
      toast.success("Posted!");
      setContent("");
    }
  };

  return (
    <>
      <ContentEditable
        html={content}
        placeholder="Enter some text"
        onChange={(e) => {
          setIsCharMax(e.target.value.length > 500);
          setContent(e.target.value);
        }}
        className="p-2 px-4 rounded-box outline-none border border-primary mt-1"
      />

      {isCharMax && (
        <p className="text-red-500 text-sm">
          You have reached the editing limit.
        </p>
      )}

      <button
        onClick={handlePost}
        disabled={content.length < 5 || isCharMax}
        className="btn btn-primary btn-sm mt-5"
      >
        Post
      </button>
    </>
  );
};

export default RichTextEditor;
