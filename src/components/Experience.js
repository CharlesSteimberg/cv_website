import './Experience.scss';
import {useEffect, useState, useRef} from 'react';
import img01 from '../assets/exp01.jpeg';
import img02 from '../assets/exp02.png';
import img03 from '../assets/exp03.jpeg';
import img04 from '../assets/exp04.jpeg';
import img05 from '../assets/exp05.png';

function viewportToPixels(value) {
  var parts = value.match(/([0-9\.]+)(vh|vw)/)
  var q = Number(parts[1])
  var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
  return side * (q/100)
}

const positions = [
    {id: "Exp01", x: viewportToPixels('6vw'), y: viewportToPixels('5vh'), available: 0, lastFloat: 0},
    {id: "Exp02", x: viewportToPixels('23vw'), y: viewportToPixels('9vh'), available: 0, lastFloat: 0},
    {id: "Exp03", x: viewportToPixels('39vw'), y: viewportToPixels('7vh'), available: 0, lastFloat: 0},
    {id: "Exp04", x: viewportToPixels('62vw'), y: viewportToPixels('9vh'), available: 0, lastFloat: 0},
    {id: "Exp05", x: viewportToPixels('74vw'), y: viewportToPixels('5vh'), available: 0, lastFloat: 0}
  ];

const styles = [
    {id: "Exp01", z: 5, scale: 1, color: "rgb(209, 78, 91)"},
    {id: "Exp02", z: 4, scale: 1, color: "#437697"},
    {id: "Exp03", z: 3, scale: 1, color: "rgb(209, 78, 91)"},
    {id: "Exp04", z: 2, scale: 1, color: "#437697"},
    {id: "Exp05", z: 1, scale: 1, color: "#97c4c6"}
  ];

const Experience = () => {
  const [position, setPosition] = useState(positions);
  const [expBoxMax, setexpBoxMax] = useState({minX: 0, minY: 0, maxX: 0, maxY: 0, top: 0, left: 0});
  const [draggedItem, setDraggedItem] = useState({ x: null, y: null});
  const [time, setTime] = useState(Date.now());
  const [style, setStyle] = useState(styles);
  const [dotPosition, setDotPosition] = useState({x: 0, y:0});
  const dragItem = useRef({id: null, x: null, y: null});
  const expBox = useRef(null);
  const exp01 = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Set up Exp Box borders
    setexpBoxMax(
      { minX : 0.05 * expBox.current.clientWidth,
        minY : expBox.current.style.marginTop, 
        maxX : 0.95 * expBox.current.clientWidth - exp01.current.clientWidth, 
        maxY : expBox.current.clientHeight - exp01.current.clientHeight,
        top: expBox.current.getBoundingClientRect().top,
        left: expBox.current.getBoundingClientRect().left
    });
    // Change Big Dot
    style.map(item => {
      if (item.z === 5){
        const element = document.getElementById("Dot-"+ item.id);
        const x = element.getBoundingClientRect().left - element.offsetWidth/2;
        document.getElementById("BigDot").style.background = item.color;
        setDotPosition({x: x, y: - 9});
      }
    });
  }, [style,exp01]);

  //Use Effect that enables movement
  useEffect(() => {
    var now = Date.now();
    if (dragItem.current.id){
      const current = document.getElementById(dragItem.current.id);
      const rect = document.getElementById(dragItem.current.id).getBoundingClientRect();

      setPosition(position.map((item, i) => {
        if (item.id === dragItem.current.id) {
          return {
            ...item,
            x: Math.min(Math.max(draggedItem.x - expBoxMax.left - dragItem.current.x, expBoxMax.minX), expBoxMax.maxX),
            y: Math.min(Math.max(draggedItem.y - expBoxMax.top - dragItem.current.y, expBoxMax.minY), expBoxMax.maxY),
            available: now + 200,
            lastFloat: 0
          };
        } else if ( item.available < now && 
                    (Math.abs(rect.right - item.x) <= 10  ||
                    Math.abs(item.x + current.clientWidth - rect.left) <= 15)){
          document.getElementById(item.id).style.transition = "transform 0.8s ease-in-out 0s";
          var border = ( item.x < expBoxMax.minX + current.clientWidth/2 || item.x + current.clientWidth/2 > expBoxMax.maxX) ? (expBoxMax.maxX + current.clientWidth)/2 : item.x;
          var sens = (current.clientWidth/2 + rect.left > border) ? -1 : 1;
          sens = (border === (expBoxMax.maxX + current.clientWidth)/2) ? sens * 2 : sens;
          return {
            ...item,
            x: Math.min(Math.max(item.x + Math.floor(((Math.random() * 101) + current.clientWidth/2) * sens), expBoxMax.minX), expBoxMax.maxX),
            y: Math.min(Math.max(item.y + Math.floor(Math.random() * 101) - 50, expBoxMax.minY), expBoxMax.maxY),
            available: now + 800,
            lastFloat: 0
          };
        } else if (item.available < now && item.lastFloat < now){
          document.getElementById(item.id).style.transition = "transform 4.5s ease-in-out 0s";
          return {
            ...item,
            x: Math.min(Math.max(item.x + Math.floor(Math.random() * 21) - 10, expBoxMax.minX || expBox.current.style.paddingLeft), expBoxMax.maxX || expBox.current.clientWidth - document.getElementById(item.id).clientWidth),
            y: Math.min(Math.max(item.y + Math.floor(Math.random() * 21) - 10, expBoxMax.minY || expBox.current.style.paddingTop), expBoxMax.maxY || expBox.current.clientHeight - document.getElementById(item.id).clientHeight),
            available: 0,
            lastFloat: now + 4000
          }
        } else {
          return item;
        }
      }));
    } else {
      setPosition(position.map(item => {
        if (item.available < now  && item.lastFloat < now){
          document.getElementById(item.id).style.transition = "transform 4.5s ease-in-out 0s";
          return {
            ...item,
            x: Math.min(Math.max(item.x + Math.floor(Math.random() * 21) - 10, expBoxMax.minX || expBox.current.style.paddingLeft), expBoxMax.maxX || expBox.current.clientWidth - document.getElementById(item.id).clientWidth),
            y: Math.min(Math.max(item.y + Math.floor(Math.random() * 21) - 10, expBoxMax.minY || expBox.current.style.paddingTop), expBoxMax.maxY || expBox.current.clientHeight - document.getElementById(item.id).clientHeight),
            available: 0,
            lastFloat: now + 4000
          }
        } else {
          return item;
        }
      }));
    }
  }, [draggedItem, time]);

  const dragStart = (e) => {
    const current = e.currentTarget;
    const currZ = current.style.zIndex;
    //Send dragged div to front
    setStyle(style.map(item => {
      if (item.id === current.id){
        return {
          ...item,
          z: 5
        }
      } else {
        var pos = item.z + 5 - currZ;
        return {
          ...item,
          z: (pos > 5) ? pos - 5 : pos
        }
      }
    }));
    current.style.transition = "transform 0.2s ease-out 0s";

    //Set dragItem coordinatees
    dragItem.current = {
      id: current.id,
      x: (e.type === "mousedown") ? e.clientX - current.getBoundingClientRect().x : e.touches[0].clientX - current.getBoundingClientRect().x,
      y: (e.type === "mousedown") ? e.clientY - current.getBoundingClientRect().y : e.touches[0].clientY - current.getBoundingClientRect().y
    };

    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag);
    window.addEventListener('mouseup', drop);
    window.addEventListener('touchend', drop);
  };

  const drag = (e) =>{
    setDraggedItem({
      x: (e.type === "mousemove") ? e.clientX : e.touches[0].clientX,
      y: (e.type === "mousemove") ? e.clientY : e.touches[0].clientY
    });
  };

  const drop = () => {
    dragItem.current = {id: null, x: 0, y: 0 };
    window.removeEventListener('mousemove', drag);
    window.removeEventListener('touchmove', drag);
    window.removeEventListener('mouseup', drop);
    window.removeEventListener('touchend', drop);
  };

  const prev = () =>{
    setStyle(style.map(item => {
      return {
        ...item,
        z: (item.z === 1) ? 5 : item.z - 1
      }
    }));
  };

  const next = () =>{
    setStyle(style.map(item => {
      return {
        ...item,
        z: (item.z === 5) ? 1 : item.z + 1
      }
    }));
  };

  return(
    <div className="Experience" id="Experience">
      <h1>Employment history</h1>
      <div className="LeftArrow" onClick={prev}>
        <span className="ArrowTop"></span>
        <span className="ArrowBottom"></span>
      </div>
      <div className="RightArrow" onClick={next}>
        <span className="ArrowTop"></span>
        <span className="ArrowBottom"></span>
      </div>
      <div className="ExpBox" ref={expBox}>
        <div className="Exp" id="Exp01" ref={exp01} style={{zIndex : style[0].z ,transform: "scale(" + style[0].scale + ") translate(" + position[0].x + "px ," + position[0].y + "px)"}} onMouseDown={dragStart} onTouchStart={dragStart}>
          <div className="ExpHead">
            <img src={img01} alt=""/>
            <ul className="topic">
              <li>Product</li>
              <li>Strategy</li>
            </ul>
          </div>
          <div className="ExpBody">
            <h2 className="ExperienceName">Consultant Data Product Owner</h2>
            <h4 className="ExperienceDate">Artefact, Paris<br/>Sep. 2021 - Today</h4>
            <p>
            Orchestrated as a Product Owner a machine learning based solutions that drove Sodexo's North America airlines lounges workforce management.
            </p>
          </div>
        </div> 
        <div className="Exp" id="Exp02" style={{zIndex : style[1].z ,transform: "scale(" + style[1].scale + ") translate(" + position[1].x + "px ," + position[1].y + "px)"}} onMouseDown={dragStart} onTouchStart={dragStart}>
          <div className="ExpHead">
            <img src={img02} alt=""/>
            <ul className="topic">
              <li>Product</li>
              <li>Banking</li>
            </ul>
          </div>
          <div className="ExpBody">
            <h2 className="ExperienceName">Consultant Product Owner</h2>
            <h4 className="ExperienceDate">Freelance, Paris<br/>Oct. 2019 - Sep. 2021</h4>
            <p>
            Founded a consulting firm that supported private banks in their core banking transformation.<br/>
            Aided as a Product Owner SwissLife Banque Privée on a regulatory related project.<br/>
            </p>
          </div>
        </div>
        <div className="Exp" id="Exp03" style={{zIndex : style[2].z ,transform: "scale(" + style[2].scale + ") translate(" + position[2].x + "px ," + position[2].y + "px)"}} onMouseDown={dragStart} onTouchStart={dragStart}>
          <div className="ExpHead">
            <img src={img03} alt=""/>
            <ul className="topic">
              <li>Product</li>
              <li>Banking</li>
            </ul>
          </div>
          <div className="ExpBody">
            <h2 className="ExperienceName">Consultant Product Owner</h2>
            <h4 className="ExperienceDate">Accenture, Paris<br/>Nov. 2017 - Aug. 2019</h4>
            <p>
            Contributed to the evolution of Societe Generale Private Bank regulatory systems to be compliant with ACPR.<br/>
            Guided the AML and client risk management tool update.
            </p>
          </div>
        </div>
        <div className="Exp" id="Exp04" style={{zIndex : style[3].z ,transform: "scale(" + style[3].scale + ") translate(" + position[3].x + "px ," + position[3].y + "px)"}} onMouseDown={dragStart} onTouchStart={dragStart}>
          <div className="ExpHead">
            <img src={img04} alt=""/>
            <ul className="topic">
              <li>Product</li>
              <li>Healthcare</li>
            </ul>
          </div>
          <div className="ExpBody">
            <h2 className="ExperienceName">Transformation Engineer</h2>
            <h4 className="ExperienceDate">GE Healthcare, Paris<br/>Jul. 2017 - Nov. 2017</h4>
            <p>
            Developped methodologies and devices to smooth the production lines of the mammograph.<br/>
            Scoped and developped an MVP of a test bench for the new mammograph scanner Pristina.<br/>
            </p>
          </div>
        </div>
        <div className="Exp" id="Exp05" style={{zIndex : style[4].z ,transform: "scale(" + style[4].scale + ") translate(" + position[4].x + "px ," + position[4].y + "px)"}} onMouseDown={dragStart} onTouchStart={dragStart}>
          <div className="ExpHead">
            <img src={img05} alt=""/>
            <ul className="topic">
              <li>Product</li>
              <li>Healthcare</li>
            </ul>
          </div>
          <div className="ExpBody">
            <h2 className="ExperienceName">Internship R&D Engineer</h2>
            <h4 className="ExperienceDate">MyBrain Technologies, Paris<br/>Jul. 2015 - Jul. 2016</h4>
            <p>
              Headed desig et developpement of electrodes & test bench for electroencephalogram.<br/>
              Conducted data analysis to determine customers' trends.<br/>
            </p>
          </div>
        </div>
      </div>
      <div className="Pagination">
        <div className="LittleDot" id="Dot-Exp01"></div>
        <div className="LittleDot" id="Dot-Exp02"></div>
        <div className="LittleDot" id="Dot-Exp03"></div>
        <div className="LittleDot" id="Dot-Exp04"></div>
        <div className="LittleDot" id="Dot-Exp05"></div>
        <div className="BigDot" id="BigDot" style={{transform: "translate(" + dotPosition.x + "px ," + dotPosition.y + "px)", transition: "all 1s ease-in-out 0s"}}></div>
      </div>
    </div>
    );
};
export default Experience;