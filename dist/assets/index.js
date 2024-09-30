(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
let $$1 = (selector) => {
  if ($$1.is_function(selector)) {
    if (document.readyState === "complete") {
      cb();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        cb();
      });
    }
  } else if ($$1.is_string(selector)) {
    if ($$1.is_html(selector)) {
      return $$1($$1.el(selector));
    } else {
      return new TeriyakiElement(document.querySelector(selector));
    }
  } else if ($$1.is_html_element(selector)) {
    return new TeriyakiElement(selector);
  } else if ($$1.is_document(selector)) {
    return new TeriyakitDocument(selector);
  } else if ($$1.is_window(selector)) {
    return new TeriyakiiWindow(selector);
  }
};
$$1.all = (selector) => {
  return new TeriyakiElements(document.querySelectorAll(selector));
};
$$1.is_function = (fnc) => {
  return typeof fnc === "function";
};
$$1.is_string = (str) => {
  return typeof str === "string";
};
$$1.is_html = (str) => {
  return typeof str === "string" && str.includes("<") && str.includes(">");
};
$$1.is_html_element = (el) => {
  return HTMLElement.prototype.isPrototypeOf(el);
};
$$1.is_teriyaki = (el) => {
  return el instanceof Teriyaki;
};
$$1.is_document = (el) => {
  return el instanceof Document;
};
$$1.is_window = (el) => {
  return el === window;
};
$$1.el = (html) => {
  let div = document.createElement("div");
  div.innerHTML = html.trim();
  if (div.childElementCount == 1) {
    return div.firstChild;
  } else if (div.childElementCount > 1) {
    return new TeriyakiElement(div.childNodes);
  }
  return null;
};
$$1.wrap = (el, wrapper) => {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
};
$$1.default = (x, y) => {
  if (x === void 0 || x === null || x === "") {
    return y;
  }
  return x;
};
$$1.extend = (x, y) => {
  if (typeof x === "object" && typeof y === "object") {
    return Object.assign(x, y);
  }
  return null;
};
$$1.create_event = (event_name, data = {}, bubbles = true) => {
  return new CustomEvent(event_name, {
    bubbles,
    detail: data
  });
};
$$1.broadcast_receiver = (broadcast_channel, cb2 = null) => {
  const ch = new BroadcastChannel(broadcast_channel);
  if (typeof cb2 === "function") {
    ch.onmessage = (event) => {
      cb2(event.data);
    };
  }
};
$$1.broadcast = (broadcast_channel, data) => {
  const ch = new BroadcastChannel(broadcast_channel);
  ch.postMessage(data);
};
$$1.pushState = (state = null, url) => {
  window.history.replaceState(state, null, "");
  window.history.pushState(null, null, url);
};
$$1.get_html = (url, cached2 = true) => new Promise((resolve, reject) => {
  let options2 = {};
  if (!cached2) {
    options2 = { cache: "no-cache" };
  }
  fetch(url, options2).then((response) => response.text()).then((text) => resolve(text)).catch((err) => reject(err));
});
$$1.get_text = (url, cached2 = true) => new Promise((resolve, reject) => {
  let options2 = {};
  if (!cached2) {
    options2 = { cache: "no-cache" };
  }
  fetch(url, options2).then((response) => response.text()).then((text) => resolve(text)).catch((err) => reject(err));
});
$$1.post = (url, data = null) => new Promise((resolve, reject) => {
  let options2 = {};
  if (!cached) {
    options2 = { cache: "no-cache" };
  }
  options2.method = "POST";
  options2.body = data;
  fetch(url, options2).then((response) => response.json()).then((json) => resolve(json)).catch((err) => reject(err));
});
$$1.ready = (cb2) => {
  if (document.readyState === "complete") {
    cb2();
  } else {
    let on_content_loaded = () => {
      setTimeout(() => {
        cb2();
      }, 100);
      document.removeEventListener("DOMContentLoaded", on_content_loaded);
    };
    document.addEventListener("DOMContentLoaded", on_content_loaded);
  }
};
class Teriyaki {
  constructor(el) {
    this.el = el;
  }
  trigger(event) {
    this.el.dispatchEvent(event);
    return this;
  }
  on(event_name, event_handler) {
    if ($$1.is_function(event_handler)) {
      if (this.el) {
        this.el.addEventListener(event_name, event_handler);
      }
    }
    return this;
  }
  one(event_name, event_handler) {
    if ($$1.is_function(event_handler)) {
      if (this.el) {
        this.el.addEventListener(event_name, event_handler, { once: true });
      }
    }
    return this;
  }
  off(event_name, event_handler) {
    if ($$1.is_function(event_handler)) {
      if (this.el) {
        this.el.removeEventListener(event_name, event_handler);
      }
    }
    return this;
  }
}
class TeriyakiElement extends Teriyaki {
  addClass(cls) {
    this.el.classList.add(cls);
    return this;
  }
  removeClass(cls) {
    this.el.classList.remove(cls);
    return this;
  }
  text(txt) {
    if (typeof txt == "string") {
      this.el.innerText = txt;
      return this;
    } else {
      return this.el.innerText;
    }
  }
  html(txt) {
    if (typeof txt == "string") {
      this.el.innerHTML = txt;
      return this;
    } else {
      return this.el.innerHTML;
    }
  }
  html_unsafe(html) {
    let _type = typeof html;
    if (_type === "string") {
      this.el.innerHTML = html;
      Array.from(this.el.querySelectorAll("script")).forEach((oldScriptEl) => {
        const newScriptEl = document.createElement("script");
        Array.from(oldScriptEl.attributes).forEach((attr) => {
          newScriptEl.setAttribute(attr.name, attr.value);
        });
        const scriptText = document.createTextNode(oldScriptEl.innerHTML);
        newScriptEl.appendChild(scriptText);
        oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
      });
      return this;
    } else {
      return this.el.innerHTML;
    }
  }
  wrap(wrapper) {
    if ($$1.is_teriyaki(wrapper)) {
      $$1.wrap(this.el, wrapper.el);
    } else if ($$1.is_html_element(wrapper)) {
      $$1.wrap(this.el, wrapper);
    } else if ($$1.is_html(wrapper)) {
      let el_wrapper = $$1.el(wrapper);
      $$1.wrap(this.el, el_wrapper);
    }
    return this;
  }
  color(val) {
    this.el.style.setProperty("color", val);
    return this;
  }
  show() {
    this.el.removeAttribute("hidden");
    return this;
  }
  hide() {
    this.el.setAttribute("hidden", "");
    return this;
  }
  attr(key, value) {
    if (key && typeof key == "string") {
      if (value && typeof value == "string") {
        this.el.setAttribute(key, value);
        return this;
      } else {
        return this.el.getAttribute(key);
      }
    }
    return null;
  }
  data(key, value) {
    if (key && typeof key == "string") {
      if (value && typeof value == "string") {
        this.el.setAttribute("data-" + key, value);
        return this;
      } else {
        return this.el.getAttribute("data-" + key);
      }
    }
    return null;
  }
  css(styles) {
    if (typeof styles == "object") {
      Object.keys(styles).forEach((key) => {
        this.el.style.setProperty(key, styles[key]);
      });
    }
    return this;
  }
  width() {
    return this.el.getBoundingClientRect().width;
  }
  height() {
    return this.el.getBoundingClientRect().height;
  }
  fadeIn(duration = 600, cb2 = null) {
    let keyframes = [
      { "opacity": 0 },
      { "opacity": 1 }
    ];
    let settings = {
      duration,
      iterations: 1,
      fill: "both"
    };
    let animation = this.el.animate(keyframes, settings);
    if (typeof cb2 === "function") {
      animation.addEventListener("finish", (evt) => {
        cb2();
      });
    }
    return this;
  }
  fadeOut(duration = 600, cb2 = null) {
    let keyframes = [
      { "opacity": 1 },
      { "opacity": 0 }
    ];
    let settings = {
      duration,
      iterations: 1,
      fill: "both"
    };
    let animation = this.el.animate(keyframes, settings);
    if (typeof cb2 === "function") {
      animation.addEventListener("finish", (evt) => {
        cb2();
      });
    }
    return this;
  }
}
class TeriyakiElements {
  constructor(nodeList) {
    this.elements = Array.from(nodeList);
  }
  addClass(cls) {
    this.elements.forEach((el) => {
      el.classList.add(cls);
    });
  }
  removeClass(cls) {
    this.elements.forEach((el) => {
      el.classList.remove(cls);
    });
  }
  text(txt) {
    if (typeof txt == "string") {
      this.elements.forEach((el) => {
        el.innerText = txt;
      });
    }
  }
  html(txt) {
    if (typeof txt == "string") {
      this.elements.forEach((el) => {
        el.innerHTML = txt;
      });
    }
  }
  html_unsafe(html) {
    let _type = typeof html;
    if (_type === "string") {
      this.elements.forEach((el) => {
        el.innerHTML = html;
        Array.from(el.querySelectorAll("script")).forEach((oldScriptEl) => {
          const newScriptEl = document.createElement("script");
          Array.from(oldScriptEl.attributes).forEach((attr) => {
            newScriptEl.setAttribute(attr.name, attr.value);
          });
          const scriptText = document.createTextNode(oldScriptEl.innerHTML);
          newScriptEl.appendChild(scriptText);
          oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
        });
      });
      return this;
    }
  }
  wrap(wrapper) {
    if ($$1.is_teriyaki(wrapper)) {
      this.elements.forEach((el) => {
        $$1.wrap(el, wrapper.el);
      });
    } else if ($$1.is_html_element(wrapper)) {
      this.elements.forEach((el) => {
        $$1.wrap(el, wrapper);
      });
    } else if ($$1.is_html(wrapper)) {
      let el_wrapper = $$1.el(wrapper);
      this.elements.forEach((el) => {
        $$1.wrap(el, el_wrapper);
      });
    }
    return this;
  }
  color(val) {
    this.elements.forEach((el) => {
      el.style.setProperty("color", val);
    });
  }
  show() {
    this.elements.forEach((el) => {
      el.removeAttribute("hidden");
    });
  }
  hide() {
    this.elements.forEach((el) => {
      el.setAttribute("hidden", "");
    });
  }
  attr(key, value) {
    if (key && typeof key == "string") {
      if (value && typeof value == "string") {
        this.elements.forEach((el) => {
          el.setAttribute(key, value);
        });
      }
    }
  }
  data(key, value) {
    if (key && typeof key == "string") {
      if (value && typeof value == "string") {
        this.elements.forEach((el) => {
          el.setAttribute("data-" + key, value);
        });
      }
    }
    return null;
  }
  css(styles) {
    if (typeof styles == "object") {
      Object.keys(styles).forEach((key) => {
        this.elements.forEach((el) => {
          el.style.setProperty(key, styles[key]);
        });
      });
    }
  }
  fadeIn(duration = 600, cb2 = null) {
    let keyframes = [
      { "opacity": 0 },
      { "opacity": 1 }
    ];
    let settings = {
      duration,
      iterations: 1,
      fill: "both"
    };
    let animation_count = 0;
    this.elements.forEach((el) => {
      let animation = el.animate(keyframes, settings);
      animation_count++;
      if (typeof cb2 === "function") {
        animation.addEventListener("finish", (evt) => {
          animation_count = animation_count - 1;
          if (animation_count == 0) {
            cb2();
          }
        });
      }
    });
    return this;
  }
  fadeOut(duration = 600, cb2 = null) {
    let keyframes = [
      { "opacity": 1 },
      { "opacity": 0 }
    ];
    let settings = {
      duration,
      iterations: 1,
      fill: "both"
    };
    let animation_count = 0;
    this.elements.forEach((el) => {
      let animation = el.animate(keyframes, settings);
      animation_count++;
      if (typeof cb2 === "function") {
        animation.addEventListener("finish", (evt) => {
          animation_count = animation_count - 1;
          if (animation_count == 0) {
            cb2();
          }
        });
      }
    });
    return this;
  }
}
const options = {
  root: null,
  // Use the viewport as the root
  rootMargin: "0px",
  threshold: 0.1
  // Specify the threshold for intersection
};
const handleIntersection = (entries, observer2) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let on_load2 = function(evt) {
        let el2 = evt.target;
        $(el2).fadeIn(400, () => {
          el2.removeEventListener("load", on_load2);
          el2.classList.remove("lazy");
          el2.classList.remove("observed");
          let placeholder = el2.closest('[data-role="placeholder"]');
          if (placeholder) {
            placeholder.classList.add("ux-ready");
          }
        });
        if (typeof el2.cb === "function") {
          el2.cb(el2);
        }
      };
      var on_load = on_load2;
      const el = entry.target;
      let src = el.getAttribute("data-src");
      if (src == "") {
        el.classList.remove("lazy");
        el.classList.remove("observed");
        if (typeof el.cb === "function") {
          el.cb(el);
        }
      } else {
        el.addEventListener("load", on_load2);
        el.src = src;
      }
      observer2.unobserve(el);
    }
  });
};
const load_image = (el) => {
  function on_load(evt) {
    let el2 = evt.target;
    $(el2).fadeIn(400, () => {
      el2.removeEventListener("load", on_load);
      el2.classList.remove("lazy");
      let placeholder = el2.closest('[data-role="placeholder"]');
      if (placeholder) {
        placeholder.classList.add("ux-ready");
      }
    });
    if (typeof el2.cb === "function") {
      el2.cb(el2);
    }
  }
  let src = el.getAttribute("data-src");
  if (src == "") {
    el.classList.remove("lazy");
    if (typeof el.cb === "function") {
      el.cb(el);
    }
  } else {
    el.addEventListener("load", on_load);
    el.src = src;
  }
};
const observer = new IntersectionObserver(handleIntersection, options);
function lazy_load(el, cb2 = null, use_observer = true) {
  if (!el) return;
  let data_src = el.getAttribute("data-src");
  if (data_src) {
    if (data_src == "images/blank.png") return;
  } else {
    return;
  }
  if (typeof cb2 === "function") {
    el.cb = cb2;
  }
  if (use_observer) {
    el.classList.add("observed");
    observer.observe(el);
  } else {
    load_image(el);
  }
}
class Dialog {
  constructor(options2 = {}) {
    let default_options = {
      "id": "dialog",
      "width": "500"
    };
    this.options = $.extend(default_options, options2);
    this.dialog = $.el('<div data-role="dialog" data-id="' + this.options.id + '" style="--width:' + this.options.width + 'px;"><div class="popup"></div></div>');
    document.body.append(this.dialog);
  }
  static closeAll() {
    $.dialogs.forEach((modal) => {
      modal.destroy();
    });
  }
  querySelector(selector) {
    return this.dialog.querySelector(selector);
  }
  querySelectorAll(selector) {
    return this.dialog.querySelectorAll(selector);
  }
  html(html) {
    let popup = this.dialog.querySelector(".popup");
    $(popup).html_unsafe(html);
  }
  open() {
    return new Promise((resolve, reject) => {
      this.dialog.classList.add("before-open");
      setTimeout(() => {
        let popup = this.dialog.querySelector(".popup");
        if ($(popup).height() > window.innerHeight * 0.9) {
          this.dialog.classList.add("overflow");
        }
        this.querySelectorAll("img.lazy").forEach((img) => {
          lazy_load(img);
        });
        this.dialog.classList.remove("before-open");
        this.resolve = resolve;
        this.dialog.classList.add("open");
        $.pushState({ "dialog": true }, "#dialog-" + this.options.id);
        $.dialogs.push(this);
      }, 100);
    });
  }
  close() {
    if ($.dialogs.length > 0) {
      history.back();
    }
  }
  destroy() {
    this.dialog.remove();
  }
}
class PWA {
  constructor(el, options2 = {}) {
    let default_options = {
      auto_insert_back_button: false
    };
    this.options = $.extend(default_options, options2);
    this.el = el;
    this.x = 0;
    this.el.append($.el('<div class="overlay"></div>'));
  }
  load(id) {
    return new Promise((resolve, reject) => {
      let el = $('template[data-id="' + id + '"]').el;
      if (el) {
        let role = $.default(el.getAttribute("data-role"), "page");
        if (role == "page") {
          let page = $($.el(el.innerHTML));
          page.data("id", id);
          page.addClass("active");
          this.el.append(page.el);
          $.page_stack.push({ "id": id, "transition": "" });
          resolve(page);
        } else if (role == "sidebar") {
          let sidebar = $($.el(el.innerHTML));
          sidebar.data("id", id);
          this.el.append(sidebar.el);
          resolve(sidebar);
        }
      }
    });
  }
  navigate(id, transition = "push-left", push_state = true) {
    return new Promise((resolve, reject) => {
      let active_page = this.el.querySelector('[data-role="page"].active');
      if (active_page) {
        if (id == $.default(active_page.getAttribute("data-id"), "")) {
          return;
        }
        if (transition == "push-left") {
          setTimeout(() => {
            active_page.style.setProperty("transform", "translateX(-100vw)");
          }, 0);
        } else if (transition == "push-right") {
          setTimeout(() => {
            active_page.style.setProperty("transform", "translateX(100vw)");
          }, 0);
        }
      }
      let page = this.el.querySelector('[data-role="page"][data-id="' + id + '"]');
      if (!page) {
        let el = $('template[data-id="' + id + '"]').el;
        if (el) {
          page = $.el(el.innerHTML);
          page.setAttribute("data-id", id);
          this.el.append(page);
        }
      }
      if (page) {
        page.classList.add("before-active");
        if (transition == "push-left") {
          page.style.setProperty("transform", "translateX(100vw)");
          setTimeout(() => {
            page.style.setProperty("transform", "translateX(0)");
          }, 10);
        } else if (transition == "push-right") {
          page.style.setProperty("transform", "translateX(-100vw)");
          setTimeout(() => {
            page.style.setProperty("transform", "translateX(0)");
          }, 10);
        } else {
          page.style.setProperty("left", this.x + "vw");
        }
        if (push_state) {
          $.pushState({ "pwa": true }, "#" + id);
          $.page_stack.push({ "id": id, "transition": transition });
          if (this.options.auto_insert_back_button) {
            if ($.page_stack.length >= 1) {
              let header = page.querySelector('& > [data-role="header"]');
              let back_button = header.querySelector('a[data-rel="back"]');
              if (header) {
                if (!back_button) {
                  back_button = $.el('<a href="#" data-rel="back" data-role="icon-button"><i class="icon-arrow-right flip-x left"></i></a>');
                  header.append(back_button);
                }
              } else {
                if (back_button) {
                  back_button.remove();
                }
              }
            }
          }
        }
        setTimeout(() => {
          this.set_active_page(id);
        }, 300);
        resolve(true);
      }
    });
  }
  set_active_page(id) {
    let current_active = this.el.querySelector('[data-role="page"].active');
    if (current_active) {
      current_active.classList.remove("active");
    }
    let page = this.el.querySelector('[data-role="page"][data-id="' + id + '"]');
    if (page) {
      page.classList.remove("before-active");
      page.classList.add("active");
    }
  }
  query(selector) {
    return this.el.querySelector(selector);
  }
  queryAll(selector) {
    return this.el.querySelectorAll(selector);
  }
  show_overlay() {
    let overlay = this.query("& > .overlay");
    if (overlay) {
      overlay.classList.add("open");
    }
  }
  hide_overlay() {
    let overlay = this.query("& > .overlay");
    if (overlay) {
      overlay.classList.remove("open");
    }
  }
  toggle_sidebar() {
    let sidebar = this.query('[data-role="sidebar"]');
    if (sidebar) {
      if (sidebar.classList.contains("open")) {
        this.hide_overlay();
        sidebar.classList.remove("open");
        document.body.classList.remove("sidebar-is-open");
      } else {
        this.show_overlay();
        sidebar.classList.add("open");
        document.body.classList.add("sidebar-is-open");
      }
    }
  }
  open_sidebar() {
    let sidebar = this.query('[data-role="sidebar"]');
    if (sidebar) {
      if (sidebar.classList.contains("open")) return;
      this.show_overlay();
      sidebar.classList.add("open");
      document.body.classList.add("sidebar-is-open");
    }
  }
  close_sidebar() {
    let sidebar = this.query('[data-role="sidebar"]');
    if (sidebar) {
      if (!sidebar.classList.contains("open")) return;
      this.hide_overlay();
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-is-open");
    }
  }
  open_dialog(id) {
    let el = $('template[data-id="' + id + '"]').el;
    if (el) {
      let dialog = new Dialog();
      dialog.html(el.innerHTML);
      return dialog.open();
    }
    return Promise.resolve({ status: 404, description: "dialog not found!" });
  }
  page_dialog(id) {
    let el = $('template[data-id="' + id + '"]').el;
    if (el) {
      let dialog = new Dialog({
        id: "page-dialog",
        width: "720"
      });
      dialog.html(el.innerHTML);
      let header = dialog.querySelector("header");
      if (header) {
        header.querySelectorAll('a[data-role="icon-button"]').forEach((el2) => {
          el2.remove();
        });
        header.append($.el('<a href="#" data-role="icon-button" class="right ui-round" data-rel="close"><span class="ui-icon-delete"></span></a>'));
      }
      let footer = dialog.querySelector("footer");
      if (footer) {
        footer.remove();
      }
      let popup = dialog.querySelector(".popup");
      if (popup) {
        popup.append($.el('<div class="flex-row"><a href="#" data-role="button" data-rel="close" class="ui-icon-inline ui-icon-check" style="margin-top:2em;">OK</a></div>'));
      }
      return dialog.open();
    }
    return Promise.resolve({ status: 404, description: "dialog not found!" });
  }
  show_message(message, title = "Message Box", width = "360") {
    let dialog = new Dialog({
      id: "show-message",
      width
    });
    let sb = new Array();
    sb.push('<div data-role="page">');
    sb.push("<header>");
    sb.push("<h1>" + title + "</h1>");
    sb.push('<a href="#" data-role="icon-button" class="right ui-round" data-rel="close"><span class="ui-icon-delete"></span></a>');
    sb.push("</header>");
    sb.push("<main>");
    sb.push("<p>" + message + "</p>");
    sb.push('<a href="#" data-rel="close" data-role="button">OK</a>');
    sb.push("</main>");
    sb.push("</div>");
    dialog.html(sb.join(""));
    return dialog.open();
  }
  confirm(message, title = "Confirm", width = "360") {
    let dialog = new Dialog({
      id: "confirm",
      width
    });
    let sb = new Array();
    sb.push('<div data-role="page">');
    sb.push("<header>");
    sb.push("<h1>" + title + "</h1>");
    sb.push('<a href="#" data-role="icon-button" class="right ui-round" data-rel="close"><span class="ui-icon-delete"></span></a>');
    sb.push("</header>");
    sb.push("<main>");
    sb.push("<p>" + message + "</p>");
    sb.push(`<a href="#" data-rel="close" data-role="button" data-response='{"status":200, "description":"ok"}'>OK</a>`);
    sb.push(`<a href="#" data-rel="close" data-role="button" data-response='{"status":201, "description":"cancel"}'>CANCEL</a>`);
    sb.push("</main>");
    sb.push("</div>");
    dialog.html(sb.join(""));
    return dialog.open();
  }
}
$$1.ready((evt) => {
  console.log("ready");
  $$1.page_stack = new Array();
  $$1.dialogs = new Array();
  window.$ = $$1;
  window.Dialog = Dialog;
  let counter = 1;
  let main = $$1("body > main").el;
  let $pwa = new PWA(main);
  let click_handler = (evt2) => {
    let el = evt2.target;
    if (el.matches("a")) {
      evt2.preventDefault();
      evt2.stopPropagation();
      console.log("a-clicked:" + counter);
      console.log(el);
      counter++;
      let href = $$1.default(el.getAttribute("href"), "");
      let rel = $$1.default(el.getAttribute("data-rel"), "");
      if (href.startsWith("#")) {
        evt2.preventDefault();
        evt2.stopPropagation();
        if (href == "#") {
          let rel2 = el.getAttribute("data-rel");
          if (rel2 == "back") {
            history.back();
          } else if (rel2 == "close") {
            if (el.closest(".popup")) {
              history.back();
            }
          } else if (rel2 == "toggle-sidebar") {
            $pwa.toggle_sidebar();
          }
        } else {
          let id = href.substring(1);
          if (rel == "dialog") {
            $pwa.page_dialog(id).then((response) => {
              if (response.status == 302) {
                let link = response.link;
                rel = $$1.default(link.getAttribute("data-rel"), "");
                href = $$1.default(link.getAttribute("href"), "");
                id = href.substring(1);
                if (rel == "dialog") {
                  $pwa.page_dialog(id);
                } else {
                  $pwa.navigate(id).then(() => {
                    window.scrollTo(0, 0);
                  });
                }
              }
            });
          } else {
            if ($$1.dialogs.length > 0) {
              Dialog.closeAll();
            }
            $pwa.navigate(id).then(() => {
              window.scrollTo(0, 0);
            });
          }
        }
      }
      if (el.closest('[data-role="sidebar"]')) {
        $pwa.close_sidebar();
      }
    } else if (el.matches(".overlay")) {
      if (document.body.classList.contains("sidebar-is-open")) {
        $pwa.close_sidebar();
      }
    }
  };
  window.addEventListener("popstate", (evt2) => {
    let state = evt2.state;
    if (!state) return;
    if (state.pwa) {
      evt2.stopPropagation();
      if ($$1.page_stack.length > 0) {
        let node = $$1.page_stack.pop();
        let transition = node.transition;
        if ($$1.page_stack.length > 0) {
          node = $$1.page_stack[$$1.page_stack.length - 1];
          if (transition == "push-left") {
            transition = "push-right";
          } else if (transition == "push-right") {
            transition = "push-left";
          }
          (void 0).navigate(node.id, transition, false);
        }
      }
    } else if (state.dialog) {
      evt2.stopPropagation();
      if ($$1.dialogs.length > 0) {
        let modal = $$1.dialogs.pop();
        let popup = modal.dialog.querySelector(".popup");
        popup.addEventListener("animationend", (evt3) => {
          let animation_name = evt3.animationName;
          if (animation_name == "pop-out") {
            modal.destroy();
          }
        });
        modal.dialog.classList.add("transition-out");
      }
    }
  });
  document.body.addEventListener("click", click_handler);
  window.$pwa = $pwa;
  $pwa.load("sidebar");
  $pwa.load("home");
});
