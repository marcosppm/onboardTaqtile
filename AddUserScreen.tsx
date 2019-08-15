import React from 'react'
import { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export interface AddUserScreenProps { }

interface AddUserScreenState {
    id: number,
    name: string,
    cpf: string,
    birthdate: Date,
    email: string,
    cargo: string,
    errorMessage: string
}

export default class AddUserScreen extends Component<AddUserScreenProps, AddUserScreenState> {
    constructor(props: AddUserScreenProps) {
        super(props);
        this.state = { id: 0, name: "", cpf: "", birthdate: null, email: "", cargo: "", errorMessage: "" };
    }
    
    static navigationOptions = {
        title : 'Cadastro de Usuário'
    }

    render() {
        console.log(this.state)
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
                    onEndEditing ={(event) => this.verifyDataNascimento(event.nativeEvent.text)}
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
                    onEndEditing ={(event) => this.verifyCargo(event.nativeEvent.text)}
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

    private cadastrarUsuario = (): void => {
        
    }

    private disabledButton = (): boolean => {
        return (!this.state.id || !this.state.name || !this.state.cpf ||
                !this.state.birthdate || !this.state.email || !this.state.cargo);
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

    private verifyDataNascimento(inputDate: string): void {
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

    private verifyEmail(email: string): void {
        let regexEmail: RegExp = /([A-Za-z])+@([A-Za-z])+.com/gm;
        if (regexEmail.test(email)) {
            this.setState({ email: email, errorMessage: "" });
        } else {
            this.setState({ errorMessage: "Digite um e-mail válido."});
        }
    }

    private verifyCargo(cargo: string): void {
        if (cargo) {
            this.setState({ cargo: cargo, errorMessage: "" });
        } else {
            this.setState({ errorMessage: "Escolha um cargo."});
        }
    }
}