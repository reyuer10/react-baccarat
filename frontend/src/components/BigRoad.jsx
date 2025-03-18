import React, { memo } from 'react';
import { useCostumizeResults } from '../hooks/useCustomizeResults';

function BigRoad({ b, resultsBoardData }) {
    const {
        handleShowResultsBy,
        handleFormatStyleResults,
    } = useCostumizeResults();

    return (
        <div className='w-full'>
            {Object.keys(b).map(key => (
                <div
                    key={key}
                    className='h-full'
                >
                    {b[key].map(col => {
                        const resultData = handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData);
                        const tieCount = resultData?.resultTieCount || null;
                        return (
                            <div
                                key={col.id}
                                className="h-[calc(100%/6)] border border-gray-300 shadow-inner shadow-gray-500 flex justify-center items-center relative"
                            >
                                <p className={`absolute result-text-shadow px-2 rounded-full ${handleFormatStyleResults(resultData?.resultName)}`}>
                                    {resultData?.resultName}
                                </p>
                                {tieCount && (
                                    <span className="text-[10px] absolute bottom-0 left-0 bg-green-500 rounded-full text-white result-text-shadow px-[5px] ring-2 ring-green-500 border-2 border-white">
                                        {tieCount}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default memo(BigRoad);
