import { motion, useScroll, useSpring } from "framer-motion";

export default function ReadingProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            className="fixed top-0 left-0 right-0 h-0.5 bg-accent origin-left z-[100]"
            style={{ scaleX }}
        />
    );
}
