/* eslint-disable react/destructuring-assignment */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBapi';

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    // marginTop: 30, - géré par react navigation
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5,
  },
  loading_container: {
    // flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

let page = 0;
let totalPages = 0;

const Search = (props) => {
  const [searchText, setSearchText] = useState('');
  const [filmList, setFilmList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const _loadFilms = () => {
    if (searchText.length > 0) {
      setIsLoading(true);
      getFilmsFromApiWithSearchedText(searchText, page + 1).then((data) => {
        page = data.page;
        totalPages = data.total_pages;
        setFilmList([...filmList, ...data.results]);
        setIsLoading(false);
      });
    }
  };

  const searchedTextInputChange = (text) => {
    setSearchText(text);
  };

  const displayLoading = () => {
    if (isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      );
    }
    return null;
  };

  const searchFilms = () => {
    page = 0;
    totalPages = 0;
    setFilmList([]);
    setResetDone(true);
  };

  useEffect(() => {
    if (resetDone) {
      _loadFilms();
      setResetDone(false);
    }
  }, [resetDone]);

  const displayDetailForFilm = (idFilm) => {
    console.log(`Display film for id ${idFilm}`);
    props.navigation.navigate('FilmDetail', { idFilm });
  };

  return (
    <View style={styles.main_container}>
      <TextInput
        style={styles.textinput}
        placeholder='Titre du film'
        value={searchText}
        onSubmitEditing={() => {
          searchFilms();
        }}
        onChangeText={(text) => {
          searchedTextInputChange(text);
        }}
      />
      <Button
        title='Rechercher'
        onPress={() => {
          searchFilms();
          // setSearchText('');
        }}
      />
      <FlatList
        data={filmList}
        keyExtractor={(item) => item.id.toString()}
        extraData={props.favoritesFilm}
        renderItem={({ item }) => (
          <FilmItem
            film={item}
            displayDetailForFilm={displayDetailForFilm}
            isFilmFavorite={
              // eslint-disable-next-line no-unneeded-ternary
              props.favoriteFilms.findIndex((film) => film.id === item.id) !==
              -1
                ? true
                : false
            }
          />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (page < totalPages) {
            _loadFilms();
          }
        }}
      />
      {displayLoading()}
    </View>
  );
};

const mapStateToProps = (state) => ({
  favoriteFilms: state.favoriteFilms,
});

export default connect(mapStateToProps)(Search);
