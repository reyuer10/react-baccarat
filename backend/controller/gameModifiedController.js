const databaseQuery = require("../config/databaseQuery");

const OK = 200;
const internalServer = 500;

exports.newGameResults = async (req, res) => {
  const queryGenerateBoxes =
    "INSERT INTO tb_results(`game_id`, `result_name`) VALUES('', '')";

  try {
    const resultsQueryGenerateBoxes = await databaseQuery(queryGenerateBoxes);
    if (resultsQueryGenerateBoxes) {
      return res.status(OK).send({
        message: "Successfully created a new game.",
      });
    }
  } catch (error) {
    return res.status(internalServer).send({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

exports.getGameResults = async (req, res) => {
  const queryGetBoardResults = "SELECT * FROM tb_results";
  const queryGetResultsExceptTie =
    "SELECT * FROM tb_results WHERE result_name != 'Tie'";

  try {
    const resultBoardData = await databaseQuery(queryGetBoardResults);
    const resultMarkerRoadData = await databaseQuery(queryGetResultsExceptTie);

    return res.status(OK).send({
      bigRoadData: resultBoardData,
      markerRoadData: resultMarkerRoadData,
    });
  } catch (error) {
    return res.status(internalServer).send({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

exports.addGameResults = async (req, res) => {
  const queryGetResults = "SELECT * FROM tb_results";
  const queryGetResultsExceptTie =
    "SELECT * FROM tb_results WHERE result_name != 'Tie'";

  const queryGetPreviousMainResults =
    "SELECT result_name, num_posCol, num_posRow FROM tb_results WHERE main_resultCol = 1 order by results_id desc LIMIT 1";

  const queryGetCurrentResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1";

  const queryAddResults =
    "INSERT INTO tb_results(`result_name`, `main_resultCol`, `num_posCol`, `num_posRow`, `timestamp`) VALUE(?, ?, ?, ?, NOW())";

  const queryGetRowResults = "SELECT num_posRow FROM tb_results";

  const {
    body: { result_name },
  } = req;

  try {
    const isResultsPlayer = result_name == "Player";
    const isResultsBanker = result_name == "Banker";
    const isResultsTie = result_name == "Tie";

    const resultsQueryGetPreviousMainResults = await databaseQuery(
      queryGetPreviousMainResults
    );

    const previousMainResult = resultsQueryGetPreviousMainResults[0];

    const currentResult = await databaseQuery(queryGetCurrentResults);
    const currResults = currentResult[0];

    const resultsGetBoardData = await databaseQuery(queryGetResults);

    if (resultsGetBoardData.length == 0) {
      await databaseQuery(queryAddResults, [result_name, 1, 1, 1]);
      const resultsQueryGetResults = await databaseQuery(queryGetResults);
      const resultsQueryGetResultsExceptTie = await databaseQuery(
        queryGetResultsExceptTie
      );
      console.log(resultsQueryGetResults);
      return res.status(OK).send({
        bigRoadData: resultsQueryGetResultsExceptTie,
        markerRoadData: resultsQueryGetResults,
      });
    }

    if (isResultsTie && previousMainResult?.result_name == result_name) {
      console.log("Hello world.");
    }

    if (isResultsPlayer && previousMainResult?.result_name == result_name) {
      const rowIncrement = currResults?.num_posRow + 1;
      const currColumn = currResults?.num_posCol;
      await databaseQuery(queryAddResults, [
        result_name,
        0,
        currColumn,
        rowIncrement,
      ]); // main-results, column, row
    } else if (
      isResultsBanker &&
      previousMainResult?.result_name != result_name
    ) {
      const colIncrement = currResults?.num_posCol + 1;
      await databaseQuery(queryAddResults, [result_name, 1, colIncrement, 1]); // main-results, column, row
    }

    if (isResultsBanker && previousMainResult?.result_name == result_name) {
      const rowIncrement = currResults?.num_posRow + 1;
      const colIncrement = currResults?.num_posCol;
      await databaseQuery(queryAddResults, [
        result_name,
        0,
        colIncrement,
        rowIncrement,
      ]); // main-results, column, row
    } else if (
      isResultsPlayer &&
      previousMainResult?.result_name != result_name
    ) {
      const colIncrement = currResults?.num_posCol + 1;
      await databaseQuery(queryAddResults, [result_name, 1, colIncrement, 1]); // main-results, column, row
    }

    const resultsQueryGetResults = await databaseQuery(queryGetResults);
    const resultsQueryGetResultsExceptTie = await databaseQuery(
      queryGetResultsExceptTie
    );
    return res.status(OK).send({
      bigRoadData: resultsQueryGetResultsExceptTie,
      markerRoadData: resultsQueryGetResults,
    });
  } catch (error) {
    return res.status(internalServer).send({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

exports.resetGameResults = async (req, res) => {
  const queryDeleteResults = "DELETE FROM tb_results";
  const queryResetResults = "ALTER TABLE tb_results AUTO_INCREMENT = 1";
  const queryGetResults = "SELECT * FROM tb_results";
  try {
    await databaseQuery(queryDeleteResults);
    await databaseQuery(queryResetResults);
    const getResults = await databaseQuery(queryGetResults);
    return res.status(OK).send({
      message: "Successfully reset the game.",
      data: getResults,
    });
  } catch (error) {
    return res.status(internalServer).send({
      message: "Internal Server Error.",
      error: error,
    });
  }
};
