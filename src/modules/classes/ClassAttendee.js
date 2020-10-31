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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from 'react-native-check-box'

export default function ClassAttendeeElement(props) {
   var [ academyMember, setAcademyMember ] = React.useState(props.academyMember);
   var [ attend, setAttend ] = React.useState(!!props.attendee);
   var [ attendOnline, setAttendOnline ] = React.useState(!!(props.attendee && props.attendee.online));
   var [ supportOnlineClasses, setSupportOnlineClasses ] = React.useState(props.supportOnlineClasses);

   const placeholderImage = 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg'
   let navigation = useNavigation();

   var setAttendance = (attend, attendOnline) => {
    setAttend(attend);
    setAttendOnline(attendOnline);

    attend ? props.addAttendee(academyMember, attendOnline) : props.removeAttendee(academyMember._id);
   }

  return (
    <View style={styles.container}>
        <View style={[ styles.row ]}>
                <View style={{ flexDirection: 'row' }}>
                         <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                    onClick={() => setAttendance(!attend, attendOnline)}
                                    isChecked={!!attend}
                                    checkBoxColor={colors.terciaryText}
                                />
                            <Text>{ translate('attend') }</Text>
                         </View>

                            {supportOnlineClasses && (
                            <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                                <CheckBox
                                        onClick={() => setAttendance(attend, !attendOnline)}
                                        isChecked={attendOnline}
                                        checkBoxColor={colors.terciaryText}
                                    />

                                <Text>{ translate('online') }</Text>
                            </View>
                            )}
                </View>
            <Text style={{color: colors.terciaryText, fontSize: 18, paddingLeft: 20}}>{ academyMember.member.alias }</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1
    },
    row: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.secondaryBackground,
    }
});
