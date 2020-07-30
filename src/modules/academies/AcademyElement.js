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
                                    </View>
                                    <View style={styles.itemOneContent}>
                                      <Text style={styles.itemOneTitle} numberOfLines={1}>
                                        {item.name}
                                      </Text>
                                      <Text
                                        style={styles.itemOneSubTitle}
                                        styleName="collapsible"
                                        numberOfLines={3}
                                      >
                                        {item.martialArts.map(ma => ma.name).join(',')}
                                      </Text>
                                      <Text style={styles.itemOnePrice} numberOfLines={1}>
                                        {item.students.length} {'students'}
                                      </Text>
                                    </View>
                                  </View>
                                </TouchableOpacity>
          </View>
  );
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
    width: Dimensions.get('window').width - 40,
  },
  itemOneImageContainer: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  itemOneImage: {
    height: 200,
    width: Dimensions.get('window').width - 40,
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
});
