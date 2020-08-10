import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/Entypo';
import { RadioGroup } from '../../components';
import moment from 'moment';
import S3Service from '../../http/s3-service.js';
const s3Service = new S3Service();

import { Button } from '../../components';
import { fonts, colors } from '../../styles';

export default class ProfileScreen extends React.Component {

  state = {
      martialArts: [],
      selectedIndex: 0,
      userIsOwner: false,
      placeholderImage: 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg'
  }

  getStudentAcademies(martialArt = {}) {
    return martialArt.studentAcademies || [];
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
              <Icon
                style={[styles.demoIcon, { opacity: 1, position: 'absolute', top:10, right: 10 }]}
                name="camera"
                size={25}
                color="#111111"
                onPress={() => this.selectImage()}
              />
          )}

            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.alias}>{user.alias}</Text>
              <View>
                <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
              </View>
            </View>

                {userIsOwner && (
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
          {!!(user.martialArts && user.martialArts.length) && (
          <View style={styles.section}>
            <RadioGroup
              underline
              style={styles.martialArtRadio}
              items={user.martialArts.map(ma => ma.name)}
              selectedIndex={this.state.selectedIndex}
              onChange={index => this.setState({selectedIndex: index})}
            />

            <View style={{ flex: 1 }}>
              <View style={styles.infoRow}>
                    <Text style={styles.itemLabel}>Academy</Text>
                    {this.getStudentAcademies(user.martialArts[this.state.selectedIndex]).map(academy =>
                        <Text key={academy._id}>{academy.name} {academy.subcategory || ''}</Text>
                    )}
              </View>
              <View style={styles.hr} />

              <View style={styles.infoRow}>
                <Text style={styles.itemLabel}>Level </Text>
                <Text>{user.martialArts[this.state.selectedIndex].level}</Text>
              </View>
              <View style={styles.hr} />

              <View style={styles.infoRow}>
                <Text style={styles.itemLabel}>Started </Text>
                <Text>{user.martialArts[this.state.selectedIndex].startDate ? moment(user.martialArts[this.state.selectedIndex].startDate).format("MMMM YYYY") : ''}</Text>
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
    width: 100,
    fontWeight: 'bold',
  },
  alias: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 25,
    letterSpacing: 0.04,
    marginBottom: 10,
    backgroundColor: 'rgba(65, 131, 215, 0.6)',
    alignSelf: 'flex-start',
    borderRadius: 15,
    borderColor: 'rgb(65, 131, 215)',
    paddingLeft: 10,
    paddingRight: 10,
    height: 40
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
    height: 250,
  },
  name: {
    color: colors.white,
    fontFamily: fonts.primaryLight,
    fontSize: 16,
    marginBottom: 3,
    backgroundColor: 'rgba(65, 131, 215, 0.6)',
    alignSelf: 'flex-start',
    borderRadius: 15,
    borderColor: 'rgb(65, 131, 215)',
    paddingLeft: 10,
    paddingRight: 10,
    height: 25
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
  }
});
