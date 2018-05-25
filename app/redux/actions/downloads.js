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

const removeAllMedia = () => async dispatch => {
  await dispatch(configureStorage());
  await fs.unlink(ASSET_STORAGE_DIR);
  await dispatch(configureStorage());
  await dispatch({type: REGISTER_ASSET, payload: constants.AUDIO_TRACKS});
};

const configureStorage = () => async dispatch => {
  const asset_directory_exists = await fs.isDir(ASSET_STORAGE_DIR);
  if (!asset_directory_exists) {
    return await fs.mkdir(ASSET_STORAGE_DIR);
  }
  return RSVP.Promise.resolve();
};

const collectAssets = assets => async dispatch => {
  await dispatch(configureStorage());
  const existing_assets = await readFS();
  assets.forEach(asset => {
    dispatch({type: REGISTER_ASSET, payload: asset});
    if (existing_assets.indexOf(asset.id.toString()) === -1) {
      dispatch(fetchDownload(asset));
    } else {
      dispatch({
        type: UPDATE_DOWNLOAD_PROGRESS,
        payload: { id: asset.id, received: 100, total: 100 }
      });
      dispatch({ type: FETCH_DATA_SUCCESS, payload: { id: asset.id } });
    }
  });
};

const readFS = async () => {
  return fs.ls(ASSET_STORAGE_DIR);
};

const fetchDownload = ({ name, remote_src, id }) => async dispatch => {
  RNFetchBlob.config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
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
      const assetLocation = `${ASSET_STORAGE_DIR}/${id}`;
      fs.mv(res.data, assetLocation);
      dispatch({
        type: FETCH_DATA_SUCCESS,
        payload: { id: id, location: assetLocation, name: name }
      });
    });
};

export { fetchDownload, collectAssets, removeAllMedia };
