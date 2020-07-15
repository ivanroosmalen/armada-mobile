import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { RadioGroup } from '../../components';

import { Button } from '../../components';
import { fonts, colors } from '../../styles';

export default class ProfileScreen extends React.Component {

  state = {
      selectedMartialArt: {},
      martialArtNames: [],
      userIsOwner: false
  }

  setMartialArt(index) {
    this.state.selectedMartialArt = this.props.user && this.props.user.martialArts && this.props.user.martialArts[index];
  }

  getStudentAcademies(martialArt = {}) {
    return martialArt.studentAcademies || [];
  }

  async componentDidMount() {
    await this.props.getUser(this.props.route.params.id);

    this.setState({
        selectedMartialArt: this.props.user && this.props.user.martialArts && this.props.user.martialArts[0]
    })

    let user = this.props.user || {}
    this.setState({ userIsOwner: user._id === this.props.loggedInUser._id });
    let martialArts = user.martialArts || [];
    this.setState({ martialArtNames: martialArts.map(ma => ma.name) });
  }

  render() {
      return (
        <View style={styles.container}>
          <ImageBackground
            resizeMode="cover"
            source={require('../../../assets/images/avatar.png')}
            style={[styles.section, styles.header]}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.title}>{this.props.user.firstName} {this.props.user.lastName}</Text>
              <View>
                <Text style={styles.position}>{this.props.user.alias}</Text>
              </View>
            </View>
                {this.state.userIsOwner && (
                    <View style={{ flexDirection: 'row' }}>
                      <Button
                        secondary
                        rounded
                        small
                        caption="Edit"
                        onPress={() => this.props.navigation.navigate('ProfileEdit', { id: this.props.loggedInUser._id })}
                      />

                    </View>
                )}

          </ImageBackground>
          <View style={styles.section}>
            <RadioGroup
              underline
              style={styles.martialArtRadio}
              items={this.state.martialArtNames}
              selectedIndex={0}
              onChange={index => this.setMartialArt(index)}
            />

            <View style={{ flex: 1 }}>
              <View style={styles.infoRow}>
                    <Text style={styles.itemLabel}>Academy</Text>
                    {this.getStudentAcademies(this.state.selectedMartialArt).map(academy =>
                        <Text>{academy.name} {academy.subcategory || ''}</Text>
                    )}
              </View>
              <View style={styles.hr} />

              <View style={styles.infoRow}>
                <Text style={styles.itemLabel}>Level </Text>
                <Text>{this.state.selectedMartialArt.level}</Text>
              </View>
              <View style={styles.hr} />
            </View>
          </View>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
    padding: 20,
  },
  section: {
    flex: 3,
    position: 'relative',
  },
  itemLabel: {
    width: 100,
    fontWeight: 'bold',
  },
  title: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 25,
    letterSpacing: 0.04,
    marginBottom: 10,
  },
  lightText: {
    color: colors.white,
  },
  quickFacts: {
    height: 60,
    flexDirection: 'row',
  },
  quickFact: {
    flex: 1,
  },
  infoSection: {
    flex: 1,
  },
  infoRow: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  hr: {
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginLeft: 20,
  },
  infoIcon: {
    marginRight: 20,
  },
  bottomRow: {
    height: 80,
    flexDirection: 'row',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  position: {
    color: colors.white,
    fontFamily: fonts.primaryLight,
    fontSize: 16,
    marginBottom: 3,
  },
  company: {
    color: colors.white,
    fontFamily: fonts.primaryRegular,
    fontSize: 16,
  },
  quickInfoItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  quickInfoText: {
    color: colors.white,
    fontFamily: fonts.primaryRegular,
  },
  bottomImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  martialArtRadio: {
    flex: 0.20
  }
});
