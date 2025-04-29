import React from 'react';

const CalculatorButtons = ({ onButtonClick, output }) => {
  const handleClick = (value) => {
    onButtonClick(value);
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-100 max-w-md mx-auto">
      {/* Output Screen outside of button grid */}
      <div className="bg-black text-white text-left text-2xl font-mono p-4 rounded mb-8 h-16 overflow-x-auto w-full">
        {output || '0'}
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-4 w-full">
        <button onClick={() => handleClick('sqr')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">sqrt</button>
        <button onClick={() => handleClick('(')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">(</button>
        <button onClick={() => handleClick(')')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">)</button>
        <button onClick={() => handleClick('C')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 h-12 w-20 rounded-md">C</button>

        <button onClick={() => handleClick('7')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">7</button>
        <button onClick={() => handleClick('8')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">8</button>
        <button onClick={() => handleClick('9')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">9</button>
        <button onClick={() => handleClick('+')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 h-12 w-20 rounded-md">+</button>

        <button onClick={() => handleClick('4')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">4</button>
        <button onClick={() => handleClick('5')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">5</button>
        <button onClick={() => handleClick('6')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">6</button>
        <button onClick={() => handleClick('-')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 h-12 w-20 rounded-md">-</button>
            
        <button onClick={() => handleClick('1')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">1</button>
        <button onClick={() => handleClick('2')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">2</button>
        <button onClick={() => handleClick('3')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">3</button>
        <button onClick={() => handleClick('*')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 h-12 w-20 rounded-md">×</button>

        <button onClick={() => handleClick('%')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">%</button>
        <button onClick={() => handleClick('0')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">0</button>
        <button onClick={() => handleClick('.')} className="bg-white hover:bg-gray-400 text-gray-800 font-medium py-2 h-12 w-20 rounded-md">.</button>
        <button onClick={() => handleClick('/')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 h-12 w-20 rounded-md">/</button>
      </div>

      {/* Backspace & Equals */}
      <div className='grid grid-cols-2 gap-4 pt-4 w-full'>
        <button onClick={() => handleClick('Backspace')} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 h-12 rounded-md">⌫</button>
        <button onClick={() => handleClick('=')} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 h-12 rounded-md">=</button>
      </div>
    </div>
  );
};

export default CalculatorButtons;