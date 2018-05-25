import React, { Component } from "react";
import { Button, Image, Text, View } from "react-native";
import { Link } from "react-router-native";
import { connect } from "react-redux";
import { collectAssets, fetchDownload } from "../redux/actions/downloads";
import * as constants from "../constants/constants";
import { audioPlayerStyles as styles } from "../styles";

const ContentItem = props => {
  if (!props.filePath) {
    return null;
  }
  // let size = Image.getSize(props.filePath);
  return (
    <Image
      style={{ width: 400, height: "100%" }}
      source={{ uri: props.filePath }}
    />
  );
};

const ProgressBar = props => {
  if (!props.progress) {
    return null;
  }
  const percent = props.progress.received / props.progress.total * 100;
  const style = {
    width: `${percent}%`,
    height: 20,
    backgroundColor: "#658551"
  };
  return (
    <View style={{ width: "100%" }}>
      <Text key="label"> {props.label} </Text>
      <View key="bar" style={style} />
      <Text key="number">{`${percent} percent`}</Text>
      <Text key="status">{props.progress.status}</Text>
    </View>
  );
};

const ProgressBars = props => {
  if (!props.library) {
    return null;
  }
  return Object.keys(props.library).map(id => {
    const asset = props.library[id];
    return (
      <ProgressBar
        key={id}
        label={asset.name}
        progress={asset.downloadProgress}
      />
    );
  });
};

class AudioPlayer extends Component {
  componentDidMount() {
    this.props.collectAssets(constants.AUDIO_TRACKS);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text} key="title">
          {" "}
          a u d i o{" "}
        </Text>
        <Text key="files">{this.props.files}</Text>
        <ProgressBars library={this.props.library} />
        <Link to="/" component={Button} title="home">
          H O M E
        </Link>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    imgPath: state.downloads.path,
    files: state.downloads.files,
    library: state.downloads.library
  };
};

const ConnectedAudioPlayer = connect(mapStateToProps, {
  collectAssets,
  fetchDownload
})(AudioPlayer);
export default ConnectedAudioPlayer;
