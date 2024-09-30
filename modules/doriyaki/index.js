let $ = (selector) => {
    if ($.is_function(selector)) {
        if (document.readyState === 'complete') {
            cb();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                cb();
            })                
        }
    } else if ($.is_string(selector)) {
        if ($.is_html(selector)) {
            return new Doriyaki($.el(selector));
        } else {
            let nodes = document.querySelectorAll(selector);
            return new Doriyaki(Array.from(nodes));
        }
    } else if ($.is_html_element(selector)) {
        return new Doriyaki(selector);
    } else if ($.is_document(selector)) {
        return new DoriyakiDocument(selector);
    } else if ($.is_window(selector)) {
        return new DoriyakiWindow(selector);        
    }
}

$.about = () => {
    return {
        version: '1.0.1',
        author: 'Mr.Manit Treepaapnkit',
        email: '8columns@gmail.com',
        created_date: '05-MAY-2024',
        last_updated: '05-MAY-2024'
    }
}

$.get_random = function(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

$.get_random_item = function(arr) {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr[$.get_random(0,arr.length - 1)]
    }

    return null;
}

$.attr_escape = function(s) {
    return ('' + s) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

$.parse = function(str, params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${str}\`;`)(...vals);
}

$.friendly_file_size = (file_size) => {
    let i = -1;
    let byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    do {
        file_size /= 1024;
        i++;
    } while (file_size > 1024);
    
    return Math.max(file_size, 0.1).toFixed(1) + ' ' + byteUnits[i];
}

$.base64_encode = (input) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let output = '';
    let i = 0;

    while (i < input.length) {
        const a = input.charCodeAt(i++);
        const b = input.charCodeAt(i++);
        const c = input.charCodeAt(i++);
        const index1 = a >> 2;
        const index2 = ((a & 3) << 4) | (b >> 4);
        const index3 = isNaN(b) ? 64 : ((b & 15) << 2) | (c >> 6);
        const index4 = isNaN(c) ? 64 : c & 63;
        output += chars.charAt(index1) + chars.charAt(index2) + chars.charAt(index3) + chars.charAt(index4);
    }

    return output;
}

$.ready = (cb) => {
    if (document.readyState === 'complete') {
        cb();
    } else {
        let on_content_loaded = () => {
            setTimeout(() => {
                cb();
            }, 100)

            document.removeEventListener('DOMContentLoaded', on_content_loaded);
        }

        document.addEventListener('DOMContentLoaded', on_content_loaded);
    }
}

$.is_function = fnc => {
    return typeof fnc === 'function';
}

$.is_string = str => {
    return typeof str === 'string';
}

$.is_html = str => {
    return ((typeof str === 'string') && (str.includes('<')) && (str.includes('>')));
}

$.is_html_element = el => {
    return HTMLElement.prototype.isPrototypeOf(el);
}

$.is_doriyaki = el => {
    return (el instanceof Doriyaki);
}

$.is_document = el => {
    return (el instanceof Document);
}

$.is_window = el => {
    return (el === window);
}

$.el = (html) => {
    let div = document.createElement('div');        
    div.innerHTML = html.trim();
    return div.firstChild;      
}

$.create_custom_event = (event_name, data = {}, bubbles = true) => {
    return new CustomEvent(event_name, {
            bubbles: bubbles,
            detail: data
    })
}

$.get_json = (url) => new Promise((resolve, reject) => {
    fetch(url)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
})

$.post_json = (url, data, headers = {}) => new Promise((resolve, reject) => {
    let _headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }

    Object.keys(headers).forEach(key => {
        _headers[key] = headers[key]
    })

    const fetch_data = {
      method: 'POST',
      headers: _headers,
      body: JSON.stringify(data)
    }

    fetch(url, fetch_data)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(err => reject(err));
})

$.get_html = (url) => new Promise((resolve, reject) => {
    fetch(url)
        .then(response => response.text())
        .then(text => resolve(text))
        .catch(err => reject(err));
})

$.get_text = (url) => new Promise((resolve, reject) => {
    fetch(url)
        .then(response => response.text())
        .then(text => resolve(text))
        .catch(err => reject(err));
})

$.post = (url, data = null) => new Promise((resolve, reject) => {
    let config = {
        method: 'POST',
        body: data
    }

    fetch(url, config)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => reject(err));        
})

$.default = (x, y) => {
    if ((x === undefined) || (x === null) || (x === '')) {
        return y;
    }

    return x;
}

$.extend = (x, y) => {
    if ((typeof x === 'object') && (typeof y === 'object')) {
        return Object.assign(x, y);
    }

    return null;
}

$.wrap = (el, wrapper) => {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

$.broadcast_receiver = (broadcast_channel, cb = null) => {
    const ch = new BroadcastChannel(broadcast_channel);

    if (typeof cb === 'function') {
        ch.onmessage = event => {
            cb(event.data);
        }
    }
}

$.broadcast = (broadcast_channel, data) => {
    const ch = new BroadcastChannel(broadcast_channel);
    ch.postMessage(data);
} 

$.if = (x, y, z = '') => {
    if (x) {
        return y;
    }

    return z;
}

$.pushState = (state = null, url) => {
    window.history.replaceState(state, null, '');
    window.history.pushState(null, null, url);        
} 

class DoriyakiWindow {
    constructor(el) {
        this.el = el;
    }

    trigger(event) {
        this.el.dispatchEvent(event);
        return this;
    }

    on(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            if (this.el) {
                this.el.addEventListener(event_name, event_handler);
            }           
        } 

        return this;
    }

    one(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            if (this.el) {
                this.el.addEventListener(event_name, event_handler, {once: true});
            }           
        }   

        return this;
    }

    off(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            if (this.el) {
                this.el.removeEventListener(event_name, event_handler);
            }           
        }   

        return this;
    }
}

class DoriyakiDocument {
    constructor(el) {
        this.el = el;
    }

    trigger(event) {
        this.el.dispatchEvent(event);
        return this;
    }

    on(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            if (this.el) {
                this.el.addEventListener(event_name, event_handler);
            }           
        } 

        return this;
    }

    one(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            if (this.el) {
                this.el.addEventListener(event_name, event_handler, {once: true});
            }           
        }   

        return this;
    }

    off(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            if (this.el) {
                this.el.removeEventListener(event_name, event_handler);
            }           
        }   

        return this;
    }

    ready(cb) {
        if (document.readyState !== 'loading') {
            if ($.is_function(cb)) {
                cb();
            }
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                if ($.is_function(cb)) {
                    cb();
                }
            })
        }               

        return this;
    }
}

class Doriyaki {
    constructor(el) {
        if (el === null) {
            this.items = [];
        } else if ($.is_html_element(el)) {
            this.items = [el];
        } else if (Array.isArray(el)) {
            this.items = el;
        }
    }

    get(idx) {
        if (this.items.length >= idx + 1) {
            return this.items[idx];
        }

        return null;
    }

    first() {
        if (this.items.length > 0) {
            return new Doriyaki(this.items[0]);
        }

        return new Doriyaki(null);        
    }

    on(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            for (const el of this.items) {
                el.addEventListener(event_name, event_handler);
            }
        }   

        return this;
    }

    one(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            for (const el of this.items) {
                el.addEventListener(event_name, event_handler, {once: true});
            }
        }   

        return this;
    }

    off(event_name, event_handler) {
        if ($.is_function(event_handler)) {
            for (const el of this.items) {
                el.removeEventListener(event_name, event_handler);
            }
        }   

        return this;
    }

    addClass(_class) {
        for (const el of this.items) {
            el.classList.add(_class);
        }

        return this;
    }

    removeClass(_class) {
        for (const el of this.items) {
            el.classList.remove(_class);        
        }

        return this;
    }

    hasClass(_class) {
        if (this.items.length > 0) {
            let el = this.items[0];
            return el.classList.contains(_class);
        }

        return false;
    }

    toggleClass(_class) {
        for (const el of this.items) {
            if (el.classList.contains(_class)) {
                el.classList.remove(_class);
            } else {
                el.classList.add(_class);        
            }        
        }

        return this;
    }

    next() {
        if (this.items.length > 0) {
            let el = this.items[0];
            return new Doriyaki(el.nextElementSibling);
        }

        return null;
    }

    prev() {
        if (this.items.length > 0) {
            let el = this.items[0];
            return new Doriyaki(el.previousElementSibling);
        }

        return null;
    }

    parent() {
        if (this.items.length > 0) {
            let el = this.items[0];
            return new Doriyaki(el.parentElement);        
        }

        return null;
    }

    width() {
        if (this.items.length > 0) {
            let el = this.items[0];
            return el.getBoundingClientRect().width;        
        }

        return null;
    }

    height() {
        if (this.items.length > 0) {
            let el = this.items[0];
            return el.getBoundingClientRect().height;
        }

        return null;
    }

    html(html) {
        let _type = typeof html;

        if (_type === 'undefined') {
            if (this.items.length > 0) {
                let el = this.items[0];
                return el.innerHTML;
            }

            return null;
        } else if (_type === 'string') {
            for (const el of this.items) {
                el.innerHTML = html;
            }

            return this;
        }
    }

    html_unsafe(html) {
        let _type = typeof html;

        if (_type === 'undefined') {
            if (this.items.length > 0) {
                let el = this.items[0];
                return el.innerHTML;
            }

            return null;
        } else if (_type === 'string') {
            for (const el of this.items) {
                el.innerHTML = html;
              
                Array.from(el.querySelectorAll("script"))
                    .forEach(oldScriptEl => {
                        const newScriptEl = document.createElement("script");
                        Array.from(oldScriptEl.attributes).forEach( attr => {
                        newScriptEl.setAttribute(attr.name, attr.value) 
                    })
                  
                    const scriptText = document.createTextNode(oldScriptEl.innerHTML);
                    newScriptEl.appendChild(scriptText);  
                    oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
                })
            }

            return this;
        }        
    }

    text(text) {
        let _type = typeof text;

        if (_type === 'undefined') {
            if (this.items.length > 0) {
                let el = this.items[0];
                return el.innerText;
            }

            return null;
        } else if (_type === 'string') {
            for (const el of this.items) {
                el.innerText = text;
            }
 
            return this;
        }        
    }

    attr(key, value) {
        if (typeof value === 'undefined') {
            if (this.items.length > 0) {
                let el = this.items[0];
                return el.getAttribute(key);
            }

            return null;
        } 

        for (const el of this.items) {
            if (value === null) {
                el.removeAttribute(key);
            } else {
                el.setAttribute(key, value);    
            }
        }

        return this;    
    }

    css(key, value) {
        let key_type = typeof key;

        if (key_type === 'string') {
            if (typeof value !== 'undefined') {
                for (const el of this.items) {
                    if (value === null) {
                        el.style.removeProperty(key);
                    } else {
                        el.style.setProperty(key, value);
                    }
                }

                return this;
            } else {
                if (this.items.length > 0) {
                    let el = this.items[0];
                    return el.style.getPropertyValue(key);
                }

                return null;
            }
        } else if (key_type === 'object') {
            for (const el of this.items) {
                for (const prop in key) {
                    if (key[prop] === null) {
                       el.style.removeProperty(prop);
                    } else {
                       el.style.setProperty(prop, key[prop]);
                    }
                }
            }

            return this;
        }        
    }

    data(key, value) {
        let key_type = typeof key;

        if (key_type === 'string') {
            if (typeof value !== 'undefined') {
                for (const el of this.items) {
                    if (value === null) {
                        el.removeAttribute('data-' + key);
                    } else {
                        el.dataset[key] = value;
                    }
                }

                return this;
            } else {
                if (this.items.length > 0) {
                    let el = this.items[0];
                    return el.dataset[key];
                }

                return null
            }
        } else if (key_type === 'object') {
            for (const prop in key) {
                if (key[prop] === null) {
                    this.el.removeAttribute('data-' + prop);
                } else {
                    this.el.dataset[prop] = key[prop];
                }
            }

            return this;
        }            
    }

    empty() {
        for (const el of this.items) {
            el.innerHTML = '';
        }

        return this;
    }

    remove() {
        for (const el of this.items) {
            el.remove();
        }

        this.items = [];
        return this;        
    }

    clone(deep = true) {
        if (this.items.length > 0) {
            let el = this.items[0];
            return el.cloneNode(deep);
        }

        return null;
    }

    detach() {
        if (this.items.length > 0) {
            let el = this.items[0];
            return el.parentElement.removeChild(el);        
        }

        return null;
    }

    wrap(wrapper) {        
        if ($.is_string(wrapper)) {
            wrapper = $.el(wrapper);
        }    

        for (const el of this.items) {
            $.wrap(el, wrapper);     
        }

        return this;   
    }

    unwrap() {
        for (const el of this.items) {
            el.replaceWith(...el.childNodes);
        }

        return this;
    }

    fadeIn(duration = 600, cb = null) {
        let keyframes = [
            {"opacity": 0},
            {"opacity": 1}
        ]

        let settings = {
            duration: duration,
            iterations: 1,
            fill: 'both'
        }

        for (const el of this.items) {
            let animation = el.animate(keyframes, settings);  

            if (typeof cb === 'function') {
                animation.addEventListener('finish', evt => {
                    cb();
                })
            }
        }

        return this;      
    }

    fadeOut(duration = 600, cb = null) {
        let keyframes = [
            {"opacity": 1},
            {"opacity": 0}
        ]

        let settings = {
            duration: duration,
            iterations: 1,
            fill: 'both'
        }

        for (const el of this.items) {
            let animation = el.animate(keyframes, settings);  

            if (typeof cb === 'function') {
                animation.addEventListener('finish', evt => {
                    cb();
                })
            }
        }

        return this;      
    }

    show() {
        fadeIn(0);
    }

    show() {
        fadeOut(0);
    }

    trigger(event) {
        for (const el of this.items) {
            el.dispatchEvent(event);
        }

        return this;
    }

    matches(selector) {
        if (this.items.length > 0) {
            let el = this.items[0];
            return el.matches(selector);
        }

        return null;
    }

    find(selector) {
        if (this.items.length > 0) {
            let el = this.items[0];
            return new Doriyaki(el.querySelector(selector)); 
        }

        return new Doriyaki(null);
    }

    findAll(selector) {
        if (this.items.length > 0) {
            let arr = [];
            let el = this.items[0];

            el.querySelectorAll(selector).forEach(el => {
                arr.push(el);
            })

            return new Doriyaki(arr); 
        }

        return new Doriyaki(null);
    }

    find_parents(selector) {
        let parents = [];

        if (this.items.length > 0) {
            let el = this.items[0];
            
            while (el) {
                el = el.parentElement;

                if (el && el.matches(selector)) {
                    parents.push(el);
                }
            }
        }

        return new Doriyaki(parents);
    }

    closest(selector) {
        if (this.items.length > 0) {
            let el = this.items[0];
            return new Doriyaki(el.closest(selector)); 
        }

        return Doriyaki(null);
    }

    append(selector) {
        if ($.is_string(selector)) {
            if ($.is_html(selector)) {
                for (const el of this.items) {
                    el.append($.el(selector));
                }
            } else {
                if (this.items.length > 0) {
                    let el = this.items[0];
                    let elx = document.querySelector(selector);

                    if (elx) {
                        el.append(elx);
                    }
                }
            }
        } else if ($.is_html_element(selector)) {
            if (this.items.length > 0) {
                let el = this.items[0];
                el.append(selector);
            }
        } else if ($.is_doriyaki(selector)) {
            if (this.items.length > 0) {
                let el = this.items[0];
             
                if (selector.items.length > 0) {
                    el.append(selector.items[0]);
                }
            }
        }

        return this;
    }

    prepend(selector) {
        if ($.is_string(selector)) {
            if ($.is_html(selector)) {
                for (const el of this.items) {
                    el.prepend($.el(selector));
                }
            } else {
                if (this.items.length > 0) {
                    let el = this.items[0];
                    let elx = document.querySelector(selector);
                    
                    if (elx) {
                        el.prepend(elx);
                    }
                }
            }
        } else if ($.is_html_element(selector)) {
            if (this.items.length > 0) {
                let el = this.items[0];
                el.prepend(selector);
            }
        } else if ($.is_doriyaki(selector)) {
            if (this.items.length > 0) {
                let el = this.items[0];

                if (selector.items.length > 0) {
                    el.append(selector.items[0]);                   
                }
            }
        }

        return this;
    }

    before(selector) {
        if ($.is_string(selector)) {
            if ($.is_html(selector)) {
                for (const el of this.items) {
                    el.before($.el(selector));
                }
            } else {
                if (this.items.length > 0) {
                    let el = this.items[0];
                    let elx = document.querySelector(selector);
                    
                    if (elx) {
                        el.before(elx);
                    }
                }
            }
        } else if ($.is_html_element(selector)) {
            if (this.items.length > 0) {
                let el = this.items[0];
                el.before(selector);
            }
        } else if ($.is_doriyaki(selector)) {
            if (this.items.length > 0) {
                let el = this.items[0];

                if (selector.items.length > 0) {
                    el.before(selector.items[0]);                   
                }
            }
        }

        return this;
    }

    after(selector) {
        if ($.is_string(selector)) {
            if ($.is_html(selector)) {
                for (const el of this.items) {
                    el.after($.el(selector));
                }
            } else {
                if (this.items.length > 0) {
                    let el = this.items[0];
                    let elx = document.querySelector(selector);
                    
                    if (elx) {
                        el.after(elx);
                    }
                }
            }
        } else if ($.is_html_element(selector)) {
            if (this.items.length > 0) {
                let el = this.items[0];
                el.after(selector);
            }
        } else if ($.is_doriyaki(selector)) {
            if (this.items.length > 0) {
                let el = this.items[0];

                if (selector.items.length > 0) {
                    el.after(selector.items[0]);                   
                }
            }
        }

        return this;
    }
}

export default $;
