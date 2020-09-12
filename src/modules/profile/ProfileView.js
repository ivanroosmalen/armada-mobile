import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioGroup } from '../../components';
import ModalDropdown from 'react-native-modal-dropdown';
import moment from 'moment';
import S3Service from '../../http/s3-service.js';
const s3Service = new S3Service();
import { translate } from '../../translations/index.js';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button } from '../../components';
import { fonts, colors } from '../../styles';

export default class ProfileScreen extends React.Component {

  state = {
      martialArts: [],
      selectedIndex: 0,
      userIsOwner: false,
      placeholderImage: 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg',
      menuOptions: [translate('edit'), translate('updateProfileImage')],
      menuEntities: ['edit', 'updateProfileImage'],
      spinner: false,
      user: {},
      anim: new Animated.Value(0),
  }

  getStudentAcademies(martialArt = {}) {
    return martialArt.studentAcademies || [];
  }

  menuOptionSelected(menuEntity) {
        this.optionsMenu.hide();

        switch(menuEntity) {
            case 'edit':
                this.props.navigation.navigate('ProfileEdit', { id: this.props.loggedInUser._id });
            break;
            case 'updateProfileImage':
                setTimeout(() => {
                    this.selectImage();
                }, 500)
            break;
        }
  }

  async selectImage() {
        const options = {
          noData: false,
          mediaType: 'photo'
        }
        ImagePicker.showImagePicker(options, async file => {
          if (file.uri) {
            this.setState({ spinner: true })
            let response = await this.props.updateProfileImage(this.props.loggedInUser._id, { contentType: file.type });
            let uploadUrl = response.data.entity;

            if(uploadUrl) {
                await s3Service.uploadImage(file, uploadUrl);
            }

            await this.props.getUser(this.props.route.params.id);
            this.setState({ spinner: false })
          }
        })
  }

  async componentDidMount() {
    this.setState({
        user: {}
    })
    await this.props.getUser(this.props.route.params.id);
    this.setState({
        userIsOwner: this.props.loggedInUser && (this.props.route.params.id === this.props.loggedInUser._id),
        user: this.props.user
    })

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.user !== this.props.user) {
        this.setState({
            user: this.props.user
        })
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

      getDuration(startDate) {
        if(!startDate) {
            return '';
        }

        let diff = moment.duration(moment().diff(moment(startDate)))
        let years = parseInt(diff.asYears())
        if(years > 0) {
            return `${years} years`
        } else {
            let months = parseInt(diff.asMonths())
            return `${months} months`
        }
      }

  render() {
      let imageUri = (this.state.user && this.state.user.profileImg) ? this.state.user.profileImg : this.state.placeholderImage;
      let userIsOwner = this.state.userIsOwner || false;
      let user = this.state.user || {};

      return (
        <Animated.View style={[styles.container, this.fadeIn(0, -20)]}>
            <Spinner
              visible={this.state.spinner}
              textContent={translate('loading')}
              textStyle={{color: colors.quaternaryText}}
            />
          <ImageBackground
            resizeMode="cover"
            source={{uri: imageUri} }
            style={styles.backgroundImage}
          >

          {userIsOwner && (
              <View style={ styles.optionsMenu }>
                  <TouchableOpacity onPress={() => this.optionsMenu.show()}>
                      <Icon
                        name="dots-horizontal"
                        size={25}
                        color={colors.secondaryIcon}
                      />
                  </TouchableOpacity>

                  <ModalDropdown ref={(el) => {this.optionsMenu = el}}
                          options={ this.state.menuOptions }
                          renderRow={text => (
                            <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.primaryBackground }}>
                              <Text style={{color: colors.primaryText}}>{text}</Text>
                            </View>
                          )}
                          dropdownStyle={{ height: 80 }}
                          onSelect={(index) => this.menuOptionSelected(this.state.menuEntities[index])}
                          renderSeparator={() => (<View></View>)}
                        >
                    <View>
                      <Text>
                      </Text>
                    </View>
                   </ModalDropdown>

              </View>
          )}

            {!!(user.alias || user.firstName || user.lastName) && (
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20, paddingLeft: 20 }}>
              <Text style={styles.alias}>{user.alias}</Text>

              {(user.firstName || user.lastName) && (
              <View>
                <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
              </View>
              )}
            </View>
            )}

          </ImageBackground>
          {!!(user.martialArts && user.martialArts.length) && (
          <View style={styles.section}>
            <RadioGroup
              underline
              style={styles.martialArtRadio}
              items={user.martialArts.map(ma => ma.name)}
              selectedIndex={this.state.selectedIndex}
              onChange={index => this.setState({selectedIndex: index})}
            />

            <View style={{ flex: 1, backgroundColor: colors.secondaryBackground }}>


              <View style={styles.infoRow}>
                <Text style={styles.itemLabel}>{ translate('level') } </Text>
                <Text style={ styles.itemValue }>{user.martialArts[this.state.selectedIndex].level}</Text>
              </View>
              <View style={styles.hr} />

              <View style={styles.infoRow}>
                <Text style={styles.itemLabel}>{ translate('trainingSince') } </Text>
                <Text style={ styles.itemValue }>{ this.getDuration(user.martialArts[this.state.selectedIndex].startDate) }</Text>
              </View>
              <View style={styles.hr} />
            </View>
          </View>
          )}

          {!(user.martialArts && user.martialArts.length) && (
            <Text style={styles.itemLabel, styles.noData}>No profile data </Text>
          )}
        </Animated.View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    height: 300
  },
  section: {
    flex: 3,
    position: 'relative',
  },
  backgroundImage: {
    height: Dimensions.get('window').width / 1.5
  },
  itemLabel: {
    width: 200,
    fontWeight: 'bold',
    color: colors.terciaryText,
    top: 10,
    left: 20,
    position: 'absolute'
  },
  itemValue: {
    color: colors.black,
  },
  alias: {
    color: colors.primaryText,
    fontFamily: fonts.primaryBold,
    fontSize: 25,
    letterSpacing: 0.04,
    marginBottom: 10,
    backgroundColor: colors.primaryBackgroundTransparent,
    alignSelf: 'flex-start',
    borderRadius: 15,
    overflow: 'hidden',
    paddingLeft: 10,
    paddingRight: 10,
    height: 35
  },
  name: {
    color: colors.primaryText,
    fontFamily: fonts.primaryLight,
    fontSize: 16,
    marginBottom: 3,
    backgroundColor: colors.primaryBackgroundTransparent,
    alignSelf: 'flex-start',
    borderRadius: 15,
    overflow: 'hidden',
    paddingLeft: 10,
    paddingRight: 10,
    height: 23
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
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'center'
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
  },
  noData: {
    height: 400
  },
  optionsMenu: {
    opacity: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    color: colors.secondaryIcon,
    backgroundColor: colors.iconBackground,
    borderRadius: 30,
    borderColor: colors.secondaryIcon,
    borderWidth: 1,
    width: 28,
    height: 28,
    textAlign: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});
