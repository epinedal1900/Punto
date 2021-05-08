import React from 'react';
import { useFormikContext } from 'formik';

const BlockingContext = ({ setIsBlocking }) => {
  const { dirty } = useFormikContext();

  React.useEffect(() => {
    if (dirty) {
      setIsBlocking(true);
      onbeforeunload = () => "Don't leave";
    } else {
      setIsBlocking(false);
      onbeforeunload = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);
  return null;
};

export default BlockingContext;
