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
  NavigationEvents,
  Animated,
  RefreshControl
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';
import { RadioGroup } from '../../components';

import settings from '../../settings.js';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { translate } from '../../translations/index.js';

import AcademyElement from './AcademyElement';

export default class UserAcademiesScreen extends React.Component {

  state = {
    displayedAcademies: [],
    academyTypes: [],
    academyTypeObjs: [
        {
          key: 'student',
          displayName: translate('studentAt')
        },
        {
          key: 'instructor',
          displayName: translate('instructorAt')
        },
        {
          key: 'owner',
          displayName: translate('ownerAt')
        }
    ],
    selectedIndex: 0,
    anim: new Animated.Value(0),
    refreshing: false
  }

  async onRefresh() {
    this.setState({ refreshing: true })
    await this.getData();
    this.setState({ refreshing: false })
  }

  onSwitchType(index, type) {
    this.setState({
      displayedAcademies: this.props.userAcademies[this.props.route.params.id][type],
      selectedIndex: index
    })
  }

  async getData() {
    await this.props.getUserAcademies(this.props.route.params.id);

    let setDisplayedAcademies = false;
        this.state.academyTypeObjs.forEach(academyTypeObj => {
            if(this.props.userAcademies && this.props.userAcademies[this.props.route.params.id] && this.props.userAcademies[this.props.route.params.id][academyTypeObj.key] && this.props.userAcademies[this.props.route.params.id][academyTypeObj.key].length) {
                if(!setDisplayedAcademies) {
                    this.setState({
                        displayedAcademies: this.props.userAcademies[this.props.route.params.id][academyTypeObj.key]
                    })

                    setDisplayedAcademies = true;
                }
            }
        })
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.academyListUpdate !== this.props.academyListUpdate) {
        this.getData();
      }
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

  _getRenderItemFunction = ({ item }) => {
    return (
       <AcademyElement
            academy={item}
            key={item._id}
       />
    );
  };

  render() {
    let academyTypes = [];
    let academyTypeObjs = [];
    this.state.academyTypeObjs.forEach(academyTypeObj => {
        if(this.props.userAcademies && this.props.userAcademies[this.props.route.params.id] && this.props.userAcademies[this.props.route.params.id][academyTypeObj.key] && this.props.userAcademies[this.props.route.params.id][academyTypeObj.key].length) {
            academyTypes.push(academyTypeObj.displayName);
            academyTypeObjs.push(academyTypeObj.key);
        }
    })

    return (
        <Animated.View style={[styles.container, this.fadeIn(0, -20)]}>
            {!academyTypes.length && (
                <View>
                <Text style={styles.noData}>
                    {translate('createAcademy')}
                </Text>

                {!!this.props.loggedInUser && (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('AcademyCreate')} style={ styles.addButtonEmpty }>
                    <Icon
                        name="plus-circle"
                        style={styles.addIconEmpty}
                      />
                </TouchableOpacity>
                    )}
                </View>
            )}

            {!!academyTypes.length && (
                <View style={{flex:1}}>
                    <View style={styles.tabsContainer}>
                        <RadioGroup
                          underline
                          style={styles.radioGroup}
                          items={academyTypes}
                          selectedIndex={this.state.selectedIndex}
                          onChange={index => this.onSwitchType(index, academyTypeObjs[index])}
                        />
                    </View>

                <FlatList
                  keyExtractor={item => item._id }
                  style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
                  data={this.state.displayedAcademies}
                  renderItem={this._getRenderItemFunction}
                  refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                />

                {!!this.props.loggedInUser && (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AcademyCreate')} style={ styles.addButton }>
                        <Icon
                            name="plus-circle"
                            style={styles.addIcon}
                          />
                    </TouchableOpacity>
                )}
                </View>
            )}
          </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1
  },
  tabsContainer: {
    height: 75,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  radioGroup: {
    alignSelf: 'stretch',
    height: '100%'
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
  addIconEmpty: {
    fontSize: 35,
    backgroundColor: colors.iconBackground,
    color: colors.secondaryIcon,
    borderRadius: 20,
    alignSelf: 'center',
    overflow: 'hidden'
  },
  addButtonEmpty: {
    borderRadius: 20,
    overflow: 'hidden'
  },
  noData: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 250
  }
});
