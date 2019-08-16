import React from 'react'
import { Component } from 'react';
import { View, Text, TextInput, Button, Picker , AsyncStorage, AppRegistry } from 'react-native';

import { ApolloClient, ApolloError } from 'apollo-client';
import { ApolloProvider, MutationFunction, Mutation } from 'react-apollo';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import gql from "graphql-tag";

import ApolloApp from './App';

export interface AddUserScreenProps { }

interface AddUserScreenState {
  name: string,
  cpf: string,
  birthdate: Date,
  email: string,
  role: string,
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

export default class AddUserScreen extends Component<AddUserScreenProps, AddUserScreenState> {
  constructor(props: AddUserScreenProps) {
    super(props);
    this.state = { name: "", cpf: "", birthdate: null, email: "", role: "", errorMessage: "" };
  }

  static navigationOptions = {
    title: 'Cadastro de Usuário'
  }

  render() {
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
          selectedValue={this.state.role}
          onValueChange={(itemValue) => { this.verifyRole(itemValue); }}>
          <Picker.Item label="" value="Empty" />
          <Picker.Item label="Admin" value="Administrator" />
          <Picker.Item label="User" value="Regular User" />
        </Picker>

        <Button
          title="Cadastrar"
          color="#9400D3"
          onPress={this.handleButtonPress}
          disabled={this.disabledButton()}
        />

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15, color: "#FF0000", marginTop: 25 }}>{this.state.errorMessage}</Text>
        </View>
      </View>
    );
  }

  private handleButtonPress = (): void => {

  }

  private disabledButton = (): boolean => {
    return ( !this.state.name || !this.state.cpf ||
      !this.state.birthdate || !this.state.email || !this.state.role );
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

    render() {
        return (
            <ApolloProvider client={client}>
                <Mutation
                    mutation={}
                    variables={{ input: {email: this.state.email, password: this.state.password} }}
                >
                {(mutateFunction: MutationFunction<any, any>, {loading}) => {
                    return (
                        <View style={{ alignSelf: 'center', flex: 1, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 15, marginBottom: 5 }}>Id:</Text>
                            <TextInput
                                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                                autoCapitalize='none'
                                onEndEditing ={(event) => this.verifyId(event.nativeEvent.text)}
                            />

                            <Text style={{ fontSize: 15, marginBottom: 5 }}>Nome:</Text>
                            <TextInput
                                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                                autoCapitalize='words'
                                onEndEditing ={(event) => this.verifyName(event.nativeEvent.text)}
                            />

                            <Text style={{ fontSize: 15, marginBottom: 5 }}>CPF:</Text>
                            <TextInput
                                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 0 }}
                                autoCapitalize='none'
                                onEndEditing ={(event) => this.verifyCPF(event.nativeEvent.text)}
                            />
                            <Text style={{ fontSize: 12, marginBottom: 25, fontStyle: 'italic' }}>(Utilize pontos e traços)</Text>

                            <Text style={{ fontSize: 15, marginBottom: 5 }}>Data de Nascimento:</Text>
                            <TextInput
                                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 0 }}
                                autoCapitalize='none'
                                onEndEditing ={(event) => this.verifyBirthdate(event.nativeEvent.text)}
                            />
                            <Text style={{ fontSize: 12, marginBottom: 25, fontStyle: 'italic' }}>(Formato: dd/mm/yyyy)</Text>

                            <Text style={{ fontSize: 15, marginBottom: 5 }}>E-mail:</Text>
                            <TextInput
                                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                                autoCapitalize='none'
                                onEndEditing ={(event) => this.verifyEmail(event.nativeEvent.text)}
                            />

                            <Text style={{ fontSize: 15, marginBottom: 5 }}>Cargo:</Text>
                            <TextInput
                                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                                autoCapitalize='none'
                                onEndEditing ={(event) => this.verifyPosition(event.nativeEvent.text)}
                            />

                            <Button
                            title="Cadastrar"
                            color="#9400D3"
                            onPress={ this.cadastrarUsuario }
                            disabled={ this.disabledButton() }
                            />

                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, color: "#FF0000", marginTop: 25 }}>{this.state.errorMessage}</Text>
                            </View>
                        </View>
                    );
                    }
                }
                </Mutation>
            </ApolloProvider>
        );
    }

    private cadastrarUsuario = (): void => {

    }

    private disabledButton = (): boolean => {
        return (!this.state.id || !this.state.name || !this.state.cpf ||
                !this.state.birthdate || !this.state.email || !this.state.position);
    }

    private verifyId(id: string): void {
        let regexId: RegExp = /^\d+$/gm;
        if (regexId.test(id)) {
            this.setState({ id: parseInt(id), errorMessage: "" });
        } else {
            this.setState({ errorMessage: "Digite um id válido." });
        }
    }

    private verifyName(name: string): void {
        let regexName: RegExp = /^[a-zA-Z ]*$/gm;
        if (regexName.test(name)) {
            this.setState({ name: name, errorMessage: "" });
        } else {
            this.setState({ errorMessage: "Digite um nome válido." });
        }
    }

    private verifyCPF(cpf: string): void {
        let regexCPF: RegExp = /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/gm;
        if (regexCPF.test(cpf)) {
            this.setState({ cpf: cpf, errorMessage: "" });
        } else {
            this.setState({ errorMessage: "Digite um CPF válido." });
        }
    }

    private verifyBirthdate(inputDate: string): void {
        let regexBirthdate: RegExp = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/gm;

        if (!regexBirthdate.test(inputDate)) {
            this.setState({ errorMessage: "Utilize o formato dd/mm/yyyy"});
        } else {
            let tokens: string[] = inputDate.split('/');
            let day: number = parseInt(tokens[0]);
            let month: number = parseInt(tokens[1]);
            let year: number = parseInt(tokens[2]);
            let birthdateText = year + "-" + month + "-" + day;

            let birthdate: Date = new Date(birthdateText);
            let dateNow: Date = new Date();

            if (!birthdate.valueOf()) {
                this.setState({ errorMessage: "Data inválida" });
            } else if (dateNow.getTime() <= birthdate.getTime()) {
                this.setState({ errorMessage: "Data de nascimento deve \nser anterior a hoje." });
            } else {
                this.setState({ birthdate: birthdate, errorMessage: "" })
            }
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
    if (role != "Empty") {
      this.setState({ role: role, errorMessage: "" });
      console.log(role);
    } else {
      this.setState({ role: "", errorMessage: "Escolha a função do usuário." });
    }
  }
}
