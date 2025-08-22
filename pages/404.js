// pages/404.js
import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import styles from '../styles/404.module.css';
import { Adsense } from '@ctrl/react-adsense';

const NotFoundPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="404 - Page Not Found" />
        <meta name="keywords" content="404 - Page Not Found"/>
      </Head>
      <div className="sites-card">
    <br/>
    <br/>
      <div className={styles.container}>
        <h1>404 - Page Not Found</h1><br/>
        {/* <p>Sorry, there is no content available to view here.</p> */}
        <p>
          Take advantage of our amazing application by using the search box or the links below to explore further.
        </p>
        <br/>
        <div className={styles.links}>
          <Link href='/football-predictions-today' className={styles.link}>
            Predictions for Today
          </Link>
          <Link href='/football-predictions-tomorrow' className={styles.link}>
            Predictions for Tomorrow
          </Link>
          <Link href='/football-predictions-yesterday' className={styles.link}>
          Predictions for Yesterday
          </Link>
        </div>
      </div>
      <br/>
      <br/>
      <Adsense
          client="ca-pub-5665711413000284"
          slot="7856848919"
          style={{ display: "block" }}
          layout="display"
          format="auto"
      /> 
      </div>
    </React.Fragment>
  );
};

export default NotFoundPage;