import { useRef, useEffect } from "react";
import "./Noise.css";

export default function Noise({
  patternRefreshInterval = 3,
  patternAlpha = 10,
}) {
  const grainRef = useRef(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId;
    const size = 512;

    function draw() {
      canvas.width = size;
      canvas.height = size;
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    function loop() {
      if (frame % patternRefreshInterval === 0) draw();
      frame++;
      animationId = requestAnimationFrame(loop);
    }

    draw();
    loop();

    return () => cancelAnimationFrame(animationId);
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={grainRef}
      className="noise-overlay"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    />
  );
}
