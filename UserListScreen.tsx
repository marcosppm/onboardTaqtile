import React from 'react'
import { Component } from 'react';
import { Text, View, Image, FlatList, StyleSheet, ActivityIndicator, AppRegistry } from 'react-native';
import { ListItem } from 'react-native-elements';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider, Query } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import gql from "graphql-tag";

import ApolloApp from './App';

import { AsyncStorage } from 'react-native';

const httpLink = createHttpLink({
  uri: "https://tq-template-server-sample.herokuapp.com/graphql"
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('@Token:key');
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

    private fillUpList(data, error, loading): JSX.Element {
        return (
            loading ?
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }} >
                  <ActivityIndicator 
                    size="large"
                    color="#0000ff"
                    style={{ 
                        zIndex: 0,
                        position: 'absolute'
                    }} />
                </View>

            : error ?
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }} >
                <Text style={{ color: "#FF0000", fontSize: 25, fontWeight: 'bold' }}>
                    Erro interno do servidor
                </Text>
              </View>
            
            :
              <FlatList
                keyExtractor={this.keyExtractor}
                data={data.Users.nodes}
                renderItem={this.renderItem}
              />
        );
    }

    render() {
        return (
          <ApolloProvider client={client}>
            <Query query={ this.getUsersQuery }>
              {
                ({ data, error, loading }) => {
                  return this.fillUpList(data, error, loading);
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