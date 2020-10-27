import React, {useState} from 'react'
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

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
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <ChatRoom auth={auth} firestore={firestore} /> : <SignIn />}
      </section>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  return(
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  )
}

const ChatRoom = ({firestore, auth}) => {
  const messageRef = firestore.collection('messages')
  const query = messageRef.orderBy('createdAt').limit(25)

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
  }
  return (
    <div>
      <div className="msg-container">
        {
          messages && messages.map(msg => (
            <ChatMessage key={msg.id} auth={auth} message={msg} />
          ))
        }
      </div>
      <div className="form-container">
        <form onSubmit={sendMessage}>
          <input type="text" value={formValue} onChange={formHandler}/>
          <button type="submit" disabled={!formValue}>send</button>
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
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  return (
    <div className={`message ${messageClass}`}>
      <img src={photo} alt="profil"/>
      <p>{name}</p>
      <p>{text}</p>
    </div>
  )
}

// const SignOut = ({auth}) => {
//   const signOutGoogle = () => {
//     auth.signOut()
//   }
//   return auth.currentUser && (
//     <button onClick={signOutGoogle}>Sign Out</button>
//   )
// }


export default App;
