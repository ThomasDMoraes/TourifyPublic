import './App.css'; //contains almost nothing, but custom changes are going here since I don't want to mess with the scss files...
import React, { useRef, useEffect } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';
import Signup from './components/sections/Signup';
import Login from './components/sections/Login';
import HomeLog from './components/sections/HomeLog';
import Search from './components/sections/Search';
import Post from './components/sections/Post';
import Delete from './components/sections/Delete';
import Put from './components/sections/Put';
import SideNavbar from './components/sections/SideNavbar';
import { Account } from './components/sections/Account';
import { TourScripts } from './components/sections/TourScripts';
import { Route } from 'react-router-dom';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Home from './views/Home';

//notification pop-up messages
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {
  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    trackPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Account>  
          <Switch>
            <AppRoute exact path="/" component={Home} layout={LayoutDefault} />              
              <Route path="/signup"><Signup /></Route>     
              <Route path="/login"><Login /></Route>    
              <Route path="/account"><Account /></Route> 

              <Route exact path="/homeLog"><HomeLog/></Route> 
              <TourScripts>
                <Route path="/homeLog/search"><Search/></Route>  
                <Route path="/homeLog/post"><Post/></Route>  
                <Route path="/homeLog/delete"><Delete/></Route>  
                <Route path="/homeLog/put"><Put/></Route>  
              </TourScripts>
               
          </Switch>
          <SideNavbar></SideNavbar>
          <NotificationContainer></NotificationContainer>
        </Account>

      )} />
      
  );
  
}

export default App;