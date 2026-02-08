import { Notebook, UserPen, Check } from "lucide-react";
import FirstStep from "./Starting/FirstStep";
import SecondStep from "./Starting/SecondStep";
import LastStep from "./Starting/LastStep";
import { useState } from "react";

const FirstLogin = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <section className="bg-background w-full h-screen flex justify-center items-center text-white text-base">
      <div className="grid grid-row-3 gap-5 p-3 border w-2xl">
        <div className="flex flex-col gap-2 justify-start items-center">
          <h2 className="text-3xl text-white">Get Started</h2>
          <p className="text-sm text-muted-foreground">Just 3 Easy Step</p>
        </div>
        <div className="grid grid-cols-5 place-items-center max-w-[460px] w-fit mx-auto">
          <div
            className={`relative ${
              step === 1 ? "bg-green-600 pulse" : "bg-green-600"
            } p-4 rounded-4xl text-white text-[12px] flex items-center justify-center z-1`}
          >
            {step > 1 ? (
              <Check size={24} strokeWidth={2.5} />
            ) : (
              <UserPen size={24} strokeWidth={2.5} />
            )}
          </div>
          <div
            className={`line-card ${
              step > 1 ? "bg-green-600" : "bg-[#1d2530]"
            } flex items-center justify-center`}
          ></div>
          <div
            className={`relative ${
              step === 1
                ? "bg-card"
                : step === 2
                ? "bg-green-600 pulse"
                : "bg-green-600"
            } p-4 rounded-4xl text-white text-[12px] flex items-center justfity-center z-1`}
          >
            {step === 3 ? (
              <Check size={24} strokeWidth={2.5} />
            ) : (
              <Notebook size={24} strokeWidth={2.5} />
            )}
          </div>
          <div
            className={`line-card ${
              step === 3 ? "bg-green-600" : "bg-[#1d2530]"
            } flex items-center justify-center`}
          ></div>
          <div
            className={`${
              step === 3 ? "bg-green-600 pulse" : "bg-card"
            } p-4 rounded-4xl text-white text-[12px] flex items-center justfity-center z-1`}
          >
            <Check size={24} strokeWidth={2.5} />
          </div>
        </div>
        {step === 1 && <FirstStep OnNext={nextStep} />}
        {step === 2 && <SecondStep OnNext={nextStep} OnPrev={prevStep} />}
      </div>
    </section>
  );
};

export default FirstLogin;
