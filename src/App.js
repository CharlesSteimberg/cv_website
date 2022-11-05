import './App.scss';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import {useState} from 'react';

const App = () => {
  const [loaded, setLoaded] = useState(false);
  var elementToLoad = 1;

  const incrementLoaded = () => {
    elementToLoad = elementToLoad - 1;
    if (elementToLoad === 0) setLoaded(true);
  }

  const welcomeProps = {
    loaded: loaded
   };

  const renderContent = () => {
    if (!loaded){
      document.body.style.overflow = "hidden";
      return(
        <div className="Loading-Screen">
          <div className="Loader"/>
          Loading...
        </div>
      )
    } else {
      if(document.body.style.overflow === "hidden") document.body.style.overflow = "auto";
    }
  }

  return(
    <div className="App">
      {renderContent()}
      <Header/>
      <Welcome welcomeProps={welcomeProps}/>
      <Experience/>
      <Education/>
      <Contact incrementLoaded={incrementLoaded}/>
    </div>
  );
}
export default App;