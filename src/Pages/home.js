import SideBar from '../Components/Sidebar';
import NavBar from '../Components/Navbar';
import Cards from '../Components/Cards';
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
            <p className="text-center text-white text-xl font-light pt-10 px-14">
            Turn Your Data into Smart Decisions. Upload your database, <br/> get instant insights, and unlock powerful analytics—all in one <br/> secure platform. No coding required
            </p>
        </section>
        <section>
          <div className="container mx-auto px-4 "> 
            <h2 className="text-3xl font-bold text-gray-500 mb-3 text-center py-10"> 
              Drive smarter with powerful analytics
            </h2>
          </div>
        </section>
        <Cards />
        </>
      );  
}

export default Home;