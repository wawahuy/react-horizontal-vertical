import React, { useMemo } from 'react';
import ReactDOM from "react-dom/client";
import { Rhv, ReactFromModule } from 'react-horizontal-vertical';
import './styles.scss'
import { BrowserRouter, Switch, Route, Link, NavLink } from 'react-router-dom';
import { TutorialPage } from './pages/Tutorial';
import { BasicPage } from './pages/Basic';
import { HomePage } from './pages/Home';

console.log('React instance:', React === ReactFromModule);

const config = [
  {
    name: 'Tutorial',
    path: '/',
    component: <TutorialPage />
  },
  {
    name: 'Basic',
    path: '/basic',
    component: <BasicPage />
  },
]

export const App = () => {
  // const navbar = useMemo(() => {
  //   return config.map((item, index) =>
  //     <li key={'menu_l_' + index}>
  //       <NavLink to={item.path} activeClassName={styles.active} exact>
  //         {item.name}
  //       </NavLink>
  //     </li>
  //   )
  // }, [])

  // const switchNode = useMemo(() => {
  //   return config.map((item, index) =>
  //      <Route exact path={item.path} key={'menu_s_' + index}>
  //        {item.component}
  //      </Route>
  //   )
  // }, []);

  // return (
  //   <BrowserRouter>
  //     <header>
  //       React Horizontal Vertical
  //     </header>
  //     <div className={styles.container}>
  //       <ul className={styles.menu}>
  //         {navbar}
  //       </ul>
  //       <div className={styles.content}>
  //         <Switch>
  //           {switchNode}
  //         </Switch>
  //       </div>
  //     </div>
  //   </BrowserRouter>
  // )

  return (
    <BrowserRouter>
      <Rhv>
        <HomePage />
        <BasicPage />
        <TutorialPage />
      </Rhv>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
