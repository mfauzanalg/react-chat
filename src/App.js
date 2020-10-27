import React, {useRef, useState, useEffect} from 'react'
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import me from "./img/me.png"

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyAkQCEXhpDKaQfQe_GcwaDU2lI0C4jhjuY",
  authDomain: "react-chat-4346d.firebaseapp.com",
  databaseURL: "https://react-chat-4346d.firebaseio.com",
  projectId: "react-chat-4346d",
  storageBucket: "react-chat-4346d.appspot.com",
  messagingSenderId: "840998144023",
  appId: "1:840998144023:web:cef68a57894e1a9d9cf452"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="main-container">
      {user ? <ChatRoom auth={auth} firestore={firestore} /> : <SignIn />}
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  return(
    <div className="sign-in-container">
      <div className="button-sign-in-container">
        <div className="title-container">
          Chat With Fauzan 💌
        </div>
        <div className="button-sign-in button" onClick={signInWithGoogle}>Google Sign In</div>
      </div>
    </div>
  )
}

const ChatRoom = ({firestore, auth}) => {
  const dummy = useRef();
  const messageRef = firestore.collection('messages')
  const query = messageRef.orderBy('createdAt', 'desc').limit(100)

  const [messages] = useCollectionData(query, {idField: 'id'})
  const [formValue, setFormValue] = useState('')
  
  const formHandler = (e) => {
    setFormValue(e.target.value)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    const { uid, photoURL, displayName } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName
    })
    setFormValue('');
    scrollHere()
  }

  const scrollHere = () => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollHere()
  });

  return (
    <div>
      <Header />
      <div className="msg-container">
        {
          messages && messages.slice(0).reverse().map(msg => (
            <ChatMessage key={msg.id} auth={auth} message={msg} />
          ))
        }
        <span ref={dummy}></span>
      </div>
      <div>
        <form className="form-container" onSubmit={sendMessage}>
          <input placeholder="Kirim apa yaa...." type="text" value={formValue} onChange={formHandler}/>
          <button className="button-send button" type="submit" disabled={!formValue}> send </button>
        </form>
      </div>
    </div>
  )
}

const ChatMessage = ({message}) => {
  const text = message.text
  const uid = message.uid
  const photo = message.photoURL
  const name = message.displayName
  const textClass = uid === auth.currentUser.uid ? 'text-sent' : 'text-received'
  const photoClass = uid === auth.currentUser.uid ? 'photo-sent' : 'photo-received'
  const containerClass = uid === auth.currentUser.uid ? 'container-sent' : 'container-received'
  const msgClass = uid === auth.currentUser.uid ? 'msg-sent' : 'msg-received'
  return (
    <div className={`message ${msgClass}`}>
      <div className={`${photoClass}`}>
        <img src={photo} alt="profil"/>
      </div>
      <div className={`text-chat-container ${containerClass}`}>
        <div className={`person-name`}>{name}</div>
        <div className={`person-text ${textClass}`}>{text}</div>
      </div>
    </div>
  )
}

const SignOut = () => {
  const signOutGoogle = () => {
    auth.signOut()
  }
  return auth.currentUser && (
    <div className="button-sign-out button" onClick={signOutGoogle}>Sign Out</div>
  )
}

const Header = () => {
  return (
    <div>
      <div className="header-container">
        <div className="profile-container">
          <img className="profile-me" src={me} alt="foto"/>
        </div>
        <div className="group-title">
          <div className="main-title">
            Chat with Fauzan 💌
          </div>
          <div className="sub-title">
            Aku, Kamu, Kita Hehehe
          </div>
        </div>
        <div className="button-sign-out-container"><SignOut /></div>
      </div>
      <div className="hidden"></div>
    </div>
  )
}


export default App;
