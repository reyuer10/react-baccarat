import React from 'react'

function CardBoardResults({ round }) {
    return (
        <div className='grid grid-cols-14 h-full'>
            <div className='bg-blue-950 border-y border-l border-blue-500 col-span-5 row-span-14 h-full'>
                <div className='h-[85%] border'>
                    {/* <p>Box 2</p> */}
                </div>
                <div className='h-[15%] border flex items-center justify-center space-x-4 bg-gradient-to-b from-blue-300 via-blue-700 to-blue-300'>
                    <p className='text-xl px-[9px] rounded-full border text-white outline outline-white ring-3 bg-blue-500 ring-blue-500'>P</p>
                    <p className='text-white text-3xl text-shadow-player'>PLAYER</p>
                    <p className='text-white text-2xl'>0</p>
                </div>
            </div>
            <div className='bg-green-950 border border-l border-green-500 col-span-4 row-span-14 h-full'>
                <div className='h-[20%] border text-center'>
                    {/* <p className='text-sm'>GAME NUMBER</p>
                    <p className='text-xl'>{round}</p> */}
                </div>
                <div className='h-[65%]'>
                    {/* <p>Hello</p> */}
                </div>
                <div className='h-[15%] border flex items-center justify-center space-x-4 bg-gradient-to-b from-green-300 via-green-700 to-green-300'>
                    <p className='text-xl px-[9px] rounded-full border text-white outline outline-white ring-3 bg-green-500 ring-green-500'>T</p>
                    <p className='text-white text-3xl text-shadow-tie'>TIE</p>
                    <p className='text-white text-2xl'>0</p>
                </div>
            </div>
            <div className='bg-red-950 border-y border-r border-red-500 col-span-5 row-span-14 h-full'>
                <div className='h-[85%] border'>
                    {/* <p>Box 1</p> */}
                </div>
                <div className='h-[15%] border flex items-center justify-center space-x-4 bg-gradient-to-b from-red-300 via-red-700 to-red-300'>
                    <p className='text-xl px-[9px] rounded-full border text-white outline outline-white ring-3 bg-red-500 ring-red-500'>B</p>
                    <p className='text-white text-3xl text-shadow-banker'>BANKER</p>
                    <p className='text-white text-2xl'>0</p>
                </div>
            </div>
        </div >
    )
}

export default CardBoardResults