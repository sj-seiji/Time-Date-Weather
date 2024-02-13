import * as React from 'react';
import styles from './TimeWeather.module.scss';
import type { ITimeWeatherProps } from './ITimeWeatherProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import { DefaultButton, SearchBox } from '@fluentui/react';

import axios from 'axios';
import { ITimeWeatherState } from './ITimeWeatherState'; 
//import search_icon from '../assets/search.svg';


export default class TimeWeather extends React.Component<ITimeWeatherProps, ITimeWeatherState> { 
  constructor(props:ITimeWeatherProps){
    super(props);
    this.state = {
      name: "",
      temp: "",
      humidity: "",
      speed: ""
    }
  }
  private _getWeather = async () => {
    const location = 'New York';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=0052bc480848232b1920edeb67e411f4`;
    const weatherData = await axios.get(url).then((response) => { 
      console.log(response.data);
      console.log(response.data.main.temp);
      console.log(response.data.main.humidity);
      console.log(response.data.wind.speed);
      console.log(response.data.name)
      this.setState({
        name: response.data.name,
        temp: response.data.main.temp,
        humidity: response.data.main.humidity,
        speed:response.data.wind.speed
      });
    });
    console.log(weatherData);
  }

  //call function 
  public componentDidMount(): void {
    this._getWeather();
  }

  public render(): React.ReactElement<ITimeWeatherProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;
    
  
    console.log(this.state);

    return (
      <section className={`${styles.timeWeather} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <div className='container'>
            <div className='top-bar'>
              
            </div>
            <div className='name'>{this.state.name}</div>
            <div className="humidity">{this.state.humidity}</div>
            <div className="wind">{this.state.speed}</div>
            <div className="temp">{this.state.temp}</div>

            <div className='weatherImage'>
              <img src="" alt="" />
            </div>
            
            <p className='date'> Monday, Febuary 12, 2024</p>
            <div className={styles.dataContainer}>
              <div className={styles.element}>
                <img src="" alt="" />
                <div className="data">
                  <div className="humidityPercentage">64%</div>
                  <div className="text">Humidity</div>
                </div>
              </div>
              <div className= {styles.element}>
                <img src="" alt="" />
                <div className="data">
                  <div className="windRate">20 km/h</div>
                  <div className="text">Wind Speed</div>
                </div>
              </div>
            </div>

          </div>

          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
      </section>
    );
  }

}
