const Cards = () => {
    return (
        <div className="flex justify-center items-start">
            {[1, 2, 3, 4].map((index) => (
                <div key={index} className="max-w-[720px] mx-8">
                    <div className="block mb-11 mx-auto border-b border-slate-300 dark:border-gray-600 pb-2 max-w-[360px]"></div>
                    
                    <div className="relative flex flex-col text-gray-700 dark:text-gray-300 outline-gray-500 dark:outline-gray-600 outline bg-gray-200 dark:bg-gray-800 shadow-md bg-clip-border rounded-xl w-72 h-96">
                        
                        <div className="flex flex-col items-center outline outline-white dark:outline-gray-700 mx-4 mt-5 overflow-hidden text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 bg-clip-border rounded-xl">
                            
                            <div className={`relative mx-1 mt-5 overflow-hidden bg-iconImg${index} bg-no-repeat bg-contain bg-clip-border w-20 h-28`}></div>

                            <p className="text-center mx-5 my-5">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia dignissimos porro magnam voluptatibus reiciendis exercitationem facilis provident sequi quibusdam id.
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Cards;
