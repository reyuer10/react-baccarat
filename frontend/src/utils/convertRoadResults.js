export const customizeStyleResults = (resultName) => {
  if (resultName == "Red")
    return "rounded-full bg-red-500 h-[17px] w-[17px] absolute border-4 border-white ring-2 ring-red-500";
  if (resultName == "Blue")
    return "rounded-full bg-cyan-600 h-[17px] w-[17px] absolute border-4 border-white ring-2 ring-cyan-600";
};

export const customizeStyleResultsForSmallRoad = (resultName) => {
  if (resultName == "Red")
    return "rounded-full bg-red-500 shadow-sm shadow-black h-[19px] w-[19px] absolute";
  if (resultName == "Blue")
    return "rounded-full bg-cyan-600 h-[19px] w-[19px] absolute";
};

export const initialSmallRoadData = (col, row, arrData) => {
  const foundColRowData = arrData?.find(
    (d) => d.sr_col == col && d.sr_row == row
  );
  return foundColRowData
    ? {
        style: customizeStyleResultsForSmallRoad(foundColRowData?.sr_name),
        name: foundColRowData?.name,
      }
    : null;
};

export const initialBigEyeBoyData = (col, row, arrData) => {
  const foundColRowData = arrData?.find((d) => d.column == col && d.row == row);
  return foundColRowData
    ? {
        style: customizeStyleResults(foundColRowData?.name),
        name: foundColRowData?.name,
      }
    : null;
};
