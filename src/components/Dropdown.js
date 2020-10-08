import React from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';

import { View, Text } from 'react-native';

import { colors, fonts } from '../styles';

class RNSDropDown extends React.Component {
  static defaultProps = {
    placeholder: 'Please Select...',
    selectedIndex: -1,
    color: colors.primary,
    borderColor: colors.primary,
  };

  state = {
    isOpened: false,
  };

  _openModal = () => {
    this.setState({ isOpened: true });
  };

  _closeModal = () => {
    this.setState({ isOpened: false });
  };

  render() {
    const {
      items,
      color,
      fontSize,
      onSelect,
      style,
      borderColor,
      listBackgroundColor,
      listTextColor,
      selectedIndex,
      placeholder,
    } = this.props;
    return (
      <ModalDropdown
        options={items}
        onDropdownWillShow={this._openModal}
        onDropdownWillHide={this._closeModal}
        dropdownStyle={{
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 5,
          shadowOpacity: 1.0,
          backgroundColor: colors.secondaryBackground
        }}
        adjustFrame={params => {
          // eslint-disable-next-line no-param-reassign
          params.left = 0;
          // eslint-disable-next-line no-param-reassign
          params.right = 0;
          return params;
        }}
        renderRow={text => (
          <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: listBackgroundColor }}>
            <Text style={{ color: listTextColor ? listTextColor : colors.terciaryText }}>{text}</Text>
          </View>
        )}
        onSelect={onSelect}
      >
        <View style={[styles.container, style && style, { borderBottomColor: borderColor ? borderColor : colors.primaryText }]}>
          <Text style={{ color, fontFamily: fonts.primaryRegular, fontSize }}>
            {selectedIndex > -1 && items[selectedIndex]
              ? items[selectedIndex]
              : placeholder}
          </Text>
          <Icon
            name={this.state.isOpened ? 'angle-up' : 'angle-down'}
            color={color}
            size={20}
            style={styles.icon}
          />
        </View>
      </ModalDropdown>
    );
  }
}

const styles = {
  container: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryText,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    flexDirection: 'row',
    borderRadius: 5,
    fontFamily: fonts.primaryRegular
  },
  icon: {
    marginLeft: 10,
  },
};

export default RNSDropDown;
