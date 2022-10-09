import './Welcome.scss';
import Typer from './Typer';
import Scene from './Scene';

const Welcome = () => {

  return(
    <div className="Welcome" id="Welcome">
      <div className="Intro">
      <Typer
        strings={[
          "Hello, I am Charles Steimberg 👋\n\nI am looking for a job in product management 👨🏻‍💻.\n\nI have two master's degrees, in corporate strategy\nand software engineering 🖥.\n\nI've worked for the past 6 years in a Data and IT \nProduct Management 👔, including 4 years in\nthe private banking industry.\n\nScroll down to check my resume and get a\nWeb3 surprise 🎁 in the Contact section!"
        ]}
      />
      </div>
      <div className="ProfilePic" id="testouille">
        <Scene />
      </div>
    </div>
  )
};
export default Welcome;