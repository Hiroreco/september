import { useRef, useState } from "react";
import CelebrationEffects from "./CelebrationEffects";
import CountdownTimer from "./CountdownTimer";
import GigiDVD from "./GigiDVD";

const App = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [celebrating, setCelebrating] = useState(false);

    // Calculate target date in Eastern Time
    const getTargetDate = () => {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Create target date for September 21st of current year in Eastern Time (USA/New_York)
        let targetDate = new Date(`${currentYear}-09-21T00:00:00-04:00`);

        // If we've already passed September 21st this year, target next year
        if (now > targetDate) {
            targetDate = new Date(`${currentYear + 1}-09-21T00:00:00-04:00`);
        }

        return targetDate;
    };

    const handleCountdownZero = () => {
        setCelebrating(true);
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center gap-2 bg-orange-200 justify-center h-screen w-screen relative overflow-hidden"
        >
            {/* Celebration Effects */}
            <CelebrationEffects active={celebrating} />

            {celebrating ? (
                // September 21st content
                <>
                    <div className="text-lg z-10">Oh no, today is</div>
                    <div className="md:text-5xl text-3xl font-bold tracking-wide z-10">
                        September 21st
                    </div>
                    <div className="text-center z-10 mt-4">
                        <div>
                            Check what{" "}
                            <span className="font-semibold">she's</span> doing{" "}
                            <a
                                href="https://www.youtube.com/watch?v=gCGCoTeofkE"
                                className="underline underline-offset-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                here
                            </a>
                        </div>
                    </div>
                </>
            ) : (
                // Countdown content
                <>
                    <div className="text-3xl z-10">There are</div>
                    <CountdownTimer
                        targetDate={getTargetDate()}
                        onZero={handleCountdownZero}
                    />
                    <div className="text-3xl z-10">to</div>
                    <div className="md:text-5xl text-3xl font-bold tracking-wide z-10">
                        21st September
                    </div>
                    <div className="text-center z-10 mt-4">
                        <div>
                            Relive the experience{" "}
                            <a
                                href="https://youtu.be/_qglDw9zf7k?si=UkMyplUfWc0Y9mFX"
                                className="underline underline-offset-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                here
                            </a>
                        </div>
                        <div>
                            Subscribe to{" "}
                            <a
                                href="https://www.youtube.com/@holoen_gigimurin"
                                className="underline underline-offset-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                the gremlin
                            </a>
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                            Made by{" "}
                            <a
                                href="https://x.com/hiroavrs"
                                className="underline underline-offset-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Hiro
                            </a>
                        </div>
                    </div>
                </>
            )}

            {/* DVD Gigi - always present */}
            <GigiDVD containerRef={containerRef} />
        </div>
    );
};

export default App;
