<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <sidebar-menu :menu="menu" />
    <VideoPlayer video="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import VideoPlayer from "./components/VideoPlayer.vue";

export default {
  name: "App",
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Course selection",
          hiddenOnCollapse: true,
        },
        // {
        //   href: "/",
        //   title: "Dashboard",
        //   icon: {
        //     element: "font-awesome-icon",
        //     attributes: { icon: "user" },
        //   },
        // },
        {
          // href: "/",
          title: "History",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "book" },
          },
          child: [
            {
              href: "/charts/sublink",
              title: "Sub Link",
            },
          ],
        },
        {
          // href: "/",
          title: "Mathematics",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "square-root-alt" },
          },
          child: [
            {
              href: "/charts/sublink",
              title: "Sub Link",
            },
          ],
        },
        {
          // href: "/",
          title: "Chemistry",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "flask" },
          },
          child: [
            {
              href: "/charts/sublink",
              title: "Sub Link",
            },
          ],
        },
        {
          // href: "/",
          title: "Physics",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "magnet" },
          },
          child: [
            {
              href: "/charts/sublink",
              title: "Sub Link",
            },
          ],
        },
        {
          // href: "/",
          title: "Biology",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "dna" },
          },
          child: [
            {
              href: "/charts/sublink",
              title: "Sub Link",
            },
          ],
        },
      ],
    };
  },
  components: {
    VideoPlayer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
