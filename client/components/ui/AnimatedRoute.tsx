import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AnimatedPage } from './AnimatedPage';

interface AnimatedRouteProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedRoute({ children, className = '' }: AnimatedRouteProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <AnimatedPage key={location.pathname} className={className}>
        {children}
      </AnimatedPage>
    </AnimatePresence>
  );
}
