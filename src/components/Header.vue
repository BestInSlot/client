<template>
<nav id="header" class="navbar is-black" @click.stop>
    <div class="container">
        <div class="navbar-brand">
                <img src="http://localhost/images/bis-logo-sm.png" alt="">
                <button :class="['button navbar-burger', { 'is-active': showMobileMenu }]" @click.prevent="toggleMobile(!showMobileMenu)">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <div class="navbar-menu">
                <div class="navbar-start">
                    <router-link class="nav-item" to="/">Home</router-link> 
                    <router-link class="nav-item" to="/">History</router-link> 
                    <router-link class="nav-item" to="/">Recruitment</router-link> 
                    <router-link class="nav-item" to="/">Media</router-link> 
                    <a :href="`${forumUrl}/session/sso`" class="nav-item" v-if="$auth.check()" target="_blank">Discussion</a>           
                    <a :href="forumUrl" class="nav-item" v-else target="_blank">Discussion</a>                                                 
                </div>
                <div id="account-panel" class="navbar-end" v-if="!$auth.check()">
                    <a class="nav-item" @click.prevent="setModal(true)">
                        <i class="fa fa-user-circle"/>
                        <span>Sign In / Up</span>
                    </a>
                </div>
                <div class="navbar-end" v-else>
                    <div id="user-bar" class="navbar-item">
                        <i class="fa fa-bell fa-2x"></i>
                    </div>
                    <div class="dropdown is-right is-hoverable" v-if="$auth.check() && userDetails">
                        <div class="dropdown-trigger">
                            <div aria-haspopup="true" aria-controls="dropdown-menu">
                                <div class="profile">
                                    <img :src="`http://localhost${userDetails.avatar}`" alt="" class="avatar-sm">    
                                    <span>{{userDetails.username}}</span>
                                    <span class="icon is-small">
                                        <i class="fa fa-chevron-down" aria-hidden="true"></i>
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <router-link to="/account" class="dropdown-item">
                                    <i class="icon fa fa-gear"></i>
                                    <span class="item">Settings</span>
                                </router-link>
                                <router-link to="/admin" class="dropdown-item" v-if="userDetails.is_admin">
                                    <i class="icon fa fa-user"></i>
                                    <span class="item">Admin</span>
                                </router-link>
                                <a class="dropdown-item" @click.prevent.stop="$auth.logout()">
                                    <i class="icon fa fa-sign-out"></i>
                                    <span class="item">Logout</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "navbar",
  computed: {
    ...mapGetters(["showMobileMenu"]),

    forumUrl() {
      return `http://${this.$discourse.url}:${this.$discourse.port}`;
    },

    userDetails() {
      return this.$auth.user();
    }
  },

  methods: {
    ...mapActions(["invalidate", "setModal", "toggleMobile"])
  }
};
</script>

<style lang="scss">
.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.profile {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    padding: 0 0.5rem;
  }
}

.dropdown-header {
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #000;
  border-bottom: 1px solid #555;
}
</style>


