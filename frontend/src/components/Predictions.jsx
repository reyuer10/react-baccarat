import React, { useEffect, useState } from 'react'

function Predictions({ predictionsData }) {
    const { isRowColTwoOrThreeFound, isBigEyeBoyHasData, isSmallRoadHasData, bigEyeBoy } = predictionsData;

    const [predictions, setPredictions] = useState([
        {
            predictionBanker: "B",
            predictionPlayer: "P",
            predBigEyeBoyFromBanker: null,
            predBigEyeBoyFromPlayer: null,
            predictionSmallRoadFromBanker: null,
            predictionSmallRoadFromPlayer: null,
            predictionCockroachPigFromPlayer: null,
            predictionCockroachPigFromBanker: null,
        }])


    function customizeStyleBigEyeBoy(colorName) {
        if (isBigEyeBoyHasData) {
            if (bigEyeBoy?.banker == null) {
                return ``
            } else {
                return `ring-${colorName} bg-${colorName}`
            }
        } else {
            return `opacity-20 bg-gray-400 ring-gray-400`
        }
    }


    return (
        <div className='roboto-mono-900 absolute justify-center flex'>
            <div>
                {predictions.map((p, index) => {

                    const styleConvertBigEyeBoyBanker = bigEyeBoy?.banker == "Blue" ? "cyan-600" : "red-500";
                    const styleConvertBigEyeBoyPlayer = bigEyeBoy?.player == "Blue" ? "cyan-600" : "red-500"
                    return (
                        <div
                            className={` flex space-x-4 transition-all
                                ${isRowColTwoOrThreeFound ? "" : "opacity-40"}`}
                            key={index}>
                            <div className='space-y-4 flex flex-col items-center'>
                                <p className={`${isRowColTwoOrThreeFound ? "bg-red-500" : "bg-gray-400"} text-2xl text-white result-text-shadow border-4 border-white ring-2 ring-red-500 px-[10px] rounded-full`}>
                                    {p.predictionBanker}
                                </p>
                                <p className={`h-[35px] w-[35px] rounded-full border-6 ring-2 border-white
                             ${customizeStyleBigEyeBoy(styleConvertBigEyeBoyBanker)}
                                `}
                                ></p>
                                <p className={`h-[35px] w-[35px] rounded-full
                                ${isSmallRoadHasData ? "" : "bg-gray-400"}`}
                                >
                                    {p.predictionSmallRoadFromBanker}
                                </p>
                                <p className={`h-[35px] w-[10px] mx-auto rotate-45
                                ${p.predictionBigEyeBoy == null ? "bg-gray-400" : ""}
                                `}
                                >
                                    {p.predictionCockroachPigFromBanker}
                                </p>
                            </div>
                            <div className='space-y-4 flex flex-col items-center'>
                                <p className={`${isRowColTwoOrThreeFound ? "bg-cyan-600" : " bg-gray-400"} text-2xl text-white result-text-shadow border-4 border-white ring-2 ring-cyan-600 px-[10px] rounded-full`}>
                                    {p.predictionPlayer}
                                </p>

                                <p className={`h-[35px] w-[35px] rounded-full border-6 border-white ring-2
                                ${isBigEyeBoyHasData ? `ring-${styleConvertBigEyeBoyPlayer}` : "opacity-20 bg-gray-400  ring-gray-400"}
                                   ${bigEyeBoy?.player == null ? "" : `bg-${styleConvertBigEyeBoyPlayer}`}
                                `}
                                ></p>
                                <p className={`h-[35px] w-[35px] rounded-full
                                ${isSmallRoadHasData ? "" : "bg-gray-400"}`}
                                >
                                    {p.predictionSmallRoadFromPlayer}
                                </p>
                                <p className={`h-[35px] w-[10px] mx-auto rotate-45
                                ${p.predictionBigEyeBoy == null ? "bg-gray-400" : ""}
                                `}
                                >
                                    {p.predictionCockroachPigFromPlayer}
                                </p>
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Predictions