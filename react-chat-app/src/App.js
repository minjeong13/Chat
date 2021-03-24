import React, {useEffect} from 'react';
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage'
import firebase from './firebase';
import {setUser, clearUser} from './redux/actions/user_action';

import {useDispatch, useSelector} from 'react-redux';

function App(props) {
  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user',user)
      //로그인이 된 상태
      if(user){
        history.push("/chat");
        dispatch(setUser(user))

      }else{
        history.push("/");
        dispatch(clearUser(user))
      }
    })
  }, [])

  if(isLoading){
    return(
      <div>
        ...Loading
      </div>
    )
  }else{
    return (
      <Switch>
        <Route exact path="/chat" component={ChatPage}/>
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/" component={LoginPage}/>
        <Route exact path="/register" component={RegisterPage}/>
      </Switch>
    ); 
  }
}

export default App;
