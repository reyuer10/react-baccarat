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
                            ${col.styleBorder == true ? "border-l-2 border-l-orange-200" : ""}
                            ${col.styleBorderBox == false ? "border-b-2 border-b-orange-200" : ""}
                             h-[calc(100%/6)]  flex justify-center items-center relative`}
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