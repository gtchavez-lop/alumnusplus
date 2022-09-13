import { CgPin } from 'react-icons/cg';
import { motion } from 'framer-motion';

const Page_Locator = (e) => {
  return (
    <>
      <main className="flex justify-center items-center min-h-screen absolute overflow-hidden top-0 left-0 w-full">
        {/*  */}
        <p className="absolute -translate-y-[200px] z-20 text-lg">
          Searching for Alumni near you
        </p>

        {/* avatar */}
        <div>
          <div className="avatar">
            <div className="w-16 h-16 rounded-full">
              <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
            </div>
          </div>
        </div>

        {/* search circles */}
        <motion.div className="border-2  w-[150px] h-[150px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <motion.div className="border-2  w-[250px] h-[250px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80" />
        <motion.div className="border-2  w-[350px] h-[350px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60" />
        <motion.div className="border-2  w-[450px] h-[450px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40" />
        <motion.div className="border-2  w-[550px] h-[550px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20" />
      </main>
    </>
  );
};

export default Page_Locator;
