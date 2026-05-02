import MagicBento from "./Middle/HeroSection";
import ArtistsSection from "./Middle/ArtistsSection";
import PlaylistSection from "./Middle/PlaylistSection";


const Middle = () => {
  return (
    <div className="p-5! mt-20!">
      <MagicBento />
      
      <ArtistsSection />

      <PlaylistSection />

    </div>
  );
};

export default Middle;