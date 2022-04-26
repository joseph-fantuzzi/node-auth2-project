import "./App.css";
import { useState } from "react";
import axios from "axios";
import User from "./User";

const initialFormValues = {
  username: "",
  password: "",
};

function App() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:9000/api/auth/login", formValues)
      .then((res) => {
        setFormValues(initialFormValues);
        if (window.localStorage.getItem("token")) {
          setMessage("Already Logged In!");
        } else {
          window.localStorage.setItem("token", res.data.token);
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const getUsers = () => {
    if (window.localStorage.getItem("token")) {
      axios
        .get("http://localhost:9000/api/users", {
          headers: {
            Authorization: window.localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setLoading(true);
          setUsers(res.data);
        })
        .catch((err) => {
          setMessage(err.response.data.message);
        });
    } else {
      setMessage("Need to log in first to get the list of users.");
    }
  };

  const logoutHandler = () => {
    if (window.localStorage.getItem("token")) {
      window.localStorage.removeItem("token");
      setMessage("Successfuly Logged Out!");
    } else {
      setMessage("Already Logged Out!");
    }
  };

  return (
    <div className="container">
      <h1>USER LOGIN</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" value={formValues.username} onChange={onChange} />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formValues.password}
          onChange={onChange}
        />
        <button>Log In</button>
      </form>
      <button onClick={logoutHandler}>Logout</button>
      <button onClick={getUsers}>Users List</button>
      <p>{message}</p>
      {loading &&
        users.map((user) => {
          return (
            <User
              key={user.user_id}
              userid={user.user_id}
              username={user.username}
              role_name={user.role_name}
            />
          );
        })}
    </div>
  );
}

export default App;
