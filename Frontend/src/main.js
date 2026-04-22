import { createApp } from "vue";
import "./assets/style.css";
import App from "./App.vue";
import store from "./store/index.js";
import router from "./router";
import AlignItems from "./components/functions/AlignItems.vue";
import "flowbite";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 5000, // Adjust duration
    closeOnClick: true,
});

app.use(router);
app.use(store);
app.component("base-card", AlignItems);
app.mount("#app");
