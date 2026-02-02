import { useEffect, useRef, useCallback, memo } from 'react';
import { useStore } from '../store/useStore';

interface Droplet {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  sliding: boolean;
}

// Rain canvas with droplets that stick and slide
function RainCanvasComponent() {
  const { theme } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropletsRef = useRef<Droplet[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animationRef = useRef<number>(0);
  const nextIdRef = useRef(0);

  // Only active during rainy theme
  const isRainy = theme === 'rainy';

  // Create a new droplet
  const createDroplet = useCallback((): Droplet => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    return {
      id: nextIdRef.current++,
      x: Math.random() * width,
      y: -20 - Math.random() * 100,
      radius: 3 + Math.random() * 5,
      speed: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.4,
      sliding: false,
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isRainy || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize droplets
    dropletsRef.current = Array.from({ length: 30 }, () => createDroplet());

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const droplets = dropletsRef.current;
      const mouse = mouseRef.current;

      // Update and draw droplets
      for (let i = droplets.length - 1; i >= 0; i--) {
        const drop = droplets[i];

        // Check mouse proximity - push droplets away
        const dx = drop.x - mouse.x;
        const dy = drop.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80 && dist > 0) {
          // Push droplet away from mouse
          const force = (80 - dist) / 80;
          drop.x += (dx / dist) * force * 8;
          drop.y += (dy / dist) * force * 4;
          drop.opacity -= 0.02;
        }

        // Random chance to stick to screen
        if (!drop.sliding && drop.y > 100 && Math.random() < 0.001) {
          drop.sliding = true;
          drop.speed = 0.3 + Math.random() * 0.5;
        }

        // Move droplet
        drop.y += drop.speed;

        // Remove if off screen or faded
        if (drop.y > canvas.height + 20 || drop.opacity <= 0) {
          droplets.splice(i, 1);
          droplets.push(createDroplet());
          continue;
        }

        // Draw droplet
        ctx.beginPath();
        
        if (drop.sliding) {
          // Sliding droplet - elongated
          ctx.ellipse(drop.x, drop.y, drop.radius * 0.7, drop.radius * 1.5, 0, 0, Math.PI * 2);
          
          // Trail
          ctx.moveTo(drop.x, drop.y - drop.radius * 1.5);
          ctx.lineTo(drop.x - drop.radius * 0.3, drop.y - drop.radius * 3);
          ctx.lineTo(drop.x + drop.radius * 0.3, drop.y - drop.radius * 3);
          ctx.closePath();
        } else {
          // Falling droplet - tear shape
          ctx.ellipse(drop.x, drop.y, drop.radius, drop.radius, 0, 0, Math.PI * 2);
        }

        const gradient = ctx.createRadialGradient(
          drop.x - drop.radius * 0.3,
          drop.y - drop.radius * 0.3,
          0,
          drop.x,
          drop.y,
          drop.radius
        );
        gradient.addColorStop(0, `rgba(200, 220, 255, ${drop.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(150, 180, 220, ${drop.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(100, 140, 180, ${drop.opacity * 0.2})`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(drop.x - drop.radius * 0.3, drop.y - drop.radius * 0.3, drop.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity * 0.6})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRainy, createDroplet]);

  // Mouse tracking with throttle
  useEffect(() => {
    if (!isRainy) return;

    let lastUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < 16) return; // ~60fps throttle
      lastUpdate = now;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isRainy]);

  if (!isRainy) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

export const RainCanvas = memo(RainCanvasComponent);
