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
    const getBoardData = await databaseQuery(queryGetBoardResults);
    const getBoardDataExceptTie = await databaseQuery(queryGetResultsExceptTie);

    return res.status(OK).send({
      bigRoadData: getBoardDataExceptTie,
      markerRoadData: getBoardData,
    });
  } catch (error) {
    return res.status(internalServer).send({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

exports.addGameResults = async (req, res) => {
  const queryGetResultPosition =
    "SELECT num_posCol, num_posRow FROM tb_results";
  const queryGetResults = "SELECT * FROM tb_results";
  const queryGetResultsExceptTie =
    "SELECT * FROM tb_results WHERE result_name != 'Tie'";

  const queryGetPreviousMainResults =
    "SELECT result_name, tie_count, num_posCol, num_posRow FROM tb_results WHERE main_resultCol = 1 order by results_id desc LIMIT 1";

  const queryGetCurrentResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1";

  const queryGetPreviousResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1 OFFSET 1";

  const queryAddResults =
    "INSERT INTO tb_results(`result_name`, `tie_count`, `main_resultCol`, `num_posCol`, `num_posRow`, `timestamp`) VALUE(?, ?, ?, ?, ?, NOW())";

  const queryUpdateMainColumnResults =
    "UPDATE tb_results SET main_resultCol = ? WHERE results_id = ?";

  // const queryGetRowResults = "SELECT num_posRow FROM tb_results";
  const {
    body: { result_name },
  } = req;

  try {
    const isResultsPlayer = result_name == "Player";
    const isResultsBanker = result_name == "Banker";
    const isResultsTie = result_name == "Tie";

    // const isResultFoundPlayerOrBanker = filterPlayerOrBanker.length;

    const getPreviousMainResults = await databaseQuery(
      queryGetPreviousMainResults
    );
    const previousMainResult = getPreviousMainResults[0];
    // console.log(previousMainResult);

    const getCurrentResults = await databaseQuery(queryGetCurrentResults);
    const currentResults = getCurrentResults[0];

    const resultsGetBoardData = await databaseQuery(queryGetResults);
    const isBoardDataEmpty = resultsGetBoardData.length == 0;

    const isPrevMainResultMatchToCurrent =
      previousMainResult?.result_name == result_name;

    const isPrevMainResultNotMatchToCurrent =
      previousMainResult?.result_name != result_name;

    const isPrevResultMatchToCurrent =
      currentResults?.result_name == result_name;

    const isPrevResultPlayer = previousMainResult?.result_name == "Player";
    const isPrevResultBanker = previousMainResult?.result_name == "Banker";
    const isPrevResultTie = currentResults?.result_name == "Tie";

    const getResultPositions = await databaseQuery(queryGetResultPosition);

    const getPreviousResults = await databaseQuery(queryGetPreviousResults);
    const previousResults = getPreviousResults[0];

    if (isBoardDataEmpty) {
      if (isResultsTie) {
        await databaseQuery(queryAddResults, [result_name, 1, 0, 1, 1]);
      } else {
        await databaseQuery(queryAddResults, [result_name, 0, 1, 1, 1]);
      }
      const resultsQueryGetResults = await databaseQuery(queryGetResults);
      const resultsQueryGetResultsExceptTie = await databaseQuery(
        queryGetResultsExceptTie
      );
      return res.status(OK).send({
        bigRoadData: resultsQueryGetResultsExceptTie,
        markerRoadData: resultsQueryGetResults,
      });
    }

    //  B, B, B, = T?
    if (isResultsTie && !isPrevResultMatchToCurrent) {
      if (
        (isPrevResultBanker || isPrevResultPlayer) &&
        currentResults?.main_resultCol != 1
      ) {
        await databaseQuery(queryUpdateMainColumnResults, [
          2,
          currentResults.results_id,
        ]);

        await databaseQuery(queryAddResults, [
          result_name,
          1,
          0,
          currentResults?.num_posCol,
          currentResults?.num_posRow,
        ]);

        const resultsQueryGetResults = await databaseQuery(queryGetResults);
        const resultsQueryGetResultsExceptTie = await databaseQuery(
          queryGetResultsExceptTie
        );
        return res.status(OK).send({
          bigRoadData: resultsQueryGetResultsExceptTie,
          markerRoadData: resultsQueryGetResults,
        });
      }
    }

    if (isResultsTie && isPrevResultMatchToCurrent) {
      const tieCountIncrement = currentResults?.tie_count + 1;
      await databaseQuery(queryAddResults, [
        result_name,
        tieCountIncrement,
        0,
        currentResults?.num_posCol,
        currentResults?.num_posRow,
      ]);

      const resultsQueryGetResults = await databaseQuery(queryGetResults);
      const resultsQueryGetResultsExceptTie = await databaseQuery(
        queryGetResultsExceptTie
      );
      return res.status(OK).send({
        bigRoadData: resultsQueryGetResultsExceptTie,
        markerRoadData: resultsQueryGetResults,
      });
    } else if ((isResultsPlayer || isResultsBanker) && isPrevResultTie) {
      if (!isPrevResultMatchToCurrent) {
        await databaseQuery(queryAddResults, [
          result_name,
          0,
          1,
          currentResults?.num_posCol,
          currentResults?.num_posRow,
        ]);

        const resultsQueryGetResults = await databaseQuery(queryGetResults);
        const resultsQueryGetResultsExceptTie = await databaseQuery(
          queryGetResultsExceptTie
        );
        return res.status(OK).send({
          bigRoadData: resultsQueryGetResultsExceptTie,
          markerRoadData: resultsQueryGetResults,
        });
      }
      if (isPrevMainResultMatchToCurrent) {
        await databaseQuery(queryAddResults, [
          result_name,
          0,
          0,
          previousMainResult?.num_posCol,
          previousMainResult?.num_posRow + 1,
        ]);
      } else {
        await databaseQuery(queryAddResults, [
          result_name,
          0,
          1,
          previousMainResult?.num_posCol + 1,
          previousMainResult?.num_posRow,
        ]);
      }

      const resultsQueryGetResults = await databaseQuery(queryGetResults);
      const resultsQueryGetResultsExceptTie = await databaseQuery(
        queryGetResultsExceptTie
      );
      return res.status(OK).send({
        bigRoadData: resultsQueryGetResultsExceptTie,
        markerRoadData: resultsQueryGetResults,
      });
    }

    if (isResultsPlayer && isPrevMainResultMatchToCurrent) {
      const rowIncrement = currentResults?.num_posRow + 1;
      const currColumn = currentResults?.num_posCol;
      await databaseQuery(queryAddResults, [
        result_name,
        0,
        0,
        currColumn,
        rowIncrement,
      ]); // main-results, column, row
    } else if (isResultsBanker && isPrevMainResultNotMatchToCurrent) {
      const colIncrement = currentResults?.num_posCol + 1;
      await databaseQuery(queryAddResults, [
        result_name,
        0,
        1,
        colIncrement,
        1,
      ]); // main-results, column, row
    } else if (isResultsTie && (isPrevResultPlayer || isPrevResultBanker)) {
      await databaseQuery(queryAddResults, [
        result_name,
        1,
        0,
        previousMainResult?.num_posCol,
        previousMainResult?.num_posRow,
      ]); // main-results, column, row
    }

    if (isResultsBanker && isPrevMainResultMatchToCurrent) {
      if (currentResults?.num_posRow >= 6) {
        await databaseQuery(queryAddResults, [
          result_name,
          0,
          0,
          currentResults?.num_posCol + 1,
          currentResults?.num_posRow,
        ]); // main-results, column, row
      } else {
        const rowIncrement = currentResults?.num_posRow + 1;
        const colIncrement = currentResults?.num_posCol;
        await databaseQuery(queryAddResults, [
          result_name,
          0,
          0,
          colIncrement,
          rowIncrement,
        ]); // main-results, column, row
      }
    } else if (isResultsPlayer && isPrevMainResultNotMatchToCurrent) {
      const colIncrement = currentResults?.num_posCol + 1;
      await databaseQuery(queryAddResults, [
        result_name,
        0,
        1,
        colIncrement,
        1,
      ]); // main-results, column, row
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
