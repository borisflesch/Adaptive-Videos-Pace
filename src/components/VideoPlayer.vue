<template>
  <div>
    <div class="component-wrapper">
      <div class="video-metadata">
        <h5>Video metadata</h5>
        <ul>
          <li>Duration: {{ mediaMetadata.duration.toFixed(2) }} secs</li>
          <li>Adjusted video speed: {{ mediaMetadata.speed.toFixed(2) }}</li>
          <li>Real current speaker pace: {{ mediaMetadata.currSpeakerWpm }}</li>
          <li>Category: {{ mediaMetadata.category.capitalize() }}</li>
          <li>
            Current topics (keywords):
            <ul>
              <li v-for="(topic, index) in mediaMetadata.currTopics" :key="index">{{ topic }}</li>
            </ul>
          </li>
        </ul>
        <h5>User's model</h5>
        <ul>
          <li v-for="(entry, index) in userModel" :key="index">
            {{ entry }}
          </li>
        </ul>
      </div>
      <div class="player-wrapper">
        <h2>{{ mediaMetadata.category }} - {{ title }}</h2>

        <vue-plyr ref="plyr" :options="plyrOptions">
          <video controls crossorigin :src="require(`../assets/videos/${video}.mp4`)" type="video/mp4"></video>
        </vue-plyr>

        <div class="speed-control">
          <button @click.prevent="slower" class="slower">-</button>
          <p>Automatically adjust speed to {{ currentSpeed }} wpm</p>
          <button @click.prevent="faster" class="faster">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import srt from 'raw-loader!./../assets/videos/algebra/polynomials-intro.eng.srt'
import transcriptions from './../assets/videos/transcriptions'
import { parseSync } from 'subtitle'
import keyword_extractor from 'keyword-extractor'

export default {
  name: "VideoPlayer",
  props: {
    title: String,
    video: String,
  },
  data() {
    return {
      player: null,
      defaultWpm: 160,
      currentSpeed: 160,
      mediaMetadata: {
        duration: 0.00,
        speed: 0.00,
        transcription: null,
        category: "",
        currTopics: [],
        currSpeakerWpm: 0,
      },
      intervalUpdateFct: null,
      // refreshInterval: 15000, // Update every 15s
      refreshInterval: 5000, // Update every 5s
      userModel: [],
      plyrOptions: {}
    }
  },
  watch: {
    video: {
      // immediate: true,
      handler: function (val) {
        this.mediaMetadata.category = val.split('/').shift().capitalize()
        const srt = transcriptions[val].join('\n')
        this.mediaMetadata.transcription = parseSync(srt)
        if (!this.$refs.plyr || !this.$refs.plyr.player) return
      }
    }
  },
  mounted() {
    // console.log(this.player);
    this.mediaMetadata.category = this.video.split('/').shift().capitalize()

    this.$refs.plyr.player.on('ready', () => {
      console.log('Plyr Ready!')
    })

    this.$refs.plyr.player.on('loadedmetadata', () => {
      const srt = transcriptions[this.video].join('\n')
      this.mediaMetadata.transcription = parseSync(srt)
      this.mediaMetadata.duration = this.$refs.plyr.player.duration
      this.mediaMetadata.speed = this.$refs.plyr.player.speed
    })

    // On timeupdate, extract current pace + topic of the video from subtitles (now + 15secs)
    this.$refs.plyr.player.on('playing', () => {
      this.processMetadataRefresh()

      // Update metadata every 15 seconds
      this.intervalUpdateFct = setInterval(() => {
        this.processMetadataRefresh()
      }, this.refreshInterval)
    })

    this.$refs.plyr.player.on('pause', () => {
      clearInterval(this.intervalUpdateFct)
    })


  },
  methods: {
    slower() {
      this.setCurrentSpeed(this.currentSpeed - 10)
    },
    faster() {
      this.setCurrentSpeed(this.currentSpeed + 10)
    },
    setCurrentSpeed(wpm) {
      this.currentSpeed = wpm
      this.updatePlayerSpeed()
    },
    updatePlayerSpeed() {
      this.mediaMetadata.speed = this.currentSpeed / (this.mediaMetadata.currSpeakerWpm ?? this.defaultWpm)
      this.$refs.plyr.player.speed = this.mediaMetadata.speed
    },
    updateUserModel() {
      for (const topic of this.mediaMetadata.currTopics) {
        const newEntry = [this.mediaMetadata.category, topic, this.currentSpeed]
        const existingEntryIndex = this.userModel.findIndex(e => e[0] === newEntry[0] && e[1] === newEntry[1])
        if (existingEntryIndex === -1) {
          this.userModel.push(newEntry) // Add entry
        } else {
          this.userModel[existingEntryIndex] = newEntry // Update wpm
        }
      }
    },
    adjustSpeedFromUserModel() {
      const topicEntry = this.userModel.find(e => e[0] === this.mediaMetadata.category && this.mediaMetadata.currTopics.includes(e[1]))
      if (topicEntry) {
        this.setCurrentSpeed(topicEntry[2])
      } else {
        const categoryEntries = this.userModel.filter(e => e[0] === this.mediaMetadata.category)
        if (categoryEntries && Array.isArray(categoryEntries) && categoryEntries.length) {
          const avgSpeed = parseInt(categoryEntries.map(e => e[2]).reduce((a, b) => a + b) / categoryEntries.length)
          this.setCurrentSpeed(avgSpeed)
        } else {
          this.setCurrentSpeed(this.currentSpeed)
        }
      }
    },
    processMetadataRefresh() {
      // Update user model from previous video segment
      this.updateUserModel()

      const margin = 0 // Margin of 3s
      const currentTime = this.$refs.plyr.player.currentTime * 1000 // s -> ms
      const beginTime = currentTime - margin
      const endTime = currentTime + this.refreshInterval + margin

      // Fetch transcriptions between now and +{refreshInterval} timeframe
      const transcriptions = this.mediaMetadata.transcription.filter(t => {
        return (
          (t.data.start >= beginTime && t.data.end <= endTime)
          || (t.data.start < beginTime && t.data.end >= beginTime && t.data.end <= endTime)
          || (t.data.start >= beginTime && t.data.start <= endTime && t.data.end > endTime)
        )
      })

      const transcriptionBegin = transcriptions[0].data.start
      const transcriptionEnd = transcriptions[transcriptions.length - 1].data.end
      const fullTranscriptionStr = transcriptions.map(t => t.data.text).join(' ')
      const totalWords = fullTranscriptionStr.split(' ').length

      // Compute real speaker pace and adjust video speed accordingly
      this.mediaMetadata.currSpeakerWpm = parseInt(totalWords * 60000 / (transcriptionEnd - transcriptionBegin))
      this.updatePlayerSpeed()

      // Detect keywords
      const keywords = keyword_extractor.extract(
        fullTranscriptionStr,
        {
          language: "english",
          remove_digits: true,
          return_changed_case:true,
          remove_duplicates: false
        }
      )
      this.mediaMetadata.currTopics = [...new Set(keywords)].slice(0, 3)

      // Adjust speed from user model
      this.adjustSpeedFromUserModel()
    }
  },
};
</script>

<style scoped>
.component-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
