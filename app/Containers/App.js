/* Imports */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Root } from 'native-base';

import RootContainer from './RootContainer'
import createStore from '../Redux'
import { notifiactionTokenManager } from '../Components/NotifiactionTokenManager'

/* Global Variables */
// create our store
const store = createStore()

//Configuring notifications 
notifiactionTokenManager.configure(store)

class App extends Component {

  /* What are displaying on the screen */
  render() {
    return (
      <Provider store={store}>
        <Root>
          <RootContainer />
        </Root>
      </Provider>
    )
  }
}

/* Exporting class */
// allow reactotron overlay for fast design in dev mode
export default App
