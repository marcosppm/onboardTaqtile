// IMPORTANT: Do not change import order.
// If you're using any plugin to sort import, remember to disable before saving this file

/* tslint:disable:ordered-imports */
import 'reflect-metadata';
// Polyfill for Symbol needed on Android and iOS < 9.0
import 'es6-symbol/implement';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import { App, configApp } from '@app';

import { AppRegistry } from 'react-native';
import Config from 'react-native-config';

/* tslint:enable:ordered-imports */

configApp(Config);
const EntryPoints = {
  app: App,
};

AppRegistry.registerComponent('App', () => EntryPoints[Config.ENTRYPOINT] || App);
