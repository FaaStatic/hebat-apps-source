import { showMessage } from 'react-native-flash-message';

export const MessageUtil = {
  successMessage: (message, description = '') => {
    showMessage({
      message: message,
      description: description,
      type: 'success',
      color: '#FFFFFF',
      icon: 'success',
    });
  },
  errorMessage: (message, description = '') => {
    showMessage({
      message: message,
      description: description,
      type: 'danger',
      color: '#FFFFFF',
      icon: 'danger',
    });
  },
  warningMessage: (message, description = '') => {
    showMessage({
      message: message,
      description: description,
      type: 'warning',
      color: '#FFFFFF',
      icon: 'warning',
    });
  },
};
