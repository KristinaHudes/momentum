"use strict";

const codeTime = document.querySelector(".time");
const codeDate = document.querySelector(".date");
const codeGreeting = document.querySelector(".greeting");
const codeName = document.querySelector(".name");
const codeBody = document.querySelector("body");
const slideNext = document.querySelector(".slide--next");
const slidePrev = document.querySelector(".slide--prev");
const weatherError = document.querySelector(".weather__error");
const weatherIcon = document.querySelector(".weather__icon");
const temperature = document.querySelector(".temperature");
const descriptionContainer = document.querySelector(".description-container");
const weatherDescription = document.querySelector(".weather__description");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const codeCity = document.querySelector(".city");
const quoteButton = document.querySelector(".change-quote");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const audio = new Audio();
const playButton = document.querySelector(".play");
const playNextButton = document.querySelector(".play--next");
const playPrevButton = document.querySelector(".play--prev");
const playListContainer = document.querySelector(".play__list");
codeCity.value = "Moscow";
let randomNum;
let isPlay = false;
let playNum = 0;

/////////////////////
// TIME AND CALENDAR
/////////////////////

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  codeTime.textContent = currentTime;
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}
showTime();

function showDate() {
  const date = new Date();
  const options = {
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  const currentDate = date.toLocaleDateString("en-En", options);
  codeDate.textContent = currentDate;
}

/////////////////////
// WELCOME MESSAGE
/////////////////////

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 0 && hours < 6) {
    return "night";
  } else if (hours >= 6 && hours < 12) {
    return `morning`;
  } else if (hours >= 12 && hours < 18) {
    return `afternoon`;
  } else if (hours >= 18 && hours <= 23) {
    return `evening`;
  }
}

function showGreeting() {
  codeName.placeholder = "[Enter your name]";
  const timeOfDay = getTimeOfDay();
  codeGreeting.textContent = `Good ${timeOfDay},`;
}

function setLocalStorage() {
  localStorage.setItem("name", codeName.value);
  localStorage.setItem("city", codeCity.value);
}

window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    codeName.value = localStorage.getItem("name");
    codeCity.value = localStorage.getItem("city");
  }
}

window.addEventListener("load", getLocalStorage);

/////////////////////
// IMAGE SLIDER
/////////////////////

function getRandomNum(min = 1, max = 20) {
  randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}
getRandomNum();

function setBg() {
  const timeOfDay = getTimeOfDay();
  const bgNum = `${randomNum}`.padStart(2, "0");
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/KristinaHudes/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.webp`;
  img.onload = () => {
    codeBody.style.backgroundImage = `url(${img.src})`;
  };
}
setBg();

function getSlideNext() {
  randomNum++;
  if (randomNum > 20) {
    randomNum = 1;
  }
  setBg();
}

function getSlidePrev() {
  randomNum--;
  if (randomNum < 1) {
    randomNum = 20;
  }
  setBg();
}

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

/////////////////////
// WEATHER WIDGET
/////////////////////

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${codeCity.value}&lang=en&appid=76055500466d1ce467d2f069bbfb8a0c&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (!codeCity.value) {
    return (
      (codeCity.placeholder = "[Enter the city]"),
      (weatherError.hidden = false),
      (weatherError.textContent = `Error! The field is empty!`),
      (weatherIcon.style.display = "none"),
      (descriptionContainer.style.display = "none")
    );
  }

  if (data.cod != "200") {
    return (
      (weatherError.hidden = false),
      (weatherError.textContent = `Error! ${codeCity.value} is not found!`),
      (weatherIcon.style.display = "none"),
      (descriptionContainer.style.display = "none")
    );
  }

  weatherError.hidden = true;
  descriptionContainer.style.display = "flex";
  weatherIcon.style.display = "inline";
  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  windSpeed.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
  humidity.textContent = ` Wind speed: ${Math.round(data.wind.speed)} m/s`;
  codeCity.placeholder = "[Enter the city]";
}
getWeather();

codeCity.addEventListener("change", getWeather);

/////////////////////
// QUOTE OF THE DAY WIDGET
/////////////////////

async function getQuotes() {
  const quotes = "data.json";
  const res = await fetch(quotes);
  const data = await res.json();

  getRandomNum(1, data.length - 1);
  quote.textContent = `"${data[randomNum].text}"`;
  author.textContent = data[randomNum].author;
}
getQuotes();

quoteButton.addEventListener("click", getQuotes);

/////////////////////
// AUDIO PLAYER
/////////////////////

import playList from "./playlist.js";

function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;

  if (!isPlay) {
    isPlay = true;
    audio.play();
    highlightAudio();
  } else {
    isPlay = false;
    audio.pause();
  }

  audio.onended = () => {
    playNext();
  };
}

function highlightAudio() {
  const audiofiles = document.querySelectorAll(".play__item");

  for (let i = 0; i < audiofiles.length; i++) {
    const playItem = audiofiles[i];
    playItem.classList.remove("item--active");

    if (playNum === i) {
      playItem.classList.add("item--active");
    }
  }
}

function toggleBtn() {
  if (!isPlay) {
    playButton.classList.remove("pause");
  } else {
    playButton.classList.add("pause");
  }
}

playButton.addEventListener("click", playAudio);
playButton.addEventListener("click", toggleBtn);

function playNext() {
  isPlay = false;
  playNum++;
  if (playNum > 3) {
    playNum = 0;
  }
  playAudio();
  toggleBtn();
}

function playPrev() {
  isPlay = false;
  playNum--;
  if (playNum < 0) {
    playNum = 3;
  }
  playAudio();
  toggleBtn();
}

playNextButton.addEventListener("click", playNext);
playPrevButton.addEventListener("click", playPrev);

playList.forEach((el) => {
  const li = document.createElement("li");
  li.classList.add("play__item");
  li.textContent = el.title;
  playListContainer.append(li);
});
