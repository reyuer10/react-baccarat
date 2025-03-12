import React, { memo } from 'react'
import { useCostumizeResults } from '../hooks/useCustomizeResults';

function BigRoad({ b, resultsBoardData }) {

    const {
        handleShowResultsBy,
        handleFormatStyleResults,
    } = useCostumizeResults()

    return (
        <div className='flex'>
            <div>
                {b.col1.map(col => {
                    return (<div
                        className={`h-[70px] w-[70px] border flex justify-center items-center`}
                        key={col.id}>
                        <p className={`text-4xl result-text-shadow border px-3 py-1 rounded-full text-white outline-2 outline-white ring-4  ${handleFormatStyleResults(handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData))}`}>
                            {handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData)}
                        </p>
                    </div>)
                })}
            </div>
            <div>
                {b.col2.map(col => {
                    return (<div
                        className={`h-[70px] w-[70px] border flex justify-center items-center`}
                        key={col.id}>
                        <p className={`text-4xl result-text-shadow border px-3 py-1 rounded-full text-white outline-2 outline-white ring-4  ${handleFormatStyleResults(handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData))}`}>
                            {handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData)}
                        </p>
                    </div>)
                })}
            </div>
            <div>
                {b.col3.map(col => {
                    return (<div
                        className={`h-[70px] w-[70px] border flex justify-center items-center`}
                        key={col.id}>
                        <p className={`text-4xl result-text-shadow border px-3 py-1 rounded-full text-white outline-2 outline-white ring-4  ${handleFormatStyleResults(handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData))}`}>
                            {handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData)}
                        </p>
                    </div>)
                })}
            </div>
        </div>
    )
}

export default memo(BigRoad)