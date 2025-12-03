import { Button } from "@/components/ui/button";

type SecondStepProps = {
  OnNext: () => void;
  OnPrev: () => void;
};

const SecondStep = ({ OnNext, OnPrev }: SecondStepProps) => {
  return (
    <div className="grid grid-row-3 gap-2">
      <Button variant="primary" className="cursor-pointer" onClick={OnNext}>
        Save Changes
      </Button>
    </div>
  );
};

export default SecondStep;
