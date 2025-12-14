import React, { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

// Demo Data - 10 History Items (2 items with long text for truncation test)
const historyItems = [
  { id: "1", label: "关于人生的意义与价值的深度探讨与思考", icon: MessageCircle, color: "#A06CD5" }, // Long text
  { id: "2", label: "佛法入门经典书籍推荐", icon: MessageCircle, color: "#FF6B6B" },
  { id: "3", label: "如何有效缓解工作压力", icon: MessageCircle, color: "#4ECDC4" },
  { id: "4", label: "失恋了该怎么走出阴影", icon: MessageCircle, color: "#45B7D1" },
  { id: "5", label: "佛说缘分到底是什么东西以及它的来源", icon: MessageCircle, color: "#F9C74F" }, // Long text
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
    style={{ width: '16px', height: '16px', marginRight: '8px', position: 'relative', flexShrink: 0 }}
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
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function FluidDropdown({ onSelect }) {
  const [selectedItem, setSelectedItem] = useState(null); // No default selection for pure list view unless desired
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ width: '100%', position: 'relative', zIndex: 200 }}>
        <motion.div
          style={{
            width: '100%',
            background: 'transparent', // Transparent background as requested ("not in a box")
            overflow: 'hidden'
          }}
        >
          <motion.div 
            style={{ padding: '0', position: 'relative', overflowY: 'visible' }}
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            <motion.div
              layoutId="hover-highlight"
              style={{
                position: 'absolute',
                left: '0',
                right: '0',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                pointerEvents: 'none',
              }}
              initial={false}
              animate={{
                y: historyItems.findIndex((c) => (hoveredItem || (selectedItem && selectedItem.id)) === c.id) * 48, // 40px height + 8px gap/padding adjustment if needed. Let's assume 48px row height.
                height: 48,
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
                    if(onSelect) onSelect(item);
                  }}
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    padding: '12px 12px', 
                    height: '48px', // Increased touch target
                    fontSize: '15px',
                    borderRadius: '8px',
                    zIndex: 10,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: (selectedItem && selectedItem.id === item.id) || hoveredItem === item.id ? 'white' : 'var(--text-secondary)', // Use CSS var for secondary text color
                    textAlign: 'left',
                    outline: 'none',
                    whiteSpace: 'nowrap'
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
      </div>
    </MotionConfig>
  );
}
