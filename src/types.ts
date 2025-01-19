export interface Openweather {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: Current
  minutely: Minutely[]
  hourly: Current[]
  daily: Daily[]
  currentTime: number
}

export interface Current {
  dt: number
  currentTime: number
  sunrise?: number
  sunset?: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: Weather[]
  pop?: number
  rain?: Rain
}

export interface Rain {
  '1h': number
}

export interface Weather {
  id: number
  main: Main
  description: Description
  icon: Icon
}

export enum Description {
  LightRain = 'light rain',
  ModerateRain = 'moderate rain',
  OvercastClouds = 'overcast clouds',
}

export enum Icon {
  The04D = '04d',
  The04N = '04n',
  The10D = '10d',
  The10N = '10n',
}

export enum Main {
  Clouds = 'Clouds',
  Rain = 'Rain',
}

export interface Daily {
  dt: number
  sunrise: number
  sunset: number
  moonrise: number
  moonset: number
  moon_phase: number
  summary: string
  temp: Temp
  feels_like: FeelsLike
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: Weather[]
  clouds: number
  pop: number
  rain: number
  uvi: number
}

export interface FeelsLike {
  day: number
  night: number
  eve: number
  morn: number
}

export interface Temp {
  day: number
  min: number
  max: number
  night: number
  eve: number
  morn: number
}

export interface Minutely {
  dt: number
  precipitation: number
}
