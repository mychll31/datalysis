import SideBar from '../Components/Sidebar';
import NavBar from '../Components/Navbar/Navbar';
import Cards from '../Components/Cards';
import Team from '../Components/Team';
const Home = () => {
    return (
        <>
        <section className="bg-bannerImg bg-no-repeat bg-cover bg-bottom w-full h-screen">
          <div className="flex">
            <NavBar />
          </div>
            <h1 className="text-center text-white text-8xl font-medium pt-40 px-14">
              Clarity in every <br/>number
            </h1>
            <p className="text-center text-white text-xl font-light pt-10 px-14 mb-60">
            Turn Your Data into Smart Decisions. Upload your database, <br/> get instant insights, and unlock powerful analytics—all in one <br/> secure platform. No coding required
            </p>
        </section>
          <div className='flex flex-row justify-center bg-gray-100'>
            <a href="https://www.facebook.com/valenin.it.services">
              <div className='px-48 py-16  bg-valenin bg-contain bg-no-repeat bg-center mx-40'>
              </div>
            </a>
            <a href="https://www.facebook.com/gencysecommercesolutions">
              <div className='px-48 py-16 bg-gencys bg-contain bg-no-repeat bg-center mx-40'>
              </div>
            </a>
          </div>
        <section>
          <div className="container mx-auto px-4 "> 
            <h2 id="services" className="text-3xl font-bold text-gray-500 mb-3 text-center py-10"> 
              Drive smarter with powerful analytics
            </h2>
          </div>
        </section>
        <Cards />
        <div>
                <p className="text-2xl mx-14 font-medium text-gray-500 mb-3 text-center py-10">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia dignissimos porro magnam voluptatibus reiciendis exercitationem facilis provident sequi quibusdam id.
                </p>
        </div>
        <section className='bg-gray-300'>
          <div className="container mx-auto px-4 "> 
            <h2 id="team" className="text-3xl font-bold text-gray-500 mb-3 text-center py-10"> 
              Meet the Team!
            </h2>
            <Team />
          </div>
        </section>
        </>
      );  
}

export default Home;