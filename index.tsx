import React from 'react'
import { AppRegistry, Modal, Text } from 'react-native';
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
            HelloWorldApp.showModal = true;
            console.log("HelloWorldApp.showModal = true");
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

export default AppContainer = createAppContainer(AppNavigator);
AppRegistry.registerComponent(appName, () => AppContainer);
