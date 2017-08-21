import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const baseURL = 'http://localhost:3000';
const listsURL = `${baseURL}/lists`;
const listURL = `${baseURL}/list`;

const checkForAuth = (response) => {
  if (response.status === 401) {
    store.state.isLoggedIn = false;
    location.href = '/';
  }
  return response;
};

const store = new Vuex.Store({
  state: {
    todos: [],
    shared: [],
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
        return fetch(`${baseURL}/logout`, { method: 'GET' })
        .then(() => {
          location.href = '/';
        });
      },
      deleteAll: () => {
        return fetch(`${baseURL}/user`, { method: 'DELETE' })
        .then(() => {
          location.href = '/';
        });
      },
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
      getTodo: id =>
        fetch(`${listURL}/${id}`, {
          method: 'GET',
          credentials: 'include',
        })
        .then(checkForAuth)
        .then(response => response.json())
      ,
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
        });
      },
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
