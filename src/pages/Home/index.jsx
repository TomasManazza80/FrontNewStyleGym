import './App.css';
import AboutSection from './Components/AboutSection/AboutSection';
import ContactSection from './Components/ContactSection/ContactSection';
import FeaturesSection from './Components/FeaturesSection/FeaturesSection';
import Footer from './Components/Footer/Footer';
import Hero from './Components/Hero/Hero';
import JoinSection from './Components/JoinSection/JoinSection';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import PlansSection from './Components/PlansSection/PlansSection';
import Spacer from './Components/Spacer/Spacer';
import TrainSection from './Components/TrainSection/TrainSection';
import Calendar from './Components/Calendar/calendar'; 
import Staf from './Components/staf/staf'; // Import the Staf component



function HOME() {
  return (
    <div className="App">

      <Hero />
      <AboutSection />
      <Staf/>
      <Spacer />
      <Calendar />
      <JoinSection />
      <PlansSection />
      <TrainSection />
      <ContactSection />
      <Spacer />
      <Footer />
    </div>
  );
}

export default HOME;
