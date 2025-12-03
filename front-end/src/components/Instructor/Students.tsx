import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "../ui/input-group";
import { Button } from "../ui/button";
import Sidebar from "./Layout/Sidebar";
import { Search, Plus } from "lucide-react";
import StudentTable from "./Layout/StudentTable";

const Students = () => {
  return (
    <>
      <div className="flex flex-wrap content-start relative">
        <Sidebar />
        <main className="px-4 py-3 bg-background grow relative">
          <div className="flex items-center justify-between text-white text-base">
            <div className="flex items-start flex-col justify-start">
              <span className="text-2xl text-white">Student List</span>
              <span className="text-sm text-white">
                Manage students records and approval status
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-6 text-white">
              <InputGroup>
                <InputGroupInput placeholder="Search...." />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
              </InputGroup>
            </div>
            <div className="space-y-6 text-white">
              <Button variant="primary">
                Add Student <Plus />
              </Button>
            </div>
          </div>
          <StudentTable />
        </main>
      </div>
    </>
  );
};

export default Students;
