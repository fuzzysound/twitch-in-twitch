import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import storeCreatorFactory from 'reduxed-chrome-storage'
import rootReducer from './store/rootReducer'
import App from './views/Popup/App'

(async () => {
  const store = await storeCreatorFactory({ createStore })(rootReducer)
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
})()
