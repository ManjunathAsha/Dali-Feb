import React, { useEffect, useRef } from 'react';
import { LOADER_CONSTANTS } from '../../constants/loaderConstants';
import { ARIA_LABELS } from '../../constants/aria';

export type LoadingMessageKey = keyof typeof LOADER_CONSTANTS.LOADING_MESSAGES;
export type BackgroundColor = keyof typeof LOADER_CONSTANTS.BACKGROUND_COLORS;
export type TextColor = keyof typeof LOADER_CONSTANTS.TEXT_COLORS;
export type SpinnerType = keyof typeof LOADER_CONSTANTS.SPINNER_TYPES;

interface LoadingOverlayProps {
  isVisible: boolean;
  message: string;
  backgroundColor: string;
  textColor: string;
  spinnerType: SpinnerType;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message, 
  backgroundColor, 
  textColor, 
  spinnerType 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Create aria-live region for announcing loading state
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${ARIA_LABELS.STATUS.LOADING}: ${message}`;
      document.body.appendChild(announcement);

      // Trap focus and manage scroll
      overlayRef.current?.focus();
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.removeChild(announcement);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isVisible, message]);

  if (!isVisible) return null;

  const renderSpinner = () => {
    const commonProps = {
      role: "progressbar",
      "aria-label": ARIA_LABELS.STATUS.LOADING,
      "aria-valuetext": message
    };

    switch (spinnerType) {
      case 'DOUBLE_BLOCKS':
        return (
          <div className="double-blocks-spinner" {...commonProps}>
            <div className="cube1" aria-hidden="true" />
            <div className="cube2" aria-hidden="true" />
          </div>
        );
      case 'BOUNCY':
        return (
          <div className="bouncy-spinner" {...commonProps}>
            <div className="bounce1" aria-hidden="true" />
            <div className="bounce2" aria-hidden="true" />
            <div className="bounce3" aria-hidden="true" />
          </div>
        );
      case 'BUBBLE':
        return (
          <div className="bubble-spinner" {...commonProps}>
            <div className="double-bounce1" aria-hidden="true" />
            <div className="double-bounce2" aria-hidden="true" />
          </div>
        );
      case 'RECT':
        return (
          <div className="rect-spinner" {...commonProps}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`rect${i}`} aria-hidden="true" />
            ))}
          </div>
        );
      case 'SIGNAL':
        return (
          <div className="signal-spinner" {...commonProps}>
            <div className="signal1" aria-hidden="true" />
            <div className="signal2" aria-hidden="true" />
            <div className="signal3" aria-hidden="true" />
          </div>
        );
      default:
        return <div className="basic-spinner" {...commonProps} />;
    }
  };

  return (
    <div
      ref={overlayRef}
      className={`loading-lib-loader ${backgroundColor} visible`}
      role="dialog"
      aria-modal="true"
      aria-label={message}
      tabIndex={-1}
      aria-describedby="loading-message"
    >
      <div className="loading-lib-loader-content">
        <h1 
          id="loading-message"
          className={`loading-lib-loader-content-h1 ${textColor}`}
        >
          {message}
        </h1>
        {renderSpinner()}
      </div>
    </div>
  );
};

export default LoadingOverlay;