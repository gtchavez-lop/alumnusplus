import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

const InnerParticle = (props) => {
  // particlejs
  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);
  return (
    <Particles
      init={particlesInit}
      loaded={particlesLoaded}
      className="absolute top-0 left-0 w-full h-full hover:opacity-0 transition-opacity duration-200"
      options={{
        // snowing particles without backgo9urnd
        fullScreen: false,
        particles: {
          number: {
            value: 10,
          },
          move: {
            enable: true,
            speed: 7,
            straight: true,
            direction: "right",
            random: true,
          },
          color: {
            value: "#afafaf",
          },
          shape: {
            type: "square",
          },
          opacity: {
            value: 0.1,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0,
              sync: false,
            },
          },
          size: {
            value: 100,
          },
          rotate: {
            value: -10,
          },
        },
      }}
    />
  );
};

export default InnerParticle;
