import RNFetchBlob from "react-native-fetch-blob";
const { fs } = RNFetchBlob;

const AUDIO_TRACKS = [
  {
    id: 1,
    name: "Re-Enactment For Nerds",
    remote_src:
    "https://s3-us-west-1.amazonaws.com/get.lost.media/80+_-_+580+_-_+101+PODCAST+_+RE-ENACTMENT+FOR+NERDS.mp3",
    filename: 're-enactment.mp3'
  }
];

const ASSET_STORAGE_DIR = `${fs.dirs.DocumentDir}/GetLostMedia`;

export { AUDIO_TRACKS, ASSET_STORAGE_DIR };
