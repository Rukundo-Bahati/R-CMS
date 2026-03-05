import { motion } from 'framer-motion';
import { buttonVariants } from '@/lib/animations';
import { Button, ButtonProps } from './button';

export function AnimatedButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      className="inline-block"
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
