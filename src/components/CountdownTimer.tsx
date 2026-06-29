"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({
  targetDate,
  variant = "default",
}: {
  targetDate: string;
  variant?: "default" | "hero";
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  const isHero = variant === "hero";

  return (
    <div className={`flex gap-2 ${isHero ? "" : "justify-center"}`}>
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div
            className={`flex flex-col items-center justify-center rounded font-bold tabular-nums ${
              isHero
                ? "min-w-[4.5rem] bg-white px-3 py-2 text-[#003087] shadow-md"
                : "h-14 w-14 bg-white/10 text-2xl text-white"
            }`}
          >
            <span className={isHero ? "text-2xl leading-none md:text-3xl" : "text-2xl"}>
              {value.toString().padStart(2, "0")}
            </span>
            {isHero && (
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                {label}
              </span>
            )}
          </div>
          {!isHero && (
            <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">{label}</p>
          )}
        </div>
      ))}
    </div>
  );
}
