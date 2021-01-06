/* eslint-disable comma-dangle */
/* eslint-disable no-case-declarations */
const initialState = { favoriteFilms: [] };

function toggleFavorite(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case 'TOGGLE_FAVORITE':
      const favoriteFilmIndex = state.favoriteFilms.findIndex(
        (item) => item.id === action.value.id
      );
      if (favoriteFilmIndex !== -1) {
        // this film is already in the favorites list
        nextState = {
          ...state,
          favoriteFilms: state.favoriteFilms.filter(
            (film, index) => index !== favoriteFilmIndex
          ),
        };
      } else {
        // adding the film to the list
        nextState = {
          ...state,
          favoriteFilms: [...state.favoriteFilms, action.value],
        };
      }
      return nextState || state;
    default:
      return state;
  }
}

export default toggleFavorite;
