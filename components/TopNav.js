import {
  CgAddR,
  CgBell,
  CgHome,
  CgMail,
  CgPin,
  CgSearch,
} from 'react-icons/cg';

import Logo from './Logo';

const TopNav = (e) => {
  return (
    <>
      <nav className="z-50 flex justify-center overflow-hidden fixed w-full top-0 left-0">
        <div className="w-full max-w-5xl flex items-center justify-between py-2 bg-base-200 px-5 lg:my-5 rounded-lg">
          <div>
            <Logo />
          </div>
          <div className="hidden lg:flex">
            <label className="input-group input-group-sm">
              <span>
                <CgSearch size={20} />
              </span>
              <input
                placeholder="Search..."
                type="text"
                className="input input-sm w-[250px]"
              />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden lg:inline-flex btn btn-ghost btn-square">
              <CgHome size={20} />
            </button>
            <button className="btn btn-ghost btn-square">
              <CgAddR size={20} />
            </button>
            <button className="btn btn-ghost btn-square">
              <CgMail size={20} />
            </button>
            <button className="hidden lg:inline-flex btn btn-ghost btn-square">
              <CgBell size={20} />
            </button>
            <button className="hidden lg:inline-flex btn btn-ghost btn-square">
              <CgPin size={20} />
            </button>
            <button className="btn btn-ghost btn-square hidden lg:inline-flex">
              <div className="avatar online">
                <div className="w-7 h-7 rounded-full">
                  <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNav;
