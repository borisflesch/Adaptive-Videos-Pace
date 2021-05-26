<template>
  <div id="app">
    <sidebar-menu :menu="menu" @item-click="onMenuItemClick" :collapsed="true" />

    <VideoPlayer v-if="currVideo" :title="currVideo.title" :video="currVideo.videoSrc" />
    <div v-else>
      Please choose a video from the menu!
    </div>

    <footer>
      <p>
        By Boris Flesch - Adaptive Applications Research Project - <a href="https://github.com/borisflesch/adaptive-videos-pace">GitHub Repository</a>
      </p>
    </footer>
  </div>
</template>

<script>
import VideoPlayer from "./components/VideoPlayer.vue";

export default {
  name: "App",
  data() {
    return {
      currVideo: null,
      menu: [
        {
          header: true,
          title: "Course selection",
          hiddenOnCollapse: true,
        },
        {
          title: "History",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "book" },
          },
          child: [
            { title: "Christopher Columbus", videoSrc: "history/christopher-columbus" },
            { title: "The Columbian Exchange", videoSrc: "history/the-columbian-exchange" },
            { title: "Motivations for English colonization", videoSrc: "history/motivations-for-english-colonization" },
            { title: "England in the Age of Exploration", videoSrc: "history/england-in-the-age-of-exploration" },
          ],
        },
        {
          title: "Mathematics",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "square-root-alt" },
          },
          child: [
            { title: "Introduction to Polynomials", videoSrc: "algebra/polynomials-intro" },
            { title: "Adding Polynomials", videoSrc: "algebra/adding-polynomials" },
            { title: "Subtracting Polynomials", videoSrc: "algebra/subtracting-polynomials" },
            { title: "The parts of polynomial expressions", videoSrc: "algebra/parts-polynomial-expressions" },
          ],
        },
        {
          title: "Chemistry",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "flask" },
          },
          child: [
            { title: "Oxidation states of carbon", videoSrc: "chemistry/oxidation-states-of-carbon" },
            { title: "Organic oxidation-reduction reactions", videoSrc: "chemistry/organic-oxidation-reduction-reactions" },
            { title: "Resonance structure", videoSrc: "chemistry/resonance-structure" },
            { title: "Formal charge on oxygen", videoSrc: "chemistry/formal-charge-on-oxygen" },
          ],
        },
        {
          title: "Physics",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "magnet" },
          },
          child: [
            { title: "Introduction to physics", videoSrc: "physics/introduction-physics" },
            { title: "Introduction to vectors & scalars", videoSrc: "physics/introduction-vectors-scalars" },
            { title: "Position-time graphs", videoSrc: "physics/position-time-graphs" },
            { title: "Average velocity and speed worked example", videoSrc: "physics/average-velocity-and-speed-worked-example" },
          ],
        },
        {
          title: "Biology",
          icon: {
            element: "font-awesome-icon",
            attributes: { icon: "dna" },
          },
          child: [
            { title: "Introduction to vitamins and minerals", videoSrc: "biology/introduction-vitamins-minerals" },
            { title: "Introduction to pH", videoSrc: "biology/introduction-ph" },
            { title: "Introduction to carbohydrates", videoSrc: "biology/introduction-carbohydrates" },
            { title: "Introduction to lipids", videoSrc: "biology/introduction-lipids" },
          ],
        },
      ],
    };
  },
  components: {
    VideoPlayer,
  },
  methods: {
    onMenuItemClick(e, item) {
      if (item.child) return
      this.currVideo = item
      e.preventDefault()
    },
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
  margin-top: 20px;
}
footer {
  position: fixed;
  bottom: 0;
  right: 0; left: 0;
  background: #1E1E21;
  color: #cecece;
  font-size: 0.9em;
  height: 49px;
}
footer a {
  color: #cecece;
}
</style>
