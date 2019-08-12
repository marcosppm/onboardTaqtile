import React from 'react'
import { Component } from 'react';
import { ActivityIndicator } from 'react-native';

export interface ActivityIndicatorToggleProps { 
  loading: boolean;
}

interface ActivityIndicatorToggleState { }

export default class ActivityIndicatorToggle extends Component<ActivityIndicatorToggleProps, ActivityIndicatorToggleState> {
    constructor(props) {
      super(props);
      this.state = { display: false };
    }
  
    render() {
      let activityIndicator: any;

      if (this.props.loading) {
        activityIndicator = 
            <ActivityIndicator 
                size="large"
                color="#0000ff"
                style={{ 
                    zIndex: 0,
                    position: 'absolute',
                    display: 'flex'
            }} />;
      } else {
        activityIndicator = 
            <ActivityIndicator 
                size="large"
                color="#0000ff"
                style={{ 
                    zIndex: 0,
                    position: 'absolute',
                    display: 'none'
            }} />;
      }
  
      return ( activityIndicator );
    }
  }