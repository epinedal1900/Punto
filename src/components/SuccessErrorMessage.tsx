import React from 'react';
import AlertMessage from './AlertMessage';

const SuccessErrorMessage = (props) => {
  const { success, message, id, viewPath, handleExit, anchorOrigin } = props;
  return (
    <>
      {success && message ? (
        <AlertMessage
          anchorOrigin={anchorOrigin}
          handleExit={handleExit}
          message={message}
          severity="success"
          viewPath={viewPath ? `${viewPath}/${id}` : null}
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
