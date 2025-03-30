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

export const customizeStyleResultsForCockroachPig = (cp_name) => {
  if (cp_name == "Red")
    return "h-[25px] w-[5px] bg-red-500 mx-auto rotate-45 absolute";
  if (cp_name == "Blue")
    return "h-[25px] w-[5px] bg-cyan-600 mx-auto rotate-45 absolute";
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

export const initialCockroachPigData = (col, row, arrData) => {
  const foundColRowData = arrData?.find(
    (d) => d.cp_col == col && d.cp_row == row
  );
  return foundColRowData
    ? {
        style: customizeStyleResultsForCockroachPig(foundColRowData?.cp_name),
        name: foundColRowData?.name,
      }
    : null;
};
