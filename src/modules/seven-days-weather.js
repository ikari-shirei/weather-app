/* eslint-disable space-before-function-paren */

// sevenDaysContainer
function sevenDaysWeather(dayName, icon, temp) {
  const sevenDaysContainer = document.querySelector('#sevenDaysContainer');

  const sevenDays = document.createElement('div');
  sevenDays.classList.add('seven-days');

  const weekDay = document.createElement('div');
  weekDay.classList.add('week-day');
  weekDay.textContent = dayName;
  sevenDays.appendChild(weekDay);

  const sevenDaysIcon = document.createElement('img');
  sevenDaysIcon.classList.add('seven-days-icon');
  sevenDaysIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  sevenDays.appendChild(sevenDaysIcon);

  const sevenDaysTemp = document.createElement('div');
  sevenDaysTemp.classList.add('seven-days-temp');
  sevenDaysTemp.textContent = temp;
  sevenDays.appendChild(sevenDaysTemp);

  sevenDaysContainer.appendChild(sevenDays);
}

export default sevenDaysWeather;
