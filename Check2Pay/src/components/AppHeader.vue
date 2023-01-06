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
        <ul
          class="navbar-nav me-auto mb-2 mb-lg-0"
          v-if="getUserProfile.id == 0"
        >
          <li class="nav-item">
            <router-link to="/pages/login" class="nav-link">Login</router-link>
          </li>
        </ul>
        <div
          class="d-flex gap-2 align-items-center"
          v-if="getUserProfile.id !== 0"
        >
          <div
            class="border border-primary user-select-none h-100 rounded d-flex px-1 align-items-center"
          >
            {{ getUserProfile.email }}
          </div>
          <div class="btn btn-outline-danger" @click="logout()">Logout</div>
        </div>
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import AppBreadcrumb from './AppBreadcrumb'
import { logo } from '@/assets/brand/logo'
//import router from '@/router'
export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
  },
  setup() {
    return {
      logo,
    }
  },
  computed: {
    ...mapGetters('auth', {
      getUserProfile: 'getUserProfile',
      getLogout: 'getLogout',
    }),
  },
  methods: {
    ...mapActions('auth', {
      userLogout: 'userLogout',
    }),
    ...mapMutations('auth', {
      setLogout: 'setLogout',
      setUserProfile: 'setUserProfile',
    }),
    async logout() {
      await this.userLogout()
      if (this.getLogout) {
        const resetUser = {
          id: 0,
          lastName: '',
          firstName: '',
          email: '',
          phone: '',
        }
        this.setUserProfile(resetUser)
        this.setLogout(false)
        this.$router.push({ name: 'Login' })
      }
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
