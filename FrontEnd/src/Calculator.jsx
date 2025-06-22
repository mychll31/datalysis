import React, { useState } from 'react';
import CalculatorButtons from './Components/CalculatorButtons'; 

const Calculator = () => {
  const [output, setOutput] = useState('');

  const handleButtonClick = (value) => {
    switch (value) {
      case 'C':
        setOutput('');
        break;
      case 'Backspace':
        setOutput((prev) => prev.slice(0, -1));
        break;
      case '=':
        try {
          // Replace '×' and '÷' with '*' and '/' before evaluating
          const cleaned = output.replace(/×/g, '*').replace(/÷/g, '/');
          const result = eval(cleaned); // ⚠️ Don't use eval in production
          setOutput(result.toString());
        } catch {
          setOutput('Error');
        }
        break;
      case 'sqr':
        try {
          const result = Math.sqrt(eval(output));
          setOutput(result.toString());
        } catch {
          setOutput('Error');
        }
        break;
      default:
        setOutput((prev) => prev + value);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <CalculatorButtons onButtonClick={handleButtonClick} output={output} />
    </div>
  );
};

export default Calculator;
