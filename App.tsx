import React from 'react'
import { Component } from 'react';
import { Text, View, TextInput, Button } from 'react-native';

import { AppRegistry } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationFunction } from 'react-apollo';
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
import { bool } from 'prop-types';

export interface HelloWorldAppProps { 
  navigation?: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface HelloWorldAppState {
  email?: string
  password?: string
  errorMessage?: string
  token?: string
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
    this.state = { email: "", password: "", errorMessage: "", token: "" };
  }

  private formCorrectlyFilled(): boolean {
    let correctlyFilled = true;
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
      alert("Token não pôde ser salvo localmente.");
      tokenSaved = false;
    }
    return tokenSaved;
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Mutation
          mutation={gql`
            mutation getLogin {
              Login(data:{email:"${this.state.email}", password:"${this.state.password}"}) {
                token
              }
            }`}
        >
          {(mutateFunction: MutationFunction<any, { email: string, password: string }>, {data, error, loading}) => {
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
                  onPress={async () => {
                    
                    if (!this.formCorrectlyFilled()) {
                      return;
                    } else {
                      try {
                        // alert(loading + "\r\n" + error + "\r\n" + data + "\r\n" + this.state.email + "\r\n" + this.state.password);
                        await mutateFunction({ variables: { 
                          email: this.state.email,
                          password: this.state.password
                        } });
                        
                        let token: string = JSON.parse(JSON.stringify(data)).Login.token;
                        this.setState({
                          token: token,
                          errorMessage: token
                        });
                        let tokenSaved = await this.storeLocally(token);
                        if (tokenSaved) {
                          this.props.navigation.navigate('UserList');
                        }
                        
                      } catch (exception) {
                        if (loading) {
                          this.setState({ errorMessage: "Esperando o servidor responder..." });
                        } else if (error) {
                          let message = JSON.parse(JSON.stringify(error)).graphQLErrors[0].message;
                          this.setState({ errorMessage: message });
                        }
                      }
                    }
                  }}
                />
              </View>

              <View style={{ alignItems: 'baseline' }}>
                <Text style={{ fontSize: 15, color: "#FF0000" }}>{this.state.errorMessage}</Text>
              </View>
            </View>);
          }}
        </Mutation>
      </ApolloProvider>
    );
  }
}

