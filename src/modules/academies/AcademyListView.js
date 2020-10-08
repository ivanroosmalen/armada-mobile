import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  NavigationEvents,
  Animated,
  RefreshControl
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';
import { translate } from '../../translations/index.js';
import settings from '../../settings.js';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location'

import AcademyElement from './AcademyElement';

export default class AcademyListScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    anim: new Animated.Value(0),
    displayedAcademies: [],
    showMap: true,
    refreshable: false,
    mapLoaded: false,
    region: {},
    refreshing: false,
    academyQuery: {}
  }

  async onRefresh() {
    this.setState({ refreshing: true })
    await this.props.getAcademies('academy-list', this.state.academyQuery, {}, false);
    this.setState({ refreshing: false })
  }

  onMarkerSelect(location) {
        let selectedAcademy = this.props.academies['academy-list'].find(academy => (academy._id === location.academyId));

        this.setState({
            displayedAcademies: [selectedAcademy]
        })

        this._flatList  && this._flatList.scrollToOffset({ offset: 0, animated: false })

  }

  onMapSelect() {
        this.setState({
            displayedAcademies: this.props.academies['academy-list'],
        })

        this._flatList  && this._flatList.scrollToOffset({ offset: 0, animated: false })
  }

  showMap() {
        let newState =  {
            showMap: !this.state.showMap
        }

        if(this.state.showMap) {
            newState.displayedAcademies = this.props.academies['academy-list']
        }
        this.setState(newState)
  }

  onRegionChangeComplete(region) {
    if(!this.state.mapLoaded) {
        this.setState({
            mapLoaded: true
        })
        return;
    }

    this.setState({
        refreshable: true,
        region: region
    })
  }

  async searchAcademies() {
    let latMin = this.state.region.latitude - this.state.region.latitudeDelta / 2;
    let latMax = this.state.region.latitude + this.state.region.latitudeDelta / 2;
    let lngMin = this.state.region.longitude + this.state.region.longitudeDelta / 2;
    let lngMax = this.state.region.longitude - this.state.region.longitudeDelta / 2;
    let query = {latMin, latMax, lngMin, lngMax};
    await this.props.getAcademies('academy-list', query);

    this.setState({
        displayedAcademies: this.props.academies['academy-list'],
        refreshable: false,
        academyQuery: query
    })

    this._flatList  && this._flatList.scrollToOffset({ offset: 0, animated: false })
  }

  async componentDidMount() {
    let location = {};
    try {
        location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 1000,
        })
    } catch(e) {
    }

    location.latitude = location.latitude || settings.defaultLat;
    location.longitude = location.longitude  || settings.defaultLng

    let params = {
      currentLat: location.latitude,
      currentLng: location.longitude
    }

    await this.props.getAcademies('academy-list', params, {}, true);

    this.setState({
        location,
        displayedAcademies: this.props.academies['academy-list'],
        academyQuery: params
    })

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

      fadeIn(delay, from = 0) {
        const { anim } = this.state;
        return {
          opacity: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 1000)],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [delay, Math.min(delay + 500, 1000)],
                outputRange: [from, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        };
      }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.academyListUpdate !== this.props.academyListUpdate) {
        await this.props.getAcademies('academy-list', this.state.academyQuery, {}, false);
        this.setState({
            displayedAcademies: this.props.academies['academy-list']
        })
      }
    }

  _getRenderItemFunction = ({ item }) => {

    return (
       <AcademyElement
            academy={item}
            key={item._id}
       />

    );
  };

  render() {
    let displayedAcademies = this.state.displayedAcademies;
    let location = this.state.location;
    let locations = [];

    this.props.academies && this.props.academies['academy-list'] && this.props.academies['academy-list'].forEach(academy => {
        academy.locations && academy.locations.forEach(location => {
            if(location.geo && location.geo.coordinates && location.geo.coordinates.length) {
                location.academyName = academy.name;
                location.academyId = academy._id;
                locations.push(location);
            }
        })
    })

    return (
            <Animated.View
                    style={[styles.container, this.fadeIn(0, -20)]}
                  >
                <TouchableOpacity onPress={() => this.showMap()} style={ styles.mapButton }>
                    <Icon
                        name="map"
                        style={styles.mapIcon}
                      />
                </TouchableOpacity>
            {this.state.showMap && location && (
                <View style={styles.mapParent}>
                {this.state.refreshable && (
                <TouchableOpacity onPress={() => this.searchAcademies()} style={styles.searchButton}>
                    <Icon
                        name="autorenew"
                        style={styles.searchIcon}
                      />
                  </TouchableOpacity>
                  )}

              <MapView
                style={styles.map}
                showsPointsOfInterest={false}
                showsTraffic={false}
                initialRegion={{
                  latitude: location ? location.latitude : settings.defaultLat,
                  longitude: location ? location.longitude : settings.defaultLng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={() => {this.onMapSelect()}}
                onRegionChangeComplete={(region) => {this.onRegionChangeComplete(region)}}
              >

                {!!locations && locations.map(location => (
                    <Marker
                        coordinate={{ latitude: location.geo.coordinates[1], longitude: location.geo.coordinates[0] }}
                        title={location.academyName}
                        onPress={(e) => {e.stopPropagation(); this.onMarkerSelect(location)}}
                        onDeselect={() => {this.onMapSelect()}}
                    />

                ))}

              </MapView>
              </View>
            )}

            {!(displayedAcademies && displayedAcademies.length) && (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noData}>
                        {translate('noAcademies')}
                    </Text>
                </View>
            )}

            <View style={styles.content}>
            {!!(displayedAcademies && displayedAcademies.length) && !this.state.showMap && (
                    <FlatList
                      keyExtractor={item => item._id }
                      style={styles.list}
                      data={displayedAcademies}
                      renderItem={this._getRenderItemFunction}
                      contentContainerStyle={{}}
                      refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                    />
            )}

            {!!(displayedAcademies && displayedAcademies.length) && this.state.showMap && (
                    <FlatList
                      ref={(fl) => this._flatList = fl}
                      horizontal
                      keyExtractor={item => item._id }
                      style={styles.list}
                      data={displayedAcademies}
                      renderItem={this._getRenderItemFunction}
                      contentContainerStyle={{ paddingRight: 30 }}
                      refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                    />
            )}
            </View>

                {!!this.props.loggedInUser && (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('AcademyCreate')} style={ styles.addButton }>
                    <Icon
                        name="plus-circle"
                        style={styles.addIcon}
                      />
                </TouchableOpacity>
                )}
             </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.primaryBackground,
  },
  tabsContainer: {
    alignSelf: 'stretch',
    marginTop: 30,
  },
  itemOneContainer: {
    flex: 1,
    width: Dimensions.get('window').width / 2 - 40,
  },
  itemOneImageContainer: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  itemOneImage: {
    height: 200,
    width: Dimensions.get('window').width / 2 - 40,
  },
  itemOneTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
  },
  itemOneSubTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 13,
    color: '#B2B2B2',
    marginVertical: 3,
  },
  itemOnePrice: {
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
  },
  itemOneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderWidth:1
  },
  itemOneContent: {
    marginTop: 5,
    marginBottom: 10,
  },
  addIcon: {
    fontSize: 35,
    backgroundColor: colors.iconBackground,
    color: colors.secondaryIcon,
    borderRadius: 20
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    borderRadius: 20,
    overflow: 'hidden'
  },
  mapIcon: {
        fontSize: 40,
        zIndex: 1,
        backgroundColor: colors.iconBackground,
        color: colors.secondaryIcon,
        borderRadius: 30,
        elevation:5
  },
  mapButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 30,
    zIndex: 1,
    overflow: 'hidden'
  },
  searchIcon: {
        fontSize: 35,
        zIndex: 100,
        backgroundColor: colors.iconBackground,
        color: colors.secondaryIcon,
        borderRadius: 30,
  },
  searchButton: {
    top: 12,
    zIndex: 1,
    borderRadius: 30,
    alignSelf: 'center',
    position: 'absolute',
    overflow: 'hidden'
  },
  map: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1
  },
  mapParent: {
    flex: 1
  },
  noData: {
    fontSize: 20,
    backgroundColor: colors.secondaryBackground,
    color: colors.terciaryText,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  noDataContainer: {
      backgroundColor: colors.secondaryBackground,
      flex: 1
  },
  list: {
      backgroundColor: colors.white,
      paddingHorizontal: 15,
  },
  content: {
    height: 'auto',
    justifyContent: 'flex-end',
    backgroundColor: colors.secondaryBackground,
  }
});
