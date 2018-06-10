import RNFetchBlob from "react-native-fetch-blob";

import * as actionTypes from "../../constants/action-types";
const {
  FETCH_DATA_SUCCESS, REGISTER_ASSET,
  UPDATE_DOWNLOAD_PROGRESS, SET_STATE
} = actionTypes;

import RSVP from "rsvp";
import * as constants from "../../constants/constants";

import React from "react-native"
import { FETCH_DATA_REQUEST } from "../../constants/action-types";
const { AsyncStorage } = React;

const { fs } = RNFetchBlob;
const { ASSET_STORAGE_DIR } = constants;

export const loadPlayerState = () => async dispatch => {
  let library = await AsyncStorage.getItem('library');

  if (library) {
    library = JSON.parse(library);
    await dispatch({type: SET_STATE, payload: {'library': library}});
  }
  else {
    await dispatch({type: SET_STATE, payload: {'library': {}}});
  }
  dispatch(collectAssets(library || {}));

};

export const savePlayerState = (playerState) => async dispatch => {
  await AsyncStorage.setItem('library', JSON.stringify(playerState));
};

export const removeAllMedia = () => async dispatch => {
  await dispatch(configureStorage());
  await fs.unlink(ASSET_STORAGE_DIR);
  await AsyncStorage.removeItem('library');
  await dispatch(loadPlayerState())
};

export const configureStorage = () => async dispatch => {
  const asset_directory_exists = await fs.isDir(ASSET_STORAGE_DIR);
  if (!asset_directory_exists) {
    return await fs.mkdir(ASSET_STORAGE_DIR);
  }
  return RSVP.Promise.resolve();
};

export const collectAssets = library => async dispatch => {
  const assets = constants.AUDIO_TRACKS;

  await dispatch(configureStorage());
  const existing_assets = await readFS();
  assets.forEach(async asset => {

    await dispatch({type: REGISTER_ASSET, payload: asset});

    if (existing_assets.indexOf(asset.filename) === -1) {
      if (library[asset.id] && library[asset.id].status === 'downloading') {
        return;
      }
      dispatch(fetchDownload(asset));
    } else {
      dispatch({
        type: UPDATE_DOWNLOAD_PROGRESS,
        payload: { id: asset.id, received: 100, total: 100 }
      });
      dispatch({ type: FETCH_DATA_SUCCESS, payload: asset });
    }
  });
};

const readFS = async () => {
  return fs.ls(ASSET_STORAGE_DIR);
};

export const fetchDownload = props => async dispatch => {
  const { name, remote_src, id, filename } = props;

  dispatch({type: FETCH_DATA_REQUEST, payload: props});
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
        payload: { id: id, location: assetLocation, name: name, filename: filename }
      });
    });
};


export const setAudioProgress = payload => dispatch => {
  dispatch({type: actionTypes.SET_AUDIO_PROGRESS, payload: payload});
};
