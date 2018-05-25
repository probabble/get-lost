// @flow

import {
  FETCH_DATA_ERROR,
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  UPDATE_DOWNLOAD_PROGRESS,
  REGISTER_ASSET
} from "../../constants/action-types";
import { ASSET_STORAGE_DIR } from "../../constants/constants";

const initialState = {
  isLoading: false,
  error: false
};

const getAssetLib = state => {
  return Object.assign({}, state.library);
};

const getAssetPath = assetId => {
  return ASSET_STORAGE_DIR + "/" + assetId;
};

const downloadsReducer = (state: Object = initialState, action: Object) => {
  let newState;
  const { payload } = action;
  switch (action.type) {
    case FETCH_DATA_SUCCESS: {
      let lib = getAssetLib(state);
      const { id } = payload;
      lib[id].downloadProgress["status"] = "success";
      lib[id].status = "ready";
      lib[id].path = getAssetPath(id);
      newState = {
        library: lib
      };
      break;
    }
    case FETCH_DATA_REQUEST: {
      newState = {
        isLoading: true,
        error: false
      };
      break;
    }
    case UPDATE_DOWNLOAD_PROGRESS: {
      const { id, received, total } = payload;
      let lib = getAssetLib(state);
      let asset = lib[id];

      lib[id].downloadProgress = Object.assign({}, asset["downloadProgress"], {
        received: received,
        total: total,
        status: 'downloading'
      });

      newState = {
        library: lib
      };
      break;
    }

    case REGISTER_ASSET: {
      const asset = payload;
      let lib = getAssetLib(state);
      if (lib[asset.id]) {
        break;
      }
      lib[asset.id] = {
        path: null,
        status: "new",
        downloadProgress: {},
        data: asset
      };
      newState = {
        library: lib
      };
      break;
    }

    case FETCH_DATA_ERROR: {
      newState = {
        isLoading: false,
        error: true
      };
      break;
    }
    default: {
      newState = state;
      break;
    }
  }
  return Object.assign({}, state, newState);
};

export default downloadsReducer;
