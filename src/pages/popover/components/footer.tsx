import { useEffect, useState } from "react";
import { runtime } from "webextension-polyfill";

const Footer = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    const manifest =runtime.getManifest();
    setVersion(manifest.version);
  }, []);

  return <footer>
    <span>{`V:${version}`}</span>
  </footer>
};

export default Footer;
