import React from 'react';
import Slider from './slider.tsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <Slider
        min={0}
        max={100}
        isRange={false}
        showInput ={false}
      />
    </div>
  );
}

export default App;
