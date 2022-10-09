import './App.scss';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';

const App = () => (
    <div className="App">
      <Header/>
      <Welcome/>
      <Experience/>
      <Education/>
      <Contact/>
    </div>
  );
  
export default App;