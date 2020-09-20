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
import { Button } from '../../components';
import { translate } from '../../translations/index.js';
import moment from 'moment'

export default function NotificationElement(props) {
   var [ expandContent, setExpandContent ] = React.useState(false);

   const item = props.notification;
   const placeholderImage = 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg'
   let height = 150;
   let editNotification = () => {
        props.broadcast(item)
   }

   let deleteNotification = () => {
        props.deleteMessage(item)
   }

   let newNotification = (moment().startOf('day') < moment(item.createdDate));

  return (
    <View key={item._id} style={[ styles.row ]}>
        <TouchableOpacity onPress={() => setExpandContent(!expandContent)}
            style={{height: props.height || (expandContent ? undefined : 100), overflow: 'hidden'}}>
            <Text style={[styles.title, {color: props.titleColor || (newNotification ? colors.quintenaryText : colors.terciaryText)}]}>
                { props.notification.academy.name }
            </Text>
            <Text style={styles.date}>
                { moment(props.notification.createdDate).format('DD MMMM YYYY') }
            </Text>
                <Text style={styles.content}>
                    { props.notification.message }
                </Text>
        </TouchableOpacity>

        {props.isOwner && (
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => editNotification()}>
                    <Text style={styles.button}>{translate('edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteNotification()}>
                    <Text style={styles.button}>{translate('delete')}</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 0
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    date: {
        fontSize: 13,
        fontStyle: 'italic',
        color: colors.quaternaryText
    },
    text: {
      fontSize: 15,
      color: colors.terciaryText
    },
    content: {
      color: colors.terciaryText,
      marginTop: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20
    },
    button: {
        marginRight: 20,
        textDecorationLine: 'underline'
    }
});
