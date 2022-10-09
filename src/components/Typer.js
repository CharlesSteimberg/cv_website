import Typed from 'typed.js';
import React from 'react';

class Typer extends React.Component {
    componentDidMount() {
      const { strings } = this.props;
      const options = {
        strings: strings,
        typeSpeed: 40,
        backSpeed: 40
      };
      this.typed = new Typed(this.el, options);
    }
  
    componentWillUnmount() {
      this.typed.destroy();
    }
  
    render() {
      return (
        <span
            style={{ whiteSpace: 'pre' }}
            ref={(el) => { this.el = el; }}
        />
      );
    }
  };

  export default Typer;