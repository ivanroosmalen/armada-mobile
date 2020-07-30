import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import { colors, fonts } from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function Cards(props) {

  _removeItem = item => {
    const { items } = props;

    let updatedItems = [];
    items.forEach(i => {
        if(i.address !== item.address) {
            updatedItems.push(i);
        }
    })

    props.onItemsUpdated(updatedItems);
  };

const {
      fontFamily,
      tagRemoveIconColor,
      tagBorderColor,
      uniqueKey,
      tagTextColor,
      items,
      displayKey
    } = props;

    parentItems = items || [];

    return parentItems.map(item => {

      return (
        <View
          style={[
            styles.selectedItem,
            {
              width: '100%',
              justifyContent: 'center',
              height: 40,
              borderColor: tagBorderColor
            }
          ]}
          key={item[uniqueKey]}
        >
          <Text
            style={[
              {
                flex: 1,
                color: tagTextColor,
                fontSize: 15
              },
              fontFamily ? { fontFamily } : {}
            ]}
            numberOfLines={1}
          >
            {item[displayKey]}
          </Text>
          <TouchableOpacity
            onPress={() => {
              _removeItem(item);
            }}
          >
            <Icon
              name="close-circle"
              style={{
                color: tagRemoveIconColor,
                fontSize: 22,
                marginLeft: 10,
                zIndex:9999,
                elevation:9999
              }}
            />
          </TouchableOpacity>
        </View>
      );
    });
}

const styles = StyleSheet.create({
  selectedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 15,
      paddingTop: 3,
      paddingRight: 3,
      paddingBottom: 3,
      margin: 3,
      borderRadius: 20,
      borderWidth: 2,
      zIndex:9999,
      elevation:9999
    },
});
