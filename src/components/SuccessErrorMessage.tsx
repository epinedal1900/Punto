import { SnackbarOrigin } from '@material-ui/core';
import React from 'react';
import AlertMessage from './AlertMessage';

interface SuccessErrorMessageProps {
  success: boolean;
  message: string | null;
  handleExit: () => void;
  anchorOrigin: SnackbarOrigin;
}
const SuccessErrorMessage = (props: SuccessErrorMessageProps): JSX.Element => {
  const { success, message, handleExit, anchorOrigin } = props;
  return (
    <>
      {success && message ? (
        <AlertMessage
          anchorOrigin={anchorOrigin}
          handleExit={handleExit}
          message={message}
          severity="success"
        />
      ) : (
        message && (
          <AlertMessage
            anchorOrigin={anchorOrigin}
            handleExit={handleExit}
            message={message}
            severity="error"
          />
        )
      )}
    </>
  );
};

export default SuccessErrorMessage;
