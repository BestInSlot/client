<template>
  <transition enter-active-class="slide-in-from-left" leave-active-class="slide-out-from-left" mode="out-in">
    <nav id="mobile" class="navbar is-black">
      <div class="navbar-brand">
        <img src="http://localhost/images/bis-logo.png" alt="">
        <span class="delete" @click.prevent="closeMobileMenu(false)"></span>
      </div>
      <div class="navbar-head" v-if="!$auth.check()">
        <a href="" class="navbar-item" @click.prevent="toggle(!modal)">
          <i class="fa fa-user-circle"></i>
          Sign In / Up
        </a>
      </div>
      <div class="navbar-head" v-else>
        <accordion v-if="$auth.check() && $auth.user()" :containerClasses="{ 'navbar-item': true }">
          <a href="" class="navbar-item" slot="header">{{$auth.user().username}}</a>
          <ul class="submenu">
            <router-link to="/myaccount" tag="li" class="navbar-item">
              <a>Profile</a>
            </router-link>
            <li class="navbar-item" @click.prevent="invalidate">
              <a>Logout</a>
            </li>
          </ul>
        </accordion>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="mobile-nav-item navbar-item" to="/">Home</router-link>
          <router-link class="mobile-nav-item navbar-item" to="/">History</router-link>
          <router-link class="mobile-nav-item navbar-item" to="/">Recruitment</router-link>
          <router-link class="mobile-nav-item navbar-item" to="/">Media</router-link>
          <router-link class="mobile-nav-item navbar-item" to="/">Discussion</router-link>
          <accordion :containerClasses="{ 'navbar-item': true }">
            <a slot="header">Tools</a>
            <ul class="submenu">
              <li class="navbar-item">Bless Calculator</li>
              <li class="navbar-item">CF Calcaulator</li>
              <li class="navbar-item">Rift Calculator</li>
            </ul>
          </accordion>
        </div>

      </div>
    </nav>
  </transition>
</template>



<script>
'use strict';
import Accordion from '@/components/Accordion';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'mobile-menu',
  components: {
    Accordion
  },
  methods: {
    ...mapActions([
      'invalidate'
    ]),
      toggle(bool) {
          this.$store.dispatch('setModal', bool);
      },
      closeMobileMenu() {
        this.$store.dispatch('toggleMobile', false)
      }
  },
  computed: {
    ...mapGetters([
      'modal',
      'showMobileMenu',
    ])
  },

  watch: {
    showMobileMenu(m) {
      const root = document.documentElement;
      if (m) {
        root.classList.add('mobile-out');
      } else {
        root.classList.remove('mobile-out');
      }
    }
  }
}
</script>


<style lang="scss">
#mobile {
    position: fixed;
    top: 0;
    left: 0;
    box-shadow: 1px 1px 3px -2px rgba(0,0,0,0.5);
    min-width: 256px;
    height: 100%;
    z-index: 101;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    .navbar-brand {
      height: auto;
      justify-content: center;
      padding: 1rem 0;
      img {
        width: 60px;
        height: 60px;
      }
      &:hover {
        background: transparent;
      }
    }
    .delete {
        padding: 3px;
        background-color: #333;
        border-radius: 50%;
        position: absolute;
        top: 5px;
        right: 5px;
    }
    .navbar-head {
        text-align: center;
        background-color: #000;
        font-weight: 700;
        text-transform: uppercase;
        .submenu {
          font-weight: normal;
          text-align: left;
        }
    }
    .navbar-menu, 
    .navbar-start {
        display: flex;
        flex-direction: column;
        
    }
    .navbar-item {
        color: #cacaca;
        
    }
    .navbar-menu {
        background-color: inherit;
        box-shadow: none;
    }
    .mobile-nav-item {
      background-color: #0b0b0b;
      // box-shadow: 0 1px 0 rgba(255,255,255,0.3);
      border-bottom: 1px solid #222;
    }
}



.slide-in-from-left {
  animation: slideInFromLeft 0.15s linear forwards;
}

.slide-out-from-left {
  animation: slideOutFromLeft 0.15s linear forwards;
}




@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutFromLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translate(-100%);
  }
}

@media only screen and (min-width: 1023px) {
  html {
    &.mobile-out {
      overflow-y: scroll !important;
      overflow-x: hidden !important;
    }
  }
  #mobile {
    display: none;
  }
  .mobile:before,
  .mobile-open:before {
    z-index: -1;
    display: none !important;
  }
}
</style>
