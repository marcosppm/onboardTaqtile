import React from 'react'
import { Component } from 'react';
import { Text, View, Image, FlatList, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements'

export default class UserList extends Component {
    static navigationOptions = {
        title : 'Usuários Cadastrados'
    }

    list = [
        {
          username: 'Amy Farha',
          email: 'amy.farha@taqtile.com'
        },
        {
          username: 'Chris Jackson',
          email: 'chris.jackson@taqtile.com'
        }
    ];

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => (
        <ListItem
          leftElement={
            <View style={styles.content}>
                <Text style={styles.text}>{item.username}</Text>
            </View>
          }
          rightElement={
            <View style={styles.content}>
                <Text style={styles.text}>{item.email}</Text>
            </View>
          }
        />
    )

    render() {
        return (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.list}
              renderItem={this.renderItem}
            />
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