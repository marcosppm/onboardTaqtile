import React from 'react';
import { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import { Icon } from 'react-native-elements'

interface CustomMenuProps {
  setMenuRef: string,
  option1Click: Function
}

interface CustomMenuState { }

export default class CustomMenu extends Component<CustomMenuProps, CustomMenuState> {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  showMenu = () => {
    this._menu.show();
  };

  hideMenu = () => {
    this._menu.hide();
  };

  option1Click = () => {
    this._menu.hide();
    this.props.option1Click();
  };

  render() {
    return (
      <Menu
        ref={this.setMenuRef}
        button={
          <TouchableOpacity onPress={this.showMenu} style={{marginRight: 10}}>
          <Icon
              name='menu'
              type='feather'
              color='#000000'
            />
          </TouchableOpacity>
        }>
        <MenuItem onPress={this.option1Click}>Logout</MenuItem>
      </Menu>
    );
  }
}
