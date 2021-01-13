/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import FilmList from './FilmList';

const Favorites = (props) => {
  console.log(props);

  return (
    <FilmList
      films={props.favoriteFilms} // component search gets films and pass them as props to FilmList
      navigation={props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
      favoritesList // true
    />
  );
};

const styles = StyleSheet.create({});

const mapStateToPropos = (state) => ({
  favoriteFilms: state.favoriteFilms,
});

export default connect(mapStateToPropos)(Favorites);
