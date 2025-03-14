import React, { memo } from 'react';
import { useCostumizeResults } from '../hooks/useCustomizeResults';
import { motion } from "framer-motion";

function BigRoad({ b, resultsBoardData }) {
    const {
        handleShowResultsBy,
        handleFormatStyleResults,
    } = useCostumizeResults();

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
            {Object.keys(b).map(key => (
                <div key={key}>
                    {b[key].map(col => {
                        const resultData = handleShowResultsBy(col.columnPosition, col.rowPosition, resultsBoardData);
                        const tieCount = resultData?.resultTieCount || null;

                        return (
                            <motion.div
                                key={col.id}
                                className="h-[70px] w-[70px] border border-gray-300 shadow-inner shadow-gray-500 flex justify-center items-center relative"
                                variants={itemVariants}
                            >
                                <p className={`text-4xl result-text-shadow py-[2px] px-3 rounded-full ${handleFormatStyleResults(resultData?.resultName)}`}>
                                    {resultData?.resultName}
                                </p>
                                {tieCount && (
                                    <span className="absolute bottom-0 left-0 bg-green-500 rounded-full text-white result-text-shadow text-[17px] px-[7px] ring-2 ring-green-500 border-2 border-white">
                                        {tieCount}
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ))}
        </motion.div>
    );
}

export default memo(BigRoad);
