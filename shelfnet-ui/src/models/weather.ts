export type WeatherCondition = {
  temp_C: string;
  FeelsLikeC: string;
  weatherDesc: { value: string }[];
  weatherIconUrl: { value: string }[];
  humidity: string;
  windspeedKmph: string;
};

export type WeatherResponse = {
  current_condition: WeatherCondition[];
  nearest_area?: Array<{
    areaName: { value: string }[];
    region: { value: string }[];
    country: { value: string }[];
  }>;
};

export type WeatherSummary = {
  location: string;
  temperature: number;
  description: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  icon?: string;
};
