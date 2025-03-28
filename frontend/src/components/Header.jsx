import React from 'react'

function Header({ handleFetchResetGameResults, round }) {
    return (
        <div className='flex items-center space-x-10'>
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
                <span className=' roboto-mono-900 text-3xl text-white result-text-shadow'> ROUND: {round}</span>
            </div>
        </div>
    )
}

export default Header