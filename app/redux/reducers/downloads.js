// @flow

import {
  FETCH_DATA_ERROR,
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  UPDATE_DOWNLOAD_PROGRESS,
  REGISTER_ASSET,
  SET_AUDIO_PROGRESS
} from "../../constants/action-types";
import { getAssetLib, getAssetPath } from "../../utils";
import * as ACTION_TYPES from "../../constants/action-types";

const initialState = {
  isLoading: false,
  error: false
};

const downloadsReducer = (state: Object = initialState, action: Object) => {
  let newState;
  const { payload } = action;
  switch (action.type) {
    case FETCH_DATA_SUCCESS: {
      let lib = state.library;
      const { id } = payload.asset;
      lib[id].downloadProgress["status"] = "success";
      lib[id].status = "ready";
      lib[id].path = getAssetPath(payload.asset);
      lib[id].progress = lib[id].progress || {};
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
          total: total
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
          progress: {
            currentTime: 0
          },
          playing: {
            volume: 1,
            rate: 1
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

    case ACTION_TYPES.SET_AUDIO_PROGRESS: {
      const { progress, trackId } = payload;
      const lib = state.library;
      if (!lib) {
        newState = {};
        break;
      }
      lib[trackId].progress = progress;
      newState = { library: lib };
      break;
    }

    default: {
      return state;
    }
  }
  return Object.assign({}, state, newState);

};

export default downloadsReducer;
