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
      // The origin is at 3 o'clock, but the result pointer is at 12 o'clock, so subtract 270 degs
      const normalizedRotation = (finalRotation - 270) % 360;
      const sectionSize = 360 / SECTIONS.length;
      const sectionIndex = Math.floor((360 - normalizedRotation) / sectionSize);
      const section = SECTIONS[sectionIndex % SECTIONS.length];
      onSpinComplete(section.result);
      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-gap-8">
      <div className="tw-relative tw-w-64 tw-h-64">
        <svg
          className="tw-w-full tw-h-full"
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
                  className="tw-hover:brightness-110 tw-transition-all tw-cursor-pointer"
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
        <div className="tw-absolute tw-top-1/2 tw-left-1/2 tw-w-4 tw-h-4 tw--mt-2 tw--ml-2 tw-bg-white tw-rounded-full tw-shadow-md" />

        {/* Pointer */}
        <div
          className="tw-absolute tw-top-0 tw-left-1/2 tw--ml-3 tw-w-6 tw-h-6"
          style={{
            transform: "rotate(180deg)",
          }}
        >
          <div className="tw-w-0 tw-h-0 tw-border-l-[12px] tw-border-l-transparent tw-border-r-[12px] tw-border-r-transparent tw-border-b-[16px] tw-border-b-red-500" />
        </div>
      </div>

      <Button
        onClick={spinWheel}
        disabled={isSpinning}
        className="tw-px-6 tw-py-3 tw-text-lg tw-disabled:cursor-not-allowed"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </Button>
    </div>
  );
}
