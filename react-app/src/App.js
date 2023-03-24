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
import { Account } from './components/sections/Account';
import { Route } from 'react-router-dom';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Home from './views/Home';

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
        <>        
        <Switch>                 
          <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
          <Account>
            <Route path="/signup"><Signup /></Route>     
            <Route path="/login"><Login /></Route>    
            <Route path="/account"><Account /></Route> 
            <Route path="/homeLog"><HomeLog /></Route>  
            <Route path="/search"><Search /></Route>  
            <Route path="/post"><Post /></Route>  
            <Route path="/delete"><Delete /></Route>  
            <Route path="/put"><Put /></Route>  
          </Account>                   
        </Switch>
        </>
      )} />
      
  );
  
}

export default App;