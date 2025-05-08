import React, { useState, useEffect, useCallback } from "react";

const Calculator = ({ input, setInput, savedVariables }) => {
  const [result, setResult] = useState("");
  const [activeCategory, setActiveCategory] = useState("Financial");
  const [showFormulas, setShowFormulas] = useState(false);
  const [selectedFormulaName, setSelectedFormulaName] = useState("");


  const formulaCategories = {
    Financial: [
      { name: "Return on Investment", formula: "(Net_Profit / Cost_of_Investment) * 100" },
      { name: "Gross Profit Margin", formula: "((Revenue - Cost_of_Goods_Sold) / Revenue) * 100" },
      { name: "Operating Profit Margin", formula: "(Operating_Income / Revenue) * 100" },
      { name: "Net Profit Margin", formula: "(Net_Profit / Revenue) * 100" },
      { name: "Current Ratio", formula: "Current_Assets / Current_Liabilities" },
      { name: "Debt-to-Equity Ratio", formula: "Total_Debt / Total_Equity" },
      { name: "Return on Assets", formula: "Net_Profit / Total_Assets" },
      { name: "Return on Equity", formula: "Net_Profit / Shareholders_Equity" }
    ],
    Marketing: [
      { name: "Conversion Rate", formula: "(Conversions / Visitors) * 100" },
      { name: "Customer Acquisition Cost", formula: "Marketing_Spend / New_Customers" },
      { name: "Customer Lifetime Value", formula: "Average_Purchase_Value * Purchase_Frequency * Customer_Lifespan" },
      { name: "Click-Through Rate", formula: "(Clicks / Impressions) * 100" },
      { name: "Bounce Rate", formula: "(Single_Page_Visits / Total_Visits) * 100" },
      { name: "Email Open Rate", formula: "(Opened_Emails / Sent_Emails) * 100" }
    ],
    Sales: [
      { name: "Average Order Value", formula: "Revenue / Number_of_Orders" },
      { name: "Sales Growth Rate", formula: "((Current_Sales - Previous_Sales) / Previous_Sales) * 100" },
      { name: "Lead Conversion Rate", formula: "(Converted_Leads / Total_Leads) * 100" },
      { name: "Sales per Rep", formula: "Total_Sales / Number_of_Reps" },
      { name: "Average Sales Cycle", formula: "Total_Days_to_Close / Number_of_Deals" }
    ],
    Customer: [
      { name: "Customer Retention Rate", formula: "((Customers_End - New_Customers) / Customers_Start) * 100" },
      { name: "Churn Rate", formula: "(Lost_Customers / Customers_Start) * 100" },
      { name: "Net Promoter Score", formula: "(Promoters - Detractors) / Total_Respondents * 100" },
      { name: "Customer Satisfaction Score", formula: "SUM(Satisfaction_Scores) / Number_of_Responses" }
    ],
    Operations: [
      { name: "Inventory Turnover", formula: "Cost_of_Goods_Sold / Average_Inventory" },
      { name: "Employee Productivity", formula: "Total_Output / Total_Hours_Worked" },
      { name: "Capacity Utilization", formula: "(Actual_Output / Maximum_Output) * 100" },
      { name: "Order Fulfillment Time", formula: "SUM(Time_to_Fulfill) / Number_of_Orders" }
    ],

  };

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        let expression = input;
        expression = expression.replace(/Sqrt/g, "Math.sqrt");
        expression = expression.replace(/%/g, "/100");
    
        savedVariables.forEach((variable) => {
          const regex = new RegExp(`\\b${variable.name}\\b`, "g");
          expression = expression.replace(regex, variable.value);
        });
    
        // eslint-disable-next-line no-eval
        const calculatedResult = eval(expression);
        setResult(calculatedResult.toString());
      } catch (error) {
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleKeyDown = useCallback(
    (e) => {
      const key = e.key;
      if (allowedKeys.includes(key)) {
        if (key === "Enter") {
          handleButtonClick("=");
        } else if (key === "Delete") {
          handleButtonClick("C");
        } else if (key === "Backspace") {
          handleButtonClick("Backspace");
        } else {
          handleButtonClick(key);
        }
      }
    },
    [input]
  );

  const insertFormula = (formula) => {
    setInput(formula);
    setShowFormulas(false);
  };

  return (
    <div className="flex flex-row rounded-lg shadow-lg w-10/12 mb-10">
      {/* Display Area */}
      <div className="p-4 w-full bg-white rounded-lg shadow-inner">
        <div className="text-lg h-6 mb-2">{selectedFormulaName}</div>
        
        {/* Formula Selection */}
        <div className="relative mb-4">
          <button 
            onClick={() => setShowFormulas(!showFormulas)}
            className="w-full p-2 rounded border border-gray-300 bg-gray-100 text-sm text-left"
          >
            {showFormulas ? "Hide Formulas" : "Show Formula Categories"}
          </button>
          
          {showFormulas && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {/* Category Tabs */}
              <div className="flex flex-wrap border-b border-gray-200">
                {Object.keys(formulaCategories).map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-sm font-bold ${activeCategory === category ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* Formulas List */}
              <div className="max-h-60 overflow-y-auto">
                {formulaCategories[activeCategory].map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                       insertFormula(item.formula)
                       setSelectedFormulaName(item.name)
                     } }
                    className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.formula}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full text-right text-2xl font-semibold p-4 bg-gray-300 rounded-lg border-none outline-none"
          onKeyDown={handleKeyDown}
          placeholder="Enter calculation or select formula"
        />
        <div className="text-right text-gray-800 text-3xl font-bold mt-2 h-10">
          {result}
        </div>
      </div>

      {/* Calculator Buttons */}
      <CalculatorButtons onButtonClick={handleButtonClick} />
    </div>
  );
};

const CalculatorButtons = ({ onButtonClick }) => {
  const handleClick = (value) => {
    onButtonClick(value);
  };

  // Added more mathematical functions
  return (
    <div className="w-full flex p-2 rounded-lg">
      <div className="w-1/8 grid grid-cols-4 gap-2 p-2 rounded-lg">
        {/* First Row - Functions */}
        <button
          onClick={() => handleClick("Sqrt(")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold h-16 w-16 rounded-md text-5xl shadow-md "
          title="Square Root"
        >
          √
        </button>
        <button
          onClick={() => handleClick("(")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold h-16 w-16 pb-2 pr-2 rounded-md text-5xl shadow-md"
        >
          (
        </button>
        <button
          onClick={() => handleClick(")")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold pb-2 pl-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          )
        </button>
        <button
          onClick={() => handleClick("C")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          C
        </button>

        {/* Second Row */}
        <button
          onClick={() => handleClick("7")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          7
        </button>
        <button
          onClick={() => handleClick("8")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          8
        </button>
        <button
          onClick={() => handleClick("9")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          9
        </button>
        <button
          onClick={() => handleClick("+")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          +
        </button>

        {/* Third Row */}
        <button
          onClick={() => handleClick("4")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          4
        </button>
        <button
          onClick={() => handleClick("5")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          5
        </button>
        <button
          onClick={() => handleClick("6")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          6
        </button>
        <button
          onClick={() => handleClick("-")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          -
        </button>

        {/* Fourth Row */}
        <button
          onClick={() => handleClick("1")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          1
        </button>
        <button
          onClick={() => handleClick("2")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          2
        </button>
        <button
          onClick={() => handleClick("3")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          3
        </button>
        <button
          onClick={() => handleClick("*")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          ×
        </button>

        {/* Fifth Row */}
        <button
          onClick={() => handleClick("%")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          %
        </button>
        <button
          onClick={() => handleClick("0")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          0
        </button>
        <button
          onClick={() => handleClick(".")}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          .
        </button>
        <button
          onClick={() => handleClick("/")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          /
        </button>
      </div>

      <div className="grid grid-rows-2 gap-2 p-2 rounded-lg">
        <button
          onClick={() => handleClick("Backspace")}
          className="bg-gray-800 hover:bg-cyan-900 text-yellow-400 font-bold pb-2 h-16 w-16 rounded-md text-5xl shadow-md"
        >
          ⌫
        </button>
        <div className="grid items-end">
          <button
            onClick={() => handleClick("=")}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold pb-2 w-16 h-[137px] rounded-md text-5xl shadow-md"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;