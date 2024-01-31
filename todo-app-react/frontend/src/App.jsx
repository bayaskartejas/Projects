import './App.css'
import { useState } from 'react'
import { Auth } from './components/Auth'
import {Createtodo} from './components/Createtodo'
import {Todos} from "./components/Todos"
function App() {
  let   [todos, setTodos] = useState( [] )
  const [userToken, setUserToken] = useState("")
  return <div>
    <Auth setUserToken={setUserToken}>
      <Createtodo userToken={userToken} setTodos={setTodos}/>
      <Todos todos={todos} setTodos={setTodos} userToken={userToken}/>
    </Auth>
  </div>
}

export default App
