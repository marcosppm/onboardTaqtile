import React from 'react'
import { Component } from 'react';
import { Text, View, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';

import { AppRegistry } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, Query } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import gql from "graphql-tag";

import ApolloApp from './App';

import { AsyncStorage } from 'react-native';
import { element } from 'prop-types';

const httpLink = createHttpLink({
  uri: "https://tq-template-server-sample.herokuapp.com/graphql"
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('@Token:key');
  console.log("token: " + token);

  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

AppRegistry.registerComponent('UserList', () => ApolloApp);

export default class UserList extends Component {
    static navigationOptions = {
        title : 'Usuários Cadastrados'
    }

    list = [
        {
          username: 'Amy Farha',
          email: 'amy.farha@taqtile.com'
        },
        {
          username: 'Chris Jackson',
          email: 'chris.jackson@taqtile.com'
        }
    ];

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => (
        <ListItem
          title={
            <View style={styles.content}>
                <Text style={styles.text}>{item.name}</Text>
            </View>
          }
          subtitle={
            <View style={styles.content}>
                <Text style={styles.text}>{item.email}</Text>
            </View>
          }
        />
    )

    getUsersQuery = gql`
      query Users {
        Users {
          count,
          nodes {
            name,
            email
          },
          pageInfo {
            hasNextPage
          }
        }
      }`;

    private fillUpList(data, loading): JSX.Element {
        if (!loading) {
          console.log("dados: " + data.Users.nodes + "\r\nTotal: " + data.Users.nodes.length);
        }
        return (
          loading ?
            <ActivityIndicator 
              size="large"
              color="#0000ff"
              style={{ 
                  zIndex: 0,
                  position: 'absolute',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
              }} />

              :

            <FlatList
              keyExtractor={this.keyExtractor}
              data={data.Users.nodes}
              renderItem={this.renderItem}
            />
        );
    }

    render() {
        console.log("rendering");
        console.log(this.getUsersQuery);
        return (
          <ApolloProvider client={client}>
            <Query query={ this.getUsersQuery }>
              {
                ({ data, error, loading }) => {
                  //console.log("data: " + JSON.stringify(data) + "\r\nerror: " + JSON.stringify(error) + "\r\nloading: " + JSON.stringify(loading));
                  
                  return this.fillUpList(data,loading);
                }
              }
            </Query>
          </ApolloProvider>
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
    }
});