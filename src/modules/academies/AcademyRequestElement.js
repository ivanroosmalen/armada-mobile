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

export default function AcademyRequestElement(props) {
   const item = props.academyRequest;
   const placeholderImage = 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg'
   let navigation = useNavigation();

   approveRequest = (approved) => {
        props.approveAcademyRequest(item._id, { approved })
   }

   denyRequest = (item) => {
        navigation.navigate('Class', { id: item.entityId, academyId: item.academyId, startDate: item.startDate, endDate: item.endDate })
   }

  return (
    <View key={item._id} style={styles.row}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile', {id: item.user._id})}>
                    <Image
                      style={styles.avatar}
                      source={{ uri: item.user.thumbnailImg || placeholderImage }}
                    />
                </TouchableOpacity>
        <View style={styles.textContainer}>
            <Text style={styles.text}>
                {item.user.alias} ({item.user.firstName} {item.user.lastName}) { translate('wantsToJoin') } {item.academy.name}
            </Text>

            <View style={styles.buttonContainer}>
                      <Button
                        secondary
                        rounded
                        small
                        bgColor={ colors.primaryBackground }
                        textColor={ colors.primaryText }
                        caption={ translate('approve') }
                        onPress={ () => this.approveRequest(true) }
                      />

                      <Button
                        secondary
                        rounded
                        small
                        bgColor={ colors.primaryBackground }
                        textColor={ colors.primaryText }
                        caption={ translate('decline') }
                        onPress={ () => this.approveRequest(false) }
                      />
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 65,
        backgroundColor: colors.secondaryBackground
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
      },
      text: {
        fontSize: 15
      },
      textContainer: {
        flexDirection: 'column',
        paddingLeft: 15,
        width: '100%'
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
      }
});
