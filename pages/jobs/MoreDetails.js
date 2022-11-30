import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const MoreDetails = () =>{

    const [isShowing, setShowing] = useState(false);

    return (

    <>

        <main className="py-28 flex-col">

        {isShowing &&(

<AnimatePresence>

       <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>

        {/* slideover background */}
            <div className="absolute inset-0 w-full height-full bg-gray-900 opacity-50"></div>

        {/* slideover */}
            <div className="absolute w-[550px] h-[880px] bg-gray-100 right-2 top-20 rounded-btn">
            <p className="text-2xl text-center font-bold"></p>
            
        {/* exit button */}
            <button onClick={() => setShowing(!isShowing)} className ="w-10 h-10 cursor-pointer flex items-center justify-center absolute top-0 right-0 mt-5 mr-5">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>

        </button>
        
        </div>
       
        </motion.div>

    </AnimatePresence>

              )}

        </main>

    </>

    );
}

export default MoreDetails;