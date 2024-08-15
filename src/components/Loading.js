import React from 'react'

const Loading = () => {
    return (
        <>
            <div className="flex justify-center items-center absolute z-30 h-full w-full backdrop-blur-xl overflow-hidden bg-white opacity-50 backdrop-filter">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-600 relative">
                </div>
                {/* <p className='absolute top-0 text-black'>Loading...</p> */}
            </div>
            <div className='h-full w-full flex justify-center items-center absolute font-bold'>
                <p>Procesando...</p>
            </div>
        </>
    )
}

export default Loading