import React, { memo, useEffect } from 'react'
import { useCostumizeResults } from '../hooks/useCustomizeResults'

function MarkerRoad({ m, resultBoardMarkerData }) {


    const {
        handleFormatStyleResults,
        handleShowResultsOnMarkerRoadBy,
    } = useCostumizeResults()

    return (
        <div className='w-full'>
            {Object.keys(m).map((key) => (
                <div
                    key={key}
                    className='h-full'>
                    {m[key].map(col => {
                        // console.log(col)
                        return (<div
                            key={col.colId}
                            className={`h-[calc(100%/6)] border border-orange-200 flex justify-center items-center `}
                        >
                            <p className={`z-20 absolute result-text-shadow px-2  rounded-full ${handleFormatStyleResults(handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData))}`}>
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


