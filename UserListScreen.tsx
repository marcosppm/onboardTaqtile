import React from 'react'
import { Component } from 'react';
import { Text, View, FlatList, Modal, StyleSheet, ActivityIndicator, AsyncStorage, AppRegistry, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

import { ApolloClient, ApolloError } from 'apollo-client';
import { ApolloProvider, Query, QueryResult, OperationVariables } from 'react-apollo';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import gql from "graphql-tag";

import ApolloApp from './App';
import AddUserScreen from './AddUserScreen';

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
AppRegistry.registerComponent('UserList', () => ApolloApp);

interface User {
  id: string;
  name: string;
  email: string;
}

interface PageInfo {
  hasNextPage: boolean;
}

interface Users {
  nodes: User[];
  pageInfo: PageInfo;
}

interface Response {
  Users: Users;
}

interface UserListProps {
  navigation?: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface UserListState {
  offset: number,
  modalAddUserVisible: boolean
}

const VISIBLE_USERS_LIMIT: number = 10;

export default class UserList extends Component<UserListProps, UserListState> {
    private currentListData: User[];
    private fetchingFromServer: boolean;
    private hasNextPage: boolean;
    private addedId: number;
    private idToShow: number;

    constructor(props: UserList) {
      super(props);
      this.state = { offset: 0, modalAddUserVisible: false };
      this.currentListData = [];
      this.fetchingFromServer = false;
      this.hasNextPage = false;
      this.addedId = -1;
      this.idToShow = -1;
    }

    private keyExtractor = (item: User): string => item.id;

    private renderItem = ({item} : {item: User}): JSX.Element => {
      return (
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
          onPress={this.handleOnItemPress.bind(this)}
        />
      );
    };

    private handleOnItemPress = (name, email) => {
      console.log(name + " " + email);
    }

    getUsersQuery = gql`
      query Users($limit: Int, $offset: Int) {
        Users(limit: $limit, offset: $offset) {
          nodes {
            id,
            name,
            email
          }
          pageInfo {
            hasNextPage
          }
        }
      }`;

    private fillUpList(data: Response, error: ApolloError, loading: boolean): JSX.Element {
      this.fetchingFromServer = loading;
      if (data && !loading) {
        this.hasNextPage = data.Users.pageInfo.hasNextPage;
        this.currentListData = this.currentListData.concat(data.Users.nodes);
      }
      return (
        error ?
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
        <View>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.currentListData}
            renderItem={this.renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={this.renderFooter}
          />
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalAddUserVisible}
            onDismiss={this.handleModalDismiss}
          >
          <AddUserScreen dismissModal={this.dismissModal} />
          </Modal>
        </View>
      );
    }

    private dismissModal = (id) => {
      this.setState({ modalAddUserVisible: false });
      this.addedId = id;
    }

    private handleModalDismiss = () => {
      if (this.addedId == -1) {
        alert("Nenhuma alteração realizada.");
      } else {
        alert("Usuário " + this.addedId + " criado com sucesso.");
      }
      this.addedId = -1;
    }

    render() {
        return (
          <ApolloProvider client={client}>
            <Query
              query={ this.getUsersQuery }
              variables={{ limit: VISIBLE_USERS_LIMIT, offset: this.state.offset }}
            >
              {
                ({ data, error, loading }: QueryResult<Response, OperationVariables>) => {
                  return this.fillUpList(data, error, loading);
                }
              }
            </Query>
          </ApolloProvider>
        );
    }

    private setOffsetAndRerender = () => {
      if (this.hasNextPage) {
        this.setState({offset: this.state.offset + VISIBLE_USERS_LIMIT});
      } else {
        alert("Todos os usuários foram carregados.");
      }
    }

    private openModalAddUser = () => {
      this.setState({ modalAddUserVisible: true });
    }

    private openModalLogin = () => {
      this.props.navigation.navigate('Modal');
    }

    private renderFooter = () => {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.setOffsetAndRerender}
            style={styles.loadBtn}>
              {this.fetchingFromServer ? (
                <ActivityIndicator color="white" style={{ alignContent: 'center' }} />
              ) : (
                <Text style={styles.btnText}>Carregar</Text>
              )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.openModalAddUser}
            style={styles.addBtn}>
            <Text style={styles.btnText}>Cadastrar</Text>
          </TouchableOpacity>

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
