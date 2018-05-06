import React, {Component} from 'react';
import {Button, Image, Text, View} from "react-native";
import {Link} from "react-router-native";
import {connect} from "react-redux";
import {fetchDownload} from "../redux/actions/downloads";

const ContentItem = props => {
    if (!props.filePath) {
        return null;
    }
    // let size = Image.getSize(props.filePath);
    return <Image style={{width: 400, height: '100%'}} source={{uri: props.filePath }} />
};

class AudioPlayer extends Component {
    componentDidMount() {
        this.props.fetchDownload()
    }
    render() {
        return (
        <View>
            <Text> a u d i o</Text>
            <ContentItem filePath={this.props.imgPath} />
            <Link to="/" component={Button} title='home'> H O M E </Link>
        </View>)
    };
}

const mapStateToProps = state => {
    return {
        imgPath: state.downloads.path
    }
};

const ConnectedAudioPlayer = connect(mapStateToProps, {fetchDownload})(AudioPlayer);
export default ConnectedAudioPlayer;