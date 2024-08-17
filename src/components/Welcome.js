import './Welcome.scss';
import Typer from './Typer';

const Welcome = ({welcomeProps}) => {

  const renderContent = () => {
    if(welcomeProps.loaded){
      return(
        <div className="Intro">
          <Typer
            strings={[
              "Hello, I am Charles Steimberg 👋\n\nI am looking for a job in Data/IT management.\n\nI have two master's degrees, in corporate strategy\nand software engineering 🖥.\n\nI've worked for the past 7 years as a consultant \n in Data and IT program and product management 👔. \n\nScroll down to see my resume and get a\nWeb3 surprise 🎁 in the Contact section!"
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
    </div>
  )
};
export default Welcome;
