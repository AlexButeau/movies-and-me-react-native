/* eslint-disable global-require */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBapi';

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  image: {
    height: 150,
    marginBottom: 15,
  },
  film_title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
    flex: 1,
    flexWrap: 'wrap',
  },
  film_overview: {
    fontStyle: 'italic',
    marginLeft: 5,
    marginBottom: 10,
    color: '#666666',
  },
  detail_container: {},
  details: { fontWeight: 'bold', marginLeft: 5 },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollview_container: {
    flex: 1,
  },
  favorite_container: {
    alignItems: 'center',
  },
  favorite_image: {
    width: 40,
    height: 40,
  },
  share_touchable_floatingactionbutton: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  share_image: {
    width: 30,
    height: 30,
  },
  share_touchable_headerrightbutton: {
    marginRight: 8,
  },
});

const FilmDetail = (props) => {
  const { idFilm } = props.navigation.state.params;
  // const navigation = props.navigation;
  const params = props.navigation.state.params;
  const [filmDetails, setFilmDetails] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const favoriteFilmIndex = props.favoriteFilms.findIndex(
      (item) => item.id === idFilm
    );
    if (favoriteFilmIndex !== -1) {
      // Film déjà dans nos favoris, on a déjà son détail
      // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
      setFilmDetails(props.favoriteFilms[favoriteFilmIndex]);
      return;
    }
    // else
    getFilmDetailFromApi(idFilm)
      .then((data) => {
        setFilmDetails(data);
      })
      .then(() => {
        setIsLoading(false);
      });
  }, []);

  // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
  const updateNavigationParams = () => {
    props.navigation.setParams({
      shareFilm: shareFilm,
      film: filmDetails,
    });
  };

  // Dès que le film est chargé, on met à jour les paramètres de la navigation (avec la fonction updateNavigationParams) pour afficher le bouton de partage
  useEffect(() => {
    if (filmDetails !== undefined) {
      updateNavigationParams();
    }
  }, [filmDetails]);

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

  const shareFilm = () => {
    Share.share({ title: filmDetails.title, message: filmDetails.overview });
  };

  const displayFloatingActionButton = () => {
    // this is specific to Android
    if (filmDetails !== undefined && Platform.OS === 'android') {
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => shareFilm()}
        >
          <Image
            style={styles.share_image}
            source={require('../images/ic_share.png')}
          />
        </TouchableOpacity>
      );
    }
  };
  /*   useEffect(() => {
    getFilmDetailFromApi(idFilm)
      .then((data) => {
        setFilmDetails(data);
      })
      .then(() => {
        setIsLoading(false);
      });
  }, []); */

  const toggleFavorite = () => {
    const action = { type: 'TOGGLE_FAVORITE', value: filmDetails };
    // the dispatch function comes from redux and 'sends' the action to the store
    props.dispatch(action);
  };

  const displayFavoriteImage = () => {
    let sourceImage = require('../images/ic_favorite_border.png');
    if (
      props.favoriteFilms.findIndex((item) => item.id === filmDetails.id) !== -1
    ) {
      sourceImage = require('../images/ic_favorite.png');
    }

    return <Image source={sourceImage} style={styles.favorite_image} />;
  };

  const displayFilmDetails = () => {
    if (filmDetails !== undefined) {
      return (
        <ScrollView style={styles.scrollview_container}>
          <Image
            style={styles.image}
            source={{ uri: getImageFromApi(filmDetails.backdrop_path) }}
          />
          <Text style={styles.film_title}>{filmDetails.title}</Text>
          <TouchableOpacity
            style={styles.favorite_container}
            onPress={() => toggleFavorite()}
          >
            {displayFavoriteImage()}
          </TouchableOpacity>
          <Text style={styles.film_overview}>{filmDetails.overview}</Text>

          <View style={styles.detail_container}>
            <Text style={styles.details}>
              Sorti le {moment(filmDetails.release_date).format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.details}>
              Note : {filmDetails.vote_average}
            </Text>
            <Text style={styles.details}>
              Nombre de votes : {filmDetails.vote_count}
            </Text>
            <Text style={styles.details}>
              Budget : {numeral(filmDetails.budget).format('00,000,000')}€
            </Text>
            <Text style={styles.details}>
              Genre(s) :{' '}
              {filmDetails.genres.map((genre) => genre.name).join(' / ')}
            </Text>
            <Text style={styles.details}>
              Production :{' '}
              {filmDetails.production_companies
                .map((production) => production.name)
                .join(' / ')}
            </Text>
          </View>
        </ScrollView>
      );
    }
    return null;
  };

  return (
    <View style={styles.main_container}>
      {displayFilmDetails()}
      {displayLoading()}
      {displayFloatingActionButton()}
    </View>
  );
};

const mapStateToProps = (state) => ({
  favoriteFilms: state.favoriteFilms,
});

FilmDetail.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
  if (params.film != undefined && Platform.OS === 'ios') {
    return {
      // On a besoin d'afficher une image, il faut donc passer par une Touchable une fois de plus
      headerRight: (
        <TouchableOpacity
          style={styles.share_touchable_headerrightbutton}
          onPress={() => params.shareFilm()}
        >
          <Image
            style={styles.share_image}
            source={require('../images/ic_share.png')}
          />
        </TouchableOpacity>
      ),
    };
  }
};

export default connect(mapStateToProps)(FilmDetail);
