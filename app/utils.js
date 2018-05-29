import { ASSET_STORAGE_DIR } from "./constants/constants";

export const getAssetLib = state => {
  return Object.assign({}, state.library);
};

export const getAssetPath = asset => ASSET_STORAGE_DIR + "/" + asset.filename;
