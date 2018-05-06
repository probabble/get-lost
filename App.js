/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {View} from 'react-native';


import {NativeRouter, Route } from 'react-router-native'
import {connect, Provider} from "react-redux";
import styles from "./app/styles";
import Home from "./app/components/home";
import AudioPlayer from "./app/components/audio-player";
import {fetchDownload} from "./app/redux/actions/downloads";

import store from './app/redux/store';

class App extends Component {

    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <NativeRouter store={store}>
                    <View style={styles.container}>
                        <Route path="/" exact={true} component={Home} />
                        <Route path="/audio" component={AudioPlayer} />
                    </View>
                </NativeRouter>
        )
    }
}

const mapStateToProps = state => {
    return state;
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDownload: fetchDownload
    }
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

const WideNowApp = props => (
    <Provider store={store}><ConnectedApp/></Provider>
);


export default WideNowApp;