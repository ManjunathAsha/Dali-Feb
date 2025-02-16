import React, { createContext, useContext, useState } from 'react';
import { LOADER_CONSTANTS } from '../constants/loaderConstants';

export type LoadingMessageKey = keyof typeof LOADER_CONSTANTS.LOADING_MESSAGES;
export type BackgroundColor = keyof typeof LOADER_CONSTANTS.BACKGROUND_COLORS;
export type TextColor = keyof typeof LOADER_CONSTANTS.TEXT_COLORS;
export type SpinnerType = keyof typeof LOADER_CONSTANTS.SPINNER_TYPES;

export interface ShowLoadingParams {
  messageKey: LoadingMessageKey;
  backgroundColor?: BackgroundColor;
  textColor?: TextColor;
  spinnerType?: SpinnerType;
}

interface LoadingContextType {
  showLoading: (params: ShowLoadingParams) => void;
  hideLoading: () => void;
}

interface LoadingState {
  isVisible: boolean;
  message: string;
  backgroundColor: string;
  textColor: string;
  spinnerType: string;
}

const LoadingContext = createContext<LoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LoadingState>({
    isVisible: false,
    message: '',
    backgroundColor: LOADER_CONSTANTS.BACKGROUND_COLORS.BLUE,
    textColor: LOADER_CONSTANTS.TEXT_COLORS.WHITE,
    spinnerType: LOADER_CONSTANTS.SPINNER_TYPES.BASIC
  });

  const showLoading = ({
    messageKey,
    backgroundColor = 'BLUE',
    textColor = 'WHITE',
    spinnerType = 'DOUBLE_BLOCKS'
  }: ShowLoadingParams) => {
    setState({
      isVisible: true,
      message: LOADER_CONSTANTS.LOADING_MESSAGES[messageKey].NL,
      backgroundColor: LOADER_CONSTANTS.BACKGROUND_COLORS[backgroundColor],
      textColor: LOADER_CONSTANTS.TEXT_COLORS[textColor],
      spinnerType: LOADER_CONSTANTS.SPINNER_TYPES[spinnerType]
    });
  };

  const hideLoading = () => {
    setState(prev => ({ ...prev, isVisible: false }));
  };

  const renderSpinner = () => {
    switch (state.spinnerType) {
      case LOADER_CONSTANTS.SPINNER_TYPES.DOUBLE_BLOCKS:
        return (
          <div className="double-blocks-spinner">
            <div className="cube1" />
            <div className="cube2" />
          </div>
        );
      case LOADER_CONSTANTS.SPINNER_TYPES.BOUNCY:
        return (
          <div className="bouncy-spinner">
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
          </div>
        );
      case LOADER_CONSTANTS.SPINNER_TYPES.BUBBLE:
        return (
          <div className="bubble-spinner">
            <div className="double-bounce1" />
            <div className="double-bounce2" />
          </div>
        );
      case LOADER_CONSTANTS.SPINNER_TYPES.RECT:
        return (
          <div className="rect-spinner">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`rect${i}`} />
            ))}
          </div>
        );
      default:
        return <div className={state.spinnerType} />;
    }
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {state.isVisible && (
        <div className={`loading-lib-loader ${state.backgroundColor}`}>
          <div className="loading-lib-loader-content">
            <h1 className={`loading-lib-loader-content-h1 ${state.textColor}`}>
              {state.message}
            </h1>
            {renderSpinner()}
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;