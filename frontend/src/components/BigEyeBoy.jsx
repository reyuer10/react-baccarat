import React, { memo } from 'react'
import { initialBigEyeBoyData } from '../utils/convertRoadResults'

function BigEyeBoy({ e, bigEyeBoyData }) {

    return (
        <div className='w-full'>
            {Object.keys(e).map(key => (
                <div
                    key={key}
                    className='h-full'>
                    {e[key].map(col => {
                        const initData = initialBigEyeBoyData(col.columnPosition, col.rowPosition, bigEyeBoyData)
                        return (
                            <div
                                key={col.colId}
                                className={`
                                ${col.styleBorder == true ? "border-l-2 border-l-orange-200" : ""}
                                ${col.styleBorderBox == false ? "border-b-2 border-b-orange-200" : ""}
                                 h-[calc(100%/6)] flex justify-center items-center relative `}
                            >
                                <p className={`${initData?.style}`}></p>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

export default memo(BigEyeBoy)