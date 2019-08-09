AppRegistry.registerComponent(appName, () => App);

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import UserList from './UserList';
import { createStackNavigator } from 'react-navigation';

export default class reactNavigationSample extends Component {
  render() {
      const {navigation} = this.props;
    return(
        <App navigation ={navigation}/>
    );
  }
}

const SampleApp = createStackNavigator({
    Home:{screen: App},
    UserList:{screen: UserList}
});
AppRegistry.registerComponent('HelloWorldApp', () => SampleApp);
