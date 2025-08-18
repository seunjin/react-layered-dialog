import React from 'react';
import { helloWorld } from 'react-layered-dialog';

const App = () => {
  React.useEffect(() => {
    helloWorld();
  }, []);

  return <h1>Example App</h1>;
};

export default App;