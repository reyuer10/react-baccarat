export const customizeStyleResults = (resultName) => {
  if (resultName == "Red")
    return "rounded-full bg-red-500 h-[17px] w-[17px] absolute border-4 border-white ring-2 ring-red-500";
  if (resultName == "Blue")
    return "rounded-full bg-cyan-600 h-[17px] w-[17px] absolute border-4 border-white ring-2 ring-cyan-600";
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
