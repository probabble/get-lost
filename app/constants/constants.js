import RNFetchBlob from "react-native-fetch-blob";
const { fs } = RNFetchBlob;

const AUDIO_TRACKS = [
  {
    id: 1,
    name: "Hold Music",
    remote_src:
      "https://s3-us-west-1.amazonaws.com/starteleweb/audio/hold_music.wav"
  },
  {
    id: 2,
    name: "How To Dial",
    remote_src:
      "https://s3-us-west-1.amazonaws.com/starteleweb/audio/how_to_dial.wav"
  }
];

const ASSET_STORAGE_DIR = `${fs.dirs.DocumentDir}/GetLostMedia`;

export { AUDIO_TRACKS, ASSET_STORAGE_DIR };
