import { ChakraProvider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import TextSelectionHistory from '~/components/TextSelectionHistory';

const App = () => {
  const [startTime, setStartTime] = useState(Date.now());
  useEffect(() => {
    const timeout = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('setting start time');
      setStartTime(Date.now() - 8000);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <ChakraProvider>
      <TextSelectionHistory totalDuration={50000} startTime={startTime} />
    </ChakraProvider>
  );
};

export default App;
