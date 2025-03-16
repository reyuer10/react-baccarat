import React from 'react'

function SmallRoad({ sr }) {
    return (
        <div>
            {Object.keys(sr).map(key => {
                <div
                    key={key}>
                    {sr[key].map(col => {
                        console.log(col)
                        return (
                            <div
                                key={col.colId}
                                className={`
                                ${col.styleBorder == true ? "border-l-4 border-l-gray-300" : ""}
                                ${col.styleBorderBox == false ? "border-b-4 border-b-gray-300" : ""}
                                 h-[30px] w-[30px] border border-gray-200 shadow-inner shadow-gray-500 flex justify-center items-center relative`}

                            >
                                <p>
                                    hello
                                </p>
                            </div>
                        )
                    })}
                </div>
            })}</div>
    )
}

export default SmallRoad