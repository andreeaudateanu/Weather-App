const PEXELS_API_KEY = "";
const OPENWEATHER_API_KEY = "";
const rootElement = document.getElementById('root');

let spinner = document.createElement('div');
spinner.id = 'spinner';
rootElement.appendChild(spinner);
spinner.setAttribute('hidden', '');

let favorites;

let forecastCardsContainer;

document.addEventListener('DOMContentLoaded', function () {
    weather = {
        apiKey: "1a20b4367198f1da28381a9982a1f20f",
        fetchWeather: function (lat, long, days) {
            fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&cnt=${days * 8}&appid=${this.apiKey}`
            )
                .then(response => response.json())
                .then(data => this.displayWeather(data));
        },
          displayWeather: function (data) {
              const { city, list } = data;
      
              const currentWeather = list[0];
      
              if (currentWeather) {
                  const { icon, description } = currentWeather.weather[0];
                  const { temp, humidity} = currentWeather.main;
                  const { wind } =currentWeather;
                  document.querySelector(".temp").innerText = temp + "°C";
                  document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
                  document.querySelector(".description").innerText = description;
                  document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
      
                  if (wind && wind.speed) {
                      document.querySelector(".wind").innerText = `Wind speed: ${wind.speed} m/s`;
                  } else {
                      document.querySelector(".wind").innerText = "Wind speed data not available";
                  }
              }
      
              const forecastCardsContainer = document.querySelector('.cards');
              forecastCardsContainer.innerHTML = '';
      
              for (let i = 8; i < list.length; i += 8) {
                  const forecastData = list[i];
                  if (forecastData) {
                      const { dt_txt, main, weather, wind } = forecastData;
                      const date = new Date(dt_txt).toLocaleDateString();
      
                      const forecastCard = document.createElement('div');
                      forecastCard.className = 'next';
      
                      const dateElement = document.createElement('h5');
                      dateElement.className = 'date';
                      dateElement.innerText = date;
                      forecastCard.appendChild(dateElement);
      
                      const tempElement = document.createElement('h3');
                      tempElement.className = 'temp';
                      tempElement.innerText = `${main.temp}°C`;
                      forecastCard.appendChild(tempElement);
      
                      const flexContainer = document.createElement('div');
                      flexContainer.className = 'flex';
      
                      const iconElement = document.createElement('img');
                      iconElement.src = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
                      iconElement.alt = '';
                      iconElement.className = 'icon';
                      flexContainer.appendChild(iconElement);
      
                      const descriptionElement = document.createElement('div');
                      descriptionElement.className = 'description';
                      descriptionElement.innerText = weather[0].description;
                      flexContainer.appendChild(descriptionElement);
      
                      forecastCard.appendChild(flexContainer);
      
                      const humidityElement = document.createElement('div');
                      humidityElement.className = 'humidity';
                      humidityElement.innerText = `Humidity: ${main.humidity}%`;
                      forecastCard.appendChild(humidityElement);
      
                      if (wind && wind.speed) {
                          const windElement = document.createElement('div');
                          windElement.className = 'wind';
                          windElement.innerText = `Wind speed: ${wind.speed} m/s`;
                          forecastCard.appendChild(windElement);
                      } else {
                          const windElement = document.createElement('div');
                          windElement.className = 'wind';
                          windElement.innerText = "Wind speed data not available";
                          forecastCard.appendChild(windElement);
                      }
      
                      forecastCardsContainer.appendChild(forecastCard);
                  }
              }
              weatherContainer.style.display = 'block';
              forecastHeading.style.display = 'block'; 
              spinner.setAttribute('hidden', '');
          }
      };
      

    const cardContainer = document.createElement('div');
    cardContainer.className = 'card';
    rootElement.appendChild(cardContainer);

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search';
    cardContainer.appendChild(searchContainer);

    const searchButton = document.createElement('button');
    searchButton.id = 'searchButton';
    searchButton.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg>';
    searchButton.addEventListener('click', () => {
        loadData();
    });
    searchContainer.appendChild(searchButton);

    const cityInput = document.createElement('input');
    cityInput.type = 'text';
    cityInput.id = 'cityInput';
    cityInput.placeholder = 'Enter city name';
    searchContainer.appendChild(cityInput);

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'suggestionsContainer';
    cardContainer.appendChild(suggestionsContainer);

    const weatherContainer = document.createElement('div');
    weatherContainer.className = 'weather loading';
    cardContainer.appendChild(weatherContainer);

    const todayContainer = document.createElement('div');
    todayContainer.className = 'today';
    weatherContainer.appendChild(todayContainer);

    
    const Fav = document.createElement('div');
    Fav.className = 'Fav';
    todayContainer.appendChild(Fav);

    const favoriteButton = document.createElement('button');
    favoriteButton.id = 'favoriteButton';
    favoriteButton.addEventListener('click', toggleFavorite);
    Fav.appendChild(favoriteButton);

    const heartIcon = document.createElement('i');
    heartIcon.id = 'heartIcon';
    heartIcon.className = 'fa-solid fa-heart';
    favoriteButton.appendChild(heartIcon);

    const showFavoritesButton = document.createElement('button');
    showFavoritesButton.id = 'showFavoritesButton';
    showFavoritesButton.textContent = 'Show Favorites';
    showFavoritesButton.addEventListener('click', showFavoritesList);
    Fav.appendChild(showFavoritesButton);

    const favoritesListContainer = document.createElement('ul');
    favoritesListContainer.id = 'favoritesListContainer';
    favoritesListContainer.style.display = 'none';
    todayContainer.appendChild(favoritesListContainer);

    const cityHeading = document.createElement('h2');
    cityHeading.className = 'cityHeading';
    todayContainer.appendChild(cityHeading);

    const forecastHeading = document.createElement('h5');
    forecastHeading.className = 'forecast';
    forecastHeading.textContent = '5-Day Forecast';
    weatherContainer.appendChild(forecastHeading);

    const tempHeading = document.createElement('h1');
    tempHeading.className = 'temp';
    todayContainer.appendChild(tempHeading);

    const flexDiv = document.createElement('div');
    flexDiv.className = 'flex';
    todayContainer.appendChild(flexDiv);

    const iconImage = document.createElement('img');
    iconImage.className = 'icon';
    flexDiv.appendChild(iconImage);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'description';
    flexDiv.appendChild(descriptionDiv);

    const humidityDiv = document.createElement('div');
    humidityDiv.className = 'humidity';
    todayContainer.appendChild(humidityDiv);

    const windDiv = document.createElement('div');
    windDiv.className = 'wind';
    todayContainer.appendChild(windDiv);

    const containerDiv = document.createElement('div');
    containerDiv.className = 'container';
    weatherContainer.appendChild(containerDiv);

    const forecastCardsContainer = document.createElement('div');
    forecastCardsContainer.className = 'cards';
    forecastCardsContainer.id = 'forecastCards';
    containerDiv.appendChild(forecastCardsContainer);

    weatherContainer.style.display = 'none';
    forecastHeading.style.display = 'none'; 
    

    cityInput.addEventListener('input', debounce(handleInput, 300));

    function createWeatherAppStructure() {
        
        const forecastData = [
            { date: "12 November", temp: "51°C", icon: "https://openweathermap.org/img/wn/04n.png", description: "Cloudy", humidity: "60%", wind: "6.2 km/h" },
            { date: "12 November", temp: "51°C", icon: "https://openweathermap.org/img/wn/04n.png", description: "Cloudy", humidity: "60%", wind: "6.2 km/h" },
            { date: "12 November", temp: "51°C", icon: "https://openweathermap.org/img/wn/04n.png", description: "Cloudy", humidity: "60%", wind: "6.2 km/h" },
            { date: "12 November", temp: "51°C", icon: "https://openweathermap.org/img/wn/04n.png", description: "Cloudy", humidity: "60%", wind: "6.2 km/h" },
            
        ];

        forecastData.forEach(day => {
            const forecastDayContainer = document.createElement("div");
            forecastDayContainer.className = "next";
      
            const forecastDate = document.createElement("h5");
            forecastDate.className = "date";
            forecastDate.textContent = day.date;
      
            const forecastTemp = document.createElement("h3");
            forecastTemp.className = "temp";
            forecastTemp.textContent = day.temp;
      
            const forecastFlexContainer = document.createElement("div");
            forecastFlexContainer.className = "flex";
      
            const forecastIcon = document.createElement("img");
            forecastIcon.src = day.icon;
            forecastIcon.alt = "";
            forecastIcon.className = "icon";
      
            const forecastDescription = document.createElement("div");
            forecastDescription.className = "description";
            forecastDescription.textContent = day.description;
      
            const forecastHumidity = document.createElement("div");
            forecastHumidity.className = "humidity";
            forecastHumidity.textContent = `Humidity: ${day.humidity}`;
      
            const forecastWind = document.createElement("div");
            forecastWind.className = "wind";
            forecastWind.textContent = `Wind speed: ${day.wind}`;
      
            forecastFlexContainer.appendChild(forecastIcon);
            forecastFlexContainer.appendChild(forecastDescription);
      
            forecastDayContainer.appendChild(forecastDate);
            forecastDayContainer.appendChild(forecastTemp);
            forecastDayContainer.appendChild(forecastFlexContainer);
            forecastDayContainer.appendChild(forecastHumidity);
            forecastDayContainer.appendChild(forecastWind);
      
            forecastCardsContainer.appendChild(forecastDayContainer);
        });
    }

    function debounce(func, delay) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
    }

    async function handleInput() {
        const inputValue = cityInput.value.trim();

        if (inputValue.length >= 3) {
            try {
                const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=`);
                const data = await response.json();

                if (data.features) {
                    const cities = data.features.map(feature => feature.properties.formatted);
                    displaySuggestions(cities);
                }
            } catch (error) {
                console.error('Error fetching city suggestions:', error);
                clearSuggestions();
            }
        } else {
            clearSuggestions();
        }
    }

    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';

        suggestions.forEach(city => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestionItem';
            suggestionItem.textContent = city;

            suggestionItem.addEventListener('click', () => {
                cityInput.value = city;
                clearSuggestions();
                loadData(city);
                getWeatherData(city);
            });

            suggestionsContainer.appendChild(suggestionItem);
        });

        suggestionsContainer.style.display = 'block';
    }

    function clearSuggestions() {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
    }


    favoritesListContainer.style.display = 'block';

    window.fetchWeatherData = function (city) {
        city=city.trim();
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const { coord } = data; 
                if (coord && coord.lat) {
                    
                    weather.fetchWeather(coord.lat, coord.lon, 5);
                } else {
                    console.error('Latitude not available in the API response:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching city coordinates:', error);
            });

            const showFavoritesButton = document.getElementById('showFavoritesButton');
            showFavoritesButton.addEventListener('click', showFavoritesList);
        };
    window.getWeatherData = function (city) {
        fetchWeatherData(city);
        document.querySelector(".cityHeading").innerText = "Weather in " + city;
        const favoriteButton = document.getElementById('favoriteButton');
        favoriteButton.classList.toggle('red-heart', favorites.includes(city));
    };

    function setBackgroundImage(city) {
        const query = encodeURIComponent(city);
        const pexelsEndpoint = `https://api.pexels.com/v1/search?query=${query}`;

        spinner.removeAttribute('hidden');

        fetch(pexelsEndpoint, {
            headers: {
                Authorization: PEXELS_API_KEY,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Pexels API error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const imageUrl = data.photos[0]?.src?.original;

                if (imageUrl) {
                    document.body.style.backgroundImage = `url(${imageUrl})`;
                    document.body.style.backgroundSize = 'cover';
                } else {
                    console.error(`Image not found for ${city}`);
                }
            })
            .catch(error => {
                console.error('Error fetching image from Pexels:', error);
            })
            .finally(() => {
                spinner.setAttribute('hidden', '');
            });
    }

    function updateHeartIcon(city) {
        const heartIcon = document.getElementById('heartIcon');
        heartIcon.style.color = favorites.includes(city) ? '#ff0000' : '';
    }

    window.loadData=function(city) {
        const cityInput = city || document.getElementById('cityInput').value.trim();

        if (cityInput) {
            spinner.removeAttribute('hidden');

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityInput)}&units=metric&appid=`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    spinner.setAttribute('hidden', '');
                    setBackgroundImage(city);
                    if (data.coord && data.coord.lat) {
                        weather.fetchWeather(data.coord.lat, data.coord.lon, 5);
                        updateHeartIcon(cityInput);
                        createWeatherAppStructure();
                        if (document.getElementById('showFavoritesButton').classList.contains('active')) {
                            showFavoritesList();
                        }
                    } else {
                        console.error('Latitude not available in the API response:', data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    spinner.setAttribute('hidden', '');
                });
        } else {
            console.error('City input is empty');
        }
    }


    favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function toggleFavorite() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();
        const heartIcon = document.getElementById('heartIcon');

        if (city && !favorites.includes(city)) {
            favorites.push(city);
            heartIcon.style.color = '#ff0000'; 
        } else if (favorites.includes(city)) {
            favorites = favorites.filter(fav => fav !== city);
            heartIcon.style.color = ''; 
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesList();
    }

    function showFavoritesList() {
        const favoritesListContainer = document.getElementById('favoritesListContainer');
        favoritesListContainer.style.display = (favoritesListContainer.style.display === 'block') ? 'none' : 'block';

        if (favoritesListContainer.style.display === 'block') {
            favoritesListContainer.innerHTML = '';

            favorites.forEach(city => {
                const listItem = document.createElement('li');
                listItem.textContent = city;
                listItem.addEventListener('click', () => {
                    heartIcon.style.color = '#ff0000';
                    loadData(city);
                    window.getWeatherData(city);
                    clearSuggestions();
                });
                favoritesListContainer.appendChild(listItem);
            });
        }
    }

    function updateFavoritesList() {
        const favoritesListContainer = document.getElementById('favoritesListContainer');
        const heartIcon = document.getElementById('heartIcon');
        favoritesListContainer.innerHTML = '';
        favorites.forEach(city => {
            const listItem = document.createElement('li');
            listItem.textContent = city;
            listItem.addEventListener('click', () => {
                heartIcon.style.color = '#ff0000';
                cityInput.value = city;
                loadData(city);
                getWeatherData(city);
                clearSuggestions();
            });
            favoritesListContainer.appendChild(listItem);
        });
    }

    showFavoritesButton.addEventListener('click', showFavoritesList);
    favoriteButton.addEventListener('click', toggleFavorite);
});
