import localStorageProxy from 'local-storage-proxy'
import monkeyStorageProxy from './monkeyStorageProxy'
import fixState from './fixState'
import {
  getValByPath,
  setValByPath
} from '../libs/utils/index'

/* For local configuration of specific domain names, different websites can have their own corresponding configurations */
const defConfig = {
  video: {
    autoPlay: true,
    playbackRate: 1,

    /*Unified management of volume can easily lead to misjudgments, such as advertising videos that play silently or background videos with inactive TAB.
     *Therefore, you should try to use the default initial volume setting of the website
     */
    volume: 1,

    /* transform style rules */
    transform: {
    /* Zoom factor */
      scale: 1,

      /* Horizontal displacement */
      translate: {
        x: 0,
        y: 0
      },

      /* Rotation */
      rotate: 0,

      /* Horizontal flip, 0 or 180 */
      rotateY: 0,
      /* Vertical flip, 0 or 180 */
      rotateX: 0
    }
  },

  enhance: {
    /* If the default speed adjustment logic is not disabled, the speed will be easily reset when switching between multiple videos, so this option is enabled by default */
    blockSetPlaybackRate: true,

    blockSetCurrentTime: null,
    blockSetVolume: null
  },

  hotkeys: {},

  /**
   * TODO controls whether to turn on/off the debugging mode, with supplementary functions
   */
  debug: true
}

/* Global configuration, priority lower than defConfig */
const defGlobalConfig = {
  video: {
    playbackRate: 1,
    volume: 1
  },
  hotkeys: {},

  enhance: {
    /* If the default speed adjustment logic is not disabled, the speed will be easily reset when switching between multiple videos, so this option is enabled by default */
    blockSetPlaybackRate: true,

    blockSetCurrentTime: false,
    blockSetVolume: false
  },

  /**
   * TODO controls whether to turn on/off the debugging mode, with supplementary functions
   */
  debug: true
}

let config = defConfig
try {
  config = localStorageProxy('_h5playerConfig_', {
    defaults: defConfig,
    lspReset: false,
    storageEventListener: false
  })
} catch (e) {
  console.error('localStorageProxy error:', e)
}

const globalConfig = monkeyStorageProxy('_h5playerGlobalConfig_', {
  defaults: defGlobalConfig,
  lspReset: false,
  storageEventListener: false
})

/* Fix the configuration item synchronization exception problem of the configuration item status manager */
fixState(config, defConfig)
fixState(globalConfig, defGlobalConfig)

/**
 *Based on the local configuration and global configuration, and on the premise of giving priority to localState, find out the final configuration results that should be applied
 *@param statePath {string} -required The configured path name, for example: 'enhance.blockSetVolume'
 *@returns
 */
function getConfigState (statePath) {
  const localState = getValByPath(config, statePath)
  const globalState = getValByPath(globalConfig, statePath)

  /* localState takes precedence, if localState is not defined, globalState is used */
  if (typeof localState === 'undefined' || localState === null) {
    return globalState
  } else {
    return localState
  }
}

/**
 *According to the local configuration and global configuration, on the premise that localState takes precedence, set the value to localState or globalState.
 *@param statePath {String} -required The configured path name, for example: 'enhance.blockSetVolume'
 *@param val {Any} -required Any value to be set
 *@returns {Boolean} Returns true to indicate successful setting
 */
function setConfigState (statePath, val) {
  const localState = getValByPath(config, statePath)
  const globalState = getValByPath(globalConfig, statePath)

  /* localState takes precedence. If localState is not defined, globalState should be set */
  if (typeof localState === 'undefined' || localState === null) {
    return setValByPath(globalState, statePath, val)
  } else {
    return setValByPath(localState, statePath, val)
  }
}

export { config, globalConfig, getConfigState, setConfigState }
