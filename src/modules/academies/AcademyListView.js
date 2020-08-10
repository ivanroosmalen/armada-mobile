import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  NavigationEvents
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';

import settings from '../../settings.js';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location'

import AcademyElement from './AcademyElement';

export default class AcademyListScreen extends React.Component {

  state = {
    displayedAcademies: [],
    showMap: true,
    refreshable: false,
    mapLoaded: false,
    region: {}
  }

  onMarkerSelect(location) {

        let selectedAcademy = this.props.academies.find(academy => (academy._id === location.academyId));
        this.setState({
            displayedAcademies: [ selectedAcademy ]
        })

  }

  onMapSelect() {
        this.setState({
            displayedAcademies: this.props.academies,
        })
  }

  showMap() {
        let newState =  {
            showMap: !this.state.showMap
        }

        if(this.state.showMap) {
            newState.displayedAcademies = this.props.academies
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

    await this.props.getAcademies({latMin, latMax, lngMin, lngMax});

    this.setState({
        displayedAcademies: this.props.academies
    })

    this.setState({
      refreshable: false
    })
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

    await this.props.getAcademies(params);

    this.setState({
        location,
        displayedAcademies: this.props.academies
    })
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
    let location = this.state.location;
    let locations = [];
    this.props.academies && this.props.academies.forEach(academy => {
        academy.locations && academy.locations.forEach(location => {
            if(location.geo && location.geo.coordinates && location.geo.coordinates.length) {
                location.academyName = academy.name;
                location.academyId = academy._id;
                locations.push(location);
            }
        })
    })

    return (
        <View style={styles.container}>
                <Icon
                    name="map"
                    style={styles.mapIcon}
                    onPress={() => this.showMap()}
                  />
            {this.state.showMap && (
                <View>
                {this.state.refreshable && (
                <Icon
                    name="autorenew"
                    style={styles.searchButton}
                    onPress={() => this.searchAcademies()}
                  />
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
                        onPress={() => {this.onMarkerSelect(location)}}
                        onDeselect={() => {this.onMapSelect()}}
                    />

                ))}

              </MapView>
              </View>
            )}

                <FlatList
                  keyExtractor={item => item._id }
                  style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
                  data={this.state.displayedAcademies}
                  renderItem={this._getRenderItemFunction}
                />

                {!!this.props.loggedInUser && (
                <Icon
                    name="plus-circle"
                    style={styles.addIcon}
                    onPress={() => this.props.navigation.navigate('AcademyCreate')}
                  />
                )}
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    justifyContent: 'space-around',
    marginTop: 10,
    borderWidth:1
  },
  itemOneContent: {
    marginTop: 5,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: colors.labelTwo,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addIcon: {
    fontSize: 35,
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20
  },
  mapIcon: {
        fontSize: 35,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 20
  },
  searchButton: {
        fontSize: 35,
        position: 'absolute',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        borderRadius: 20,
        alignSelf: 'center'
  },
  map: {
    height: 300,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});
