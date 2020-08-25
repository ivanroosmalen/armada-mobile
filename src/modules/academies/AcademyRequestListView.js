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
  NavigationEvents
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';

import settings from '../../settings.js';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AcademyRequestElement from './AcademyRequestElement';
import { translate } from '../../translations/index.js';

export default class AcademyRequestListScreen extends React.Component {

  state = {
  }

  async componentDidMount() {
    this.props.getAcademyRequests({ complete: false });
  }

  _getRenderItemFunction = ({ item }) => {
    return (
       <AcademyRequestElement
            academyRequest={item}
            approveAcademyRequest={this.props.approveAcademyRequest}
            key={item._id}
       />

    );
  };

  render() {
    let academyRequests = (this.props && this.props.academyRequests) || [];
    return (
        <View>
                { !academyRequests.length && (
                    <Text style={styles.noRequests}>{ translate('noRequests') }</Text>
                )}

                { !!academyRequests.length && (
                    <FlatList
                      keyExtractor={item => item._id }
                      style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
                      data={this.props.academyRequests || []}
                      renderItem={this._getRenderItemFunction}
                    />
                )}
          </View>
    );
  }
}

const styles = StyleSheet.create({
    noRequests: {
        fontSize: 20,
        textAlign: 'center'
    }
});
