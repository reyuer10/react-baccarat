import React from 'react'
import { initialCockroachPigData } from '../utils/convertRoadResults'

function CockroachPig({ cp, cockroachPigData }) {

    // console.log(cockroachPigData)

    // columnPosition: number;
    // rowPosition: number;

    return (
        <div className='w-full'>
            {Object.keys(cp).map(key => (
                <div
                    key={key}
                    className='h-full'>
                    {cp[key].map(col => {
                        const cockroachPigStyle = initialCockroachPigData(col.columnPosition, col.rowPosition, cockroachPigData)?.style
                        // console.log(cockroachPigStyle.style)
                        return (
                            <div
                                key={col.colId}
                                className={`
                            ${col.styleBorder == true ? "border-l-2 border-l-orange-200" : ""}
                            ${col.styleBorderBox == false ? "border-b-2 border-b-orange-200" : ""}
                             h-[calc(100%/6)]  flex justify-center items-center relative
                             
                             `}
                            >
                                <p className={cockroachPigStyle}></p>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

export default CockroachPig