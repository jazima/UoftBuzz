import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main';

import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <Main currentView='HomePage'/>,
  },
  {
    path: "/userprofile",
    element: <Main currentView='UserProfile'/>,
  },
  {
    path: "/accountcreation",
    element: <Main currentView='AccountCreation'/>,
  },
  {
    path: "/",
    element: <Main currentView='Login'/>,
  },
  {
    path: "/myevents",
    element: <Main currentView='MyEvents'/>,
  },
  {
    path: "/savedevents",
    element: <Main currentView='SavedEvents'/>,
  },
  {
    path: "/pastevents",
    element: <Main currentView='PastEvents'/>,
  },
  {
    path: "/createevent",
    element: <Main currentView='CreateEvent'/>,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
