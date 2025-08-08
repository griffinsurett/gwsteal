// src/hooks/useScrollVisibility.js
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook to manage autoplay based on section visibility
 * Pauses autoplay when section is not visible and resumes when it comes back into view
 * This prevents background animations from affecting user experience in other sections
 */
export const useScrollVisibility = ({
  threshold = 0.3, // How much of the section needs to be visible (30%)
  rootMargin = "0px", // Margin around the root for triggering
  onVisible = () => {}, // Called when section becomes visible
  onHidden = () => {}, // Called when section becomes hidden
  debounceDelay = 150, // Delay before triggering visibility changes
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Debounced visibility handler to prevent rapid state changes
  const handleVisibilityChange = useCallback((visible) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setIsVisible(visible);
      
      if (visible) {
        setHasBeenVisible(true);
        onVisible();
      } else {
        onHidden();
      }
    }, debounceDelay);
  }, [onVisible, onHidden, debounceDelay]);

  // Set up intersection observer
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create intersection observer with specified options
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Check if the element is intersecting with the specified threshold
        const visible = entry.isIntersecting && entry.intersectionRatio >= threshold;
        handleVisibilityChange(visible);
      },
      {
        threshold: threshold,
        rootMargin: rootMargin,
      }
    );

    observerRef.current.observe(element);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [threshold, rootMargin, handleVisibilityChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    elementRef, // Ref to attach to the element you want to observe
    isVisible, // Current visibility state
    hasBeenVisible, // Whether the element has ever been visible (useful for lazy loading)
  };
};