import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const P_LOGO_SRC = '/logo-purple.png';

export default function SplashScreenLogoBreath({ slideIndex }: { slideIndex?: number }) {
    const [fadeIn, setFadeIn] = useState(false);
    const [breath, setBreath] = useState(false);
    const [showTagline, setShowTagline] = useState(false);

    useEffect(() => {
        setFadeIn(false);
        setBreath(false);
        setShowTagline(false);
        const fadeInTimeout = setTimeout(() => {
            setFadeIn(true);
            // Wait for fade-in (1s), then start breath
            const breathTimeout = setTimeout(() => {
                setBreath(true);
                const taglineTimeout = setTimeout(() => setShowTagline(true), 800);
                return () => clearTimeout(taglineTimeout);
            }, 800); // 1s after fade-in starts, breath begins
            return () => clearTimeout(breathTimeout);
        }, 1000); // 1s delay before starting fade in
        return () => clearTimeout(fadeInTimeout);
    }, [slideIndex]);

    return (
        <div
            className="flex flex-col items-center justify-center h-full w-full"
            style={{ backgroundColor: '#F7E6CA' }}
        >
            <div className='flex flex-col items-center min-h-[180px]'>
                <div className="flex items-center mb-2">
                    <motion.img
                        src={P_LOGO_SRC}
                        alt="P logo"
                        className="w-32 h-32 aspect-square object-contain"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{
                            opacity: fadeIn ? 1 : 0,
                            scale: fadeIn ? (breath ? [1, 1.04, 1] : 1) : 1,
                        }}
                        transition={{
                            opacity: { duration: 1, ease: 'easeInOut' },
                            scale: breath ? { duration: 1.2, ease: 'easeInOut' } : { duration: 0 },
                        }}
                        // style={{ filter: 'drop-shadow(0 2px 16px #FFFFFF)' }}
                    />
                </div>
                {showTagline && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="font-satoshi text-2xl mt-1"
                        style={{ fontFamily: 'Satoshi, sans-serif', color: '#3A2256' }}
                    >
                        Your Event, Perfected
                    </motion.div>
                )}
            </div>
        </div>
    );
}
