import Chart from '@/app/(components)/chart'
import DashboardCard from '@/app/(components)/dashboardCard'

export default function Dashboard() {
    return (
        <>
            <div className='flex items-center gap-4 mb-6'>
                <DashboardCard
                    heading='Total Revenue (Courses)'
                    revenue='500000'
                    up={true}
                    percentAmount='20'
                    profit={true}
                />
                <DashboardCard
                    heading='Total Revenue (Books)'
                    revenue='500000'
                    up={false}
                    percentAmount='20'
                    profit={true}
                />
                <DashboardCard
                    heading='New Students'
                    revenue='500'
                    up={false}
                    percentAmount='20'
                />
                <DashboardCard
                    heading='Total Students'
                    revenue='50000'
                    up={true}
                    percentAmount='20'
                />
                <DashboardCard
                    heading='Total Visits'
                    revenue='50000'
                    up={false}
                    percentAmount='20'
                />
            </div>
            <div className='flex justify-start items-center h-[80vh] mb-6 gap-3'>
                <Chart />
                <div className='w-1/2 h-full bg-white p-6 rounded-2xl shadow'>Student View</div>
            </div>

            {/* <Chart /> */}
        </>
    )
}
