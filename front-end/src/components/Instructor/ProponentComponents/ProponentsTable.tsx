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
import type { ProponentsProps } from "../interface/proponent";

import { Search, Plus, PencilRuler, ReceiptText, Trash } from "lucide-react";
import ProponentsAdd from "./ProponentsAdd";
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
    const [proponents, setProponents] = useState<ProponentsProps[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}/proponents`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        Accept: "application/json",
                    },
                })
                if(!res.ok) throw new Error("Failed to fetch data");
                
                const data = await res.json();
                setProponents(data.data); 
            }catch(error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        };
    useEffect(() => {
        fetchData();
    }, []);     
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
              <InputGroupAddon align="inline-end">0 results</InputGroupAddon>
            </InputGroup>
          </div>
          <div className="space-y-6 text-white">
           <ProponentsAdd onSuccess={fetchData}/>
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
                <TableHead>
                  <SortButton label="Title" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Academic Year" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Semester" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Program" />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton label="Adviser" />
                </TableHead>
                <TableHead>
                  <SortButton label="Created At" />
                </TableHead>
                <TableHead>
                  <SortButton label="Updated At" />
                </TableHead>
                <TableHead className="text-right">
                  <SortButton label="Actions" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                    <TableCell colSpan={9} className="-ml-3 h-8 text-white text-center">
                        Loading...
                    </TableCell>
                    </TableRow>
                ) : proponents.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={9} className="-ml-3 h-8 text-white text-center">
                        No proponents are found
                    </TableCell>
                    </TableRow>
                ) : (
                    proponents.map((proponent) => (
                    <TableRow key={proponent.proponents_id} className="text-white">
                        <TableCell className="text-center">{proponent.proponents_id}</TableCell>
                        <TableCell className="">{proponent.title}</TableCell>
                        <TableCell className="text-center">{proponent.academic_yr}</TableCell>
                        <TableCell className="text-center">{proponent.semester === 1 ? "1st Semester" : "2nd Semester"}</TableCell>
                        <TableCell className="text-center">{proponent.program}</TableCell>
                        <TableCell className="text-center">{proponent.adviser}</TableCell>
                        <TableCell>{proponent.created_at}</TableCell>
                        <TableCell>{proponent.updated_at}</TableCell>
                        <TableCell className="text-right flex gap-2 justify-end items-center">
                            <Button
                            className="p-3 cursor-pointer hover:bg-green-600 bg-card text-green-600 hover:text-white flex justify-center items-center"
                            aria-label="Edit"
                            title="Edit">
                                <PencilRuler size={16}/>
                            </Button>
                            <Button
                            className="p-3 cursor-pointer hover:bg-blue-500 bg-card text-blue-500 hover:text-white flex justify-center items-center"
                            aria-label="Details"
                            title="Details">
                                <ReceiptText size={16}/>
                            </Button>
                            <Button
                            className="p-2 cursor-pointer hover:bg-red-600 bg-card text-red-600 hover:text-white flex justify-center items-center"
                            aria-label="Delete"
                            title="Delete">
                                <Trash size={24}/>
                            </Button>

                        </TableCell>
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

export default ProponentsTable;
