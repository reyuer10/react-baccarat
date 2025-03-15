import React from 'react'

function Header({ handleFetchResetGameResults }) {
    return (
        <button
            className='px-4 py-2 rounded-lg bg-red-400 text-white text-2xl'
            onClick={() => {
                localStorage.removeItem("boardData")
                handleFetchResetGameResults()
            }}>
            Reset
        </button>
    )
}

export default Header