import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    return (
        <div className="flex bg-gray-100">
            <Sidebar />

            <div className="ml-64 flex-1 min-h-screen p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                {/* Add your dashboard content here */}
            </div>
        </div>
    );
}

export default Dashboard;
