import { FiFacebook, FiGithub, FiTwitter } from "react-icons/fi";

import { SiDiscord } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 mt-16">
      <div>
        <img src="/wicket_short.svg" className="w-16 h-16" />
        <p className="font-bold">Wicket Journeys</p>
        <p>Copyright © 2022 - All right reserved</p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-5">
          <a>
            <FiFacebook className="text-2xl fill-base-content stroke-base-content" />
          </a>
          <a>
            <FiTwitter className="text-2xl fill-base-content stroke-base-content" />
          </a>
          <a>
            <FiGithub className="text-2xl fill-base-content stroke-base-content" />
          </a>
          <a>
            <SiDiscord className="text-2xl fill-base-content stroke-base-content" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
