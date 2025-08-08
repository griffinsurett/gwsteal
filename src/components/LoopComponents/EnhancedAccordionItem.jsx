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
  name,
  value,
  index,
  shouldShowFullBorder = false,
}) => {
  const { icon, title, description } = data;
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Calculate the height of content when it changes
  useEffect(() => {
    if (contentRef.current) {
      // Get the natural height of the content
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [isActive, children]); // Recalculate when active state or children change

  // Handle smooth height transitions by using calculated height instead of max-height
  const getContentStyle = () => ({
    height: isActive ? `${contentHeight}px` : '0px',
    opacity: isActive ? 1 : 0,
    transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out',
    overflow: 'hidden',
  });

  const handleMouseEnter = () => {
    onHover?.(index, true);
  };

  const handleMouseLeave = () => {
    onHover?.(index, false);
  };

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
        className="sr-only"
      />

      {/* Using the AnimatedBorderCard component */}
      <AnimatedBorderCard
        isActive={isActive}
        progress={progress}
        showFullBorder={shouldShowFullBorder}
        className="transition-all duration-200"
      >
        {/* Header - Label for the radio input */}
        <label
          htmlFor={`accordion-${value}`}
          className="w-full text-left flex items-center justify-between p-4 sm:p-5 hover:bg-card/50 transition-colors duration-300 cursor-pointer relative z-20"
        >
          <div className="flex items-center gap-3">
            <div className="icon-medium card-icon-color">
              {icon}
            </div>
            <div>
              <h3 className="h3 text-sm sm:text-base md:text-lg">{title}</h3>
            </div>
          </div>

          {/* Expand/Collapse Icon with improved animation */}
          <div
            className={`
              w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
              transition-all duration-300 text-lg sm:text-xl font-normal leading-none
              ${
                isActive
                  ? "bg-accent text-black transform rotate-180"
                  : "bg-accent/20 group-hover:bg-accent/30 text-accent transform rotate-0"
              }
            `}
          >
            <span className="block transform translate-y-[-1px]">
              +
            </span>
          </div>
        </label>

        {/* Expandable Content with smooth height animation */}
        <div style={getContentStyle()}>
          <div ref={contentRef} className="relative z-20">
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              {/* Divider */}
              <div className="w-full h-px bg-accent/20 mb-3 sm:mb-4" />

              {/* Description */}
              <p className="secondary-text leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                {description}
              </p>

              {/* Children (Video player on mobile) */}
              {children && (
                <div className="lg:hidden">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedBorderCard>
    </div>
  );
};

export default EnhancedAccordionItem;