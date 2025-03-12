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
                    return (<div
                        className={`h-[70px] w-[70px] border flex justify-center items-center`}
                        key={col.id}>
                        <p className={`text-4xl result-text-shadow py-[2px] px-3 rounded-full ${handleFormatStyleResults(handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData))}`}>
                            {handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData)}
                        </p>
                    </div>
                    )
                }))}
            </div>)
    }
}

export default memo(BigRoad)