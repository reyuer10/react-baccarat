import React, { memo } from 'react';
import { useCostumizeResults } from '../hooks/useCustomizeResults';

function BigRoad({ b, resultsBoardData }) {
    const {
        handleShowResultsBy,
        handleFormatStyleResults,
    } = useCostumizeResults();

    return (
        <div>
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
                                className="h-[50px] w-[50px] border border-gray-300 shadow-inner shadow-gray-500 flex justify-center items-center relative"
                            >
                                <p className={`text-4xl result-text-shadow py-[2px] px-3 rounded-full ${handleFormatStyleResults(resultData?.resultName)}`}>
                                    {resultData?.resultName}
                                </p>
                                {tieCount && (
                                    <span className="absolute bottom-0 left-0 bg-green-500 rounded-full text-white result-text-shadow text-[17px] px-[7px] ring-2 ring-green-500 border-2 border-white">
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
