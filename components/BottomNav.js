import { CgBell, CgHome, CgMail, CgPin, CgSearch } from 'react-icons/cg';

const BottomNav = (e) => {
  return (
    <>
      <div className="z-50 flex justify-center overflow-hidden fixed w-full bottom-0 left-0 lg:hidden">
        <div className="w-full max-w-5xl flex items-center justify-between py-3 bg-base-200 px-5 rounded-lg">
          <button className="btn btn-ghost btn-square">
            <CgHome size={20} />
          </button>
          <button className="btn btn-ghost btn-square">
            <CgSearch size={20} />
          </button>
          <button className=" btn btn-ghost btn-square">
            <CgBell size={20} />
          </button>
          <button className=" btn btn-ghost btn-square">
            <CgPin size={20} />
          </button>
          <button className="btn btn-ghost btn-square">
            <div className="avatar online">
              <div className="w-7 h-7 rounded-full">
                <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
