import React from 'react';
import styles from './styles.scss';
import { IconGithub } from '../../components/Icons/github';

export const HomePage = () => {

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.logo}>
          React Horizontal Vertical
        </div>
        <div className={styles.icon}>
          <a href='https://github.com/wawahuy/react-horizontal-vertical' target='_blank'>
            <IconGithub />
          </a>
        </div>
      </div>
      <div className={styles.gettingScroll}>
        <div className={styles.iconScroll}></div>
        <br />
        <span className={styles.text}>
          SCROLL DOWN
        </span>
      </div>
    </div>
  )
};
