import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
}

export default function Typewriter({
    text,
    speed = 30,
    delay = 0,
    className = ""
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (isInView && !isStarted) {
            const timeout = setTimeout(() => {
                setIsStarted(true);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [isInView, delay, isStarted]);

    useEffect(() => {
        if (!isStarted) return;

        let currentIndex = 0;
        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [isStarted, text, speed]);

    return (
        <p ref={ref} className={className}>
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-0.5 h-[1em] translate-y-[0.1em] bg-accent ml-0.5"
            />
        </p>
    );
}
