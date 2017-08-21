<template>
  <div>
    <h1 class="display-4">My todo's</h1>
    <div class="card-columns">
      <todo v-for="todo in todos" :key="todo.id" v-bind:todo="todo" v-bind:isShareView="false"></todo>
      <create-todo v-on:add-todo="addTodo"></create-todo>
    </div>
    <h1 class="display-4">Shared with me</h1>
    <div class="card-columns">
      <todo v-for="todo in shared" :key="todo.id" v-bind:todo="todo" v-bind:isShareView="true"></todo>
    </div>
  </div>
</template>

<script type="text/javascript">

  import Todo from './Todo';
  import CreateTodo from './CreateTodo';

  export default {
    name: 'todoList',
    components: {
      Todo,
      CreateTodo,
    },
    data() {
      return {
        todos: [],
        shared: [],
      };
    },
    created() {
      const that = this;
      this.$store.state.getters.getLists().then(() => {
        that.todos = that.$store.state.todos;
        that.shared = that.$store.state.shared;
      });
    },
    methods: {
      addTodo(data) {
        const that = this;
        this.$store.state.getters.addTodo(data).then(() => {
          that.todos = that.$store.state.todos;
        });
      },
    },
  };
</script>
<style>
</style>
