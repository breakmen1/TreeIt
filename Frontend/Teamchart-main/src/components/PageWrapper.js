// components/PageWrapper.js
import { motion } from "framer-motion";
import { useEffect } from "react";
const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5,
};

export default function PageWrapper({ children }) {
    useEffect(() => {
        // Lock scroll
        document.body.style.overflow = "hidden";

        const timer = setTimeout(() => {
            // Unlock after animation
            document.body.style.overflow = "auto";
        }, 500); // Match your animation duration

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            {children}
        </motion.div>
    );
}
