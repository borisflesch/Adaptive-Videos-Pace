<template>
  <div>
    <div class="component-wrapper">
      <div class="video-metadata">
        <h5>Video metadata</h5>
        <ul>
          <li>Category: </li>
          <li>Topic: </li>
          <li>Speaker pace: </li>
        </ul>
        <h5>User's model</h5>
        <ul>
          <li>(mathematics, algebra, 120)</li>
          <li>(mathematics, limits, 110)</li>
          <li>(physics, ..., 80)</li>
        </ul>
      </div>
      <div class="player-wrapper">
        <vue-plyr ref="plyr" :options="plyrOptions">
          <video controls crossorigin playsinline data-poster="poster.jpg">
            <source src="../assets/videos/algebra/polynomials-intro.mp4" type="video/mp4" />
            <track
              default
              kind="captions"
              label="English"
              src="../assets/videos/algebra/polynomials-intro.eng.vtt"
              srclang="en"
            />
          </video>
        </vue-plyr>

        <div class="speed-control">
          <button @click.prevent="slower" class="slower">-</button>
          <p>Current speed: {{ currentSpeed }} wpm</p>
          <button @click.prevent="faster" class="faster">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoPlayer",
  props: {
    video: String,
  },
  data() {
    return {
      currentSpeed: 100,
      plyrOptions: {}
    }
  },
  mounted() {
    console.log(this.$refs.plyr.player);
    this.$refs.plyr.player.on('ready', () => {
      console.log('Plyr Ready!')
      // this.$refs.plyr.player.captions = { active: true, language: 'auto', update: false }
    })
  },
  methods: {
    slower: function() {
      this.currentSpeed -= 10;
      this.$refs.plyr.player.speed -= 0.1
    },
    faster: function() {
      this.currentSpeed += 10;
      this.$refs.plyr.player.speed += 0.1
    }
  },
};
</script>

<style scoped>
.component-wrapper {
  display: flex;
  justify-content: center;
  align-items: top;
}
.video-metadata {
  flex-basis: auto;
  padding: 8px 22px;
  text-align: left;
}
.player-wrapper {
  width: 100%;
  max-width: 800px;
}
.speed-control {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}
.speed-control p {
  margin: 0 16px;
}
</style>
