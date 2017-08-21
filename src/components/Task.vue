<template>

  <ul class="list-group list-group-flush" style="background: inherit;">
    <li class="list-group-item" style="background: inherit;">
      <div class="form-group">
        <div class="form-check">
          <label>{{ task.title }}</label>
          <span class='pull-right' v-on:click="deleteTask(task)" v-show="!isShareView">
          <i class='fa fa-close'></i>
        </span>
        </div>
      </div>
    </li>
  </ul>

</template>

<script type="text/javascript">

  export default {
    props: ['task', 'isShareView'],
    methods: {
      deleteTask(task) {
        this.$emit('delete-task', task);
      },
    },
  };
</script>

<style>
  label {
    min-width: 100px;
    display: inline-block;
  }

  .form-group, .form-check {
    margin: 0;
  }

  .list-group-flush .list-group-item {
    border-bottom: 0;
  }
</style>
