import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CelebrationEffectsProps {
    active: boolean;
}

class Firework {
    particles: THREE.Points;
    particleCount: number;
    positions: Float32Array;
    velocities: Float32Array;
    colors: Float32Array;
    life: Float32Array;
    maxLife: number;
    startX: number;
    startY: number;
    exploded: boolean;
    rocketLife: number;
    rocketY: number;

    constructor(startX: number, startY: number) {
        this.particleCount = 80;
        this.positions = new Float32Array(this.particleCount * 3);
        this.velocities = new Float32Array(this.particleCount * 3);
        this.colors = new Float32Array(this.particleCount * 3);
        this.life = new Float32Array(this.particleCount);
        this.maxLife = 180; // Longer particle life
        this.startX = startX;
        this.startY = startY;
        this.exploded = false;
        this.rocketLife = 0;
        this.rocketY = startY;

        // Create geometry and material
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            size: 4,
            sizeAttenuation: false,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
        });

        // Initialize all particles at the starting position (rocket phase)
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            this.positions[i3] = startX;
            this.positions[i3 + 1] = startY;
            this.positions[i3 + 2] = 0;
            this.life[i] = this.maxLife;
        }

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(this.positions, 3)
        );
        geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(this.colors, 3)
        );

        this.particles = new THREE.Points(geometry, material);
    }

    update(): boolean {
        if (!this.exploded) {
            // Rocket phase - move upward
            this.rocketLife += 1;
            this.rocketY += 8;

            // Update rocket position
            this.positions[1] = this.rocketY;
            this.colors[0] = 1; // White rocket trail
            this.colors[1] = 0.8;
            this.colors[2] = 0;

            // Explode after reaching height or time
            if (this.rocketLife > 30 || this.rocketY > 200) {
                this.explode();
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.geometry.attributes.color.needsUpdate = true;
            return true;
        }

        // Explosion phase
        let aliveCount = 0;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            if (this.life[i] > 0) {
                aliveCount++;

                // Update positions
                this.positions[i3] += this.velocities[i3];
                this.positions[i3 + 1] += this.velocities[i3 + 1];

                // Apply gravity
                this.velocities[i3 + 1] -= 0.15;

                // Air resistance
                this.velocities[i3] *= 0.98;
                this.velocities[i3 + 1] *= 0.98;

                // Fade particles but keep rainbow colors
                this.life[i] -= 1; // Slower fade
                const lifeRatio = Math.max(0.1, this.life[i] / this.maxLife); // Never go below 10% opacity

                // Keep original rainbow colors but fade opacity
                const originalR =
                    this.colors[i3] /
                    (this.life[i] === this.maxLife - 1
                        ? 1
                        : (this.life[i] + 1) / this.maxLife);
                const originalG =
                    this.colors[i3 + 1] /
                    (this.life[i] === this.maxLife - 1
                        ? 1
                        : (this.life[i] + 1) / this.maxLife);
                const originalB =
                    this.colors[i3 + 2] /
                    (this.life[i] === this.maxLife - 1
                        ? 1
                        : (this.life[i] + 1) / this.maxLife);

                this.colors[i3] = originalR * lifeRatio;
                this.colors[i3 + 1] = originalG * lifeRatio;
                this.colors[i3 + 2] = originalB * lifeRatio;
            }
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;

        return aliveCount > 0;
    }

    explode() {
        this.exploded = true;
        const rainbowColors = [
            [1, 0.2, 0.2], // Red
            [1, 0.6, 0.2], // Orange
            [1, 1, 0.2], // Yellow
            [0.2, 1, 0.2], // Green
            [0.2, 0.6, 1], // Blue
            [0.6, 0.2, 1], // Purple
            [1, 0.2, 0.8], // Pink
        ];

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Set explosion center
            this.positions[i3] = this.startX;
            this.positions[i3 + 1] = this.rocketY;
            this.positions[i3 + 2] = 0;

            // Random explosion velocities
            const angle =
                (i / this.particleCount) * Math.PI * 2 +
                (Math.random() - 0.5) * 0.5;
            const speed = Math.random() * 8 + 3;

            this.velocities[i3] = Math.cos(angle) * speed;
            this.velocities[i3 + 1] =
                Math.sin(angle) * speed + Math.random() * 3;
            this.velocities[i3 + 2] = 0;

            // Assign rainbow colors with higher intensity
            const colorIndex = Math.floor(Math.random() * rainbowColors.length);
            const color = rainbowColors[colorIndex];
            this.colors[i3] = Math.min(1, color[0] + Math.random() * 0.2);
            this.colors[i3 + 1] = Math.min(1, color[1] + Math.random() * 0.2);
            this.colors[i3 + 2] = Math.min(1, color[2] + Math.random() * 0.2);

            this.life[i] = this.maxLife;
        }
    }
}

const CelebrationEffects = ({ active }: CelebrationEffectsProps) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [rainbowText, setRainbowText] = useState(false);
    const sceneRef = useRef<THREE.Scene>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const fireworksRef = useRef<Firework[]>([]);
    const animationRef = useRef<number>();
    const fireworkIntervalRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (!active || !mountRef.current) return;

        setRainbowText(true);

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.OrthographicCamera(
            -window.innerWidth / 2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            -window.innerHeight / 2,
            1,
            1000
        );
        /* @ts-ignore */
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        fireworksRef.current = [];

        // Create initial firework
        const createFirework = () => {
            const x = (Math.random() - 0.5) * window.innerWidth * 0.8;
            const y = (Math.random() - 0.5) * window.innerHeight * 0.8;
            const firework = new Firework(x, y);
            fireworksRef.current.push(firework);
            /* @ts-ignore */
            scene.add(firework.particles);
        };

        // Start with one firework
        createFirework();

        // Create new fireworks continuously - no timeout to stop them!
        fireworkIntervalRef.current = setInterval(() => {
            createFirework();
        }, 600); // Firework every 600ms

        // Animation loop
        const animate = () => {
            // Update all fireworks
            fireworksRef.current = fireworksRef.current.filter((firework) => {
                const isAlive = firework.update();
                if (!isAlive) {
                    /* @ts-ignore */
                    scene.remove(firework.particles);
                    firework.particles.geometry.dispose();
                    (firework.particles.material as THREE.Material).dispose();
                }
                return isAlive;
            });

            renderer.render(scene, camera);
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.left = -window.innerWidth / 2;
            camera.right = window.innerWidth / 2;
            camera.top = window.innerHeight / 2;
            camera.bottom = -window.innerHeight / 2;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);

            // Clear the firework interval
            if (fireworkIntervalRef.current) {
                clearInterval(fireworkIntervalRef.current);
            }

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            // Clean up all fireworks
            fireworksRef.current.forEach((firework) => {
                /* @ts-ignore */
                scene.remove(firework.particles);
                firework.particles.geometry.dispose();
                (firework.particles.material as THREE.Material).dispose();
            });

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            renderer.dispose();
        };
    }, [active]);

    useEffect(() => {
        if (!active) {
            setRainbowText(false);
        }
    }, [active]);

    if (!active) return null;

    return (
        <>
            {/* Three.js canvas container */}
            <div
                ref={mountRef}
                className="fixed inset-0 pointer-events-none z-10"
            />

            {/* Rainbow celebration text - now shows as long as active is true */}
            {rainbowText && (
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div
                        className="text-4xl md:text-6xl font-bold animate-pulse"
                        style={{
                            background:
                                "linear-gradient(45deg, #ff4444, #ff8844, #ffff44, #44ff44, #4488ff, #8844ff, #ff44ff)",
                            backgroundSize: "300% 300%",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            animation: "rainbow 2s ease-in-out infinite",
                            textShadow: "0 0 20px rgba(255,255,255,0.5)",
                        }}
                    >
                        🎉 IT'S TIME! 🎉
                    </div>
                </div>
            )}
        </>
    );
};

export default CelebrationEffects;
