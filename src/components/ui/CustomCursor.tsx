'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const handleHoverLinks = () => setIsHovering(true);
    const handleLeaveLinks = () => setIsHovering(false);

    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.12;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.12;

      if (cursor) {
        cursor.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverLinks);
      el.addEventListener('mouseleave', handleLeaveLinks);
    });

    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll('a, button, [role="button"]');
      newElements.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverLinks);
        el.addEventListener('mouseleave', handleLeaveLinks);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    animate();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      observer.disconnect();
    };
  }, [isVisible]);

  if (!mounted) return null;

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-3 h-3 rounded-full bg-black pointer-events-none z-[9999] mix-blend-difference transition-transform duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${isHovering ? 'scale-9' : 'scale-3'}`}
      style={{ marginLeft: '-6px', marginTop: '-6px' }}
    />
  );
}
