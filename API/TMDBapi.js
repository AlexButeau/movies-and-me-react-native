/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

export const getFilmsFromApiWithSearchedText = (text, page) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_TOKEN}&language=fr&query=${text}&page=${page}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export const getImageFromApi = (name) =>
  `https://image.tmdb.org/t/p/w300${name}`;

export const getFilmDetailFromApi = (filmId) => {
  const url = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${API_TOKEN}&language=fr`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
};
