import React from 'react';
import { Component } from 'react';
import { View, Text, TextInput, Button, Picker, ScrollView, StyleSheet, TouchableOpacity, AsyncStorage, AppRegistry } from 'react-native';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationFunction, Mutation } from 'react-apollo';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import gql from "graphql-tag";

import ApolloApp from './App';

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';

const httpLink: ApolloLink = createHttpLink({
  uri: "https://tq-template-server-sample.herokuapp.com/graphql"
});

const authLink: ApolloLink = setContext(async (_, { headers }) => {
  const token: string | null = await AsyncStorage.getItem('@Token:key');
  return {
    headers: {
      ...headers,
      authorization: token
    }
  }
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
AppRegistry.registerComponent('UserDetailsScreen', () => ApolloApp);

export interface UserDetailsScreenProps {
  dismissModal: any;
  navigation?: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface UserDetailsScreenState { }

export default class UserDetailsScreen extends Component<UserDetailsScreenProps, UserDetailsScreenState> {
  private mutateFunction;

  constructor(props: UserDetailsScreenProps) {
    super(props);
    this.state = { name: "", cpf: "", birthDateFormatted: "", birthDate: "", email: "", password: "", selectedRole: "",
                   userRole: null, errorMessage: "" };
  }

  mutationCreateUser = gql`
    mutation UserCreate($input: UserInput!) {
      UserCreate(data: $input) {
        id
      }
    }
  `;

  private openModalLogin = () => {
    this.props.navigation.navigate('Modal');
  }

  render() {
    return (
      <View>
        <Text>User info</Text>
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.openModalLogin}
            style={styles.addBtn}>
            <Text style={styles.btnText}>Logout</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  text: {
    paddingLeft: 10,
    color: 'black'
  },
  separator: {
    height: 0.5,
    backgroundColor: '#000000',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    padding: 10,
    marginLeft: 5,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  }
});
