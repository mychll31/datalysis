import React, { useEffect } from "react";

const JargonModal = ({ isOpen, onClose }) => {
  // lock background scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h4 className="text-2xl font-semibold text-gray-900">
            Jargon Definitions
          </h4>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="space-y-4 text-base text-gray-700">
            {[
              ["Mean", "The arithmetic average of all data points."],
              ["Median", "The middle value when data are sorted."],
              ["Variance", "The average of squared deviations from the mean."],
              ["Standard Deviation", "Square root of variance; measures data dispersion."],
              ["Min / Max", "The smallest and largest data values."],
              ["Range", "Difference between max and min values."],
              ["Skewness", "Degree of asymmetry in the distribution."],
              ["IQR (Interquartile Range)", "Middle 50% spread (Q3−Q1)."],
              ["Z-score", "Distance from mean in units of standard deviation."],
              ["ANOVA", "Analysis of Variance, tests differences between group means."],
              ["Chi-square", "Tests association between categorical variables."],
              ["R²", "Proportion of variance explained by a model."],
              ["RMSE", "Root Mean Squared Error, average model prediction error."],
              ["MAE", "Mean Absolute Error, average absolute model prediction error."],
            ].map(([term, desc]) => (
              <li key={term} className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                <div>
                  <span className="font-semibold text-gray-900">{term}</span>: {desc}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default JargonModal;
