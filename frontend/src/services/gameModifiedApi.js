import axios from "axios";

const fetchAddResults = async ({ result_name }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_ADD_RESULTS}`,
      {
        result_name: result_name,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchGetResults = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_GET_RESULTS}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchResetGameResults = async () => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_RESET_RESULTS}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchNewGameResults = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_NEW_GAME}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchDeleteLatestGameResults = async () => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_UNDO_RESULTS}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchAddDetailGameResults = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_ADD_DETAIL_GAME}`
    );
  } catch (error) {
    throw error;
  }
};

export {
  fetchAddResults,
  fetchGetResults,
  fetchResetGameResults,
  fetchNewGameResults,
  fetchDeleteLatestGameResults,
  fetchAddDetailGameResults,
};
