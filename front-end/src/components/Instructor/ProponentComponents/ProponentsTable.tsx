import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiUrl } from "@/components/Routes/http";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Search, Plus } from "lucide-react";
const SortButton = ({ label }: { label: string }) => (
  <Button
    variant="ghost"
    className="-ml-3 h-8 font-semibold text-muted-foreground"
    size="sm"
  >
    {label}
  </Button>
);
const ProponentsTable = () => {
  return (
    <>
      <div className="rounded-lg border bg-card p-6 mt-5 shadow-sm">
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
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground ">Total Students Accounts: 10</p>
        </div>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  <SortButton label="#" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Student ID" />
                </TableHead>
                <TableHead>
                  <SortButton label="Email" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Role" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Program" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Section" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Status" />
                </TableHead>
                <TableHead>
                  <SortButton label="Created At" />
                </TableHead>
                <TableHead>
                  <SortButton label="Updated At" />
                </TableHead>
                <TableHead>
                  <SortButton label="Actions" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {accounts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="-ml-3 h-8 text-white text-center"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((student) => (
                  <TableRow key={student.id} className="text-white">
                    <TableCell className="text-center">{student.id}</TableCell>
                    <TableCell className="text-center">
                      {student.student_id}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="text-center">
                      {student.role}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.program}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.section}
                    </TableCell>
                    <TableCell className="text-center">
                      <div
                        className={`text-base ${
                          student.status == "approved"
                            ? "bg-approved"
                            : student.status == "pending"
                            ? "bg-pending"
                            : "bg-destructive"
                        } p-3 border-none rounded-lg text-white`}
                      >
                        {student.status}
                      </div>
                    </TableCell>
                    <TableCell>{student.created_at}</TableCell>
                    <TableCell>{student.updated_at}</TableCell>
                  </TableRow>
                ))
              )} */}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ProponentsTable;
