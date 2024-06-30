// https://shoelace.style/getting-started/installation#bundling
import shoelaceCss from './shoelace/themes/light.css'
// import '@shoelace-style/shoelace/dist/components/button/button.js'
// import '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import '@shoelace-style/shoelace/dist/components/popup/popup.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/menu-label/menu-label.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/divider/divider.js'
import { createMenuTemplate, createLogoModTemplate, createRecommendModTemplate, registerRecommendModToggle, menuConfig, menuConfigPreprocess, menuActionHandler } from './js/menu.js'

if (!window.h5playerUIProvider) {
  throw new Error('h5playerUIProvider is not defined, please check if you have imported h5playerUIProvider.js')
}

const { debug, parseHTML, observeVisibility, isOutOfDocument, configManager, device } = window.h5playerUIProvider

const popupWrapObjs = {}

function removePopupWrapById (popupWrapId) {
  const popupWrap = document.querySelector(`#${popupWrapId}`)
  if (popupWrap) {
    popupWrap.remove()
  }

  delete popupWrapObjs[popupWrapId]
}

function removePopupWrapByElement (element) {
  if (!element) { return false }
  const popupWrapId = element.getAttribute('data-popup-wrap-id')
  if (popupWrapId) { removePopupWrapById(popupWrapId) }
}

/* Traverse popupWrapObjs, if the offsetParent of the element element in popupWrapObjs is null, remove it */
function cleanPopupWrap () {
  const popupWrapIds = Object.keys(popupWrapObjs)
  popupWrapIds.forEach(popupWrapId => {
    const element = popupWrapObjs[popupWrapId]
    if (isOutOfDocument(element)) {
      removePopupWrapById(popupWrapId)
    }
  })
}

function getAllPopupWrapElement () {
  return document.querySelectorAll('.h5player-popup-wrap')
}

function findPopupWrapWithElement (videoElement) {
  const result = []
  const popupWrapIds = Object.keys(popupWrapObjs)
  popupWrapIds.forEach(popupWrapId => {
    const element = popupWrapObjs[popupWrapId]
    if (element === videoElement) {
      result.push(popupWrapId)
    }
  })

  return result.map(id => document.querySelector(`#${id}`))
}

const h5playerUI = {
  async init () {
    debug.log('h5playerUI init')

    /* Insert component-related styles */
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, shoelaceCss]
  },

  disableGUITemporarily () {
    this.__disableGUITemporarily__ = true
    const popupWrapIds = Object.keys(popupWrapObjs)
    popupWrapIds.forEach(popupWrapId => {
      removePopupWrapById(popupWrapId)
    })
  },

  getAllPopupWrapElement,
  findPopupWrapWithElement,
  cleanPopupWrap,
  removePopupWrapById,
  removePopupWrapByElement,

  popup (element, h5Player) {
    if (this.__disableGUITemporarily__ || element.__disableGUITemporarily__) { return false }

    /* If the aspect ratio of the element element is greater than 2.5, it may be a video background, and the popup will not be displayed */
    if (element.videoWidth / element.videoHeight > 2.5) { return false }

    /* Prevent pop-ups from being rendered too frequently */
    if (this.lastRenderedPopupTime && Date.now() - this.lastRenderedPopupTime < 100) {
      return false
    } else {
      this.lastRenderedPopupTime = Date.now()
    }

    /* Prevent pop-up infinite loop rendering */
    if (element.__popupRenderedCount__ && element.__popupRenderedCount__ > 15) {
      return false
    } else {
      element.__popupRenderedCount__ = element.__popupRenderedCount__ ? element.__popupRenderedCount__ + 1 : 1
    }

    if (!element || !element.tagName || element.tagName.toLowerCase() !== 'video' || isOutOfDocument(element)) {
      return false
    }

    let popupWrapId = element.getAttribute('data-popup-wrap-id')
    if (!popupWrapId) {
      popupWrapId = 'h5player-popup-wrap-' + Math.random().toString(36).substr(2)
      element.setAttribute('data-popup-wrap-id', popupWrapId)
    }

    let popupWrap = document.querySelector(`#${popupWrapId}`)

    if (!popupWrapObjs[popupWrapId]) {
      popupWrapObjs[popupWrapId] = element
    }

    if (popupWrap) {
      const popup = popupWrap.querySelector('sl-popup')
      popup && popup.reposition()
      return
    }

    const menuTemplate = createMenuTemplate(menuConfigPreprocess(menuConfig, element))
    popupWrap = parseHTML(`
      <div id="${popupWrapId}" class="h5player-popup-wrap">
        <sl-popup placement="top" sync="width">
        <div class="h5player-popup-content">
          <div class="h5p-logo-wrap">
            ${createLogoModTemplate()}
          </div>
          <div class="h5p-recommend-wrap">
            <div style="overflow:hidden">${createRecommendModTemplate(element)}</div>
          </div>
          <div class="h5p-menu-wrap">
            ${menuTemplate}
          </div>
        </div>
        </sl-popup>
      </div>
    `, document.body)[0]

    setTimeout(() => { registerRecommendModToggle(popupWrap.querySelector('.h5p-recommend-wrap')) }, 100)

    const popup = popupWrap.querySelector('sl-popup')

    /**
     * Determine whether the popup initialization is abnormal. Custom elements es5 adapter.js is used on the oil pipe, which will cause the popup to be abnormal, so this judgment is made.
     * For example：https://www.youtube.com/watch?v=jsb-5H_hy0M
     * For example：https://www.youtube.com/watch?v=-2xb7rGCi2k
     */
    function checkPopupUpdateComplete () {
      if (!popup || !popup.updateComplete || !popup.updateComplete.then) {
        // debug.error('[h5playerUI][popup][updateComplete], Component initialization exception', popup, element)
        element.removeAttribute('data-popup-wrap-id')
        popupWrap.remove()
        delete popupWrapObjs[popupWrapId]
        return false
      }

      return true
    }

    /* Make sure the popup has been rendered */
    customElements.whenDefined('sl-popup').then(() => {
      if (!checkPopupUpdateComplete()) {
        return false
      }

      popup.updateComplete.then(() => {
        popup.anchor = element
        popup.distance = -48
        popup.active = true
        setTimeout(() => { popup.reposition() }, 600)
      })
    })

    /* Re-render the menu corresponding to the h5p action mod to update the menu status */
    function reRenderMenuMod () {
      const menuWrap = popupWrap.querySelector('.h5player-popup-content .h5p-menu-wrap')
      const actionMod = popupWrap.querySelector('.h5p-action-mod')
      if (menuWrap && actionMod) {
        menuWrap.removeChild(actionMod)

        const newMenuTemplate = createMenuTemplate(menuConfigPreprocess(menuConfig, element))
        parseHTML(newMenuTemplate, menuWrap)

        /* When the icon loading fails, remove the icon element */
        const slIcons = popupWrap.querySelectorAll('sl-icon')
        slIcons && slIcons.forEach(slIcon => {
          slIcon.addEventListener('sl-error', (event) => {
            const parent = event.target.parentElement
            event.target.remove()

            /* Show only text title instead */
            if (parent.getAttribute('data-title')) {
              parent.innerText = parent.getAttribute('data-title')
            }
          }, { once: true })
        })

        // debug.log('[h5playerUI][popup][reRenderMenuMod]')
      }
    }

    /* The first rendering of YouTube will cause inexplicable errors, so here we will delay the rendering for a while and re-render the menu again.*/
    setTimeout(() => { reRenderMenuMod() }, 400)

    /* Re-render the recommended module corresponding to the h5p recommend mod. If the location is not enough, the module will be hidden. */
    function reRenderRecommendMod () {
      const recommendWrap = popupWrap.querySelector('.h5player-popup-content .h5p-recommend-wrap')
      const recommendMod = popupWrap.querySelector('.h5player-popup-content .h5p-recommend-wrap>div')
      if (recommendWrap && recommendMod) {
        recommendWrap.removeChild(recommendMod)

        const newRecommendModTemplate = `<div style="overflow:hidden">${createRecommendModTemplate(element)}</div>`
        parseHTML(newRecommendModTemplate, recommendWrap)

        registerRecommendModToggle(recommendWrap, true)
        // debug.log('[h5playerUI][popup][reRenderRecommendMod]')
      }
    }

    const activeClass = 'h5player-popup-active'
    const fullActiveClass = 'h5player-popup-full-active'
    const alwaysShowUIBar = configManager.getGlobalStorage('ui.alwaysShow')

    /**
     *Add the style class of fullActiveClass when the mouse moves to the popupWrap, and then remove the style class of fullActiveClass after moving the mouse for a period of time.
     *Used to prevent the popupWrap from being quickly hidden when the mouse moves over the popupWrap to prompt the operating experience
     */
    let mouseleaveTimer = null
    popupWrap.addEventListener('mouseenter', () => {
      /* The element ratio is abnormal and the popup is not displayed */
      if (element.videoWidth / element.videoHeight > 2.5) {
        element.__disableGUITemporarily__ = true
        removePopupWrapByElement(element)
        return false
      }

      clearTimeout(mouseleaveTimer)
      if (isOutOfDocument(element)) {
        popupWrap.classList.remove(fullActiveClass)
      } else {
        popupWrap.classList.add(fullActiveClass)
      }
      popup.reposition()
    })
    popupWrap.addEventListener('mouseleave', () => {
      clearTimeout(mouseleaveTimer)

      if (isOutOfDocument(element)) {
        popupWrap.classList.remove(fullActiveClass)
      } else {
        mouseleaveTimer = setTimeout(() => {
          !alwaysShowUIBar && !element.paused && popupWrap.classList.remove(activeClass)
          !alwaysShowUIBar && !element.paused && popupWrap.classList.remove(fullActiveClass)

          /* Close all sl-dropdown in popupWrap */
          const dropdowns = popupWrap.querySelectorAll('sl-dropdown')
          dropdowns.forEach(dropdown => {
            dropdown._open_ = false
            dropdown.open = false
          })

          reRenderMenuMod()
        }, 500)
      }
    })

    // let lastOpenDropdownTime = Date.now()
    async function openDropdown (event) {
      // if (Date.now() - lastOpenDropdownTime < 100) { return false }
      // lastOpenDropdownTime = Date.now()

      const target = event.target

      const actionBtnClass = 'h5p-action-btn'
      if (!(target.classList.contains(actionBtnClass) || target.parentElement.classList.contains(actionBtnClass))) {
        return false
      }

      const dropdowns = popupWrap.querySelectorAll('sl-dropdown')
      const curDropdown = target.parentElement.tagName.toLowerCase() === 'sl-dropdown' ? target.parentElement : target.parentElement.parentElement
      const isDropdownDom = curDropdown && curDropdown.tagName.toLowerCase() === 'sl-dropdown'

      if (!isDropdownDom) {
        dropdowns.forEach(dropdown => {
          dropdown.open = false
          dropdown._open_ = false
        })
        return false
      }

      dropdowns.forEach(async (dropdown) => {
        if (dropdown !== curDropdown) {
          dropdown._open_ = false
          await dropdown.hide()
        }
      })

      if (event.type === 'mousemove') {
        curDropdown._open_ = true
        await curDropdown.show()
        return false
      }

      if (!curDropdown._open_) {
        await curDropdown.show()
        curDropdown._open_ = true

        curDropdown.addEventListener('sl-after-hide', () => {
          curDropdown._open_ = false
        }, { once: true })
      } else {
        await curDropdown.hide()
        curDropdown._open_ = false

        curDropdown.addEventListener('sl-after-show', () => {
          curDropdown._open_ = true
        }, { once: true })
      }
    }

    /* If mousemove is registered on the mobile terminal, click will not be triggered, or events will interfere with each other, and sl-dropdown will not be evoked */
    if (!device.isMobile()) {
      /* When the mouse moves on the popupWrap, if isOutOfDocument(element) is detected, the fullActiveClass style class will also be removed. Note that debounce must be added */
      let lastCheckIsOutOfDocumentTime = Date.now()
      popupWrap.addEventListener('mousemove', (event) => {
        const now = Date.now()
        if (now - lastCheckIsOutOfDocumentTime > 100) {
          lastCheckIsOutOfDocumentTime = now
          if (isOutOfDocument(element)) {
            clearTimeout(mouseleaveTimer)
            popupWrap.classList.remove(fullActiveClass)
          } else {
            popup.reposition()
          }
        }

        openDropdown(event)
      })
    }

    popupWrap.addEventListener('click', (event) => {
      openDropdown(event)
      menuActionHandler({
        event,
        videoElement: element,
        h5Player,
        h5playerUI: this,
        popup,
        actionCallback: (action, args) => {
          reRenderMenuMod()
        }
      })
    })

    observeVisibility((entry, observer) => {
      let activeStatus = false
      if (entry) {
        if (!isOutOfDocument(element)) {
          activeStatus = true
        }

        if (element && element.paused && !isOutOfDocument(element)) {
          if (element.currentTime && element.currentTime > 1.5) {
            popupWrap.classList.add(activeClass)
          }
        } else {
          if (alwaysShowUIBar) {
            popupWrap.classList.add(activeClass)
            popupWrap.classList.add(fullActiveClass)
          } else {
            popupWrap.classList.remove(activeClass)
            popupWrap.classList.remove(fullActiveClass)
          }
        }
      } else {
        activeStatus = false
        popupWrap.classList.remove(activeClass)
        popupWrap.classList.remove(fullActiveClass)
      }

      if (!checkPopupUpdateComplete()) { return false }

      popup.updateComplete.then(() => {
        popup.active = activeStatus
        popup.reposition()
      })
    }, element)

    popup.oldRect = element.getBoundingClientRect()
    popup.addEventListener('sl-reposition', () => {
      if (isOutOfDocument(element)) {
        popup.active = false
        popupWrap.classList.remove(activeClass)
        popupWrap.classList.remove(fullActiveClass)
      } else {
        const newRect = element.getBoundingClientRect()
        if (newRect.width !== popup.oldRect.width) {
          popup.oldRect = newRect
          reRenderMenuMod()
          reRenderRecommendMod()
        }
      }
    })

    /* When the element switches the playback state, if it is in the playback state, the popup will be hidden, otherwise the popup will be displayed */
    element.addEventListener('play', () => {
      if (alwaysShowUIBar) {
        popupWrap.classList.add(activeClass)
        popupWrap.classList.add(fullActiveClass)
      } else {
        popupWrap.classList.remove(activeClass)
        popupWrap.classList.remove(fullActiveClass)
      }

      if (isOutOfDocument(element)) {
        popup.active = false
      } else {
        popup.active = true
      }
      popup.reposition()
      cleanPopupWrap()

      reRenderMenuMod()
    })

    element.addEventListener('pause', () => {
      reRenderMenuMod()

      if (alwaysShowUIBar) {
        popupWrap.classList.add(activeClass)
        popupWrap.classList.add(fullActiveClass)
      } else {
        if (element.currentTime && element.currentTime > 1.5) {
          popupWrap.classList.add(activeClass)
        }
      }

      if (isOutOfDocument(element)) {
        popup.active = false
        popupWrap.classList.remove(activeClass)
        popupWrap.classList.remove(fullActiveClass)
      } else {
        popup.active = true
      }

      popup.reposition()
      cleanPopupWrap()
    })

    /* When the playback progress of element changes, execute popup.reposition() */
    let lastTimeupdateTime = Date.now()
    element.addEventListener('timeupdate', () => {
      const now = Date.now()
      if (!isOutOfDocument(element) && now - lastTimeupdateTime > 400) {
        lastTimeupdateTime = now
        popup.reposition()
      }
    })

   /*Try to clear invalid elements in popupWrapObjs */
    cleanPopupWrap()

    // debug.log('[h5playerUI][popup]', popup, popupWrap, element)
  }
}

export default h5playerUI
