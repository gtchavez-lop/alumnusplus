import { FeedWrapper, useFeed } from '../../components/FeedContext';
import { FiArrowUp, FiEdit2, FiShare, FiShare2 } from 'react-icons/fi';

import ThemeSwitcher from '../../components/ThemeSwitcher';
import { _Page_Transition } from '../../lib/_animations';
import _supabase from '../../lib/supabase';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../components/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const FeedList = () => {
  const { feed, setFeed } = useFeed();
  const { user, userData } = useAuth();
  const router = useRouter();

  const _createFeedPost = async (e) => {
    e.preventDefault();

    // console.log(e.target.post.value);

    const { data, error } = await _supabase.from('user_feed').insert([
      {
        uploader_id: user.id,
        uploader_handler: userData.user_handle,
        content: e.target.post.value,
        uploader_email: user.email,
      },
    ]);

    toast.loading('Creating post...');

    e.target.disabled = true;

    if (error) {
      toast.dismiss();
      toast.error(error.message);
    } else {
      toast.dismiss();
      toast.success('Post created!');
      e.target.post.value = '';
      setFeed([data[0], ...feed]);
    }

    e.target.disabled = false;
  };

  const _upvoteFeedPost = async (e, feedId) => {
    // filter the feed to find the post that was upvoted
    e.target.disabled = true;
    const thisPost = feed.filter((post) => post.feed_id === feedId)[0];

    // update the post and add the user to the upvoted_list array
    const { data, error } = await _supabase
      .from('user_feed')
      .update({
        upvotes:
          // if the user has already upvoted the post, remove their upvote
          // otherwise, add their upvote
          thisPost.upvoted_list === null ||
          !thisPost.upvoted_list.includes(user.id)
            ? thisPost.upvotes + 1
            : thisPost.upvotes - 1,

        upvoted_list:
          // if null, create an array with the user id, else add the user id to the array
          // if the user has already upvoted the post, remove their upvote
          // otherwise, add their upvote
          thisPost.upvoted_list === null
            ? [user.id]
            : thisPost.upvoted_list.includes(user.id)
            ? thisPost.upvoted_list.filter((id) => id !== user.id)
            : [...thisPost.upvoted_list, user.id],
      })
      .match({ feed_id: feedId });

    // update the feed state from the database
    setFeed(
      feed.map((post) =>
        post.feed_id === feedId
          ? {
              ...post,
              upvotes:
                thisPost.upvoted_list === null ||
                !thisPost.upvoted_list.includes(user.id)
                  ? thisPost.upvotes + 1
                  : thisPost.upvotes - 1,
              upvoted_list:
                thisPost.upvoted_list === null
                  ? [user.id]
                  : thisPost.upvoted_list.includes(user.id)
                  ? thisPost.upvoted_list.filter((id) => id !== user.id)
                  : [...thisPost.upvoted_list, user.id],
            }
          : post
      )
    );

    e.target.disabled = false;
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'circOut' }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-10"
      >
        {/* feed */}
        <div className="col-span-3">
          <div className="flex flex-col gap-5">
            {/* add post with text area */}
            {userData && userData.hasId ? (
              <form
                className="form-control gap-5 bg-base-300 p-5 rounded-btn"
                onSubmit={(e) => _createFeedPost(e)}
                onChange={(e) => {
                  if (e.target.value.length > 0) {
                    e.currentTarget.postbutton.disabled = false;
                  } else {
                    e.currentTarget.postbutton.disabled = true;
                  }
                }}
              >
                <label className="flex flex-col gap-3">
                  <span>
                    <p className="text-xl font-bold">Add a Post</p>
                  </span>
                  <textarea
                    name="post"
                    placeholder="What's on your mind?"
                    className="textarea w-full h-36 text-base-content placeholder-base-content resize-none bg-base-200"
                  />
                </label>
                <div className="flex justify-between items-center">
                  <p>Dev Mode</p>
                  <button
                    name="postbutton"
                    type="submit"
                    disabled
                    className="btn btn-primary btn-sm"
                  >
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-5">
                <p className="text-warning">
                  You need to upgrade your account to post on the feed.
                </p>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => router.push('/profile')}
                >
                  Jump to Profile
                </button>
              </div>
            )}

            <div className="divider" />

            {/* users posts */}
            {feed &&
              user &&
              userData &&
              feed.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-5 p-5 bg-base-300 rounded-btn"
                >
                  <div className="flex flex-row gap-5">
                    <div className="flex items-center">
                      <img
                        src={`https://avatars.dicebear.com/api/micah/${item.uploader_handler}.svg`}
                        alt="profile"
                        className="rounded-full w-12 h-12 bg-white"
                      />
                    </div>
                    <div className="flex flex-col  justify-center">
                      <p className=" text-lg">@{item.uploader_handler}</p>
                      <p className="font-thin text-sm">
                        {dayjs(item.created_at).format(
                          'MMMM D, YYYY [at] h:mm A'
                        )}
                      </p>
                    </div>

                    {item.uploader_id === user.id && (
                      <div className="flex flex-row gap-2 ml-auto">
                        <button className="btn btn-ghost btn-circle" disabled>
                          <FiEdit2 />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-medium">{item.content}</p>
                  </div>

                  {/* upvote and share */}
                  <div className="flex justify-between mt-5">
                    <button
                      className={`btn btn-sm gap-5 ${
                        item.upvoted_list && item.upvoted_list.includes(user.id)
                          ? 'btn-primary'
                          : 'btn-ghost'
                      }`}
                      onClick={(e) => _upvoteFeedPost(e, item.feed_id)}
                    >
                      <FiArrowUp size={20} />
                      <span>{item.upvotes}</span>
                    </button>

                    <button className="btn btn-ghost btn-sm gap-5" disabled>
                      <FiShare2 size={20} />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* 
                  <div className="flex flex-row gap-5 justify-between mt-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.target.disabled = true;
                        _upvoteFeedPost(e, item.feed_id);
                      }}
                      className={`
                      btn btn-sm gap-2
                      ${
                        item.upvoted_list !== null &&
                        item.upvoted_list.includes(user.id)
                          ? 'btn-secondary'
                          : 'btn-ghost'
                      }
                      `}
                    >
                      <FiArrowUp size={20} />
                      <span>{item.upvotes}</span>
                    </button>
                    <div
                      className="tooltip"
                      data-tip="This feature is in development"
                    >
                      <button className="btn btn-ghost btn-sm gap-2" disabled>
                        <span>Share</span>
                        <FiShare2 size={20} />
                      </button>
                    </div>
                  </div> */}
                </div>
              ))}
          </div>
        </div>

        {/* recommended users */}
        <div className="col-span-2 hidden lg:block">
          <div className="flex flex-col">
            <p className="text-2xl font-thin">Recommended Users</p>
          </div>
        </div>
      </motion.section>
    </>
  );
};

const Page_Feed = (e) => {
  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col py-32"
      >
        <FeedWrapper>
          <FeedList />
        </FeedWrapper>
      </motion.main>
    </>
  );
};

export default Page_Feed;
