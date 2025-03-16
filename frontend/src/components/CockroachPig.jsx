import React from 'react'

function CockroachPig({ cp }) {
    return (
        <div className='w-full'>
            {Object.keys(cp).map(key => (
                <div
                    key={key}
                    className='h-full'>
                    {cp[key].map(col => {
                        return (
                            <div
                                key={col.colId}
                                className={`
                            ${col.styleBorder == true ? "border-l-2 border-l-gray-300" : ""}
                            ${col.styleBorderBox == false ? "border-b-2 border-b-gray-300" : ""}
                             h-[calc(100%/6)] border border-gray-200 shadow-inner shadow-gray-500 flex justify-center items-center relative`}
                            >
                                <p></p>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

export default CockroachPig