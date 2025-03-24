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
  const queryGetAllBigEyeBoyResults =
    "SELECT bigEyeBoy_resultName as `name`, bigEyeBoy_numPosCol as `column`, bigEyeBoy_numPosRow as `row` FROM tb_results WHERE result_name != 'Tie' AND bigEyeBoy_resultName != ''";

  const queryFindColRowResults =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE num_posCol = ? AND num_posRow = ?";

  const queryGetAllColumnDataFromResults =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE group_count = ? AND result_name != 'Tie'";

  const queryGetThreeLatestColResults =
    "SELECT result_name, num_posCol FROM tb_results WHERE result_name != 'Tie' order by result_count desc LIMIT 3";

  const queryGetLatestResults =
    "SELECT * FROM tb_results WHERE result_name != 'Tie' order by results_id desc LIMIT 1";

  try {
    const getThreeLatestResults = await databaseQuery(
      queryGetThreeLatestColResults
    );

    const threeLatestResults = getThreeLatestResults;
    const firstLatestColResults = threeLatestResults[0];
    const secondLatestColResults = threeLatestResults[1];
    const thirdLatestColResults = threeLatestResults[2];

    const resultsData = await databaseQuery(queryGetAllBigEyeBoyResults);
    const getBoardData = await databaseQuery(queryGetBoardResults);
    const getBoardDataExceptTie = await databaseQuery(queryGetResultsExceptTie);

    const firstAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [firstLatestColResults?.num_posCol]
    );

    const secondAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [secondLatestColResults?.num_posCol]
    );

    const thirdAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [thirdLatestColResults?.num_posCol]
    );

    const firstColumnLength = firstAllColumnDataFromResults.length;
    const secondColumnLength = secondAllColumnDataFromResults.length;
    const thirdColumnLength = thirdAllColumnDataFromResults.length;

    const getLatestResults = await databaseQuery(queryGetLatestResults);
    const latestResults = getLatestResults[0];

    const isCurrentResultsBlue = latestResults?.result_name == "Player";
    const isCurrentResultsRed = latestResults?.result_name == "Banker";

    const findColRowTwoResults = await databaseQuery(
      queryFindColRowResults,
      [2, 2]
    );

    const findColRowThreeResults = await databaseQuery(
      queryFindColRowResults,
      [3, 1]
    );

    const isColRowTwoFound = findColRowTwoResults.length > 0;
    const isColRowThreeFound = findColRowThreeResults.length > 0;

    function bigEyeBoyPrediction(leadName) {
      if (leadName == "Banker") {
        if (isCurrentResultsBlue) {
          if (firstColumnLength == secondColumnLength) {
            return "Red";
          } else {
            return "Blue";
          }
        } else {
          if (firstColumnLength == secondColumnLength) {
            return "Blue";
          } else {
            return "Red";
          }
        }
      } else if (leadName == "Player") {
        if (isCurrentResultsRed) {
          if (firstColumnLength == secondColumnLength) {
            return "Red";
          } else {
            return "Blue";
          }
        } else {
          if (firstColumnLength == secondColumnLength) {
            return "Blue";
          } else {
            return "Red";
          }
        }
      }
    }

    return res.status(OK).send({
      bigRoadData: getBoardDataExceptTie,
      markerRoadData: getBoardData,
      bigEyeBoyData: resultsData,
      predictionsData: {
        isRowColTwoOrThreeFound:
          isColRowTwoFound || isColRowThreeFound
            ? isColRowTwoFound || isColRowThreeFound
            : null,
        isBigEyeBoyHasData:
          isColRowTwoFound || isColRowThreeFound
            ? isColRowTwoFound || isColRowThreeFound
            : null,
        isSmallRoadHasData: false,
        isCockroachPigHasData: false,
        bigEyeBoy: {
          banker: bigEyeBoyPrediction("Banker")
            ? bigEyeBoyPrediction("Banker")
            : null,
          player: bigEyeBoyPrediction("Player")
            ? bigEyeBoyPrediction("Player")
            : null,
        },
      },
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

  const queryGetAllBigEyeBoyResults =
    "SELECT bigEyeBoy_resultName as `name`, bigEyeBoy_numPosCol as `column`, bigEyeBoy_numPosRow as `row` FROM tb_results WHERE result_name != 'Tie' AND bigEyeBoy_resultName != ''";

  const queryFindColRowResults =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE num_posCol = ? AND num_posRow = ?";

  const queryGetAllColumnDataFromResults =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE group_count = ? AND result_name != 'Tie'";

  const queryGetLatestResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1";

  const queryGetThreeLatestColResults =
    "SELECT result_name, num_posCol FROM tb_results WHERE result_name != 'Tie' order by result_count desc LIMIT 3";

  try {
    const getThreeLatestResults = await databaseQuery(
      queryGetThreeLatestColResults
    );

    const threeLatestResults = getThreeLatestResults;

    const firstLatestColResults = threeLatestResults[0];
    const secondLatestColResults = threeLatestResults[1];
    const thirdLatestColResults = threeLatestResults[2];

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
      const firstAllColumnDataFromResults = await databaseQuery(
        queryGetAllColumnDataFromResults,
        [firstLatestColResults?.num_posCol]
      );

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

      const firstColumnLength = firstAllColumnDataFromResults.length;
      const secondColumnLength = secondAllColumnDataFromResults.length;
      const thirdColumnLength = thirdAllColumnDataFromResults.length;

      const isCurrentResultsBlue = latestResults?.result_name == "Player";
      const isCurrentResultsRed = latestResults?.result_name == "Banker";

      function bigEyeBoyPrediction(leadName) {
        if (leadName == "Banker") {
          if (isCurrentResultsBlue) {
            if (firstColumnLength == secondColumnLength) {
              return "Red";
            } else {
              return "Blue";
            }
          } else {
            if (firstColumnLength == secondColumnLength) {
              return "Blue";
            } else {
              return "Red";
            }
          }
        } else if (leadName == "Player") {
          if (isCurrentResultsRed) {
            if (firstColumnLength == secondColumnLength) {
              return "Red";
            } else {
              return "Blue";
            }
          } else {
            if (firstColumnLength == secondColumnLength) {
              return "Blue";
            } else {
              return "Red";
            }
          }
        }
      }

      const findColRowTwoResults = await databaseQuery(
        queryFindColRowResults,
        [2, 2]
      );

      const findColRowThreeResults = await databaseQuery(
        queryFindColRowResults,
        [3, 1]
      );

      const isColRowTwoFound = findColRowTwoResults.length > 0;
      const isColRowThreeFound = findColRowThreeResults.length > 0;

      const getAllBigEyeBoyResults = await databaseQuery(
        queryGetAllBigEyeBoyResults
      );

      const resultsQueryGetResults = await databaseQuery(queryGetResults);
      const resultsQueryGetResultsExceptTie = await databaseQuery(
        queryGetResultsExceptTie
      );

      const isColRowTwoOrThreeFound = isColRowTwoFound || isColRowThreeFound;

      return res.status(OK).send({
        bigRoadData: resultsQueryGetResultsExceptTie,
        bigEyeBoyData: getAllBigEyeBoyResults,
        markerRoadData: resultsQueryGetResults,
        predictionsData: {
          isRowColTwoOrThreeFound: isColRowTwoOrThreeFound
            ? isColRowTwoFound || isColRowThreeFound
            : null,
          isBigEyeBoyHasData: isColRowTwoOrThreeFound
            ? isColRowTwoFound || isColRowThreeFound
            : null,
          bigEyeBoy: {
            banker: bigEyeBoyPrediction("Banker"),
            player: bigEyeBoyPrediction("Player"),
          },
        },
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

  const queryGetLatestResultCount =
    "SELECT * FROM tb_results WHERE result_count != 0 order by results_id desc LIMIT 1";

  const queryFindResultsUsingRowToLatest =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE result_name != 'Tie' order by results_id desc";

  const queryFindResultsNameUsingRowToLatest =
    "SELECT results_id, result_name, num_posCol, num_posRow FROM tb_results WHERE result_name != 'Tie' order by results_id desc";

  const queryFindResultUsingRowDuplicate =
    "SELECT results_id, result_name, num_posRow FROM tb_results WHERE result_name != 'Tie' order by results_id desc LIMIT 2";

  const queryGetPreviousMainResults =
    "SELECT result_name, tie_count, num_posCol, num_posRow FROM tb_results WHERE main_resultCol = 1 order by results_id desc LIMIT 1";

  const queryAddResults =
    "INSERT INTO tb_results(`result_name`, `result_count`, `tie_count`, `main_resultCol`, `num_posCol`, `num_posRow`, `group_count`, `timestamp`) VALUE(?, ?, ?, ?, ?, ?, ?, NOW())";

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

    const queryResultsNameUsingRowToLatest = await databaseQuery(
      queryFindResultsNameUsingRowToLatest
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

    function isAdvanceNumColAndRowTaken() {
      const futureIncrementCol = currentResults?.num_posCol;
      const futureIncrementRow = currentResults?.num_posRow + 1;

      const findTakenColRow = queryResultsNameUsingRowToLatest.some(
        (res) =>
          res.num_posCol + 1 == futureIncrementCol &&
          res.num_posRow == futureIncrementRow &&
          res.result_name == result_name
      );

      return findTakenColRow;
    }

    const getLatestResultCount = await databaseQuery(queryGetLatestResultCount);
    const latestResultCount = getLatestResultCount[0];

    if (isBoardDataEmpty) {
      if (isResultsTie) {
        await databaseQuery(queryAddResults, [result_name, 0, 1, 0, 1, 1, 0]);
      } else {
        await databaseQuery(queryAddResults, [result_name, 1, 0, 1, 1, 1, 1]);
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
            0,
            currentResults?.num_posCol + 1,
            currentResults?.num_posRow,
            latestResultCount?.result_count,
          ]);
        } else {
          if (isAdvanceNumColAndRowTaken()) {
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              0,
              currentResults?.num_posCol + 1,
              currentResults?.num_posRow,
              latestResultCount?.result_count,
            ]);
          } else if (isNumColAndRowTaken() || isCurrentResultRowsDuplicate) {
            const colIncrement = currentResults?.num_posCol + 1;
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              0,
              colIncrement,
              currentResults?.num_posRow,
              latestResultCount?.result_count,
            ]);
          } else {
            const rowIncrement = currentResults?.num_posRow + 1;
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              0,
              currentResults?.num_posCol,
              rowIncrement,
              latestResultCount?.result_count,
            ]);
          }
        }
      }

      if (isPrevLocalResultsPlayer) {
        await databaseQuery(queryAddResults, [
          result_name,
          latestResultCount?.result_count + 1,
          0,
          1,
          resultsUsingColumn?.num_posCol + 1,
          1,
          latestResultCount?.result_count + 1,
        ]);
      } else if (isPrevResultTie) {
        const isPreviousResultNotFound = !previousMainResult;
        const isSecondResultNotFound = getSecondaryResult.length == 0;
        if (isPreviousResultNotFound && isSecondResultNotFound) {
          await databaseQuery(queryAddResults, [
            result_name,
            0,
            currentResults?.tie_count,
            2,
            currentResults?.num_posCol,
            currentResults?.num_posRow,
            latestResultCount?.result_count,
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
        const secResultName = secondaryResult.result_name;
        // is secondary results is exist?
        if (!isSecondResultNotFound) {
          if (secResultsRow >= 6) {
            if (secResultName == "Player") {
              await databaseQuery(queryAddResults, [
                result_name,
                latestResultCount?.result_count + 1,
                0,
                1,
                secResultsCol + 1,
                1,
                latestResultCount?.result_count + 1,
              ]);
            } else {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                1,
                secResultsCol + 1,
                currentResults?.num_posRow,
                latestResultCount?.result_count,
              ]);
            }
          } else {
            if (isAdvanceNumColAndRowTaken()) {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                0,
                currentResults?.num_posCol + 1,
                currentResults?.num_posRow,
                latestResultCount?.result_count,
              ]);
            } else if (isNumColAndRowTaken() || isCurrentResultRowsDuplicate) {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                0,
                currentResults?.num_posCol + 1,
                currentResults?.num_posRow,
                latestResultCount?.result_count,
              ]);
            } else {
              if (secondaryResult?.result_name == "Player") {
                await databaseQuery(queryAddResults, [
                  result_name,
                  latestResultCount?.result_count + 1,
                  0,
                  0,
                  secResultsCol + 1,
                  1,
                  latestResultCount?.result_count + 1,
                ]);
              } else {
                await databaseQuery(queryAddResults, [
                  result_name,
                  0,
                  0,
                  0,
                  secResultsCol,
                  currentResults?.num_posRow + 1,
                  latestResultCount?.result_count,
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
            0,
            currentResults?.num_posCol + 1,
            currentResults?.num_posRow,
            latestResultCount?.result_count,
          ]);
        } else {
          if (isAdvanceNumColAndRowTaken()) {
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              0,
              currentResults?.num_posCol + 1,
              currentResults?.num_posRow,
              latestResultCount?.result_count,
            ]);
          } else if (isNumColAndRowTaken() || isCurrentResultRowsDuplicate) {
            const colIncrement = currentResults?.num_posCol + 1;
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              0,
              colIncrement,
              currentResults?.num_posRow,
              latestResultCount?.result_count,
            ]);
          } else {
            const rowIncrement = currentResults?.num_posRow + 1;
            await databaseQuery(queryAddResults, [
              result_name,
              0,
              0,
              0,
              currentResults?.num_posCol,
              rowIncrement,
              latestResultCount?.result_count,
            ]);
          }
        }
      }
      if (isPrevLocalResultsBanker) {
        await databaseQuery(queryAddResults, [
          result_name,
          latestResultCount?.result_count + 1,
          0,
          1,
          resultsUsingColumn?.num_posCol + 1,
          1,
          latestResultCount?.result_count + 1,
        ]);
      } else if (isPrevResultTie) {
        const isPreviousResultNotFound = !previousMainResult;
        const isSecondResultNotFound = getSecondaryResult.length == 0;
        if (isPreviousResultNotFound && isSecondResultNotFound) {
          await databaseQuery(queryAddResults, [
            result_name,
            0,
            currentResults?.tie_count,
            2,
            currentResults?.num_posCol,
            currentResults?.num_posRow,
            latestResultCount?.result_count,
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
        const secResultName = secondaryResult.result_name;

        // is secondary results is exist?
        if (!isSecondResultNotFound) {
          if (secResultsRow >= 6) {
            if (secResultName == "Banker") {
              await databaseQuery(queryAddResults, [
                result_name,
                latestResultCount?.result_count + 1,
                0,
                1,
                secResultsCol + 1,
                1,
                latestResultCount?.result_count + 1,
              ]);
            } else {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                1,
                secResultsCol + 1,
                currentResults?.num_posRow,
                latestResultCount?.result_count,
              ]);
            }
          } else {
            if (isAdvanceNumColAndRowTaken()) {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                0,
                currentResults?.num_posCol + 1,
                currentResults?.num_posRow,
                latestResultCount?.result_count,
              ]);
            } else if (isNumColAndRowTaken() || isCurrentResultRowsDuplicate) {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                0,
                currentResults?.num_posCol + 1,
                currentResults?.num_posRow,
                latestResultCount?.result_count,
              ]);
            } else {
              if (secondaryResult?.result_name == "Banker") {
                await databaseQuery(queryAddResults, [
                  result_name,
                  latestResultCount?.result_count + 1,
                  0,
                  0,
                  secResultsCol + 1,
                  1,
                  latestResultCount?.result_count + 1,
                ]);
              } else {
                await databaseQuery(queryAddResults, [
                  result_name,
                  0,
                  0,
                  0,
                  secResultsCol,
                  currentResults?.num_posRow + 1,
                  latestResultCount?.result_count,
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
            0,
            currentResults?.tie_count + 1,
            0,
            currentResults?.num_posCol,
            currentResults?.num_posRow,
            0,
          ]);

          await databaseQuery(queryUpdateMainColumnResults, [
            currentResults?.tie_count + 1,
            2,
            currentResults?.results_id,
          ]);
        } else {
          await databaseQuery(queryAddResults, [
            result_name,
            0,
            1,
            0,
            currentResults?.num_posCol,
            currentResults?.num_posRow,
            0,
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
          0,
          tieCountIncrement,
          0,
          currentResults?.num_posCol,
          currentResults?.num_posRow,
          0,
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
  const queryFindLatestResultCount =
    "SELECT results_id, bigEyeBoy_resultCount as `resultCount` FROM tb_results WHERE bigEyeBoy_resultCount != 0 AND result_name != 'Tie' order by results_id desc LIMIT 1";

  const queryFindColRowResults =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE num_posCol = ? AND num_posRow = ?";

  const queryGetAllBigEyeBoyResults =
    "SELECT bigEyeBoy_resultName as `name`, bigEyeBoy_numPosCol as `column`, bigEyeBoy_numPosRow as `row` FROM tb_results WHERE result_name != 'Tie' AND bigEyeBoy_resultName != ''";

  const queryGetThreeLatestColResults =
    "SELECT result_name, num_posCol FROM tb_results WHERE result_name != 'Tie' order by result_count desc LIMIT 3";

  const queryGetTwoLatestResults =
    "SELECT * FROM tb_results WHERE result_name != 'Tie' order by results_id desc LIMIT 2";

  const queryGetLatestResults =
    "SELECT * FROM tb_results WHERE result_name != 'Tie' order by results_id desc LIMIT 1";

  const queryGetDefaultLatestResults =
    "SELECT * FROM tb_results order by results_id desc LIMIT 1";

  const queryGetPreviousResults =
    "SELECT results_id, bigEyeBoy_resultName, bigEyeBoy_numPosCol, bigEyeBoy_numPosRow FROM tb_results WHERE result_name != 'Tie' order by results_id desc LIMIT 1 OFFSET 1";

  const queryGetAllColumnDataFromResults =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE group_count = ? AND result_name != 'Tie'";

  const queryInsertBigEyeBoyData =
    "UPDATE tb_results SET bigEyeBoy_resultName = ?, bigEyeBoy_resultCount = ?, bigEyeBoy_numPosCol = ?, bigEyeBoy_numPosRow = ? WHERE results_id = ? AND result_name != 'Tie'";

  const queryFindResultsUsingRowToLatest =
    "SELECT results_id, bigEyeBoy_resultName, bigEyeBoy_numPosCol, bigEyeBoy_numPosRow FROM tb_results WHERE result_name != 'Tie' AND bigEyeBoy_numPosCol != '' AND bigEyeBoy_numPosRow != ''  order by results_id desc";

  try {
    const findBigEyeBoyResultsUsingRowColToLatest = await databaseQuery(
      queryFindResultsUsingRowToLatest
    );

    const findLatestResultCount = await databaseQuery(
      queryFindLatestResultCount
    );

    const latestResultCount = findLatestResultCount[0];

    const findColRowTwoResults = await databaseQuery(
      queryFindColRowResults,
      [2, 2]
    );

    const findColRowThreeResults = await databaseQuery(
      queryFindColRowResults,
      [3, 1]
    );

    const isColRowTwoFound = findColRowTwoResults.length > 0;
    const isColRowThreeFound = findColRowThreeResults.length > 0;

    const getPreviousResults = await databaseQuery(queryGetPreviousResults);
    const previousResults = getPreviousResults[0];

    const getTwoLatestResults = await databaseQuery(queryGetTwoLatestResults);
    const firstLatestResults = getTwoLatestResults[0];
    const secondLatestResults = getTwoLatestResults[1];

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

    const secondAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [secondLatestColResults?.num_posCol]
    );

    const thirdAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [thirdLatestColResults?.num_posCol]
    );

    const getDefaultLatestResults = await databaseQuery(
      queryGetDefaultLatestResults
    );
    const defaultLatestResults = getDefaultLatestResults[0];

    const getLatestResults = await databaseQuery(queryGetLatestResults);
    const latestResults = getLatestResults[0];

    function isRowColTaken() {
      const futurePreviousRow = previousResults?.bigEyeBoy_numPosRow + 1;
      const futurePrevioustCol = previousResults?.bigEyeBoy_numPosCol;

      console.log(
        "previous result name: ",
        previousResults?.bigEyeBoy_resultName
      );

      const isRowColFound = findBigEyeBoyResultsUsingRowColToLatest.some(
        (res) =>
          res.bigEyeBoy_numPosRow == futurePreviousRow &&
          res.bigEyeBoy_numPosCol == futurePrevioustCol
      );
      return isRowColFound;
    }

    console.log(isRowColTaken());

    const isColRowTwoHandleCurrentResults =
      latestResults?.num_posCol == 2 && latestResults?.num_posRow == 2;
    const isColRowThreeHandleCurrentResults =
      latestResults?.num_posCol == 3 && latestResults?.num_posRow == 1;

    const firstColumnLength = firstAllColumnDataFromResults.length;
    const secondColumnLength = secondAllColumnDataFromResults.length;
    const thirdColumnLength = thirdAllColumnDataFromResults.length;

    const isCurrentResultsBlue = latestResults?.result_name == "Player";
    const isCurrentResultsRed = latestResults?.result_name == "Banker";

    function bigEyeBoyPrediction(leadName) {
      if (leadName == "Banker") {
        if (isCurrentResultsBlue) {
          if (firstColumnLength == secondColumnLength) {
            return "Red";
          } else {
            return "Blue";
          }
        } else {
          if (firstColumnLength == secondColumnLength) {
            return "Blue";
          } else {
            return "Red";
          }
        }
      } else if (leadName == "Player") {
        if (isCurrentResultsRed) {
          if (firstColumnLength == secondColumnLength) {
            return "Red";
          } else {
            return "Blue";
          }
        } else {
          if (firstColumnLength == secondColumnLength) {
            return "Blue";
          } else {
            return "Red";
          }
        }
      }
    }

    if (isColRowTwoFound && isColRowTwoHandleCurrentResults) {
      if (firstColumnLength <= secondColumnLength) {
        await databaseQuery(queryInsertBigEyeBoyData, [
          "Red",
          1,
          1,
          1,
          latestResults?.results_id,
        ]);
      } else {
        await databaseQuery(queryInsertBigEyeBoyData, [
          "Blue",
          1,
          1,
          1,
          latestResults?.results_id,
        ]);
      }
      const resultsData = await databaseQuery(queryGetAllBigEyeBoyResults);
      const getCurrResults = await databaseQuery(queryGetLatestResults);
      const currResults = getCurrResults[0];

      return res.status(OK).send({
        bigEyeBoyData: resultsData,
        predictionsData: {
          isRowColTwoOrThreeFound: isColRowTwoFound || isColRowThreeFound,
          isBigEyeBoyHasData: isColRowTwoFound || isColRowThreeFound,
          bigEyeBoy: {
            banker: bigEyeBoyPrediction("Banker"),
            player: bigEyeBoyPrediction("Player"),
          },
        },
      });
    } else if (
      !isColRowTwoFound &&
      isColRowThreeFound &&
      isColRowThreeHandleCurrentResults
    ) {
      if (secondColumnLength == thirdColumnLength) {
        await databaseQuery(queryInsertBigEyeBoyData, [
          "Red",
          1,
          1,
          1,
          latestResults?.results_id,
        ]);
      } else {
        await databaseQuery(queryInsertBigEyeBoyData, [
          "Blue",
          1,
          1,
          1,
          latestResults?.results_id,
        ]);
      }

      const resultsData = await databaseQuery(queryGetAllBigEyeBoyResults);
      const getCurrResults = await databaseQuery(queryGetLatestResults);
      const currResults = getCurrResults[0];

      return res.status(OK).send({
        bigEyeBoyData: resultsData,
        predictionsData: {
          isRowColTwoOrThreeFound: isColRowTwoFound || isColRowThreeFound,
          isBigEyeBoyHasData: isColRowTwoFound || isColRowThreeFound,
          bigEyeBoy: {
            banker: bigEyeBoyPrediction("Banker"),
            player: bigEyeBoyPrediction("Player"),
          },
        },
      });
    }

    const firstNameResult = firstLatestResults?.result_name;
    const secondNameResult = secondLatestResults?.result_name;
    const isPrevNameResultNotMatchToCurrent =
      firstNameResult != secondNameResult;

    const isLatestResultsReachColRowTwo =
      (latestResults?.num_posCol >= 2 && latestResults?.num_posRow >= 2) ||
      (latestResults?.num_posCol >= 3 && latestResults?.num_posRow >= 1);

    const redResetColumn = [
      "Red",
      latestResultCount?.resultCount + 1,
      latestResultCount?.resultCount + 1,
      1,
      latestResults?.results_id,
    ];

    const blueResetColumn = [
      "Blue",
      latestResultCount?.resultCount + 1,
      latestResultCount?.resultCount + 1,
      1,
      latestResults?.results_id,
    ];

    const blueIncrementRow = [
      "Blue",
      0,
      latestResultCount?.resultCount,
      previousResults?.bigEyeBoy_numPosRow + 1,
      latestResults?.results_id,
    ];

    const blueIncrementColumn = [
      "Blue",
      0,
      previousResults?.bigEyeBoy_numPosCol + 1,
      previousResults?.bigEyeBoy_numPosRow,
      latestResults?.results_id,
    ];

    const redIncrementRow = [
      "Red",
      0,
      latestResultCount?.resultCount,
      previousResults?.bigEyeBoy_numPosRow + 1,
      latestResults?.results_id,
    ];

    const redIncrementColumn = [
      "Red",
      0,
      previousResults?.bigEyeBoy_numPosCol + 1,
      previousResults?.bigEyeBoy_numPosRow,
      latestResults?.results_id,
    ];

    const isFirstColumnLessThanSecondColumn =
      firstColumnLength < secondColumnLength;

    const isFirstColumnGreaterThanSecondColumn =
      firstColumnLength > secondColumnLength;

    const isFirstColumnEqualToSecondColumn =
      firstColumnLength == secondColumnLength;

    const isSecondColumnEqualToThirdColumn =
      secondColumnLength == thirdColumnLength;

    const isFirstSecondThirdColumnEqual =
      isFirstColumnEqualToSecondColumn && isSecondColumnEqualToThirdColumn;

    if (
      (isColRowTwoFound || isColRowThreeFound) &&
      isPrevNameResultNotMatchToCurrent &&
      defaultLatestResults?.result_name !== "Tie"
    ) {
      if (isFirstColumnLessThanSecondColumn) {
        if (isSecondColumnEqualToThirdColumn) {
          if (previousResults?.bigEyeBoy_numPosRow > 5) {
            await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
          } else {
            await databaseQuery(queryInsertBigEyeBoyData, redIncrementRow);
          }
        } else if (previousResults?.bigEyeBoy_resultName == "Blue") {
          if (previousResults?.bigEyeBoy_numPosRow > 5) {
            await databaseQuery(queryInsertBigEyeBoyData, blueIncrementColumn);
          } else {
            await databaseQuery(queryInsertBigEyeBoyData, blueIncrementRow);
          }
        } else {
          await databaseQuery(queryInsertBigEyeBoyData, blueResetColumn);
        }
      } else if (isFirstColumnEqualToSecondColumn) {
        if (isFirstSecondThirdColumnEqual) {
          if (previousResults?.bigEyeBoy_resultName == "Red") {
            if (previousResults?.bigEyeBoy_numPosRow > 5) {
              await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
            } else {
              await databaseQuery(queryInsertBigEyeBoyData, redIncrementRow);
            }
          } else {
            await databaseQuery(queryInsertBigEyeBoyData, redResetColumn);
          }
        } else {
          if (previousResults?.bigEyeBoy_resultName == "Red") {
            await databaseQuery(queryInsertBigEyeBoyData, blueResetColumn);
          } else {
            await databaseQuery(queryInsertBigEyeBoyData, blueIncrementRow);
          }
        }
      }
    } else {
      const isColRowTwoOrThreeFound = isColRowTwoFound || isColRowThreeFound;
      const isResultNameNotTie = defaultLatestResults?.result_name !== "Tie";
      if (
        isColRowTwoOrThreeFound &&
        isLatestResultsReachColRowTwo &&
        isResultNameNotTie
      ) {
        if (
          isFirstColumnLessThanSecondColumn ||
          isFirstColumnEqualToSecondColumn
        ) {
          if (previousResults?.bigEyeBoy_resultName == "Blue") {
            await databaseQuery(queryInsertBigEyeBoyData, redResetColumn);
          } else {
            if (previousResults?.bigEyeBoy_numPosRow > 5) {
              await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
            } else {
              await databaseQuery(queryInsertBigEyeBoyData, redIncrementRow);
            }
          }
        } else if (secondColumnLength == firstColumnLength - 1) {
          if (previousResults?.bigEyeBoy_resultName == "Blue") {
            await databaseQuery(queryInsertBigEyeBoyData, blueIncrementRow);
          } else {
            await databaseQuery(queryInsertBigEyeBoyData, blueResetColumn);
          }
        } else if (isFirstColumnGreaterThanSecondColumn) {
          if (previousResults?.bigEyeBoy_resultName == "Blue") {
            await databaseQuery(queryInsertBigEyeBoyData, redResetColumn);
          } else if (previousResults?.bigEyeBoy_numPosRow > 5) {
            await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
          } else {
            await databaseQuery(queryInsertBigEyeBoyData, redIncrementRow);
          }
        }
      }
    }

    const resultsData = await databaseQuery(queryGetAllBigEyeBoyResults);

    const data = {
      bigEyeBoyData: resultsData,
      predictionsData: {
        isRowColTwoOrThreeFound: isColRowTwoFound || isColRowThreeFound,
        isBigEyeBoyHasData: isColRowTwoFound || isColRowThreeFound,
        bigEyeBoy: {
          banker: bigEyeBoyPrediction("Banker"),
          player: bigEyeBoyPrediction("Player"),
        },
      },
    };

    return res.status(OK).send(data);
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
