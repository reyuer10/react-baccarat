import React, { useEffect, useState } from 'react'

function Predictions({ predictionsData }) {

    const {
        isRowColTwoOrThreeFound,
        isBigEyeBoyHasData,
        isSmallRoadHasData,
        isCockroachPigHasData,
        bigEyeBoy,
        smallRoad,
        cockroachPig
    } = predictionsData;

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


    console.log(predictionsData)


    function customizeStyleBigEyeBoy(colorName) {
        if (isBigEyeBoyHasData) {
            if (bigEyeBoy?.banker == null) {
                return ``
            } else {
                return `ring-${colorName} bg-${colorName}`
            }
        } else {
            return `opacity-40 bg-gray-400 ring-gray-400`
        }
    }


    return (
        <div className='roboto-mono-900 absolute justify-center flex'>
            <div>
                {predictions.map((p, index) => {

                    const styleConvertBigEyeBoyBanker = bigEyeBoy?.banker == "Blue" ? "cyan-600" : "red-500";
                    const styleConvertBigEyeBoyPlayer = bigEyeBoy?.player == "Blue" ? "cyan-600" : "red-500"

                    const styleConvertSmallRoadBanker = smallRoad?.banker == "Blue" ? "cyan-600" : "red-500";
                    const styleConvertSmallRoadPlayer = smallRoad?.player == "Blue" ? "cyan-600" : "red-500";

                    const styleConvertCockroachPigBanker = cockroachPig?.banker == "Blue" ? "cyan-600" : "red-500"
                    const styleConvertCockroachPigPlayer = cockroachPig?.player == "Blue" ? "cyan-600" : "red-500"
                    // ${isRowColTwoOrThreeFound ? "" : "opacity-40"}
                    return (
                        <div
                            className={`flex space-x-4 transition-all`}
                            key={index}>
                            <div className='space-y-4 flex flex-col items-center'>
                                <p className={`bg-red-500 text-2xl text-white result-text-shadow border-4 border-white ring-2 ring-red-500 px-[10px] rounded-full`}>
                                    {p.predictionBanker}
                                </p>


                                <p className={`h-[35px] w-[35px] rounded-full border-6 ring-2 border-white
                             ${customizeStyleBigEyeBoy(styleConvertBigEyeBoyBanker)}
                                `}
                                ></p>


                                <p className={`h-[35px] w-[35px] rounded-full
                                ${isSmallRoadHasData ? `bg-${styleConvertSmallRoadBanker}` : "opacity-40 bg-gray-400"}`}
                                >
                                    {p.predictionSmallRoadFromBanker}
                                </p>



                                <p className={`h-[35px] w-[10px] mx-auto rotate-45
                                ${isCockroachPigHasData ? `bg-${styleConvertCockroachPigBanker}` : "opacity-40 bg-gray-400"}
                                `}
                                >
                                    {p.predictionCockroachPigFromBanker}
                                </p>
                            </div>




                            <div className='space-y-4 flex flex-col items-center'>
                                <p className={`bg-cyan-600 text-2xl text-white result-text-shadow border-4 border-white ring-2 ring-cyan-600 px-[10px] rounded-full`}>
                                    {p.predictionPlayer}
                                </p>

                                <p className={`h-[35px] w-[35px] rounded-full border-6 border-white ring-2
                                ${isBigEyeBoyHasData ? `ring-${styleConvertBigEyeBoyPlayer}` : " opacity-40 bg-gray-400  ring-gray-400"}
                                   ${bigEyeBoy?.player == null ? "" : `bg-${styleConvertBigEyeBoyPlayer}`}
                                `}
                                ></p>
                                <p className={`h-[35px] w-[35px] rounded-full
                                ${isSmallRoadHasData ? `bg-${styleConvertSmallRoadPlayer}` : "opacity-40 bg-gray-400"}`}
                                >
                                    {p.predictionSmallRoadFromPlayer}
                                </p>
                                <p className={`h-[35px] w-[10px] mx-auto rotate-45
                                  ${isCockroachPigHasData ? `bg-${styleConvertCockroachPigPlayer}` : "opacity-40 bg-gray-400"}
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