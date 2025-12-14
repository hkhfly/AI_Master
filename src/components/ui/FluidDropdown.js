import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

// Custom hook for click outside detection
function useClickAway(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Button component
const Button = React.forwardRef(({ className, variant, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "outline" && "border border-neutral-700 bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

// Demo Data - 10 History Items
const historyItems = [
  { id: "1", label: "关于人生的意义与价值", icon: MessageCircle, color: "#A06CD5" },
  { id: "2", label: "佛法入门经典书籍推荐", icon: MessageCircle, color: "#FF6B6B" },
  { id: "3", label: "如何有效缓解工作压力", icon: MessageCircle, color: "#4ECDC4" },
  { id: "4", label: "失恋了该怎么走出阴影", icon: MessageCircle, color: "#45B7D1" },
  { id: "5", label: "佛说缘分到底是什么", icon: MessageCircle, color: "#F9C74F" },
  { id: "6", label: "在喧嚣中保持内心平静", icon: MessageCircle, color: "#A06CD5" },
  { id: "7", label: "金刚经的核心思想解读", icon: MessageCircle, color: "#FF6B6B" },
  { id: "8", label: "初学者打坐冥想的方法", icon: MessageCircle, color: "#4ECDC4" },
  { id: "9", label: "探讨因果报应的真实性", icon: MessageCircle, color: "#45B7D1" },
  { id: "10", label: "济公活佛的民间传说", icon: MessageCircle, color: "#F9C74F" },
];

// Helper for truncation
const truncate = (text, maxLength = 12) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Icon wrapper with animation
const IconWrapper = ({ icon: Icon, isHovered, color }) => (
  <motion.div 
    className="w-4 h-4 mr-2 relative" 
    initial={false} 
    animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
  >
    <Icon className="w-4 h-4" />
    {isHovered && (
      <motion.div
        className="absolute inset-0"
        style={{ color }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon className="w-4 h-4" strokeWidth={2} />
      </motion.div>
    )}
  </motion.div>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05, // Slightly faster stagger for 10 items
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function FluidDropdown({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(historyItems[0]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dropdownRef = useRef(null);

  useClickAway(dropdownRef, () => setIsOpen(false));

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="w-full relative"
        ref={dropdownRef}
        style={{ zIndex: 200 }} 
      >
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between bg-[rgba(255,255,255,0.05)] text-white border-none", // Adapted styles for dark theme
            "hover:bg-[rgba(255,255,255,0.1)]",
            "transition-all duration-200 ease-in-out",
            "h-12 px-4 rounded-xl",
            isOpen && "bg-[rgba(255,255,255,0.1)]"
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center">
            <IconWrapper 
              icon={selectedItem.icon} 
              isHovered={false} 
              color={selectedItem.color} 
            />
            {truncate(selectedItem.label)}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-5 h-5"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 1, y: 0, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              exit={{
                opacity: 0,
                y: 0,
                height: 0,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              className="absolute left-0 right-0 top-full mt-2 overflow-hidden z-[201]" // High z-index
              onKeyDown={handleKeyDown}
            >
              <motion.div
                className="w-full rounded-xl bg-[#1e1e1e] border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden" // Dark theme styles
                initial={{ borderRadius: 8 }}
                animate={{
                  borderRadius: 12,
                  transition: { duration: 0.2 },
                }}
                style={{ transformOrigin: "top" }}
              >
                <motion.div 
                  className="py-2 relative max-h-[400px] overflow-y-auto custom-scrollbar" // Added scroll for 10 items
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible"
                >
                   {/* Hover Highlight Logic - Simplified for list with scroll or removed if too complex to sync with scroll. 
                       Keeping it simple for now, using hover state on button directly instead of absolute div for simplicity in overflow.
                       Wait, the original used absolute positioning for highlight. 
                       If I add scroll, the absolute highlight might misalign.
                       Let's keep the list full height for now (400px is enough for 10 items).
                   */}
                  <motion.div
                    layoutId="hover-highlight"
                    className="absolute inset-x-1 bg-[rgba(255,255,255,0.05)] rounded-md pointer-events-none"
                    initial={false}
                    animate={{
                      y: historyItems.findIndex((c) => (hoveredItem || selectedItem.id) === c.id) * 40 + 8, // 8px top padding offset
                      height: 40,
                      opacity: (hoveredItem || selectedItem) ? 1 : 0
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.5,
                    }}
                  />
                  
                  {historyItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <motion.button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsOpen(false);
                          if(onSelect) onSelect(item);
                        }}
                        onHoverStart={() => setHoveredItem(item.id)}
                        onHoverEnd={() => setHoveredItem(null)}
                        className={cn(
                          "relative flex w-full items-center px-4 py-2.5 text-sm rounded-md z-10",
                          "transition-colors duration-150",
                          "focus:outline-none",
                          selectedItem.id === item.id || hoveredItem === item.id
                            ? "text-white"
                            : "text-neutral-400",
                        )}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                      >
                        <IconWrapper
                          icon={item.icon}
                          isHovered={hoveredItem === item.id}
                          color={item.color}
                        />
                        {truncate(item.label)}
                      </motion.button>
                    </React.Fragment>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
