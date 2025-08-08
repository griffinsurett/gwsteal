// src/hooks/useViewportAutoplay.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook that pauses autoplay when a section is scrolled out of view
 * and resumes when it comes back into view. This creates a better UX
 * by preventing background animations from interfering with user browsing.
 */
export const useViewportAutoplay = ({
  // How much of the element needs to be visible to be considered "in view"
  rootMargin = '-20% 0px -20% 0px', // Element must be at least 60% visible
  threshold = 0.3, // At least 30% of element must be visible
  // Delay before pausing when element goes out of view (prevents flicker)
  pauseDelay = 500,
  // Delay before resuming when element comes back into view
  resumeDelay = 200,
} = {}) => {
  const [isInViewport, setIsInViewport] = useState(false);
  const [shouldPauseAutoplay, setShouldPauseAutoplay] = useState(true); // Start paused
  const elementRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  // Clean up any pending timeouts
  const clearTimeouts = useCallback(() => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  // Handle when element enters viewport
  const handleEnterViewport = useCallback(() => {
    clearTimeouts();
    setIsInViewport(true);
    
    // Small delay before resuming to prevent rapid on/off toggling
    resumeTimeoutRef.current = setTimeout(() => {
      setShouldPauseAutoplay(false);
    }, resumeDelay);
  }, [clearTimeouts, resumeDelay]);

  // Handle when element leaves viewport
  const handleLeaveViewport = useCallback(() => {
    clearTimeouts();
    setIsInViewport(false);
    
    // Delay before pausing to prevent brief scroll-throughs from stopping autoplay
    pauseTimeoutRef.current = setTimeout(() => {
      setShouldPauseAutoplay(true);
    }, pauseDelay);
  }, [clearTimeouts, pauseDelay]);

  // Set up Intersection Observer to watch for viewport changes
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          // Element is entering viewport
          handleEnterViewport();
        } else {
          // Element is leaving viewport
          handleLeaveViewport();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    // Cleanup function
    return () => {
      observer.disconnect();
      clearTimeouts();
    };
  }, [handleEnterViewport, handleLeaveViewport, rootMargin, threshold, clearTimeouts]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  return {
    elementRef, // Attach this ref to the element you want to observe
    isInViewport, // Boolean indicating if element is currently in viewport
    shouldPauseAutoplay, // Boolean indicating if autoplay should be paused
  };
};