import React, { Component } from "react";
import { Button, Image, Text, View } from "react-native";
import { Link } from "react-router-native";
import { connect } from "react-redux";
import {
  collectAssets,
  fetchDownload,
  removeAllMedia, setAudioProgress
} from "../redux/actions/downloads";
import * as constants from "../constants/constants";
import { audioPlayerStyles as styles } from "../styles";
import Video from "react-native-video";

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
  let received, total;
  if (props.progress.status === "success") {
    received = 100;
    total = 100;
  } else {
    received = props.progress.received;
    total = props.progress.total;
  }
  const percent = (received / total * 100).toPrecision(2);

  const style = {
    width: `${percent}%`,
    height: 20,
    backgroundColor: "#658551"
  };

  return (
    <View style={{ width: "100%" }}>
      <Text key="label"> {props.label} </Text>
      <View key="bar" style={style} />
      {props.progress.status !== "success" ? (
        <Text key="number">{`${percent}%`}</Text>
      ) : (
        <Text key="status">{props.progress.status}</Text>
      )}
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

class Track extends Component {
  onError = err => {
    console.error(err);
  };

  state = {
    paused: false
  };

  onLoadStart = src => {};

  onProgress = progress => {
    const payload = {
      progress: progress,
      trackId: this.props.track.data.id
    };
    this.props.setAudioProgress(payload);
  };

  togglePause = () => {
    this.setState({paused: !this.state.paused});
  };

  render = () => {
    const track = this.props.track;
    if (track.status !== "ready") {
      return null;
    }

    return (
      <View>
        <Video
          source={{ uri: track.path }}
          playInBackground={true}
          rate={1.0}
          paused={this.state.paused}
          volume={1.0}
          ref={ref => {
            this.player = ref;
          }}
          onLoadStart={this.onLoadStart}
          onLoad={() => {
            this.player.seek(track.progress.currentTime);
          }}
          onError={this.onError}
          onProgress={this.onProgress}
          playWhenInactive={false} // [iOS] Video continues to play when control or notification center are shown.
          ignoreSilentSwitch={"ignore"} // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
          progressUpdateInterval={250.0}
        />
        <Button
          title={this.state.paused ? "play" : "pause"}
          onPress={this.togglePause}
        />
      </View>
    );
  };
}

Track = connect(state => ({ library: state.downloads.library }), {
  setAudioProgress
})(Track);

class AudioPlayer extends Component {
  componentDidMount() {
    this.props.collectAssets(constants.AUDIO_TRACKS);
  }
  render() {
    if (!this.props.library) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.text} key="title">
          a u d i o
        </Text>
        <ProgressBars library={this.props.library} />
        {Object.keys(this.props.library).map(trackId => {
          const track = this.props.library[trackId];
          if (track.status === "ready") {
            return <Track key={track.data.id} track={track} />;
          }
        })}
        <Button
          style={{ backgroundColor: "#f8f" }}
          onPress={this.props.removeAllMedia}
          title={"remove all media"}
        />
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
  fetchDownload,
  removeAllMedia,
  setAudioProgress
})(AudioPlayer);
export default ConnectedAudioPlayer;
