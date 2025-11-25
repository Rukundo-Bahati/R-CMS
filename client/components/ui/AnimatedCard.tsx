import { motion, Variants, HTMLMotionProps, MotionProps } from 'framer-motion';
import { Card } from './card';
import { forwardRef, ReactNode } from 'react';

type CardProps = Omit<HTMLMotionProps<'div'>, 'onDrag' | 'children'> & {
  delay?: number;
  children: ReactNode;
  className?: string;
};

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
};

const AnimatedCardComponent = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  delay = 0,
  ...props 
}, ref) => {
  const motionProps: MotionProps & { className?: string } = {
    initial: "hidden",
    animate: "visible",
    whileHover: "hover",
    variants: cardVariants,
    className,
    transition: { delay },
    ...props
  };

  return (
    <motion.div ref={ref} {...motionProps}>
      <Card className="h-full">
        {children}
      </Card>
    </motion.div>
  );
});

AnimatedCardComponent.displayName = 'AnimatedCard';

export const AnimatedCard = AnimatedCardComponent;
