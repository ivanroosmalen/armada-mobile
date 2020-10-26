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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../translations/index.js';

export default function AcademyElement(props) {
   const item = props.academy;
   const placeholderImage = 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg'
   const navigation = useNavigation();

  _openAcademy = academy => {
    navigation.navigate('Academy', {
      id: academy._id
    });
  };

  return (

    <View key={item._id} style={styles.itemOneRow}>
                <TouchableOpacity key={item._id} onPress={() => this._openAcademy(item)}>
                                  <View style={styles.itemOneContainer}>
                                    <View style={styles.itemOneImageContainer}>
                                      <Image style={styles.itemOneImage} source={{ uri: item.profileImg || placeholderImage }} />

                                      <Text style={styles.itemOneTitle} numberOfLines={1}>
                                           {item.name}
                                      </Text>
                                    </View>
                                    <View style={styles.itemOneContent}>
                                      <Text
                                        style={styles.styles}
                                        styleName="collapsible"
                                        numberOfLines={3}
                                      >
                                        {item.martialArts.map(ma => ma.name).join(',')}
                                      </Text>
                                      <Text style={styles.members} numberOfLines={1}>
                                        {item.memberCount || 0} {translate('students')}
                                      </Text>
                                    </View>
                                  </View>
                                </TouchableOpacity>
          </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  tabsContainer: {
    alignSelf: 'stretch',
    marginTop: 30,
  },
  itemOneContainer: {
    width: Dimensions.get('window').width - 32,
    height: Dimensions.get('window').width
  },
  itemOneImageContainer: {
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    overflow: 'hidden',
  },
  itemOneImage: {
    height: Dimensions.get('window').width / 2,
    width: Dimensions.get('window').width - 32
  },
  itemOneTitle: {
    fontFamily: fonts.primaryRegular,
    fontSize: 18,
    textAlign: 'center',
    color: colors.primaryText,
    backgroundColor: colors.primaryBackgroundTransparent,
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 5,
    left: 5,
    letterSpacing: 0.04,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 13,
    overflow: 'hidden',
    height: 25
  },
  styles: {
    fontFamily: fonts.primaryRegular,
    fontSize: 13,
    color: colors.quaternaryText,
    marginVertical: 3,
  },
  members: {
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
    color: colors.terciaryText,
  },
  itemOneRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    backgroundColor: 'white',
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 3,
    height: Dimensions.get('window').width / 1.5
  },
  itemOneContent: {
    marginTop: 5,
    marginBottom: 10,
    paddingLeft: 5,
    color: colors.terciaryBackground
  }
});
