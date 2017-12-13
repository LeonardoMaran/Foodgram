import React, { Component } from 'react';

class Modal extends Component {
  render() {
    if(!this.props.show) {
      return null;
    }

    // background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 20,
      zIndex: 999
    };

    // modal 
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      minWidth: 400,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 40,
      paddingTop: 70,
      zIndex: 999
    };


    // footer
    const footer = {
      textAlign: 'right',
      position: 'fixed',
      top: 10,
      right: 10,
      zIndex: 999
    };


    //button
    const close = {
      borderRadius: 100,
      cursor: 'pointer',
      color: '#fff',
      backgroundColor: '#0E6EB8',
      borderColor: '#0E6EB8',
      zIndex: 999
    };

    return (
      <div className="Container" style={backdropStyle}>
        <div className="Main" style={modalStyle}>
          <div className="footer" style={footer}>
              <button onClick={this.props.onClose} style={close}>
                x
              </button>
          </div>

          {this.props.children}

        </div>
      </div>
    );
  }
}


export default Modal