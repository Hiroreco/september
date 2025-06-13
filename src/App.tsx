import { useRef } from "react";
import CountdownTimer from "./CountdownTimer";
import GigiDVD from "./GigiDVD";

const App = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center gap-2 bg-orange-200 justify-center h-screen w-screen"
        >
            <div className="text-3xl z-10">There are</div>

            <CountdownTimer
                targetDate={
                    new Date(
                        new Date().getMonth() >= 8 && new Date().getDate() > 21
                            ? `${new Date().getFullYear() + 1}-09-21T00:00:00`
                            : `${new Date().getFullYear()}-09-21T00:00:00`
                    )
                }
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
                        href="https://www.youtube.com/@holoen_gigimurin"
                        className="underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Hiro
                    </a>
                </div>
            </div>

            <GigiDVD containerRef={containerRef} />
        </div>
    );
};

export default App;
