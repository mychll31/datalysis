import React from 'react';

const CalculatorButtons = ({ onButtonClick }) => {
  const handleClick = (value) => {
    onButtonClick(value);
  };

  return (
    <div className='w-full flex p-2 rounded-lg '>
        <div className="w-1/8 grid grid-cols-4 gap-2  p-2 rounded-lg">
        {/* First Row */}
        <button 
            onClick={() => handleClick('Sqrt')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md"
        >
            sqr
        </button>
        <button 
            onClick={() => handleClick('(')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium h-16 w-16 py-4 rounded-md text-xl"
        >
            (
        </button>
        <button 
            onClick={() => handleClick(')')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            )
        </button>
        <button 
            onClick={() => handleClick('+')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            C
        </button>

        {/* Second Row */}
        <button 
            onClick={() => handleClick('7')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            7
        </button>
        <button 
            onClick={() => handleClick('8')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            8
        </button>
        <button 
            onClick={() => handleClick('9')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            9
        </button>
        <button 
            onClick={() => handleClick('+')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            +
        </button>

        {/* Third Row */}
        <button 
            onClick={() => handleClick('4')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            4
        </button>
        <button 
            onClick={() => handleClick('5')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            5
        </button>
        <button 
            onClick={() => handleClick('6')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            6
        </button>
        <button 
            onClick={() => handleClick('-')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            -
        </button>

        {/* Fourth Row */}
        <button 
            onClick={() => handleClick('1')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            1
        </button>
        <button 
            onClick={() => handleClick('2')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            2
        </button>
        <button 
            onClick={() => handleClick('3')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            3
        </button>
        <button 
            onClick={() => handleClick('*')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            ×
        </button>

        {/* Fifth Row - Equals button */}
        <button 
            onClick={() => handleClick('%')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            %
        </button>
        <button 
            onClick={() => handleClick('0')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            0
        </button>
        <button 
            onClick={() => handleClick('.')}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            .
        </button>
        <button 
            onClick={() => handleClick('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-md text-xl"
        >
            /
        </button>
        
       
        </div>
        <div className=' grid grid-rows-2 gap-2 p-2 rounded-lg'>

        <button 
            onClick={() => handleClick('Backspace')}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-4 h-16 w-16 rounded-md text-xl"
        >
            C
        </button>
        <div className='grid items-end'>
            <button 
                onClick={() => handleClick('=')}
                className=" bg-green-500 hover:bg-green-600 text-white  font-medium py-4 w-16 h-[137px] rounded-md text-xl "
            >
                =
            </button>
        </div>
        </div>
    </div>
  );
};

export default CalculatorButtons;