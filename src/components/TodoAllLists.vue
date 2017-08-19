<template>
  <todo-list v-bind:todos="todos" v-on:add-todo="addTodo"></todo-list>
</template>

<script>
  import TodoList from './TodoList';

  export default {
    components: {
      TodoList,
    },
    methods: {
    },
  };
</script>

<style>
</style>
