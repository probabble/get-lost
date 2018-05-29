import RNFetchBlob from "react-native-fetch-blob";

import * as actionTypes from "../../constants/action-types";
const {
  FETCH_DATA_SUCCESS, REGISTER_ASSET,
  UPDATE_DOWNLOAD_PROGRESS
} = actionTypes;

import RSVP from "rsvp";
import * as constants from "../../constants/constants";
const { fs } = RNFetchBlob;
const { ASSET_STORAGE_DIR } = constants;


export const removeAllMedia = () => async dispatch => {
  await dispatch(configureStorage());
  await fs.unlink(ASSET_STORAGE_DIR);
  await dispatch(configureStorage());
  await dispatch({type: REGISTER_ASSET, payload: constants.AUDIO_TRACKS});
};

export const configureStorage = () => async dispatch => {
  const asset_directory_exists = await fs.isDir(ASSET_STORAGE_DIR);
  if (!asset_directory_exists) {
    return await fs.mkdir(ASSET_STORAGE_DIR);
  }
  return RSVP.Promise.resolve();
};

export const collectAssets = assets => async dispatch => {
  await dispatch(configureStorage());
  const existing_assets = await readFS();
  assets.forEach(asset => {
    dispatch({type: REGISTER_ASSET, payload: asset});
    if (existing_assets.indexOf(asset.filename) === -1) {
      dispatch(fetchDownload(asset));
    } else {
      dispatch({
        type: UPDATE_DOWNLOAD_PROGRESS,
        payload: { id: asset.id, received: 100, total: 100 }
      });
      dispatch({ type: FETCH_DATA_SUCCESS, payload: { asset } });
    }
  });
};

const readFS = async () => {
  return fs.ls(ASSET_STORAGE_DIR);
};

export const fetchDownload = ({ name, remote_src, id, filename }) => async dispatch => {
  RNFetchBlob.config({
    // add this option that makes response data to be stored as a file,
    // this is much more gooder.
    fileCache: true,
    timeout: 600 * 1000 // milliseconds
  })
    .fetch("GET", remote_src)
    .progress({ count: 100 }, (received, total) => {
      dispatch({
        type: UPDATE_DOWNLOAD_PROGRESS,
        payload: { id, received, total }
      });
    })
    .then(async res => {
      const assetLocation = `${ASSET_STORAGE_DIR}/${filename}`;
      fs.mv(res.data, assetLocation);
      dispatch({
        type: FETCH_DATA_SUCCESS,
        payload: { id: id, location: assetLocation, name: name }
      });
    });
};


export const setAudioProgress = payload => dispatch => {
  dispatch({type: actionTypes.SET_AUDIO_PROGRESS, payload: payload});
};
