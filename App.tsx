import React from 'react'
import { Component } from 'react';
import { Text, View, TextInput, Button, ActivityIndicator } from 'react-native';

import { AppRegistry } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationFunction, MutationFetchResult } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import gql from "graphql-tag";
import { Mutation } from 'react-apollo';

import AppContainer from './index'

import { AsyncStorage } from 'react-native';

import {
  NavigationParams, 
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';

export interface HelloWorldAppProps { 
  navigation?: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface HelloWorldAppState {
  email?: string
  password?: string
  errorMessage?: string
}

const client = new ApolloClient({
  link: createHttpLink({ uri: "https://tq-template-server-sample.herokuapp.com/graphql" }),
  cache: new InMemoryCache()
});

const ApolloApp = AppComponent => (
  <ApolloProvider client={client}>
    <AppContainer />
  </ApolloProvider>
);
AppRegistry.registerComponent('HelloWorldApp', () => ApolloApp);

export default class HelloWorldApp extends Component<HelloWorldAppProps, HelloWorldAppState> {
  static navigationOptions = {
    title : 'Login Screen',
  }

  constructor(props: HelloWorldAppProps) {
    super(props);
    this.state = { email: "", password: "", errorMessage: "" };
  }

  private formCorrectlyFilled(): boolean {
    let correctlyFilled: boolean = true;
    let regexEmail: RegExp = /([A-Za-z])+@([A-Za-z])+.com/gm;
    let regexOneCharAndOneDigit: RegExp = /(?=.*?[0-9])(?=.*?[A-Za-z]).+/gm;
    if (!this.state.email) {
      this.setState({ errorMessage: "E-mail obrigatório." });
      correctlyFilled = false;
    } else if (!regexEmail.test(this.state.email)) {
      this.setState({ errorMessage: "Formato do e-mail deve ser: ###@###.com" });
      correctlyFilled = false;
    } else if (!this.state.password) {
      this.setState({ errorMessage: "Senha obrigatória." });
      correctlyFilled = false;
    } else if (this.state.password.length < 7) {
      this.setState({ errorMessage: "A senha deve ter pelo menos 7 caracteres." });
      correctlyFilled = false;
    } else if (!regexOneCharAndOneDigit.test(this.state.password)) {
      this.setState({ errorMessage: "A senha deve conter pelo menos um caracter e um dígito" });
      correctlyFilled = false;
    } 
    return correctlyFilled;
  }

  private async storeLocally(token: string): Promise<Boolean> {
    let tokenSaved: boolean = true;
    try {
      await AsyncStorage.setItem('@Token:key', token);
    } catch (error) {
      alert("Erro interno do servidor");
      console.warn("Token não pôde ser salvo localmente.");
      tokenSaved = false;
    }
    return tokenSaved;
  }

  private async login(mutateFunction): Promise<boolean>  {
    if (this.formCorrectlyFilled()) {
      try {
        let result = await mutateFunction({ variables: { 
          email: this.state.email,
          password: this.state.password
        } });

        if (result.error) {
          let message = result.error.graphQLErrors[0].message;
          this.setState({ errorMessage: message });
          return false;

        } else if (result.data) {
          let token: string = result;
          this.setState({
            errorMessage: ""
          });
  
          let tokenSaved = await this.storeLocally(token);
          if (tokenSaved) {
            this.props.navigation.navigate('UserList');
          }
          return true;
        }
      } catch (error) {
        let message = error.graphQLErrors[0].message;
        this.setState({ errorMessage: message });
        return false;
      }
    }
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Mutation
          mutation={gql`
            mutation Login($input: LoginInput!) {
              Login(data: $input) {
                token
              }
            }`}
            variables={{ input: {email: this.state.email, password: this.state.password} }}
        >
          {(mutateFunction: MutationFunction<{ Login: { token: string } }, { email: string, password: string }>, {loading}) => {
            return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 33, fontWeight: 'bold' }}>
                  Bem-vindo(a) à Taqtile!
                </Text>
              </View>

              <View style={{ alignItems: 'baseline' }}>
                <Text style={{ fontSize: 15, marginBottom: 5 }}>E-mail:</Text>

                <TextInput
                  style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 15 }}
                  autoCompleteType='email'
                  autoCapitalize='none'
                  onChangeText={(inputText) => this.setState({ email: inputText })}
                />

                <Text style={{ fontSize: 15, marginBottom: 5 }}>Senha:</Text>

                <TextInput
                  style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 15 }}
                  autoCompleteType='password'
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  secureTextEntry={true}
                  onChangeText={(inputText) => this.setState({ password: inputText })}
                />

              </View>

              <View style={{ marginBottom: 15 }}>
                <Button
                  title="Entrar"
                  color="#9400D3"
                  onPress={() => {
                    this.login(mutateFunction);
                  }}
                  disabled={ loading }
                />
              </View>

              <View style={{ alignItems: 'baseline' }}>
                <Text style={{ fontSize: 15, color: "#FF0000" }}>{this.state.errorMessage}</Text>
              </View>

              <ActivityIndicator 
                size="large"
                color="#0000ff"
                style={{ 
                    zIndex: 0,
                    position: 'absolute',
                    display: (loading ? 'flex' : 'none')
                }} />
            </View>);
          }}
        </Mutation>
      </ApolloProvider>
    );
  }
}
