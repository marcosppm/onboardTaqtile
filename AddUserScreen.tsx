import React from 'react'
import { Component } from 'react';
import { View, Text, TextInput, Button, Picker, ActivityIndicator, AsyncStorage, AppRegistry } from 'react-native';

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

export interface AddUserScreenProps {
  navigation?: NavigationScreenProp<NavigationState, NavigationParams>;
 }

interface AddUserScreenState {
  name: string,
  cpf: string,
  birthdate: Date,
  email: string,
  userRole: UserRoleType,
  errorMessage: string
}

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
AppRegistry.registerComponent('AddUserScreen', () => ApolloApp);

const INITIAL_PASSWORD: string = "1234qwer";
const USER: string = "user";
const ADMIN: string = "admin";

enum UserRoleType {
  admin,
  user
}

export default class AddUserScreen extends Component<AddUserScreenProps, AddUserScreenState> {
  private birthdateYYYYMMDD: string;

  constructor(props: AddUserScreenProps) {
    super(props);
    this.state = { name: "", cpf: "", birthdate: null, email: "", userRole: null, errorMessage: "" };
    this.birthdateYYYYMMDD = "";
  }

  static navigationOptions = {
    title: 'Cadastro de Usuário'
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
      <ApolloProvider client={client}>
        <Mutation
          mutation={this.mutationCreateUser}
          variables={{ input: {
            name: this.state.name, email: this.state.email, cpf: this.state.cpf,
            birthDate: this.birthdateYYYYMMDD, password: INITIAL_PASSWORD, role: this.state.userRole } }}
        >
          {(mutateFunction: MutationFunction<
              {UserCreate: {id: number}},
              {name: string, email: string, cpf: string, birthDate: string, password: string, role: UserRoleType}
            >,
            { loading }
           ) => {
            return (
              <View style={{ alignSelf: 'center', flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 15, marginBottom: 5 }}>Nome:</Text>
                <TextInput
                  style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                  autoCapitalize='words'
                  onEndEditing={(event) => this.verifyName(event.nativeEvent.text)}
                />

                <Text style={{ fontSize: 15, marginBottom: 5 }}>CPF:</Text>
                <TextInput
                  style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 0 }}
                  autoCapitalize='none'
                  onEndEditing={(event) => this.verifyCPF(event.nativeEvent.text)}
                />
                <Text style={{ fontSize: 12, marginBottom: 25, fontStyle: 'italic' }}>(Utilize pontos e traços)</Text>

                <Text style={{ fontSize: 15, marginBottom: 5 }}>Data de Nascimento:</Text>
                <TextInput
                  style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 0 }}
                  autoCapitalize='none'
                  onEndEditing={(event) => this.verifyBirthdate(event.nativeEvent.text)}
                />
                <Text style={{ fontSize: 12, marginBottom: 25, fontStyle: 'italic' }}>(Formato: dd/mm/yyyy)</Text>

                <Text style={{ fontSize: 15, marginBottom: 5 }}>E-mail:</Text>
                <TextInput
                  style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                  autoCapitalize='none'
                  onEndEditing={(event) => this.verifyEmail(event.nativeEvent.text)}
                />

                <Text style={{ fontSize: 15, marginBottom: 5 }}>Função:</Text>
                <Picker
                  selectedValue={this.state.userRole}
                  onValueChange={(itemValue) => {
                    this.verifyRole(itemValue);
                    this.setState({ userRole: itemValue });
                  }}>
                  <Picker.Item label="" value="empty" />
                  <Picker.Item label="System Administrator" value="admin" />
                  <Picker.Item label="Regular User" value="user" />
                </Picker>

                <Button
                  title="Cadastrar"
                  color="#9400D3"
                  onPress={() => {
                    this.handleButtonPress(mutateFunction);
                  }}
                  disabled={this.disabledButton() || loading}
                />

                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, color: "#FF0000", marginTop: 25 }}>{this.state.errorMessage}</Text>
                </View>

                {loading &&
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={{
                        zIndex: 0,
                        position: 'absolute'
                    }} />
                }
              </View>
            );
          }
          }
        </Mutation>
      </ApolloProvider>
    );
  }

  private async handleButtonPress(mutateFunction): Promise<boolean>  {
    try {
      const result = await mutateFunction({ variables: {
        name: this.state.name, email: this.state.email, cpf: this.state.cpf,
        birthDate: this.birthdateYYYYMMDD, password: INITIAL_PASSWORD, role: this.state.userRole
      } });

      if (result.error) {
        let message = result.error.graphQLErrors[0].message;
        this.setState({ errorMessage: message });
        return false;

      } else if (result.data) {
        let id: number = result.data.UserCreate.id;
        this.setState({
          errorMessage: ""
        });
        alert("Usuário " + id + " criado com sucesso.");
        this.props.navigation.navigate('UserList');
        return true;
      }
    } catch (error) {
      let message = error.message;
      this.setState({ errorMessage: message });
      return false;
    }
  }

  private disabledButton = (): boolean => {
    return (!this.state.name || !this.state.cpf ||
      !this.state.birthdate || !this.state.email || !this.state.userRole);
  }

  private verifyName(name: string): void {
    const regexName: RegExp = /^[a-zA-Z ]*$/gm;
    if (regexName.test(name)) {
      this.setState({ name: name, errorMessage: "" });
    } else {
      this.setState({ name: "", errorMessage: "Digite um nome válido." });
    }
  }

  private verifyCPF(cpf: string): void {
    const regexCPF: RegExp = /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/gm;
    if (regexCPF.test(cpf)) {
      this.setState({ cpf: cpf, errorMessage: "" });
    } else {
      this.setState({ cpf: "", errorMessage: "Digite um CPF válido." });
    }
  }

  private verifyBirthdate(inputDate: string): void {
    const regexBirthdate: RegExp = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/gm;

    if (!regexBirthdate.test(inputDate)) {
      this.setState({ errorMessage: "Utilize o formato dd/mm/yyyy" });
    } else {
      const tokens: string[] = inputDate.split('/');
      const day: number = parseInt(tokens[0]);
      const month: number = parseInt(tokens[1]);
      const year: number = parseInt(tokens[2]);
      const birthdateText = year + "-" + month + "-" + day;

      const birthdate: Date = new Date(birthdateText);
      const dateNow: Date = new Date();

      if (!birthdate.valueOf()) {
        this.setState({ birthdate: null, errorMessage: "Data inválida" });
      } else if (dateNow.getTime() <= birthdate.getTime()) {
        this.setState({ birthdate: null, errorMessage: "Data de nascimento deve \nser anterior a hoje." });
      } else {
        this.birthdateYYYYMMDD = birthdateText;
        this.setState({ birthdate: birthdate, errorMessage: "" });
      }
    }
  }

  private verifyEmail(email: string): void {
    const regexEmail: RegExp = /([A-Za-z])+@([A-Za-z])+.com/gm;
    if (regexEmail.test(email)) {
      this.setState({ email: email, errorMessage: "" });
    } else {
      this.setState({ email: "", errorMessage: "Digite um e-mail válido." });
    }
  }

  private verifyRole(role: string): void {
    if (role == ADMIN) {
      this.setState({ userRole: UserRoleType.admin, errorMessage: "" });
    } else if (role == USER) {
      this.setState({ userRole: UserRoleType.user, errorMessage: "" });
    } else {
      this.setState({ userRole: null, errorMessage: "Escolha a função do usuário." });
    }
  }
}
