import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/Entypo';
import S3Service from '../../http/s3-service.js';
const s3Service = new S3Service();
import { RadioGroup, GridRow, Button } from '../../components';
import UserElement from '../profile/UserElement';

export default class AcademyScreen extends React.Component {

  state = {
      userIsOwner: false,
      placeholderImage: 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg'
  }

  async selectImage() {
        const options = {
          noData: false,
          mediaType: 'photo'
        }
        ImagePicker.showImagePicker(options, async file => {
          if (file.uri) {
            let response = await this.props.updateProfileImage(this.props.academy._id, { contentType: file.type });
            let uploadUrl = response.data.entity;

            if(uploadUrl) {
                await s3Service.uploadImage(file, uploadUrl);
            }

            await this.props.getAcademy(this.props.route.params.id);
          }
        })
  }

  async componentDidMount() {
    await Promise.all([
        this.props.getAcademy(this.props.route.params.id),
        this.props.list({academyId: this.props.route.params.id, entityType: 'class'})
    ])

    await this.setState({
        userIsOwner: !!(this.props.academy && this.props.academy.owners && this.props.academy.owners.find(owner => owner._id === this.props.loggedInUser._id))
    })
  }

  _getRenderItemFunction = ({ item }) => {

    return (
       <UserElement
            user={item}
       />

    );
  };
  render() {
      let academy = this.props.academy;
      return (
        <View style={styles.container}>
          <ImageBackground
            resizeMode="cover"
            source={{uri: (academy && academy.profileImg) ? academy.profileImg : this.state.placeholderImage} }
            style={[styles.section, styles.header]}
          >

          {this.state.userIsOwner && (
              <Icon
                style={[styles.demoIcon, { opacity: 1, position: 'absolute', top:10, right: 10 }]}
                name="camera"
                size={25}
                color="#111111"
                onPress={() => this.selectImage()}
              />
          )}

            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.title}>{academy && academy.name}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
                {this.state.userIsOwner && (

                      <Button
                        secondary
                        rounded
                        small
                        caption="Edit"
                        onPress={() => this.props.navigation.navigate('AcademyEdit', { id: this.props.academy._id })}
                      />

                )}
            </View>


          </ImageBackground>

          <View style={styles.section}>
            <ScrollView>
              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>Styles</Text>
                    <View style={styles.multilineText}>
                        {academy && academy.martialArts && academy.martialArts.map(ma =>
                        <Text style={styles.textContent}>
                             {ma.name}
                        </Text>
                        )}
                    </View>
              </View>

              <View style={styles.hr} />

              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>Next class</Text>
                    <View>
                        {!!this.props.classes && !!this.props.classes.length && (
                            <View style={styles.scheduleContent}>
                                <Text style={styles.textContent}>
                                    {'Monday'}
                                </Text>
                                <Button
                                    secondary
                                    rounded
                                    small
                                    style={{width: 150}}
                                    caption="Schedule"
                                    onPress={() => this.props.navigation.navigate('Schedule', { id: this.props.academy._id })}
                                  />
                            </View>
                        )}

                        {!this.props.classes || !this.props.classes.length && (
                            <View style={styles.scheduleContent}>
                                <Text style={styles.textContent}>
                                    {'No schedule yet'}
                                </Text>

                                {!!this.state.userIsOwner && (
                                    <Button
                                        secondary
                                        rounded
                                        small
                                        style={{width: 150}}
                                        caption="Schedule"
                                        onPress={() => this.props.navigation.navigate('Schedule', { id: this.props.academy._id })}
                                      />

                                )}

                            </View>
                        )}

                    </View>
              </View>

              <View style={styles.hr} />

              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>Locations</Text>
                    <View style={styles.multilineText}>
                    {academy && academy.locations && academy.locations.map(location => (
                        <Text style={styles.textContent}>
                            {location.address}
                        </Text>
                    ))}
                    </View>
              </View>

              <View style={styles.hr} />

              <View style={styles.userRow}>
                    <Text style={styles.itemLabel}>Instructors ({academy && academy.instructors && academy.instructors.length})</Text>

                    <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          style={ styles.imageContainer }
                          data={academy && academy.instructors}
                          renderItem={this._getRenderItemFunction}
                      />
              </View>
              <View style={styles.hr} />

              <View style={styles.userRow}>
                    <Text style={styles.itemLabel}>Students ({academy && academy.students && academy.students.length})</Text>

                    <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          style={ styles.imageContainer }
                          data={academy && academy.students}
                          renderItem={this._getRenderItemFunction}
                      />
              </View>

            </ScrollView>
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
    flex: 4,
    position: 'relative',
  },

  itemLabel: {
    width: 200,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    paddingHorizontal: 20
  },
  title: {
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
  infoRow: {
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    height: 100
  },
  expandingRow: {
    minHeight: 50,
    paddingBottom: 10
  },
  multilineText: {
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  scheduleContent: {
        paddingTop: 25,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
  },
  textContent: {
    paddingTop: 10
  },
  userRow: {
      alignItems: 'center',
      paddingHorizontal: 20,
      flexDirection: 'row',
      height: 145
    },
  hr: {
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginLeft: 20,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250
  },
  position: {
    color: colors.white,
    fontFamily: fonts.primaryLight,
    fontSize: 16,
    marginBottom: 3,
  },
  imageContainer: {
    backgroundColor: colors.white,
    marginTop: 15
  }
});

