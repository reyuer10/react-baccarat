import React, { memo, useEffect } from 'react'
import { useCostumizeResults } from '../hooks/useCustomizeResults'

function MarkerRoad({ m, resultBoardMarkerData }) {

    const {
        handleFormatStyleResults,
        handleShowResultsOnMarkerRoadBy,
    } = useCostumizeResults()

    return (
        <div className='flex font-bold'>
            <div>
                {m.col1.map(col => {
                    return (<div
                        className={`h-[70px] w-[70px] border flex justify-center items-center`}
                        key={col.colId}>
                        <p className={`text-4xl result-text-shadow border px-3 py-1 rounded-full text-white outline-2 outline-white ring-4  ${handleFormatStyleResults(handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData))}`}>
                            {handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData)}
                        </p>
                    </div>)
                })}
            </div>
            <div>
                {m.col2.map(col => {
                    return (<div
                        className={`h-[70px] w-[70px] border flex justify-center items-center`}
                        key={col.colId}>
                        <p className={`text-4xl result-text-shadow border px-3 py-1 rounded-full text-white outline-2 outline-white ring-4  ${handleFormatStyleResults(handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData))}`}>
                            {handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData)}
                        </p>
                    </div>)
                })}
            </div>
            <div>
                {m.col3.map(col => {
                    return (<div
                        className={`h-[70px] w-[70px] border flex justify-center items-center`}
                        key={col.colId}>
                        <p className={`text-4xl result-text-shadow border px-3 py-1 rounded-full text-white outline-2 outline-white ring-4  ${handleFormatStyleResults(handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData))}`}>
                            {handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData)}
                        </p>
                    </div>)
                })}
            </div>
        </div>
    )
}

export default memo(MarkerRoad)