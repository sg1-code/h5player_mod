<template>
  <div class="h5player-ui-wrap">
    <el-drawer
      title="set up"
      :size="String('600px')"
      :modal-append-to-body="Boolean(false)"
      :visible.sync="appStatus.openSettingPanel"
      :direction="direction"
      :before-close="handleClose"
    >
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            Playback settings
            <!--<i class="header-icon el-icon-info" />-->
          </template>
          <el-form
            ref="form"
            label-width="120px"
          >
            <el-form-item label="Autoplay:">
              <el-switch
                v-model="autoPlay"
                name="'Autoplay'"
              />
            </el-form-item>

            <el-form-item label="Play speed:">
              <el-input placeholder="Please enter content" />
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="shortcut key">
          <div>Control feedback: Allow users to clearly perceive their operations through interface style and interactive effects.</div>
          <div>Page feedback: After operation, the current status is clearly displayed through changes in page elements.</div>
        </el-collapse-item>
        <el-collapse-item title="Other configuration items">
          <div>Simplify the process: Design a simple and intuitive operation process.</div>
          <div>The language is clearly expressed and the meaning is clear, allowing users to quickly understand and make decisions.</div>
          <div>Help users identify: The interface is simple and straightforward, allowing users to quickly identify rather than recall, reducing the user's memory burden.</div>
        </el-collapse-item>
        <el-collapse-item title="about">
          <div>User decision-making: User operation suggestions or safety tips can be given according to the scenario, but it cannot make decisions on behalf of the user.</div>
          <div>Controllable results: Users can perform operations freely, including undoing, rolling back, and terminating current operations.</div>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  </div>
</template>
<script>
import appStatus from './data'
export default {
  name: 'App',
  components: {},
  data () {
    return {
      appStatus,
      drawer: appStatus.openSettingPanel,
      direction: 'rtl',
      autoPlay: true
    }
  },
  methods: {
    handleClose (done) {
      done()
      // this.$confirm('Confirm to close?')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
    }
  }
}

</script>

<style lang="scss">
  /*h5-player-ui {*/
  /*  position: fixed;*/
  /*  left: 0;*/
  /*  top: 0;*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*  z-index: 99999999;*/
  /*  pointer-events: none;*/
  /*}*/

  .h5player-ui-wrap {
    /*background-color:#00a1d6;*/
    /*color:#fffbe5;*/
  }

  .el-drawer__body {
    padding: 20px;
  }
</style>
