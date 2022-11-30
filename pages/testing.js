import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";


const testing = () => {

    const [isShowing, setShowing] = useState(false);
    return (

<main className="py-28 flex-col">
    
    <button onClick={() => setShowing(!isShowing)} className ="btn btn-primary"
    >Toggle Button</button>

    <AnimatePresence>

        {isShowing &&(
        <motion.h1
        initial = {{opacity: 0, x: -50 }}
        animate = {{opacity: 1, x: 0, transition: {duration: 1, ease: "circOut"}}}
        exit = {{opacity: 0, x: 50, transition: {duration: 1, ease: "circIn"}}}
        >hello</motion.h1>

        )}
    </AnimatePresence>

</main>
    );
}

export default testing;