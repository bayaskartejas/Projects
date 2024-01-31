import { useRef, useState } from "react"
import axios from "axios"
export function Auth({setUserToken, children}){
  const [signUp, setSignUp] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const button1 = "Sign Up"
  const button2 = "Sign In"
  const text1 = "already a user"
  const text2 = "new user"
  const usernameRef = useRef()
  const passwordRef = useRef()

    return <div >
        {loggedIn ? <>
        {children}
        </> : <>
        <div className="auth">
        <h1 id="heading">{signUp===true ? button1 : button2}</h1>       
        <input type="text" placeholder="username" ref={usernameRef} /> <br /><br />       
        <input type="text" placeholder="password" ref={passwordRef}/> <br /><br />
        <button onClick={()=>{
            if(signUp){
                axios.post('http://localhost:3000/signup', {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value
                })
                .then((res)=>{
                    if(res.data){
                        alert("user signed up")
                    }
                })
                .catch((err)=>{
                    alert(err.toString())
                })
            }
            else if(!signUp){
                axios.post('http://localhost:3000/signin', {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value
                })
                .then((res)=>{
                    alert("User signed in")
                    setLoggedIn(true)
                    setUserToken(res.data)
                })
            }
        }}>{signUp===true ? button1 : button2}</button>        
    </div><br />
    <div>
    {signUp===true ? text1 : text2}, <button onClick={()=>{
        setSignUp(!signUp)
    }}>{signUp===true ? button2 : button1}</button> 
    </div>
        </>}
    
</div>
}