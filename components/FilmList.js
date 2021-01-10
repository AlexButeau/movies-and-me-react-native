// Components/FilmList.js

import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import FilmItem from './FilmItem';
import { connect } from 'react-redux';

const FilmList = (props) => {
  const [films, setFilms] = useState([]); // useless state??

  const _displayDetailForFilm = (idFilm) => {
    console.log('Display film ' + idFilm);
    // navigate to the right component thanks to navigation
    props.navigation.navigate('FilmDetail', { idFilm: idFilm });
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
              ? true
              : false
          }
          displayDetailForFilm={_displayDetailForFilm}
        />
      )}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (props.page < props.totalPages) {
          // calling method loadFilm from component Search to load more films
          props.loadFilms();
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

const mapStateToProps = (state) => {
  return {
    favoriteFilms: state.favoriteFilms,
  };
};

export default connect(mapStateToProps)(FilmList);
