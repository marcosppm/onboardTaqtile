import React from 'react'
import { Component } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, AppRegistry, AsyncStorage, ListRenderItem } from 'react-native';
import { ListItem } from 'react-native-elements';

import { ApolloClient, ApolloError } from 'apollo-client';
import { ApolloProvider, Query, QueryResult, OperationVariables } from 'react-apollo';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink, HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import gql from "graphql-tag";

import ApolloApp from './App';

const httpLink: ApolloLink = createHttpLink({
  uri: "https://tq-template-server-sample.herokuapp.com/graphql"
});

const authLink: ApolloLink = setContext(async (_, { headers }) => {
  const token: string = await AsyncStorage.getItem('@Token:key');
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
AppRegistry.registerComponent('UserList', () => ApolloApp);

interface User {
  id: string;
  name: string;
  email: string;
}

interface Users {
  count: number;
  nodes: User[];
}

interface Response {
  Users: Users;
}

export default class UserList extends Component {
    static navigationOptions = {
        title : 'Usuários Cadastrados'
    }

    private keyExtractor = (item: User): string => item.id;

    private renderItem = ({item} : {item: User}): JSX.Element => (
          <ListItem
            key={ item.id }
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
    );

    getUsersQuery = gql`
      query Users {
        Users {
          count,
          nodes {
            id,
            name,
            email
          }
        }
      }`;

    private fillUpList(data: Response, error: ApolloError, loading: boolean): JSX.Element {
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
                ({ data, error, loading }: QueryResult<Response, OperationVariables>) => {
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