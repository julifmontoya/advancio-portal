// components/SkeletonTickets.jsx
const SkeletonTickets = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="p-4 bg-white rounded shadow-sm border border-gray-200">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonTickets;
