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
      let { id, received, total } = payload;
      const assetState = state.library[id];
      const assetUpdates = Object.assign({}, assetState, {
        downloadProgress: {
          received: received,
          total: total,
        }
      });

      const newAssetState = Object.assign({}, assetState, assetUpdates);

      const library = getAssetLib(state);
      library[id] = newAssetState;
      newState = {
        library: library
      };
      break;
    }

    case REGISTER_ASSET: {
      let assets = payload;
      if (!Array.isArray(assets)) {
        assets = [assets];
      }
      let lib = state.library;
      const newLib = {};
      assets.forEach(asset => {
        if (newLib[asset.id]) {
          return;
        }
        newLib[asset.id] = {
          path: null,
          status: "new",
          downloadProgress: {
            received: 0,
            total: 100,
            status: "not started"
          },
          data: asset
        };
      });

      const library = Object.assign({}, lib, newLib);
      newState = {
        library: library
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
      newState = {};
      break;
    }
  }
  return Object.assign({}, state, newState);
};

export default downloadsReducer;
