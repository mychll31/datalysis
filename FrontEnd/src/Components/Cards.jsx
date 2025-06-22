const Cards = () => {
    return (
        <div className="flex justify-center items-start">
        {/* Card 1     */}
            <div className="max-w-[720px] mx-8">
                <div className="block mb-11 mx-auto border-b border-slate-300 dark:border-gray-600 pb-2 max-w-[360px]"></div>
                
                <div className="relative flex flex-col text-gray-700 dark:text-gray-300 outline-gray-500 dark:outline-gray-600 outline bg-gray-200 dark:bg-gray-800 shadow-md bg-clip-border rounded-xl w-72 h-96">
                    
                    <div className="flex flex-col items-center outline outline-white dark:outline-gray-700 mx-4 mt-5 overflow-hidden text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 bg-clip-border rounded-xl">
                        
                        <div className={`relative mx-1 mt-5 overflow-hidden bg-iconImg1 bg-no-repeat bg-contain bg-clip-border w-20 h-28`}></div>

                        <p className="text-center mx-5 my-5">
                        Quickly upload your datasets from various sources with just a few clicks. Our tool supports CSV, Excel, and other common formats, making data onboarding effortless.
                        </p>
                    </div>
                </div>
            </div>
        {/* Card 2     */}
            <div className="max-w-[720px] mx-8">
                <div className="block mb-11 mx-auto border-b border-slate-300 dark:border-gray-600 pb-2 max-w-[360px]"></div>
                
                <div className="relative flex flex-col text-gray-700 dark:text-gray-300 outline-gray-500 dark:outline-gray-600 outline bg-gray-200 dark:bg-gray-800 shadow-md bg-clip-border rounded-xl w-72 h-96">
                    
                    <div className="flex flex-col items-center outline outline-white dark:outline-gray-700 mx-4 mt-5 overflow-hidden text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 bg-clip-border rounded-xl">
                        
                        <div className={`relative mx-1 mt-5 overflow-hidden bg-iconImg2 bg-no-repeat bg-contain bg-clip-border w-20 h-28`}></div>

                        <p className="text-center mx-5 my-5">
                           Detect and correct inconsistencies, missing values, and formatting issues. Ensure your data is clean and ready for analysis without manual hassle.
                        </p>
                    </div>
                </div>
            </div>
        {/* Card 3     */}
            <div className="max-w-[720px] mx-8">
                <div className="block mb-11 mx-auto border-b border-slate-300 dark:border-gray-600 pb-2 max-w-[360px]"></div>
                
                <div className="relative flex flex-col text-gray-700 dark:text-gray-300 outline-gray-500 dark:outline-gray-600 outline bg-gray-200 dark:bg-gray-800 shadow-md bg-clip-border rounded-xl w-72 h-96">
                    
                    <div className="flex flex-col items-center outline outline-white dark:outline-gray-700 mx-4 mt-5 overflow-hidden text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 bg-clip-border rounded-xl">
                        
                        <div className={`relative mx-1 mt-5 overflow-hidden bg-iconImg3 bg-no-repeat bg-contain bg-clip-border w-20 h-28`}></div>

                        <p className="text-center mx-5 my-5">
                            Unlock insights with advanced analytical tools. From statistical summaries to trend detection, our platform simplifies complex analysis for actionable results.
                        </p>
                    </div>
                </div>
            </div>
        {/* Card 4     */}
            <div className="max-w-[720px] mx-8">
                <div className="block mb-11 mx-auto border-b border-slate-300 dark:border-gray-600 pb-2 max-w-[360px]"></div>
                
                <div className="relative flex flex-col text-gray-700 dark:text-gray-300 outline-gray-500 dark:outline-gray-600 outline bg-gray-200 dark:bg-gray-800 shadow-md bg-clip-border rounded-xl w-72 h-96">
                    
                    <div className="flex flex-col items-center outline outline-white dark:outline-gray-700 mx-4 mt-5 overflow-hidden text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 bg-clip-border rounded-xl">
                        
                        <div className={`relative mx-1 mt-5 overflow-hidden bg-iconImg4 bg-no-repeat bg-contain bg-clip-border w-20 h-28`}></div>

                        <p className="text-center mx-5 my-5">
                            Transform your data into compelling visuals. Choose from charts, graphs, and dashboards to clearly communicate insights and trends.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Cards;
