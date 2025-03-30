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
    "SELECT result_name, num_posCol FROM tb_results WHERE result_name != 'Tie' order by result_count desc LIMIT 4";

  const queryGetLatestResults =
    "SELECT * FROM tb_results WHERE result_name != 'Tie' order by results_id desc LIMIT 1";

  const queryGetLatestSmallRoadResults =
    "SELECT sr_name, sr_col, sr_row FROM tb_results WHERE result_name != 'Tie' AND sr_name != '' AND sr_col != '' AND sr_row != ''  order by results_id desc";

  const queryFindColRowResultsFromSmallRoad =
    "SELECT results_id, sr_col, sr_row FROM tb_results WHERE num_posCol = ? AND num_posRow = ?";

  const queryGetCockroachPigResults =
    "SELECT cp_name, cp_col, cp_row FROM tb_results WHERE result_name != 'Tie' AND cp_name != '' AND cp_col != '' AND cp_row != '' order by results_id desc";

  try {
    const getCockroachPigResults = await databaseQuery(
      queryGetCockroachPigResults
    );

    const getThreeLatestResults = await databaseQuery(
      queryGetThreeLatestColResults
    );

    const threeLatestResults = getThreeLatestResults;
    const firstLatestColResults = threeLatestResults[0];
    const secondLatestColResults = threeLatestResults[1];
    const thirdLatestColResults = threeLatestResults[2];
    const fourthLatestColResults = threeLatestResults[3];

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

    const fourthAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [fourthLatestColResults?.result_count]
    );

    const firstColumnLength = firstAllColumnDataFromResults.length;
    const secondColumnLength = secondAllColumnDataFromResults.length;
    const thirdColumnLength = thirdAllColumnDataFromResults.length;
    const fourthColumnLength = fourthAllColumnDataFromResults.length;

    const getLatestResults = await databaseQuery(queryGetLatestResults);
    const latestResults = getLatestResults[0];

    const getLatestSmallRoadResults = await databaseQuery(
      queryGetLatestSmallRoadResults
    );

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

    const findColThreeRowTwo = await databaseQuery(
      queryFindColRowResultsFromSmallRoad,
      [3, 2]
    );

    const findColFourRowOne = await databaseQuery(
      queryFindColRowResultsFromSmallRoad,
      [4, 1]
    );

    const isSmallRoadHasData =
      findColFourRowOne.length > 0 || findColThreeRowTwo.length > 0;

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

    function smallRoadPredictionLogic(leadName) {
      if (leadName == "Banker") {
        if (isCurrentResultsBlue) {
          if (firstColumnLength == thirdColumnLength) {
            return "Red";
          } else if (firstColumnLength > thirdColumnLength) {
            return "Blue";
          } else {
            return "Blue";
          }
        } else {
          if (firstColumnLength == thirdColumnLength) {
            return "Blue";
          } else if (firstColumnLength > thirdColumnLength) {
            return "Red";
          } else {
            return "Red";
          }
        }
      } else if (leadName == "Player") {
        if (isCurrentResultsRed) {
          if (firstColumnLength == thirdColumnLength) {
            return "Red";
          } else if (firstColumnLength > thirdColumnLength) {
            return "Blue";
          } else {
            return "Blue";
          }
        } else {
          if (firstColumnLength == thirdColumnLength) {
            return "Blue";
          } else if (firstColumnLength > thirdColumnLength) {
            return "Red";
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
      smallRoadData: getLatestSmallRoadResults,
      cockroachPigData: getCockroachPigResults,
      predictionsData: {
        isRowColTwoOrThreeFound:
          isColRowTwoFound || isColRowThreeFound
            ? isColRowTwoFound || isColRowThreeFound
            : null,
        isBigEyeBoyHasData:
          isColRowTwoFound || isColRowThreeFound
            ? isColRowTwoFound || isColRowThreeFound
            : null,
        isSmallRoadHasData: isSmallRoadHasData,
        isCockroachPigHasData: false,
        bigEyeBoy: {
          banker: bigEyeBoyPrediction("Banker")
            ? bigEyeBoyPrediction("Banker")
            : null,
          player: bigEyeBoyPrediction("Player")
            ? bigEyeBoyPrediction("Player")
            : null,
        },
        smallRoad: {
          banker: smallRoadPredictionLogic("Banker"),
          player: smallRoadPredictionLogic("Player"),
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

  const queryGetLatestSmallRoadResults =
    "SELECT sr_name, sr_col, sr_row FROM tb_results WHERE result_name != 'Tie' AND sr_name != '' AND sr_col != '' AND sr_row != '' order by results_id desc";

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

      function smallRoadPredictionLogic(leadName) {
        if (leadName == "Banker") {
          if (isCurrentResultsBlue) {
            if (firstColumnLength == thirdColumnLength) {
              return "Red";
            } else if (firstColumnLength > thirdColumnLength) {
              return "Blue";
            } else {
              return "Blue";
            }
          } else {
            if (firstColumnLength == thirdColumnLength) {
              return "Blue";
            } else if (firstColumnLength > thirdColumnLength) {
              return "Red";
            } else {
              return "Red";
            }
          }
        } else if (leadName == "Player") {
          if (isCurrentResultsRed) {
            if (firstColumnLength == thirdColumnLength) {
              return "Red";
            } else if (firstColumnLength > thirdColumnLength) {
              return "Blue";
            } else {
              return "Blue";
            }
          } else {
            if (firstColumnLength == thirdColumnLength) {
              return "Blue";
            } else if (firstColumnLength > thirdColumnLength) {
              return "Red";
            } else {
              return "Red";
            }
          }
        }
      }

      const smallRoadResults = await databaseQuery(
        queryGetLatestSmallRoadResults
      );

      const isSmallRoadHasData = smallRoadResults.length > 0;

      return res.status(OK).send({
        bigRoadData: resultsQueryGetResultsExceptTie,
        bigEyeBoyData: getAllBigEyeBoyResults,
        markerRoadData: resultsQueryGetResults,
        smallRoadData: smallRoadResults,
        predictionsData: {
          isRowColTwoOrThreeFound: isColRowTwoOrThreeFound
            ? isColRowTwoFound || isColRowThreeFound
            : null,
          isBigEyeBoyHasData: isColRowTwoOrThreeFound
            ? isColRowTwoFound || isColRowThreeFound
            : null,
          isSmallRoadHasData: isSmallRoadHasData,
          bigEyeBoy: {
            banker: bigEyeBoyPrediction("Banker"),
            player: bigEyeBoyPrediction("Player"),
          },
          smallRoad: {
            banker: smallRoadPredictionLogic("Banker"),
            player: smallRoadPredictionLogic("Player"),
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
        const isLatestResultCountHasValue = !latestResultCount
          ? 1
          : latestResultCount?.result_count + 1;

        await databaseQuery(queryAddResults, [
          result_name,
          isLatestResultCountHasValue,
          0,
          1,
          resultsUsingColumn?.num_posCol + 1,
          1,
          isLatestResultCountHasValue,
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
        const secRoleResultsCol = secondaryResult.group_count;
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
                secRoleResultsCol + 1,
                1,
                latestResultCount?.result_count + 1,
              ]);
            } else {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                1,
                secRoleResultsCol + 1,
                currentResults?.num_posRow,
                latestResultCount?.result_count,
              ]);
            }
          } else {
            if (secondaryResult?.result_name == "Player") {
              await databaseQuery(queryAddResults, [
                result_name,
                latestResultCount?.result_count + 1,
                0,
                0,
                secRoleResultsCol + 1,
                1,
                latestResultCount?.result_count + 1,
              ]);
            } else if (isAdvanceNumColAndRowTaken()) {
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
        const isLatestResultCountHasValue = !latestResultCount
          ? 1
          : latestResultCount?.result_count + 1;

        await databaseQuery(queryAddResults, [
          result_name,
          isLatestResultCountHasValue,
          0,
          1,
          resultsUsingColumn?.num_posCol + 1,
          1,
          isLatestResultCountHasValue,
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

        const secRoleResultsCol = secondaryResult.group_count;
        const secResultsCol = secondaryResult.num_posCol;
        const secResultsRow = secondaryResult.num_posRow;
        const secResultName = secondaryResult.result_name;
        const isSecondaryRoleFound = !isSecondResultNotFound;

        // is secondary results is exist?
        if (isSecondaryRoleFound) {
          if (secResultsRow >= 6) {
            if (secResultName == "Banker") {
              await databaseQuery(queryAddResults, [
                result_name,
                latestResultCount?.result_count + 1,
                0,
                1,
                secRoleResultsCol + 1,
                1,
                latestResultCount?.result_count + 1,
              ]);
            } else {
              await databaseQuery(queryAddResults, [
                result_name,
                0,
                0,
                1,
                secRoleResultsCol + 1,
                currentResults?.num_posRow,
                latestResultCount?.result_count,
              ]);
            }
          } else {
            if (secondaryResult?.result_name == "Banker") {
              await databaseQuery(queryAddResults, [
                result_name,
                latestResultCount?.result_count + 1,
                0,
                0,
                secRoleResultsCol + 1,
                1,
                latestResultCount?.result_count + 1,
              ]);
            } else if (isAdvanceNumColAndRowTaken()) {
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
    // const getLatesResults = await databaseQuery(queryGetLatestResults);
    // const queryResults = getLatesResults[0];

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

  const queryGetLatestResultsFromSmallRoad =
    "SELECT sr_name, sr_col, sr_row FROM tb_results WHERE result_name != 'Tie' AND sr_name != '' AND sr_col != '' AND sr_row != '' order by results_id desc LIMIT 1";

  const queryGetLatestResultsFromCockroachPig =
    "SELECT cp_name, cp_col, cp_row FROM tb_results WHERE result_name != 'Tie' AND cp_name != '' AND cp_col != '' AND cp_row != '' order by results_id desc LIMIT 1";

  const queryFindColRowResults =
    "SELECT results_id, num_posCol, num_posRow FROM tb_results WHERE num_posCol = ? AND num_posRow = ?";

  const queryFindColRowResultsFromSmallRoad =
    "SELECT results_id, sr_col, sr_row FROM tb_results WHERE num_posCol = ? AND num_posRow = ?";

  const queryFindColRowResultsFromCockroachPig =
    "SELECT results_id, cp_col, cp_row FROM tb_results WHERE num_posCol = ? AND num_posRow = ?";

  const queryGetAllBigEyeBoyResults =
    "SELECT bigEyeBoy_resultName as `name`, bigEyeBoy_numPosCol as `column`, bigEyeBoy_numPosRow as `row` FROM tb_results WHERE result_name != 'Tie' AND bigEyeBoy_resultName != ''";

  const queryGetThreeLatestColResults =
    "SELECT result_name, result_count FROM tb_results WHERE result_name != 'Tie' order by result_count desc LIMIT 4";

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

  const queryGetLatestBigEyeBoyResultCount =
    "SELECT results_id, bigEyeBoy_resultCount FROM tb_results WHERE bigEyeBoy_resultCount != 0 ORDER BY results_id desc LIMIT 1";

  const queryGetLatestItemOnBigEyeBoy =
    "SELECT results_id, bigEyeBoy_numPosRow FROM tb_results WHERE results_id BETWEEN ? AND ?";

  const queryUpdateSmallRoadResults =
    "UPDATE tb_results SET sr_name = ?, sr_grpCount = ?, sr_col = ?, sr_row = ? WHERE results_id = ?";

  const queryUpdateCockroachPigResults =
    "UPDATE tb_results SET cp_name = ?, cp_grpCount = ?, cp_col = ?, cp_row = ? WHERE results_id = ?";

  const queryGetLatestSmallRoadResults =
    "SELECT sr_name, sr_col, sr_row FROM tb_results WHERE result_name != 'Tie' AND sr_name != '' AND sr_col != '' AND sr_row != '' order by results_id desc";

  const queryGetCockroachRoadResults =
    "SELECT cp_name, cp_col, cp_row FROM tb_results WHERE result_name != 'Tie' AND cp_name != '' AND cp_col != '' AND cp_row != '' order by results_id desc";

  const queryGetLatestGroupCountFromSmallRoad =
    "SELECT results_id, sr_grpCount FROM tb_results WHERE sr_grpCount != 0 order by results_id desc LIMIT 1";

  const queryGetLatestGroupCountFromCockroachPig =
    "SELECT results_id, cp_grpCount FROM tb_results WHERE cp_grpCount != 0 order by results_id desc LIMIT 1";

  const queryGetTwoLatestGroupCountFromSmallRoad =
    "SELECT results_id, sr_name, sr_col, sr_row FROM tb_results WHERE result_name != 'Tie' AND sr_name != '' AND sr_col != '' AND sr_row != '' order by results_id desc LIMIT 2";

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
    const fourthLatestColResults = threeLatestResults[3];

    const firstAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [firstLatestColResults?.result_count]
    );

    const secondAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [secondLatestColResults?.result_count]
    );

    const thirdAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [thirdLatestColResults?.result_count]
    );

    const fourthAllColumnDataFromResults = await databaseQuery(
      queryGetAllColumnDataFromResults,
      [fourthLatestColResults?.result_count]
    );

    const getLatestBigEyeBoyResultCount = await databaseQuery(
      queryGetLatestBigEyeBoyResultCount
    );

    const latestBigEyeBoyResultCount = getLatestBigEyeBoyResultCount[0];
    const resultsIdFromBigEyeBoyResultsCount =
      latestBigEyeBoyResultCount?.results_id;

    const getDefaultLatestResults = await databaseQuery(
      queryGetDefaultLatestResults
    );
    const defaultLatestResults = getDefaultLatestResults[0];

    const getLatestResults = await databaseQuery(queryGetLatestResults);
    const latestResults = getLatestResults[0];

    const getLatestItemOnBigEyeBoy = await databaseQuery(
      queryGetLatestItemOnBigEyeBoy,
      [resultsIdFromBigEyeBoyResultsCount, latestResults?.results_id]
    );

    const findDuplicateItemOnBigEyeBoy = getLatestItemOnBigEyeBoy.filter(
      (item, index) =>
        item.bigEyeBoy_numPosRow ==
          getLatestItemOnBigEyeBoy[index + 1]?.bigEyeBoy_numPosRow &&
        item.bigEyeBoy_numPosRow != null
    );

    const hasDuplicateItemOnBigEyeBoy = findDuplicateItemOnBigEyeBoy.length > 0;

    function isRowColTaken(resultName) {
      const futurePreviousRow = previousResults?.bigEyeBoy_numPosRow + 1;
      const defaultPrevioustCol = previousResults?.bigEyeBoy_numPosCol;
      const defaultPreviousRow = previousResults?.bigEyeBoy_numPosRow;

      const isRowColFound = findBigEyeBoyResultsUsingRowColToLatest.some(
        (res) =>
          (res.bigEyeBoy_numPosRow == futurePreviousRow &&
            res.bigEyeBoy_numPosCol == defaultPrevioustCol) ||
          (res.bigEyeBoy_numPosRow == futurePreviousRow &&
            res.bigEyeBoy_numPosCol == defaultPrevioustCol &&
            res.bigEyeBoy_resultName == resultName)
      );

      const isColFound = findBigEyeBoyResultsUsingRowColToLatest.some(
        (res) =>
          res.bigEyeBoy_numPosCol + 1 == defaultPrevioustCol &&
          res.bigEyeBoy_numPosRow == defaultPreviousRow + 1 &&
          res.bigEyeBoy_numPosCol + 1 == defaultPrevioustCol &&
          res.bigEyeBoy_numPosRow == defaultPreviousRow + 1 &&
          res.bigEyeBoy_resultName == resultName
      );

      return isRowColFound || isColFound;
    }

    const isColRowTwoHandleCurrentResults =
      latestResults?.num_posCol == 2 && latestResults?.num_posRow == 2;
    const isColRowThreeHandleCurrentResults =
      latestResults?.num_posCol == 3 && latestResults?.num_posRow == 1;

    const firstColumnLength = firstAllColumnDataFromResults.length;
    const secondColumnLength = secondAllColumnDataFromResults.length;
    const thirdColumnLength = thirdAllColumnDataFromResults.length;
    const fourthColumnLength = fourthAllColumnDataFromResults.length;

    const isCurrentResultsBlue = latestResults?.result_name == "Player";
    const isCurrentResultsRed = latestResults?.result_name == "Banker";

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

    const isPrevResultNotEqualToOne =
      previousResults?.bigEyeBoy_numPosRow != 1
        ? latestResultCount?.resultCount + 1
        : previousResults?.bigEyeBoy_numPosCol + 1;

    const redResetColumn = [
      "Red",
      isPrevResultNotEqualToOne,
      isPrevResultNotEqualToOne,
      1,
      latestResults?.results_id,
    ];

    const blueResetColumn = [
      "Blue",
      isPrevResultNotEqualToOne,
      isPrevResultNotEqualToOne,
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

    const isColTwoOrThreeFound = isColRowTwoFound || isColRowThreeFound;
    const isLatestResultsNotTie = defaultLatestResults?.result_name !== "Tie";
    const isCurrResultsNotMatch =
      isColTwoOrThreeFound &&
      isLatestResultsNotTie &&
      isPrevNameResultNotMatchToCurrent;

    if (isCurrResultsNotMatch) {
      if (isFirstColumnLessThanSecondColumn) {
        if (isSecondColumnEqualToThirdColumn) {
          if (previousResults?.bigEyeBoy_resultName == "Blue") {
            await databaseQuery(queryInsertBigEyeBoyData, redResetColumn);
          } else if (previousResults?.bigEyeBoy_numPosRow > 5) {
            await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
          } else {
            if (isRowColTaken("Red")) {
              await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
            } else {
              if (hasDuplicateItemOnBigEyeBoy) {
                await databaseQuery(
                  queryInsertBigEyeBoyData,
                  redIncrementColumn
                );
              } else {
                await databaseQuery(queryInsertBigEyeBoyData, redIncrementRow);
              }
            }
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
              if (
                isRowColTaken("Red") ||
                previousResults?.bigEyeBoy_numPosRow > 5
              ) {
                await databaseQuery(
                  queryInsertBigEyeBoyData,
                  redIncrementColumn
                );
              } else {
                if (hasDuplicateItemOnBigEyeBoy) {
                  await databaseQuery(
                    queryInsertBigEyeBoyData,
                    redIncrementColumn
                  );
                } else {
                  await databaseQuery(
                    queryInsertBigEyeBoyData,
                    redIncrementRow
                  );
                }
              }
            }
          } else {
            await databaseQuery(queryInsertBigEyeBoyData, redResetColumn);
          }
        } else {
          if (previousResults?.bigEyeBoy_resultName == "Red") {
            await databaseQuery(queryInsertBigEyeBoyData, blueResetColumn);
          } else {
            if (previousResults?.bigEyeBoy_numPosRow > 5) {
              await databaseQuery(
                queryInsertBigEyeBoyData,
                blueIncrementColumn
              );
            } else {
              await databaseQuery(queryInsertBigEyeBoyData, blueIncrementRow);
            }
          }
        }
      }
    } else {
      const isColRowTwoOrThreeFound = isColRowTwoFound || isColRowThreeFound;
      const isResultNameNotTie = defaultLatestResults?.result_name !== "Tie";
      const isCurrResultsMatch =
        isColRowTwoOrThreeFound &&
        isLatestResultsReachColRowTwo &&
        isResultNameNotTie;

      if (isCurrResultsMatch) {
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
              if (
                isRowColTaken("Red") ||
                previousResults?.bigEyeBoy_numPosRow > 5
              ) {
                await databaseQuery(
                  queryInsertBigEyeBoyData,
                  redIncrementColumn
                );
              } else {
                if (hasDuplicateItemOnBigEyeBoy) {
                  await databaseQuery(
                    queryInsertBigEyeBoyData,
                    redIncrementColumn
                  );
                } else {
                  await databaseQuery(
                    queryInsertBigEyeBoyData,
                    redIncrementRow
                  );
                }
              }
            }
          }
        } else if (secondColumnLength == firstColumnLength - 1) {
          if (previousResults?.bigEyeBoy_resultName == "Blue") {
            if (previousResults?.bigEyeBoy_numPosRow > 5) {
              await databaseQuery(
                queryInsertBigEyeBoyData,
                blueIncrementColumn
              );
            } else {
              await databaseQuery(queryInsertBigEyeBoyData, blueIncrementRow);
            }
          } else {
            await databaseQuery(queryInsertBigEyeBoyData, blueResetColumn);
          }
        } else if (isFirstColumnGreaterThanSecondColumn) {
          if (previousResults?.bigEyeBoy_resultName == "Blue") {
            await databaseQuery(queryInsertBigEyeBoyData, redResetColumn);
          } else if (
            isRowColTaken("Red") ||
            previousResults?.bigEyeBoy_numPosRow > 5
          ) {
            // if (previousResults?.bigEyeBoy_numPosRow == 1) {
            //   await databaseQuery(
            //     queryInsertBigEyeBoyData,
            //     redIncrementColumnAndResultCount
            //   );
            // } else {
            //   await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
            // }
            await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
          } else {
            if (hasDuplicateItemOnBigEyeBoy) {
              // if (previousResults?.bigEyeBoy_numPosRow == 1) {
              //   await databaseQuery(
              //     queryInsertBigEyeBoyData,
              //     redIncrementColumnAndResultCount
              //   );
              // } else {
              //   await databaseQuery(
              //     queryInsertBigEyeBoyData,
              //     redIncrementColumn
              //   );
              // }
              await databaseQuery(queryInsertBigEyeBoyData, redIncrementColumn);
            } else {
              await databaseQuery(queryInsertBigEyeBoyData, redIncrementRow);
            }
          }
        }
      }
    }

    const findColThreeRowTwo = await databaseQuery(
      queryFindColRowResultsFromSmallRoad,
      [3, 2]
    );

    const findColFourRowOne = await databaseQuery(
      queryFindColRowResultsFromSmallRoad,
      [4, 1]
    );

    const getAllLatestSmallRoadResults = await databaseQuery(
      queryGetLatestSmallRoadResults
    );

    const getLatestResultsFromSmallRoad = await databaseQuery(
      queryGetLatestResultsFromSmallRoad
    );

    const getLatestGroupCountFromSmallRoad = await databaseQuery(
      queryGetLatestGroupCountFromSmallRoad
    );

    const getTwoLatestGroupCountFromSmallRoad = await databaseQuery(
      queryGetTwoLatestGroupCountFromSmallRoad
    );

    const firstResultsFromSmallRoad = getTwoLatestGroupCountFromSmallRoad[0];
    const secondResultsFromSmallRoad = getTwoLatestGroupCountFromSmallRoad[1];

    const isFirstAndSecondRowResultsEqual =
      firstResultsFromSmallRoad?.sr_row == secondResultsFromSmallRoad?.sr_row &&
      firstResultsFromSmallRoad?.sr_name == secondResultsFromSmallRoad?.sr_name;

    const smallRoadLatestGrpCount =
      getLatestGroupCountFromSmallRoad[0]?.sr_grpCount;

    const previousResultsSmallRoad = getLatestResultsFromSmallRoad[0];

    const latestPosCol = latestResults?.num_posCol;
    const latestPosRow = latestResults?.num_posRow;

    const allLatestSmallRoadResults = getAllLatestSmallRoadResults;
    const isSmallRoadHasData = getAllLatestSmallRoadResults.length > 0;

    const smallRoadPrevCol = previousResultsSmallRoad?.sr_col;
    const smallRoadPrevRow = previousResultsSmallRoad?.sr_row;
    const smallRoadPrevName = previousResultsSmallRoad?.sr_name;

    const isColRowSmallRoadResultsTaken = (resultsName) => {
      const isColRowTaken = allLatestSmallRoadResults.some(
        (res) =>
          res.sr_col == smallRoadPrevCol && res.sr_row == smallRoadPrevRow + 1
      );

      const isColRowWithNameTaken = allLatestSmallRoadResults.find(
        (res) =>
          res.sr_col + 1 == smallRoadPrevCol &&
          res.sr_row == smallRoadPrevRow + 1 &&
          res.sr_name == resultsName
      );

      return isColRowTaken || isColRowWithNameTaken;
    };

    const srIncrementPrevCol = smallRoadPrevCol + 1;
    const srIncrementPrevRow = smallRoadPrevRow + 1;
    const srIncrementPrevGrpCount = smallRoadLatestGrpCount + 1;
    const isPrevResultNotEqualToCurrent =
      smallRoadPrevRow != 1 ? srIncrementPrevGrpCount : smallRoadPrevCol + 1;

    const bigRoadPrevCol = latestResults?.num_posCol;
    const bigRoadPrevRow = latestResults?.num_posRow;

    const smallRoadRedIncrementRow = [
      "Red", // sr_name
      !smallRoadLatestGrpCount ? 1 : 0,
      isSmallRoadHasData ? smallRoadPrevCol : 1, // sr_col
      isSmallRoadHasData ? srIncrementPrevRow : 1, // sr_row
      latestResults?.results_id, // results_id
    ];

    const smallRoadRedIncrementColumn = [
      "Red", // sr_name
      !smallRoadLatestGrpCount ? 1 : 0,
      isSmallRoadHasData ? srIncrementPrevCol : 1, // sr_col
      isSmallRoadHasData ? smallRoadPrevRow : 1, // sr_row
      latestResults?.results_id, // results_id
    ];

    const smallRoadRedResetColumn = [
      "Red", // sr_name
      !smallRoadLatestGrpCount ? 1 : isPrevResultNotEqualToCurrent,
      isSmallRoadHasData ? isPrevResultNotEqualToCurrent : 1, // sr_col
      isSmallRoadHasData ? 1 : 1, // sr_row
      latestResults?.results_id, // results_id
    ];

    const smallRoadBlueResetColumn = [
      "Blue", // sr_name
      !smallRoadLatestGrpCount ? 1 : isPrevResultNotEqualToCurrent,
      isSmallRoadHasData ? isPrevResultNotEqualToCurrent : 1, // sr_col
      isSmallRoadHasData ? 1 : 1, // sr_row
      latestResults?.results_id, // results_id
    ];

    const smallRoadBlueIncrementColumn = [
      "Blue", // sr_name
      !smallRoadLatestGrpCount ? 1 : 0,
      isSmallRoadHasData ? srIncrementPrevCol : 1, // sr_col
      isSmallRoadHasData ? smallRoadPrevRow : 1, // sr_row
      latestResults?.results_id, // results_id
    ];

    const smallRoadBlueIncrementRow = [
      "Blue", // sr_name
      !smallRoadLatestGrpCount ? 1 : 0,
      isSmallRoadHasData ? smallRoadPrevCol : 1, // sr_col
      isSmallRoadHasData ? srIncrementPrevRow : 1, // sr_row
      latestResults?.results_id, // results_id
    ];

    const isFirstColRowResultsFound =
      (latestPosCol == 3 && latestPosRow == 2) ||
      (latestPosCol == 4 && latestPosRow == 1);

    const isSmallRoadData =
      findColFourRowOne.length > 0 || findColThreeRowTwo.length > 0;

    if (
      isFirstColRowResultsFound ||
      (isSmallRoadData && isLatestResultsNotTie)
    ) {
      if (firstColumnLength < thirdColumnLength) {
        if (bigRoadPrevRow < 2 && firstColumnLength < 2) {
          if (secondColumnLength != fourthColumnLength) {
            if (smallRoadPrevName == "Blue") {
              if (
                isColRowSmallRoadResultsTaken("Blue") ||
                isFirstAndSecondRowResultsEqual
              ) {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadBlueIncrementColumn
                );
              } else {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadBlueIncrementRow
                );
              }
            } else {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadBlueResetColumn
              );
            }
          } else {
            if (smallRoadPrevName == "Red") {
              if (smallRoadPrevRow > 5) {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementColumn
                );
              } else {
                if (isColRowSmallRoadResultsTaken("Red")) {
                  await databaseQuery(
                    queryUpdateSmallRoadResults,
                    smallRoadRedIncrementColumn
                  );
                } else {
                  if (isFirstAndSecondRowResultsEqual) {
                    await databaseQuery(
                      queryUpdateSmallRoadResults,
                      smallRoadRedIncrementColumn
                    );
                  } else {
                    await databaseQuery(
                      queryUpdateSmallRoadResults,
                      smallRoadRedIncrementRow
                    );
                  }
                }
              }
            } else {
              if (smallRoadPrevName == "Blue") {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedResetColumn
                );
              } else {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementColumn
                );
              }
            }
          }
        } else if (bigRoadPrevRow < 3 && firstColumnLength < 3) {
          if (smallRoadPrevName == "Blue") {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadRedResetColumn
            );
          } else if (smallRoadPrevName == "Red") {
            if (smallRoadPrevRow > 5) {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadRedIncrementColumn
              );
            } else {
              if (isFirstAndSecondRowResultsEqual) {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementColumn
                );
              } else {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementRow
                );
              }
            }
          } else {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadRedResetColumn
            );
          }
        } else {
          if (smallRoadPrevRow > 5) {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadRedIncrementColumn
            );
          } else {
            if (
              isColRowSmallRoadResultsTaken("Red") ||
              isFirstAndSecondRowResultsEqual
            ) {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadRedIncrementColumn
              );
            } else {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadRedIncrementRow
              );
            }
          }
        }
      } else if (firstColumnLength == thirdColumnLength) {
        if (bigRoadPrevRow < 2 && firstColumnLength < 2) {
          if (secondColumnLength != fourthColumnLength) {
            if (smallRoadPrevName == "Blue") {
              if (
                isColRowSmallRoadResultsTaken("Blue") ||
                isFirstAndSecondRowResultsEqual
              ) {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadBlueIncrementColumn
                );
              } else {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadBlueIncrementRow
                );
              }
            } else {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadBlueResetColumn
              );
            }
          } else {
            if (smallRoadPrevName == "Red") {
              if (smallRoadPrevRow > 5) {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementColumn
                );
              } else {
                if (isColRowSmallRoadResultsTaken("Red")) {
                  await databaseQuery(
                    queryUpdateSmallRoadResults,
                    smallRoadRedIncrementColumn
                  );
                } else {
                  if (isFirstAndSecondRowResultsEqual) {
                    await databaseQuery(
                      queryUpdateSmallRoadResults,
                      smallRoadRedIncrementColumn
                    );
                  } else {
                    await databaseQuery(
                      queryUpdateSmallRoadResults,
                      smallRoadRedIncrementRow
                    );
                  }
                }
              }
            } else {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadRedResetColumn
              );
            }
          }
        } else if (bigRoadPrevRow < 3 && firstColumnLength < 3) {
          if (smallRoadPrevName == "Blue") {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadRedResetColumn
            );
          } else if (smallRoadPrevName == "Red") {
            if (smallRoadPrevRow > 5) {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadRedIncrementColumn
              );
            } else {
              if (isFirstAndSecondRowResultsEqual) {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementColumn
                );
              } else {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementRow
                );
              }
            }
          } else {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadRedResetColumn
            );
          }
        } else {
          if (isFirstAndSecondRowResultsEqual) {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadRedIncrementColumn
            );
          } else {
            if (smallRoadPrevRow > 5) {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadRedIncrementColumn
              );
            } else {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadRedIncrementRow
              );
            }
          }
        }
      } else if (thirdColumnLength == firstColumnLength - 1) {
        if (smallRoadPrevName == "Blue") {
          if (
            isColRowSmallRoadResultsTaken("Blue") ||
            isFirstAndSecondRowResultsEqual
          ) {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadBlueIncrementColumn
            );
          } else {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadBlueIncrementRow
            );
          }
        } else {
          await databaseQuery(
            queryUpdateSmallRoadResults,
            smallRoadBlueResetColumn
          );
        }
      } else if (firstColumnLength > thirdColumnLength) {
        if (smallRoadPrevName == "Blue") {
          await databaseQuery(
            queryUpdateSmallRoadResults,
            smallRoadRedResetColumn
          );
        } else {
          if (smallRoadPrevRow > 5) {
            await databaseQuery(
              queryUpdateSmallRoadResults,
              smallRoadRedIncrementColumn
            );
          } else {
            if (isColRowSmallRoadResultsTaken("Red")) {
              await databaseQuery(
                queryUpdateSmallRoadResults,
                smallRoadRedIncrementColumn
              );
            } else {
              if (isFirstAndSecondRowResultsEqual) {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementColumn
                );
              } else {
                await databaseQuery(
                  queryUpdateSmallRoadResults,
                  smallRoadRedIncrementRow
                );
              }
            }
          }
        }
      }
    }

    const findColFourRowTwoResultsFromCockroachPig = await databaseQuery(
      queryFindColRowResultsFromCockroachPig,
      [4, 2]
    );

    const findColFiveRowOneResultsFromCockroachPig = await databaseQuery(
      queryFindColRowResultsFromCockroachPig,
      [5, 1]
    );

    const getLatestGroupCountFromCockroachPig = await databaseQuery(
      queryGetLatestGroupCountFromCockroachPig
    );

    const getAllCockroachPigResults = await databaseQuery(
      queryGetCockroachRoadResults
    );

    const isCockroachPigDataFound = getAllCockroachPigResults.length > 0;
    console.log(getAllCockroachPigResults);

    const getLatestResultsFromCockroachPig = await databaseQuery(
      queryGetLatestResultsFromCockroachPig
    );

    const latestResultsFromCockroachPig = getLatestResultsFromCockroachPig[0];

    const latestGroupCountFromCockroachPig =
      getLatestGroupCountFromCockroachPig[0]?.cp_grpCount;

    const cpLatestName = latestResultsFromCockroachPig?.cp_name;
    const cpLatestCol = latestResultsFromCockroachPig?.cp_col;
    const cpLatestRow = latestResultsFromCockroachPig?.cp_row;

    const cpIncrementGroupCount = latestGroupCountFromCockroachPig + 1;
    const cpIncrementCol = cpLatestCol + 1;
    const cpIncrementRow = cpLatestRow + 1;

    const cpIsPrevResultsNotEqualToOne =
      cpLatestCol != 1 ? cpIncrementGroupCount : cpIncrementCol;
    // console.log("cpIncrementGroupCount: ", cpIncrementGroupCount);
    // console.log("cpLatestName: ", cpLatestName);
    // console.log("cpLatestCol: ", cpLatestCol);
    // console.log("cpLatestRow: ", cpLatestRow);

    const colFourRowTwoResultsFromCockroachPig =
      findColFourRowTwoResultsFromCockroachPig.length > 0;
    const colFiveRowOneResultsFromCockroachPig =
      findColFiveRowOneResultsFromCockroachPig.length > 0;

    const isCockroachPigHasData =
      colFourRowTwoResultsFromCockroachPig ||
      colFiveRowOneResultsFromCockroachPig;

    const isFirstColRowResultsOnCockroachPigFound =
      (latestPosCol == 4 && latestPosRow == 2) ||
      (latestPosCol == 5 && latestPosRow == 1);

    const isColRowCockroachPigResultsTaken = (cp_name) => {
      const isColRowTaken = getAllCockroachPigResults.some(
        (res) => res.cp_col == cpLatestCol && res.cp_row == cpLatestRow + 1
      );

      const isColRowWithNameTaken = allLatestSmallRoadResults.find(
        (res) =>
          res.cp_col + 1 == cpLatestRow &&
          res.cp_row == cpLatestRow + 1 &&
          res.cp_name == cp_name
      );

      return isColRowTaken || isColRowWithNameTaken;
    };

    const cpBlueResetColumn = [
      "Blue",
      !latestGroupCountFromCockroachPig ? 1 : cpIsPrevResultsNotEqualToOne,
      isCockroachPigDataFound ? cpIsPrevResultsNotEqualToOne : 1,
      1,
      latestResults?.results_id,
    ];

    const cpRedResetColumn = [
      "Red",
      !latestGroupCountFromCockroachPig ? 1 : cpIsPrevResultsNotEqualToOne, // cp_groupCount,
      isCockroachPigDataFound ? cpIsPrevResultsNotEqualToOne : 1,
      1,
      latestResults?.results_id,
    ];

    console.log(!latestGroupCountFromCockroachPig);

    const cpRedIncrementRow = [
      "Red",
      !latestGroupCountFromCockroachPig ? 1 : 0, // cp_groupCount
      isCockroachPigDataFound ? cpLatestCol : 1, // cp_col
      isCockroachPigDataFound ? cpIncrementRow : 1, // cp_row
      latestResults?.results_id, // results_id
    ];

    const cpRedIncrementColumn = [
      "Red",
      isCockroachPigDataFound ? 0 : 1, // cp_groupCount,
      isCockroachPigDataFound ? cpIncrementCol : 1,
      isCockroachPigDataFound ? cpLatestRow : 1,
      latestResults?.results_id,
    ];

    if (
      isCockroachPigHasData ||
      (isFirstColRowResultsOnCockroachPigFound && isLatestResultsNotTie)
    ) {
      if (firstColumnLength < fourthColumnLength) {
        if (bigRoadPrevRow < 2 && firstColumnLength < 2) {
          if (cpLatestName == "Red") {
            await databaseQuery(
              queryUpdateCockroachPigResults,
              cpRedIncrementRow
            );
          } else {
            await databaseQuery(
              queryUpdateCockroachPigResults,
              cpRedResetColumn
            );
          }
        } else if (bigRoadPrevRow < 3 && firstColumnLength < 3) {
          if (cpLatestName == "Red") {
            await databaseQuery(
              queryUpdateCockroachPigResults,
              cpRedIncrementRow
            );
          } else {
            await databaseQuery(
              queryUpdateCockroachPigResults,
              cpRedResetColumn
            );
          }
        } else {
          if (cpLatestName == "Blue") {
            await databaseQuery(
              queryUpdateCockroachPigResults,
              cpRedResetColumn
            );
          } else {
            await databaseQuery(
              queryUpdateCockroachPigResults,
              cpRedIncrementRow
            );
          }
        }
      } else if (firstColumnLength == fourthColumnLength) {
        if (cpLatestName == "Red") {
          await databaseQuery(
            queryUpdateCockroachPigResults,
            cpRedIncrementRow
          );
        } else {
          await databaseQuery(queryUpdateCockroachPigResults, cpRedResetColumn);
        }
      } else if (firstColumnLength - 1 == fourthColumnLength) {
        if (cpLatestName == "Red") {
          await databaseQuery(
            queryUpdateCockroachPigResults,
            cpBlueResetColumn
          );
        }
      } else if (firstColumnLength > fourthColumnLength) {
        console.log(cpLatestRow);
        if (cpLatestName == "Blue") {
          await databaseQuery(queryUpdateCockroachPigResults, cpRedResetColumn);
        } else {
          if (cpLatestRow > 5) {
            await databaseQuery(
              queryUpdateCockroachPigResults,
              cpRedIncrementColumn
            );
          } else {
            await databaseQuery(
              queryUpdateCockroachPigResults,
              cpRedIncrementRow
            );
          }
        }
      }
    }

    const resultsData = await databaseQuery(queryGetAllBigEyeBoyResults);
    const smallRoadResults = await databaseQuery(
      queryGetLatestSmallRoadResults
    );

    const cochroachPigResults = await databaseQuery(
      queryGetCockroachRoadResults
    );

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

    function smallRoadPredictionLogic(leadName) {
      if (leadName == "Banker") {
        if (isCurrentResultsBlue) {
          if (firstColumnLength == thirdColumnLength) {
            return "Red";
          } else if (firstColumnLength > thirdColumnLength) {
            return "Blue";
          } else {
            return "Blue";
          }
        } else {
          if (firstColumnLength == thirdColumnLength) {
            return "Blue";
          } else if (firstColumnLength > thirdColumnLength) {
            return "Red";
          } else {
            return "Red";
          }
        }
      } else if (leadName == "Player") {
        if (isCurrentResultsRed) {
          if (firstColumnLength == thirdColumnLength) {
            return "Red";
          } else if (firstColumnLength > thirdColumnLength) {
            return "Blue";
          } else {
            return "Blue";
          }
        } else {
          if (firstColumnLength == thirdColumnLength) {
            return "Blue";
          } else if (firstColumnLength > thirdColumnLength) {
            return "Red";
          } else {
            return "Red";
          }
        }
      }
    }

    const data = {
      bigEyeBoyData: resultsData,
      smallRoadData: smallRoadResults,
      cockroachPigData: cochroachPigResults,
      predictionsData: {
        isRowColTwoOrThreeFound: isColRowTwoFound || isColRowThreeFound,
        isBigEyeBoyHasData: isColRowTwoFound || isColRowThreeFound,
        isSmallRoadHasData: isSmallRoadData,
        bigEyeBoy: {
          banker: bigEyeBoyPrediction("Banker"),
          player: bigEyeBoyPrediction("Player"),
        },
        smallRoad: {
          banker: smallRoadPredictionLogic("Banker"),
          player: smallRoadPredictionLogic("Player"),
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
