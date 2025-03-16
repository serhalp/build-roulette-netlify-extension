import { useState } from "react";
import { Button } from "@netlify/sdk/ui/react/components";

interface Props {
  onSpinComplete: (result: boolean) => void;
}

const SECTIONS = [
  { id: 1, result: true, color: "#db6368" },
  { id: 2, result: false, color: "#71e3e1" },
  { id: 3, result: false, color: "#71e3e1" },
  { id: 4, result: false, color: "#71e3e1" },
  { id: 5, result: false, color: "#71e3e1" },
  { id: 6, result: false, color: "#71e3e1" },
];

export function SpinningWheel({ onSpinComplete }: Props) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const spinDegrees = 720 + Math.floor(Math.random() * 360);
    const finalRotation = rotation + spinDegrees;
    setRotation(finalRotation);

    setTimeout(() => {
      const normalizedRotation = finalRotation % 360;
      const sectionSize = 360 / SECTIONS.length;
      const sectionIndex = Math.floor((360 - normalizedRotation) / sectionSize);
      const section = SECTIONS[sectionIndex % SECTIONS.length];
      onSpinComplete(section.result);
      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-64 h-64">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 5s cubic-bezier(0.32, 0.94, 0.60, 1)"
              : "none",
          }}
        >
          {SECTIONS.map((section, index) => {
            const angle = (360 / SECTIONS.length) * index;
            const angleRad = (angle * Math.PI) / 180;
            const nextAngleRad = ((angle + 60) * Math.PI) / 180;

            // Calculate points for wedge and border
            const x1 = 50 + 40 * Math.cos(angleRad);
            const y1 = 50 + 40 * Math.sin(angleRad);
            const x2 = 50 + 40 * Math.cos(nextAngleRad);
            const y2 = 50 + 40 * Math.sin(nextAngleRad);

            return (
              <g key={section.id}>
                {/* Wedge */}
                <path
                  d={`M50,50 L${x1},${y1} A40,40 0 0,1 ${x2},${y2} Z`}
                  fill={section.color}
                  className="hover:brightness-110 transition-all cursor-pointer"
                />
                {/* Radius border */}
                <line
                  x1="50"
                  y1="50"
                  x2={x1}
                  y2={y1}
                  stroke="white"
                  strokeWidth="0.5"
                  strokeOpacity="0.6"
                />
              </g>
            );
          })}
        </svg>

        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-white rounded-full shadow-md" />

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -ml-3 w-6 h-6">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-red-500" />
        </div>
      </div>

      <Button
        onClick={spinWheel}
        disabled={isSpinning}
        className="px-6 py-3 text-lg disabled:cursor-not-allowed"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </Button>
    </div>
  );
}
