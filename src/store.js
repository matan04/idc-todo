import Vue from 'vue';
import Vuex from 'vuex';

//use Vuex for state manager
Vue.use(Vuex);

const baseURL = 'http://localhost:3000';
const listsURL = `${baseURL}/lists`;
const listURL = `${baseURL}/list`;

//check that the response from the server is not 401 (unauthorized), if does, redirect to login.
const checkForAuth = (response) => {
  if (response.status === 401) {
    store.state.isLoggedIn = false;
  }
  return response;
};

//define our state
const store = new Vuex.Store({
  state: {

    //my todo lists
    todos: [],

    //todos shared with me
    shared: [],

    //true is user logged in.
    isLoggedIn: true,
    getters: {
      register: (userName, password) => {
        return fetch(`${baseURL}/register/${userName}/${password}`, { method: 'POST' });
      },
      login: (userName, password) => {
        return fetch(`${baseURL}/login/${userName}/${password}`, {
          method: 'POST',
          credentials: 'include',
        }).then((response) => {
          if (response.status === 200) {
            store.state.isLoggedIn = true;
          }
          return response;
        });
      },
      logout: () => {
        fetch(`${baseURL}/logout`, {
          method: 'GET',
          credentials: 'include',
        })
        .then(() => {
          store.state.isLoggedIn = false;
        });
      },
      deleteAll: () => {
        fetch(`${baseURL}/user`, {
          method: 'DELETE',
          credentials: 'include',
        })
        .then(() => {
          store.state.isLoggedIn = false;
        });
      },

      //get all user todo lists (user lists + shared lists), return promise.
      getLists: () =>
        fetch(listsURL, { credentials: 'include' })
        .then(checkForAuth)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          return {};
        })
        .then((data) => {
          store.state.todos = data.userItems;
          store.state.shared = data.sharedItems;
          return new Promise((resolve) => resolve(data));
        }),

      //get specific todo list, return promise.
      getTodo: id =>
        fetch(`${listURL}/${id}`, {
          method: 'GET',
          credentials: 'include',
        })
        .then(checkForAuth)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          return {};
        })
      ,
      //create new todo list, return promise.
      addTodo: (data) => {
        return fetch(listURL, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(data),
        })
        .then(checkForAuth)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          return {};
        })
        .then((res) => {
          if (res.id) {
            store.state.todos.push(res);
          }
          return new Promise((resolve) => resolve(res));
        });
      },

      //delete specific todo, return promise.
      deleteTodo: todo =>
        fetch(`${listURL}/${todo.id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        .then(checkForAuth)
        .then(() => {
          const todoIndex = store.state.todos.indexOf(todo);
          store.state.todos.splice(todoIndex, 1);
          return;
        })
      ,
      //add task to specific todo.
      addTask: (todo, data) => {
        fetch(`${listURL}/${todo.id}/item/${data.title}`, {
          method: 'POST',
          credentials: 'include',
        })
        .then(checkForAuth)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          return {};
        })
        .then((res) => {
          if (res.taskId) {
            todo.tasks.push(res);
          }
        });
      },

      //delete task from specific todo list.
      deleteTask: (todo, task) => {
        fetch(`${listURL}/${todo.id}/${task.taskId}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        .then(checkForAuth)
        .then((response) => {
          if (response.status === 200) {
            const index = todo.tasks.indexOf(task);
            todo.tasks.splice(index, 1);
          }
        });
      },

      //share list with user, return promise.
      shareTodo: (todo, shareWith) => {
        return fetch(`${listURL}/${todo.id}/share/${shareWith}`, {
          method: 'PUT',
          credentials: 'include',
        })
        .then(checkForAuth)
        .then((response) => {
          if (response.status === 200) {
            todo = response.json();
            return todo;
          }
          return false;
        });
      },

      //search for task
      searchTasks: (listId, val) => {
        return fetch(`${listURL}/${listId}/item/${val}`, {
          method: 'GET',
          credentials: 'include',
        })
        .then(checkForAuth)
        .then(response => response.json());
      },
    },
  },
});

export default store;
