/* eslint-disable global-require */
/* eslint-disable arrow-body-style */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getImageFromApi } from '../API/TMDBapi';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  main_container: { height: 190, flexDirection: 'row' },
  image: {
    width: 120,
    height: 180,
    margin: 5,
  },
  content: {
    flex: 1,
    margin: 5,
  },
  header: {
    flexDirection: 'row',
    flex: 3,
    alignItems: 'center',
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5,
  },
  vote_text: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#666666',
  },
  description: {
    flex: 7,
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
  },
  date: {
    flex: 1,
  },
  date_text: {
    textAlign: 'right',
    fontSize: 14,
  },
  favorite_image: {
    height: 20,
    width: 20,
    marginRight: 5,
    marginTop: 2,
  },
});

const FilmItem = ({ film, displayDetailForFilm, isFilmFavorite }) => {
  const displayFavorite = () => {
    const sourceImage = require('../images/ic_favorite.png');
    if (isFilmFavorite) {
      return <Image source={sourceImage} style={styles.favorite_image} />;
    }

    return null;
  };

  return (
    <TouchableOpacity
      onPress={() => displayDetailForFilm(film.id)}
      style={styles.main_container}
    >
      <Image
        style={styles.image}
        source={{ uri: getImageFromApi(film.poster_path) }}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          {displayFavorite()}
          <Text style={styles.title_text}>{film.title}</Text>
          <Text style={styles.vote_text}>{film.vote_average}</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.description_text} numberOfLines={6}>
            {film.overview}
          </Text>
        </View>
        <View style={styles.date}>
          <Text style={styles.date_text}>Sorti le {film.release_date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FilmItem;
