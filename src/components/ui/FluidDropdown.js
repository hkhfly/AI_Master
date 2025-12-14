import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

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
    style={{ width: '16px', height: '16px', marginRight: '8px', position: 'relative' }}
    initial={false} 
    animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
  >
    <Icon size={16} />
    {isHovered && (
      <motion.div
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', color: color }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon size={16} strokeWidth={2} />
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
      staggerChildren: 0.05,
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
        ref={dropdownRef}
        style={{ width: '100%', position: 'relative', zIndex: 200 }} 
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
            color: 'white',
            border: 'none',
            height: '48px',
            padding: '0 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'background 0.2s ease-in-out',
            outline: 'none',
            fontSize: '14px',
            fontWeight: 500
          }}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
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
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>

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
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '100%',
                marginTop: '8px',
                overflow: 'hidden',
                zIndex: 201
              }}
              onKeyDown={handleKeyDown}
            >
              <motion.div
                style={{
                  width: '100%',
                  background: '#1e1e1e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  transformOrigin: 'top',
                  overflow: 'hidden'
                }}
                initial={{ borderRadius: 8 }}
                animate={{
                  borderRadius: 12,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div 
                  style={{ padding: '8px 0', position: 'relative', maxHeight: '400px', overflowY: 'auto' }}
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible"
                >
                  <motion.div
                    layoutId="hover-highlight"
                    style={{
                      position: 'absolute',
                      left: '4px',
                      right: '4px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '6px',
                      pointerEvents: 'none',
                      // Simple calculation for Y position based on item height (40px approx) + padding
                      // This might be tricky with scroll, but let's try
                    }}
                    initial={false}
                    animate={{
                      y: historyItems.findIndex((c) => (hoveredItem || selectedItem.id) === c.id) * 40 + 8, 
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
                        style={{
                          position: 'relative',
                          display: 'flex',
                          width: '100%',
                          alignItems: 'center',
                          padding: '10px 16px', // Matches 40px height approx
                          height: '40px',
                          fontSize: '14px',
                          borderRadius: '6px',
                          zIndex: 10,
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: (selectedItem.id === item.id || hoveredItem === item.id) ? 'white' : '#9CA3AF',
                          textAlign: 'left',
                          outline: 'none'
                        }}
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
