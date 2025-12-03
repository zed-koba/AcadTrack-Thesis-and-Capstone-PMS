import { Notebook, Calendar, Check } from "lucide-react";

const FirstLogin = () => {
  return (
    <section className="bg-background w-full h-screen flex justify-center items-center text-white text-base">
      <div className="grid grid-row-3 p-3 border w-2xl">
        <div className="flex flex-col gap-2 justify-start items-center">
          <h2 className="text-3xl text-white">Get Started</h2>
          <p className="text-sm text-muted-foreground">Just 3 Easy Step</p>
        </div>
        <div className="flex justify-between items-start">
          <div className="started-card relative bg-green-600 p-5 rounded-4xl text-white text-[12px] flex items-center justify-center">
            <Notebook size={20} strokeWidth={2.5} />
          </div>
          <div className="started-card relative bg-card p-5 rounded-4xl text-white text-[12px] flex items-center justfity-center">
            <Calendar size="20" />
          </div>
          <div className="bg-card p-5 rounded-4xl text-white text-[12px] flex items-center justfity-center">
            <Check size="20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstLogin;
