import { CgAdd, CgArrowDown, CgArrowUp, CgShare } from 'react-icons/cg';

const list = Array(4).fill();

const Feed = (e) => {
  return (
    <>
      <section className="grid grid-cols-3 gap-5">
        <div className="flex flex-col gap-5 col-span-full lg:col-span-2">
          {Array(10)
            .fill()
            .map((_, i) => (
              <div key={i} className="card bg-base-300 bg-opacity-20">
                <div className="card-body p-5">
                  <div className="flex items-center gap-5">
                    <div className="avatar ring-2 rounded-full ring-offset-4 ring-primary">
                      <div className="w-9 h-9 rounded-full bg-slate-300">
                        <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p>Username goes here</p>
                      <p className="text-xs">@theirAtSign</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 mt-5">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nulla vitae elit libero, a pharetra augue. Nullam quis
                      risus eget urna mollis ornare vel eu leo. Nullam id dolor
                      id nibh ultricies vehicula ut id elit. Donec sed odio dui.
                    </p>
                  </div>

                  {/* upvotes and comments */}
                  <div className="mt-10">
                    <div className="flex items-center">
                      <button className="btn gap-3 btn-ghost">
                        <CgArrowUp size={20} />
                        <span>20</span>
                      </button>
                      <button className="btn gap-3 btn-ghost ml-auto">
                        <CgShare size={20} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="hidden lg:block py-2 ">
          <div className="sticky top-32">
            {/* profile shortcut */}
            <div className="flex gap-4 items-center">
              <div className="avatar ring-2 rounded-full ring-offset-4 ring-primary">
                <div className="w-10 h-10 rounded-full bg-slate-300">
                  <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
                </div>
              </div>
              <div className="flex flex-col">
                <p>Gerald Chavez</p>
                <p className="text-xs text-gray-400">
                  chavezgerald23@gmail.com
                </p>
              </div>
            </div>

            {/* shortcuts */}
            <div className="mt-16">
              <p>Suggested for you</p>

              <div className="mt-5 flex flex-col gap-3">
                {list.map((_, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className="avatar ring-2 rounded-full ring-offset-4 ring-primary">
                      <div className="w-9 h-9 rounded-full bg-slate-300">
                        <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p>Username goes here</p>
                      <p className="text-xs">@theirAtSign</p>
                    </div>
                    <button className="btn btn-square btn-ghost ml-auto">
                      <CgAdd size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Feed;
