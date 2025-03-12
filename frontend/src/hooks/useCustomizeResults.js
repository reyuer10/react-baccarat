export const useCostumizeResults = () => {
  const handleFormatStyleResults = (results) => {
    let style = "";
    if (results == "P")
      return (style = "bg-cyan-600 ring-cyan-600 shadow-md shadow-black");
    if (results == "B")
      return (style = "bg-red-600 ring-red-600 shadow-md shadow-black");
    if (results == "T")
      return (style = " bg-green-600 ring-green-600 shadow-md shadow-black");
  };

  const handleFormatResults = (results) => {
    let res = "";
    if (results == "Player") return (res = "P");
    if (results == "Banker") return (res = "B");
    if (results == "Tie") return (res = "T");
  };

  const handleShowResultsBy = (col, row, resultsBoardData) => {
    const isBoardResultsFound = resultsBoardData?.find(
      (board, index) => board.num_posCol == col && board.num_posRow == row
    );
    return isBoardResultsFound
      ? handleFormatResults(isBoardResultsFound.result_name)
      : null;
  };

  const handleShowResultsOnMarkerRoadBy = (index, resultsBoardData) => {
    const isBoardIndexFound = resultsBoardData?.find(
      (board) => board.results_id == index
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
