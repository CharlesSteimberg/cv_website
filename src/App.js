import './App.scss';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import {useState} from 'react';

const App = () => {
  const [loaded, setLoaded] = useState(0);
  const elementToLoad = 2;
  var called = false;

  const incrementLoaded = () => {
    if (!called) called = true
    else setLoaded(2); //To be cleaned
  }

  const welcomeProps = {
    incrementLoaded: incrementLoaded,
    loaded: loaded,
    elementToLoad: elementToLoad
   };

  const renderContent = () => {
    if (loaded < elementToLoad){
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