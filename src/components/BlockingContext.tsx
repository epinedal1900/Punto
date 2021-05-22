import React from 'react';
import { useFormikContext } from 'formik';

const BlockingContext = ({
  setIsBlocking,
}: {
  setIsBlocking: (a: boolean) => void;
}) => {
  const { dirty } = useFormikContext();

  React.useEffect(() => {
    if (dirty) {
      setIsBlocking(true);
      onbeforeunload = () => 'err';
    } else {
      setIsBlocking(false);
      onbeforeunload = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);
  return null;
};

export default BlockingContext;
