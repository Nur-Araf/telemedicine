import Campaigns from "../components/Campaigns";
import Doctors from "../components/Doctors";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  return (
    <main>
      <Hero />
      <Campaigns />
      <HowItWorks />
      <Doctors />
      <Footer />
    </main>
  );
}
