import React, { memo } from 'react'
import { useCostumizeResults } from '../hooks/useCustomizeResults';

function BigRoad({ b, resultsBoardData }) {

    const {
        handleShowResultsBy,
        handleFormatStyleResults,
    } = useCostumizeResults();

    for (let key in b) {

        return (
            <div>
                {(b[key].map(col => {
                    const tieCount = handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData)?.resultTieCount
                    const tieCountFormat = tieCount == 0 ? null : tieCount
                    return (
                        <div
                            className={`h-[70px] w-[70px] border border-gray-300 shadow-inner shadow-gray-500 flex justify-center items-center relative`}
                            key={col.id}>
                            <p className={`text-4xl result-text-shadow py-[2px] px-3 rounded-full ${handleFormatStyleResults(handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData)?.resultName)}`}>
                                {handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData)?.resultName}
                            </p>
                            <span className={`absolute bottom-0 left-0 bg-green-500  rounded-full text-white result-text-shadow ${tieCountFormat ? " text-[17px] px-[7px] ring-2 ring-green-500 border-2 border-white" : ""}`}>
                                {tieCountFormat}
                            </span>
                        </div>
                    )
                }))}
            </div>)
    }
}

export default memo(BigRoad)