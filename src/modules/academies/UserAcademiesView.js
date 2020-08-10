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
import { RadioGroup } from '../../components';

import settings from '../../settings.js';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AcademyElement from './AcademyElement';

export default class UserAcademiesScreen extends React.Component {

  state = {
    displayedAcademies: [],
    academyTypes: ['Student', 'Instructor', 'owner'],
    academyTypeObjs: [
        {
          key: 'student',
          displayName: 'Student at'
        },
        {
          key: 'instructor',
          displayName: 'Instructor at'
        },
        {
          key: 'owner',
          displayName: 'Owner at'
        }
    ],
    selectedIndex: 0
  }

  onSwitchType(index) {
    this.setState({
      displayedAcademies: this.props.userAcademies[this.state.academyTypeObjs[index].key],
      selectedIndex: index
    })
  }

  async componentDidMount() {
    await this.props.getUserAcademies(this.props.route.params.id);

    let setDisplayedAcademies = false;
        this.state.academyTypeObjs.forEach(academyTypeObj => {
            if(this.props.userAcademies && this.props.userAcademies[academyTypeObj.key] && this.props.userAcademies[academyTypeObj.key].length) {
                if(!setDisplayedAcademies) {
                    this.setState({
                        displayedAcademies: this.props.userAcademies[academyTypeObj.key]
                    })

                    setDisplayedAcademies = true;
                }
            }
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
    let academyTypes = [];
    this.state.academyTypeObjs.forEach(academyTypeObj => {
        if(this.props.userAcademies && this.props.userAcademies[academyTypeObj.key] && this.props.userAcademies[academyTypeObj.key].length) {
            academyTypes.push(academyTypeObj.displayName);
        }
    })

    return (
        <View style={styles.container}>
            {!academyTypes.length && (
                <View>
                <Text style={styles.noData}>
                    {'Create your academy'}
                </Text>

                {!!this.props.loggedInUser && (
                <Icon
                    name="plus-circle"
                    style={styles.addIconEmpty}
                    onPress={() => this.props.navigation.navigate('AcademyCreate')}
                  />
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
                          onChange={index => this.onSwitchType(index)}
                        />
                    </View>

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
            )}
          </View>
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
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20
  },
  addIconEmpty: {
    fontSize: 35,
    backgroundColor: 'white',
    borderRadius: 20,
    alignSelf: 'center'
  },
  noData: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 250
  }
});
