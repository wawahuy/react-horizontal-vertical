import React, { useMemo } from 'react';
import ReactDOM from "react-dom/client";
import { Rhv, ReactFromModule } from 'react-horizontal-vertical';
import './styles.scss'
import { BrowserRouter, Switch, Route, Link, NavLink } from 'react-router-dom';
import { TutorialPage } from './pages/Tutorial';
import { BasicPage } from './pages/Basic';
import { HomePage } from './pages/Home';

console.log('React instance:', React === ReactFromModule);

export const App = () => {
  return (
    <BrowserRouter>
      <Rhv>
        <HomePage />
        <TutorialPage />
        <BasicPage />
      </Rhv>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
