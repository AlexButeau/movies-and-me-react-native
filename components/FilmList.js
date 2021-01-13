/* eslint-disable no-use-before-define */
/* eslint-disable no-console */

import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import FilmItem from './FilmItem';

const FilmList = (props) => {
  // const [films, setFilms] = useState([]); // useless state?
  // in the props, we have a boolean, props.favoriteList, true if the list is the list of favorite films
  // loadFilms must only be called if we are in the search case and not displaying the favorite films

  const _displayDetailForFilm = (idFilm) => {
    console.log(`Display film ${idFilm}`);
    // navigate to the right component thanks to navigation
    props.navigation.navigate('FilmDetail', { idFilm });
  };

  return (
    <FlatList
      style={styles.list}
      data={props.films}
      extraData={props.favoritesFilm}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <FilmItem
          film={item}
          isFilmFavorite={
            props.favoriteFilms.findIndex((film) => film.id === item.id) !== -1
          }
          displayDetailForFilm={_displayDetailForFilm}
        />
      )}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (!props.favoritesList) {
          if (props.page < props.totalPages) {
            // calling method loadFilm from component Search to load more films
            props.loadFilms();
          }
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  favoriteFilms: state.favoriteFilms,
});

export default connect(mapStateToProps)(FilmList);
