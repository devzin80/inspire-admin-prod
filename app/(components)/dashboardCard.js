import React from 'react'

const DashboardCard = ({ heading, revenue, up, percentAmount, profit}) => {
    return (
        <div className='px-4 py-5 bg-white rounded-lg w-1/5 border border[#0C4A6E] overflow-hidden '>
            <h1 className='text-base text-neutral-600 mb-4'>{heading}</h1>
            <p className='text-3xl font-semibold text-[#0C4A6E] leading-10 mb-2'>
                {profit ? '৳' : ' '} {Number(revenue).toLocaleString('en-IN')}
            </p>
            <div className='flex items-center gap-2'>
                <span
                    className={`text-sm  font-medium  p-2 rounded ${
                        up
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                    }`}
                >
                    {percentAmount}% <span>{up ? '↑' : '↓'}</span>{' '}
                </span>
                <span className='text-sm text-neutral-500'>
                    from last month
                </span>
            </div>
        </div>
    )
}

export default DashboardCard
