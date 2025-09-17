'use client'
import React, { useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const data = [
    { month: 'Jan', courses: 1860, books: 460 },
    { month: 'Feb', courses: 8160, books: 460 },
    { month: 'Mar', courses: 1100, books: 500 },
    { month: 'Apr', courses: 8250, books: 300 },
    { month: 'May', courses: 1850, books: 450 },
    { month: 'Jun', courses: 1620, books: 220 },
    { month: 'Jul', courses: 1870, books: 480 },
    { month: 'Aug', courses: 2980, books: 370 },
    { month: 'Sep', courses: 35640, books: 500 },
    { month: 'Oct', courses: 20860, books: 460 },
    { month: 'Nov', courses: 8260, books: 460 },
    { month: 'Dec', courses: 8860, books: 460 },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white p-2 rounded shadow border'>
                <p className='font-semibold'>{label}</p>
                <p>Courses: ৳ {payload[0].value.toLocaleString()}</p>
                <p>Books: ৳ {payload[1].value.toLocaleString()}</p>
            </div>
        )
    }
    return null
}

const Chart = () => {
    const scrollRef = useRef(null)

    // Mouse wheel horizontal scroll
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        const onWheel = (e) => {
            e.preventDefault()
            container.scrollLeft += e.deltaY
        }

        container.addEventListener('wheel', onWheel)
        return () => container.removeEventListener('wheel', onWheel)
    }, [])

    return (
        <Card className='rounded-2xl shadow p-4 w-[40vw] h-full'>
            <CardHeader className='pb-0'>
                <CardTitle>Total Revenue</CardTitle>
                <p className='text-sm text-muted-foreground'>
                    Course and Books
                </p>
            </CardHeader>
            <CardContent>
                {/* Responsive Legend */}
                <div className='flex flex-wrap justify-end gap-4 mb-2'>
                    <div className='flex items-center gap-1'>
                        <span className='w-3 h-3 rounded-full bg-[#0ea5e9]' />
                        <span className='text-sm text-muted-foreground'>
                            Courses
                        </span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <span className='w-3 h-3 rounded-full bg-[#7dd3fc]' />
                        <span className='text-sm text-muted-foreground'>
                            Books
                        </span>
                    </div>
                </div>

                {/* Scrollable bar area */}
                <div
                    ref={scrollRef}
                    className='overflow-x-auto'
                    style={{ cursor: 'grab' }}
                >
                    <div style={{ minWidth: data.length * 120 }}>
                        <ResponsiveContainer
                            width='100%'
                            height={350}
                        >
                            <BarChart
                                data={data}
                                barSize={40}
                                barCategoryGap='20%'
                            >
                                <XAxis
                                    dataKey='month'
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) =>
                                        `৳ ${(v / 1000).toLocaleString()}k`
                                    }
                                    domain={[100, 100000]}
                                    allowDataOverflow={true}
                                    ticks={[
                                        0,1000, 5000, 10000, 20000, 50000, 100000,
                                    ]}
                                    className='sticky left-0'
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey='courses'
                                    fill='#0ea5e9'
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey='books'
                                    fill='#7dd3fc'
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Chart
