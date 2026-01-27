import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Lightbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [altText, setAltText] = useState('');

    useEffect(() => {
        const handleOpen = (e: CustomEvent) => {
            setImgSrc(e.detail.src);
            setAltText(e.detail.alt);
            setIsOpen(true);
            document.body.style.overflow = 'hidden';
        };

        window.addEventListener('open-lightbox', handleOpen as EventListener);
        return () => window.removeEventListener('open-lightbox', handleOpen as EventListener);
    }, []);

    const close = () => {
        setIsOpen(false);
        document.body.style.overflow = '';
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm cursor-zoom-out"
                >
                    <button
                        onClick={close}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        src={imgSrc}
                        alt={altText}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {altText && (
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="absolute bottom-6 left-0 right-0 text-center text-white/90 text-sm font-medium px-4"
                        >
                            {altText}
                        </motion.p>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
