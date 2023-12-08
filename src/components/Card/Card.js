import React from 'react';
import styles from './Card.module.css';
import iconArrowUpGreen from '../../icons/arrow_up_green.png';
import iconArrowDownRed from '../../icons/arrow_down_red.png';
import iconEgalSign from '../../icons/egal_sign.png';

export default function Card(props) {
      return (
            <div className={styles.card}>
                  <p>
                        Code Sandre : <b></b>
                        {props.code}
                  </p>
                  <p>
                        Commune : <b>{props.commune}</b>
                  </p>
                  <p>
                        Localisation : <b>{props.localisation}</b>
                  </p>
                  <h3>Températures</h3>
                  <div className={styles.cardTemperatures}>
                        <p>
                              <b>Minimale</b> <br />
                              {props.minTemp}°{' '}
                              <img
                                    src={iconArrowDownRed}
                                    alt="arrow down red"
                              />
                        </p>
                        <p>
                              <b>Moyenne</b> <br />
                              {props.avgTemp}°{' '}
                              <img src={iconEgalSign} alt="egal sign" />
                        </p>
                        <p>
                              <b>Maximale</b> <br />
                              {props.maxTemp}°{' '}
                              <img
                                    src={iconArrowUpGreen}
                                    alt="arrow up green"
                              />
                        </p>
                  </div>
            </div>
      );
}
