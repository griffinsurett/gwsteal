// src/Sections/WebsiteTypes.jsx
import React, { useState, useEffect, useRef } from "react";
import EnhancedAccordionItem from "../components/LoopComponents/EnhancedAccordionItem";
import VideoPlayer from "../components/VideoPlayer";
import useAccordionAutoplay from "../hooks/useAccordionAutoplay";
import { useViewportAutoplay } from "../hooks/useViewportAutoplay";
import EarRape from "../assets/Black-Microwave-Earrape.mp4";

const demoVideo = EarRape;

const WebsiteTypes = () => {
  const websiteTypes = [
    {
      icon: "🚀",
      title: "Landing Pages",
      description:
        "High-converting single-page websites designed to capture leads and drive specific actions for your marketing campaigns.",
      videoSrc: demoVideo,
    },
    {
      icon: "🏢",
      title: "Small Business Websites",
      description:
        "Professional websites that establish credibility and help local businesses attract and retain customers online.",
      videoSrc: demoVideo,
    },
    {
      icon: "💼",
      title: "Personal Portfolio Websites",
      description:
        "Showcase your work, skills, and achievements with a stunning portfolio that makes you stand out from the competition.",
      videoSrc: demoVideo,
    },
    {
      icon: "✍️",
      title: "Blogs",
      description:
        "Content-focused websites with easy-to-use publishing tools to share your expertise and build your audience.",
      videoSrc: demoVideo,
    },
    {
      icon: "🛒",
      title: "E-Commerce Websites",
      description:
        "Complete online stores with shopping carts, secure payments, inventory management, and everything you need to sell online.",
      videoSrc: demoVideo,
    },
    {
      icon: "❤️",
      title: "Non-Profit Websites",
      description:
        "Mission-driven websites that inspire action, facilitate donations, and help you make a greater impact in your community.",
      videoSrc: demoVideo,
    },
    {
      icon: "🏛️",
      title: "Large Corporate Websites",
      description:
        "Enterprise-level websites with advanced functionality, multi-user management, and scalable architecture for growing companies.",
      videoSrc: demoVideo,
    },
    {
      icon: "⚙️",
      title: "Custom Full-Stack Applications",
      description:
        "Bespoke web applications tailored to your unique business processes, with custom databases and advanced functionality.",
      videoSrc: demoVideo,
    },
  ];

  // Viewport-based autoplay control
  const { elementRef, isInViewport, shouldPauseAutoplay } = useViewportAutoplay({
    rootMargin: '-10% 0px -10% 0px', // Section must be 80% visible
    threshold: 0.4, // At least 40% visible
    pauseDelay: 800, // Wait 800ms before pausing when out of view
    resumeDelay: 300, // Wait 300ms before resuming when back in view
  });

  // Original accordion autoplay logic
  const {
    activeIndex,
    isAutoplayPaused: userEngagedPaused,
    userEngaged,
    shouldPauseAfterVideo,
    isResumeScheduled,
    shouldShowFullBorder,
    handleManualSelection,
    handleAccordionHover,
    handleVideoEnded,
    advanceToNext,
  } = useAccordionAutoplay(websiteTypes.length, 0);

  // Combined pause state: pause if either viewport or user engagement requires it
  const isAutoplayPaused = shouldPauseAutoplay || userEngagedPaused;

  const [progress, setProgress] = useState(0);
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wasVideoPaused, setWasVideoPaused] = useState(false);
  const advanceTimeoutRef = useRef(null);

  const getCurrentVideoRef = () => {
    if (window.innerWidth >= 1024) {
      return desktopVideoRef.current;
    }
    return mobileVideoRef.current;
  };

  const handleVideoClick = () => {
    handleManualSelection(activeIndex);
  };

  // Watch for autoplay state changes
  useEffect(() => {
    const currentVideo = getCurrentVideoRef();
    if (!currentVideo) return;

    if (!isAutoplayPaused && wasVideoPaused) {
      currentVideo.play().catch(() => {
        console.log("Resume play prevented");
      });
      setWasVideoPaused(false);
    } else if (isAutoplayPaused && !currentVideo.paused) {
      if (!currentVideo.dataset.userPaused) {
        currentVideo.pause();
        setWasVideoPaused(true);
      }
    }
  }, [isAutoplayPaused, wasVideoPaused]);

  // Reset & autoplay whenever the active panel changes
  useEffect(() => {
    if (isTransitioning || isAutoplayPaused) return;

    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    const timer = setTimeout(() => {
      const desktopVideo = desktopVideoRef.current;
      const mobileVideo = mobileVideoRef.current;

      [desktopVideo, mobileVideo].forEach((video) => {
        if (video) {
          video.currentTime = 0;
          setProgress(0);
          if (!isAutoplayPaused) {
            video.play().catch((error) => {
              console.log("Autoplay prevented:", error);
            });
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [activeIndex, isTransitioning, isAutoplayPaused]);

  const handleTimeUpdate = () => {
    const currentVideo = getCurrentVideoRef();
    if (!currentVideo?.duration) return;
    const newProgress =
      (currentVideo.currentTime / currentVideo.duration) * 100;
    setProgress(newProgress);
  };

  const handleEnded = () => {
    setProgress(100);

    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }

    handleVideoEnded();
  };

  const handleVideoLoad = () => {
    setProgress(0);
  };

  const handleRadioChange = (event) => {
    const selectedIndex = parseInt(event.target.value, 10);
    setIsTransitioning(true);
    handleManualSelection(selectedIndex);
    setProgress(0);

    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={elementRef} // Attach the viewport observer to this section
      className="outer-section bg-secondary relative"
    >
      <div className="section-dim-border"></div>
      <div className="inner-section">
        <div className="text-section">
          <div className="border-title">Website Types</div>
          <h2 className="h2 mb-4 sm:mb-6">
            Websites We <span className="text-accent-heading">Build</span>
          </h2>
          <p className="large-text">
            From simple landing pages to complex web applications - we create
            websites tailored to your specific needs and industry.
          </p>
        </div>

        <div
          className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12"
          data-accordion-container
        >
          {/* Left: Accordion list with improved mobile spacing */}
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {websiteTypes.map((websiteType, i) => (
              <EnhancedAccordionItem
                key={i}
                data={websiteType}
                isActive={activeIndex === i}
                progress={progress}
                onToggle={handleRadioChange}
                onHover={handleAccordionHover}
                shouldShowFullBorder={shouldShowFullBorder(i)}
                index={i}
                name="website-types"
                value={i.toString()}
                className="transition-all duration-300"
              >
                {/* Mobile Video Player */}
                {activeIndex === i && (
                  <VideoPlayer
                    key={`mobile-${i}-${activeIndex}`}
                    ref={mobileVideoRef}
                    src={websiteType.videoSrc}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    onLoadedData={handleVideoLoad}
                    onClick={handleVideoClick}
                    desktop={false}
                  />
                )}
              </EnhancedAccordionItem>
            ))}
          </div>

          {/* Right: Desktop video */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              {activeIndex >= 0 && activeIndex < websiteTypes.length ? (
                <div
                  className="transition-all duration-500 ease-in-out"
                  data-video-container
                  onMouseEnter={() => handleAccordionHover(activeIndex, true)}
                  onMouseLeave={() => handleAccordionHover(activeIndex, false)}
                >
                  <VideoPlayer
                    key={`desktop-${activeIndex}`}
                    ref={desktopVideoRef}
                    src={websiteTypes[activeIndex].videoSrc}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    onLoadedData={handleVideoLoad}
                    onClick={handleVideoClick}
                    desktop={true}
                    className="shadow-2xl shadow-accent/20"
                  />

                  {/* Video Info Card with status indicators */}
                  <div className="mt-6 p-6 card-bg rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="icon-small card-icon-color">
                        {websiteTypes[activeIndex].icon}
                      </div>
                      <h3 className="h3">{websiteTypes[activeIndex].title}</h3>
                    </div>
                    <p className="secondary-text leading-relaxed">
                      {websiteTypes[activeIndex].description}
                    </p>

                    {/* Debug info with viewport status */}
                    <div className="mt-4 text-xs opacity-75 bg-zinc-800 p-2 rounded">
                      <div>
                        🔍 In Viewport: {isInViewport ? "✅" : "❌"}
                      </div>
                      <div>
                        ⏸️ Viewport Paused: {shouldPauseAutoplay ? "✅" : "❌"}
                      </div>
                      <div>
                        👤 User Engaged: {userEngaged ? "✅" : "❌"}
                      </div>
                      <div>
                        🎮 Overall Paused: {isAutoplayPaused ? "✅" : "❌"}
                      </div>
                      <div>
                        📊 Progress: {Math.round(progress)}%
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="relative rounded-xl overflow-hidden bg-tertiary-bg h-96 flex items-center justify-center"
                  data-video-container
                >
                  <div className="text-center">
                    <div className="icon-large bg-accent/20 text-accent mx-auto mb-4">
                      🎬
                    </div>
                    <p className="secondary-text text-lg font-medium">
                      Select a website type to view demo
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsiteTypes;