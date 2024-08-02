import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import AlertWarning from './AlertWarning';
import AlertSuccess from './AlertSuccess';
import AlertError from './AlertError';

type AlertType = 'warning' | 'success' | 'error';

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, duration = 3 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, duration * 1000);

    return () => clearTimeout(timeoutId);
  }, [duration]);

  useEffect(() => {
    if (isVisible) {
      gsap.fromTo(
        '.alert',
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 1 }
      );
      gsap.to('.alert', {
        x: '100%',
        opacity: 0,
        delay: duration,
        duration: 1,
        onComplete: () => setIsVisible(false),
      });
    }
  }, [isVisible, duration]);

  if (!isVisible) return null;

  let AlertComponent;
  switch (type) {
    case 'warning':
      AlertComponent = <AlertWarning message={message} header={title}/>;
      break;
    case 'success':
      AlertComponent = <AlertSuccess message={message} header={title}/>;
      break;
    case 'error':
      AlertComponent = <AlertError message={message} header={title}/>;
      break;
    default:
      return null;
  }

  return (
    <div className="alert fixed top-30 right-4 z-100">
      {AlertComponent}
    </div>
  );
};

export default Alert;
