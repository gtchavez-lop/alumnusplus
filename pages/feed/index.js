import { FeedWrapper, useFeed } from '../../components/FeedContext';
import {
  FiArrowRight,
  FiArrowUp,
  FiEdit2,
  FiPlusCircle,
  FiShare,
  FiShare2,
  FiUser,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import { _Page_Transition } from '../../lib/_animations';
import _supabase from '../../lib/supabase';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/router';

const FeedList = () => {
  const { feed, setFeed, recommendedUsers, setRecommendedUsers } = useFeed();
  const { user, userData, setUserData } = useAuth();
  const [canPost, setCanPost] = useState(false);
  const router = useRouter();

  const _createFeedPost = async (e) => {
    e.preventDefault();

    // console.log(e.target.post.value);
    toast.loading('Creating post...');

    if (canPost) {
      e.target.disabled = true;

      const { data, error } = await _supabase.from('user_feed').insert([
        {
          uploader_id: user.id,
          uploader_handler: userData.user_handle,
          content: e.target.post.value,
          uploader_email: user.email,
        },
      ]);

      if (error) {
        toast.dismiss();
        toast.error(error.message);
      } else {
        toast.dismiss();
        toast.success('Post created!');
        e.target.post.value = '';

        // update feed
        _fetchFeed();
      }
    } else {
      toast.dismiss();
      toast.error('You cannot post right now');
    }
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
    setFeed((prev) => {
      return prev.map((post, i) => {
        if (post.feed_id === feedId) {
          return {
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
          };
        } else {
          return post;
        }
      });
    });

    e.target.disabled = false;
  };

  const _followUser = async (e, thisUser) => {
    toast.loading('Following user...');
    e.currentTarget.disabled = true;

    const currentConnections = userData.connections
      ? JSON.parse(userData.connections)
      : [];

    const { data, error } = await _supabase
      .from('user_data')
      .update({
        // json array of user ids
        connections: JSON.stringify([...currentConnections, thisUser.id]),
      })
      .match({ id: user.id });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
      e.currentTarget.disabled = false;
    } else {
      // update the user data
      const { data, error } = await _supabase
        .from('user_data')
        .select('*')
        .match({ id: user.id });

      if (error) {
        toast.dismiss();
        toast.error(error.message);
        e.currentTarget.disabled = false;
      } else {
        setUserData(data[0]);

        setRecommendedUsers(
          recommendedUsers.filter((user) => user.id !== thisUser.id)
        );

        toast.dismiss();
        toast.success('User followed!');
      }
    }
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'circOut' }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-10 relative"
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
                  setCanPost(e.currentTarget.post.value.length > 0);
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
                    disabled={!canPost}
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
                  key={`feed-${i}`}
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
                </div>
              ))}
          </div>
        </div>

        {/* recommended users */}
        {user && userData && (
          <div className="col-span-2 hidden lg:block ">
            <div className="flex flex-col sticky top-32">
              {/* current user */}
              <div className="w-full bg-base-200 py-2 px-3 rounded-btn flex justify-between gap-2 items-center">
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src={`https://avatars.dicebear.com/api/micah/${userData.user_handle}.svg`}
                    alt="profile"
                    className="rounded-full w-12 h-12 bg-white"
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-medium m-0">
                      {userData.name_given} {userData.name_last}
                    </p>
                    <p className="text-sm font-thin m-0">
                      @{userData.user_handle} ·{' '}
                      {userData.connections
                        ? JSON.parse(userData.connections).length
                        : 0}{' '}
                      connections
                    </p>
                  </div>
                </div>
                <Link href={'/profile'}>
                  <button className="btn btn-ghost btn-sm btn-square">
                    <FiUser size={20} />
                  </button>
                </Link>
              </div>
              <div className="divider mx-10" />

              {/* recommendeed users */}
              <p className="text-2xl font-thin mb-5">Recommended Users</p>

              {recommendedUsers &&
                recommendedUsers.map((item, i) => {
                  return (
                    <>
                      <div
                        key={`recommended-${i}`}
                        className="mb-2 w-full bg-base-200 py-2 px-3 rounded-btn flex justify-between gap-2 items-center"
                      >
                        <div className="flex flex-row gap-2 items-center">
                          <img
                            src={`https://avatars.dicebear.com/api/micah/${item.user_handle}.svg`}
                            alt="profile"
                            className="rounded-full w-12 h-12 bg-white"
                          />
                          <div className="flex flex-col">
                            <p className="text-lg font-medium">
                              {item.name_given} {item.name_last}
                            </p>
                            <p className="text-sm font-thin">
                              @{item.user_handle} •{' '}
                              {item.connections ? item.connections.length : 0}{' '}
                              followers
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => _followUser(e, item)}
                          className="btn btn-primary btn-sm btn-square disabled:btn-ghost "
                        >
                          <FiPlusCircle size={20} />
                        </button>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        )}
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
