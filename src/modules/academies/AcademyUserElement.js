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
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from 'react-native-check-box'
import MultiSelect from 'react-native-multiple-select';
import Modal from 'react-native-modal';

export default function AcademyUserElement(props) {
   var [ expandContent, setExpandContent ] = React.useState(true);
   var [ academyMember, setAcademyMember ] = React.useState(props.academyMember);
   var [ isOwner, setIsOwner ] = React.useState(props.academyMember.isOwner);
   var [ isManager, setIsManager ] = React.useState(props.academyMember.isManager);
   var [ isInstructor, setIsInstructor ] = React.useState(props.academyMember.isInstructor);
   var [ martialArts, setMartialArts ] = React.useState(props.academyMember.martialArts || []);
   var [ removeMemberDialog, setRemoveMemberDialog ] = React.useState(false);

   let userIsOwner = props.isOwner;
   let ownerIsCurrent = props.ownerIsCurrent;
   const placeholderImage = 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg'
   let navigation = useNavigation();

   const updateMember = (academyMember) => {
        setAcademyMember(academyMember);
        props.updateAcademyMembers(academyMember._id, academyMember);
   }

   const removeMember = () => {
        props.removeAcademyMembers(academyMember._id);
        setRemoveMemberDialog(false)
   }

   const onTypeCheckboxUpdate = (type, academyMember) => {
       academyMember[type] = !academyMember[type]

       switch(type) {
           case 'isOwner':
                setIsOwner(academyMember[type])
           break;
           case 'isManager':
                setIsManager(academyMember[type])
           break;
           case 'isInstructor':
                setIsInstructor(academyMember[type])
           break;
       }

       updateMember(academyMember);
   }

   const onSelectedMAs = selectedMAs => {
            academyMember.martialArts = selectedMAs;
            setMartialArts(selectedMAs)

            updateMember(academyMember);
   };

  return (
    <View style={styles.container}>
        <View style={[ styles.column, { height: (!expandContent ? undefined : 135) }  ]}>
            <TouchableOpacity onPress={() => {setExpandContent(!expandContent)}} style={ styles.column }>
                <View key={academyMember.member._id} style={[ styles.row ]}>
                    <View>
                        <Image
                            style={styles.avatar}
                            source={{ uri: academyMember.member.thumbnailImg || placeholderImage }}
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.text}>
                            {academyMember.member.alias}
                        </Text>
                        <Text style={styles.nameText}>
                            {academyMember.member.firstName || academyMember.member.lastName ? `${academyMember.member.firstName} ${academyMember.member.lastName}` : ''}
                        </Text>

                    </View>
                </View>

                <View style={styles.iconContainer}>
                    <Icon
                        name={ expandContent ? "menu-down" : "menu-up"}
                        style={{
                            fontSize: 20,
                            color: colors.secondaryIcon
                        }}
                    />
                </View>
            </TouchableOpacity>

            {!expandContent && (
                <View style={{ flexDirection: 'column' }}>

                    <View  style={{alignSelf: 'stretch'}}>
                            <MultiSelect
                              items={props.academy.martialArts}
                              uniqueKey="name"
                              onSelectedItemsChange={onSelectedMAs}
                              selectedItems={martialArts}
                              selectText={ translate('selectMartialArts') }
                              searchInputPlaceholderText={ translate('searchMartialArts') }
                              displayKey="name"
                              selectedItemTextColor={colors.quaternaryText}
                              selectedItemIconColor={colors.quaternaryText}
                              itemTextColor={colors.terciaryText}
                              searchInputStyle={{ color: colors.terciaryText }}
                              submitButtonColor={colors.terciaryText}
                              textColor={colors.terciaryText}
                              styleMainWrapper={ styles.multiSelect }
                              styleListContainer={{height: 200}}
                              styleDropdownMenuSubsection={{ backgroundColor: colors.secondaryBackground }}
                              tagRemoveIconColor={ colors.terciaryText }
                              tagBorderColor={ colors.terciaryText }
                              tagTextColor={ colors.terciaryText }
                              submitButtonText={ translate('submit') }
                            />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={styles.userType}>
                            <CheckBox
                                    onClick={() => onTypeCheckboxUpdate('isOwner', academyMember)}
                                    isChecked={isOwner}
                                    checkBoxColor={colors.terciaryText}
                                    disabled={ ownerIsCurrent }
                                />
                            <Text style={ styles.typeText }> { translate('isOwner') } {academyMember.isOwner}</Text>
                        </View>

                        <View style={styles.userType}>
                                <CheckBox
                                    onClick={() => onTypeCheckboxUpdate('isManager', academyMember)}
                                    isChecked={isManager}
                                    checkBoxColor={colors.terciaryText}
                                />
                            <Text style={ styles.typeText }> { translate('isManager') } </Text>
                        </View>

                        <View style={styles.userType}>
                                <CheckBox
                                    onClick={() => onTypeCheckboxUpdate('isInstructor', academyMember)}
                                    isChecked={isInstructor}
                                    checkBoxColor={colors.terciaryText}
                                />
                            <Text style={ styles.typeText }> { translate('isInstructor') } </Text>
                        </View>
                    </View>

                    {!ownerIsCurrent && (
                    <View style={{ marginVertical: 30 }}>
                      <Button
                            bgColor={colors.primaryBackground}
                            textColor={colors.primaryText}
                            secondary
                            rounded
                            style={{
                                width: 250,
                                alignSelf: 'center'
                             }}
                            caption={ translate('removeMember') }
                            onPress={() => setRemoveMemberDialog(true)}
                          />
                    </View>
                    )}
                </View>
            )}
            </View>

                        <Modal isVisible={removeMemberDialog} onBackdropPress={() => (setRemoveMemberDialog(false))}>
                            <View>
                              <Button
                                bgColor={colors.primaryBackground}
                                textColor={colors.primaryText}
                                secondary
                                rounded
                                small
                                style={ styles.removeMemberButton }
                                caption={ translate('confirm') }
                                onPress={() => removeMember()}
                              />

                              <Button
                                bgColor={colors.primaryBackground}
                                textColor={colors.primaryText}
                                secondary
                                rounded
                                small
                                style={ styles.removeMemberButton }
                                caption={ translate('cancel') }
                                onPress={() => setRemoveMemberDialog(false)}
                              />
                          </View>
                        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1
    },
    column: {
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: colors.secondaryBackground,
    },
    row: {
        flexDirection: 'row',
        paddingBottom: 20
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
      },
      text: {
        fontSize: 18
      },
      nameText: {
        fontSize: 14
      },
      typeText: {
        color: colors.terciaryText,
        marginRight: 20
      },
      textContainer: {
        flexDirection: 'column',
        paddingLeft: 30,
        paddingTop: 15,
        width: '100%'
      },
      iconContainer: {
        alignItems: 'center'
      },
      userType: {
        flexDirection: 'row',
        marginTop: 10
      },
  multiSelect: {
    alignSelf: 'stretch',
    width: '100%',
    zIndex: 99999
  },
  removeMemberButton: {
    width: 300,
    marginTop: 30,
    alignSelf: 'center',
  },
});
