import React from 'react'
import { AppRegistry } from 'react-native';
import {name as appName} from './app.json';
import UserList from './UserListScreen';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import HelloWorldApp from './App';
import UserDetailsScreen from './UserDetailsScreen'
import CustomMenu from './OptionsMenu';

const TabNavigator = createBottomTabNavigator({
    UserList: {
      screen: UserList,
      tabBarLabel: "Lista de Usuários"
    },
    UserDetails: {
      screen: UserDetailsScreen,
      tabBarLabel: "Detalhes do Usuário"
    }
  },
  {
    initialRouteName: 'UserList',
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray'
    },

  }
);

const AppNavigator = createStackNavigator({
  Home: {
    screen: HelloWorldApp
  },
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: () => ({
      headerRight: (
        <CustomMenu
          setMenuRef="menu"
          option1Click={() => {

          }}
        />
      )
    })
  }
  },
  {
    initialRouteName: 'Home'
  }
);

const RootNavigator = createStackNavigator({
  Home: {
    screen: AppNavigator
  },
  Modal: {
    screen: HelloWorldApp
  }
  },
  {
    headerMode: 'none',
    mode: 'modal'
  }
);

export default AppContainer = createAppContainer(RootNavigator);
AppRegistry.registerComponent(appName, () => AppContainer);
