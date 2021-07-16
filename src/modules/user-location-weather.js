/* eslint-disable import/no-absolute-path */
/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
import moment from 'moment';
import countryCodes from '/src/modules/country-codes.json';
import sevenDaysWeather from './seven-days-weather';

export function userLocationWeather() {
  const loader = document.querySelector('#loader');
  const main = document.querySelector('main');

  // search bar
  const search = document.querySelector('#searchButton');
  const searchInput = document.querySelector('#cityName');
  searchInput.setCustomValidity('Please enter a valid city name.');

  // locationDateTimeContainer
  const city = document.querySelector('#city');
  const country = document.querySelector('#country');
  const date = document.querySelector('#date');

  // weatherConditionContainer
  const weatherCondition = document.querySelector('#weatherCondition');
  const weatherIcon = document.querySelector('#weatherConditionIcon');
  const temp = document.querySelector('#temp');

  // weatherAttributesContainer
  const wind = document.querySelector('#wind');
  const humidity = document.querySelector('#humidity');
  const visibility = document.querySelector('#visibility');
  const sunrise = document.querySelector('#sunrise');
  const sunset = document.querySelector('#sunset');

  // sevenDaysContainer
  const sevenDaysContainer = document.querySelector('#sevenDaysContainer');

  // hide elements before loading
  function pageShow(mainSection, loaderDisp) {
    main.style.visibility = mainSection;
    loader.style.display = loaderDisp;
  }
  pageShow('hidden', 'initial');

  async function getUserWeather(cityName) {
    pageShow('hidden', 'initial');
    const name = cityName || 'Istanbul';
    // Is there any way to hide this in front end?
    const appId = 'd5db2428077b7ebfde576a15725c9156';

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${appId}&units=metric`,
        {
          mode: 'cors',
        }
      );

      const targetData = await response.json();
      const todayData = targetData.list[0];
      const list = targetData.list;

      let nextWeathers = [];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const todayName = moment(list[0].dt * 1000).format('ddd');

      // Render fetched data
      (function weatherData() {
        // locationDateTimeContainer
        city.textContent = targetData.city.name + ', ';
        country.textContent = countryCodes[targetData.city.country];
        date.textContent = `${moment().format('DD/MM/YYYY')}, ${moment().format(
          'dddd'
        )}`;

        // weatherConditionContainer
        weatherIcon.src = `https://openweathermap.org/img/wn/${todayData.weather[0].icon}@4x.png`;
        weatherCondition.textContent = todayData.weather[0].main;
        temp.textContent = `${Number.parseInt(todayData.main.temp)}°C`;

        // weatherAttributesContainer
        wind.textContent = `${Number.parseInt(todayData.wind.speed)} km/h`;
        humidity.textContent = `${todayData.main.humidity}%`;
        visibility.textContent = todayData.visibility;
        sunrise.textContent = moment(targetData.city.sunrise * 1000).format(
          'HH:mm'
        );
        sunset.textContent = moment(targetData.city.sunset * 1000).format(
          'HH:mm'
        );
      })();

      // Add next seven days weather
      (function sevenDaysForecast() {
        (function addDays() {
          let sortedDays;
          for (let i = 0; i < 7; i++) {
            if (todayName === days[i]) {
              sortedDays = days.slice(i).concat(days.slice(0, i));
            }
          }

          for (let i = 0; i < 7; i++) {
            nextWeathers.push([
              sortedDays[i],
              i !== 0
                ? list[i].weather[0].icon.replace('n', 'd')
                : list[i].weather[0].icon,
              Number.parseInt(list[i].main.temp) + '°C',
            ]);
          }
          renderDays();
        })();

        function renderDays() {
          clearDays();
          for (let i = 0; i < 7; i++) {
            sevenDaysWeather(
              nextWeathers[i][0],
              nextWeathers[i][1],
              nextWeathers[i][2]
            );
          }
          nextWeathers = [];
        }

        function clearDays() {
          if (sevenDaysContainer.hasChildNodes()) {
            sevenDaysContainer.innerHTML = '';
          }
        }
      })();

      // Show elements
      pageShow('initial', 'none');
    } catch (error) {
      if (error.name === 'TypeError') {
        // Trigger search bar required validity
        pageShow('initial', 'none');
        searchInput.reportValidity();
      } else {
        alert("Request couldn't completed, please try again later.");
        pageShow('hidden', 'initial');
      }
    }
  }

  getUserWeather();

  search.addEventListener('click', (e) => {
    if (searchInput.value === '') {
      searchInput.reportValidity();
      return;
    }
    getUserWeather(searchInput.value);
    searchInput.value = '';
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      search.click();
    }
  });
}
