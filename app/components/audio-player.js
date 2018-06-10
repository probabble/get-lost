import React, { Component } from "react";
import { Button, Image, Text, View } from "react-native";
import { Link } from "react-router-native";
import { connect } from "react-redux";
import {
  collectAssets,
  fetchDownload, loadPlayerState,
  removeAllMedia, savePlayerState, setAudioProgress
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
  const {
    downloadProgress, playProgress, trackId, label
  } = props;

  let percent;
  if (downloadProgress.status === "success") {
    percent = 100;
  } else {
    let received = downloadProgress.received;
    let total = downloadProgress.total;
    percent = (received / total * 100).toPrecision(3);

  }

  const style = {
    width: `${percent}%`,
    height: 30,
    backgroundColor: "#855e76"
  };

  return (
    <View >
      <View key={`progress-${trackId}`} style={style} > <Text>{label}</Text> </View>
      {downloadProgress.status !== "success" ? (
        <Text key="number">{`${percent}%`}</Text>
      ) : null }
    </View>
  );
};

class Track extends Component {
  onError = err => {
    console.error(err);
  };

  state = {
    paused: true,
    didLoad: false
  };

  onLoadStart = src => {};

  onProgress = progress => {
    if (!this.state.didLoad || progress.currentTime === 0) {
      return;
    }
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
    const { track, status } = this.props;
    if (!track.downloadProgress) {
      return null;
    }
    return (
      <View           style={{ width: "100%" }}
      >
        <ProgressBar
          label={track.data.name}
          style={{ height: 50, width: "100%" }}
          trackId={track.data.id}
                     downloadProgress={track.downloadProgress}
                     playProgress={track.progress}/>
        {status === 'ready' ? <Video
          source={{ uri: track.path }}
          playInBackground={true}
          rate={1.0}
          paused={this.state.paused}
          volume={1.0}
          ref={ref => {
            this.player = ref;
          }}
          onLoadStart={()=>{}}
          onLoad={() => {
            this.player.seek(track.progress.currentTime);
            this.setState({paused: false, didLoad: true});
          }}
          onError={this.onError}
          onProgress={this.onProgress}
          playWhenInactive={false} // [iOS] Video continues to play when control or notification center are shown.
          ignoreSilentSwitch={"ignore"} // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
          progressUpdateInterval={250.0}
        /> : null}
        {status === 'ready' ?
        <Button
          title={this.state.paused ? "play" : "pause"}
          onPress={this.togglePause}
        /> : null}
      </View>
    );
  };
}

Track = connect(state => ({ library: state.downloads.library }), {
  setAudioProgress
})(Track);

class AudioPlayer extends Component {
  componentDidMount() {
    this.props.loadPlayerState();
  }
  componentWillUnmount() {
    this.props.savePlayerState(this.props.library);
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
        {Object.keys(this.props.library).map(trackId => {
          const track = this.props.library[trackId];
          return <Track key={track.data.id} track={track} status={track.status}/>;
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
  setAudioProgress,
  savePlayerState,
  loadPlayerState
})(AudioPlayer);
export default ConnectedAudioPlayer;
