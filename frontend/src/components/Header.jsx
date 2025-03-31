import React from 'react'

function Header({ handleFetchResetGameResults, round }) {
    return (
        <div className='flex items-center justify-evenly space-x-10 roboto-mono-900 text-4xl  text-amber-200'>
            <div>
                <p>최소 베팅 | MIN</p>
            </div>
            <div>
                <p>최대 베팅 | MAX</p>
            </div>
            <div>
                <button
                    className='px-4 py-2 rounded-lg bg-red-400 text-white text-2xl font-bold'
                    onClick={() => {
                        localStorage.removeItem("boardData")
                        handleFetchResetGameResults()
                    }}>
                    Reset
                </button>
            </div>
            <div>
                <p>테이블 | TABLE</p>
            </div>
            <div>
                <span className=' result-text-shadow'> 라운드 | ROUND {round}</span>
            </div>
        </div>
    )
}

export default Header