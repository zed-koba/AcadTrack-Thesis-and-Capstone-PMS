import { Mail, SquareUser, UserRoundSearch } from "lucide-react";
import {
  InputGroupInput,
  InputGroup,
  InputGroupAddon,
} from "../../ui/input-group";
import { Button } from "../../ui/button";

type FirstStepProps = {
  OnNext: () => void;
};

const FirstStep = ({ OnNext }: FirstStepProps) => {
  return (
    <div className="grid grid-row-3 gap-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-muted-foreground text-base">
            First Name:
          </p>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Username" required />
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-muted-foreground text-base">
            Middle Name:
          </p>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Middle Name" required />
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-muted-foreground text-base">
            Last Name:
          </p>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Last Name" required />
          </InputGroup>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1 col-span-2">
          <p className="font-semibold text-muted-foreground text-base">Email</p>
          <InputGroup>
            <InputGroupInput
              type="text"
              value="cedricvhonpidlaoan@gmail.com"
              disabled
            />
            <InputGroupAddon>
              <Mail />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-muted-foreground text-base">
            Student ID
          </p>
          <InputGroup>
            <InputGroupInput type="text" value="22-2000241" disabled />
            <InputGroupAddon>
              <SquareUser />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1 col-span-2">
          <p className="text-muted-foreground text-base font-semibold">
            Facebook Name
          </p>
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="ex: Zedric Pidlaoan"
              required
            />
            <InputGroupAddon>
              <UserRoundSearch />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex items-end justify-center w-full">
          <Button
            variant="primary"
            className="cursor-pointer w-full"
            onClick={OnNext}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
