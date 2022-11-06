import React from "react";
import ReactDOM from "react-dom/client";
import {Test} from 'react-horizontal-vertical';

export const App = () => {
  console.log('123');
  return <div>
    1123
    <Test abc={123} />
  </div>
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
