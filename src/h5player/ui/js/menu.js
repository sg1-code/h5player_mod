import iconFastForwardBtn from '../../../../node_modules/@shoelace-style/shoelace/dist/assets/icons/fast-forward-btn.svg'
import iconImage from '../../../../node_modules/@shoelace-style/shoelace/dist/assets/icons/image.svg'
import iconList from '../../../../node_modules/@shoelace-style/shoelace/dist/assets/icons/list.svg'
import iconDownload from '../../../../node_modules/@shoelace-style/shoelace/dist/assets/icons/download.svg'
// import iconGear from '../../../node_modules/@shoelace-style/shoelace/dist/assets/icons/gear.svg'
// import iconXLg from '../../../node_modules/@shoelace-style/shoelace/dist/assets/icons/x-lg.svg'
import { faq } from './faq.js'

const { i18n, debug, globalFunctional, configManager } = window.h5playerUIProvider
const isGlobalStorageUsable = configManager.isGlobalStorageUsable()

export const menuConfig = [
  {
    title: i18n.t('download'),
    desc: i18n.t('download'),
    icon: iconDownload,
    action: 'mediaDownload',
    args: null
  },
  {
    title: i18n.t('capture'),
    desc: i18n.t('capture'),
    icon: iconImage,
    action: 'capture',
    args: null
  },
  {
    title: i18n.t('speed'),
    desc: i18n.t('speed'),
    icon: iconFastForwardBtn,
    dropdownMenu: [
      {
        title: '0.5x',
        desc: '0.5x',
        action: 'setPlaybackRate',
        args: 0.5
      },
      {
        title: '0.75x',
        desc: '0.75x',
        action: 'setPlaybackRate',
        args: 0.75
      },
      {
        title: '1.0x',
        desc: '1.0x',
        action: 'setPlaybackRate',
        args: 1
      },
      {
        title: '1.25x',
        desc: '1.25x',
        action: 'setPlaybackRate',
        args: 1.25
      },
      {
        title: '1.5x',
        desc: '1.5x',
        action: 'setPlaybackRate',
        args: 1.5
      },
      {
        title: '2.0x',
        desc: '2.0x',
        action: 'setPlaybackRate',
        args: 2
      },
      {
        title: '3.0x',
        desc: '3.0x',
        action: 'setPlaybackRate',
        args: 3
      },
      {
        title: '4.0x',
        desc: '4.0x',
        action: 'setPlaybackRate',
        args: 4
      },
      {
        title: '8.0x',
        desc: '8.0x',
        action: 'setPlaybackRate',
        args: 8
      },
      {
        title: '16.0x',
        desc: '16.0x',
        action: 'setPlaybackRate',
        args: 16
      }
    ]
  },
  {
    title: i18n.t('menu'),
    desc: i18n.t('menu'),
    icon: iconList,
    dropdownMenu: [
      {
        title: i18n.t('graphicalInterface'),
        desc: i18n.t('graphicalInterface'),
        subMenu: [
          {
            title: i18n.t('disableCurrentInstanceGUI'),
            desc: i18n.t('disableCurrentInstanceGUI'),
            action: 'disableCurrentInstanceGUI',
            args: null
          },
          {
            title: i18n.t('disableGUITemporarily'),
            desc: i18n.t('disableGUITemporarily'),
            action: 'disableGUITemporarily',
            args: null
          },
          {
            ...globalFunctional.toggleGUIStatusUnderCurrentSite,
            action: 'toggleGUIStatusUnderCurrentSite',
            args: null
          },
          {
            ...globalFunctional.alwaysShowGraphicalInterface,
            action: 'alwaysShowGraphicalInterface',
            args: null,
            disabled: !debug.isDebugMode() || !isGlobalStorageUsable
          }
        ]
      },
      {
        title: i18n.t('videoFilter'),
        desc: i18n.t('videoFilter'),
        subMenu: [
          {
            title: i18n.t('resetFilterAndTransform'),
            desc: i18n.t('resetFilterAndTransform'),
            action: 'resetFilterAndTransform',
            args: null
          },
          {
            title: i18n.t('brightnessUp'),
            desc: i18n.t('brightnessUp'),
            action: 'setBrightnessUp',
            args: 0.1
          },
          {
            title: i18n.t('brightnessDown'),
            desc: i18n.t('brightnessDown'),
            action: 'setBrightnessDown',
            args: -0.1
          },
          {
            title: i18n.t('contrastUp'),
            desc: i18n.t('contrastUp'),
            action: 'setContrastUp',
            args: 0.1
          },
          {
            title: i18n.t('contrastDown'),
            desc: i18n.t('contrastDown'),
            action: 'setContrastDown',
            args: -0.1
          },
          {
            title: i18n.t('saturationUp'),
            desc: i18n.t('saturationUp'),
            action: 'setSaturationUp',
            args: 0.1
          },
          {
            title: i18n.t('saturationDown'),
            desc: i18n.t('saturationDown'),
            action: 'setSaturationDown',
            args: -0.1
          },
          {
            title: i18n.t('hueUp'),
            desc: i18n.t('hueUp'),
            action: 'setHueUp',
            args: 1
          },
          {
            title: i18n.t('hueDown'),
            desc: i18n.t('hueDown'),
            action: 'setHueDown',
            args: -1
          },
          {
            title: i18n.t('blurUp'),
            desc: i18n.t('blurUp'),
            action: 'setBlurUp',
            args: 1
          },
          {
            title: i18n.t('blurDown'),
            desc: i18n.t('blurDown'),
            action: 'setBlurDown',
            args: -1
          }
        ]
      },
      {
        title: i18n.t('rotateAndMirror'),
        desc: i18n.t('rotateAndMirror'),
        action: 'rotateAndMirror',
        subMenu: [
          {
            title: i18n.t('rotate90'),
            desc: i18n.t('rotate90'),
            action: 'setRotate',
            args: null
          },
          {
            title: i18n.t('horizontalMirror'),
            desc: i18n.t('horizontalMirror'),
            action: 'setMirror',
            args: null
          },
          {
            title: i18n.t('verticalMirror'),
            desc: i18n.t('verticalMirror'),
            action: 'setMirror',
            args: true
          }
        ]
      },
      {
        title: i18n.t('videoTransform'),
        desc: i18n.t('videoTransform'),
        action: 'translate',
        subMenu: [
          {
            title: i18n.t('translateRight'),
            desc: i18n.t('translateRight'),
            action: 'setTranslateRight',
            args: null
          },
          {
            title: i18n.t('translateLeft'),
            desc: i18n.t('translateLeft'),
            action: 'setTranslateLeft',
            args: null
          },
          {
            title: i18n.t('translateUp'),
            desc: i18n.t('translateUp'),
            action: 'setTranslateUp',
            args: null
          },
          {
            title: i18n.t('translateDown'),
            desc: i18n.t('translateDown'),
            action: 'setTranslateDown',
            args: null
          }
        ]
      },
      {
        title: i18n.t('moreActions'),
        desc: i18n.t('moreActions'),
        subMenu: [
          {
            title: 'Clean remote helper info',
            desc: 'Clean remote helper info',
            action: 'cleanRemoteHelperInfo',
            disabled: !debug.isDebugMode()
          },
          {
            title: 'Print Player info',
            desc: 'Print Player info',
            action: 'printPlayerInfo',
            disabled: !debug.isDebugMode()
          },
          {
            ...globalFunctional.openCustomConfigurationEditor,
            action: 'openCustomConfigurationEditor',
            args: null,
            disabled: true
          },
          {
            title: i18n.t('comingSoon'),
            desc: i18n.t('comingSoon')
          }
        ]
      },
      {
        divider: true
      },
      {
        title: i18n.t('keyboardControl'),
        desc: i18n.t('keyboardControl'),
        subMenu: [
          {
            ...globalFunctional.openHotkeysPage,
            action: 'openHotkeysPage',
            args: ''
          },
          {
            title: i18n.t('toggleHotkeysTemporarily'),
            desc: i18n.t('toggleHotkeysTemporarily'),
            action: 'toggleHotkeys'
          },
          {
            ...globalFunctional.toggleHotkeysStatusUnderCurrentSite,
            action: 'toggleHotkeysStatusUnderCurrentSite'
          },
          {
            ...globalFunctional.toggleHotkeysStatus,
            action: 'toggleHotkeysStatus',
            disabled: !isGlobalStorageUsable
          }
        ]
      },
      {
        title: i18n.t('mouseControl'),
        desc: i18n.t('mouseControl'),
        subMenu: [
          {
            ...globalFunctional.setMouseLongPressTime,
            action: 'setMouseLongPressTime'
          },
          {
            ...globalFunctional.toggleMouseControlUnderCurrentSite,
            action: 'toggleMouseControlUnderCurrentSite'
          },
          {
            ...globalFunctional.toggleMouseControl,
            action: 'toggleMouseControl',
            disabled: !isGlobalStorageUsable
          },
          {
            title: i18n.t('comingSoon'),
            desc: i18n.t('comingSoon')
          }
        ]
      },
      {
        title: i18n.t('mediaDownload.downloadOptions'),
        desc: i18n.t('mediaDownload.downloadOptions'),
        subMenu: [
          {
            ...globalFunctional.toggleDownloadControlUnderCurrentSite,
            action: 'toggleDownloadControlUnderCurrentSite'
          },
          {
            ...globalFunctional.toggleDownloadControl,
            action: 'toggleDownloadControl',
            disabled: !isGlobalStorageUsable
          },
          {
            title: `${i18n.t('toggleStates')} ${i18n.t('autoGotoBufferedTime')}`,
            desc: `${i18n.t('toggleStates')} ${i18n.t('autoGotoBufferedTime')}`,
            action: 'toggleAutoGotoBufferedTime'
          },
          {
            title: i18n.t('ffmpegScript'),
            desc: i18n.t('ffmpegScript'),
            url: 'https://u.anzz.top/ffmpegscript'
          }
        ]
      },
      {
        title: i18n.t('faq'),
        desc: i18n.t('faq'),
        subMenu: faq
      },
      {
        title: i18n.t('setting'),
        desc: i18n.t('setting'),
        subMenu: [
          {
            ...globalFunctional.openCustomConfigurationEditor,
            action: 'openCustomConfigurationEditor',
            args: ''
          },
          {
            ...globalFunctional.restoreGlobalConfiguration,
            action: 'restoreGlobalConfiguration',
            args: '',
            disabled: !isGlobalStorageUsable
          },
          {
            ...globalFunctional.toggleScriptEnableState,
            action: 'toggleScriptEnableState',
            args: null
          },
          {
            ...globalFunctional.toggleSetCurrentTimeFunctional,
            action: 'toggleSetCurrentTimeFunctional',
            args: ''
          },
          {
            ...globalFunctional.toggleSetVolumeFunctional,
            action: 'toggleSetVolumeFunctional',
            args: ''
          },
          {
            ...globalFunctional.toggleGUIStatus,
            action: 'toggleGUIStatus',
            args: null,
            disabled: !isGlobalStorageUsable
          },
          {
            ...globalFunctional.toggleSetPlaybackRateFunctional,
            action: 'toggleSetPlaybackRateFunctional',
            args: '',
            disabled: !isGlobalStorageUsable
          },
          {
            ...globalFunctional.toggleAcousticGainFunctional,
            action: 'toggleAcousticGainFunctional',
            args: '',
            disabled: !isGlobalStorageUsable
          },
          {
            ...globalFunctional.toggleCrossOriginControlFunctional,
            action: 'toggleCrossOriginControlFunctional',
            args: '',
            disabled: !isGlobalStorageUsable
          },
          {
            ...globalFunctional.toggleExperimentFeatures,
            action: 'toggleExperimentFeatures',
            args: '',
            disabled: !isGlobalStorageUsable
          },
          {
            ...globalFunctional.toggleExternalCustomConfiguration,
            action: 'toggleExternalCustomConfiguration',
            args: '',
            disabled: !isGlobalStorageUsable
          },
          {
            ...globalFunctional.toggleDebugMode,
            action: 'toggleDebugMode',
            args: '',
            disabled: !isGlobalStorageUsable
          },
          {
            title: `${i18n.t('languageSettings')}「${i18n.t('globalSetting')}」`,
            desc: `${i18n.t('languageSettings')}「${i18n.t('globalSetting')}」`,
            disabled: !isGlobalStorageUsable,
            subMenu: [
              {
                title: i18n.t('autoChoose'),
                desc: i18n.t('autoChoose'),
                action: 'setLanguage',
                args: 'auto'
              },
              {
                title: '简体中文',
                desc: '简体中文',
                action: 'setLanguage',
                args: 'zh-CN'
              },
              {
                title: '繁體中文',
                desc: '繁體中文',
                action: 'setLanguage',
                args: 'zh-TW'
              },
              {
                title: 'English',
                desc: 'English',
                action: 'setLanguage',
                args: 'en-US'
              },
              {
                title: 'русский',
                desc: 'русский',
                action: 'setLanguage',
                args: 'ru'
              }
            ]
          }
        ]
      },
      {
        title: i18n.t('about'),
        desc: i18n.t('about'),
        subMenu: [
          {
            ...globalFunctional.openWebsite,
            action: 'openWebsite',
            args: ''
          },
          {
            ...globalFunctional.openProjectGithub,
            action: 'openProjectGithub',
            args: ''
          },
          {
            ...globalFunctional.openIssuesPage,
            action: 'openIssuesPage',
            args: ''
          },
          {
            ...globalFunctional.openAddGroupChatPage,
            action: 'openAddGroupChatPage',
            args: ''
          },
          {
            ...globalFunctional.openChangeLogPage,
            action: 'openChangeLogPage',
            args: ''
          },
          {
            ...globalFunctional.openCheckVersionPage,
            action: 'openCheckVersionPage',
            args: ''
          },
          {
            ...globalFunctional.openDonatePage,
            action: 'openDonatePage',
            args: ''
          },
          {
            ...globalFunctional.openAboutDonatePage,
            action: 'openAboutDonatePage',
            args: ''
          },
          {
            ...globalFunctional.openAuthorHomePage,
            action: 'openAuthorHomePage',
            args: ''
          }
        ]
      },
      {
        title: i18n.t('more'),
        desc: i18n.t('more'),
        disabled: true,
        subMenu: [
          {
            title: i18n.t('ffmpegScript'),
            desc: i18n.t('ffmpegScript'),
            url: 'https://u.anzz.top/ffmpegscript'
          }
        ]
      }
    ]
  }
]

/* The Menu config preprocessing function determines whether to display only the menu icon based on the specified reference dom element by judging the width of the element to save placement. */
export function menuConfigPreprocess (menuConfig, refDom) {
  const refWidth = refDom.offsetWidth
  const iconOnly = refWidth < 500

  return menuConfig.map(item => {
    if (item.dropdownMenu) {
      item.dropdownMenu = menuConfigPreprocess(item.dropdownMenu, refDom)
    }

    return {
      ...item,
      iconOnly
    }
  })
}

/* Write a function to support constructing the data of menu config.dropdown menu into the template of sl menu component */
export function convertDropdownMenuToTemplate (dropdownMenu, isRootMenu = true) {
  const menuItems = dropdownMenu.map(item => {
    if (item.disabled) return ''

    const lang = item.lang || item.language || item.languages
    if (lang && !i18n.isMatchCurLang(lang)) return ''

    const title = (item.title instanceof Function ? item.title() : item.title) || ''
    const desc = (item.desc instanceof Function ? item.desc() : item.desc) || ''
    const id = item.id || Math.random().toString(36).substr(2)

    if (item.subMenu) {
      return `
        <sl-menu-item class="h5p-menu-action" value="${id}" title="${desc || title}" data-action="${item.action || ''}" data-args='${JSON.stringify(item.args || null)}'>
          ${title}
          <sl-menu slot="submenu">
            ${convertDropdownMenuToTemplate(item.subMenu, false)}
          </sl-menu>
        </sl-menu-item>
      `
    } else if (item.divider) {
      return '<sl-divider></sl-divider>'
    } else {
      return `<sl-menu-item class="h5p-menu-action" value="${id}" title="${desc || title}" data-action="${item.action || ''}" data-args='${JSON.stringify(item.args || null)}' data-url="${item.url || ''}">
        ${title}
      </sl-menu-item>
      `
    }
  }).join('')

  return isRootMenu ? `<sl-menu>${menuItems}</sl-menu>` : menuItems
}

/* Write a function to convert menu config into template for output */
export function convertMenuConfigToTemplate (menuConfig) {
  return `
  <div class="h5p-action-mod">
      ${menuConfig.map(item => {
        if (item.disabled) return ''

        const lang = item.lang || item.language || item.languages
        if (lang && !i18n.isMatchCurLang(lang)) return ''

        const title = (item.title instanceof Function ? item.title() : item.title) || ''
        const desc = (item.desc instanceof Function ? item.desc() : item.desc) || ''
        const iconHtml = item.icon ? `<sl-icon src="${item.icon}"></sl-icon>` : ''
        const menuDesc = item.iconOnly && iconHtml ? '' : `<span class="h5p-desc">${title}</span>`

        if (item.dropdownMenu) {
          return `
            <sl-dropdown distance="6">
              <span slot="trigger" class="h5p-action-btn" title="${desc || title}" data-title="${title}" data-action="${item.action || ''}">
                ${iconHtml}
                ${menuDesc}
              </span>
              ${convertDropdownMenuToTemplate(item.dropdownMenu)}
            </sl-dropdown>
          `
        } else {
          return `
            <span class="h5p-action-btn h5p-menu-action" title="${desc || title}" data-title="${title}" data-action="${item.action || ''}" data-args='${JSON.stringify(item.args || null)}'>
              ${iconHtml}
              ${menuDesc}
            </span>
          `
        }
      }).join('')
    }
  </div>
  `
}

export function createMenuTemplate (config = menuConfig || []) {
  return convertMenuConfigToTemplate(config)
}

export function createLogoModTemplate () {
  const homepage = globalFunctional.getHomePageLink.fn()
  return `<a class="h5p-logo-mod" href="${homepage}" target="_blank">h5player</a>`
}

const defaultRecommendList = [
  {
    title: '【h5player】User Manual',
    url: 'https://u.anzz.top/h5pmanual',
    priority: 99,
  },
  {
    title: '【h5player】Audio and video merge tool, no secondary coding required',
    desc: 'Automatically merge the audio and video files downloaded by h5player into one file without secondary coding, which can be quickly merged',
    url: 'https://u.anzz.top/ffmpegscript',
  },
  {
    title: '【Hello-AI】It\'s not AI that takes away your job, but the person who knows how to use AI tools',
    url: 'https://u.anzz.top/ai',
  }
]

export function createRecommendModTemplate (refDom) {
  const refWidth = refDom.offsetWidth
  if (refWidth < 500) { return '' }

  let recommendList = configManager.getGlobalStorage('recommendList') || defaultRecommendList
  recommendList = recommendList.filter(item => !item.disabled)

  const curLang = i18n.language() || ''
  /* Compatible with various possible language configuration writing methods */
  const curLang2 = curLang.replace('-', '')
  const curLang3 = curLang.replace('-', '_')
  const curLang4 = curLang.split('-')[0]

  /* Filter out the recommended list that matches the current language based on the current language and the languages ​​configuration of the recommended list. */
  recommendList = recommendList.filter(item => {
    const lang = item.lang || item.language || item.languages
    if (lang) {
      return i18n.isMatchCurLang(lang)
    } else {
      return true
    }
  })

  if (!recommendList.length) { return '' }

  /* Randomly select 5 pieces of data from the recommended list, and the excess will not be displayed. */
  if (recommendList.length > 5) { recommendList = recommendList.sort(() => Math.random() - 0.5).slice(0, 5) }

  /* Sort according to the priority field in the recommendation list. The larger the priority value, the higher it is. */
  recommendList = recommendList.sort((a, b) => (b.priority || 0) - (a.priority || 0))

  const recommendHtml = recommendList.map(item => {
    let title = item.title || ''
    let desc = item.desc || ''
    let url = item.url || ''

    if (item.i18n) {
      const i18nInfo = item.i18n[`${curLang}`] || item.i18n[`${curLang2}`] || item.i18n[`${curLang3}`] || item.i18n[`${curLang4}`]
      if (i18nInfo) {
        title = i18nInfo.title || title
        desc = i18nInfo.desc || desc
        url = i18nInfo.url || url
      }
    }

    return `<a class="h5p-recommend-item" href="${url}" title="${desc}" target="_blank">${title}</a>`
  }).join('')

  return `<div class="h5p-recommend-mod" >${recommendHtml}</div>`
}

/**
 * Register Recommend switching logic, detect which h5p-recommend-item currently has h5p-recommend-item__active every 4 seconds, and then switch h5p-recommend-item__active to the next element, and so on.
 * Stop switching when the mouse moves to recommendedWrap, and continue switching after moving away.
 */
export function registerRecommendModToggle (recommendWrap, reRender) {
  if (!reRender && (!recommendWrap || recommendWrap.__h5pRecommendModRegistered__)) { return }

  let recommendIndex = 0
  recommendWrap.__stopToggle__ = false

  const toggleRecommend = () => {
    if (recommendWrap.__stopToggle__) { return }
    const recommendItems = recommendWrap.querySelectorAll('.h5p-recommend-item')
    recommendItems.forEach((item, index) => {
      if (index === recommendIndex) {
        item.classList.add('h5p-recommend-item__active')
      } else {
        item.classList.remove('h5p-recommend-item__active')
      }
    })

    recommendIndex = (recommendIndex + 1) % recommendItems.length
  }

  toggleRecommend()

  clearInterval(recommendWrap.__h5pRecommendModInterval__)
  recommendWrap.__h5pRecommendModInterval__ = setInterval(toggleRecommend, 3000)
  if (!reRender) {
    recommendWrap.addEventListener('mouseenter', () => { recommendWrap.__stopToggle__ = true })
    recommendWrap.addEventListener('mouseleave', () => { recommendWrap.__stopToggle__ = false })
  }

  recommendWrap.__h5pRecommendModRegistered__ = true
}

/**
 * Handle menu click events through event delegation to reduce event binding and improve performance
 * @param { Event } event -required event object
 */
export function menuActionHandler (obj) {
  const { event, h5Player, h5playerUI, videoElement, popup, actionCallback } = obj
  const target = event.target

  /* Find whether the data action attribute is included according to the target. Note that you may need to use closest to search upwards.*/
  const actionDOM = target.closest('.h5p-menu-action')
  if (!actionDOM) {
    debug.log('[menuActionHandler]', '未找到actionDOM', event.target)
    return
  }

  const action = actionDOM.getAttribute('data-action')
  const args = JSON.parse(actionDOM.getAttribute('data-args') || null)
  const url = actionDOM.getAttribute('data-url')

  if (url) {
    globalFunctional.openInTab(url)
    return
  }

  h5Player.setPlayerInstance(videoElement)

  if (action === 'disableGUITemporarily') {
    h5playerUI.disableGUITemporarily()
    debug.log('[menuActionHandler][disableGUITemporarily]')
    return
  }

  if (action && (h5Player[action] instanceof Function || globalFunctional[action])) {
    // debug.log('[menuActionHandler]', actionDOM, action, args)

    try {
      if (action === 'setPlaybackRate') {
        /* 使用UI操作需强行跳过锁检测逻辑 */
        h5Player.setPlaybackRate(args, false, false, true)
      } else if (globalFunctional[action] && globalFunctional[action].fn instanceof Function) {
        globalFunctional[action].fn(args)
      } else {
        h5Player[action](args)
        popup && popup.reposition()
      }
    } catch (e) {
      debug.error('[menuActionHandler][error]', e)
    }

    if (actionCallback instanceof Function) {
      actionCallback(action, args)
    }
  }
}
