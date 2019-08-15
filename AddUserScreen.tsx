import React from 'react'
import { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export interface AddUserScreenProps { }

interface AddUserScreenState {
    id: number,
    name: string,
    cpf: string,
    dataNascimento: string,
    email: string,
    cargo: string
}  

export default class AddUserScreen extends Component<AddUserScreenProps, AddUserScreenState> {
    constructor(props: AddUserScreenProps) {
        super(props);
        this.state = { id: 0, name: null, cpf: null, dataNascimento: null, email: null, cargo: null };
    }
    
    static navigationOptions = {
        title : 'Cadastro de Usuário'
    }

    render() {
        return (
            <View style={{ alignSelf: 'center', margin: 20 }}>
                <Text style={{ fontSize: 15, marginBottom: 5 }}>Id:</Text>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                    autoCapitalize='none'
                />

                <Text style={{ fontSize: 15, marginBottom: 5 }}>Nome:</Text>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                    autoCapitalize='words'
                    onEndEditing ={(event) => this.verifyName(event.nativeEvent.text) }
                />

                <Text style={{ fontSize: 15, marginBottom: 5 }}>CPF:</Text>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                    autoCapitalize='none'
                />

                <Text style={{ fontSize: 15, marginBottom: 5 }}>Data de Nascimento:</Text>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                    autoCapitalize='none'
                />

                <Text style={{ fontSize: 15, marginBottom: 5 }}>E-mail:</Text>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                    autoCapitalize='none'
                />

                <Text style={{ fontSize: 15, marginBottom: 5 }}>Cargo:</Text>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 25 }}
                    autoCapitalize='none'
                />

                <Button
                  title="Cadastrar"
                  color="#9400D3"
                  onPress={ this.cadastrarUsuario }
                  disabled={ this.disabledButton() }
                />
            </View>
        );
    }

    private cadastrarUsuario = (): void => {
        
    }

    private disabledButton = (): boolean => {
        return (!this.state.id || !this.state.name || !this.state.cpf ||
                !this.state.dataNascimento || !this.state.email || !this.state.cargo);
    }

    private verifyId(id: string): boolean {
        let regexId: RegExp = /^\d+$/gm;
        return regexId.test(id);
    }

    private verifyName(name: string): void {
        let regexName: RegExp = /^[a-zA-Z ]*$/gm;
        if (regexName.test(name)) {
            this.setState({ name: name });
        } else {
            alert("Digite um nome válido.");
        }
    }

    private verifyCPF(cpf: string): boolean {
        let regexCPF: RegExp = /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/gm;
        return regexCPF.test(cpf);
    }

    private verifyDataNascimento(inputDate: string): boolean {
        try {
            let dataNascimento = new Date('2011-04-11T10:20:30Z'); // DATE
            let dateNow = new Date();

            return (dateNow.getTime() > dataNascimento.getTime());
        } catch (exception) {
            return false;
        }
    }

    private verifyEmail(email: string): boolean {
        let regexEmail: RegExp = /([A-Za-z])+@([A-Za-z])+.com/gm;
        return regexEmail.test(email);
    }

    private verifyCargo(cargo: string): boolean {
        return true;
    }
}