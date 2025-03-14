export const useCostumizeResults = () => {
  const handleFormatStyleResults = (results) => {
    if (results == "P")
      return "border text-white outline-2 outline-white ring-4 bg-cyan-600 ring-cyan-600 shadow-lg shadow-gray-500";
    if (results == "B")
      return "border text-white outline-2 outline-white ring-4 bg-red-600 ring-red-600 shadow-lg shadow-gray-500";
    if (results == "T")
      return "border text-white outline-2 outline-white ring-4 bg-green-600 ring-green-600 shadow-lg shadow-gray-500";
  };

  const handleFormatResults = (results) => {
    if (results == "Player") return "P";
    if (results == "Banker") return "B";
    if (results == "Tie") return "T";
  };

  const handleShowResultsBy = (col, row, resultsBoardData) => {
    const isBoardResultsFound = resultsBoardData?.find(
      (board) => board.num_posCol == col && board.num_posRow == row
    );

    return isBoardResultsFound
      ? {
          resultName: handleFormatResults(isBoardResultsFound.result_name),
          resultTieCount: isBoardResultsFound.tie_count,
        }
      : null;
  };

  const handleShowResultsOnMarkerRoadBy = (index, resultsBoardData) => {
    const isBoardIndexFound = resultsBoardData?.find(
      (board, idx) => idx + 1 == index
    );
    return isBoardIndexFound
      ? handleFormatResults(isBoardIndexFound.result_name)
      : null;
  };

  return {
    handleShowResultsBy,
    handleFormatStyleResults,
    handleShowResultsOnMarkerRoadBy,
  };
};
