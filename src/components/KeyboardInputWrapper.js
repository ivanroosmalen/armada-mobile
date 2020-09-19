import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { colors, fonts } from '../styles';


export default function KeyboardInputWrapper(props) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {props.children}
    </TouchableWithoutFeedback>
  );
}

