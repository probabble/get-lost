import RNFetchBlob from "react-native-fetch-blob";
import {
  FETCH_DATA_SUCCESS, REGISTER_ASSET,
  UPDATE_DOWNLOAD_PROGRESS
} from "../../constants/action-types";
import RSVP from "rsvp";
import { ASSET_STORAGE_DIR } from "../../constants/constants";
const { fs } = RNFetchBlob;

const configureStorage = () => async dispatch => {
  const asset_directory_exists = await fs.isDir(ASSET_STORAGE_DIR);
  if (!asset_directory_exists) {
    return await fs.mkdir(ASSET_STORAGE_DIR);
  }
  return RSVP.Promise.resolve();
};

const collectAssets = assets => async dispatch => {
  const configured = await dispatch(configureStorage());
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

const fetchDownload = ({ name, remote_src, id: assetId }) => async dispatch => {
  RNFetchBlob.config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    fileCache: true,
    timeout: 600 * 1000 // milliseconds
  })
    .fetch("GET", remote_src)
    .progress({ count: 200 }, (received, total) => {
      dispatch({
        type: UPDATE_DOWNLOAD_PROGRESS,
        payload: { id, received, total }
      });
    })
    .then(async res => {
      const assetLocation = `${ASSET_STORAGE_DIR}/${assetId}`;
      fs.mv(res.data, assetLocation);
      dispatch({
        type: FETCH_DATA_SUCCESS,
        payload: { id: assetId, location: assetLocation, name: name }
      });
    });
};

export { fetchDownload, collectAssets };
