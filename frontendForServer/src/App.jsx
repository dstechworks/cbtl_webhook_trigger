import React, { useEffect, useState } from 'react';
import TwoLineText from './components/TwoLineText';

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('http://64.227.136.248:3013/getBirthdayName')
      .then(response => response.json())
      .then(data => {
        if (data.name) {
          setText(data.name);
        } else {
          setText("HAPPY BIRTHDAY CBTL");
        }
      })
      .catch(error => {
        console.error('Error fetching birthday name:', error);
        setText('HAPPY BIRTHDAY CBTL');
      });
  }, []);

  return (
    <div>
      <TwoLineText text={text} />
    </div>
  );
}

export default App;
