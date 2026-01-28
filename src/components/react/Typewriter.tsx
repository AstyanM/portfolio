import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TypewriterProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
}

// Detect if user is on mobile device
const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.matchMedia('(max-width: 768px)').matches;
};

// Check for reduced motion preference
const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export default function Typewriter({
    text,
    speed = 30,
    delay = 0,
    className = ""
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const ref = useRef(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const lastUpdateRef = useRef<number>(0);
    const currentIndexRef = useRef<number>(0);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    // Determine if we should skip animation
    const shouldSkipAnimation = isMobileDevice() || prefersReducedMotion();

    useEffect(() => {
        if (isInView && !isStarted) {
            const timeout = setTimeout(() => {
                setIsStarted(true);
            }, shouldSkipAnimation ? 0 : delay);
            return () => clearTimeout(timeout);
        }
    }, [isInView, delay, isStarted, shouldSkipAnimation]);

    useEffect(() => {
        if (!isStarted) return;

        // If on mobile or reduced motion, show text instantly
        if (shouldSkipAnimation) {
            setDisplayedText(text);
            setIsComplete(true);
            return;
        }

        // Use requestAnimationFrame for better performance
        currentIndexRef.current = 0;
        lastUpdateRef.current = performance.now();

        const animate = (timestamp: number) => {
            const elapsed = timestamp - lastUpdateRef.current;

            if (elapsed >= speed) {
                lastUpdateRef.current = timestamp;

                if (currentIndexRef.current < text.length) {
                    currentIndexRef.current++;
                    setDisplayedText(text.slice(0, currentIndexRef.current));
                } else {
                    setIsComplete(true);
                    return;
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isStarted, text, speed, shouldSkipAnimation]);

    return (
        <p ref={ref} className={className}>
            {displayedText}
            {/* Show cursor during typing, or after completion on desktop only */}
            {(!isComplete || !shouldSkipAnimation) && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: isComplete ? 1.2 : 0.8  // Slower blink when complete
                    }}
                    className="inline-block w-0.5 h-[1em] translate-y-[0.1em] bg-accent ml-0.5"
                />
            )}
        </p>
    );
}
