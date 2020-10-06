import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Text,
  Linking,
  Clipboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fonts, colors } from '../../styles';
import { translate } from '../../translations/index.js';

export default class ContactScreen extends React.Component {

  async componentDidMount() {
  }

  copyEmail() {
    Clipboard.setString('contact@armadama.com');
  }

    render() {

           return (
             <View style={styles.container}>
                <Text style={{ marginTop: 150, paddingHorizontal: 10, fontSize: 18, textAlign: 'center' }}>
                    {translate('featureRequests')}
                </Text>

                    <TouchableOpacity style={{flexDirection: 'row', marginTop: 20, justifyContent: 'center'}} onPress={() => this.copyEmail()}>
                        <Text style={{paddingHorizontal: 10, fontSize: 18, textAlign: 'center' }} textBreakStrategy="simple">
                            {'contact@armadama.com'}
                        </Text>
                        <Icon
                          name="content-copy"
                          style={{
                            fontSize: 20,
                            color: colors.secondaryIcon
                          }}
                        />
                    </TouchableOpacity>

             <TouchableOpacity onPress={() => Linking.openURL('http://armada-app.com/privacy-policy')}>
                <Text style={{marginTop: 20, paddingHorizontal: 10, fontSize: 18, textAlign: 'center', textDecorationLine: 'underline'}}>
                    {translate('privacyPolicy')}
                </Text>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => Linking.openURL('http://armada-app.com/terms-and-conditions')}>
                <Text style={{marginTop: 20, paddingHorizontal: 10, fontSize: 18, textAlign: 'center', textDecorationLine: 'underline' }}>
                    {translate('tac')}
                </Text>
             </TouchableOpacity>

             </View>
           );
         }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  }
});
