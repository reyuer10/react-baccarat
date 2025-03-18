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

exports.undoGameResults = async (req, res) => {
  const queryDeleteLatestResults =
    "DELETE FROM tb_results WHERE results_id = ?";
  const queryGetLatestResultsId =
    "SELECT results_id, result_name FROM tb_results order by results_id desc LIMIT 1";
  const queryGetResults = "SELECT * FROM tb_results";
  const queryGetResultsExceptTie =
    "SELECT * FROM tb_results WHERE result_name != 'Tie'";

  const queryGetSecondaryRoleReults =
    "SELECT * FROM tb_results WHERE main_resultCol = 2 order by results_id desc LIMIT 1";

  const queryUpdateTieCountResults =
    "UPDATE tb_results SET tie_count = ?  WHERE main_resultCol = 2 order by results_id desc LIMIT 1";

  const queryGetPreviousResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1 OFFSET 1";

  const queryUpdateMainResultsCol =
    "UPDATE tb_results SET main_resultCol = 0 WHERE results_id = ?";

  try {
    const getPreviousResults = await databaseQuery(queryGetPreviousResults);
    const getLatestResultsId = await databaseQuery(queryGetLatestResultsId);

    const previousResults = getPreviousResults[0];
    const results_id = getLatestResultsId[0]?.results_id;
    const currResults = getLatestResultsId[0];
    const deleteLatestResults = await databaseQuery(queryDeleteLatestResults, [
      results_id,
    ]);
    const getSecondaryRole = await databaseQuery(queryGetSecondaryRoleReults);
    const secondaryRole = getSecondaryRole[0];
    if (currResults?.result_name == "Tie") {
      const decrementTieCount = secondaryRole?.tie_count - 1;
      if (previousResults?.main_resultCol == 2) {
        await databaseQuery(queryUpdateTieCountResults, [decrementTieCount]);
        await databaseQuery(queryUpdateMainResultsCol, [
          previousResults?.results_id,
        ]);
      } else {
        await databaseQuery(queryUpdateTieCountResults, [decrementTieCount]);
      }
    }

    if (deleteLatestResults) {
      const resultsQueryGetResults = await databaseQuery(queryGetResults);
      const resultsQueryGetResultsExceptTie = await databaseQuery(
        queryGetResultsExceptTie
      );
      return res.status(OK).send({
        bigRoadData: resultsQueryGetResultsExceptTie,
        markerRoadData: resultsQueryGetResults,
      });
    }
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

  const queryFindSecondaryResult =
    "SELECT * FROM tb_results WHERE main_resultCol = 2 order by results_id desc LIMIT 1 ";

  const queryFindPreviousResultUsingRow =
    "SELECT * FROM tb_results WHERE num_posRow = 1 && result_name != 'Tie' order by results_id desc LIMIT 1";

  const queryGetCurrentResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1";

  const queryFindResultsUsingRowToLatest =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE result_name != 'Tie' order by results_id desc";

  const queryFindResultUsingRowDuplicate =
    "SELECT results_id, result_name, num_posRow FROM tb_results WHERE result_name != 'Tie' order by results_id desc LIMIT 2";

  const queryGetPreviousMainResults =
    "SELECT result_name, tie_count, num_posCol, num_posRow FROM tb_results WHERE main_resultCol = 1 order by results_id desc LIMIT 1";

  const queryAddResults =
    "INSERT INTO tb_results(`result_name`, `tie_count`, `main_resultCol`, `num_posCol`, `num_posRow`, `timestamp`) VALUE(?, ?, ?, ?, ?, NOW())";

  const queryUpdateMainColumnResults =
    "UPDATE tb_results SET tie_count = ?,  main_resultCol = ? WHERE results_id = ?";

  const queryUpdateTieCountResults =
    "UPDATE tb_results SET tie_count = ? WHERE main_resultCol = 2 order by results_id desc LIMIT 1";

  // BIG EYE BOY:

  const queryGetLatestResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1";

  const {
    body: { result_name },
  } = req;

  try {
    const isResultsPlayer = result_name == "Player";
    const isResultsBanker = result_name == "Banker";
    const isResultsTie = result_name == "Tie";

    const getPreviousMainResults = await databaseQuery(
      queryGetPreviousMainResults
    );
    const previousMainResult = getPreviousMainResults[0];

    const getCurrentResults = await databaseQuery(queryGetCurrentResults);
    const currentResults = getCurrentResults[0];

    const resultsGetBoardData = await databaseQuery(queryGetResults);
    const isBoardDataEmpty = resultsGetBoardData.length == 0;
    const findSecondColumnResults = resultsGetBoardData.find(
      (results) => results.num_posCol == 2 && results.num_posRow == 2
    );

    const isPrevResultMatchToCurrent =
      currentResults?.result_name == result_name;

    const isPrevResultPlayer = previousMainResult?.result_name == "Player";
    const isPrevResultBanker = previousMainResult?.result_name == "Banker";
    const isPrevResultTie = currentResults?.result_name == "Tie";
    const isPrevLocalResultsBanker = currentResults?.result_name == "Banker";
    const isPrevLocalResultsPlayer = currentResults?.result_name == "Player";

    const getSecondaryResult = await databaseQuery(queryFindSecondaryResult);

    const secondaryResult = getSecondaryResult[0]; // main_resultCol =  2

    const getResultsUsingColumnOne = await databaseQuery(
      queryFindPreviousResultUsingRow
    );

    const resultsUsingColumn = getResultsUsingColumnOne[0];

    const currentResultDuplicate = await databaseQuery(
      queryFindResultUsingRowDuplicate
    );

    const isCurrentResultRowsDuplicate =
      currentResultDuplicate[0] != null &&
      currentResultDuplicate[0]?.num_posRow ==
        currentResultDuplicate[1]?.num_posRow &&
      currentResultDuplicate[0]?.result_name ==
        currentResultDuplicate[1]?.result_name;

    const getResultsUsingRowToLatest = await databaseQuery(
      queryFindResultsUsingRowToLatest
    );

    function isNumColAndRowTaken() {
      const futureIncrementCol = currentResults?.num_posCol;
      const futureIncrementRow = currentResults?.num_posRow + 1;

      const findTakenColRow = getResultsUsingRowToLatest.some(
        (res) =>
          res.num_posCol == futureIncrementCol &&
          res.num_posRow == futureIncrementRow
      );
      return findTakenColRow;
    }

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

    if (isResultsBanker) {
      if (isPrevResultMatchToCurrent) {
        if (currentResults?.num_posRow >= 6) {
          await databaseQuery(queryAddResults, [
            result_name,
            0,
            0,
            currentResults?.num_posCol + 1,
            currentResults?.num_posRow,
          ]);
        } else {
          if (isNumColAndRowTaken() || isCurrentResultRowsDuplicate) {
            const colIncrement = currentResults?.num_posCol + 1;
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              colIncrement,
              currentResults?.num_posRow,
            ]);
          } else {
            const rowIncrement = currentResults?.num_posRow + 1;
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              currentResults?.num_posCol,
              rowIncrement,
            ]);
          }
        }
      }

      if (isPrevResultPlayer) {
        await databaseQuery(queryAddResults, [
          result_name,
          0,
          1,
          resultsUsingColumn?.num_posCol + 1,
          1,
        ]);
      } else if (isPrevResultTie) {
        const isPreviousResultNotFound = !previousMainResult;
        const isSecondResultNotFound = getSecondaryResult.length == 0;
        if (isPreviousResultNotFound && isSecondResultNotFound) {
          await databaseQuery(queryAddResults, [
            result_name,
            currentResults?.tie_count,
            2,
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

        const secResultsCol = secondaryResult.num_posCol;
        const secResultsRow = secondaryResult.num_posRow;

        // is secondary results is exist?
        if (!isSecondResultNotFound) {
          if (secResultsRow >= 6) {
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              1,
              secResultsCol + 1,
              currentResults?.num_posRow,
            ]);
          } else {
            if (isNumColAndRowTaken() || isCurrentResultRowsDuplicate) {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                currentResults?.num_posCol + 1,
                currentResults?.num_posRow,
              ]);
            } else {
              if (secondaryResult?.result_name == "Player") {
                await databaseQuery(queryAddResults, [
                  result_name,
                  0,
                  0,
                  secResultsCol + 1,
                  currentResults?.num_posRow,
                ]);
              } else {
                await databaseQuery(queryAddResults, [
                  result_name,
                  0,
                  0,
                  secResultsCol,
                  currentResults?.num_posRow + 1,
                ]);
              }
            }
          }
        }
      }
    }

    if (isResultsPlayer) {
      if (isPrevResultMatchToCurrent) {
        if (currentResults?.num_posRow >= 6) {
          await databaseQuery(queryAddResults, [
            result_name,
            0,
            0,
            currentResults?.num_posCol + 1,
            currentResults?.num_posRow,
          ]);
        } else {
          if (isNumColAndRowTaken() || isCurrentResultRowsDuplicate) {
            const colIncrement = currentResults?.num_posCol + 1;
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              colIncrement,
              currentResults?.num_posRow,
            ]);
          } else {
            const rowIncrement = currentResults?.num_posRow + 1;
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              currentResults?.num_posCol,
              rowIncrement,
            ]);
          }
        }
      }
      if (isPrevLocalResultsBanker) {
        await databaseQuery(queryAddResults, [
          result_name,
          0,
          1,
          resultsUsingColumn?.num_posCol + 1,
          1,
        ]);
      } else if (isPrevResultTie) {
        const isPreviousResultNotFound = !previousMainResult;
        const isSecondResultNotFound = getSecondaryResult.length == 0;
        if (isPreviousResultNotFound && isSecondResultNotFound) {
          await databaseQuery(queryAddResults, [
            result_name,
            currentResults?.tie_count,
            2,
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

        const secResultsCol = secondaryResult.num_posCol;
        const secResultsRow = secondaryResult.num_posRow;

        // is secondary results is exist?
        if (!isSecondResultNotFound) {
          if (secResultsRow >= 6) {
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              1,
              secResultsCol + 1,
              currentResults?.num_posRow,
            ]);
          } else {
            if (isNumColAndRowTaken() || isCurrentResultRowsDuplicate) {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                currentResults?.num_posCol + 1,
                currentResults?.num_posRow,
              ]);
            } else {
              if (secondaryResult?.result_name == "Banker") {
                await databaseQuery(queryAddResults, [
                  result_name,
                  0,
                  0,
                  secResultsCol + 1,
                  1,
                ]);
              } else {
                await databaseQuery(queryAddResults, [
                  result_name,
                  0,
                  0,
                  secResultsCol,
                  currentResults?.num_posRow + 1,
                ]);
              }
            }
          }
        }
      }
    }

    if (isResultsTie) {
      const isPreviousResultBanker = currentResults?.result_name == "Banker";
      const isPreviousResultPlayer = currentResults?.result_name == "Player";

      if (isPreviousResultPlayer || isPreviousResultBanker) {
        if (currentResults?.main_resultCol == 2) {
          await databaseQuery(queryAddResults, [
            result_name,
            currentResults?.tie_count + 1,
            0,
            currentResults?.num_posCol,
            currentResults?.num_posRow,
          ]);

          await databaseQuery(queryUpdateMainColumnResults, [
            currentResults?.tie_count + 1,
            2,
            currentResults?.results_id,
          ]);
        } else {
          await databaseQuery(queryAddResults, [
            result_name,
            1,
            0,
            currentResults?.num_posCol,
            currentResults?.num_posRow,
          ]);

          await databaseQuery(queryUpdateMainColumnResults, [
            1,
            2,
            currentResults?.results_id,
          ]);
        }

        const resultsQueryGetResults = await databaseQuery(queryGetResults);
        const resultsQueryGetResultsExceptTie = await databaseQuery(
          queryGetResultsExceptTie
        );

        // Big Eye Boy

        const getLatestResults = resultsQueryGetResults;

        return res.status(OK).send({
          bigRoadData: resultsQueryGetResultsExceptTie,
          markerRoadData: resultsQueryGetResults,
        });
      }

      const tieCountIncrement = currentResults?.tie_count + 1;
      if (isPrevResultTie) {
        await databaseQuery(queryUpdateTieCountResults, [
          currentResults?.tie_count + 1,
        ]);

        await databaseQuery(queryAddResults, [
          result_name,
          tieCountIncrement,
          0,
          currentResults?.num_posCol,
          currentResults?.num_posRow,
        ]);
      }
    }

    const resultsQueryGetResults = await databaseQuery(queryGetResults);
    const resultsQueryGetResultsExceptTie = await databaseQuery(
      queryGetResultsExceptTie
    );
    const getLatesResults = await databaseQuery(queryGetLatestResults);
    const queryResults = getLatesResults[0];

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

exports.secondaryAddGameResults = async (req, res) => {
  const queryGetThreeLatestColResults =
    "SELECT DISTINCT result_name, num_posCol FROM tb_results order by num_posCol desc LIMIT 3;";

  const queryGetLatestResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1";

  const queryGetAllColumnDataFromResults =
    "SELECT results_id, num_posCol FROM tb_results WHERE num_posCol = ?";

  const queryInsertBigEyeBoyData =
    "UPDATE tb_results SET bigEyeBoy_resultName = ?, bigEyeBoy_numPosCol = ?, bigEyeBoy_numPosRow = ? WHERE results_id = ?";

  try {
    const getThreeLatestResults = await databaseQuery(
      queryGetThreeLatestColResults
    );
    const threeLatestResults = getThreeLatestResults;
    const firstLatestColResults = threeLatestResults[0];
    const secondLatestColResults = threeLatestResults[1];
    const thirdLatestColResults = threeLatestResults[2];

    const firstAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [firstLatestColResults?.num_posCol]
    );

    console.log(firstAllColumnDataFromResults);

    const secondAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [secondLatestColResults?.num_posCol]
    );

    const thirdAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [thirdLatestColResults?.num_posCol]
    );

    const getLatestResults = await databaseQuery(queryGetLatestResults);
    const latestResults = getLatestResults[0];

    const isColRowTwoHasData =
      latestResults?.num_posCol == 2 && latestResults?.num_posRow == 2;
    const isColRowThreeHasData =
      latestResults?.num_posCol == 3 && latestResults?.num_posRow == 1;

    if (isColRowTwoHasData) {
      if (
        firstAllColumnDataFromResults.length ==
        secondAllColumnDataFromResults.length
      ) {
        await databaseQuery(queryInsertBigEyeBoyData, [
          "Red",
          1,
          1,
          latestResults?.results_id,
        ]);
      } else {
        await databaseQuery(queryInsertBigEyeBoyData, [
          "Blue",
          1,
          1,
          latestResults?.results_id,
        ]);
      }
    } else if (isColRowThreeHasData) {
      if (
        firstAllColumnDataFromResults.length ==
        secondAllColumnDataFromResults.length
      ) {
        await databaseQuery(queryInsertBigEyeBoyData, [
          "Red",
          1,
          1,
          latestResults?.results_id,
        ]);
      } else {
        await databaseQuery(queryInsertBigEyeBoyData, [
          "Blue",
          1,
          1,
          latestResults?.results_id,
        ]);
      }
    }

    return res.status(OK).send({
      message: "Successfully added detail!",
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
