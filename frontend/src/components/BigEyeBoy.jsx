import React from 'react'

function BigEyeBoy({ e }) {
    return (
        <div>{Object.keys(e).map(key => (
            <div key={key}
                className='flex flex-col'
            >
                {e[key].map(col => {
                    return (
                        <div
                            key={col.colId}
                            className={`
                                ${col.styleBorder == true ? "border-l-4 border-l-gray-300" : ""}
                                ${col.styleBorderBox == false ? "border-b-4 border-b-gray-300" : ""}
                                 h-[30px] w-[30px] border border-gray-200 shadow-inner shadow-gray-500 flex justify-center items-center relative`}
                        >
                            <p></p>
                        </div>
                    )
                })}
            </div>
        ))}</div>
    )
}

export default BigEyeBoy