import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { store, persistor } from './store'
import App from './App'
import './index.css'

// ReactDOM.createRoot(document.getElementById('app')!).render(
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/*  make sure every component can accss to Redux*/}
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)