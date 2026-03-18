import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalContextType {
    showModal: (content: ReactNode) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalContent, setModalContent] = useState<{ content: ReactNode; id: number } | null>(null);

    const showModal = useCallback((content: ReactNode) => {
        setModalContent({ content, id: Date.now() });
    }, []);

    const hideModal = useCallback(() => {
        setModalContent(null);
    }, []);

    useEffect(() => {
        if (modalContent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [modalContent]);

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            <AnimatePresence mode="wait">
                {modalContent && (
                    <motion.div
                        key={modalContent.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm"
                        onClick={hideModal}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            {modalContent.content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
