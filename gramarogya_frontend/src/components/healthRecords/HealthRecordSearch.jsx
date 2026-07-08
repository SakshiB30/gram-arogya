import { Search } from "lucide-react";

const HealthRecordSearch = ({ search, setSearch }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:w-96">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by beneficiary or diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Future Filters */}
      <div className="flex gap-3">
        {/* Diagnosis Filter */}
        {/* Visit Filter */}
        {/* Export Button */}
      </div>

    </div>
  );
};

export default HealthRecordSearch;