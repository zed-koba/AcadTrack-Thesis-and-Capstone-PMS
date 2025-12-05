import ProponentsTable from "../ProponentComponents/ProponentsTable";

const Proponents = () => {
  interface ProponentsProps {
    proponent_id: string;
    academic_yr: string;
    semester: number;
    title: string;
    adviser: string;
  }
  return (
    <>
      <div className="flex items-center justify-between text-white text-base">
        <div className="flex items-start flex-col justify-start">
          <span className="text-2xl text-white">Thesis and Capstones</span>
          <span className="text-sm text-white">
            Manage proponents records and project approval status.
          </span>
        </div>
      </div>
      <ProponentsTable />
    </>
  );
};

export default Proponents;
