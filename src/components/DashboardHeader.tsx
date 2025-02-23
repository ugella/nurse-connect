import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">NurseConnect</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600">
            <UserCircle className="h-5 w-5 mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
