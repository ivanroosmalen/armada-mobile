import React, { Component } from 'react';
import {
    Header,
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
 
var { height } = Dimensions.get('window');
 
var box_count = 3;
var box_height = height / box_count;
 
export default class Main extends Component {
  render() {
    return (
        <View style={styles.container}>
            <Header
              placement="left"
              leftComponent={{ icon: 'menu', color: '#fff' }}
              centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
              rightComponent={{ icon: 'home', color: '#fff' }}
            />

            <View style={[styles.box, styles.box2]}></View>
            <View style={[styles.box, styles.box3]}></View>
        </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  box: {
    height: box_height
  },
  box1: {
    backgroundColor: '#2196F3'
  },
  box2: {
    backgroundColor: '#8BC34A'
  },
  box3: {
    backgroundColor: '#e3aa1a'
  }
});