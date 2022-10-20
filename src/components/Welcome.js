import './Welcome.scss';
import Typer from './Typer';
import Scene from './Scene';
import {useState} from 'react';

const Welcome = ({welcomeProps}) => {

  const props = {
    incrementLoaded: welcomeProps.incrementLoaded,
    type: "character"
   };

  const renderContent = () => {
    if(welcomeProps.loaded === welcomeProps.elementToLoad){
      return(
        <div className="Intro">
          <Typer
            strings={[
              "Hello, I am Charles Steimberg 👋\n\nI am looking for a job in product management 👨🏻‍💻.\n\nI have two master's degrees, in corporate strategy\nand software engineering 🖥.\n\nI've worked for the past 6 years in Data and IT \nProduct Management 👔, including 4 years in\nthe private banking industry.\n\nScroll down to check my resume and get a\nWeb3 surprise 🎁 in the Contact section!"
            ]}
          />
        </div>
      )
    } else {
      return <div className="Intro"/>
    }
  }

  return(
    <div className="Welcome" id="Welcome">
      {renderContent()}
      <div className="ProfilePic">
        <Scene type="character" props={props}/>
      </div>
    </div>
  )
};
export default Welcome;