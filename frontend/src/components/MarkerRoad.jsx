import React, { memo, useEffect } from 'react'
import { useCostumizeResults } from '../hooks/useCustomizeResults'

function MarkerRoad({ m, resultBoardMarkerData }) {

    const {
        handleFormatStyleResults,
        handleShowResultsOnMarkerRoadBy,
    } = useCostumizeResults()


    for (let key in m) {
        return (
            <div>
                {(m[key].map(col => {
                    return (<div
                        className={`h-[70px] w-[70px] border border-gray-300 shadow-inner shadow-gray-500 flex justify-center items-center `}
                        key={col.id}>
                        <p className={`text-4xl result-text-shadow py-[2px] px-3 rounded-full ${handleFormatStyleResults(handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData))}`}>
                            {handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData)}
                        </p>
                    </div>
                    )
                }))}
            </div>)
    }
}

export default memo(MarkerRoad)