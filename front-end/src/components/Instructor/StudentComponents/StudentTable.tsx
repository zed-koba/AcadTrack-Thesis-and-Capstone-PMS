import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiUrl } from "../../Routes/http";
import { useEffect, useState } from "react";
const SortButton = ({ label }: { label: string }) => (
  <Button
    variant="ghost"
    size="sm"
    className="-ml-3 h-8 font-semibold text-muted-foreground"
  >
    {label}
  </Button>
);
interface Student {
  id: number;
  email: string;
  role: string;
  student_id: string;
  program: string;
  section: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const StudentTable = () => {
  const [accounts, setAccounts] = useState<Student[]>([]);

  const fetchStudents = async () => {
    const res = await fetch(`${apiUrl}/accounts`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          setAccounts(result.data);
        } else {
          console.log("Somethng went wrong");
        }
      });
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <div className="rounded-lg border bg-card p-6 mt-5 shadow-sm">
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
              {accounts.length === 0 ? (
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
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default StudentTable;
