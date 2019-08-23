import React from 'react';
import { Component } from 'react';
import { View, Text, TextInput, Button, Picker, ScrollView, StyleSheet, AsyncStorage, AppRegistry } from 'react-native';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationFunction, Mutation } from 'react-apollo';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import gql from "graphql-tag";

import ApolloApp from './App';

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

  render() {
    return (
      <Text>User info</Text>
    );
  }
}
