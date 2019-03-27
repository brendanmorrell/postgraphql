import React, { Component } from 'react';
import { render, createPortal } from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import client from './apollo';

// toying around with portals
const Modal = ({ children, onClose, open }) =>
  open
    ? createPortal(
        <div>some shit that is now on the todos header</div>,
        document.getElementById('this-id-is-for-todos-header'),
      )
    : null;

class ModalButton extends Component {
  state = { open: false };
  handleClick = () => this.setState(({ open }) => ({ open: !open }));
  render() {
    const { open } = this.state;
    const { handleClick } = this;
    return (
      <>
        <button onClick={handleClick}>{open ? 'Close' : 'Open'} Modal</button>
        <Modal open={open} />
      </>
    );
  }
}

render(
  <ApolloProvider client={client}>
    <ModalButton />
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
if (module.hot) module.hot.accept();
