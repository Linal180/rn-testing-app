import React, {useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationActions} from 'react-navigation';

import Navigator from './Navigator';

const NavigatorContainer = (props) => {
  const navRef = useRef();
  const isAuth = useSelector((state) => !!state.auth.token);
  // console.log(userDetails);

  console.log('NAVIGATOR CONTAINER ---');
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(NavigationActions.navigate({routeName: 'Auth'}));
    }
  }, [isAuth]);
  // console.log("NAVIGATOR CONTAINER ---", navRef, 'NAVRef');
  return <Navigator ref={navRef}  />;
};

export default NavigatorContainer;
