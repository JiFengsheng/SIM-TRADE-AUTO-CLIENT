import { createRouter, createMemoryHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import tokenApi from '../apis/token'
import type { TempTokenData } from '../apis/token'
import { unwrapApiData } from '../utils/request'
import { AUTO_ADMIN_TOKEN } from '../views/auth/hook'

const AUTH_PATH = '/auth'
const REVALIDATE_HOURS = 3
const REVALIDATE_MS = REVALIDATE_HOURS * 60 * 60 * 1000

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { keepAlive: false },
  },
  {
    path: '/normalConfig',
    name: 'NormalConfig',
    component: () => import('../views/settings/NormalConfig.vue'),
    meta: { keepAlive: true },
  },
  {
    path: '/backgroundConfig',
    name: 'BackgroundConfig',
    component: () => import('../views/settings/BackgroudConfig.vue'),
    meta: { keepAlive: true },
  },
  {
    path: '/desk',
    name: 'Desk',
    component: () => import('../views/desk/index.vue'),
    meta: { keepAlive: false },
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/history/index.vue'),
    meta: { keepAlive: false },
  },
  {
    path: '/contract',
    name: 'Contract',
    component: () => import('../views/contract/index.vue'),
    meta: { keepAlive: false },
  },
  {
    path: '/company',
    name: 'Company',
    component: () => import('../views/company/index.vue'),
    meta: { keepAlive: false },
  },
  {
    path: '/process',
    name: 'Process',
    component: () => import('../views/process/index.vue'),
    meta: { keepAlive: false },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/auth/index.vue'),
    meta: { keepAlive: false },
  },
  {
    path: '/email',
    name: 'Email',
    component: () => import('../views/email/index.vue'),
    meta: { keepAlive: false },
  },
  {
    path: '/advertisement',
    name: 'Advertisement',
    component: () => import('../views/advertisement/index.vue'),
    meta: { keepAlive: true },
  }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.path === AUTH_PATH) {
    next()
    return
  }

  const authStore = useAuthStore()
  console.log(authStore.getExpirationTime)
  console.log(authStore.isTokenExpired)
  if (!authStore.isAuthenticated || authStore.isTokenExpired) {
    authStore.clearAuth()
    next({ path: AUTH_PATH, query: { redirect: to.fullPath } })
    return
  }

  const authTime = authStore.authTime
  const authTimeMs = authTime ? new Date(authTime).getTime() : 0
  const now = Date.now()

  if (now - authTimeMs > REVALIDATE_MS) {
    const token = authStore.getToken;
    try {
      const [adminTokens, tempTokens] = await Promise.all([
        tokenApi.getAdminToken(),
        tokenApi.getTempToken(),
      ])
      
      const tokenList = unwrapApiData<string[]>(adminTokens)||[]
      tokenList.push(AUTO_ADMIN_TOKEN);
      if (tokenList.includes(token)) {
        authStore.setAuthAsAdmin(token)
        next()
        return
      }

      const temp = unwrapApiData<TempTokenData[]>(tempTokens)||[]
      const tempToken = temp.find(t => t.token === token)
      if (tempToken) {
        const expiration = new Date(tempToken.expirationTime);
        const now = new Date();
        if (expiration.getTime() < now.getTime()){
          authStore.clearAuth();
          next({ path: AUTH_PATH, query: { redirect: to.fullPath } })
          return
        }
        authStore.setAuthAsTemp(token, tempToken.expirationTime)
        next()
        return
      }
      next({ path: AUTH_PATH, query: { redirect: to.fullPath } });
      return;
    } catch (error) {
      if(token === AUTO_ADMIN_TOKEN) {
        authStore.setAuthAsAdmin(AUTO_ADMIN_TOKEN);
        next()
        return
      }
      authStore.clearAuth()
      next({ path: AUTH_PATH, query: { redirect: to.fullPath } });
      return;
    }
  }
  next()
})

