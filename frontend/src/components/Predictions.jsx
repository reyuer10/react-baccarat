import React, { useState } from 'react'

function Predictions() {
    const [predictionData, setPredictionData] = useState([
        {
            predictionName: "B",
            predictionBigEyeBoy: null,
            predictionSmallRoad: null,
            predictionCockroachPig: null,
        },
        {
            predictionName: "P",
            predictionBigEyeBoy: null,
            predictionSmallRoad: null,
            predictionCockroachPig: null,
        }])


    return (
        <div className='roboto-mono-900 absolute justify-center flex'>
            <div className='flex text-center space-x-8'>
                {predictionData.map((p, index) => {
                    return (
                        <div
                            className='space-y-8'
                            key={index}>
                            <span
                                className={`
                                    text-[56px]
                                    ${p.predictionBigEyeBoy == null ? "opacity-20" : ""}
                                    `}
                            >{p.predictionName}
                            </span>
                            <p
                                className={`
                                    h-[50px] w-[50px] rounded-full border-6 ring-2
                                ${p.predictionBigEyeBoy == null ? "bg-gray-600 border-white ring-gray-600 opacity-20" : ""}
                                `}
                            >
                                {p.predictionBigEyeBoy}
                            </p>
                            <p
                                className={`
                                h-[50px] w-[50px] rounded-full border-6 ring-2
                            ${p.predictionBigEyeBoy == null ? "bg-gray-600 border-white ring-gray-600 opacity-20" : ""}
                            `}
                            >
                                {p.predictionSmallRoad}
                            </p>
                            <span>{p.predictionCockroachPig}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Predictions