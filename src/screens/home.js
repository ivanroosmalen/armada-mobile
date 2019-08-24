import React from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux';


class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello from Home screen.</Text>
        <Button
          onPress={() => this.props.navigation.navigate('SignUp')}
          title="Sign up"
        />
        <Button
          onPress={() => this.props.navigation.navigate('Login')}
          title="Login"
        />
        <Button
          onPress={() => this.props.navigation.navigate('CreateAcademy')}
          title="CreateAcademy"
        />
      </View>
    )
  }
}


function mapStateToProps(state, props) {
    return {
    }
}


//Connect everything
export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})