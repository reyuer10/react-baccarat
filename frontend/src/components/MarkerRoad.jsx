import React, { memo, useEffect } from 'react'
import { useCostumizeResults } from '../hooks/useCustomizeResults'

function MarkerRoad({ m, resultBoardMarkerData }) {

    const {
        handleFormatStyleResults,
        handleShowResultsOnMarkerRoadBy,
    } = useCostumizeResults()

    return (
        <div>
            {Object.keys(m).map((key) => (
                <div
                    key={key}>
                    {m[key].map(col => {
                        return (<div
                            key={col.colId}
                            className={`h-[50px] w-[50px] border border-gray-300 shadow-inner shadow-gray-500 flex justify-center items-center `}
                        >
                            <p className={`text-4xl result-text-shadow py-[2px] px-3 rounded-full ${handleFormatStyleResults(handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData))}`}>
                                {handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData)}
                            </p>
                        </div>
                        )
                    })}
                </div>
            ))
            }
        </div>
    )
}

export default memo(MarkerRoad)


