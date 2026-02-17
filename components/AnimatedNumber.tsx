
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  value: number;
  className?: string;
  formatter?: (val: number) => string;
}

const AnimatedNumber: React.FC<Props> = ({ value, className = "", formatter = (v) => v.toLocaleString() }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      // Small delay or simple state update is enough with tabular-nums
      // For more complex "counting" we'd use a requestAnimationFrame loop
      setDisplayValue(value);
      prevValueRef.current = value;
    }
  }, [value]);

  return (
    <span className={`${className} tabular-nums transition-all duration-500`}>
      {formatter(displayValue)}
    </span>
  );
};

export default AnimatedNumber;
