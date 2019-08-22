AppRegistry.registerComponent(appName, () => AppContainer);

import React from 'react'
import { AppRegistry } from 'react-native';
import {name as appName} from './app.json';
import UserList from './UserListScreen';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import HelloWorldApp from './App';
import UserDetailsScreen from './UserDetailsScreen'
import CustomMenu from './OptionsMenu';

const TabNavigator = createBottomTabNavigator({
    UserList: UserList,
    UserDetails: UserDetailsScreen
  },
  {
    initialRouteName: 'UserList',
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }
  }
);

const AppNavigator = createStackNavigator({
  Home: {
    screen: HelloWorldApp
  },
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: () => ({
      headerTitle: 'Visualização de Usuário',
      headerRight: (
        <CustomMenu
          setMenuRef="menu"
          option1Click={() => {alert("Logout")}}
        />
      )
    }),
  }
},
{
  initialRouteName: 'Home'
}
);

export default AppContainer = createAppContainer(AppNavigator);
