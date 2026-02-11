import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Lightbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [altText, setAltText] = useState('');
    const triggerRef = useRef<Element | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOpen = (e: CustomEvent) => {
            triggerRef.current = document.activeElement;
            setImgSrc(e.detail.src);
            setAltText(e.detail.alt);
            setIsOpen(true);
            document.body.style.overflow = 'hidden';
        };

        window.addEventListener('open-lightbox', handleOpen as EventListener);
        return () => window.removeEventListener('open-lightbox', handleOpen as EventListener);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        document.body.style.overflow = '';
        // Restore focus to the element that opened the lightbox
        if (triggerRef.current && triggerRef.current instanceof HTMLElement) {
            triggerRef.current.focus();
        }
    }, []);

    // Focus the close button when the lightbox opens
    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure the element is rendered
            requestAnimationFrame(() => {
                closeButtonRef.current?.focus();
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close();
                return;
            }

            // Focus trap: keep Tab/Shift+Tab within the dialog
            if (e.key === 'Tab') {
                const focusableElements = dialogRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements || focusableElements.length === 0) return;

                const first = focusableElements[0] as HTMLElement;
                const last = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, close]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={altText || 'Image lightbox'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm cursor-zoom-out"
                >
                    <button
                        ref={closeButtonRef}
                        onClick={close}
                        aria-label="Close"
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
