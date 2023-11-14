import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import { UserProfile } from './pages/UserProfile';
import { AccountCreation } from './pages/AccountCreation';
import { Login } from './pages/Login';
import { SavedEvents } from './pages/SavedEvents';
import { EventCreation } from './pages/EventCreation';
import { User, TagList, demoUser} from './types';

interface AppProps {
  currentView: string;
}

function App(props: AppProps) {
  const [user, setUser] = React.useState<User | void>();
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState(false);
  
  useEffect(() => {
    if (!(props.currentView == 'Login') && !(props.currentView == 'AccountCreation')) {
      handleGetUser();
    }
  }, [props.currentView])

  const handleGetUser = async () => {
    const userID = localStorage.getItem('userID');
    try {  
        const response = await fetch ('/profile/' + String(userID), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data);
            setUser(data);
            setError(false);
        } else {
            setMessage(data.message || 'An error occurred. Please try again later.');
            setError(true);
        }
      } catch (error) {
          console.log(error);
          setMessage('Failed to connect to the server.');
          setError(true);
      }
  };
  
  const renderHomePage = () => {
    switch (props.currentView) {
      case 'HomePage':
        return (
          <HomePage user={user?user:demoUser}/>
        )
      case 'UserProfile':
        return (<UserProfile user={user?user:demoUser}></UserProfile>)
      case 'AccountCreation':
        return (<AccountCreation></AccountCreation>)
      case 'Login':
        return (<Login></Login>)
      case 'MyEvents':
        return (<SavedEvents headerTitle='My Events' user={user?user:demoUser}></SavedEvents>)
      case 'SavedEvents':
        return (<SavedEvents headerTitle='Saved Events' user={user?user:demoUser}></SavedEvents>)
      case 'PastEvents':
        return (<SavedEvents headerTitle='Past Events' user={user?user:demoUser}></SavedEvents>)
      case 'CreateEvent':
        return (<EventCreation user={user?user:demoUser}></EventCreation>)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fffdee' }}>
      {renderHomePage()}
    </div>
  );

}

export default App;
