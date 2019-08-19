AppRegistry.registerComponent(appName, () => AppContainer);

import { AppRegistry } from 'react-native';
import HelloWorldApp from './App';
import {name as appName} from './app.json';
import UserList from './UserListScreen';
import AddUserScreen from './AddUserScreen';
import { createStackNavigator, createAppContainer, NavigationContainer } from 'react-navigation';

const AppNavigator = createStackNavigator({
    Home: HelloWorldApp,
    UserList: UserList,
    AddUser: AddUserScreen
  },
  {
    initialRouteName: 'Home'
  }
);
export default AppContainer = createAppContainer(AppNavigator);
