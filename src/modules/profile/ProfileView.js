import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioGroup } from '../../components';
import ModalDropdown from 'react-native-modal-dropdown';
import moment from 'moment';
import S3Service from '../../http/s3-service.js';
const s3Service = new S3Service();
import { translate } from '../../translations/index.js';
import Toast from 'react-native-simple-toast';

import { Button } from '../../components';
import { fonts, colors } from '../../styles';

export default class ProfileScreen extends React.Component {

  state = {
      martialArts: [],
      selectedIndex: 0,
      userIsOwner: false,
      placeholderImage: 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg',
      menuOptions: [translate('edit'), translate('updateProfileImage')],
      menuEntities: ['edit', 'updateProfileImage']
  }

  getStudentAcademies(martialArt = {}) {
    return martialArt.studentAcademies || [];
  }

  menuOptionSelected(menuEntity) {
        switch(menuEntity) {
            case 'edit':
                this.props.navigation.navigate('ProfileEdit', { id: this.props.loggedInUser._id });
            break;
            case 'updateProfileImage':
                this.selectImage();
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
            let response = await this.props.updateProfileImage(this.props.loggedInUser._id, { contentType: file.type });
            let uploadUrl = response.data.entity;

            if(uploadUrl) {
                Toast.showWithGravity(translate('imageUpload'), Toast.LONG, Toast.TOP);
                await s3Service.uploadImage(file, uploadUrl);
            }

            await this.props.getUser(this.props.route.params.id);

          }
        })
  }

  async componentDidMount() {
    await this.props.getUser(this.props.route.params.id);
    this.setState({
        userIsOwner: this.props.route.params.id === this.props.loggedInUser._id
    })
  }

  render() {
      let imageUri = (this.props.user && this.props.user.profileImg) ? this.props.user.profileImg : this.state.placeholderImage;
      let userIsOwner = this.state.userIsOwner || false;
      let user = this.props.user || {};
      return (
        <View style={styles.container}>
          <ImageBackground
            resizeMode="cover"
            source={{uri: imageUri} }
            style={[styles.section, styles.header]}
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
                            <View style={{ paddingHorizontal: 20, paddingVertical: 10, color: colors.terciaryText }}>
                              <Text>{text}</Text>
                            </View>
                          )}
                          dropdownStyle={{ height: 80 }}
                          onSelect={(index) => this.menuOptionSelected(this.state.menuEntities[index])}
                        >
                    <View>
                      <Text>
                      </Text>
                    </View>
                   </ModalDropdown>

              </View>
          )}

            {!!(user.alias || user.firstName || user.lastName) && (
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
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
                <Text style={styles.itemLabel}>{ translate('started') } </Text>
                <Text style={ styles.itemValue }>{user.martialArts[this.state.selectedIndex].startDate ? moment(user.martialArts[this.state.selectedIndex].startDate).format("MMMM YYYY") : ''}</Text>
              </View>
              <View style={styles.hr} />
            </View>
          </View>
          )}

          {!(user.martialArts && user.martialArts.length) && (
            <Text style={styles.itemLabel, styles.noData}>No profile data </Text>
          )}
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
    paddingLeft: 10,
    paddingRight: 10,
    height: 40
  },
  name: {
    color: colors.primaryText,
    fontFamily: fonts.primaryLight,
    fontSize: 16,
    marginBottom: 3,
    backgroundColor: colors.primaryBackgroundTransparent,
    alignSelf: 'flex-start',
    borderRadius: 15,
    borderColor: 'rgb(65, 131, 215)',
    paddingLeft: 10,
    paddingRight: 10,
    height: 25
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
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
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
    width: 28,
    height: 28,
    textAlign: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});
