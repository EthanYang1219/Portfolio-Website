import React from 'react';

interface RealismButtonProps {
  text: string;
  onClick?: () => void;
}

const RealismButton: React.FC<RealismButtonProps> = ({ text, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group relative p-[1.5px] rounded-[16px] text-[0.88rem] font-mono tracking-wider uppercase font-semibold border-none cursor-pointer bg-[radial-gradient(circle_80px_at_80%_-10%,_rgba(255,255,255,0.15),_#181b1b)] active:scale-[0.98] transition-all select-none"
    >
      {/* Subtle Glow behind button */}
      <div 
        className="absolute top-0 right-0 w-[65%] h-[60%] rounded-[120px] shadow-[0_0_20px_rgba(200,90,50,0.12)] group-hover:shadow-[0_0_30px_rgba(200,90,50,0.25)] transition-all duration-300 ease-out -z-10" 
        aria-hidden="true"
      />

      {/* Bottom-left subtle sienna/orange blob */}
      <div 
        className="absolute bottom-0 left-0 w-[40px] h-[50%] rounded-[17px] transition-all duration-300 ease-out 
          bg-[radial-gradient(circle_50px_at_0%_100%,_#C85A32,_rgba(200,90,50,0.3),_transparent)] 
          shadow-[-2px_4px_25px_rgba(200,90,50,0.15)] 
          group-hover:w-[70px] group-hover:shadow-[-4px_1px_30px_rgba(200,90,50,0.3)]" 
        aria-hidden="true"
      />

      {/* Inner tactile content */}
      <div className="relative px-[22px] py-[10px] group-hover:scale-[1.03] rounded-[14.5px] text-white bg-[radial-gradient(circle_80px_at_80%_-50%,_#333333,_#0f1111)] z-10 transition-all duration-300">
        {text}

        {/* Inner glow layer */}
        <div 
          className="absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_60px_at_0%_100%,_rgba(200,90,50,0.08),_rgba(0,0,0,0.3),_transparent)] z-[-1]" 
          aria-hidden="true"
        />
      </div>
    </button>
  );
};

export default RealismButton;
