"use client";

import { useEffect, useRef } from "react";

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 400;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    const ship = { x: width / 2 - 15, y: height - 30, width: 30, height: 15, speed: 5 };
    const bullets: { x: number; y: number; speed: number }[] = [];
    const enemies: { x: number; y: number; width: number; height: number }[] = [];
    const enemyRows = 5;
    const enemyCols = 10;
    const enemySpacing = 40;
    const enemySize = 20;
    const enemySpeed = 1;
    let enemyDirection = 1;
    let enemyMoveTimer = 0;

    for (let r = 0; r < enemyRows; r++) {
      for (let c = 0; c < enemyCols; c++) {
        enemies.push({
          x: 20 + c * enemySpacing,
          y: 20 + r * enemySpacing,
          width: enemySize,
          height: enemySize,
        });
      }
    }

    const keys = { left: false, right: false, up: false };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.left = true;
      if (e.key === "ArrowRight") keys.right = true;
      if (e.key === "ArrowUp") keys.up = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.left = false;
      if (e.key === "ArrowRight") keys.right = false;
      if (e.key === "ArrowUp") keys.up = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const gameLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // Move ship
      if (keys.left && ship.x > 0) ship.x -= ship.speed;
      if (keys.right && ship.x + ship.width < width) ship.x += ship.speed;

      // Shoot
      if (keys.up) {
        bullets.push({ x: ship.x + ship.width / 2, y: ship.y, speed: 7 });
        keys.up = false; // fire once per key press
      }

      // Draw ship
      ctx.fillStyle = "#0f0";
      ctx.fillRect(ship.x, ship.y, ship.width, ship.height);

      // Update and draw bullets
      ctx.fillStyle = "#ff0";
      bullets.forEach((b, i) => {
        b.y -= b.speed;
        ctx.fillRect(b.x - 2, b.y, 4, 10);
        // Remove off-screen bullets
        if (b.y < 0) bullets.splice(i, 1);
      });

      // Move enemies
      enemyMoveTimer++;
      if (enemyMoveTimer > 30) {
        enemyMoveTimer = 0;
        let shouldDescend = false;
        enemies.forEach((e) => {
          e.x += enemySpeed * enemyDirection;
          if (e.x + e.width > width || e.x < 0) shouldDescend = true;
        });
        if (shouldDescend) {
          enemyDirection *= -1;
          enemies.forEach((e) => (e.y += 10));
        }
      }

      // Draw enemies
      ctx.fillStyle = "#f00";
      enemies.forEach((e) => {
        ctx.fillRect(e.x, e.y, e.width, e.height);
      });

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <canvas ref={canvasRef} className="border border-gray-300" />;
}
