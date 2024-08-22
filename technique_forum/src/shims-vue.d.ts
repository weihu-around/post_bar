/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


import Vue from 'vue'
import VueRouter from 'vue-router'
import {Route} from 'vue/-router'

// 扩充
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: VueRouter;
    $route: Route;
  }
}