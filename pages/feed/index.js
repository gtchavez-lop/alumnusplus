import ThemeSwitcher from '../../components/ThemeSwitcher';
import { _Page_Transition } from '../../lib/_animations';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Page_Feed = (e) => {
  const { user, userData } = useAuth();

  const router = useRouter();

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col my-32"
      >
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* feed */}
          <div className="col-span-3">
            <div className="flex flex-col gap-5">
              {/* add post with text area */}
              <form className="form-control gap-5 bg-base-300 p-5 rounded">
                <label className="flex flex-col gap-3">
                  <span>
                    <p className="text-xl font-thin">Add a Post</p>
                  </span>
                  <textarea
                    name="post"
                    placeholder="What's on your mind?"
                    className="textarea w-full h-36 resize-none bg-base-200"
                  />
                </label>
                <button className="btn btn-primary">Post</button>
              </form>

              <div className="divider" />

              {/* users posts */}
              {Array(10)
                .fill()
                .map((e, i) => (
                  <div key={i} className="flex flex-col gap-5 p-5 bg-base-300">
                    <div className="flex flex-row gap-5">
                      <div className="flex items-center">
                        <img
                          src="https://picsum.photos/200"
                          alt="profile"
                          className="rounded-full w-12 h-12"
                        />
                      </div>
                      <div className="flex flex-col  justify-center">
                        <p className="text-xl ">
                          <span>John Doe</span>
                        </p>

                        <p className="font-thin text-sm">
                          <span>@johndoe</span>
                          {' · '}
                          <span>2 hours ago</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg font-medium">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quisquam, quod.
                      </p>
                    </div>

                    {/* upvote and share button */}
                    <div className="flex flex-row gap-5 justify-between mt-10">
                      <button className="btn btn-ghost btn-sm">Upvote</button>
                      <button className="btn btn-ghost btn-sm">Share</button>
                    </div>
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
        </section>
      </motion.main>
    </>
  );
};

export default Page_Feed;
