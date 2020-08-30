import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Text
} from 'react-native';

import { fonts, colors } from '../../styles';
import { translate } from '../../translations/index.js';

export default class ContactScreen extends React.Component {

  async componentDidMount() {
  }

    render() {

           return (
             <View style={styles.container}>
                <Text style={{ marginTop: 150, paddingHorizontal: 10, fontSize: 18, textAlign: 'center' }}>
                    {translate('featureRequests')}
                </Text>

            <Text style={{marginTop: 20, paddingHorizontal: 10, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>
                    {'contact@armadama.com'}
                </Text>
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
