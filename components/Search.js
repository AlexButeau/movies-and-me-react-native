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
  /* FlatList, */
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import FilmList from './FilmList';
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

  return (
    <View style={styles.main_container}>
      <TextInput
        style={styles.textinput}
        placeholder='Titre du film'
        onChangeText={(text) => searchedTextInputChange(text)}
        onSubmitEditing={() => searchFilms()}
      />
      <Button title='Rechercher' onPress={() => searchFilms()} />
      <FilmList
        films={filmList} // component search gets films and pass them as props to FilmList
        navigation={props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
        loadFilms={_loadFilms} // again, the Search component handles getting more films from the API when needed
        page={page}
        totalPages={totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
      />
      {displayLoading()}
    </View>

    // <View style={styles.main_container}>
    //   <TextInput
    //     style={styles.textinput}
    //     placeholder='Titre du film'
    //     value={searchText}
    //     onSubmitEditing={() => {
    //       searchFilms();
    //     }}
    //     onChangeText={(text) => {
    //       searchedTextInputChange(text);
    //     }}
    //   />
    //   <Button
    //     title='Rechercher'
    //     onPress={() => {
    //       searchFilms();
    //       // setSearchText('');
    //     }}
    //   />
    //   <FlatList
    //     data={filmList}
    //     keyExtractor={(item) => item.id.toString()}
    //     extraData={props.favoritesFilm}
    //     renderItem={({ item }) => (
    //       <FilmItem
    //         film={item}
    //         displayDetailForFilm={displayDetailForFilm}
    //         isFilmFavorite={
    //           // eslint-disable-next-line no-unneeded-ternary
    //           props.favoriteFilms.findIndex((film) => film.id === item.id) !==
    //           -1
    //             ? true
    //             : false
    //         }
    //       />
    //     )}
    //     onEndReachedThreshold={0.5}
    //     onEndReached={() => {
    //       if (page < totalPages) {
    //         _loadFilms();
    //       }
    //     }}
    //   />
    //   {displayLoading()}
    // </View>
  );
};

const mapStateToProps = (state) => ({
  favoriteFilms: state.favoriteFilms,
});

export default connect(mapStateToProps)(Search);

// // Components/Search.js

// import React from 'react'
// import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator } from 'react-native'
// import FilmItem from './FilmItem'
// import FilmList from './FilmList'
// import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'

// class Search extends React.Component {

//   constructor(props) {
//     super(props)
//     this.searchedText = ""
//     this.page = 0
//     this.totalPages = 0
//     this.state = {
//       films: [],
//       isLoading: false
//     }
//   }

//   _loadFilms() {
//     if (this.searchedText.length > 0) {
//       this.setState({ isLoading: true })
//       getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
//           this.page = data.page
//           this.totalPages = data.total_pages
//           this.setState({
//             films: [ ...this.state.films, ...data.results ],
//             isLoading: false
//           })
//       })
//     }
//   }

//   _searchTextInputChanged(text) {
//     this.searchedText = text
//   }

//   _searchFilms() {
//     this.page = 0
//     this.totalPages = 0
//     this.setState({
//       films: [],
//     }, () => {
//         this._loadFilms()
//     })
//   }

//   _displayLoading() {
//     if (this.state.isLoading) {
//       return (
//         <View style={styles.loading_container}>
//           <ActivityIndicator size='large' />
//         </View>
//       )
//     }
//   }

//   render() {
//     return (
//       <View style={styles.main_container}>
//         <TextInput
//           style={styles.textinput}
//           placeholder='Titre du film'
//           onChangeText={(text) => this._searchTextInputChanged(text)}
//           onSubmitEditing={() => this._searchFilms()}
//         />
//         <Button title='Rechercher' onPress={() => this._searchFilms()}/>
//         <FilmList
//           films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
//           navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
//           loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
//           page={this.page}
//           totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
//         />
//         {this._displayLoading()}
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   main_container: {
//     flex: 1
//   },
//   textinput: {
//     marginLeft: 5,
//     marginRight: 5,
//     height: 50,
//     borderColor: '#000000',
//     borderWidth: 1,
//     paddingLeft: 5
//   },
//   loading_container: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 100,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// })

// export default Search
