import { useRef, useEffect } from "react"
import axios from "axios"
export function Createtodo({userToken, setTodos}){
    const titleRef = useRef()
    const descRef = useRef()
    const buttonRef = useRef()

    return <div>
        <h1>Add a Todo!</h1>
        <input type="text" ref={titleRef} placeholder="title"></input><br/>    
        <input type="text" ref={descRef} placeholder="description"></input><br/><br/>
        <button ref={buttonRef} 
        onClick={()=>{
                    axios.post('http://localhost:3000/todos', {
                        title: titleRef.current.value,
                        description: descRef.current.value
                    },{
                        headers:{
                            "authorization": userToken
                        }
                    })
                        .then((res)=>{
                            let arr = [];
                            arr.push(res.data.response)
                            setTodos((prevTodos) => [...prevTodos, arr]);  
                        })
                        .catch((err)=>{
                            alert(err)
                        })

                    }}
                    >Add a Todo</button>
    </div>
}