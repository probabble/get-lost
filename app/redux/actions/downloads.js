import RNFetchBlob from "react-native-fetch-blob";
import {FETCH_DATA_SUCCESS} from "../../constants/action-types";

const fetchDownload = () => async (dispatch) => {
    const sun = "https://upload.wikimedia.org/wikipedia/commons/e/e3/Magnificent_CME_Erupts_on_the_Sun_-_August_31.jpg";

    RNFetchBlob.config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        appendExt : 'jpg'
    }).fetch('GET', sun).then(res => {
        dispatch({type: FETCH_DATA_SUCCESS, payload: res});
    })
};

export { fetchDownload };