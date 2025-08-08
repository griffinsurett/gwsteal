// src/components/LoopComponents/EnhancedAccordionItem.jsx
import React, { useRef, useEffect, useState } from "react";
import AnimatedBorderCard from "../AnimatedBorderCard";

const EnhancedAccordionItem = ({
  data,
  isActive,
  progress = 0,
  onToggle,
  onHover,
  children,
  className = "",
  name, // Radio group name
  value, // Unique value for this accordion item
  index, // Index of this accordion item
  shouldShowFullBorder = false, // New prop to control border type
}) => {
  const { icon, title, description } = data;
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const handleMouseEnter = () => {
    onHover?.(index, true);
  };

  const handleMouseLeave = () => {
    onHover?.(index, false);
  };

  // Measure content height to prevent layout shifts
  // This ensures smooth animations without affecting page scroll position
  useEffect(() => {
    if (contentRef.current) {
      // Temporarily make visible to measure, then hide again
      const content = contentRef.current;
      const originalMaxHeight = content.style.maxHeight;
      const originalOpacity = content.style.opacity;
      
      // Make it temporarily visible to measure
      content.style.maxHeight = 'none';
      content.style.opacity = '0';
      content.style.position = 'absolute';
      content.style.visibility = 'hidden';
      
      const height = content.scrollHeight;
      setContentHeight(height);
      
      // Restore original styles
      content.style.maxHeight = originalMaxHeight;
      content.style.opacity = originalOpacity;
      content.style.position = '';
      content.style.visibility = '';
    }
  }, [isActive, children, description]); // Recalculate when content changes

  return (
    <div
      className={`group relative ${className}`}
      data-accordion-item
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hidden radio input for semantic accordion behavior */}
      <input
        type="radio"
        id={`accordion-${value}`}
        name={name}
        value={value}
        checked={isActive}
        onChange={onToggle}
        className="sr-only" // Screen reader only - visually hidden but accessible
      />

      {/* Using the new AnimatedBorderCard component */}
      <AnimatedBorderCard
        isActive={isActive}
        progress={progress}
        showFullBorder={shouldShowFullBorder}
        className="transition-all duration-100"
      >
        {/* Header - Now a label for the radio input */}
        <label
          htmlFor={`accordion-${value}`}
          className="w-full text-left flex items-center justify-between p-5 hover:bg-card/50 transition-colors duration-300 cursor-pointer relative z-20"
        >
          <div className="flex items-center gap-2">
            <div className="icon-medium card-icon-color">{icon}</div>
            <div>
              <h3 className="h3">{title}</h3>
            </div>
          </div>

          {/* Expand/Collapse Icon - Improved animation timing */}
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-300 text-xl font-normal leading-none
              ${
                isActive
                  ? "bg-accent text-black rotate-0"
                  : "bg-accent/20 group-hover:bg-accent/30 text-accent rotate-0"
              }
            `}
          >
            <span 
              className={`block transform transition-transform duration-300 translate-y-[-1px] ${
                isActive ? 'rotate-45' : 'rotate-0'
              }`}
            >
              +
            </span>
          </div>
        </label>

        {/* Expandable Content - Using calculated height for smooth animations */}
        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-500 ease-in-out relative z-20"
          style={{
            maxHeight: isActive ? `${contentHeight}px` : '0px',
            opacity: isActive ? 1 : 0,
          }}
        >
          <div className="px-6 pb-6">
            {/* Divider */}
            <div className="w-full h-px bg-accent/20 mb-4" />

            {/* Description */}
            <p className="secondary-text leading-relaxed mb-6">{description}</p>

            {/* Children (Video player on mobile) */}
            {children && <div className="lg:hidden">{children}</div>}
          </div>
        </div>
      </AnimatedBorderCard>
    </div>
  );
};

export default EnhancedAccordionItem;