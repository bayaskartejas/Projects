import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export function Todos({ todos, setTodos, userToken }) {
  let [markasdone, setMarkasdone] = useState("Mark as Done")
  let divref = useRef()
  useEffect(() => {
    axios
      .get('http://localhost:3000/todos', {
        headers: {
          Authorization: userToken,
        },
      })
      .then((response) => {
        const res = response.data;
        setTodos(res);
      });
  }, []);

  return (
    <div>
      {todos.map((todo) => (
        <div id={todo[0]._id} className= {todo[0].completed ? "card1" : "card2"} key={todo[0]._id}>
          <div  key={todo[0]._id}>
            <h2 id={todo[0]._id + "uhmm1"}>{todo[0].title}</h2>
            <h3 id={todo[0]._id + "uhmm2"}>{todo[0].description}</h3>
            <button id={todo._id + "uhmm"} //PRETTY BAD PRACTICE 
              onClick={() => {
                axios
                  .put('http://localhost:3000/completed', {
                    id: todo[0]._id,
                  })
                  .then(async (res) => {
                    let status = res.data.thatTodo.completed
                    document.getElementById(todo[0]._id).className= status?"card1":"card2" //BAD PRACTICE IK
                    document.getElementById(todo[0]._id + "uhmm1").style.textDecoration= status?"line-through":"" //BAD PRACTICE IK
                    document.getElementById(todo[0]._id + "uhmm2").style.textDecoration= status?"line-through":"" //BAD PRACTICE IK
                    document.getElementById(todo[0]._id + "uhmm").textContent= status?"Mark as Not Done":"Mark as Done"
                  });
              }}
            >
              Mark
            </button>
            <button
              onClick={() => {
                axios
                  .post(
                    'http://localhost:3000/deleted',
                    {
                      id: todo[0]._id,
                    },
                    {
                      headers: {
                        Authorization: userToken,
                      },
                    }
                  )
                  .then(
                    (res) => {
                    let newtodos = todos.filter((t)=>t[0]._id != todo[0]._id)
                    setTodos(newtodos)
                  });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
