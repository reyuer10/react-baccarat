import axios from "axios";

const fetchAddResults = async ({ result_name }) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/baccarat/POST/results/game",
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
      "http://localhost:3000/api/baccarat/GET/results/game"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchResetGameResults = async () => {
  try {
    const response = await axios.delete(
      "http://localhost:3000/api/baccarat/DELETE/results/game"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchNewGameResults = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/baccarat/POST/new/game"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  fetchAddResults,
  fetchGetResults,
  fetchResetGameResults,
  fetchNewGameResults,
};
