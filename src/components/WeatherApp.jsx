import { useEffect, useState } from "react";
import styles from "./WeatherApp.module.scss";
import { FiWind, FiThermometer } from "react-icons/fi";
const WeatherApp = () => {
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isMs, setIsMs] = useState(false);
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const lat = "52.52";
  const long = "13.41";

  const changeFahr = (e) => setIsFahrenheit(e.target.value === "true");
  const changeMs = (e) => setIsMs(e.target.value === "true");
  useEffect(() => {
    let link = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m`;

    if (isFahrenheit) {
      link += "&temperature_unit=fahrenheit";
    }

    if (isMs) {
      link += "&wind_speed_unit=ms";
    }

    const fetchWeather = () => {
      setIsFetching(true);
      fetch(link)
        .then((res) => res.json())
        .then((d) => setData(d))
        .finally(() => setIsFetching(false));
    };

    fetchWeather();

    const id = setInterval(fetchWeather, 60000);

    return () => clearInterval(id);
  }, [isFahrenheit, isMs]);

  if (!data) {
    return <div>Loading..</div>;
  }

  return (
    <article className={styles.article}>
      <div className={styles.div1}>
        <label htmlFor="temperature">Temperature unit:</label>
        <select
          className={styles.select}
          name="temperature"
          id="temperature"
          onChange={changeFahr}
          value={isFahrenheit ? "true" : "false"}
        >
          <option value="false">C</option>
          <option value="true">F</option>
        </select>

        <label htmlFor="wind">Wind speed unit:</label>
        <select
          className={styles.select}
          id="wind"
          name="wind"
          onChange={changeMs}
          value={isMs ? "true" : "false"}
        >
          <option value="false">Km/h</option>
          <option value="true">M/s</option>
        </select>
      </div>
      <div className={styles.div2}>
        {isFetching ? (
          <p>Loading data..</p>
        ) : (
          <>
            <h3 className={styles.h3}>Current weather</h3>
            <p>
              <FiThermometer /> {data.current.temperature_2m}{" "}
              {data.current_units.temperature_2m}
            </p>
            <p>
              <FiWind /> {data.current.wind_speed_10m}{" "}
              {data.current_units.wind_speed_10m}
            </p>
          </>
        )}
      </div>
    </article>
  );
};
export default WeatherApp;
