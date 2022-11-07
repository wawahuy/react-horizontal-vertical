import React from "react";
import ReactDOM from "react-dom/client";
import { Rhv, ReactFromModule } from 'react-horizontal-vertical';

console.log('Check React Instance:', React === ReactFromModule);

export const App = () => {
  return (
    <div>
      <Rhv>Hello 1</Rhv>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
