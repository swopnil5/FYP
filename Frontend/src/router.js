import { createRouter, createWebHistory } from "vue-router";
import store from "./store/index";
import HomePage from "./components/pages/HomePage.vue";
import MyProfile from "./components/pages/MyProfile.vue";
import TheServices from "./components/pages/TheServices.vue";
import AdoptMe from "./components/pages/AdoptMe.vue";
import TheCaretakers from "./components/pages/TheCaretakers.vue";
import TheLogin from "./components/pages/TheLogin.vue";
import RegisterNow from "./components/pages/RegisterNow.vue";
import ContactCaretaker from "./components/pages/ContactCaretaker.vue";
import MyRequests from "./components/pages/MyRequests.vue";
import ContactRequests from "./components/pages/ContactRequests.vue";
import VerifyProfile from "./components/pages/VerifyProfile.vue";
import AllUsers from "./components/pages/AllUsers.vue";
import TheChart from "./components/pages/TheChart.vue";
import AllProfiles from "./components/pages/AllProfiles.vue";
import NotFound from "./components/pages/NotFound.vue";
import CareseekerRequests from "./components/pages/CareseekerRequests.vue";
import AdminPayouts from "./components/pages/AdminPayouts.vue";
import ForgotPassword from "./components/pages/ForgotPassword.vue";
import ResetPassword from "./components/pages/ResetPassword.vue";
// Import the Contact component
import Contact from "./components/functionalities/Contact.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/myprofile", component: MyProfile, meta: { requiresAuth: true } },
    { path: "/services", component: TheServices, meta: { requiresAuth: true } },
    { path: "/adoptme", component: AdoptMe, meta: { requiresAuth: true } },
    {
      path: "/caretakers",
      component: TheCaretakers,
      meta: { requiresAuth: true },
    },
    {
      path: "/caretakers/:id/contact",
      component: ContactCaretaker,
      meta: { requiresAuth: true },
    },
    { path: "/login", component: TheLogin, meta: { requiresUnAuth: true } },
    {
      path: "/register",
      component: RegisterNow,
      meta: { requiresUnAuth: true },
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
      meta: { requiresUnAuth: true },
    },
    {
      path: "/reset-password",
      component: ResetPassword,
      meta: { requiresUnAuth: true },
    },
    {
      path: "/requests",
      component: ContactRequests,
      meta: { requiresAuth: true },
    },
    {
      path: "/myservices",
      component: MyRequests,
      meta: { requiresAuth: true },
    },
    {
      path: "/myservicerequests",
      component: CareseekerRequests,
      meta: { requiresAuth: true },
    },
    {
      path: "/applyforverification",
      component: VerifyProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/allusers",
      component: AllUsers,
      meta: { requiresAuth: true },
    },
    {
      path: "/allprofiles",
      component: AllProfiles,
      meta: { requiresAuth: true },
    },
    {
      path: "/chart",
      component: TheChart,
      meta: { requiresAuth: true },
    },
    {
      path: "/payouts",
      component: AdminPayouts,
      meta: { requiresAuth: true },
    },
    // Add the Contact page route - no authentication required
    { path: "/contact", component: Contact },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach(function (to, from, next) {
  if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
    next("/login");
  } else if (to.meta.requiresUnAuth && store.getters.isLoggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router;