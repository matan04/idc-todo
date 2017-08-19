<template>
  <div class="card-deck">
    <todo v-on:delete-todo="deleteTodo" v-for="todo in todos" v-bind:todo="todo"></todo>
    <create-todo v-on:add-todo="addTodo"></create-todo>
  </div>
</template>

<script type="text/javascript">

  import Todo from './Todo';
  import CreateTodo from './CreateTodo';

  export default {
    components: {
      Todo,
      CreateTodo,
    },
    data() {
      return {
        todos: [{
          title: 'Todo A',
          tasks: [{
            title: 'test1',
            done: false,
          }, {
            title: 'test',
            done: true,
          }],
          background: 'pink',
        }, {
          title: 'Todo B',
          tasks: [{
            title: 'test',
            done: false,
          }],
          background: 'yellow',
        }, {
          title: 'Todo C',
          tasks: [{
            title: 'test',
            done: false,
          }],
          background: 'red',
        }, {
          title: 'Todo D',
          tasks: [{
            title: 'test',
            done: false,
          }],
          background: 'green',
        }, {
          title: 'Todo D',
          tasks: [{
            title: 'test',
            done: false,
          }],
          background: 'green',
        }],
      };
    },
    methods: {
      deleteTodo(todo) {
        const todoIndex = this.todos.indexOf(todo);
        this.todos.splice(todoIndex, 1);
      },
      addTodo(data) {
        this.todos.push({
          title: data.title,
          tasks: [],
          background: data.background,
        });
      },
    },
  };
</script>
<style>
</style>
