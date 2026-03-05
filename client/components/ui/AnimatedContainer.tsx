import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scale?: number;
  animateOnce?: boolean;
  viewportMargin?: string;
}

export function AnimatedContainer({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  yOffset = 20,
  xOffset = 0,
  scale = 1,
  animateOnce = true,
  viewportMargin = '0px',
}: AnimatedContainerProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: yOffset,
      x: xOffset,
      scale: scale * 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: animateOnce, margin: viewportMargin }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
