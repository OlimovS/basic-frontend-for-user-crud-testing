import React, { useEffect, useState } from "react";
import service from "./service";

// app components
import "./App.css";

const reloadPage = () => {
  window.location.reload();
};

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    login: "",
    password: "",
    age: 1,
  });
  const [autoSuggetParams, setAutoSuggetParams] = useState({
    loginSubString: "",
    limit: 1,
  });
  const [editingUserId, setEditingUserId] = useState(null);

  const handleInputChange = (e) => {
    setForm((prev) => {
      const fieldName = e.target.name;
      let fieldValue = e.target.value;
      if (fieldName === "age") fieldValue = Number(fieldValue);
      return { ...prev, [fieldName]: fieldValue };
    });
  };

  const handleAutoSuggestChange = (e) => {
    setAutoSuggetParams((prev) => {
      const fieldName = e.target.name;
      let fieldValue = e.target.value;
      if (fieldName === "limit") fieldValue = Number(fieldValue);
      return { ...prev, [fieldName]: fieldValue };
    });
  };

  const handleEdit = (id) => {
    const editingUserData = users.find((user) => user.id === id);
    if (!editingUserData) return;
    setEditingUserId(id);
    const { login, password, age } = editingUserData;
    setForm({ login, password, age });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (editingUserId) {
      service.patch(`/user/${editingUserId}`, form).then((res) => {
        console.log("user-updated: ", res);
        reloadPage();
      });
    } else {
      service
        .post("/user", form)
        .then((res) => {
          console.log("user-created: ", res);
          reloadPage();
        })
        .catch((err) => {
          console.log("user-create [err]: ", err.response.data);
        });
    }
  };

  const handleAutoSuggest = (e) => {
    e.preventDefault();
    console.log("auto-suggesparams: ", autoSuggetParams);
    service
      .get("/users/auto-suggest", { params: autoSuggetParams })
      .then((res) => {
        console.log("auto-suggested: ", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("auto-suggest failed: ", err);
      });
  };

  const handleDeleteUser = (id) => {
    service(`/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8", // Indicates the content
      },
    })
      .then((res) => {
        console.log("user-deleted: ", res);
        reloadPage();
      })
      .catch((err) => {
        console.log("user-delete failed: ", err);
      });
  };

  useEffect(() => {
    service
      .get("/users")
      .then((res) => {
        console.log("users fetched: ", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }, []);

  return (
    <div>
      auto suggest table:
      <form onSubmit={handleAutoSuggest}>
        <label htmlFor="loginSubString">
          loginSubString
          <input
            onChange={handleAutoSuggestChange}
            name="loginSubString"
            id="loginSubString"
            value={autoSuggetParams.loginSubString}
          />
        </label>
        <label htmlFor="limit">
          limit
          <input
            onChange={handleAutoSuggestChange}
            name="limit"
            type="number"
            id="limit"
            min={1}
            value={autoSuggetParams.limit}
          />
        </label>
        <button type="submit">auto suggges</button>
      </form>
      <hr />
      <table>
        <thead>
          <tr>
            <td>login</td>
            <td>isDeleted</td>
            <td>password</td>
            <td>age</td>
            <td>id</td>
            <td>action</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.login}</td>
              <td>{user.isDeleted ? "true" : "false"}</td>
              <td>{user.password}</td>
              <td>{user.age}</td>
              <td>{user.id}</td>
              <td>
                <button type="button" onClick={() => handleDeleteUser(user.id)}>
                  {" "}
                  delete
                </button>
                <button type="button" onClick={() => handleEdit(user.id)}>
                  edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmitForm}>
        <label>
          login
          <input onChange={handleInputChange} name="login" value={form.login} />
        </label>
        <label>
          password
          <input
            onChange={handleInputChange}
            name="password"
            value={form.password}
          />
        </label>
        <label>
          age
          <input
            onChange={handleInputChange}
            name="age"
            value={form.age}
            type="number"
            min={1}
          />
        </label>
        <button>submit</button>
      </form>
    </div>
  );
}

export default App;
