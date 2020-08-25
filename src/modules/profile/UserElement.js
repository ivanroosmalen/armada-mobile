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

export default function UserElement(props) {
   const item = props.user || {};
   const placeholderImage = 'https://armada-user-images.s3.amazonaws.com/default/thumbnail.jpg'
   const navigation = useNavigation();

  _openProfile = user => {
    navigation.navigate('Profile', {
      id: user._id
    });
  };

  return (
    <View key={item._id} style={styles.itemOneRow}>
                <TouchableOpacity key={item._id} onPress={() => this._openProfile(item)}>
                                  <View style={styles.itemOneContainer}>
                                      <Image style={styles.avatar} source={{ uri: item.thumbnailImg || placeholderImage }} />
                                      <Text style={styles.alias} numberOfLines={1}>
                                        {item.alias}
                                      </Text>
                                  </View>
                                </TouchableOpacity>
          </View>
  );
}



const styles = StyleSheet.create({
  itemOneContainer: {
    width: 80,
    height: 100,
    justifyContent: 'center'
  },
  alias: {
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    textAlign: 'center',
    color: colors.terciaryText
  },
  itemOneRow: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 5
  },
  avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      position: 'absolute',
      top: 0
    }
});
