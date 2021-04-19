
require('./bootstrap');

import Vue from 'vue'
// progressbar import 
import VueProgressBar from 'vue-progressbar'
const VueProgressBarOptions = {
    color: '#29F300',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
      speed: '0.2s',
      opacity: '0.6s',
      termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
  }
  Vue.use(VueProgressBar,VueProgressBarOptions);

Vue.component('customer-component', require('./components/CustomerComponent.vue').default);
Vue.component('pagination', require('./components/partial/PaginationComponent.vue').default);



const app = new Vue({
    el: '#app',
});
