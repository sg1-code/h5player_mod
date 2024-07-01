
      // Older browsers don't support a `document` as the root and will throw an
      // error.
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          // Handle <iframe>s
          root: root.ownerDocument
        });
      } catch (e) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }

  /**
   * Automatically updates the position of the floating element when necessary.
   * Should only be called when the floating element is mounted on the DOM or
   * visible on the screen.
   * @returns cleanup function that should be invoked when the floating element is
   * removed from the DOM or hidden from the screen.
   * @see https://floating-ui.com/docs/autoUpdate
   */
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === 'function',
      layoutShift = typeof IntersectionObserver === 'function',
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.addEventListener('scroll', update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener('resize', update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver(_ref => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          // Prevent update loops when using the `size` middleware.
          // https://github.com/floating-ui/floating-ui/issues/1740
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            resizeObserver && resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      ancestors.forEach(ancestor => {
        ancestorScroll && ancestor.removeEventListener('scroll', update);
        ancestorResize && ancestor.removeEventListener('resize', update);
      });
      cleanupIo && cleanupIo();
      resizeObserver && resizeObserver.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }

  /**
   * Optimizes the visibility of the floating element by shifting it in order to
   * keep it in view when it will overflow the clipping boundary.
   * @see https://floating-ui.com/docs/shift
   */
  const shift = shift$1;

  /**
   * Optimizes the visibility of the floating element by flipping the `placement`
   * in order to keep it in view when the preferred placement(s) will overflow the
   * clipping boundary. Alternative to `autoPlacement`.
   * @see https://floating-ui.com/docs/flip
   */
  const flip = flip$1;

  /**
   * Provides data that allows you to change the size of the floating element —
   * for instance, prevent it from overflowing the clipping boundary or match the
   * width of the reference element.
   * @see https://floating-ui.com/docs/size
   */
  const size = size$1;

  /**
   * Provides data to position an inner element of the floating element so that it
   * appears centered to the reference element.
   * @see https://floating-ui.com/docs/arrow
   */
  const arrow = arrow$1;

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a given reference element.
   */
  const computePosition = (reference, floating, options) => {
    // This caches the expensive `getClippingElementAncestors` function so that
    // multiple lifecycle resets re-use the same result. It only lives for a
    // single call. If other functions become expensive, we can add them as well.
    const cache = new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition$1(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };

  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e$3=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

  /**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const e$2=e$3(class extends i{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"class"!==t$1.name||t$1.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return " "+Object.keys(t).filter((s=>t[s])).join(" ")+" "}update(s,[i]){if(void 0===this.it){this.it=new Set,void 0!==s.strings&&(this.st=new Set(s.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in i)i[t]&&!this.st?.has(t)&&this.it.add(t);return this.render(i)}const r=s.element.classList;for(const t of this.it)t in i||(r.remove(t),this.it.delete(t));for(const t in i){const s=!!i[t];s===this.it.has(t)||this.st?.has(t)||(s?(r.add(t),this.it.add(t)):(r.remove(t),this.it.delete(t)));}return w}});

  /* eslint-disable @typescript-eslint/ban-types */
  function offsetParent(element) {
      return offsetParentPolyfill(element);
  }
  function flatTreeParent(element) {
      if (element.assignedSlot) {
          return element.assignedSlot;
      }
      if (element.parentNode instanceof ShadowRoot) {
          return element.parentNode.host;
      }
      return element.parentNode;
  }
  function offsetParentPolyfill(element) {
      // Do an initial walk to check for display:none ancestors.
      for (let ancestor = element; ancestor; ancestor = flatTreeParent(ancestor)) {
          if (!(ancestor instanceof Element)) {
              continue;
          }
          if (getComputedStyle(ancestor).display === 'none') {
              return null;
          }
      }
      for (let ancestor = flatTreeParent(element); ancestor; ancestor = flatTreeParent(ancestor)) {
          if (!(ancestor instanceof Element)) {
              continue;
          }
          const style = getComputedStyle(ancestor);
          // Display:contents nodes aren't in the layout tree so they should be skipped.
          if (style.display === 'contents') {
              continue;
          }
          if (style.position !== 'static' || style.filter !== 'none') {
              return ancestor;
          }
          if (ancestor.tagName === 'BODY') {
              return ancestor;
          }
      }
      return null;
  }

  function isVirtualElement(e) {
    return e !== null && typeof e === "object" && "getBoundingClientRect" in e;
  }
  var SlPopup = class extends ShoelaceElement {
    constructor() {
      super(...arguments);
      this.active = false;
      this.placement = "top";
      this.strategy = "absolute";
      this.distance = 0;
      this.skidding = 0;
      this.arrow = false;
      this.arrowPlacement = "anchor";
      this.arrowPadding = 10;
      this.flip = false;
      this.flipFallbackPlacements = "";
      this.flipFallbackStrategy = "best-fit";
      this.flipPadding = 0;
      this.shift = false;
      this.shiftPadding = 0;
      this.autoSizePadding = 0;
    }
    async connectedCallback() {
      super.connectedCallback();
      await this.updateComplete;
      this.start();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.stop();
    }
    async updated(changedProps) {
      super.updated(changedProps);
      if (changedProps.has("active")) {
        if (this.active) {
          this.start();
        } else {
          this.stop();
        }
      }
      if (changedProps.has("anchor")) {
        this.handleAnchorChange();
      }
      if (this.active) {
        await this.updateComplete;
        this.reposition();
      }
    }
    async handleAnchorChange() {
      await this.stop();
      if (this.anchor && typeof this.anchor === "string") {
        const root = this.getRootNode();
        this.anchorEl = root.getElementById(this.anchor);
      } else if (this.anchor instanceof Element || isVirtualElement(this.anchor)) {
        this.anchorEl = this.anchor;
      } else {
        this.anchorEl = this.querySelector('[slot="anchor"]');
      }
      if (this.anchorEl instanceof HTMLSlotElement) {
        this.anchorEl = this.anchorEl.assignedElements({ flatten: true })[0];
      }
      if (this.anchorEl) {
        this.start();
      }
    }
    start() {
      if (!this.anchorEl) {
        return;
      }
      this.cleanup = autoUpdate(this.anchorEl, this.popup, () => {
        this.reposition();
      });
    }
    async stop() {
      return new Promise((resolve) => {
        if (this.cleanup) {
          this.cleanup();
          this.cleanup = void 0;
          this.removeAttribute("data-current-placement");
          this.style.removeProperty("--auto-size-available-width");
          this.style.removeProperty("--auto-size-available-height");
          requestAnimationFrame(() => resolve());
        } else {
          resolve();
        }
      });
    }
    /** Forces the popup to recalculate and reposition itself. */
    reposition() {
      if (!this.active || !this.anchorEl) {
        return;
      }
      const middleware = [
        // The offset middleware goes first
        offset({ mainAxis: this.distance, crossAxis: this.skidding })
      ];
      if (this.sync) {
        middleware.push(
          size({
            apply: ({ rects }) => {
              const syncWidth = this.sync === "width" || this.sync === "both";
              const syncHeight = this.sync === "height" || this.sync === "both";
              this.popup.style.width = syncWidth ? `${rects.reference.width}px` : "";
              this.popup.style.height = syncHeight ? `${rects.reference.height}px` : "";
            }
          })
        );
      } else {
        this.popup.style.width = "";
        this.popup.style.height = "";
      }
      if (this.flip) {
        middleware.push(
          flip({
            boundary: this.flipBoundary,
            // @ts-expect-error - We're converting a string attribute to an array here
            fallbackPlacements: this.flipFallbackPlacements,
            fallbackStrategy: this.flipFallbackStrategy === "best-fit" ? "bestFit" : "initialPlacement",
            padding: this.flipPadding
          })
        );
      }
      if (this.shift) {
        middleware.push(
          shift({
            boundary: this.shiftBoundary,
            padding: this.shiftPadding
          })
        );
      }
      if (this.autoSize) {
        middleware.push(
          size({
            boundary: this.autoSizeBoundary,
            padding: this.autoSizePadding,
            apply: ({ availableWidth, availableHeight }) => {
              if (this.autoSize === "vertical" || this.autoSize === "both") {
                this.style.setProperty("--auto-size-available-height", `${availableHeight}px`);
              } else {
                this.style.removeProperty("--auto-size-available-height");
              }
              if (this.autoSize === "horizontal" || this.autoSize === "both") {
                this.style.setProperty("--auto-size-available-width", `${availableWidth}px`);
              } else {
                this.style.removeProperty("--auto-size-available-width");
              }
            }
          })
        );
      } else {
        this.style.removeProperty("--auto-size-available-width");
        this.style.removeProperty("--auto-size-available-height");
      }
      if (this.arrow) {
        middleware.push(
          arrow({
            element: this.arrowEl,
            padding: this.arrowPadding
          })
        );
      }
      const getOffsetParent = this.strategy === "absolute" ? (element) => platform.getOffsetParent(element, offsetParent) : platform.getOffsetParent;
      computePosition(this.anchorEl, this.popup, {
        placement: this.placement,
        middleware,
        strategy: this.strategy,
        platform: __spreadProps(__spreadValues({}, platform), {
          getOffsetParent
        })
      }).then(({ x, y, middlewareData, placement }) => {
        const isRtl = getComputedStyle(this).direction === "rtl";
        const staticSide = { top: "bottom", right: "left", bottom: "top", left: "right" }[placement.split("-")[0]];
        this.setAttribute("data-current-placement", placement);
        Object.assign(this.popup.style, {
          left: `${x}px`,
          top: `${y}px`
        });
        if (this.arrow) {
          const arrowX = middlewareData.arrow.x;
          const arrowY = middlewareData.arrow.y;
          let top = "";
          let right = "";
          let bottom = "";
          let left = "";
          if (this.arrowPlacement === "start") {
            const value = typeof arrowX === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
            top = typeof arrowY === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
            right = isRtl ? value : "";
            left = isRtl ? "" : value;
          } else if (this.arrowPlacement === "end") {
            const value = typeof arrowX === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
            right = isRtl ? "" : value;
            left = isRtl ? value : "";
            bottom = typeof arrowY === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
          } else if (this.arrowPlacement === "center") {
            left = typeof arrowX === "number" ? `calc(50% - var(--arrow-size-diagonal))` : "";
            top = typeof arrowY === "number" ? `calc(50% - var(--arrow-size-diagonal))` : "";
          } else {
            left = typeof arrowX === "number" ? `${arrowX}px` : "";
            top = typeof arrowY === "number" ? `${arrowY}px` : "";
          }
          Object.assign(this.arrowEl.style, {
            top,
            right,
            bottom,
            left,
            [staticSide]: "calc(var(--arrow-size-diagonal) * -1)"
          });
        }
      });
      this.emit("sl-reposition");
    }
    render() {
      return x`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <div
        part="popup"
        class=${e$2({
      popup: true,
      "popup--active": this.active,
      "popup--fixed": this.strategy === "fixed",
      "popup--has-arrow": this.arrow
    })}
      >
        <slot></slot>
        ${this.arrow ? x`<div part="arrow" class="popup__arrow" role="presentation"></div>` : ""}
      </div>
    `;
    }
  };
  SlPopup.styles = popup_styles_default;
  __decorateClass([
    e$4(".popup")
  ], SlPopup.prototype, "popup", 2);
  __decorateClass([
    e$4(".popup__arrow")
  ], SlPopup.prototype, "arrowEl", 2);
  __decorateClass([
    n$2()
  ], SlPopup.prototype, "anchor", 2);
  __decorateClass([
    n$2({ type: Boolean, reflect: true })
  ], SlPopup.prototype, "active", 2);
  __decorateClass([
    n$2({ reflect: true })
  ], SlPopup.prototype, "placement", 2);
  __decorateClass([
    n$2({ reflect: true })
  ], SlPopup.prototype, "strategy", 2);
  __decorateClass([
    n$2({ type: Number })
  ], SlPopup.prototype, "distance", 2);
  __decorateClass([
    n$2({ type: Number })
  ], SlPopup.prototype, "skidding", 2);
  __decorateClass([
    n$2({ type: Boolean })
  ], SlPopup.prototype, "arrow", 2);
  __decorateClass([
    n$2({ attribute: "arrow-placement" })
  ], SlPopup.prototype, "arrowPlacement", 2);
  __decorateClass([
    n$2({ attribute: "arrow-padding", type: Number })
  ], SlPopup.prototype, "arrowPadding", 2);
  __decorateClass([
    n$2({ type: Boolean })
  ], SlPopup.prototype, "flip", 2);
  __decorateClass([
    n$2({
      attribute: "flip-fallback-placements",
      converter: {
        fromAttribute: (value) => {
          return value.split(" ").map((p) => p.trim()).filter((p) => p !== "");
        },
        toAttribute: (value) => {
          return value.join(" ");
        }
      }
    })
  ], SlPopup.prototype, "flipFallbackPlacements", 2);
  __decorateClass([
    n$2({ attribute: "flip-fallback-strategy" })
  ], SlPopup.prototype, "flipFallbackStrategy", 2);
  __decorateClass([
    n$2({ type: Object })
  ], SlPopup.prototype, "flipBoundary", 2);
  __decorateClass([
    n$2({ attribute: "flip-padding", type: Number })
  ], SlPopup.prototype, "flipPadding", 2);
  __decorateClass([
    n$2({ type: Boolean })
  ], SlPopup.prototype, "shift", 2);
  __decorateClass([
    n$2({ type: Object })
  ], SlPopup.prototype, "shiftBoundary", 2);
  __decorateClass([
    n$2({ attribute: "shift-padding", type: Number })
  ], SlPopup.prototype, "shiftPadding", 2);
  __decorateClass([
    n$2({ attribute: "auto-size" })
  ], SlPopup.prototype, "autoSize", 2);
  __decorateClass([
    n$2()
  ], SlPopup.prototype, "sync", 2);
  __decorateClass([
    n$2({ type: Object })
  ], SlPopup.prototype, "autoSizeBoundary", 2);
  __decorateClass([
    n$2({ attribute: "auto-size-padding", type: Number })
  ], SlPopup.prototype, "autoSizePadding", 2);

  SlPopup.define("sl-popup");

  var dropdown_styles_default = i$3`
  ${component_styles_default}

  :host {
    display: inline-block;
  }

  .dropdown::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .dropdown[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .dropdown[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .dropdown[data-current-placement^='left']::part(popup) {
    transform-origin: right;
  }

  .dropdown[data-current-placement^='right']::part(popup) {
    transform-origin: left;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__panel {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    border-radius: var(--sl-border-radius-medium);
    pointer-events: none;
  }

  .dropdown--open .dropdown__panel {
    display: block;
    pointer-events: all;
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;

  // src/internal/tabbable.ts
  function isTakingUpSpace(elem) {
    return Boolean(elem.offsetParent || elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  }
  function isTabbable(el) {
    const tag = el.tagName.toLowerCase();
    if (el.getAttribute("tabindex") === "-1") {
      return false;
    }
    if (el.hasAttribute("disabled")) {
      return false;
    }
    if (tag === "input" && el.getAttribute("type") === "radio" && !el.hasAttribute("checked")) {
      return false;
    }
    if (!isTakingUpSpace(el)) {
      return false;
    }
    if (window.getComputedStyle(el).visibility === "hidden") {
      return false;
    }
    if ((tag === "audio" || tag === "video") && el.hasAttribute("controls")) {
      return true;
    }
    if (el.hasAttribute("tabindex")) {
      return true;
    }
    if (el.hasAttribute("contenteditable") && el.getAttribute("contenteditable") !== "false") {
      return true;
    }
    return ["button", "input", "select", "textarea", "a", "audio", "video", "summary"].includes(tag);
  }
  function getTabbableBoundary(root) {
    var _a, _b;
    const tabbableElements = getTabbableElements(root);
    const start = (_a = tabbableElements[0]) != null ? _a : null;
    const end = (_b = tabbableElements[tabbableElements.length - 1]) != null ? _b : null;
    return { start, end };
  }
  function getTabbableElements(root) {
    const tabbableElements = [];
    function walk(el) {
      if (el instanceof Element) {
        if (el.hasAttribute("inert")) {
          return;
        }
        if (!tabbableElements.includes(el) && isTabbable(el)) {
          tabbableElements.push(el);
        }
        const slotChildrenOutsideRootElement = (slotElement) => {
          var _a;
          return ((_a = slotElement.getRootNode({ composed: true })) == null ? void 0 : _a.host) !== root;
        };
        if (el instanceof HTMLSlotElement && slotChildrenOutsideRootElement(el)) {
          el.assignedElements({ flatten: true }).forEach((assignedEl) => {
            walk(assignedEl);
          });
        }
        if (el.shadowRoot !== null && el.shadowRoot.mode === "open") {
          walk(el.shadowRoot);
        }
      }
      [...el.children].forEach((e) => walk(e));
    }
    walk(root);
    return tabbableElements.sort((a, b) => {
      const aTabindex = Number(a.getAttribute("tabindex")) || 0;
      const bTabindex = Number(b.getAttribute("tabindex")) || 0;
      return bTabindex - aTabindex;
    });
  }

  // src/utilities/animation-registry.ts
  var defaultAnimationRegistry = /* @__PURE__ */ new Map();
  var customAnimationRegistry = /* @__PURE__ */ new WeakMap();
  function ensureAnimation(animation) {
    return animation != null ? animation : { keyframes: [], options: { duration: 0 } };
  }
  function getLogicalAnimation(animation, dir) {
    if (dir.toLowerCase() === "rtl") {
      return {
        keyframes: animation.rtlKeyframes || animation.keyframes,
        options: animation.options
      };
    }
    return animation;
  }
  function setDefaultAnimation(animationName, animation) {
    defaultAnimationRegistry.set(animationName, ensureAnimation(animation));
  }
  function getAnimation(el, animationName, options) {
    const customAnimation = customAnimationRegistry.get(el);
    if (customAnimation == null ? void 0 : customAnimation[animationName]) {
      return getLogicalAnimation(customAnimation[animationName], options.dir);
    }
    const defaultAnimation = defaultAnimationRegistry.get(animationName);
    if (defaultAnimation) {
      return getLogicalAnimation(defaultAnimation, options.dir);
    }
    return {
      keyframes: [],
      options: { duration: 0 }
    };
  }

  // src/internal/event.ts
  function waitForEvent(el, eventName) {
    return new Promise((resolve) => {
      function done(event) {
        if (event.target === el) {
          el.removeEventListener(eventName, done);
          resolve();
        }
      }
      el.addEventListener(eventName, done);
    });
  }

  // src/internal/animate.ts
  function animateTo(el, keyframes, options) {
    return new Promise((resolve) => {
      if ((options == null ? void 0 : options.duration) === Infinity) {
        throw new Error("Promise-based animations must be finite.");
      }
      const animation = el.animate(keyframes, __spreadProps(__spreadValues({}, options), {
        duration: prefersReducedMotion() ? 0 : options.duration
      }));
      animation.addEventListener("cancel", resolve, { once: true });
      animation.addEventListener("finish", resolve, { once: true });
    });
  }
  function prefersReducedMotion() {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    return query.matches;
  }
  function stopAnimations(el) {
    return Promise.all(
      el.getAnimations().map((animation) => {
        return new Promise((resolve) => {
          const handleAnimationEvent = requestAnimationFrame(resolve);
          animation.addEventListener("cancel", () => handleAnimationEvent, { once: true });
          animation.addEventListener("finish", () => handleAnimationEvent, { once: true });
          animation.cancel();
        });
      })
    );
  }

  const connectedElements = new Set();
  const documentElementObserver = new MutationObserver(update);
  const translations = new Map();
  let documentDirection = document.documentElement.dir || 'ltr';
  let documentLanguage = document.documentElement.lang || navigator.language;
  let fallback;
  documentElementObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir', 'lang']
  });
  function registerTranslation(...translation) {
      translation.map(t => {
          const code = t.$code.toLowerCase();
          if (translations.has(code)) {
              translations.set(code, Object.assign(Object.assign({}, translations.get(code)), t));
          }
          else {
              translations.set(code, t);
          }
          if (!fallback) {
              fallback = t;
          }
      });
      update();
  }
  function update() {
      documentDirection = document.documentElement.dir || 'ltr';
      documentLanguage = document.documentElement.lang || navigator.language;
      [...connectedElements.keys()].map((el) => {
          if (typeof el.requestUpdate === 'function') {
              el.requestUpdate();
          }
      });
  }
  let LocalizeController$1 = class LocalizeController {
      constructor(host) {
          this.host = host;
          this.host.addController(this);
      }
      hostConnected() {
          connectedElements.add(this.host);
      }
      hostDisconnected() {
          connectedElements.delete(this.host);
      }
      dir() {
          return `${this.host.dir || documentDirection}`.toLowerCase();
      }
      lang() {
          return `${this.host.lang || documentLanguage}`.toLowerCase();
      }
      getTranslationData(lang) {
          var _a, _b;
          const locale = new Intl.Locale(lang.replace(/_/g, '-'));
          const language = locale === null || locale === void 0 ? void 0 : locale.language.toLowerCase();
          const region = (_b = (_a = locale === null || locale === void 0 ? void 0 : locale.region) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '';
          const primary = translations.get(`${language}-${region}`);
          const secondary = translations.get(language);
          return { locale, language, region, primary, secondary };
      }
      exists(key, options) {
          var _a;
          const { primary, secondary } = this.getTranslationData((_a = options.lang) !== null && _a !== void 0 ? _a : this.lang());
          options = Object.assign({ includeFallback: false }, options);
          if ((primary && primary[key]) ||
              (secondary && secondary[key]) ||
              (options.includeFallback && fallback && fallback[key])) {
              return true;
          }
          return false;
      }
      term(key, ...args) {
          const { primary, secondary } = this.getTranslationData(this.lang());
          let term;
          if (primary && primary[key]) {
              term = primary[key];
          }
          else if (secondary && secondary[key]) {
              term = secondary[key];
          }
          else if (fallback && fallback[key]) {
              term = fallback[key];
          }
          else {
              console.error(`No translation found for: ${String(key)}`);
              return String(key);
          }
          if (typeof term === 'function') {
              return term(...args);
          }
          return term;
      }
      date(dateToFormat, options) {
          dateToFormat = new Date(dateToFormat);
          return new Intl.DateTimeFormat(this.lang(), options).format(dateToFormat);
      }
      number(numberToFormat, options) {
          numberToFormat = Number(numberToFormat);
          return isNaN(numberToFormat) ? '' : new Intl.NumberFormat(this.lang(), options).format(numberToFormat);
      }
      relativeTime(value, unit, options) {
          return new Intl.RelativeTimeFormat(this.lang(), options).format(value, unit);
      }
  };

  // src/translations/en.ts
  var translation = {
    $code: "en",
    $name: "English",
    $dir: "ltr",
    carousel: "Carousel",
    clearEntry: "Clear entry",
    close: "Close",
    copied: "Copied",
    copy: "Copy",
    currentValue: "Current value",
    error: "Error",
    goToSlide: (slide, count) => `Go to slide ${slide} of ${count}`,
    hidePassword: "Hide password",
    loading: "Loading",
    nextSlide: "Next slide",
    numOptionsSelected: (num) => {
      if (num === 0)
        return "No options selected";
      if (num === 1)
        return "1 option selected";
      return `${num} options selected`;
    },
    previousSlide: "Previous slide",
    progress: "Progress",
    remove: "Remove",
    resize: "Resize",
    scrollToEnd: "Scroll to end",
    scrollToStart: "Scroll to start",
    selectAColorFromTheScreen: "Select a color from the screen",
    showPassword: "Show password",
    slideNum: (slide) => `Slide ${slide}`,
    toggleColorFormat: "Toggle color format"
  };
  registerTranslation(translation);
  var en_default = translation;

  var LocalizeController = class extends LocalizeController$1 {
  };
  registerTranslation(en_default);

  // src/internal/watch.ts
  function watch(propertyName, options) {
    const resolvedOptions = __spreadValues({
      waitUntilFirstUpdate: false
    }, options);
    return (proto, decoratedFnName) => {
      const { update } = proto;
      const watchedProperties = Array.isArray(propertyName) ? propertyName : [propertyName];
      proto.update = function(changedProps) {
        watchedProperties.forEach((property) => {
          const key = property;
          if (changedProps.has(key)) {
            const oldValue = changedProps.get(key);
            const newValue = this[key];
            if (oldValue !== newValue) {
              if (!resolvedOptions.waitUntilFirstUpdate || this.hasUpdated) {
                this[decoratedFnName](oldValue, newValue);
              }
            }
          }
        });
        update.call(this, changedProps);
      };
    };
  }

  var SlDropdown = class extends ShoelaceElement {
    constructor() {
      super(...arguments);
      this.localize = new LocalizeController(this);
      this.open = false;
      this.placement = "bottom-start";
      this.disabled = false;
      this.stayOpenOnSelect = false;
      this.distance = 0;
      this.skidding = 0;
      this.hoist = false;
      this.handleKeyDown = (event) => {
        if (this.open && event.key === "Escape") {
          event.stopPropagation();
          this.hide();
          this.focusOnTrigger();
        }
      };
      this.handleDocumentKeyDown = (event) => {
        var _a;
        if (event.key === "Escape" && this.open) {
          event.stopPropagation();
          this.focusOnTrigger();
          this.hide();
          return;
        }
        if (event.key === "Tab") {
          if (this.open && ((_a = document.activeElement) == null ? void 0 : _a.tagName.toLowerCase()) === "sl-menu-item") {
            event.preventDefault();
            this.hide();
            this.focusOnTrigger();
            return;
          }
          setTimeout(() => {
            var _a2, _b, _c;
            const activeElement = ((_a2 = this.containingElement) == null ? void 0 : _a2.getRootNode()) instanceof ShadowRoot ? (_c = (_b = document.activeElement) == null ? void 0 : _b.shadowRoot) == null ? void 0 : _c.activeElement : document.activeElement;
            if (!this.containingElement || (activeElement == null ? void 0 : activeElement.closest(this.containingElement.tagName.toLowerCase())) !== this.containingElement) {
              this.hide();
            }
          });
        }
      };
      this.handleDocumentMouseDown = (event) => {
        const path = event.composedPath();
        if (this.containingElement && !path.includes(this.containingElement)) {
          this.hide();
        }
      };
      this.handlePanelSelect = (event) => {
        const target = event.target;
        if (!this.stayOpenOnSelect && target.tagName.toLowerCase() === "sl-menu") {
          this.hide();
          this.focusOnTrigger();
        }
      };
    }
    connectedCallback() {
      super.connectedCallback();
      if (!this.containingElement) {
        this.containingElement = this;
      }
    }
    firstUpdated() {
      this.panel.hidden = !this.open;
      if (this.open) {
        this.addOpenListeners();
        this.popup.active = true;
      }
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeOpenListeners();
      this.hide();
    }
    focusOnTrigger() {
      const trigger = this.trigger.assignedElements({ flatten: true })[0];
      if (typeof (trigger == null ? void 0 : trigger.focus) === "function") {
        trigger.focus();
      }
    }
    getMenu() {
      return this.panel.assignedElements({ flatten: true }).find((el) => el.tagName.toLowerCase() === "sl-menu");
    }
    handleTriggerClick() {
      if (this.open) {
        this.hide();
      } else {
        this.show();
        this.focusOnTrigger();
      }
    }
    async handleTriggerKeyDown(event) {
      if ([" ", "Enter"].includes(event.key)) {
        event.preventDefault();
        this.handleTriggerClick();
        return;
      }
      const menu = this.getMenu();
      if (menu) {
        const menuItems = menu.getAllItems();
        const firstMenuItem = menuItems[0];
        const lastMenuItem = menuItems[menuItems.length - 1];
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          if (!this.open) {
            this.show();
            await this.updateComplete;
          }
          if (menuItems.length > 0) {
            this.updateComplete.then(() => {
              if (event.key === "ArrowDown" || event.key === "Home") {
                menu.setCurrentItem(firstMenuItem);
                firstMenuItem.focus();
              }
              if (event.key === "ArrowUp" || event.key === "End") {
                menu.setCurrentItem(lastMenuItem);
                lastMenuItem.focus();
              }
            });
          }
        }
      }
    }
    handleTriggerKeyUp(event) {
      if (event.key === " ") {
        event.preventDefault();
      }
    }
    handleTriggerSlotChange() {
      this.updateAccessibleTrigger();
    }
    //
    // Slotted triggers can be arbitrary content, but we need to link them to the dropdown panel with `aria-haspopup` and
    // `aria-expanded`. These must be applied to the "accessible trigger" (the tabbable portion of the trigger element
    // that gets slotted in) so screen readers will understand them. The accessible trigger could be the slotted element,
    // a child of the slotted element, or an element in the slotted element's shadow root.
    //
    // For example, the accessible trigger of an <sl-button> is a <button> located inside its shadow root.
    //
    // To determine this, we assume the first tabbable element in the trigger slot is the "accessible trigger."
    //
    updateAccessibleTrigger() {
      const assignedElements = this.trigger.assignedElements({ flatten: true });
      const accessibleTrigger = assignedElements.find((el) => getTabbableBoundary(el).start);
      let target;
      if (accessibleTrigger) {
        switch (accessibleTrigger.tagName.toLowerCase()) {
          case "sl-button":
          case "sl-icon-button":
            target = accessibleTrigger.button;
            break;
          default:
            target = accessibleTrigger;
        }
        target.setAttribute("aria-haspopup", "true");
        target.setAttribute("aria-expanded", this.open ? "true" : "false");
      }
    }
    /** Shows the dropdown panel. */
    async show() {
      if (this.open) {
        return void 0;
      }
      this.open = true;
      return waitForEvent(this, "sl-after-show");
    }
    /** Hides the dropdown panel */
    async hide() {
      if (!this.open) {
        return void 0;
      }
      this.open = false;
      return waitForEvent(this, "sl-after-hide");
    }
    /**
     * Instructs the dropdown menu to reposition. Useful when the position or size of the trigger changes when the menu
     * is activated.
     */
    reposition() {
      this.popup.reposition();
    }
    addOpenListeners() {
      this.panel.addEventListener("sl-select", this.handlePanelSelect);
      this.panel.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("keydown", this.handleDocumentKeyDown);
      document.addEventListener("mousedown", this.handleDocumentMouseDown);
    }
    removeOpenListeners() {
      if (this.panel) {
        this.panel.removeEventListener("sl-select", this.handlePanelSelect);
        this.panel.removeEventListener("keydown", this.handleKeyDown);
      }
      document.removeEventListener("keydown", this.handleDocumentKeyDown);
      document.removeEventListener("mousedown", this.handleDocumentMouseDown);
    }
    async handleOpenChange() {
      if (this.disabled) {
        this.open = false;
        return;
      }
      this.updateAccessibleTrigger();
      if (this.open) {
        this.emit("sl-show");
        this.addOpenListeners();
        await stopAnimations(this);
        this.panel.hidden = false;
        this.popup.active = true;
        const { keyframes, options } = getAnimation(this, "dropdown.show", { dir: this.localize.dir() });
        await animateTo(this.popup.popup, keyframes, options);
        this.emit("sl-after-show");
      } else {
        this.emit("sl-hide");
        this.removeOpenListeners();
        await stopAnimations(this);
        const { keyframes, options } = getAnimation(this, "dropdown.hide", { dir: this.localize.dir() });
        await animateTo(this.popup.popup, keyframes, options);
        this.panel.hidden = true;
        this.popup.active = false;
        this.emit("sl-after-hide");
      }
    }
    render() {
      return x`
      <sl-popup
        part="base"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? "fixed" : "absolute"}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        class=${e$2({
      dropdown: true,
      "dropdown--open": this.open
    })}
      >
        <slot
          name="trigger"
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        ></slot>

        <div aria-hidden=${this.open ? "false" : "true"} aria-labelledby="dropdown">
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </sl-popup>
    `;
    }
  };
  SlDropdown.styles = dropdown_styles_default;
  SlDropdown.dependencies = { "sl-popup": SlPopup };
  __decorateClass([
    e$4(".dropdown")
  ], SlDropdown.prototype, "popup", 2);
  __decorateClass([
    e$4(".dropdown__trigger")
  ], SlDropdown.prototype, "trigger", 2);
  __decorateClass([
    e$4(".dropdown__panel")
  ], SlDropdown.prototype, "panel", 2);
  __decorateClass([
    n$2({ type: Boolean, reflect: true })
  ], SlDropdown.prototype, "open", 2);
  __decorateClass([
    n$2({ reflect: true })
  ], SlDropdown.prototype, "placement", 2);
  __decorateClass([
    n$2({ type: Boolean, reflect: true })
  ], SlDropdown.prototype, "disabled", 2);
  __decorateClass([
    n$2({ attribute: "stay-open-on-select", type: Boolean, reflect: true })
  ], SlDropdown.prototype, "stayOpenOnSelect", 2);
  __decorateClass([
    n$2({ attribute: false })
  ], SlDropdown.prototype, "containingElement", 2);
  __decorateClass([
    n$2({ type: Number })
  ], SlDropdown.prototype, "distance", 2);
  __decorateClass([
    n$2({ type: Number })
  ], SlDropdown.prototype, "skidding", 2);
  __decorateClass([
    n$2({ type: Boolean })
  ], SlDropdown.prototype, "hoist", 2);
  __decorateClass([
    watch("open", { waitUntilFirstUpdate: true })
  ], SlDropdown.prototype, "handleOpenChange", 1);
  setDefaultAnimation("dropdown.show", {
    keyframes: [
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1 }
    ],
    options: { duration: 100, easing: "ease" }
  });
  setDefaultAnimation("dropdown.hide", {
    keyframes: [
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 0.9 }
    ],
    options: { duration: 100, easing: "ease" }
  });

  SlDropdown.define("sl-dropdown");

  var menu_styles_default = i$3`
  ${component_styles_default}

  :host {
    display: block;
    position: relative;
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding: var(--sl-spacing-x-small) 0;
    overflow: auto;
    overscroll-behavior: none;
  }

  ::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }
`;

  var SlMenu = class extends ShoelaceElement {
    connectedCallback() {
      super.connectedCallback();
      this.setAttribute("role", "menu");
    }
    handleClick(event) {
      const menuItemTypes = ["menuitem", "menuitemcheckbox"];
      const target = event.composedPath().find((el) => {
        var _a;
        return menuItemTypes.includes(((_a = el == null ? void 0 : el.getAttribute) == null ? void 0 : _a.call(el, "role")) || "");
      });
      if (!target)
        return;
      const item = target;
      if (item.type === "checkbox") {
        item.checked = !item.checked;
      }
      this.emit("sl-select", { detail: { item } });
    }
    handleKeyDown(event) {
      if (event.key === "Enter" || event.key === " ") {
        const item = this.getCurrentItem();
        event.preventDefault();
        event.stopPropagation();
        item == null ? void 0 : item.click();
      } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        const items = this.getAllItems();
        const activeItem = this.getCurrentItem();
        let index = activeItem ? items.indexOf(activeItem) : 0;
        if (items.length > 0) {
          event.preventDefault();
          event.stopPropagation();
          if (event.key === "ArrowDown") {
            index++;
          } else if (event.key === "ArrowUp") {
            index--;
          } else if (event.key === "Home") {
            index = 0;
          } else if (event.key === "End") {
            index = items.length - 1;
          }
          if (index < 0) {
            index = items.length - 1;
          }
          if (index > items.length - 1) {
            index = 0;
          }
          this.setCurrentItem(items[index]);
          items[index].focus();
        }
      }
    }
    handleMouseDown(event) {
      const target = event.target;
      if (this.isMenuItem(target)) {
        this.setCurrentItem(target);
      }
    }
    handleSlotChange() {
      const items = this.getAllItems();
      if (items.length > 0) {
        this.setCurrentItem(items[0]);
      }
    }
    isMenuItem(item) {
      var _a;
      return item.tagName.toLowerCase() === "sl-menu-item" || ["menuitem", "menuitemcheckbox", "menuitemradio"].includes((_a = item.getAttribute("role")) != null ? _a : "");
    }
    /** @internal Gets all slotted menu items, ignoring dividers, headers, and other elements. */
    getAllItems() {
      return [...this.defaultSlot.assignedElements({ flatten: true })].filter((el) => {
        if (el.inert || !this.isMenuItem(el)) {
          return false;
        }
        return true;
      });
    }
    /**
     * @internal Gets the current menu item, which is the menu item that has `tabindex="0"` within the roving tab index.
     * The menu item may or may not have focus, but for keyboard interaction purposes it's considered the "active" item.
     */
    getCurrentItem() {
      return this.getAllItems().find((i) => i.getAttribute("tabindex") === "0");
    }
    /**
     * @internal Sets the current menu item to the specified element. This sets `tabindex="0"` on the target element and
     * `tabindex="-1"` to all other items. This method must be called prior to setting focus on a menu item.
     */
    setCurrentItem(item) {
      const items = this.getAllItems();
      items.forEach((i) => {
        i.setAttribute("tabindex", i === item ? "0" : "-1");
      });
    }
    render() {
      return x`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `;
    }
  };
  SlMenu.styles = menu_styles_default;
  __decorateClass([
    e$4("slot")
  ], SlMenu.prototype, "defaultSlot", 2);

  SlMenu.define("sl-menu");

  var menu_item_styles_default = i$3`
  ${component_styles_default}

  :host {
    --submenu-offset: -2px;

    /* Private */
    --safe-triangle-cursor-x: 0;
    --safe-triangle-cursor-y: 0;
    --safe-triangle-submenu-start-x: 0;
    --safe-triangle-submenu-start-y: 0;
    --safe-triangle-submenu-end-x: 0;
    --safe-triangle-submenu-end-y: 0;

    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-2x-small);
    transition: var(--sl-transition-fast) fill;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu-item.menu-item--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-item .menu-item__label {
    flex: 1 1 auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .menu-item .menu-item__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /* Safe triangle */
  .menu-item--submenu-expanded::after {
    content: '';
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--safe-triangle-cursor-x) var(--safe-triangle-cursor-y),
      var(--safe-triangle-submenu-start-x) var(--safe-triangle-submenu-start-y),
      var(--safe-triangle-submenu-end-x) var(--safe-triangle-submenu-end-y)
    );
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'], :focus-visible)) .menu-item,
  .menu-item--submenu-expanded {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  :host(:focus-visible) .menu-item {
    outline: none;
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .menu-item .menu-item__check,
  .menu-item .menu-item__chevron {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    visibility: hidden;
  }

  .menu-item--checked .menu-item__check,
  .menu-item--has-submenu .menu-item__chevron {
    visibility: visible;
  }

  /* Add elevation and z-index to submenus */
  sl-popup::part(popup) {
    box-shadow: var(--sl-shadow-large);
    z-index: var(--sl-z-index-dropdown);
    margin-left: var(--submenu-offset);
  }

  .menu-item--rtl sl-popup::part(popup) {
    margin-left: calc(-1 * var(--submenu-offset));
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .menu-item,
    :host(:focus-visible) .menu-item {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`;

  /**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const e$1=(o,t)=>void 0===t?void 0!==o?._$litType$:o?._$litType$===t,f$1=o=>void 0===o.strings;

  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const s=(i,t)=>{const e=i._$AN;if(void 0===e)return !1;for(const i of e)i._$AO?.(t,!1),s(i,t);return !0},o$1=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t;}while(0===e?.size)},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),c(t);}};function h$1(i){void 0!==this._$AN?(o$1(this),this._$AM=i,r(this)):this._$AM=i;}function n$1(i,t=!1,e=0){const r=this._$AH,h=this._$AN;if(void 0!==h&&0!==h.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s(r[i],!1),o$1(r[i]);else null!=r&&(s(r,!1),o$1(r));else s(this,i);}const c=i=>{i.type==t.CHILD&&(i._$AP??=n$1,i._$AQ??=h$1);};class f extends i{constructor(){super(...arguments),this._$AN=void 0;}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU;}_$AO(i,t=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(s(this,i),o$1(this));}setValue(t){if(f$1(this._$Ct))this._$Ct._$AI(t,this);else {const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0);}}disconnected(){}reconnected(){}}

  /**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const e=()=>new h;class h{}const o=new WeakMap,n=e$3(class extends f{render(i){return T}update(i,[s]){const e=s!==this.G;return e&&void 0!==this.G&&this.ot(void 0),(e||this.rt!==this.lt)&&(this.G=s,this.ct=i.options?.host,this.ot(this.lt=i.element)),T}ot(t){if("function"==typeof this.G){const i=this.ct??globalThis;let s=o.get(i);void 0===s&&(s=new WeakMap,o.set(i,s)),void 0!==s.get(this.G)&&this.G.call(this.ct,void 0),s.set(this.G,t),void 0!==t&&this.G.call(this.ct,t);}else this.G.value=t;}get rt(){return "function"==typeof this.G?o.get(this.ct??globalThis)?.get(this.G):this.G?.value}disconnected(){this.rt===this.lt&&this.ot(void 0);}reconnected(){this.ot(this.lt);}});

  // src/components/menu-item/submenu-controller.ts
  var SubmenuController = class {
    constructor(host, hasSlotController, localize) {
      this.popupRef = e();
      this.enableSubmenuTimer = -1;
      this.isConnected = false;
      this.isPopupConnected = false;
      this.skidding = 0;
      this.submenuOpenDelay = 100;
      // Set the safe triangle cursor position
      this.handleMouseMove = (event) => {
        this.host.style.setProperty("--safe-triangle-cursor-x", `${event.clientX}px`);
        this.host.style.setProperty("--safe-triangle-cursor-y", `${event.clientY}px`);
      };
      this.handleMouseOver = () => {
        if (this.hasSlotController.test("submenu")) {
          this.enableSubmenu();
        }
      };
      // Focus on the first menu-item of a submenu.
      this.handleKeyDown = (event) => {
        switch (event.key) {
          case "Escape":
          case "Tab":
            this.disableSubmenu();
            break;
          case "ArrowLeft":
            if (event.target !== this.host) {
              event.preventDefault();
              event.stopPropagation();
              this.host.focus();
              this.disableSubmenu();
            }
            break;
          case "ArrowRight":
          case "Enter":
          case " ":
            this.handleSubmenuEntry(event);
            break;
        }
      };
      this.handleClick = (event) => {
        var _a;
        if (event.target === this.host) {
          event.preventDefault();
          event.stopPropagation();
        } else if (event.target instanceof Element && (event.target.tagName === "sl-menu-item" || ((_a = event.target.role) == null ? void 0 : _a.startsWith("menuitem")))) {
          this.disableSubmenu();
        }
      };
      // Close this submenu on focus outside of the parent or any descendants.
      this.handleFocusOut = (event) => {
        if (event.relatedTarget && event.relatedTarget instanceof Element && this.host.contains(event.relatedTarget)) {
          return;
        }
        this.disableSubmenu();
      };
      // Prevent the parent menu-item from getting focus on mouse movement on the submenu
      this.handlePopupMouseover = (event) => {
        event.stopPropagation();
      };
      // Set the safe triangle values for the submenu when the position changes
      this.handlePopupReposition = () => {
        const submenuSlot = this.host.renderRoot.querySelector("slot[name='submenu']");
        const menu = submenuSlot == null ? void 0 : submenuSlot.assignedElements({ flatten: true }).filter((el) => el.localName === "sl-menu")[0];
        const isRtl = this.localize.dir() === "rtl";
        if (!menu) {
          return;
        }
        const { left, top, width, height } = menu.getBoundingClientRect();
        this.host.style.setProperty("--safe-triangle-submenu-start-x", `${isRtl ? left + width : left}px`);
        this.host.style.setProperty("--safe-triangle-submenu-start-y", `${top}px`);
        this.host.style.setProperty("--safe-triangle-submenu-end-x", `${isRtl ? left + width : left}px`);
        this.host.style.setProperty("--safe-triangle-submenu-end-y", `${top + height}px`);
      };
      (this.host = host).addController(this);
      this.hasSlotController = hasSlotController;
      this.localize = localize;
    }
    hostConnected() {
      if (this.hasSlotController.test("submenu") && !this.host.disabled) {
        this.addListeners();
      }
    }
    hostDisconnected() {
      this.removeListeners();
    }
    hostUpdated() {
      if (this.hasSlotController.test("submenu") && !this.host.disabled) {
        this.addListeners();
        this.updateSkidding();
      } else {
        this.removeListeners();
      }
    }
    addListeners() {
      if (!this.isConnected) {
        this.host.addEventListener("mousemove", this.handleMouseMove);
        this.host.addEventListener("mouseover", this.handleMouseOver);
        this.host.addEventListener("keydown", this.handleKeyDown);
        this.host.addEventListener("click", this.handleClick);
        this.host.addEventListener("focusout", this.handleFocusOut);
        this.isConnected = true;
      }
      if (!this.isPopupConnected) {
        if (this.popupRef.value) {
          this.popupRef.value.addEventListener("mouseover", this.handlePopupMouseover);
          this.popupRef.value.addEventListener("sl-reposition", this.handlePopupReposition);
          this.isPopupConnected = true;
        }
      }
    }
    removeListeners() {
      if (this.isConnected) {
        this.host.removeEventListener("mousemove", this.handleMouseMove);
        this.host.removeEventListener("mouseover", this.handleMouseOver);
        this.host.removeEventListener("keydown", this.handleKeyDown);
        this.host.removeEventListener("click", this.handleClick);
        this.host.removeEventListener("focusout", this.handleFocusOut);
        this.isConnected = false;
      }
      if (this.isPopupConnected) {
        if (this.popupRef.value) {
          this.popupRef.value.removeEventListener("mouseover", this.handlePopupMouseover);
          this.popupRef.value.removeEventListener("sl-reposition", this.handlePopupReposition);
          this.isPopupConnected = false;
        }
      }
    }
    handleSubmenuEntry(event) {
      const submenuSlot = this.host.renderRoot.querySelector("slot[name='submenu']");
      if (!submenuSlot) {
        console.error("Cannot activate a submenu if no corresponding menuitem can be found.", this);
        return;
      }
      let menuItems = null;
      for (const elt of submenuSlot.assignedElements()) {
        menuItems = elt.querySelectorAll("sl-menu-item, [role^='menuitem']");
        if (menuItems.length !== 0) {
          break;
        }
      }
      if (!menuItems || menuItems.length === 0) {
        return;
      }
      menuItems[0].setAttribute("tabindex", "0");
      for (let i = 1; i !== menuItems.length; ++i) {
        menuItems[i].setAttribute("tabindex", "-1");
      }
      if (this.popupRef.value) {
        event.preventDefault();
        event.stopPropagation();
        if (this.popupRef.value.active) {
          if (menuItems[0] instanceof HTMLElement) {
            menuItems[0].focus();
          }
        } else {
          this.enableSubmenu(false);
          this.host.updateComplete.then(() => {
            if (menuItems[0] instanceof HTMLElement) {
              menuItems[0].focus();
            }
          });
          this.host.requestUpdate();
        }
      }
    }
    setSubmenuState(state) {
      if (this.popupRef.value) {
        if (this.popupRef.value.active !== state) {
          this.popupRef.value.active = state;
          this.host.requestUpdate();
        }
      }
    }
    // Shows the submenu. Supports disabling the opening delay, e.g. for keyboard events that want to set the focus to the
    // newly opened menu.
    enableSubmenu(delay = true) {
      if (delay) {
        this.enableSubmenuTimer = window.setTimeout(() => {
          this.setSubmenuState(true);
        }, this.submenuOpenDelay);
      } else {
        this.setSubmenuState(true);
      }
    }
    disableSubmenu() {
      clearTimeout(this.enableSubmenuTimer);
      this.setSubmenuState(false);
    }
    // Calculate the space the top of a menu takes-up, for aligning the popup menu-item with the activating element.
    updateSkidding() {
      var _a;
      if (!((_a = this.host.parentElement) == null ? void 0 : _a.computedStyleMap)) {
        return;
      }
      const styleMap = this.host.parentElement.computedStyleMap();
      const attrs = ["padding-top", "border-top-width", "margin-top"];
      const skidding = attrs.reduce((accumulator, attr) => {
        var _a2;
        const styleValue = (_a2 = styleMap.get(attr)) != null ? _a2 : new CSSUnitValue(0, "px");
        const unitValue = styleValue instanceof CSSUnitValue ? styleValue : new CSSUnitValue(0, "px");
        const pxValue = unitValue.to("px");
        return accumulator - pxValue.value;
      }, 0);
      this.skidding = skidding;
    }
    isExpanded() {
      return this.popupRef.value ? this.popupRef.value.active : false;
    }
    renderSubmenu() {
      const isLtr = this.localize.dir() === "ltr";
      if (!this.isConnected) {
        return x` <slot name="submenu" hidden></slot> `;
      }
      return x`
      <sl-popup
        ${n(this.popupRef)}
        placement=${isLtr ? "right-start" : "left-start"}
        anchor="anchor"
        flip
        flip-fallback-strategy="best-fit"
        skidding="${this.skidding}"
        strategy="fixed"
      >
        <slot name="submenu"></slot>
      </sl-popup>
    `;
    }
  };

  // src/internal/slot.ts
  var HasSlotController = class {
    constructor(host, ...slotNames) {
      this.slotNames = [];
      this.handleSlotChange = (event) => {
        const slot = event.target;
        if (this.slotNames.includes("[default]") && !slot.name || slot.name && this.slotNames.includes(slot.name)) {
          this.host.requestUpdate();
        }
      };
      (this.host = host).addController(this);
      this.slotNames = slotNames;
    }
    hasDefaultSlot() {
      return [...this.host.childNodes].some((node) => {
        if (node.nodeType === node.TEXT_NODE && node.textContent.trim() !== "") {
          return true;
        }
        if (node.nodeType === node.ELEMENT_NODE) {
          const el = node;
          const tagName = el.tagName.toLowerCase();
          if (tagName === "sl-visually-hidden") {
            return false;
          }
          if (!el.hasAttribute("slot")) {
            return true;
          }
        }
        return false;
      });
    }
    hasNamedSlot(name) {
      return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
    }
    test(slotName) {
      return slotName === "[default]" ? this.hasDefaultSlot() : this.hasNamedSlot(slotName);
    }
    hostConnected() {
      this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    hostDisconnected() {
      this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
  };
  function getTextContent(slot) {
    if (!slot) {
      return "";
    }
    const nodes = slot.assignedNodes({ flatten: true });
    let text = "";
    [...nodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      }
    });
    return text;
  }

  var icon_styles_default = i$3`
  ${component_styles_default}

  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;

  // src/utilities/base-path.ts
  var basePath = "";
  function setBasePath(path) {
    basePath = path;
  }
  function getBasePath(subpath = "") {
    if (!basePath) {
      const scripts = [...document.getElementsByTagName("script")];
      const configScript = scripts.find((script) => script.hasAttribute("data-shoelace"));
      if (configScript) {
        setBasePath(configScript.getAttribute("data-shoelace"));
      } else {
        const fallbackScript = scripts.find((s) => {
          return /shoelace(\.min)?\.js($|\?)/.test(s.src) || /shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src);
        });
        let path = "";
        if (fallbackScript) {
          path = fallbackScript.getAttribute("src");
        }
        setBasePath(path.split("/").slice(0, -1).join("/"));
      }
    }
    return basePath.replace(/\/$/, "") + (subpath ? `/${subpath.replace(/^\//, "")}` : ``);
  }

  // src/components/icon/library.default.ts
  var library = {
    name: "default",
    resolver: (name) => getBasePath(`assets/icons/${name}.svg`)
  };
  var library_default_default = library;

  // src/components/icon/library.system.ts
  var icons = {
    caret: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,
    check: `
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
    "chevron-down": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
    "chevron-left": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,
    "chevron-right": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
    copy: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,
    eye: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,
    "eye-slash": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,
    eyedropper: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,
    "grip-vertical": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,
    indeterminate: `
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
    "person-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,
    "play-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,
    "pause-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,
    radio: `
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,
    "star-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,
    "x-lg": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,
    "x-circle-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `
  };
  var systemLibrary = {
    name: "system",
    resolver: (name) => {
      if (name in icons) {
        return `data:image/svg+xml,${encodeURIComponent(icons[name])}`;
      }
      return "";
    }
  };
  var library_system_default = systemLibrary;

  // src/components/icon/library.ts
  var registry = [library_default_default, library_system_default];
  var watchedIcons = [];
  function watchIcon(icon) {
    watchedIcons.push(icon);
  }
  function unwatchIcon(icon) {
    watchedIcons = watchedIcons.filter((el) => el !== icon);
  }
  function getIconLibrary(name) {
    return registry.find((lib) => lib.name === name);
  }

  var CACHEABLE_ERROR = Symbol();
  var RETRYABLE_ERROR = Symbol();
  var parser;
  var iconCache = /* @__PURE__ */ new Map();
  var SlIcon = class extends ShoelaceElement {
    constructor() {
      super(...arguments);
      this.initialRender = false;
      this.svg = null;
      this.label = "";
      this.library = "default";
    }
    /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
    async resolveIcon(url, library) {
      var _a;
      let fileData;
      if (library == null ? void 0 : library.spriteSheet) {
        return x`<svg part="svg">
        <use part="use" href="${url}"></use>
      </svg>`;
      }
      try {
        fileData = await fetch(url, { mode: "cors" });
        if (!fileData.ok)
          return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
      } catch (e) {
        return RETRYABLE_ERROR;
      }
      try {
        const div = document.createElement("div");
        div.innerHTML = await fileData.text();
        const svg = div.firstElementChild;
        if (((_a = svg == null ? void 0 : svg.tagName) == null ? void 0 : _a.toLowerCase()) !== "svg")
          return CACHEABLE_ERROR;
        if (!parser)
          parser = new DOMParser();
        const doc = parser.parseFromString(svg.outerHTML, "text/html");
        const svgEl = doc.body.querySelector("svg");
        if (!svgEl)
          return CACHEABLE_ERROR;
        svgEl.part.add("svg");
        return document.adoptNode(svgEl);
      } catch (e) {
        return CACHEABLE_ERROR;
      }
    }
    connectedCallback() {
      super.connectedCallback();
      watchIcon(this);
    }
    firstUpdated() {
      this.initialRender = true;
      this.setIcon();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      unwatchIcon(this);
    }
    getIconSource() {
      const library = getIconLibrary(this.library);
      if (this.name && library) {
        return {
          url: library.resolver(this.name),
          fromLibrary: true
        };
      }
      return {
        url: this.src,
        fromLibrary: false
      };
    }
    handleLabelChange() {
      const hasLabel = typeof this.label === "string" && this.label.length > 0;
      if (hasLabel) {
        this.setAttribute("role", "img");
        this.setAttribute("aria-label", this.label);
        this.removeAttribute("aria-hidden");
      } else {
        this.removeAttribute("role");
        this.removeAttribute("aria-label");
        this.setAttribute("aria-hidden", "true");
      }
    }
    async setIcon() {
      var _a;
      const { url, fromLibrary } = this.getIconSource();
      const library = fromLibrary ? getIconLibrary(this.library) : void 0;
      if (!url) {
        this.svg = null;
        return;
      }
      let iconResolver = iconCache.get(url);
      if (!iconResolver) {
        iconResolver = this.resolveIcon(url, library);
        iconCache.set(url, iconResolver);
      }
      if (!this.initialRender) {
        return;
      }
      const svg = await iconResolver;
      if (svg === RETRYABLE_ERROR) {
        iconCache.delete(url);
      }
      if (url !== this.getIconSource().url) {
        return;
      }
      if (e$1(svg)) {
        this.svg = svg;
        return;
      }
      switch (svg) {
        case RETRYABLE_ERROR:
        case CACHEABLE_ERROR:
          this.svg = null;
          this.emit("sl-error");
          break;
        default:
          this.svg = svg.cloneNode(true);
          (_a = library == null ? void 0 : library.mutator) == null ? void 0 : _a.call(library, this.svg);
          this.emit("sl-load");
      }
    }
    render() {
      return this.svg;
    }
  };
  SlIcon.styles = icon_styles_default;
  __decorateClass([
    r$1()
  ], SlIcon.prototype, "svg", 2);
  __decorateClass([
    n$2({ reflect: true })
  ], SlIcon.prototype, "name", 2);
  __decorateClass([
    n$2()
  ], SlIcon.prototype, "src", 2);
  __decorateClass([
    n$2()
  ], SlIcon.prototype, "label", 2);
  __decorateClass([
    n$2({ reflect: true })
  ], SlIcon.prototype, "library", 2);
  __decorateClass([
    watch("label")
  ], SlIcon.prototype, "handleLabelChange", 1);
  __decorateClass([
    watch(["name", "src", "library"])
  ], SlIcon.prototype, "setIcon", 1);

  var SlMenuItem = class extends ShoelaceElement {
    constructor() {
      super(...arguments);
      this.type = "normal";
      this.checked = false;
      this.value = "";
      this.disabled = false;
      this.localize = new LocalizeController(this);
      this.hasSlotController = new HasSlotController(this, "submenu");
      this.submenuController = new SubmenuController(this, this.hasSlotController, this.localize);
      this.handleHostClick = (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      };
      this.handleMouseOver = (event) => {
        this.focus();
        event.stopPropagation();
      };
    }
    connectedCallback() {
      super.connectedCallback();
      this.addEventListener("click", this.handleHostClick);
      this.addEventListener("mouseover", this.handleMouseOver);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener("click", this.handleHostClick);
      this.removeEventListener("mouseover", this.handleMouseOver);
    }
    handleDefaultSlotChange() {
      const textLabel = this.getTextLabel();
      if (typeof this.cachedTextLabel === "undefined") {
        this.cachedTextLabel = textLabel;
        return;
      }
      if (textLabel !== this.cachedTextLabel) {
        this.cachedTextLabel = textLabel;
        this.emit("slotchange", { bubbles: true, composed: false, cancelable: false });
      }
    }
    handleCheckedChange() {
      if (this.checked && this.type !== "checkbox") {
        this.checked = false;
        console.error('The checked attribute can only be used on menu items with type="checkbox"', this);
        return;
      }
      if (this.type === "checkbox") {
        this.setAttribute("aria-checked", this.checked ? "true" : "false");
      } else {
        this.removeAttribute("aria-checked");
      }
    }
    handleDisabledChange() {
      this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
    }
    handleTypeChange() {
      if (this.type === "checkbox") {
        this.setAttribute("role", "menuitemcheckbox");
        this.setAttribute("aria-checked", this.checked ? "true" : "false");
      } else {
        this.setAttribute("role", "menuitem");
        this.removeAttribute("aria-checked");
      }
    }
    /** Returns a text label based on the contents of the menu item's default slot. */
    getTextLabel() {
      return getTextContent(this.defaultSlot);
    }
    isSubmenu() {
      return this.hasSlotController.test("submenu");
    }
    render() {
      const isRtl = this.localize.dir() === "rtl";
      const isSubmenuExpanded = this.submenuController.isExpanded();
      return x`
      <div
        id="anchor"
        part="base"
        class=${e$2({
      "menu-item": true,
      "menu-item--rtl": isRtl,
      "menu-item--checked": this.checked,
      "menu-item--disabled": this.disabled,
      "menu-item--has-submenu": this.isSubmenu(),
      "menu-item--submenu-expanded": isSubmenuExpanded
    })}
        ?aria-haspopup="${this.isSubmenu()}"
        ?aria-expanded="${isSubmenuExpanded ? true : false}"
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span part="submenu-icon" class="menu-item__chevron">
          <sl-icon name=${isRtl ? "chevron-left" : "chevron-right"} library="system" aria-hidden="true"></sl-icon>
        </span>

        ${this.submenuController.renderSubmenu()}
      </div>
    `;
    }
  };
  SlMenuItem.styles = menu_item_styles_default;
  SlMenuItem.dependencies = {
    "sl-icon": SlIcon,
    "sl-popup": SlPopup
  };
  __decorateClass([
    e$4("slot:not([name])")
  ], SlMenuItem.prototype, "defaultSlot", 2);
  __decorateClass([
    e$4(".menu-item")
  ], SlMenuItem.prototype, "menuItem", 2);
  __decorateClass([
    n$2()
  ], SlMenuItem.prototype, "type", 2);
  __decorateClass([
    n$2({ type: Boolean, reflect: true })
  ], SlMenuItem.prototype, "checked", 2);
  __decorateClass([
    n$2()
  ], SlMenuItem.prototype, "value", 2);
  __decorateClass([
    n$2({ type: Boolean, reflect: true })
  ], SlMenuItem.prototype, "disabled", 2);
  __decorateClass([
    watch("checked")
  ], SlMenuItem.prototype, "handleCheckedChange", 1);
  __decorateClass([
    watch("disabled")
  ], SlMenuItem.prototype, "handleDisabledChange", 1);
  __decorateClass([
    watch("type")
  ], SlMenuItem.prototype, "handleTypeChange", 1);

  SlMenuItem.define("sl-menu-item");

  var menu_label_styles_default = i$3`
  ${component_styles_default}

  :host {
    display: block;
  }

  .menu-label {
    display: inline-block;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-500);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-large);
    user-select: none;
    -webkit-user-select: none;
  }
`;

  var SlMenuLabel = class extends ShoelaceElement {
    render() {
      return x` <slot part="base" class="menu-label"></slot> `;
    }
  };
  SlMenuLabel.styles = menu_label_styles_default;

  SlMenuLabel.define("sl-menu-label");

  SlIcon.define("sl-icon");

  var divider_styles_default = i$3`
  ${component_styles_default}

  :host {
    --color: var(--sl-panel-border-color);
    --width: var(--sl-panel-border-width);
    --spacing: var(--sl-spacing-medium);
  }

  :host(:not([vertical])) {
    display: block;
    border-top: solid var(--width) var(--color);
    margin: var(--spacing) 0;
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    border-left: solid var(--width) var(--color);
    margin: 0 var(--spacing);
  }
`;

  var SlDivider = class extends ShoelaceElement {
    constructor() {
      super(...arguments);
      this.vertical = false;
    }
    connectedCallback() {
      super.connectedCallback();
      this.setAttribute("role", "separator");
    }
    handleVerticalChange() {
      this.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
    }
  };
  SlDivider.styles = divider_styles_default;
  __decorateClass([
    n$2({ type: Boolean, reflect: true })
  ], SlDivider.prototype, "vertical", 2);
  __decorateClass([
    watch("vertical")
  ], SlDivider.prototype, "handleVerticalChange", 1);

  SlDivider.define("sl-divider");

  var img$3 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-fast-forward-btn' viewBox='0 0 16 16'%3e %3cpath d='M8.79 5.093A.5.5 0 0 0 8 5.5v1.886L4.79 5.093A.5.5 0 0 0 4 5.5v5a.5.5 0 0 0 .79.407L8 8.614V10.5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5Z'/%3e %3cpath d='M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4Z'/%3e%3c/svg%3e";

  var img$2 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-image' viewBox='0 0 16 16'%3e %3cpath d='M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/%3e %3cpath d='M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z'/%3e%3c/svg%3e";

  var img$1 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-list' viewBox='0 0 16 16'%3e %3cpath fill-rule='evenodd' d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'/%3e%3c/svg%3e";

  var img = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-download' viewBox='0 0 16 16'%3e %3cpath d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z'/%3e %3cpath d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z'/%3e%3c/svg%3e";

  const faq = [
    {
      title: '倍速刷课为啥学习进度没变化',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE%E4%B8%BA%E5%95%A5%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E6%B2%A1%E5%8F%98%E5%8C%96'
    },
    {
      title: '百度网盘视频无法倍速播放',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%97%A0%E6%B3%95%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE'
    },
    {
      title: '倍速播放卡顿、无进度、音画不同步',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E5%8D%A1%E9%A1%BF%E3%80%81%E6%97%A0%E8%BF%9B%E5%BA%A6%E3%80%81%E9%9F%B3%E7%94%BB%E4%B8%8D%E5%90%8C%E6%AD%A5'
    },
    {
      title: 'Playback is stuttering, has no progress, or is out of sync',
      action: 'openDocsLink',
      lang: ['en', 'ru'],
      args: '/home/q&a#playback-is-stuttering-has-no-progress-or-is-out-of-sync'
    },
    {
      title: '如何支持本地视频文件的倍速播放',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E5%A6%82%E4%BD%95%E6%94%AF%E6%8C%81%E6%9C%AC%E5%9C%B0%E8%A7%86%E9%A2%91%E6%96%87%E4%BB%B6%E7%9A%84%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE'
    },
    {
      title: 'How can I support speed playback for local video files?',
      action: 'openDocsLink',
      lang: ['en', 'ru'],
      args: '/home/q&a#how-can-i-support-speed-playback-for-local-video-files'
    },
    {
      title: '开启插件后网站自身的调速失效了',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E5%BC%80%E5%90%AF%E6%8F%92%E4%BB%B6%E5%90%8E%E7%BD%91%E7%AB%99%E8%87%AA%E8%BA%AB%E7%9A%84%E8%B0%83%E9%80%9F%E5%A4%B1%E6%95%88%E4%BA%86'
    },
    {
      title: 'The site\'s own speed control fails after enabling the plugin',
      action: 'openDocsLink',
      lang: ['en', 'ru'],
      args: '/home/q&a#the-site-s-own-speed-control-fails-after-enabling-the-plugin'
    },
    {
      title: '为什么视频跟音频是分开下载的',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A7%86%E9%A2%91%E8%B7%9F%E9%9F%B3%E9%A2%91%E6%98%AF%E5%88%86%E5%BC%80%E4%B8%8B%E8%BD%BD%E7%9A%84'
    },
    {
      title: 'Why are video and audio downloaded separately?',
      action: 'openDocsLink',
      lang: ['en', 'ru'],
      args: '/home/q&a#why-are-video-and-audio-downloaded-separately'
    },
    {
      title: '如何合并下载到的音视频文件',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E5%A6%82%E4%BD%95%E5%90%88%E5%B9%B6%E4%B8%8B%E8%BD%BD%E5%88%B0%E7%9A%84%E9%9F%B3%E8%A7%86%E9%A2%91%E6%96%87%E4%BB%B6'
    },
    {
      title: 'How to merge downloaded audio and video files',
      action: 'openDocsLink',
      lang: ['en', 'ru'],
      args: '/home/q&a#how-to-merge-downloaded-audio-and-video-files'
    },
    {
      title: '为什么视频截图不同网站表现不一致',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE%E4%B8%8D%E5%90%8C%E7%BD%91%E7%AB%99%E8%A1%A8%E7%8E%B0%E4%B8%8D%E4%B8%80%E8%87%B4'
    },
    {
      title: 'Why is video screenshot functionality inconsistent across websites?',
      action: 'openDocsLink',
      lang: ['en', 'ru'],
      args: '/home/q&a#why-is-video-screenshot-functionality-inconsistent-across-websites'
    },
    {
      title: '如何禁用或自定义快捷键',
      action: 'openDocsLink',
      lang: ['zh'],
      args: '/home/q&a#%E5%A6%82%E4%BD%95%E7%A6%81%E7%94%A8%E6%88%96%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE'
    },
    {
      title: 'How to Disable or Customize Shortcut Keys',
      action: 'openDocsLink',
      lang: ['en', 'ru'],
      args: '/home/q&a#how-to-disable-or-customize-shortcut-keys'
    }
  ];

  const { i18n, debug: debug$1, globalFunctional, configManager: configManager$1 } = window.h5playerUIProvider;
  const isGlobalStorageUsable = configManager$1.isGlobalStorageUsable();

  const menuConfig = [
    {
      title: i18n.t('download'),
      desc: i18n.t('download'),
      icon: img,
      action: 'mediaDownload',
      args: null
    },
    {
      title: i18n.t('capture'),
      desc: i18n.t('capture'),
      icon: img$2,
      action: 'capture',
      args: null
    },
    {
      title: i18n.t('speed'),
      desc: i18n.t('speed'),
      icon: img$3,
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
      icon: img$1,
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
              disabled: !debug$1.isDebugMode() || !isGlobalStorageUsable
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
              disabled: !debug$1.isDebugMode()
            },
            {
              title: 'Print Player info',
              desc: 'Print Player info',
              action: 'printPlayerInfo',
              disabled: !debug$1.isDebugMode()
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
  ];

  /* menuConfig预处理函数，根据指定的参考dom元素，通过判断元素的宽度来决定是否只显示菜单的图标，以节省展示位置 */
  function menuConfigPreprocess (menuConfig, refDom) {
    const refWidth = refDom.offsetWidth;
    const iconOnly = refWidth < 500;

    return menuConfig.map(item => {
      if (item.dropdownMenu) {
        item.dropdownMenu = menuConfigPreprocess(item.dropdownMenu, refDom);
      }

      return {
        ...item,
        iconOnly
      }
    })
  }

  /* 写个函数，支持将menuConfig.dropdownMenu的数据构建成sl-menu组件的template */
  function convertDropdownMenuToTemplate (dropdownMenu, isRootMenu = true) {
    const menuItems = dropdownMenu.map(item => {
      if (item.disabled) return ''

      const lang = item.lang || item.language || item.languages;
      if (lang && !i18n.isMatchCurLang(lang)) return ''

      const title = (item.title instanceof Function ? item.title() : item.title) || '';
      const desc = (item.desc instanceof Function ? item.desc() : item.desc) || '';
      const id = item.id || Math.random().toString(36).substr(2);

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
    }).join('');

    return isRootMenu ? `<sl-menu>${menuItems}</sl-menu>` : menuItems
  }

  /* 写一个函数可以将menuConfig转换成template进行输出 */
  function convertMenuConfigToTemplate (menuConfig) {
    return `
  <div class="h5p-action-mod">
      ${menuConfig.map(item => {
        if (item.disabled) return ''

        const lang = item.lang || item.language || item.languages;
        if (lang && !i18n.isMatchCurLang(lang)) return ''

        const title = (item.title instanceof Function ? item.title() : item.title) || '';
        const desc = (item.desc instanceof Function ? item.desc() : item.desc) || '';
        const iconHtml = item.icon ? `<sl-icon src="${item.icon}"></sl-icon>` : '';
        const menuDesc = item.iconOnly && iconHtml ? '' : `<span class="h5p-desc">${title}</span>`;

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

  function createMenuTemplate (config = menuConfig || []) {
    return convertMenuConfigToTemplate(config)
  }

  function createLogoModTemplate () {
    const homepage = globalFunctional.getHomePageLink.fn();
    return `<a class="h5p-logo-mod" href="${homepage}" target="_blank">h5player</a>`
  }

  const defaultRecommendList = [
    {
      title: '【h5player】使用手册',
      url: 'https://u.anzz.top/h5pmanual',
      priority: 99,
      i18n: {
        en: {
          title: '【h5player】User Manual'
        }
      }
    },
    {
      title: '【h5player】音视频一键合并工具，无需二次编码',
      desc: '将h5player下载到的音视频文件自动合并成一个文件，不经过二次编码，可快速合并',
      url: 'https://u.anzz.top/ffmpegscript',
      i18n: {
        en: {
          title: '【h5player】Audio and video merge tool, no secondary coding required',
          desc: 'Automatically merge the audio and video files downloaded by h5player into one file without secondary coding, which can be quickly merged'
        }
      }
    },
    {
      title: '【Hello-AI】抢走你工作的不是AI，而是掌握使用AI工具的人',
      url: 'https://u.anzz.top/ai',
      i18n: {
        en: {
          title: '【Hello-AI】It\'s not AI that takes away your job, but the person who knows how to use AI tools'
        }
      }
    }
  ];

  function createRecommendModTemplate (refDom) {
    const refWidth = refDom.offsetWidth;
    if (refWidth < 500) { return '' }

    let recommendList = configManager$1.getGlobalStorage('recommendList') || defaultRecommendList;
    recommendList = recommendList.filter(item => !item.disabled);

    const curLang = i18n.language() || '';
    /* 兼容各种可能的语言配置写法 */
    const curLang2 = curLang.replace('-', '');
    const curLang3 = curLang.replace('-', '_');
    const curLang4 = curLang.split('-')[0];

    /* 根据当前的language和recommendList的languages配置过滤出符合当前语言的recommendList */
    recommendList = recommendList.filter(item => {
      const lang = item.lang || item.language || item.languages;
      if (lang) {
        return i18n.isMatchCurLang(lang)
      } else {
        return true
      }
    });

    if (!recommendList.length) { return '' }

    /* 从recommendList里随机取5条数据，多余的不予以展示 */
    if (recommendList.length > 5) { recommendList = recommendList.sort(() => Math.random() - 0.5).slice(0, 5); }

    /* 根据recommendList里的priority字段进行排序，priority值越大越靠前 */
    recommendList = recommendList.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const recommendHtml = recommendList.map(item => {
      let title = item.title || '';
      let desc = item.desc || '';
      let url = item.url || '';

      if (item.i18n) {
        const i18nInfo = item.i18n[`${curLang}`] || item.i18n[`${curLang2}`] || item.i18n[`${curLang3}`] || item.i18n[`${curLang4}`];
        if (i18nInfo) {
          title = i18nInfo.title || title;
          desc = i18nInfo.desc || desc;
          url = i18nInfo.url || url;
        }
      }

      return `<a class="h5p-recommend-item" href="${url}" title="${desc}" target="_blank">${title}</a>`
    }).join('');

    return `<div class="h5p-recommend-mod" >${recommendHtml}</div>`
  }

  /**
   * 注册Recommend切换逻辑，每4s检测一次当前哪个h5p-recommend-item上有h5p-recommend-item__active，然后将h5p-recommend-item__active切换到下一个元素，如此往复
   * 当鼠标移动到recommendWrap的时候停止切换，移开后继续切换
   */
  function registerRecommendModToggle (recommendWrap, reRender) {
    if (!reRender && (!recommendWrap || recommendWrap.__h5pRecommendModRegistered__)) { return }

    let recommendIndex = 0;
    recommendWrap.__stopToggle__ = false;

    const toggleRecommend = () => {
      if (recommendWrap.__stopToggle__) { return }
      const recommendItems = recommendWrap.querySelectorAll('.h5p-recommend-item');
      recommendItems.forEach((item, index) => {
        if (index === recommendIndex) {
          item.classList.add('h5p-recommend-item__active');
        } else {
          item.classList.remove('h5p-recommend-item__active');
        }
      });

      recommendIndex = (recommendIndex + 1) % recommendItems.length;
    };

    toggleRecommend();

    clearInterval(recommendWrap.__h5pRecommendModInterval__);
    recommendWrap.__h5pRecommendModInterval__ = setInterval(toggleRecommend, 3000);
    if (!reRender) {
      recommendWrap.addEventListener('mouseenter', () => { recommendWrap.__stopToggle__ = true; });
      recommendWrap.addEventListener('mouseleave', () => { recommendWrap.__stopToggle__ = false; });
    }

    recommendWrap.__h5pRecommendModRegistered__ = true;
  }

  /**
   * 通过事件委托的方式处理菜单点击事件，减少事件绑定，提升性能
   * @param { Event } event -必选 事件对象
   */
  function menuActionHandler (obj) {
    const { event, h5Player, h5playerUI, videoElement, popup, actionCallback } = obj;
    const target = event.target;

    /* 根据target查找是否包含data-action属性，注意这里可能需要使用closest来向上查找 */
    const actionDOM = target.closest('.h5p-menu-action');
    if (!actionDOM) {
      debug$1.log('[menuActionHandler]', '未找到actionDOM', event.target);
      return
    }

    const action = actionDOM.getAttribute('data-action');
    const args = JSON.parse(actionDOM.getAttribute('data-args') || null);
    const url = actionDOM.getAttribute('data-url');

    if (url) {
      globalFunctional.openInTab(url);
      return
    }

    h5Player.setPlayerInstance(videoElement);

    if (action === 'disableGUITemporarily') {
      h5playerUI.disableGUITemporarily();
      debug$1.log('[menuActionHandler][disableGUITemporarily]');
      return
    }

    if (action && (h5Player[action] instanceof Function || globalFunctional[action])) {
      // debug.log('[menuActionHandler]', actionDOM, action, args)

      try {
        if (action === 'setPlaybackRate') {
          /* 使用UI操作需强行跳过锁检测逻辑 */
          h5Player.setPlaybackRate(args, false, false, true);
        } else if (globalFunctional[action] && globalFunctional[action].fn instanceof Function) {
          globalFunctional[action].fn(args);
        } else {
          h5Player[action](args);
          popup && popup.reposition();
        }
      } catch (e) {
        debug$1.error('[menuActionHandler][error]', e);
      }

      if (actionCallback instanceof Function) {
        actionCallback(action, args);
      }
    }
  }

  // https://shoelace.style/getting-started/installation#bundling

  if (!window.h5playerUIProvider) {
    throw new Error('h5playerUIProvider is not defined, please check if you have imported h5playerUIProvider.js')
  }

  const { debug, parseHTML, observeVisibility, isOutOfDocument, configManager, device } = window.h5playerUIProvider;

  const popupWrapObjs = {};

  function removePopupWrapById (popupWrapId) {
    const popupWrap = document.querySelector(`#${popupWrapId}`);
    if (popupWrap) {
      popupWrap.remove();
    }

    delete popupWrapObjs[popupWrapId];
  }

  function removePopupWrapByElement (element) {
    if (!element) { return false }
    const popupWrapId = element.getAttribute('data-popup-wrap-id');
    if (popupWrapId) { removePopupWrapById(popupWrapId); }
  }

  /* 遍历popupWrapObjs，如果popupWrapObjs中的element元素的offsetParent为null，则移除掉 */
  function cleanPopupWrap () {
    const popupWrapIds = Object.keys(popupWrapObjs);
    popupWrapIds.forEach(popupWrapId => {
      const element = popupWrapObjs[popupWrapId];
      if (isOutOfDocument(element)) {
        removePopupWrapById(popupWrapId);
      }
    });
  }

  function getAllPopupWrapElement () {
    return document.querySelectorAll('.h5player-popup-wrap')
  }

  function findPopupWrapWithElement (videoElement) {
    const result = [];
    const popupWrapIds = Object.keys(popupWrapObjs);
    popupWrapIds.forEach(popupWrapId => {
      const element = popupWrapObjs[popupWrapId];
      if (element === videoElement) {
        result.push(popupWrapId);
      }
    });

    return result.map(id => document.querySelector(`#${id}`))
  }

  const h5playerUI = {
    async init () {
      debug.log('h5playerUI init');

      /* 插入组件相关的样式 */
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    },

    disableGUITemporarily () {
      this.__disableGUITemporarily__ = true;
      const popupWrapIds = Object.keys(popupWrapObjs);
      popupWrapIds.forEach(popupWrapId => {
        removePopupWrapById(popupWrapId);
      });
    },

    getAllPopupWrapElement,
    findPopupWrapWithElement,
    cleanPopupWrap,
    removePopupWrapById,
    removePopupWrapByElement,

    popup (element, h5Player) {
      if (this.__disableGUITemporarily__ || element.__disableGUITemporarily__) { return false }

      /* 如果element元素的宽高比大于2.5，说明可能为视频背景，则也不显示popup */
      if (element.videoWidth / element.videoHeight > 2.5) { return false }

      /* 防止popup渲染过于频繁 */
      if (this.lastRenderedPopupTime && Date.now() - this.lastRenderedPopupTime < 100) {
        return false
      } else {
        this.lastRenderedPopupTime = Date.now();
      }

      /* 防止popup死循环渲染 */
      if (element.__popupRenderedCount__ && element.__popupRenderedCount__ > 15) {
        return false
      } else {
        element.__popupRenderedCount__ = element.__popupRenderedCount__ ? element.__popupRenderedCount__ + 1 : 1;
      }

      if (!element || !element.tagName || element.tagName.toLowerCase() !== 'video' || isOutOfDocument(element)) {
        return false
      }

      let popupWrapId = element.getAttribute('data-popup-wrap-id');
      if (!popupWrapId) {
        popupWrapId = 'h5player-popup-wrap-' + Math.random().toString(36).substr(2);
        element.setAttribute('data-popup-wrap-id', popupWrapId);
      }

      let popupWrap = document.querySelector(`#${popupWrapId}`);

      if (!popupWrapObjs[popupWrapId]) {
        popupWrapObjs[popupWrapId] = element;
      }

      if (popupWrap) {
        const popup = popupWrap.querySelector('sl-popup');
        popup && popup.reposition();
        return
      }

      const menuTemplate = createMenuTemplate(menuConfigPreprocess(menuConfig, element));
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
    `, document.body)[0];

      setTimeout(() => { registerRecommendModToggle(popupWrap.querySelector('.h5p-recommend-wrap')); }, 100);

      const popup = popupWrap.querySelector('sl-popup');

      /**
       * 判断popup初始化是否异常，油管上使用了custom-elements-es5-adapter.js，会导致popup异常，故有此判断
       * 例如：https://www.youtube.com/watch?v=jsb-5H_hy0M
       * 例如：https://www.youtube.com/watch?v=-2xb7rGCi2k
       */
      function checkPopupUpdateComplete () {
        if (!popup || !popup.updateComplete || !popup.updateComplete.then) {
          // debug.error('[h5playerUI][popup][updateComplete], 组件初始化异常', popup, element)
          element.removeAttribute('data-popup-wrap-id');
          popupWrap.remove();
          delete popupWrapObjs[popupWrapId];
          return false
        }

        return true
      }

      /* 确保popup已经被渲染 */
      customElements.whenDefined('sl-popup').then(() => {
        if (!checkPopupUpdateComplete()) {
          return false
        }

        popup.updateComplete.then(() => {
          popup.anchor = element;
          popup.distance = -48;
          popup.active = true;
          setTimeout(() => { popup.reposition(); }, 600);
        });
      });

      /* 重新渲染h5p-action-mod对应的菜单，以便更新菜单状态 */
      function reRenderMenuMod () {
        const menuWrap = popupWrap.querySelector('.h5player-popup-content .h5p-menu-wrap');
        const actionMod = popupWrap.querySelector('.h5p-action-mod');
        if (menuWrap && actionMod) {
          menuWrap.removeChild(actionMod);

          const newMenuTemplate = createMenuTemplate(menuConfigPreprocess(menuConfig, element));
          parseHTML(newMenuTemplate, menuWrap);

          /* 图标加载失败时，移除图标元素 */
          const slIcons = popupWrap.querySelectorAll('sl-icon');
          slIcons && slIcons.forEach(slIcon => {
            slIcon.addEventListener('sl-error', (event) => {
              const parent = event.target.parentElement;
              event.target.remove();

              /* 改为只显示文字标题 */
              if (parent.getAttribute('data-title')) {
                parent.innerText = parent.getAttribute('data-title');
              }
            }, { once: true });
          });

          // debug.log('[h5playerUI][popup][reRenderMenuMod]')
        }
      }

      /* 油管首次渲染会莫名其妙的出错，所以此处延迟一段时间重新渲染一次菜单 */
      setTimeout(() => { reRenderMenuMod(); }, 400);

      /* 重新渲染h5p-recommend-mod对应的推荐模块，如果位置不够则对隐藏该模块 */
      function reRenderRecommendMod () {
        const recommendWrap = popupWrap.querySelector('.h5player-popup-content .h5p-recommend-wrap');
        const recommendMod = popupWrap.querySelector('.h5player-popup-content .h5p-recommend-wrap>div');
        if (recommendWrap && recommendMod) {
          recommendWrap.removeChild(recommendMod);

          const newRecommendModTemplate = `<div style="overflow:hidden">${createRecommendModTemplate(element)}</div>`;
          parseHTML(newRecommendModTemplate, recommendWrap);

          registerRecommendModToggle(recommendWrap, true);
          // debug.log('[h5playerUI][popup][reRenderRecommendMod]')
        }
      }

      const activeClass = 'h5player-popup-active';
      const fullActiveClass = 'h5player-popup-full-active';
      const alwaysShowUIBar = configManager.getGlobalStorage('ui.alwaysShow');

      /**
       * 鼠标移动到popupWrap上时增加fullActiveClass的样式类，移出一段时间后再移除fullActiveClass的样式类
       * 用于防止鼠标移动到popupWrap上时popupWrap被快速隐藏，以提示操作体验
       */
      let mouseleaveTimer = null;
      popupWrap.addEventListener('mouseenter', () => {
        /* 元素比例异常，不显示popup */
        if (element.videoWidth / element.videoHeight > 2.5) {
          element.__disableGUITemporarily__ = true;
          removePopupWrapByElement(element);
          return false
        }

        clearTimeout(mouseleaveTimer);
        if (isOutOfDocument(element)) {
          popupWrap.classList.remove(fullActiveClass);
        } else {
          popupWrap.classList.add(fullActiveClass);
        }
        popup.reposition();
      });
      popupWrap.addEventListener('mouseleave', () => {
        clearTimeout(mouseleaveTimer);

        if (isOutOfDocument(element)) {
          popupWrap.classList.remove(fullActiveClass);
        } else {
          mouseleaveTimer = setTimeout(() => {
            !alwaysShowUIBar && !element.paused && popupWrap.classList.remove(activeClass);
            !alwaysShowUIBar && !element.paused && popupWrap.classList.remove(fullActiveClass);

            /* 关闭popupWrap中的所有sl-dropdown */
            const dropdowns = popupWrap.querySelectorAll('sl-dropdown');
            dropdowns.forEach(dropdown => {
              dropdown._open_ = false;
              dropdown.open = false;
            });

            reRenderMenuMod();
          }, 500);
        }
      });

      // let lastOpenDropdownTime = Date.now()
      async function openDropdown (event) {
        // if (Date.now() - lastOpenDropdownTime < 100) { return false }
        // lastOpenDropdownTime = Date.now()

        const target = event.target;

        const actionBtnClass = 'h5p-action-btn';
        if (!(target.classList.contains(actionBtnClass) || target.parentElement.classList.contains(actionBtnClass))) {
          return false
        }

        const dropdowns = popupWrap.querySelectorAll('sl-dropdown');
        const curDropdown = target.parentElement.tagName.toLowerCase() === 'sl-dropdown' ? target.parentElement : target.parentElement.parentElement;
        const isDropdownDom = curDropdown && curDropdown.tagName.toLowerCase() === 'sl-dropdown';

        if (!isDropdownDom) {
          dropdowns.forEach(dropdown => {
            dropdown.open = false;
            dropdown._open_ = false;
          });
          return false
        }

        dropdowns.forEach(async (dropdown) => {
          if (dropdown !== curDropdown) {
            dropdown._open_ = false;
            await dropdown.hide();
          }
        });

        if (event.type === 'mousemove') {
          curDropdown._open_ = true;
          await curDropdown.show();
          return false
        }

        if (!curDropdown._open_) {
          await curDropdown.show();
          curDropdown._open_ = true;

          curDropdown.addEventListener('sl-after-hide', () => {
            curDropdown._open_ = false;
          }, { once: true });
        } else {
          await curDropdown.hide();
          curDropdown._open_ = false;

          curDropdown.addEventListener('sl-after-show', () => {
            curDropdown._open_ = true;
          }, { once: true });
        }
      }

      /* 移动端下如果注册了mousemove会导致click没法触发，或者导致事件相互干扰，没法唤起sl-dropdown */
      if (!device.isMobile()) {
        /* 鼠标在popupWrap上移动时，如果检测到isOutOfDocument(element)也移除fullActiveClass的样式类，注意需加上debounce */
        let lastCheckIsOutOfDocumentTime = Date.now();
        popupWrap.addEventListener('mousemove', (event) => {
          const now = Date.now();
          if (now - lastCheckIsOutOfDocumentTime > 100) {
            lastCheckIsOutOfDocumentTime = now;
            if (isOutOfDocument(element)) {
              clearTimeout(mouseleaveTimer);
              popupWrap.classList.remove(fullActiveClass);
            } else {
              popup.reposition();
            }
          }

          openDropdown(event);
        });
      }

      popupWrap.addEventListener('click', (event) => {
        openDropdown(event);
        menuActionHandler({
          event,
          videoElement: element,
          h5Player,
          h5playerUI: this,
          popup,
          actionCallback: (action, args) => {
            reRenderMenuMod();
          }
        });
      });

      observeVisibility((entry, observer) => {
        let activeStatus = false;
        if (entry) {
          if (!isOutOfDocument(element)) {
            activeStatus = true;
          }

          if (element && element.paused && !isOutOfDocument(element)) {
            if (element.currentTime && element.currentTime > 1.5) {
              popupWrap.classList.add(activeClass);
            }
          } else {
            if (alwaysShowUIBar) {
              popupWrap.classList.add(activeClass);
              popupWrap.classList.add(fullActiveClass);
            } else {
              popupWrap.classList.remove(activeClass);
              popupWrap.classList.remove(fullActiveClass);
            }
          }
        } else {
          activeStatus = false;
          popupWrap.classList.remove(activeClass);
          popupWrap.classList.remove(fullActiveClass);
        }

        if (!checkPopupUpdateComplete()) { return false }

        popup.updateComplete.then(() => {
          popup.active = activeStatus;
          popup.reposition();
        });
      }, element);

      popup.oldRect = element.getBoundingClientRect();
      popup.addEventListener('sl-reposition', () => {
        if (isOutOfDocument(element)) {
          popup.active = false;
          popupWrap.classList.remove(activeClass);
          popupWrap.classList.remove(fullActiveClass);
        } else {
          const newRect = element.getBoundingClientRect();
          if (newRect.width !== popup.oldRect.width) {
            popup.oldRect = newRect;
            reRenderMenuMod();
            reRenderRecommendMod();
          }
        }
      });

      /* element切换播放状态时，如果是播放状态，则隐藏popup，否则显示popup */
      element.addEventListener('play', () => {
        if (alwaysShowUIBar) {
          popupWrap.classList.add(activeClass);
          popupWrap.classList.add(fullActiveClass);
        } else {
          popupWrap.classList.remove(activeClass);
          popupWrap.classList.remove(fullActiveClass);
        }

        if (isOutOfDocument(element)) {
          popup.active = false;
        } else {
          popup.active = true;
        }
        popup.reposition();
        cleanPopupWrap();

        reRenderMenuMod();
      });

      element.addEventListener('pause', () => {
        reRenderMenuMod();

        if (alwaysShowUIBar) {
          popupWrap.classList.add(activeClass);
          popupWrap.classList.add(fullActiveClass);
        } else {
          if (element.currentTime && element.currentTime > 1.5) {
            popupWrap.classList.add(activeClass);
          }
        }

        if (isOutOfDocument(element)) {
          popup.active = false;
          popupWrap.classList.remove(activeClass);
          popupWrap.classList.remove(fullActiveClass);
        } else {
          popup.active = true;
        }

        popup.reposition();
        cleanPopupWrap();
      });

      /* element的播放进度发生变化时，执行一次popup.reposition() */
      let lastTimeupdateTime = Date.now();
      element.addEventListener('timeupdate', () => {
        const now = Date.now();
        if (!isOutOfDocument(element) && now - lastTimeupdateTime > 400) {
          lastTimeupdateTime = now;
          popup.reposition();
        }
      });

      /* 尝试清除popupWrapObjs中的无效元素 */
      cleanPopupWrap();

      // debug.log('[h5playerUI][popup]', popup, popupWrap, element)
    }
  };

  return h5playerUI;

})();return h5playerUI};

/* 定义支持哪些媒体标签 */
// const supportMediaTags = ['video', 'bwp-video', 'audio']
const supportMediaTags = ['video', 'bwp-video'];

let TCC = null;
const h5Player = {
  version,
  mediaCore,
  mediaPlusApi: null,
  mediaSource,
  configManager,
  /* 提示文本的字号 */
  fontSize: 12,
  enable: true,
  globalMode: true,
  playerInstance: null,
  scale: 1,
  translate: {
    x: 0,
    y: 0
  },
  rotate: 0,

  /* 水平镜像翻转, 0 或 180 */
  rotateY: 0,
  /* 垂直镜像翻转, 0 或 180 */
  rotateX: 0,

  defaultTransform: {
    scale: 1,
    translate: {
      x: 0,
      y: 0
    },
    rotate: 0,
    rotateY: 0,
    rotateX: 0
  },

  /* 存储旧的Transform值 */
  historyTransform: {},

  playbackRate: configManager.get('media.playbackRate'),
  volume: configManager.get('media.volume'),
  lastPlaybackRate: configManager.get('media.lastPlaybackRate'),
  /* 快进快退步长 */
  skipStep: 5,

  /* 监听鼠标活动的观察对象 */
  mouseObserver: new MouseObserver(),

  disableHotkeysTemporarily () {
    this.__disableHotkeysTemporarily__ = true;
  },
  enableHotkeys () {
    this.__disableHotkeysTemporarily__ = false;
  },
  toggleHotkeys () {
    const confirm = window.confirm(this.__disableHotkeysTemporarily__ ? i18n.t('enableHotkeys') : i18n.t('disableHotkeys'));
    if (confirm) {
      this.__disableHotkeysTemporarily__ = !this.__disableHotkeysTemporarily__;
    }
  },

  debuggerNow () {
    if (debug.isDebugMode()) {
      const script = document.createElement('script');
      script.innerText = 'debugger';
      document.body.appendChild(script);
    }
  },

  /* 关闭当前视频实例的UI界面，以便消除UI界面对其他元素遮挡等相关影响 */
  disableCurrentInstanceGUI () {
    const t = this;
    const player = t.player();
    if (player && t.UI && t.UI.removePopupWrapByElement) {
      player.__disableGUITemporarily__ = true;
      t.UI.removePopupWrapByElement(player);
    }
  },

  /* 获取当前播放器的实例 */
  player: function () {
    const t = this;
    let playerInstance = t.playerInstance;

    if (!playerInstance) {
      const mediaList = t.getPlayerList();
      if (mediaList.length) {
        playerInstance = mediaList[mediaList.length - 1];
        t.playerInstance = playerInstance;
        t.initPlayerInstance(mediaList.length === 1);
      }
    }

    if (playerInstance && !t.mediaPlusApi) {
      t.mediaPlusApi = mediaCore.mediaPlus(playerInstance);
    }

    return playerInstance
  },

  isAudioInstance () {
    return isAudioElement(this.player())
  },

  /* 每个网页可能存在的多个video播放器 */
  getPlayerList: function () {
    const list = mediaCore.mediaElementList || [];

    function findPlayer (context) {
      supportMediaTags.forEach(tagName => {
        context.querySelectorAll(tagName).forEach(function (player) {
          if (player.tagName.toLowerCase() === 'bwp-video') {
            /* 将B站的BWP-VIDEO标识为HTMLVideoElement */
            player.HTMLVideoElement = true;
          }

          if (isMediaElement(player) && !list.includes(player)) {
            list.push(player);
          }
        });
      });
    }

    findPlayer(document);

    // 被封装在 shadow dom 里面的video
    if (window._shadowDomList_) {
      window._shadowDomList_.forEach(function (shadowRoot) {
        findPlayer(shadowRoot);
      });
    }

    return list
  },

  getPlayerWrapDom: function () {
    const t = this;
    const player = t.player();
    if (!player) return

    let wrapDom = null;
    const playerBox = player.getBoundingClientRect();
    eachParentNode(player, function (parent) {
      if (parent === document || !parent.getBoundingClientRect) return
      const parentBox = parent.getBoundingClientRect();
      if (parentBox.width && parentBox.height) {
        if (parentBox.width === playerBox.width && parentBox.height === playerBox.height) {
          wrapDom = parent;
        }
      }
    });
    return wrapDom
  },

  /* 挂载到页面上的window对象，用于调试 */
  async mountToGlobal () {
    try {
      const pageWindow = await getPageWindow();
      if (pageWindow) {
        pageWindow._h5Player = h5Player || 'null';
        if (window.top !== window) {
          pageWindow._h5PlayerInFrame = h5Player || 'null';
        }
        pageWindow._window = window || '';
        debug.log('h5Player对象已成功挂载到全局');
      }
    } catch (e) {
      debug.error(e);
    }
  },

  /**
   * 初始化播放器实例
   * @param isSingle 是否为单实例video标签
   */
  initPlayerInstance (isSingle) {
    const t = this;
    if (!t.playerInstance) return

    const player = t.playerInstance;

    t.mediaPlusApi = mediaCore.mediaPlus(player);

    t.initPlaybackRate();
    t.isFoucs();
    t.proxyPlayerInstance(player);

    t.unLockPlaybackRate();
    t.setPlaybackRate();
    t.lockPlaybackRate(1000);

    /* 增加通用全屏，网页全屏api */
    player._fullScreen_ = new FullScreen(player);
    player._fullPageScreen_ = new FullScreen(player, true);

    /* 注册热键运行器 */
    t.registerHotkeysRunner();

    if (!player._hasCanplayEvent_) {
      player.addEventListener('canplay', function (event) {
        t.initAutoPlay(player);
      });
      player._hasCanplayEvent_ = true;
    }

    /* 播放的时候进行相关同步操作 */
    if (!player._hasPlayerInitEvent_) {
      let setPlaybackRateOnPlayingCount = 0;
      player.addEventListener('playing', function (event) {
        t.unLockPlaybackRate();
        t.setPlaybackRate(null, true);
        t.lockPlaybackRate(1000);

        /* 同步播放音量 */
        if (configManager.get('enhance.blockSetVolume') === true && event.target.muted === false) {
          t.setVolume(configManager.getGlobalStorage('media.volume'), true);
        }

        /* 禁止默认的进度控制 */
        if (configManager.get('enhance.blockSetCurrentTime') === true) {
          t.lockCurrentTime();
        }

        /* 恢复播放进度 */
        t.setPlayProgress(player);

        if (setPlaybackRateOnPlayingCount === 0) {
          /* 同步之前设定的播放速度，音量等 */
          t.unLockPlaybackRate();
          t.setPlaybackRate();
          t.lockPlaybackRate(1000);

          /* 启动播放进度记录 */
          setTimeout(() => {
            t.playProgressRecorder(player);
          }, 2000);
        } else {
          t.unLockPlaybackRate();
          t.setPlaybackRate(null, true);
          t.lockPlaybackRate(1000);
        }
        setPlaybackRateOnPlayingCount += 1;
      });

      player._hasPlayerInitEvent_ = true;
    }

    /* 进行自定义初始化操作 */
    const taskConf = TCC.getTaskConfig();
    if (taskConf.init) {
      TCC.doTask('init', player);
    }

    const needInitEvent = !player.__registeredInitEvent__;

    /* 注册鼠标响应事件 */
    needInitEvent && t.mouseObserver.on(player, 'click', function (event, offset, target) {
      // debug.log('捕捉到鼠标点击事件：', event, offset, target)
    });

    /* 画中画事件监听 */
    needInitEvent && player.addEventListener('enterpictureinpicture', () => {
      monkeyMsg.send('globalPictureInPictureInfo', {
        usePictureInPicture: true
      });
      debug.log('enterpictureinpicture', player);
    });
    needInitEvent && player.addEventListener('leavepictureinpicture', () => {
      t.leavepictureinpictureTime = Date.now();

      monkeyMsg.send('globalPictureInPictureInfo', {
        usePictureInPicture: false
      });
      debug.log('leavepictureinpicture', player);
    });

    // if (debug.isDebugMode()) {}

    /* 记录player使用过的src */
    function srcRecord (player) {
      const src = player.currentSrc || player.src;
      if (!src) { return }

      player.srcList = player.srcList || [src];
      if (!player.srcList.includes(src)) {
        player.srcList.push(src);
      }
    }

    function updataBufferedTime (player) {
      /* 随时记录缓存数据到了哪个时间节点 */
      if (player.buffered.length > 0) {
        const bufferedTime = player.buffered.end(player.buffered.length - 1);
        player.bufferedTime = bufferedTime;
      }

      if (t.autoGotoBufferedTime && player.bufferedTime && t.player() === player && player.bufferedTime < player.duration - 1 && player.currentTime < player.bufferedTime - 1) {
        t.setCurrentTime(player.bufferedTime);
      }
    }

    needInitEvent && player.addEventListener('loadeddata', function () {
      debug.log(`[player][loadeddata] ${player.src} video duration: ${player.duration} video dom:`, player);
      srcRecord(player);
    });
    needInitEvent && player.addEventListener('durationchange', function () {
      debug.log(`[player][durationchange] ${player.duration}`);
      srcRecord(player);
    });

    needInitEvent && player.addEventListener('loadstart', function () {
      debug.log('[player][loadstart]', player.currentSrc, player.src);
      srcRecord(player);
    });

    /* 注册UI界面 */
    t.UI && t.UI.popup && t.UI.popup(player, t);

    /* 在播放或暂停时，也尝试注册UI界面，这样即使popup被意外删除，也还是能正常再次创建回来 */
    needInitEvent && player.addEventListener('play', function () {
      t.UI && t.UI.popup && t.UI.popup(player, t);
    });
    needInitEvent && player.addEventListener('pause', function () {
      t.UI && t.UI.popup && t.UI.popup(player, t);
    });
    let lastRegisterUIPopupTime = Date.now();
    let tryRegisterUIPopupCount = 0;
    needInitEvent && player.addEventListener('timeupdate', function () {
      // updataBufferedTime(player)

      if (Date.now() - lastRegisterUIPopupTime > 800 && tryRegisterUIPopupCount < 60) {
        lastRegisterUIPopupTime = Date.now();
        tryRegisterUIPopupCount += 1;
        t.UI && t.UI.popup && t.UI.popup(player, t);
      }

      srcRecord(player);
      mediaSource.connectMediaSourceWithMediaElement(player);
    });

    let lastCleanMediaSourceDataTime = Date.now();
    needInitEvent && player.addEventListener('progress', () => {
      updataBufferedTime(player);
      mediaSource.connectMediaSourceWithMediaElement(player);

      if (Date.now() - lastCleanMediaSourceDataTime > 1000 * 10) {
        lastCleanMediaSourceDataTime = Date.now();
        mediaSource.cleanMediaSourceData();
      }
    });

    needInitEvent && player.addEventListener('durationchange', function () {
      lastRegisterUIPopupTime = Date.now();
      tryRegisterUIPopupCount = 0;
      t.UI && t.UI.popup && t.UI.popup(player, t);
    });

    player.__registeredInitEvent__ = true;
  },

  registerHotkeysRunner () {
    if (!this.hotkeysRunner) {
      this.hotkeysRunner = new HotkeysRunner(configManager.get('hotkeys'));

      if (isInIframe() && !isInCrossOriginFrame()) {
        /* 让顶层页面也可以监听组合键的触发 */
        this.hotkeysRunner.setCombinationKeysMonitor(window.top);
      }
    }
  },

  /* 刚关闭画中画不久，此段时间内允许跨TAB控制 */
  isLeavepictureinpictureAwhile () {
    const t = this;
    return t.leavepictureinpictureTime && (Date.now() - t.leavepictureinpictureTime < 1000 * 10)
  },

  /**
   * 对播放器实例的方法或属性进行代理
   * @param player
   */
  proxyPlayerInstance (player) {
    if (!player) return

    /* 要代理的方法或属性列表 */
    const proxyList = [
      'play',
      'pause'
    ];

    proxyList.forEach(key => {
      const originKey = 'origin_' + key;
      if (Reflect.has(player, key) && !Reflect.has(player, originKey)) {
        player[originKey] = player[key];
        const proxy = new Proxy(player[key], {
          apply (target, ctx, args) {
            // debug.log(key + '被调用')

            /* 处理挂起逻辑 */
            const hangUpInfo = player._hangUpInfo_ || {};
            const hangUpDetail = hangUpInfo[key] || hangUpInfo['hangUp_' + key];
            const needHangUp = hangUpDetail && hangUpDetail.timeout >= Date.now();
            if (needHangUp) {
              debug.log(key + '已被挂起，本次调用将被忽略');
              return false
            }

            return target.apply(ctx || player, args)
          }
        });

        player[key] = proxy;
      }
    });

    if (!player._hangUp_) {
      player._hangUpInfo_ = {};
      /**
       * 挂起player某个函数的调用
       * @param name {String} -必选 player方法或属性名，名字写对外，还须要该方法或属性被代理了才能进行挂起，否则这将是个无效的调用
       * @param timeout {Number} -可选 挂起多长时间，默认200ms
       * @private
       */
      player._hangUp_ = function (name, timeout) {
        timeout = Number(timeout) || 200;
        // debug.log('_hangUp_', name, timeout)
        player._hangUpInfo_[name] = {
          timeout: Date.now() + timeout
        };
      };

      /* 取消挂起 */
      player._unHangUp_ = function (name) {
        if (player._hangUpInfo_ && player._hangUpInfo_[name]) {
          player._hangUpInfo_[name].timeout = Date.now() - 1;
        }
      };
    }
  },

  /**
   * 初始化自动播放逻辑
   * 必须是配置了自动播放按钮选择器得的才会进行自动播放
   */
  initAutoPlay: function (p) {
    const t = this;
    const player = p || t.player();
    const taskConf = TCC.getTaskConfig();

    /* 注册开启禁止自动播放的控制菜单 */
    if (taskConf.autoPlay) {
      if (configManager.getLocalStorage('media.autoPlay') === null) {
        configManager.setLocalStorage('media.autoPlay', true);
      }

      addMenu({
        title: () => configManager.getLocalStorage('media.autoPlay') ? i18n.t('disableInitAutoPlay') : i18n.t('enableInitAutoPlay'),
        fn: () => {
          const confirm = window.confirm(configManager.getLocalStorage('media.autoPlay') ? i18n.t('disableInitAutoPlay') : i18n.t('enableInitAutoPlay'));
          if (confirm) {
            const autoPlay = configManager.getLocalStorage('media.autoPlay');
            if (autoPlay === null) {
              alert(i18n.t('configFail'));
            } else {
              configManager.setLocalStorage('media.autoPlay', !autoPlay);
            }
          }
        }
      });
    }

    // 在轮询重试的时候，如果实例变了，或处于隐藏页面中则不进行自动播放操作
    if (!configManager.get('media.autoPlay') || (!p && t.hasInitAutoPlay) || !player || (p && p !== t.player()) || document.hidden) {
      return false
    }

    /**
     * 元素不在可视范围，不允许进行初始化自动播放逻辑
     * 由于iframe下元素的可视范围判断不准确，所以iframe下也禁止初始化自动播放逻辑
     * TODO 待优化
     */
    if (!isInViewPort(player) || isInIframe()) {
      return false
    }

    if (!taskConf.autoPlay) {
      return false
    }

    t.hasInitAutoPlay = true;

    if (player && taskConf.autoPlay && player.paused) {
      TCC.doTask('autoPlay');
      if (player.paused) {
        // 轮询重试
        if (!player._initAutoPlayCount_) {
          player._initAutoPlayCount_ = 1;
        }
        player._initAutoPlayCount_ += 1;
        if (player._initAutoPlayCount_ >= 10) {
          return false
        }
        setTimeout(function () {
          t.initAutoPlay(player);
        }, 200);
      }
    }
  },

  printPlayerInfo (p) {
    const t = this;
    const player = p || t.player();

    const info = {
      curPlayer: player,
      srcList: player.srcList,
      h5player: t,
      h5playerUI: t.UI,
      mediaSource,
      window
    };

    if (t.UI && t.UI.findPopupWrapWithElement) {
      info.curlPopupWrap = t.UI.findPopupWrapWithElement(player);
      info.allPopupWrap = t.UI.getAllPopupWrapElement();
    }

    debug.info('[playerInfo]', info);
  },

  /* 设置视频全屏 */
  setFullScreen () {
    const player = this.player();
    const isDo = TCC.doTask('fullScreen');
    if (!isDo && player && player._fullScreen_) {
      player._fullScreen_.toggle();
    }
  },

  /* 设置页面全屏 */
  setWebFullScreen: function () {
    const t = this;
    const player = t.player();
    const isDo = TCC.doTask('webFullScreen');
    if (!isDo && player && player._fullPageScreen_) {
      player._fullPageScreen_.toggle();
    }
  },

  initPlaybackRate () {
    const t = this;
    t.playbackRate = t.getPlaybackRate();
  },

  playbackRateInfo: {
    lockTimeout: Date.now() - 1,
    time: Date.now(),
    /* 未初始化播放实列前，不知道倍速是多少，所以设置为-1 */
    value: -1
  },

  getPlaybackRate () {
    let playbackRate = configManager.get('media.playbackRate') || this.playbackRate;
    if (isInIframe()) {
      const globalPlaybackRate = configManager.getGlobalStorage('media.playbackRate');
      if (globalPlaybackRate) {
        playbackRate = globalPlaybackRate;
      }
    }
    return Number(Number(playbackRate).toFixed(1))
  },

  /* 锁定playbackRate，禁止调速 */
  lockPlaybackRate: function (timeout = 200) {
    if (this.mediaPlusApi) {
      if (configManager.get('enhance.blockSetPlaybackRate') === true) {
        // 如果配置了要锁死外部对playbackRate的操作，则直接给一个超大的值
        timeout = 1000 * 60 * 60 * 24 * 365;
      }

      this.mediaPlusApi.lockPlaybackRate(timeout);
      return true
    }

    this.playbackRateInfo.lockTimeout = Date.now() + timeout;
  },

  unLockPlaybackRate: function () {
    if (this.mediaPlusApi) {
      this.mediaPlusApi.unLockPlaybackRate();
      return true
    }

    this.playbackRateInfo.lockTimeout = Date.now() - 1;
  },

  isLockPlaybackRate: function () {
    if (this.mediaPlusApi) {
      return this.mediaPlusApi.isLockPlaybackRate()
    }

    return Date.now() - this.playbackRateInfo.lockTimeout < 0
  },

  /* 解决高低倍速频繁切换后，音画不同步的问题 */
  fixPlaybackRate: function (oldPlaybackRate) {
    const t = this;
    const curPlaybackRate = t.getPlaybackRate();

    if (Math.abs(curPlaybackRate - oldPlaybackRate) > 1) {
      t.setCurrentTimeUp(0.1, true);
    }
  },

  /* 设置播放速度 */
  setPlaybackRate: function (num, notips, duplicate, skipLock) {
    const t = this;
    const player = t.player();

    if (!skipLock && t.isLockPlaybackRate()) {
      debug.info('调速能力已被锁定');
      return false
    }

    if (TCC.doTask('playbackRate')) {
      // debug.log('[TCC][playbackRate]', 'suc')
      return
    }

    if (!player) return

    const oldPlaybackRate = t.getPlaybackRate();

    let curPlaybackRate;
    if (num) {
      num = Number(num);
      if (Number.isNaN(num)) {
        debug.error('h5player: 播放速度转换出错');
        return false
      }

      if (num <= 0) {
        num = 0.1;
      } else if (num > 16) {
        num = 16;
      }

      num = Number(num.toFixed(1));
      curPlaybackRate = num;
    } else {
      curPlaybackRate = t.getPlaybackRate();
    }

    /* 记录播放速度的信息 */
    t.playbackRate = curPlaybackRate;
    if (isInIframe()) {
      configManager.setGlobalStorage('media.playbackRate', curPlaybackRate);
    } else {
      configManager.set('media.playbackRate', curPlaybackRate);
    }

    if (t.mediaPlusApi) {
      t.mediaPlusApi.setPlaybackRate(curPlaybackRate);

      if (!(!num && curPlaybackRate === 1) && !notips) {
        t.tips(i18n.t('tipsMsg.playspeed') + player.playbackRate);
      }

      /* 将播放倍速同步到全部媒体元素 */
      const mediaList = t.getPlayerList();
      mediaList.forEach(media => {
        if (media !== player) {
          const mediaPlusApi = mediaCore.mediaPlus(media);
          mediaPlusApi && mediaPlusApi.setPlaybackRate(curPlaybackRate);
        }
      });

      t.fixPlaybackRate(oldPlaybackRate);
      return true
    }

    delete player.playbackRate;
    player.playbackRate = curPlaybackRate;

    t.playbackRateInfo.time = Date.now();
    t.playbackRateInfo.value = curPlaybackRate;
    player._setPlaybackRate_ = {
      time: Date.now(),
      value: curPlaybackRate
    };

    try {
      const playbackRateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
      originalMethods.Object.defineProperty.call(Object, player, 'playbackRate', {
        configurable: true,
        get: function () {
          /**
           * 在油管，如果返回的是playbackRateDescriptor.get.apply(player, arguments)，调速会出现波动和异常
           * 暂时不知是什么原因，所以还是先返回curPlaybackRate
           */
          return curPlaybackRate || playbackRateDescriptor.get.apply(player, arguments)
        },
        set: function (val) {
          if (typeof val !== 'number') {
            return false
          }

          /* 有些网站是通过定时器不断刷playbackRate的，所以通过计时器减少不必要的信息输出 */
          !Number.isInteger(player._blockSetPlaybackRateTips_) && (player._blockSetPlaybackRateTips_ = 0);

          if (TCC.doTask('blockSetPlaybackRate')) {
            player._blockSetPlaybackRateTips_++;
            player._blockSetPlaybackRateTips_ < 3 && debug.info('调速能力已被自定义的调速任务进行处理');
            return false
          }

          if (configManager.get('enhance.blockSetPlaybackRate') === true) {
            player._blockSetPlaybackRateTips_++;
            player._blockSetPlaybackRateTips_ < 3 && debug.info('调速能力已被blockSetPlaybackRate锁定');
            return false
          } else {
            t.setPlaybackRate(val);
          }
        }
      });
    } catch (e) {
      debug.error('解锁playbackRate失败', e);
    }

    /* 本身处于1倍播放速度的时候不再提示 */
    if (!num && curPlaybackRate === 1) {
      return true
    } else {
      !notips && t.tips(i18n.t('tipsMsg.playspeed') + player.playbackRate);
    }

    /**
     * 重复触发最后一次倍速的设定
     * 解决YouTube快速调速时并不生效，要停顿下来再调节一下才能生效的问题
     */
    if (!duplicate && configManager.get('enhance.blockSetPlaybackRate') === true) {
      clearTimeout(t._setPlaybackRateDuplicate_);
      clearTimeout(t._setPlaybackRateDuplicate2_);
      const duplicatePlaybackRate = () => {
        t.unLockPlaybackRate();
        t.setPlaybackRate(curPlaybackRate, true, true);
        t.lockPlaybackRate(1000);
      };
      t._setPlaybackRateDuplicate_ = setTimeout(duplicatePlaybackRate, 600);
      /* 600ms时重新触发无效的话，再来个1200ms后触发，如果是1200ms才生效，则调速生效的延迟已经非常明显了 */
      t._setPlaybackRateDuplicate2_ = setTimeout(duplicatePlaybackRate, 1200);
    }

    t.fixPlaybackRate(oldPlaybackRate);
  },

  /**
   * 加强版的倍速调节，当短时间内设置同一个值时，会认为需更快的跳速能力
   * 则会对调速的数值进行叠加放大，从而达到快速跳跃地进行倍速调节的目的
   * 可用于视频广告的高速快进，片头片尾的速看等场景
   * @param {*} num
   */
  setPlaybackRatePlus: function (num) {
    num = Number(num);
    if (!num || Number.isNaN(num)) {
      return false
    }

    const t = this;
    t.playbackRatePlusInfo = t.playbackRatePlusInfo || {};
    t.playbackRatePlusInfo[num] = t.playbackRatePlusInfo[num] || {
      time: Date.now() - 1000,
      value: num
    };

    if (Date.now() - t.playbackRatePlusInfo[num].time < 300) {
      t.playbackRatePlusInfo[num].value = t.playbackRatePlusInfo[num].value + num;
    } else {
      t.playbackRatePlusInfo[num].value = num;
    }

    t.playbackRatePlusInfo[num].time = Date.now();

    t.unLockPlaybackRate();
    t.setPlaybackRate(t.playbackRatePlusInfo[num].value);
    t.lockPlaybackRate(1000);
  },

  /* 恢复播放速度，还原到1倍速度、或恢复到上次的倍速 */
  resetPlaybackRate: function (player) {
    const t = this;
    player = player || t.player();

    t.unLockPlaybackRate();

    const oldPlaybackRate = Number(player.playbackRate);
    const playbackRate = oldPlaybackRate === 1 ? t.lastPlaybackRate : 1;
    if (oldPlaybackRate !== 1) {
      t.lastPlaybackRate = oldPlaybackRate;
      configManager.setLocalStorage('media.lastPlaybackRate', oldPlaybackRate);
    }

    t.setPlaybackRate(playbackRate);

    /* 防止外部调速逻辑的干扰，所以锁定一段时间 */
    t.lockPlaybackRate(1000);
  },

  /* 提升播放速率 */
  setPlaybackRateUp (num) {
    num = numUp(num) || 0.1;
    if (this.player()) {
      this.unLockPlaybackRate();
      this.setPlaybackRate(this.player().playbackRate + num);

      /* 防止外部调速逻辑的干扰，所以锁定一段时间 */
      this.lockPlaybackRate(1000);
    }
  },

  /* 降低播放速率 */
  setPlaybackRateDown (num) {
    num = numDown(num) || -0.1;
    if (this.player()) {
      this.unLockPlaybackRate();
      this.setPlaybackRate(this.player().playbackRate + num);

      /* 防止外部调速逻辑的干扰，所以锁定一段时间 */
      this.lockPlaybackRate(1000);
    }
  },

  /**
   * 锁定播放进度的控制逻辑
   * 跟锁定音量和倍速不一样，播放进度是跟视频实例有密切相关的，所以其锁定信息必须依附于播放实例
   */
  lockCurrentTime: function (timeout = 200) {
    if (this.mediaPlusApi) {
      if (configManager.get('enhance.blockSetCurrentTime') === true) {
        // 如果配置了要锁死外部对currentTime的操作，则直接给一个超大的值
        timeout = 1000 * 60 * 60 * 24 * 365;
      }

      this.mediaPlusApi.lockCurrentTime(timeout);
      return true
    }

    const player = this.player();
    if (player) {
      player.currentTimeInfo = player.currentTimeInfo || {};
      player.currentTimeInfo.lockTimeout = Date.now() + timeout;
    }
  },

  unLockCurrentTime: function () {
    if (this.mediaPlusApi) {
      this.mediaPlusApi.unLockCurrentTime();
      return true
    }

    const player = this.player();
    if (player) {
      player.currentTimeInfo = player.currentTimeInfo || {};
      player.currentTimeInfo.lockTimeout = Date.now() - 1;
    }
  },

  isLockCurrentTime: function () {
    if (this.mediaPlusApi) {
      return this.mediaPlusApi.isLockCurrentTime()
    }

    const player = this.player();
    if (player && player.currentTimeInfo && player.currentTimeInfo.lockTimeout) {
      return Date.now() - player.currentTimeInfo.lockTimeout < 0
    } else {
      return false
    }
  },

  /* 设置播放进度 */
  setCurrentTime: function (num) {
    if (!num && num !== 0) return
    num = Number(num);
    const _num = Math.abs(Number(num.toFixed(1)));

    const t = this;
    const player = t.player();

    if (t.isLockCurrentTime()) {
      return false
    }

    if (TCC.doTask('currentTime')) {
      // debug.log('[TCC][currentTime]', 'suc')
      return
    }

    if (this.mediaPlusApi) {
      this.mediaPlusApi.setCurrentTime(_num);
      return true
    }

    delete player.currentTime;
    player.currentTime = _num;
    player.currentTimeInfo = player.currentTimeInfo || {};
    player.currentTimeInfo.time = Date.now();
    player.currentTimeInfo.value = _num;

    try {
      const currentTimeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
      originalMethods.Object.defineProperty.call(Object, player, 'currentTime', {
        configurable: true,
        enumerable: true,
        get: function () {
          return currentTimeDescriptor.get.apply(player, arguments)
        },
        set: function (val) {
          if (typeof val !== 'number' || TCC.doTask('blockSetCurrentTime') || configManager.get('enhance.blockSetCurrentTime') === true) {
            return false
          }

          if (t.isLockCurrentTime()) {
            return false
          }

          player.currentTimeInfo.time = Date.now();
          player.currentTimeInfo.value = val;

          return currentTimeDescriptor.set.apply(player, arguments)
        }
      });
    } catch (e) {
      debug.error('解锁currentTime失败', e);
    }
  },

  setCurrentTimeUp (num, hideTips) {
    num = Number(numUp(num) || this.skipStep);

    if (TCC.doTask('addCurrentTime')) ; else {
      if (this.player()) {
        this.unLockCurrentTime();
        this.setCurrentTime(this.player().currentTime + num);

        /* 防止外部进度控制逻辑的干扰，所以锁定一段时间 */
        this.lockCurrentTime(500);

        if (!hideTips) {
          this.tips(i18n.t('tipsMsg.forward') + num + i18n.t('tipsMsg.seconds'));
        }
      }
    }
  },

  setCurrentTimeDown (num) {
    num = Number(numDown(num) || -this.skipStep);

    if (TCC.doTask('subtractCurrentTime')) ; else {
      if (this.player()) {
        let currentTime = this.player().currentTime + num;
        if (currentTime < 1) {
          currentTime = 0;
        }

        this.unLockCurrentTime();
        this.setCurrentTime(currentTime);

        /* 防止外部进度控制逻辑的干扰，所以锁定一段时间 */
        this.lockCurrentTime(500);

        this.tips(i18n.t('tipsMsg.backward') + Math.abs(num) + i18n.t('tipsMsg.seconds'));
      }
    }
  },

  volumeInfo: {
    lockTimeout: Date.now() - 1,
    time: Date.now(),
    /* 未初始化播放实列前，不知道音量是多少，所以设置为-1 */
    value: -1
  },

  getVolume: function () {
    let volume = configManager.get('media.volume');
    if (isInIframe() || configManager.get('enhance.blockSetVolume') === true) {
      const globalVolume = configManager.getGlobalStorage('media.volume');
      if (globalVolume !== null) {
        volume = globalVolume;
      }
    }
    return Number(Number(volume).toFixed(2))
  },

  /* 锁定音量，禁止调音 */
  lockVolume: function (timeout = 200) {
    if (this.mediaPlusApi) {
      if (configManager.get('enhance.blockSetVolume') === true) {
        // 如果配置了要锁死外部对voluem的操作，则直接给一个超大的值
        timeout = 1000 * 60 * 60 * 24 * 365;
      }

      this.mediaPlusApi.lockVolume(timeout);
      return true
    }

    this.volumeInfo.lockTimeout = Date.now() + timeout;
  },

  unLockVolume: function () {
    if (this.mediaPlusApi) {
      this.mediaPlusApi.unLockVolume();
      return true
    }

    this.volumeInfo.lockTimeout = Date.now() - 1;
  },

  isLockVolume: function () {
    if (this.mediaPlusApi) {
      return this.mediaPlusApi.isLockVolume()
    }

    return Date.now() - this.volumeInfo.lockTimeout < 0
  },

  /* 设置声音大小 */
  setVolume: function (num, notips, outerCall) {
    const t = this;
    const player = t.player();

    if (t.isLockVolume()) {
      return false
    }

    if (!num && num !== 0) {
      num = t.getVolume();
    }

    num = Number(num).toFixed(2);
    if (num < 0) {
      num = 0;
    }

    if (num > 1 && configManager.get('enhance.allowAcousticGain')) {
      num = Math.ceil(num);

      try {
        player._amp_ = player._amp_ || new MediaElementAmplifier(player);
      } catch (e) {
        num = 1;
        debug.error('媒体声音响度增益逻辑异常', e);
      }

      /* 限定增益的最大值 */
      if (num > 6) {
        num = 6;
      }

      if (!player._amp_ || !player._amp_.setLoudness) {
        num = 1;
      }
    } else if (num > 1) {
      num = 1;
    }

    /* 记录播放音量信息 */
    t.volume = num;

    /* 使用音量增益逻辑，增益音量不进行本地存储记录 */
    if (num > 1 && player._amp_ && player._amp_.setLoudness) {
      player._amp_.setLoudness(num);

      if (!outerCall) { player.muted = false; }

      !notips && t.tips(i18n.t('tipsMsg.volume') + parseInt(num * 100) + '%');
      return true
    }

    if (isInIframe() || configManager.get('enhance.blockSetVolume') === true) {
      configManager.setGlobalStorage('media.volume', num);
    } else {
      configManager.setLocalStorage('media.volume', num);
    }

    if (t.mediaPlusApi) {
      t.mediaPlusApi.setVolume(num);

      /* 将播放音量同步到全部媒体元素 */
      const mediaList = t.getPlayerList();
      mediaList.forEach(media => {
        if (media !== player) {
          const mediaPlusApi = mediaCore.mediaPlus(media);
          mediaPlusApi && mediaPlusApi.setVolume(num);
        }
      });
    } else {
      delete player.volume;
      player.volume = num;
      t.volumeInfo.time = Date.now();
      t.volumeInfo.value = num;

      try {
        const volumeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
        originalMethods.Object.defineProperty.call(Object, player, 'volume', {
          configurable: true,
          get: function () {
            return volumeDescriptor.get.apply(player, arguments)
          },
          set: function (val) {
            if (typeof val !== 'number' || val < 0) {
              return false
            }

            if (TCC.doTask('blockSetVolume') || configManager.get('enhance.blockSetVolume') === true) {
              return false
            } else {
              t.setVolume(val, false, true);
            }
          }
        });
      } catch (e) {
        debug.error('解锁volume失败', e);
      }
    }

    /* 调节音量的时候顺便把静音模式关闭 */
    if (!outerCall) { player.muted = false; }

    !notips && t.tips(i18n.t('tipsMsg.volume') + parseInt(player.volume * 100) + '%');
  },

  setVolumeUp (num) {
    num = numUp(num) || 0.2;
    const player = this.player();
    if (player) {
      this.unLockVolume();

      if (this.volume > 1 && player._amp_) {
        this.setVolume(this.volume + num);
      } else {
        this.setVolume(player.volume + num);
      }

      /* 防止外部调音逻辑的干扰，所以锁定一段时间 */
      this.lockVolume(500);
    }
  },

  setVolumeDown (num) {
    num = numDown(num) || -0.2;
    const player = this.player();
    if (player) {
      this.unLockVolume();

      if (this.volume > 1 && player._amp_) {
        this.setVolume(Math.floor(this.volume + num));
      } else {
        this.setVolume(player.volume + num);
      }

      /* 防止外部调音逻辑的干扰，所以锁定一段时间 */
      this.lockVolume(500);
    }
  },

  /* 采集Transform值的历史变更记录，以便后续进行还原 */
  collectTransformHistoryInfo () {
    const t = this;
    Object.keys(t.defaultTransform).forEach(key => {
      if (key === 'translate') {
        const translate = t.defaultTransform.translate;
        t.historyTransform.translate = t.historyTransform.translate || {};
        Object.keys(translate).forEach(subKey => {
          if (Number(t.translate[subKey]) !== t.defaultTransform.translate[subKey]) {
            t.historyTransform.translate[subKey] = t.translate[subKey];
          }
        });
      } else {
        if (Number(t[key]) !== t.defaultTransform[key]) {
          t.historyTransform[key] = t[key];
        }
      }
    });
  },

  /* 判断h5Player下的Transform值是否跟默认的Transform值一致 */
  isSameAsDefaultTransform () {
    let result = true;
    const t = this;
    Object.keys(t.defaultTransform).forEach(key => {
      if (isObj$1(t.defaultTransform[key])) {
        Object.keys(t.defaultTransform[key]).forEach(subKey => {
          if (Number(t[key][subKey]) !== t.defaultTransform[key][subKey]) {
            result = false;
          }
        });
      } else {
        if (Number(t[key]) !== t.defaultTransform[key]) {
          result = false;
        }
      }
    });
    return result
  },

  /* 设置视频画面的缩放与位移 */
  setTransform (notTips) {
    const t = this;
    const player = t.player();
    const scale = t.scale = Number(t.scale).toFixed(2);
    const translate = t.translate;

    const mirror = t.rotateX === 180 ? `rotateX(${t.rotateX}deg)` : (t.rotateY === 180 ? `rotateY(${t.rotateY}deg)` : '');
    player.style.transform = `scale(${scale}) translate(${translate.x}px, ${translate.y}px) rotate(${t.rotate}deg) ${mirror}`;

    let tipsMsg = i18n.t('tipsMsg.videozoom') + `${(scale * 100).toFixed(0)}%`;
    if (translate.x) {
      tipsMsg += ` ${i18n.t('tipsMsg.horizontal')}${t.translate.x}px`;
    }
    if (translate.y) {
      tipsMsg += ` ${i18n.t('tipsMsg.vertical')}${t.translate.y}px`;
    }

    if (notTips === true) ; else {
      t.collectTransformHistoryInfo();
      t.tips(tipsMsg);
    }

    /* 始终保持transform样式的正常 */
    if (!t._transformStateGuard_) {
      t._transformStateGuard_ = setInterval(() => {
        t.setTransform(true);
      }, 300);
    }
  },

  /* 视频画面旋转 90 度 */
  setRotate () {
    const t = this;
    t.rotate += 90;
    if (t.rotate % 360 === 0) t.rotate = 0;
    t.setTransform(true);
    t.tips(i18n.t('tipsMsg.imgrotate') + t.rotate + '°');
  },

  /* 设置镜像翻转 */
  setMirror (vertical = false) {
    const t = this;
    let tipsMsg = '';
    if (vertical) {
      t.rotateX = t.rotateX === 0 ? 180 : 0;
      tipsMsg += ` ${i18n.t('tipsMsg.verticalMirror')} ${t.rotateX}deg`;
    } else {
      t.rotateY = t.rotateY === 0 ? 180 : 0;
      tipsMsg += ` ${i18n.t('tipsMsg.horizontalMirror')} ${t.rotateY}deg`;
    }

    t.setTransform(true);
    t.tips(tipsMsg);
  },

  /* 缩放视频画面 */
  setScale (num) {
    if (Number.isNaN(this.scale) || Number.isNaN(num)) {
      this.scale = 1;
    } else {
      this.scale = num;
    }

    this.setTransform();
  },

  /* 视频放大 +0.1 */
  setScaleUp (num) {
    num = numUp(num) || 0.05;
    this.setScale(Number(this.scale) + num);
  },

  /* 视频缩小 -0.1 */
  setScaleDown (num) {
    num = numDown(num) || -0.05;
    this.setScale(Number(this.scale) + num);
  },

  /* 设置视频画面的位移属性 */
  setTranslate (x, y) {
    if (typeof x === 'number') {
      this.translate.x = x;
    }

    if (typeof y === 'number') {
      this.translate.y = y;
    }

    this.setTransform();
  },

  /* 视频画面向右平移 */
  setTranslateRight (num) {
    num = numUp(num) || 10;
    this.setTranslate(this.translate.x + num);
  },

  /* 视频画面向左平移 */
  setTranslateLeft (num) {
    num = numDown(num) || -10;
    this.setTranslate(this.translate.x + num);
  },

  /* 视频画面向上平移 */
  setTranslateUp (num) {
    num = numUp(num) || 10;
    this.setTranslate(null, this.translate.y - num);
  },

  /* 视频画面向下平移 */
  setTranslateDown (num) {
    num = numDown(num) || -10;
    this.setTranslate(null, this.translate.y - num);
  },

  resetTransform (notTips) {
    const t = this;

    if (t.isSameAsDefaultTransform() && Object.keys(t.historyTransform).length) {
      /* 还原成历史记录中的Transform值 */
      Object.keys(t.historyTransform).forEach(key => {
        if (isObj$1(t.historyTransform[key])) {
          Object.keys(t.historyTransform[key]).forEach(subKey => {
            t[key][subKey] = t.historyTransform[key][subKey];
          });
        } else {
          t[key] = t.historyTransform[key];
        }
      });
    } else {
      /* 还原成默认的Transform值 */
      const defaultTransform = clone(t.defaultTransform);
      Object.keys(defaultTransform).forEach(key => {
        t[key] = defaultTransform[key];
      });
    }

    t.setTransform(notTips);
  },

  /**
   * 定格帧画面
   * @param perFps {Number} -可选 默认 1，即定格到下一帧，如果是-1则为定格到上一帧
   */
  freezeFrame (perFps) {
    perFps = perFps || 1;
    const t = this;
    const player = t.player();

    /* 跳帧 */
    player.currentTime += Number(perFps / t.fps);

    /* 定格画面 */
    if (!player.paused) player.pause();

    /* 有些播放器发现画面所在位置变了会自动进行播放，所以此时需要对播放操作进行挂起 */
    player._hangUp_ && player._hangUp_('play', 400);

    if (perFps === 1) {
      t.tips(i18n.t('tipsMsg.nextframe'));
    } else if (perFps === -1) {
      t.tips(i18n.t('tipsMsg.previousframe'));
    } else {
      t.tips(i18n.t('tipsMsg.stopframe') + perFps);
    }
  },

  autoGotoBufferedTime: false,
  toggleAutoGotoBufferedTime () {
    const t = this;
    t.autoGotoBufferedTime = !t.autoGotoBufferedTime;
    t.tips(t.autoGotoBufferedTime ? i18n.t('autoGotoBufferedTime') : i18n.t('disableAutoGotoBufferedTime'));
  },

  /**
   * 切换画中画功能
   */
  togglePictureInPicture () {
    const player = this.player();
    if (window._isPictureInPicture_ && document.pictureInPictureElement) {
      document.exitPictureInPicture().then(() => {
        window._isPictureInPicture_ = null;
      }).catch((e) => {
        window._isPictureInPicture_ = null;
        debug.error('[togglePictureInPicture]', e);
      });
    } else {
      player.requestPictureInPicture && player.requestPictureInPicture().then(() => {
        window._isPictureInPicture_ = true;
      }).catch((e) => {
        window._isPictureInPicture_ = null;
        debug.error('[togglePictureInPicture]', e);
      });
    }
  },

  /* 播放下一个视频，默认是没有这个功能的，只有在TCC里配置了next字段才会有该功能 */
  setNextVideo () {
    const isDo = TCC.doTask('next');
    if (!isDo) {
      debug.log('当前网页不支持一键播放下个视频功能~');
    }
  },

  /* 切换播放状态 */
  switchPlayStatus () {
    const t = this;
    const player = t.player();

    if (TCC.doTask('switchPlayStatus')) {
      // debug.log('[TCC][switchPlayStatus]', 'suc')
      return
    }

    if (player.paused) {
      if (TCC.doTask('play')) ; else {
        if (t.mediaPlusApi) {
          t.mediaPlusApi.lockPause(400);
          t.mediaPlusApi.applyPlay();
        } else {
          /* 挂起其它逻辑的暂停操作，确保播放状态生效 */
          if (player._hangUp_ instanceof Function) {
            player._hangUp_('pause', 400);
            player._unHangUp_('play');
          }

          player.play();
        }

        t.tips(i18n.t('tipsMsg.play'));
      }

      TCC.doTask('afterPlay');
    } else {
      if (TCC.doTask('pause')) ; else {
        if (t.mediaPlusApi) {
          t.mediaPlusApi.lockPlay(400);
          t.mediaPlusApi.applyPause();
        } else {
          /* 挂起其它逻辑的播放操作，确保暂停状态生效 */
          if (player._hangUp_ instanceof Function) {
            player._hangUp_('play', 400);
            player._unHangUp_('pause');
          }

          player.pause();
        }

        t.tips(i18n.t('tipsMsg.pause'));
      }

      TCC.doTask('afterPause');
    }
  },

  isAllowRestorePlayProgress: function () {
    const allowRestoreVal = configManager.get(`media.allowRestorePlayProgress.${window.location.host}`);
    return allowRestoreVal === null || allowRestoreVal
  },
  /* 切换自动恢复播放进度的状态 */
  switchRestorePlayProgressStatus: function () {
    const t = h5Player;
    let isAllowRestorePlayProgress = t.isAllowRestorePlayProgress();

    if (isInCrossOriginFrame()) {
      isAllowRestorePlayProgress = false;
    } else {
      /* 进行值反转 */
      isAllowRestorePlayProgress = !isAllowRestorePlayProgress;
    }

    configManager.set(`media.allowRestorePlayProgress.${window.location.host}`, isAllowRestorePlayProgress);

    /* 操作提示 */
    if (isAllowRestorePlayProgress) {
      t.tips(i18n.t('tipsMsg.arpl'));
      t.setPlayProgress(t.player());
    } else {
      t.tips(i18n.t('tipsMsg.drpl'));
    }
  },
  tipsClassName: 'html_player_enhance_tips',

  getTipsContainer: function (videoEl) {
    const t = h5Player;
    const player = videoEl || t.player();
    // 使用getContainer获取到的父节点弊端太多，暂时弃用
    // const _tispContainer_ = player._tispContainer_  ||  getContainer(player);

    let tispContainer = player.parentNode || player;

    /* 如果父节点为无长宽的元素，则再往上查找一级 */
    const containerBox = tispContainer.getBoundingClientRect();
    if ((!containerBox.width || !containerBox.height) && tispContainer.parentNode) {
      tispContainer = tispContainer.parentNode;
    }

    return tispContainer
  },
  tips: function (str) {
    const t = h5Player;
    const player = t.player();
    if (!player) {
      debug.log('h5Player Tips:', str);
      return true
    }

    const isAudio = t.isAudioInstance();
    const parentNode = isAudio ? document.body : t.getTipsContainer();

    if (parentNode === player) {
      debug.info('获取tips的包裹容器异常：', player, str);
      return false
    }

    let backupStyle = '';
    if (!isAudio) {
      // 修复部分提示按钮位置异常问题
      const defStyle = parentNode.getAttribute('style') || '';

      backupStyle = parentNode.getAttribute('style-backup') || '';
      if (!backupStyle) {
        let backupSty = defStyle || 'style-backup: none';
        const backupStyObj = inlineStyleToObj(backupSty);

        /**
         * 修复因为缓存时机获取到错误样式的问题
         * 例如在：https://www.xuetangx.com/
         */
        if (backupStyObj.opacity === '0') {
          backupStyObj.opacity = '1';
        }
        if (backupStyObj.visibility === 'hidden') {
          backupStyObj.visibility = 'visible';
        }

        backupSty = objToInlineStyle(backupStyObj);

        parentNode.setAttribute('style-backup', backupSty);
        backupStyle = defStyle;
      } else {
        /* 如果defStyle被外部修改了，则需要更新备份样式 */
        if (defStyle && !defStyle.includes('style-backup')) {
          backupStyle = defStyle;
        }
      }

      const newStyleArr = backupStyle.split(';');

      const oldPosition = parentNode.getAttribute('def-position') || window.getComputedStyle(parentNode).position;
      if (parentNode.getAttribute('def-position') === null) {
        parentNode.setAttribute('def-position', oldPosition || '');
      }
      if (['static', 'inherit', 'initial', 'unset', ''].includes(oldPosition)) {
        newStyleArr.push('position: relative');
      }

      const playerBox = player.getBoundingClientRect();
      const parentNodeBox = parentNode.getBoundingClientRect();
      /* 不存在高宽时，给包裹节点一个最小高宽，才能保证提示能正常显示 */
      if (!parentNodeBox.width || !parentNodeBox.height) {
        newStyleArr.push('min-width:' + playerBox.width + 'px');
        newStyleArr.push('min-height:' + playerBox.height + 'px');
      }

      parentNode.setAttribute('style', newStyleArr.join(';'));

      const newPlayerBox = player.getBoundingClientRect();
      if (Math.abs(newPlayerBox.height - playerBox.height) > 50) {
        parentNode.setAttribute('style', backupStyle);
        // debug.info('应用新样式后给播放器高宽造成了严重的偏差，样式已被还原：', player, playerBox, newPlayerBox)
      }
    }

    const tipsSelector = '.' + t.tipsClassName;

    /* 当出现多个tips元素时，将这些tips元素全部移除 */
    const tipsList = document.querySelectorAll(tipsSelector);
    if (tipsList.length > 1) {
      tipsList.forEach(tipsItem => {
        tipsItem.remove();
      });
    }

    let tipsDom = parentNode.querySelector(tipsSelector);

    /* 提示dom未初始化的，则进行初始化 */
    if (!tipsDom) {
      t.initTips();
      tipsDom = parentNode.querySelector(tipsSelector);
      if (!tipsDom) {
        debug.log('init h5player tips dom error...');
        return false
      }
    }

    const style = tipsDom.style;
    tipsDom.innerText = str;

    for (let i = 0; i < 3; i++) {
      if (this.on_off[i]) clearTimeout(this.on_off[i]);
    }

    function showTips () {
      style.display = 'block';
      t.on_off[0] = setTimeout(function () {
        style.opacity = 1;
      }, 50);
      t.on_off[1] = setTimeout(function () {
        // 隐藏提示框和还原样式
        style.opacity = 0;
        style.display = 'none';
        if (backupStyle) {
          parentNode.setAttribute('style', backupStyle);
        }
      }, 2000);
    }

    if (style.display === 'block') {
      style.display = 'none';
      clearTimeout(this.on_off[3]);
      t.on_off[2] = setTimeout(function () {
        showTips();
      }, 100);
    } else {
      showTips();
    }
  },

  /* 设置提示DOM的样式 */
  initTips: function () {
    const t = h5Player;
    const isAudio = t.isAudioInstance();
    const parentNode = isAudio ? document.body : t.getTipsContainer();
    if (parentNode.querySelector('.' + t.tipsClassName)) return

    // top: 50%;
    // left: 50%;
    // transform: translate(-50%,-50%);
    let tipsStyle = `
      position: absolute;
      z-index: 999999;
      font-size: ${t.fontSize || 16}px;
      padding: 5px 10px;
      background: rgba(0,0,0,0.4);
      color:white;
      top: 0;
      left: 0;
      transition: all 500ms ease;
      opacity: 0;
      border-bottom-right-radius: 5px;
      display: none;
      -webkit-font-smoothing: subpixel-antialiased;
      font-family: 'microsoft yahei', Verdana, Geneva, sans-serif;
      -webkit-user-select: none;
    `;

    if (isAudio) {
      tipsStyle = `
        position: fixed;
        z-index: 999999;
        font-size: ${t.fontSize || 16}px;
        padding: 5px 10px;
        background: rgba(0,0,0,0.4);
        color:white;
        bottom: 0;
        right: 0;
        transition: all 500ms ease;
        opacity: 0;
        border-top-left-radius: 5px;
        display: none;
        -webkit-font-smoothing: subpixel-antialiased;
        font-family: 'microsoft yahei', Verdana, Geneva, sans-serif;
        -webkit-user-select: none;
      `;
    }

    const tips = document.createElement('div');
    tips.setAttribute('style', tipsStyle);
    tips.setAttribute('class', t.tipsClassName);
    parentNode.appendChild(tips);
  },
  on_off: new Array(3),
  fps: 30,
  /* 滤镜效果 */
  filter: {
    key: [1, 1, 1, 0, 0],
    setup: function () {
      let view = 'brightness({0}) contrast({1}) saturate({2}) hue-rotate({3}deg) blur({4}px)';
      for (let i = 0; i < 5; i++) {
        view = view.replace('{' + i + '}', String(this.key[i]));
        this.key[i] = Number(this.key[i]);
      }
      h5Player.player().style.filter = view;
    },
    reset: function () {
      this.key[0] = 1;
      this.key[1] = 1;
      this.key[2] = 1;
      this.key[3] = 0;
      this.key[4] = 0;
      this.setup();
    }
  },

  setFilter (item, num, isDown) {
    if (![0, 1, 2, 3, 4].includes(item) || typeof num !== 'number') {
      debug.error('[setFilter]', '参数有误', item, num);
      return false
    }

    /* 如果标识为down，则自动取负数值 */
    if (isDown === true) {
      if (num && num > 0) { num = -num; }
    }

    const nameMap = {
      0: 'brightness',
      1: 'contrast',
      2: 'saturation',
      3: 'hue',
      4: 'blur'
    };

    const t = this;
    t.filter.key[item] += num || 0.1;
    t.filter.key[item] = t.filter.key[item].toFixed(2);

    if (t.filter.key[item] < 0 && nameMap[item] !== 'hue') {
      t.filter.key[item] = 0;
    }

    t.filter.setup();
    t.tips(i18n.t(`tipsMsg.${nameMap[item]}`) + parseInt(t.filter.key[item] * 100) + '%');
  },

  /* 设置视频的亮度 */
  setBrightness (num) {
    this.setFilter(0, num);
  },

  /* 提升视频的亮度 */
  setBrightnessUp (num) {
    this.setFilter(0, num || 0.1);
  },

  /* 降低视频的亮度 */
  setBrightnessDown (num) {
    this.setFilter(0, num || -0.1, true);
  },

  /* 设置视频的对比度 */
  setContrast (num) {
    this.setFilter(1, num);
  },

  /* 提升视频的对比度 */
  setContrastUp (num) {
    this.setFilter(1, num || 0.1);
  },

  /* 降低视频的对比度 */
  setContrastDown (num) {
    this.setFilter(1, num || -0.1, true);
  },

  /* 设置饱和度 */
  setSaturation (num) {
    this.setFilter(2, num);
  },

  /* 提升饱和度 */
  setSaturationUp (num) {
    this.setFilter(2, num || 0.1);
  },

  /* 降低饱和度 */
  setSaturationDown (num) {
    this.setFilter(2, num || -0.1, true);
  },

  /* 设置色相 */
  setHue (num) {
    this.setFilter(3, num);
  },

  /* 增加色相 */
  setHueUp (num) {
    this.setFilter(3, num || 1);
  },

  /* 降低色相 */
  setHueDown (num) {
    this.setFilter(3, num || -1, true);
  },

  /* 设置模糊度 */
  setBlur (num) {
    this.setFilter(4, num);
  },

  /* 增加模糊度 */
  setBlurUp (num) {
    this.setFilter(4, num || 1);
  },

  /* 降低模糊度 */
  setBlurDown (num) {
    this.setFilter(4, num || -1, true);
  },

  resetFilterAndTransform () {
    const t = this;

    t.resetTransform(true);
    t.filter.reset();
    t.tips(i18n.t('tipsMsg.imgattrreset'));
  },

  mediaDownload () {
    if (configManager.get('enhance.allowExperimentFeatures')) {
      debug.warn('[experimentFeatures][mediaDownload]');
      mediaDownload(this.player());
    } else {
      const result = window.confirm(i18n.t('useMediaDownloadTips'));
      if (result) {
        configManager.setGlobalStorage('enhance.allowExperimentFeatures', !configManager.get('enhance.allowExperimentFeatures'));
        window.location.reload();
      }
    }
  },

  capture () {
    const player = this.player();
    videoCapturer.capture(player, true);

    /* 暂停画面 */
    if (!player.paused && !document.pictureInPictureElement && document.visibilityState !== 'visible') {
      this.freezeFrame();
    }
  },

  _isFoucs: false,

  /* 播放器的聚焦事件 */
  isFoucs: function () {
    const t = h5Player;
    const player = t.player();
    if (!player) return

    player.onmouseenter = function (e) {
      h5Player._isFoucs = true;
    };
    player.onmouseleave = function (e) {
      h5Player._isFoucs = false;
    };
  },
  /* 播放器事件响应器 */
  palyerTrigger: function (player, event) {
    if (!player || !event) return
    const t = h5Player;
    const keyCode = event.keyCode;
    const key = event.key.toLowerCase();

    if (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      // 网页全屏
      if (key === 'enter') {
        t.setWebFullScreen();
      }

      // 进入或退出画中画模式
      if (key === 'p') {
        t.togglePictureInPicture();
      }

      // 截图并下载保存
      if (key === 's') {
        t.capture();
      }

      if (key === 'r') {
        t.switchRestorePlayProgressStatus();
      }

      if (key === 'm') {
        /* 垂直镜像翻转 */
        t.setMirror(true);
      }

      if (key === 'd') {
        t.mediaDownload();
      }

      // 视频画面缩放相关事件
      const allowKeys = ['x', 'c', 'z', 'arrowright', 'arrowleft', 'arrowup', 'arrowdown'];
      if (!allowKeys.includes(key)) return

      t.scale = Number(t.scale);
      switch (key) {
        // shift+X：视频缩小 -0.1
        case 'x':
          t.setScaleDown();
          break
        // shift+C：视频放大 +0.1
        case 'c':
          t.setScaleUp();
          break
        // shift+Z：视频恢复正常大小
        case 'z':
          t.resetTransform();
          break
        case 'arrowright':
          t.setTranslateRight();
          break
        case 'arrowleft':
          t.setTranslateLeft();
          break
        case 'arrowup':
          t.setTranslateUp();
          break
        case 'arrowdown':
          t.setTranslateDown();
          break
      }

      // 阻止事件冒泡
      event.stopPropagation();
      event.preventDefault();
      return true
    }

    // ctrl+方向键右→：快进30秒
    if (event.ctrlKey && keyCode === 39) {
      t.setCurrentTimeUp(t.skipStep * 6);
    }
    // ctrl+方向键左←：后退30秒
    if (event.ctrlKey && keyCode === 37) {
      t.setCurrentTimeDown(-t.skipStep * 6);
    }

    // ctrl+方向键上↑：音量升高 20%
    if (event.ctrlKey && keyCode === 38) {
      t.setVolumeUp(0.2);
    }
    // 方向键下↓：音量降低 20%
    if (event.ctrlKey && keyCode === 40) {
      t.setVolumeDown(-0.2);
    }

    // 防止其它无关组合键冲突
    if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return

    // 方向键右→：快进5秒
    if (keyCode === 39) {
      t.setCurrentTimeUp();
    }
    // 方向键左←：后退5秒
    if (keyCode === 37) {
      t.setCurrentTimeDown();
    }

    // 方向键上↑：音量升高 10%
    if (keyCode === 38) {
      t.setVolumeUp(0.05);
    }
    // 方向键下↓：音量降低 10%
    if (keyCode === 40) {
      t.setVolumeDown(-0.05);
    }

    // 空格键：暂停/播放
    if (keyCode === 32) {
      t.switchPlayStatus();
    }

    // 按键X：减速播放 -0.1
    if (keyCode === 88) {
      t.setPlaybackRateDown();
    }
    // 按键C：加速播放 +0.1
    if (keyCode === 67) {
      t.setPlaybackRateUp();
    }
    // 按键Z：正常速度播放
    if (keyCode === 90) {
      t.resetPlaybackRate();
    }

    // 按1-4设置播放速度 49-52;97-100
    if ((keyCode >= 49 && keyCode <= 52) || (keyCode >= 97 && keyCode <= 100)) {
      t.setPlaybackRatePlus(event.key);
    }

    // 按键F：下一帧
    if (keyCode === 70) {
      t.freezeFrame(1);
    }
    // 按键D：上一帧
    if (keyCode === 68) {
      t.freezeFrame(-1);
    }

    // 按键E：亮度增加%
    if (keyCode === 69) {
      t.setBrightnessUp();
    }
    // 按键W：亮度减少%
    if (keyCode === 87) {
      t.setBrightnessDown();
    }

    // 按键T：对比度增加%
    if (keyCode === 84) {
      t.setContrastUp();
    }
    // 按键R：对比度减少%
    if (keyCode === 82) {
      t.setContrastDown();
    }

    // 按键U：饱和度增加%
    if (keyCode === 85) {
      t.setSaturationUp();
    }
    // 按键Y：饱和度减少%
    if (keyCode === 89) {
      t.setSaturationDown();
    }

    // 按键O：色相增加 1 度
    if (keyCode === 79) {
      t.setHueUp();
    }
    // 按键I：色相减少 1 度
    if (keyCode === 73) {
      t.setHueDown();
    }

    // 按键K：模糊增加 1 px
    if (keyCode === 75) {
      t.setBlurUp();
    }
    // 按键J：模糊减少 1 px
    if (keyCode === 74) {
      t.setBlurDown();
    }

    // 按键Q：图像复位
    if (keyCode === 81) {
      t.resetFilterAndTransform();
    }

    // 按键S：画面旋转 90 度
    if (keyCode === 83) {
      t.setRotate();
    }

    /* 水平镜像翻转 */
    if (keyCode === 77) {
      t.setMirror();
    }

    // 按键回车，进入全屏
    if (keyCode === 13) {
      t.setFullScreen();
    }

    if (key === 'n') {
      t.setNextVideo();
    }

    // 阻止事件冒泡
    event.stopPropagation();
    event.preventDefault();
    return true
  },

  /* 运行自定义的快捷键操作，如果运行了会返回true */
  runCustomShortcuts: function (player, event) {
    if (!player || !event) return
    const key = event.key.toLowerCase();
    const taskConf = TCC.getTaskConfig();
    const confIsCorrect = isObj$1(taskConf.shortcuts) &&
      Array.isArray(taskConf.shortcuts.register) &&
      taskConf.shortcuts.callback instanceof Function;

    /* 判断当前触发的快捷键是否已被注册 */
    function isRegister () {
      const list = taskConf.shortcuts.register;

      /* 当前触发的组合键 */
      const combineKey = [];
      if (event.ctrlKey) {
        combineKey.push('ctrl');
      }
      if (event.shiftKey) {
        combineKey.push('shift');
      }
      if (event.altKey) {
        combineKey.push('alt');
      }
      if (event.metaKey) {
        combineKey.push('command');
      }

      combineKey.push(key);

      /* 通过循环判断当前触发的组合键和已注册的组合键是否完全一致 */
      let hasReg = false;
      list.forEach((shortcut) => {
        const regKey = shortcut.split('+');
        if (combineKey.length === regKey.length) {
          let allMatch = true;
          regKey.forEach((key) => {
            if (!combineKey.includes(key)) {
              allMatch = false;
            }
          });
          if (allMatch) {
            hasReg = true;
          }
        }
      });

      return hasReg
    }

    if (confIsCorrect && isRegister()) {
      // 执行自定义快捷键操作
      const isDo = TCC.doTask('shortcuts', {
        event,
        player,
        h5Player
      });

      if (isDo) {
        event.stopPropagation();
        event.preventDefault();
      }

      return isDo
    } else {
      return false
    }
  },

  /* 按键响应方法 */
  keydownEvent: function (event) {
    const t = h5Player;
    const keyCode = event.keyCode;
    // const key = event.key.toLowerCase()
    const player = t.player();

    /* 处于可编辑元素中不执行任何快捷键 */
    const target = event.composedPath ? event.composedPath()[0] || event.target : event.target;
    if (t.__disableHotkeysTemporarily__ || isEditableTarget(target)) return

    /* 广播按键消息，进行跨域控制 */
    monkeyMsg.send('globalKeydownEvent', event, 0);

    if (!player) {
      if (t.hasCrossOriginVideoDetected) {
        if (!configManager.get('enhance.allowCrossOriginControl')) {
          return false
        }

        /**
         * 利用热键运行器的匹配能力来决定要不要禁止事件冒泡和阻止默认事件
         * 解决处于跨TAB、跨域控制时造成其它默认快捷键响应异常的问题
         */
        if (t.hotkeysRunner && t.hotkeysRunner.run) {
          t.hotkeysRunner.run({
            event,
            stopPropagation: true,
            preventDefault: true
          });
        } else {
          t.registerHotkeysRunner();
          event.stopPropagation();
          event.preventDefault();
        }

        // debug.log('当前页面检出了跨域受限的视频，仍需阻止默认事件和事件冒泡')
      }

      // debug.log('无可用的媒体元素，不执行相关操作')
      return false
    }

    /* 切换插件的可用状态 */
    if (event.ctrlKey && keyCode === 32) {
      t.enable = !t.enable;
      if (t.enable) {
        t.tips(i18n.t('tipsMsg.onplugin'));
      } else {
        t.tips(i18n.t('tipsMsg.offplugin'));
      }
    }

    if (!t.enable) {
      debug.log('h5Player 已禁用~');
      return false
    }

    // 按ctrl+\ 键进入聚焦或取消聚焦状态，用于视频标签被遮挡的场景
    if (event.ctrlKey && keyCode === 220) {
      t.globalMode = !t.globalMode;
      if (t.globalMode) {
        t.tips(i18n.t('tipsMsg.globalmode') + ' ON');
      } else {
        t.tips(i18n.t('tipsMsg.globalmode') + ' OFF');
      }
    }

    /* 非全局模式下，不聚焦则不执行快捷键的操作 */
    if (!t.globalMode && !t._isFoucs) return

    /* 判断是否执行了自定义快捷键操作，如果是则不再响应后面默认定义操作 */
    if (t.runCustomShortcuts(player, event) === true) return

    /* 热键运行器匹配到相关执行任务便不在执行后续的palyerTrigger */
    if (t.hotkeysRunner && t.hotkeysRunner.run) {
      const matchResult = t.hotkeysRunner.run({
        event,
        target: t,
        stopPropagation: true,
        preventDefault: true,
        conditionHandler (condition) {
          // TODO 完善条件限定回调逻辑
          if (condition) {
            return true
          }
        }
      });

      if (matchResult) {
        debug.info('[hotkeysRunner][matchResult]', matchResult);
        return true
      }
    } else {
      /* 未用到的按键不进行任何事件监听 */
      if (!isRegisterKey(event)) { return false }

      /* 响应播放器相关操作 */
      t.palyerTrigger(player, event);
    }
  },

  /**
   * 获取播放进度
   * @param player -可选 对应的h5 播放器对象， 如果不传，则获取到的是整个播放进度表，传则获取当前播放器的播放进度
   */
  getPlayProgress: function (player) {
    const progressMap = configManager.get('media.progress') || {};

    if (!player) {
      return progressMap
    } else {
      const keyName = window.location.href + player.duration;
      if (progressMap[keyName]) {
        /* 对于直播的视频流，会出现记录的duration和当前视频duration不一致的情况，这时候通过返回currentTime来忽略恢复播放进度 */
        if (Number.isNaN(Number(player.duration)) || Number(progressMap[keyName].duration) !== Number(player.duration)) {
          return player.currentTime
        } else {
          return progressMap[keyName].progress
        }
      } else {
        return player.currentTime
      }
    }
  },
  /* 播放进度记录器 */
  playProgressRecorder: function (player) {
    const t = h5Player;
    clearTimeout(player._playProgressTimer_);
    function recorder (player) {
      player._playProgressTimer_ = setTimeout(function () {
        /* 时长小于两分钟的视频不记录播放进度 */
        const isToShort = !player.duration || Number.isNaN(Number(player.duration)) || player.duration < 120;
        const isLeave = document.visibilityState !== 'visible' && player.paused;

        if (!t.isAllowRestorePlayProgress() || isToShort || isLeave) {
          recorder(player);
          return true
        }

        const progressMap = t.getPlayProgress() || {};
        const list = Object.keys(progressMap);
        const keyName = window.location.href + player.duration;

        /**
         * 对首次记录到progressMap的值进行标记
         * 用于防止手动切换播放进度时，执行到错误的恢复逻辑
         */
        if (!progressMap[keyName]) {
          t._firstProgressRecord_ = keyName;
          t._hasRestorePlayProgress_ = keyName;
        }

        /* 只保存最近10个视频的播放进度 */
        if (list.length > 10) {
          /* 根据更新的时间戳，取出最早添加播放进度的记录项 */
          let timeList = [];
          list.forEach(function (keyName) {
            progressMap[keyName] && progressMap[keyName].t && timeList.push(progressMap[keyName].t);
          });
          timeList = quickSort(timeList);
          const timestamp = timeList[0];

          /* 删除最早添加的记录项 */
          list.forEach(function (keyName) {
            if (progressMap[keyName].t === timestamp) {
              delete progressMap[keyName];
            }
          });
        }

        /* 记录当前播放进度 */
        progressMap[keyName] = {
          progress: player.currentTime,
          duration: player.duration,
          t: new Date().getTime()
        };

        /* 存储播放进度表 */
        configManager.setLocalStorage('media.progress', progressMap);

        /* 循环侦听 */
        recorder(player);
      }, 1000 * 2);
    }
    recorder(player);
  },

  /* 设置播放进度 */
  setPlayProgress: function (player) {
    const t = h5Player;
    if (!player || !player.duration || Number.isNaN(player.duration)) return

    const curTime = Number(t.getPlayProgress(player));

    /* 要恢复进度的时间过小或大于player.duration都不符合规范，不进行进度恢复操作 */
    if (!curTime || Number.isNaN(curTime) || curTime < 10 || curTime >= player.duration) return

    /* 忽略恢复进度时间与当前播放进度时间相差不大的情况 */
    if (Math.abs(curTime - player.currentTime) < 2) {
      return false
    }

    const progressKey = window.location.href + player.duration;
    t._hasRestorePlayProgress_ = t._hasRestorePlayProgress_ || '';

    if (t._hasRestorePlayProgress_ === progressKey || t._firstProgressRecord_ === progressKey) {
      if (t._hasRestorePlayProgress_ === progressKey) {
        t._firstProgressRecord_ = '';
      }
      return false
    }

    if (t.isAllowRestorePlayProgress()) {
      // 比curTime少1.5s可以让用户知道是前面的画面，从而有个衔接上了的感觉
      player.currentTime = curTime - 1.5;
      t._hasRestorePlayProgress_ = progressKey;
      t.tips(i18n.t('tipsMsg.playbackrestored'));
    } else {
      t.tips(i18n.t('tipsMsg.playbackrestoreoff'));
    }
  },

  setPlayerInstance (el) {
    if (!el && !el.getBoundingClientRect) {
      return false
    }

    const t = h5Player;

    if (t.player() === el) {
      return false
    }

    if (!t.playerInstance && isMediaElement(el)) {
      t.playerInstance = el;
      t.initPlayerInstance(false);
      return true
    }

    if (isVideoElement(el)) {
      const elParentNode = t.getTipsContainer(el);
      const elInfo = el.getBoundingClientRect();
      const parentElInfo = elParentNode && elParentNode.getBoundingClientRect();
      if (elInfo && elInfo.width > 200 && parentElInfo && parentElInfo.width > 200) {
        t.playerInstance = el;
        t.initPlayerInstance(false);
      }
    } else if (isAudioElement(el)) {
      if (isAudioElement(t.playerInstance) || (isVideoElement(t.playerInstance) && !t.playerInstance.isConnected)) {
        t.playerInstance = el;
        t.initPlayerInstance(false);
      }
    }
  },

  /**
   * 视频元素是否出现在视口里的观察对象，用于优化多视频实例的实例切换
   * https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
   */
  intersectionObserver: new IntersectionObserver(function (entries, observer) {
    const t = h5Player;
    // debug.log('[intersectionObserver]', entries)

    let tmpIntersectionRatio = 0;
    entries.forEach(entrie => {
      entrie.target._intersectionInfo_ = entrie;

      if (entrie.intersectionRatio > tmpIntersectionRatio && entrie.intersectionRatio > 0.4) {
        tmpIntersectionRatio = entrie.intersectionRatio;

        const oldPlayer = t.player();
        if (oldPlayer && oldPlayer._intersectionInfo_ && tmpIntersectionRatio < oldPlayer._intersectionInfo_.intersectionRatio) {
          /* 新实例的视图范围比旧的小，则不切换实例 */
          return
        }

        /* 切换视频实例 */
        const toggleResult = t.setPlayerInstance(entrie.target);
        toggleResult && debug.log('[intersectionObserver] 切换视频实例', entrie);
      }
    });
  }, {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  }),

  /**
   * 检测h5播放器是否存在
   * @param callback
   */
  detecH5Player: function () {
    const t = this;
    const playerList = t.getPlayerList();

    if (playerList.length) {
      // debug.log('检测到HTML5视频！', location.href, h5Player, playerList)

      /* 单video实例标签的情况 */
      if (playerList.length === 1) {
        t.playerInstance = playerList[0];
        t.initPlayerInstance(true);
      }

      /* 多video实例标签的情况 */
      playerList.forEach(function (player) {
        /* 鼠标移到其上面的时候重新指定实例 */
        if (!player._hasMouseRedirectEvent_) {
          player.addEventListener('mouseenter', function (event) {
            t.setPlayerInstance(event.target);
          });
          player._hasMouseRedirectEvent_ = true;
        }

        /* 播放器开始播放的时候重新指向实例 */
        if (!player._hasPlayingRedirectEvent_) {
          player.addEventListener('playing', function (event) {
            const media = event.target;

            /* 对于超短的音视频可能是某些操作反馈的特效，可忽略对其进行播放实例切换 */
            if (media.duration && media.duration < 8) {
              return false
            }

            t.setPlayerInstance(media);
          });
          player._hasPlayingRedirectEvent_ = true;
        }

        /* 当被观察到出现在浏览器视口里时，切换视频实例 */
        if (!player._hasIntersectionObserver_) {
          t.intersectionObserver.observe(player);
          player._hasIntersectionObserver_ = true;
        }
      });

      if (isInCrossOriginFrame()) {
        /* 广播检测到H5Player的消息 */
        monkeyMsg.send('videoDetected', {
          src: t.playerInstance.src
        });
      }

      registerH5playerMenus(h5Player);
    }
  },

  /* 响应来自按键消息的广播 */
  bindFakeEvent () {
    const t = this;
    if (t._hasBindFakeEvent_) return

    /* 触发来自消息广播的模拟事件，实现跨域、跨Tab控制视频播放 */
    let triggerFakeEvent = function (name, oldVal, newVal, remote) {
      const player = t.player();
      if (player && !t.__disableHotkeysTemporarily__) {
        const fakeEvent = newVal.data;
        fakeEvent.stopPropagation = () => { };
        fakeEvent.preventDefault = () => { };
        t.palyerTrigger(player, fakeEvent);

        debug.log('已响应跨Tab/跨域按键控制信息：', newVal);
      }
    };

    /**
     * 操作节流控制，减少按键消息频率，
     * 注意，开启节流控制后导致复合按键（如：shift+s）没法生效
     */
    if (!crossTabCtl.hasOpenPictureInPicture() && !t.hasCrossOriginVideoDetected) {
      triggerFakeEvent = throttle(triggerFakeEvent, 80);
    }

    /* 注册响应来自按键消息的广播的事件 */
    monkeyMsg.on('globalKeydownEvent', async (name, oldVal, newVal, remote) => {
      if (remote) {
        if (isInCrossOriginFrame()) {
          /**
           * 同处跨域受限页面，且都处于可见状态，大概率处于同一个Tab标签里，但不是100%
           * tabId一致则100%为同一标签下
           */
          if (document.visibilityState === 'visible' && newVal.originTab) {
            triggerFakeEvent(name, oldVal, newVal, remote);
          }
        } else if (crossTabCtl.hasOpenPictureInPicture()) {
          /* 跨Tab控制画中画里面的视频播放 */
          if (!newVal.originTab && (document.pictureInPictureElement || t.isLeavepictureinpictureAwhile())) {
            triggerFakeEvent(name, oldVal, newVal, remote);
          }
        }
      }
    });

    t._hasBindFakeEvent_ = true;
  },

  /* 绑定相关事件 */
  bindEvent: function () {
    const t = this;
    if (t._hasBindEvent_) return

    document.removeEventListener('keydown', t.keydownEvent);
    document.addEventListener('keydown', t.keydownEvent, true);

    /* 兼容iframe操作 */
    if (isInIframe() && !isInCrossOriginFrame()) {
      window.top.document.removeEventListener('keydown', t.keydownEvent);
      window.top.document.addEventListener('keydown', t.keydownEvent, true);
    }

    t._hasBindEvent_ = true;
  },

  setCustomConfiguration (config, tag = 'Default') {
    if (!config) return false

    const configuration = configManager.mergeDefConf(config.customConfiguration);
    const taskConf = mergeTaskConf(config.customTaskControlCenter);
    if (TCC && TCC.setTaskConf) {
      TCC.setTaskConf(taskConf);
    }

    h5Player.hasSetCustomConfiguration = tag;
    debug.info(`[CustomConfiguration][${tag}]`, configuration, taskConf);
  },

  mergeExternalConfiguration (config, tag = 'Default') {
    if (!config || !configManager.getGlobalStorage('enhance.allowExternalCustomConfiguration')) return false
    h5Player.setCustomConfiguration(config, 'External');
    h5Player.hasExternalCustomConfiguration = tag;
  },

  init: function (global) {
    const t = this;

    if (window.unsafeWindow && window.unsafeWindow.__h5PlayerCustomConfiguration__) {
      !t.hasExternalCustomConfiguration && t.mergeExternalConfiguration(window.unsafeWindow.__h5PlayerCustomConfiguration__);
    }

    if (TCC && TCC.doTask('disable') === true) {
      debug.info(`[TCC][disable][${location.host}] 已禁止在该网站运行视频检测逻辑，您可查看任务配置中心的相关配置了解详情`);
      return true
    }

    if (!global) {
      /* 检测是否存在H5播放器 */
      t.detecH5Player();
      return true
    }

    if (configManager.get('debug') === true) {
      window._debugMode_ = true;
      t.mountToGlobal();
    }

    setFakeUA();

    /* 初始化任务配置中心 */
    TCC = h5PlayerTccInit(t);

    /* 绑定键盘事件 */
    if (configManager.get('enableHotkeys') !== false) {
      t.bindEvent();
      t.bindFakeEvent();
    } else {
      debug.warn('快捷键能力已被禁用');
    }

    /* 响应来自跨域受限的视频检出事件 */
    monkeyMsg.on('videoDetected', async (name, oldVal, newVal, remote) => {
      if (newVal.originTab) {
        t.hasCrossOriginVideoDetected = true;
      }

      debug.log('[hasCrossOriginVideoDetected]', t, name, oldVal, newVal, remote);
    });

    /* 当页面处于可视化状态时，初始化自定义播放逻辑 */
    document.addEventListener('visibilitychange', function () {
      h5Player.initAutoPlay();
    });

    if (window.unsafeWindow && configManager.getGlobalStorage('enhance.allowExternalCustomConfiguration')) {
      window.unsafeWindow.__setH5PlayerCustomConfiguration__ = t.mergeExternalConfiguration;
    }
  }
};

async function h5PlayerInit () {
  const isEnabled = configManager.get('enable');
  const blackUrlList = configManager.get('blacklist.urls') || [];
  const blackDomainList = configManager.get('blacklist.domains') || [];
  const isInBlackList = blackUrlList.includes(location.href) || blackDomainList.includes(location.host);

  if (isInBlackList) {
    console.warn(`[h5player][config][blacklist][${location.href}] \n当前页面已被加入黑名单，不执行h5player增强脚本的相关逻辑，如有需要开启，请在配置里的blacklist移除对应的地址`);
  }

  try {
    if (isEnabled && !isInBlackList) {
      mediaCore.init(function (mediaElement) {
        h5Player.init();
      });

      if (configManager.get('enhance.allowExperimentFeatures') && configManager.get('download.enable')) {
        mediaSource.init();
        debug.warn(`[experimentFeatures][warning] ${i18n.t('experimentFeaturesWarning')}`);
        debug.warn('[experimentFeatures][mediaSource][activated]');
      }

      /* 禁止对playbackRate等属性进行锁定 */
      hackDefineProperty();

      /* 禁止对shadowdom使用close模式 */
      hackAttachShadow();

      /* 对所有事件进行接管 */
      proxyHTMLMediaElementEvent();
      // hackEventListener()
    }
  } catch (e) {
    console.error('h5player hack error', e);
  }

  /* 注意：油猴的菜单注册不能根据isEnabled禁用掉，否则没法通过油猴的菜单进行启用 */
  menuRegister();

  if (!isEnabled || isInBlackList) {
    debug.warn(`[config][disable][${location.host}] 当前网站已禁用脚本，如要启用脚本，请在菜单里开启`);
    return false
  }

  try {
    /* 初始化全局所需的相关方法 */
    h5Player.init(true);

    /* 检测到有视频标签就进行初始化 */
    supportMediaTags.forEach(tagName => {
      ready(tagName, function () {
        h5Player.init();
      });
    });

    /* 检测shadow dom 下面的video */
    document.addEventListener('addShadowRoot', function (e) {
      const shadowRoot = e.detail.shadowRoot;
      supportMediaTags.forEach(tagName => {
        ready(tagName, function (element) {
          h5Player.init();
        }, shadowRoot);
      });
    });

    /* 初始化跨Tab控制逻辑 */
    crossTabCtl.init();

    if (isInIframe()) {
      debug.log('h5Player init suc, in iframe:');
    } else {
      debug.log('h5Player init suc');
    }

    if (isInCrossOriginFrame()) {
      debug.log('当前处于跨域受限的iframe中，h5Player部分功能可能无法正常开启', window.location.href);
    }

    /* 注册鼠标控制事件 */
    if (configManager.get('mouse.enable')) {
      registerMouseEvent(h5Player);
    }
  } catch (e) {
    debug.error('h5Player init fail', e);
  }

  /* 注意：只有明确为fasle才隐藏GUI */
  if (configManager.get('ui.enable') !== false) {
    if (window.customElements && document.adoptedStyleSheets) {
      h5Player.UI = h5playerUI(windowSandbox);
      setTimeout(async () => {
        h5Player.UI.init();
      }, 400);
    } else {
      /* webkit内核建议73以上的浏览器才允许使用UI组件，否则兼容或性能都是很大的问题 */
      debug.warn('当前浏览器不支持customElements或adoptedStyleSheets，无法使用UI组件，建议使用Chrome 83+，Edge 83+');
    }
  } else {
    debug.warn('UI组件已被禁用', configManager.get('ui.enable'));
  }

  /**
   * 跟官网远程助手进行互动，有严重安全或信息洁癖的人手动注释下面代码即可
   * 下面代码不会影响主要功能的正常使用
   * 不注释代码，禁用UI界面也有同等效果
   */
  try {
    configManager.get('ui.enable') !== false && remoteHelper.init();
  } catch (e) {
    debug.error('[remoteHelper.init]', e);
  }

  // console.clear = () => {}
}

function init (retryCount = 0) {
  if (!window.document || !window.document.documentElement) {
    setTimeout(() => {
      if (retryCount < 200) {
        init(retryCount + 1);
      } else {
        console.error('[h5player message:]', 'not documentElement detected!', window);
      }
    }, 10);

    return false
  } else if (retryCount > 0) {
    console.warn('[h5player message:]', 'documentElement detected!', retryCount, window);
  }

  h5PlayerInit();
}

/**
 * 某些极端情况下，直接访问window对象都会导致报错，所以整个init都try起来
 * 例如：www.icourse163.org 就有一定的机率异常
 */
let initTryCount = 0;
try {
  init(0);
} catch (e) {
  setTimeout(() => {
    if (initTryCount < 200) {
      initTryCount++;
      init(0);
      console.error('[h5player message:]', 'init error', initTryCount, e);
    }
  }, 10);
}
