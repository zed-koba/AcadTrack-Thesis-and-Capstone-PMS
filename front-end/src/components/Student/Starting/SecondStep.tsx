import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@radix-ui/react-tooltip";
import { Mail, CircleAlert } from "lucide-react";

type SecondStepProps = {
  OnNext: () => void;
  OnPrev: () => void;
};

const SecondStep = ({ OnNext, OnPrev }: SecondStepProps) => {
  return (
    <div className="grid grid-row-3 gap-2">
      <div className="grid grid-row-4 gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg text-white font-semibold flex items-center gap-2">
            Groupmates:
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleAlert size={16} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent
                  className="w-64 text-center z-2 bg-gray-700 rounded-md px-3 py-1.5"
                  side="top"
                >
                  <p className="text-gray-200 text-sm font-normal">
                    Enter your groupmates' registered email addresses to invite
                    them. This is optional, you can invite them later if needed.
                  </p>
                  <TooltipArrow className="fill-gray-700" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h2>
          <InputGroup>
            <InputGroupInput
              type="email"
              placeholder="Enter your groupmate email address"
            />
            <InputGroupAddon>
              <Mail />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <InputGroup>
          <InputGroupInput
            type="email"
            placeholder="Enter your groupmate email address"
          />
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            type="email"
            placeholder="Enter your groupmate email address"
          />
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            type="email"
            placeholder="Enter your groupmate email address"
          />
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Button variant="primary" className="cursor-pointer" onClick={OnNext}>
        Save Changes
      </Button>
    </div>
  );
};

export default SecondStep;
