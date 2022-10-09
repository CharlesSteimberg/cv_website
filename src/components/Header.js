import './Header.scss';
import {Link} from 'react-scroll';
import {useState} from 'react';
import logo from '../assets/logo.svg';

const Header = () => {
  const [navClicked, setnavClicked] = useState(false);
  const handleClick = () => setnavClicked(!navClicked);
  
  return(
    <div className = {navClicked ? "Header active" : "Header"}>
      <img className="Logo" src={logo} alt="Charles Steimberg"/>
      <div className="Hamburger" onClick={handleClick}>
        <span></span>
        <span></span>
      </div>
      <ul className = "HeaderList">
        <li className = "HeaderItem"><Link to="Welcome" spy={true} smooth={true} offset={0} duration={1000}>Welcome</Link></li>
        <li className = "HeaderItem"><Link to="Experience" spy={true} smooth={true} offset={0} duration={1000}>Experience</Link></li>
        <li className = "HeaderItem"><Link to="Education" spy={true} smooth={true} offset={0} duration={1000}>Education</Link></li>
        <li className = "HeaderItem"><Link to="Contact" spy={true} smooth={true} offset={0} duration={1000}>Contact</Link></li>
      </ul>
    </div>
  )
};

export default Header;
