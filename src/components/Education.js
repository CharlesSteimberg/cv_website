import './Education.scss';
import ed01 from '../assets/ed01.png';
import ed02 from '../assets/ed02.jpeg';
import ed03 from '../assets/ed03.jpeg';

const Education = () => (
  <div className="Education" id="Education">
    <h1>Education</h1>
    <div className="EdBox">
      <div className="Ed" id="Ed01">
        <div className="EdHead">
          <img src={ed01} alt=""/>
          <p className="topic">Corporate Strategy</p>
        </div>
        <div className="EdBody">
          <h2 className="DiplomaName">Master Corporate Stategy</h2>
          <h4 className="DiplomaDate">Sciences Po, Paris<br/>Sep. 2020 - Jun. 2021</h4>
          <p>
            Cool projects I have worked on:<br/>
            <br/>
            ‣ Research on effect of social media on Uyghur situation. Data analysis on Twitter & Facebook API.<br/><br/>
            ‣ Research on the chilean toilet paper collusion.<br/><br/>
            ‣ Strategic roadmap of a Scale-Up company.
          </p>
          <div className="Fading"></div>
        </div>
      </div>
      <div className="Ed" id="Ed02">
        <div className="EdHead">
          <img src={ed02} alt=""/>
          <p className="topic">Bio Electronic</p>
        </div>
        <div className="EdBody">
          <h2 className="DiplomaName">Exchange Student Electronic</h2>
          <h4 className="DiplomaDate">Tampere University, Finland<br/>Jan. 2017 - Jun. 2017</h4>
          <p>
            Cool projects I have worked on:<br/><br/>
            ‣ Development of eye glasses to monitor the stress and concentration of ADHD children.<br/><br/>
            ‣ Research on brain electrodes for hard of hearing. <br/><br/>
            ‣ Built an electrocardiogram with basic electronics. 
          </p>
          <div className="Fading"></div>
        </div>
      </div> 
      <div className="Ed" id="Ed03">
        <div className="EdHead">
          <img src={ed03} alt=""/>
          <p className="topic">Software Engineering</p>
        </div>
        <div className="EdBody">
          <h2 className="DiplomaName">Master Software Engineering</h2>
          <h4 className="DiplomaDate">ISEP, Paris<br/>Sep. 2012 - Jun. 2017</h4>
          <p>
            Cool projects I have worked on:<br/><br/>
            ‣ Development of a web-app to help choose courses.<br/><br/>
            ‣ Development of self communicating robots.<br/><br/>
            ‣ Development of an e-Commerce short-cycle vegetable sales platform.
          </p>
          <div className="Fading"></div>
        </div>
      </div> 
    </div>
  </div>
  );
  
export default Education;