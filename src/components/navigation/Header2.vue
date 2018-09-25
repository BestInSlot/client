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
                    <router-link class="navbar-item" to="/">Home</router-link> 
                    <router-link class="navbar-item" to="/">History</router-link> 
                    <router-link class="navbar-item" to="/recruitment">Recruitment</router-link> 
                    <drop-down 
                      :parentClass="'navbar-item has-dropdown'" 
                      :isActivable="true"  
                      :hoverableClass="'is-hoverable'" 
                      :activableClass="'is-active'">
                      <a class="navbar-link">Media</a>
                       <div class="navbar-dropdown">
                           <router-link class="navbar-item" to="/media/streams">Streams</router-link>
                       </div>
                    </drop-down>
                    <a :href="`${forumUrl}/session/sso`" class="navbar-item" v-if="$auth.check()" target="_blank">Discussion</a>           
                    <a :href="forumUrl" class="navbar-item" v-else target="_blank">Discussion</a>                                                 
                </div>
                <div id="account-panel" class="navbar-end" v-if="!$auth.check()">
                    <a class="nav-item" @click.prevent="setModal(true)">
                        <i class="fa fa-user-circle"/>
                        <span>Sign In / Up</span>
                    </a>
                </div>
                <user-panel v-else/>
            </div>
    </div>
</nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UserPanel from "./UserPanel";
import DropDown from "@/components/dropdowns/DropDown";

export default {
  name: "navbar",
  components: { UserPanel, DropDown },
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
    ...mapActions(["setModal", "toggleMobile"])
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


