import { Provider } from 'react-redux';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { colors } from './src/styles';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { store, persistor } from './src/redux/store';
import AppView from './src/modules/AppViewContainer';
import * as RNLocalize from 'react-native-localize';
import { setI18nConfig, translate } from './src/translations/index.js';
import { setTranslations } from './src/redux/users/actions';

class App extends React.Component {
  constructor(props) {
      super(props);
      let translations = setI18nConfig();
    }

 componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    SplashScreen.hide();
 }

 componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange)
 }

 handleLocalizationChange = () => {
     let translations = setI18nConfig();
 }

  render() {
      return (
            <Provider store={store}>
              <NavigationContainer>
                <PersistGate
                  loading={
                    <View style={styles.container}>
                      <ActivityIndicator color={colors.red} />
                    </View>
                  }
                  persistor={persistor}
                >
                  <AppView />
                </PersistGate>
              </NavigationContainer>
            </Provider>
      );
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
