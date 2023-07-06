<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-lg-none" to="/">
        <CIcon :icon="logo" height="48" alt="Logo" />
      </CHeaderBrand>
      <CHeaderNav class="d-none d-md-flex me-auto"> </CHeaderNav>
      <CHeaderNav>
        <div
          class="d-flex gap-2 align-items-center"
          v-if="isAuthenticated == true || getToken != null"
        >
          <div
            class="border border-primary user-select-none h-100 rounded d-flex px-1 align-items-center"
          >
            {{ getUserProfile.email }}
          </div>
          <div class="btn btn-outline-danger" @click="logOut()">Logout</div>
        </div>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-else>
          <li class="nav-item">
            <router-link :to="{ name: 'Login' }" class="nav-link"
              >Login</router-link
            >
          </li>
        </ul>
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
      <div class="">
        <switches
          class="d-flex justify-content-center align-items-center gap-3"
          theme="bulma"
          color="green"
          :textEnabled="'MPay'"
          :textDisabled="'Modenis'"
          :value="isMpay"
          @trigger="changeTerminalTypeState"
        />
      </div>
    </CContainer>
  </CHeader>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import switches from '@/components/Switches.vue'
import AppBreadcrumb from './AppBreadcrumb'
import { logo } from '@/assets/brand/logo'
//import router from '@/router'
export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    switches,
  },
  data() {
    return {
      isMpay: true,
      logo,
    }
  },
  computed: {
    isAuthenticated: function () {
      return this.$store.state.auth.isAuthenticated
    },
    ...mapGetters('auth', {
      getToken: 'getToken',
      getUserProfile: 'getUserProfile',
    }),
    userProfile: function () {
      return this.getUserProfile
    },
  },
  methods: {
    ...mapActions('auth', {
      userLogout: 'userLogout',
    }),
    changeTerminalTypeState: function (value) {
      this.isMpay = value
      this.$store.commit('setCurrentVendorCode', this.isMpay ? 1 : 2)
      //console.log(this.$store.state.currentVendorCode)
    },
    logOut: async function () {
      await this.userLogout()
      location.reload()
    },
  },
  beforeMount() {
    //will be edited
    // if (this.getUserProfile.id == 0) {
    //   router.push({ name: 'Login' })
    // }
  },
}
</script>
