import React, { memo, useEffect } from 'react'
import { useCostumizeResults } from '../hooks/useCustomizeResults'
import { motion } from "motion/react"

function MarkerRoad({ m, resultBoardMarkerData }) {

    const {
        handleFormatStyleResults,
        handleShowResultsOnMarkerRoadBy,
    } = useCostumizeResults()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Elements appear one by one
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
    };



    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"

        >
            {
                Object.keys(m).map(key => (
                    <div
                        key={key}>
                        {m[key].map(col => {
                            return (<motion.div
                                className={`h-[70px] w-[70px] border border-gray-300 shadow-inner shadow-gray-500 flex justify-center items-center `}
                                variants={itemVariants}
                                key={col.id}>
                                <p className={`text-4xl result-text-shadow py-[2px] px-3 rounded-full ${handleFormatStyleResults(handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData))}`}>
                                    {handleShowResultsOnMarkerRoadBy(col.colId, resultBoardMarkerData)}
                                </p>
                            </motion.div>
                            )
                        })}
                    </div>
                ))
            }
        </motion.div>
    )
}

export default memo(MarkerRoad)


