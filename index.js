AppRegistry.registerComponent(appName, () => AppContainer);

import { AppRegistry } from 'react-native';
import {name as appName} from './app.json';
import UserList from './UserListScreen';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import HelloWorldApp from './App';
import UserDetailsScreen from './UserDetailsScreen'

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
  Home: HelloWorldApp,
  TabNavigator: TabNavigator
},
{
  initialRouteName: 'Home'
}
);

export default AppContainer = createAppContainer(AppNavigator);
