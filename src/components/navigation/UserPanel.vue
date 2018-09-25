<template>
    <div class="navbar-end">
        <div id="user-panel" class="dropdown is-right is-hoverable" v-if="$auth.check() && $auth.user()">
            <div class="dropdown-trigger">
                <div aria-haspopup="true" aria-controls="dropdown-menu">
                    <div class="profile">
                        <img :src="`http://localhost${$auth.user().avatar}`" alt="" class="avatar-sm">    
                        <span>{{$auth.user().username}}</span>
                        <span class="icon is-small">
                            <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </span>
                    </div>
                    
                </div>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                    <div class="menu-wrap">
                        <div class="menu">
                            <p class="menu-label">
                                General
                            </p>
                            <ul class="menu-list">
                                <li>
                                    <router-link to="/account" class="dropdown-item">
                                        <span class="item">Settings</span>
                                    </router-link>
                                </li>
                                <li>
                                    <a class="dropdown-item">
                                        <span class="item">Notifications</span>
                                    </a>
                                </li>
                            </ul>
                            <template v-if="$auth.user().is_admin">
                                <p class="menu-label">
                                    <i class="icon fa fa-shield"></i>
                                    <span>Admin</span>
                                </p>
                                <ul class="menu-list">
                                    <li>
                                        <router-link to="/admin/recruitment" class="dropdown-item">
                                            <span class="item">Recruitment</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </template>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <a class="dropdown-item logout" @click.prevent.stop="$auth.logout()">
                        <i class="icon fa fa-sign-out"></i>
                        <span class="item">Logout</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss">
$menu-item-color: #cacaca;
$menu-item-hover-background-color: #0f0f0f;
.menu-wrap {
  padding: 0.5rem 0.75rem;
}
.logout {
  background-color: #0b0b0b;
}

#user-panel {
  .dropdown-content {
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
  }
}
</style>



                    