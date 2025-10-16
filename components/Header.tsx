import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
   
      <div className="text-3xl font-semibold">Case Management Dashboard</div>
      </div>
      <div className="bg-teal-700 p-2 rounded-md shadow-md hover:shadow-xl cursor-pointer">
        Refresh
      </div>
    </div>
  );
};

export default Header;
