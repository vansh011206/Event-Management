"use client";

import React, { useEffect, useRef, useState } from "react";

type AnimationDirection = "up" | "down" | "left" | "right" | "fade" | "scale";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  threshold?: number;
}

export default function FadeIn({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 800,
  threshold = 0.12,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (currentRef) observer.unobserve(currentRef);
          }
        });
      },
      { threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(32px)";
      case "down":
        return "translateY(-32px)";
      case "left":
        return "translateX(-40px)";
      case "right":
        return "translateX(40px)";
      case "scale":
        return "scale(0.95)";
      case "fade":
      default:
        return "none";
    }
  };

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
