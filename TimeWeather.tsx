import * as React from 'react';
import styles from './TimeWeather.module.scss';
import type { ITimeWeatherProps } from './ITimeWeatherProps';
//import { escape } from '@microsoft/sp-lodash-subset';
//import { DefaultButton, SearchBox } from '@fluentui/react';

import axios from 'axios';
import { ITimeWeatherState } from './ITimeWeatherState';

//images

export default class TimeWeather extends React.Component<ITimeWeatherProps, ITimeWeatherState> {
  constructor(props: ITimeWeatherProps) {
    super(props);
    this.state = {
      name: "",
      temp: 0,
      humidity: "", 
      speed: "",
      highTemp: 0,
      lowTemp: 0,
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date().toLocaleTimeString(),
      locationInput: "",
      location: "New York", 
      feelsLike: 0
    }
  }
  private _getWeather = async () => {
    const { location } = this.state;
    //const location = "New York"


    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=0052bc480848232b1920edeb67e411f4`;
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
        speed: response.data.wind.speed,
        highTemp: response.data.main.temp_max,
        lowTemp: response.data.main.temp_min,
        feelsLike: response.data.main.feels_like
      });
    });
    console.log(weatherData);
  }

  //handle the input search and button event 
  private handleLocationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({locationInput: event.target.value});
  }
  private handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // to prevent some default behavior 
    const{ locationInput } = this.state;
    this.setState({location: locationInput}, () => {
      this._getWeather();
    });
  }


  //call the function
  public componentDidMount(): void {
    this._getWeather();
    setInterval(() => {
      this.setState({
        currentDate: new Date().toLocaleDateString(),
        currentTime: new Date().toLocaleTimeString()
      });
    }, 1000);
    
  }

  public render(): React.ReactElement<ITimeWeatherProps> {
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName,
    // } = this.props;


    // console.log(this.state);

    return (
      <div className={styles.timeWeather}>
        <div className={styles.welcome}>

          <div className={styles.topBar}>
            <input type="text"
            value={this.state.locationInput}
            onChange={this.handleLocationInputChange}
            placeholder='Enter Location'
            />
            <button onClick={this.handleSearch}>Search</button>
          </div>
            
          {/* <img className={styles.weatherImage} src={require('../assets/temp.svg')} alt="" /> */}
          <div className={styles.temperature}>{Math.round(this.state.temp)}°F</div>
            
            
          <div className={styles.highLowTemp}>
            <div>H: {Math.round(this.state.highTemp)}°F | L: {Math.round(this.state.lowTemp)}°F </div>
          </div>
          <div className={styles.weatherLocation}>{this.state.name}</div>

          <div className={styles.timedate}>
            <div className="currentDate">Time: {this.state.currentTime}</div>
            <div className={styles.currentTime}>Date: {this.state.currentDate}</div>
          </div>
            

          <div className={styles.dataContainer}>
          <div className={styles.element}>
              <img src={require('../assets/temp.svg')} alt="" className={styles.icon}/>
              <div className={styles.data}>
                <div className="feelsLike">{Math.round(this.state.feelsLike)}%</div>
                <div className={styles.text}>Feels Like</div>
              </div>
            </div>
            <div className={styles.element}>
              <img src={require('../assets/humidity.svg')} alt="" className={styles.icon}/>
              <div className={styles.data}>
                <div className="humidity">{this.state.humidity}%</div>
                <div className={styles.text}>Humidity</div>
              </div>
            </div>
            <div className={styles.element}>
              <img src={require('../assets/wind1.svg')} alt="" className={styles.icon}/>
              <div className={styles.data}>
                <div className="wind">{this.state.speed} m/s</div>
                <div className={styles.text}>Wind Speed</div>
              </div>
            </div>
          </div>

          {/* <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div> */}
        </div>
      </div>
    );
  }

}
