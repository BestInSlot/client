<template>
    <nav class="breadcrumb" aria-label="breadcrumbs" v-if="$breadcrumbs.length">
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li v-for="(crumb, index) in $breadcrumbs" :key="index" :class="{ 'is-active': $route.path === crumb.path }">
                <template v-if="$route.path !== crumb.path">
                    <router-link :to="crumb.path">{{crumb.title}}</router-link>
                </template>
                <template v-else>
                    <a href="#" aria-current="page">{{crumb.title}}</a>
                </template>
            </li>
        </ul>
    </nav>
</template>
