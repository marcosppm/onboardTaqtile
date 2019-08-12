import React from 'react'
import { Component } from 'react';
import { Text } from 'react-native';

export default class UserList extends Component {
    static navigationOptions = {
        title : 'Lista do Usuário'
    }

    render() {
        return (
            <Text>Segunda tela</Text>
        );
    }
}