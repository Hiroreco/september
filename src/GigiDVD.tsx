import { useEffect, useRef, useState } from "react";

interface GigiDVDProps {
    containerRef: React.RefObject<HTMLDivElement>;
}

const GigiDVD = ({ containerRef }: GigiDVDProps) => {
    const boxRef = useRef<HTMLImageElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [playing, setPlaying] = useState(false);
    const [boxSize, setBoxSize] = useState(200);

    const directionRef = useRef({ dx: 2, dy: 2 });
    const animationRef = useRef<number>();

    // Calculate box size based on viewport dimensions
    const calculateBoxSize = () => {
        const vw = Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        );
        const vh = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        );

        // Make box size responsive - smaller of 200px or 20% of viewport's smallest dimension
        const smallestDimension = Math.min(vw, vh);
        const newBoxSize = Math.min(200, Math.floor(smallestDimension * 0.3));

        setBoxSize(newBoxSize);
    };

    useEffect(() => {
        // Initial calculation of box size
        calculateBoxSize();

        // Add resize event listener
        window.addEventListener("resize", calculateBoxSize);

        // Clean up
        return () => {
            window.removeEventListener("resize", calculateBoxSize);
        };
    }, []);

    const updatePosition = () => {
        if (!containerRef.current || !boxRef.current) {
            animationRef.current = requestAnimationFrame(updatePosition);
            return;
        }

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        let newX = position.x + directionRef.current.dx;
        let newY = position.y + directionRef.current.dy;

        // Check for collisions with right/left edges
        if (newX <= 0 || newX + boxSize >= containerWidth) {
            directionRef.current.dx = -directionRef.current.dx;
            newX = Math.max(0, Math.min(newX, containerWidth - boxSize));
        }

        // Check for collisions with top/bottom edges
        if (newY <= 0 || newY + boxSize >= containerHeight) {
            directionRef.current.dy = -directionRef.current.dy;
            newY = Math.max(0, Math.min(newY, containerHeight - boxSize));
        }

        setPosition({ x: newX, y: newY });
        animationRef.current = requestAnimationFrame(updatePosition);
    };

    useEffect(() => {
        // Start the animation
        animationRef.current = requestAnimationFrame(updatePosition);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [position, boxSize]);

    const handleImageClick = () => {
        if (playing || !audioRef.current) return;

        setPlaying(true);
        audioRef.current.play();
    };

    const handleAudioEnded = () => {
        setPlaying(false);
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="/september.mp3"
                onEnded={handleAudioEnded}
            />
            <img
                ref={boxRef}
                src="/gigi.png"
                className={`absolute object-cover ${
                    !playing && "cursor-pointer grayscale hover:grayscale-0"
                }`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${boxSize}px`,
                    height: `${boxSize}px`,
                    cursor: playing ? "default" : "pointer",
                    transition: "filter 0.3s ease",
                }}
                onClick={handleImageClick}
            />
        </>
    );
};

export default GigiDVD;
