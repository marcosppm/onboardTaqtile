import React from 'react'
import { Component } from 'react';
import { View, Text, TextInput, Button, Picker, ScrollView, StyleSheet, AsyncStorage, AppRegistry } from 'react-native';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationFunction, Mutation } from 'react-apollo';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import gql from "graphql-tag";

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';

import ApolloApp from './App';

export interface AddUserScreenProps {
  dismissModal: any;
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

const USER: string = "user";
const ADMIN: string = "admin";

enum UserRoleType {
  admin="admin",
  user="user"
}

enum DateMessage {
  INVALID_DATE,
  DATE_BEFORE_TODAY,
  CORRECT_DATE
}

interface AddUserScreenState {
  name: string,
  cpf: string,
  birthDate: string,
  birthDateFormatted: string,
  email: string,
  password: string,
  selectedRole: string,
  userRole: UserRoleType,
  errorMessage: string
}

interface UserInput {
  name: string,
  cpf: string,
  birthDate: string,
  email: string,
  password: string,
  userRole: UserRoleType
}

export default class AddUserScreen extends Component<AddUserScreenProps, AddUserScreenState> {
  private mutateFunction;

  constructor(props: AddUserScreenProps) {
    super(props);
    this.state = { name: "", cpf: "", birthDateFormatted: "", birthDate: "", email: "", password: "", selectedRole: "",
                   userRole: null, errorMessage: "" };
    this.mutateFunction = null;
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
            birthDate: this.state.birthDateFormatted, password: this.state.password,
            role: this.state.userRole } }}
        >
          {(mutateFunction: MutationFunction<{UserCreate: {id: number}}, {input: UserInput}>, { loading }) => {
            this.mutateFunction = mutateFunction;
            return (
              <ScrollView>
                <Text style={styles.fieldTitle}>Nome:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize='words'
                  onChangeText={this.handleChangeName.bind(this)}
                />

                <Text style={styles.fieldTitle}>CPF:</Text>
                <TextInput
                  style={styles.textInputWithTip}
                  autoCapitalize='none'
                  onChangeText={this.handleChangeCPF.bind(this)}
                />
                <Text style={styles.textTip}>(Utilize pontos e traços)</Text>

                <Text style={styles.fieldTitle}>Data de Nascimento:</Text>
                <TextInput
                  style={styles.textInputWithTip}
                  autoCapitalize='none'
                  onChangeText={this.handleChangeBirthDate.bind(this)}
                />
                <Text style={styles.textTip}>(Formato: dd/mm/yyyy)</Text>

                <Text style={styles.fieldTitle}>E-mail:</Text>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize='none'
                  onChangeText={this.handleChangeEmail.bind(this)}
                />

                <Text style={styles.fieldTitle}>Senha:</Text>
                <TextInput
                  style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 15 }}
                  autoCompleteType='password'
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  secureTextEntry={true}
                  onChangeText={this.handleChangePassword.bind(this)}
                />

                <Text style={styles.fieldTitle}>Função:</Text>
                <Picker
                  selectedValue={this.state.selectedRole}
                  onValueChange={this.handleValueChangeRole.bind(this)}>
                  <Picker.Item label="" value="empty" />
                  <Picker.Item label="System Administrator" value="admin" />
                  <Picker.Item label="Regular User" value="user" />
                </Picker>

                <Button
                  title="Cadastrar"
                  color="#9400D3"
                  onPress={this.handleButtonPress}
                  disabled={loading}
                />

                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, color: "#FF0000", marginTop: 25 }}>{this.state.errorMessage}</Text>
                </View>
              </ScrollView>
            );
          }
          }
        </Mutation>
      </ApolloProvider>
    );
  }

  private handleChangeName(text: string) {
    this.setState({ name: text });
  }

  private handleChangeCPF(text: string) {
    this.setState({ cpf: text });
  }

  private handleChangeBirthDate(text: string) {
    this.setState({ birthDate: text });
  }

  private handleChangeEmail(text: string) {
    this.setState({ email: text });
  }

  private handleChangePassword(text: string) {
    this.setState({ password: text });
  }

  private handleValueChangeRole(itemValue: string) {
    this.setRole(itemValue);
    this.setState({ selectedRole: itemValue });
  }

  private handleButtonPress = async (): Promise<void> => {
    if (this.correctlyFilled()) {
      try {
        const result = await this.mutateFunction({ variables: {
          name: this.state.name, email: this.state.email, cpf: this.state.cpf,
          birthDate: this.state.birthDateFormatted, password: this.state.password, role: this.state.userRole
        } });

        if (result.error) {
          const message: string = result.error.graphQLErrors[0].message;
          this.setState({ errorMessage: message });

        } else if (result.data) {
          let id: number = result.data.UserCreate.id;
          this.setState({ errorMessage: "" });
          this.props.dismissModal(id);
        }
      } catch (error) {
        const message: string = error.message;
        this.setState({ errorMessage: message });
      }
    }
  }

  private correctlyFilled = (): boolean => {
    if (!this.state.name || !this.validName()) {
      this.setState({ errorMessage: "Digite um nome válido." });
      return false;
    } else if (!this.state.cpf || !this.validCPF()) {
      this.setState({ errorMessage: "Digite um CPF válido." });
      return false;
    } else if (!this.state.birthDate || !this.validDateFormat()) {
      this.setState({ errorMessage: "Utilize o formato dd/mm/yyyy." });
      return false;
    } else {
      const dateMessage: DateMessage = this.validDate();
      switch (dateMessage) {
        case DateMessage.INVALID_DATE:
          this.setState({ errorMessage: "Data inválida." });
          return false;
        case DateMessage.DATE_BEFORE_TODAY:
          this.setState({ errorMessage: "Data deve ser anterior a hoje." });
          return false;
        case DateMessage.CORRECT_DATE:
          this.setState({ errorMessage: "" });
      }
      if (!this.state.email || !this.validEmail()) {
        this.setState({ errorMessage: "Digite um e-mail válido." });
        return false;
      } else if (this.state.password.length < 7) {
        this.setState({ errorMessage: "A senha deve ter pelo menos 7 caracteres." });
        return false;
      } else if (!this.state.password || !this.validPasswordFormat()) {
        this.setState({ errorMessage: "A senha deve conter pelo menos um caracter e um dígito." });
        return false;
      } else if (!this.roleSelected()) {
        this.setState({ errorMessage: "Selecione uma função para o usuário." });
        return false;
      }
    }
    return true;
  }

  private validName = (): boolean => {
    const regexName: RegExp = /^[a-zA-Z ]*$/gm;
    return regexName.test(this.state.name);
  }

  private validCPF = (): boolean => {
    const regexCPF: RegExp = /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/gm;
    return regexCPF.test(this.state.cpf);
  }

  private validDateFormat = (): boolean => {
    const regexBirthdate: RegExp = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/gm;
    return regexBirthdate.test(this.state.birthDate);
  }

  private validDate = (): DateMessage => {
    const tokens: string[] = this.state.birthDate.split('/');
    const day: number = parseInt(tokens[0]);
    const month: number = parseInt(tokens[1]);
    const year: number = parseInt(tokens[2]);
    const birthDateFormatted: string = year + "-" + month + "-" + day;

    const birthDate: Date = new Date(birthDateFormatted);
    const dateNow: Date = new Date();

    if (!birthDate.valueOf()) {
      return DateMessage.INVALID_DATE;
    } else if (dateNow.getTime() <= birthDate.getTime()) {
      return DateMessage.DATE_BEFORE_TODAY;
    } else {
      this.setState({ birthDateFormatted: birthDateFormatted });
      return DateMessage.CORRECT_DATE;
    }
  }

  private validEmail = (): boolean => {
    const regexEmail: RegExp = /([A-Za-z])+@([A-Za-z])+.com/gm;
    return regexEmail.test(this.state.email);
  }

  private validPasswordFormat(): boolean {
    const regexOneCharAndOneDigit: RegExp = /(?=.*?[0-9])(?=.*?[A-Za-z]).+/gm;
    return regexOneCharAndOneDigit.test(this.state.password);
  }

  private setRole(selectedItem: string): void {
    if (selectedItem == ADMIN) {
      this.setState({ userRole: UserRoleType.admin });
    } else if (selectedItem == USER) {
      this.setState({ userRole: UserRoleType.user });
    } else {
      this.setState({ userRole: null });
    }
  }

  private roleSelected(): boolean {
    return (this.state.userRole != null);
  }
}

const styles = StyleSheet.create({
  fieldTitle: {
    fontSize: 15,
    marginBottom: 5
  },
  textInput: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 25
  },
  textInputWithTip: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 0
  },
  textTip: {
    fontSize: 12,
    marginBottom: 25,
    fontStyle: 'italic'
  }
});
