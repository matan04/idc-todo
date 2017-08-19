<template>
  <div class="col-sm-3 ">

    <div class="card">
      <div class="card-body align-items-center justify-content-center" v-bind:class="{ 'd-flex': !isCreating}"
           style="min-height: 150px;" v-show="!isCreating">
        <button class='btn btn-primary' v-on:click="openForm">
          Add New Todo List
        </button>
      </div>

      <div class="card-body" v-show="isCreating">
        <div class="form-group">
          <label>Title</label>
          <input type='text' v-model="titleText" ref='title' class="form-control" placeholder="Title"
                 v-on:mouseover="$event.target.focus()">
        </div>

        <div class="form-group">
          <label>Color</label>
          <slider-picker v-model="colors"/>
        </div>

        <div class="btn-group col align-self-center" role="group" style="margin-top: 5px;">
          <button class='btn btn-primary' v-on:click="sendForm()">
            Create
          </button>
          <button class='btn btn-secondary' v-on:click="closeForm">
            Cancel
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { Slider } from 'vue-color';

  const defaultProps = {
    hex: '#194d33',
    hsl: {
      h: 150,
      s: 0.5,
      l: 0.2,
      a: 1,
    },
    hsv: {
      h: 150,
      s: 0.66,
      v: 0.30,
      a: 1,
    },
    rgba: {
      r: 25,
      g: 77,
      b: 51,
      a: 1,
    },
    a: 1,
  };

  export default {
    data() {
      return {
        titleText: '',
        isCreating: false,
        colors: defaultProps,
      };
    },
    components: {
      'slider-picker': Slider,
    },
    methods: {
      openForm() {
        this.isCreating = true;
      },
      closeForm() {
        this.isCreating = false;
        this.titleText = '';
      },
      sendForm() {
        if (this.titleText.length > 0) {
          const title = this.titleText;
          this.$emit('add-todo', {
            title,
            background: this.colors.hex,
          });
          this.titleText = '';
        }
        this.isCreating = false;
      },
    },
  };
</script>

<style>
  .vc-slider {
    width: auto !important;
    margin: 10px 0;
  }
</style>
