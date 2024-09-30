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
            return $($.el(selector));
        } else {
            return new TeriyakiElement(document.querySelector(selector));
        }
    } else if ($.is_html_element(selector)) {
        return new TeriyakiElement(selector);
    } else if ($.is_document(selector)) {
        return new TeriyakitDocument(selector);
    } else if ($.is_window(selector)) {
        return new TeriyakiiWindow(selector);        
    }
}

$.all = (selector) => {
    return new TeriyakiElements(document.querySelectorAll(selector));
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

$.is_teriyaki = el => {
    return (el instanceof Teriyaki);
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

    if (div.childElementCount == 1) {
        return div.firstChild;      
    } else if (div.childElementCount > 1) {
        return new TeriyakiElement(div.childNodes);      
    }

    return null;
}

$.wrap = (el, wrapper) => {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

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

$.create_event = (event_name, data = {}, bubbles = true) => {
    return new CustomEvent(event_name, {
            bubbles: bubbles,
            detail: data
    })
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

$.pushState = (state = null, url) => {
    window.history.replaceState(state, null, '');
    window.history.pushState(null, null, url);        
} 

$.get_html = (url, cached = true) => new Promise((resolve, reject) => {
    let options = {};

    if (!cached) {
        options = {cache: "no-cache"}
    }

    fetch(url, options)
        .then(response => response.text())
        .then(text => resolve(text))
        .catch(err => reject(err));
})

$.get_text = (url, cached = true) => new Promise((resolve, reject) => {
    let options = {};

    if (!cached) {
        options = {cache: "no-cache"}
    }

    fetch(url, options)
        .then(response => response.text())
        .then(text => resolve(text))
        .catch(err => reject(err));
})

$.get_json = (url, cached = true) => new Promise((resolve, reject) => {
    let options = {};

    if (!cached) {
        options = {cache: "no-cache"}
    }

    fetch(url, options)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => reject(err));
})

$.post = (url, data = null) => new Promise((resolve, reject) => {
    let options = {};

    if (!cached) {
        options = {cache: "no-cache"}
    }

    options.method = 'POST';
    options.body = data;

    fetch(url, options)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(err => reject(err));        
})

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

class Teriyaki {
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

class TeriyakiWindow extends Teriyaki {
}

class TeriyakiDocument extends Teriyaki {
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
        if (typeof txt == 'string') {
            this.el.innerText = txt;
            return this;
        } else {
            return this.el.innerText;
        }
    }

    html(txt) {
        if (typeof txt == 'string') {
            this.el.innerHTML = txt;
            return this;
        } else {
            return this.el.innerHTML;
        }
    }

    html_unsafe(html) {
        let _type = typeof html;

        if (_type === 'string') {
            this.el.innerHTML = html;
          
            Array.from(this.el.querySelectorAll("script"))
                .forEach(oldScriptEl => {
                    const newScriptEl = document.createElement("script");
                    Array.from(oldScriptEl.attributes).forEach( attr => {
                    newScriptEl.setAttribute(attr.name, attr.value) 
                })
              
                const scriptText = document.createTextNode(oldScriptEl.innerHTML);
                newScriptEl.appendChild(scriptText);  
                oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
            })

            return this;
        } else {
            return this.el.innerHTML;            
        }        
    }

    wrap(wrapper) {
        if ($.is_teriyaki(wrapper)) {
            $.wrap(this.el, wrapper.el);
        } else if ($.is_html_element(wrapper)) {
            $.wrap(this.el, wrapper);
        } else if ($.is_html(wrapper)) {
            let el_wrapper = $.el(wrapper);

            $.wrap(this.el, el_wrapper);
        }

        return this;
    }

    color(val) {
        this.el.style.setProperty('color', val);    
        return this;
    }

    show() {
        this.el.removeAttribute('hidden');
        return this;
    }

    hide() {
        this.el.setAttribute('hidden', '');
        return this;
    }

    attr(key, value) {
        if (key && typeof key == 'string') {
            if (value && typeof value == 'string') {
                this.el.setAttribute(key, value);
                return this;
            } else {
                return this.el.getAttribute(key);
            }
        }

        return null;
    } 

    data(key, value) {
        if (key && typeof key == 'string') {
            if (value && typeof value == 'string') {
                this.el.setAttribute('data-' + key, value);
                return this;
            } else {
                return this.el.getAttribute('data-' + key);
            }
        }

        return null;
    } 

    css(styles) {
        if (typeof styles == 'object' ) {
            Object.keys(styles).forEach(key => {
                this.el.style.setProperty(key, styles[key]);
            })
        }

        return this;
    }

    width() {
        return this.el.getBoundingClientRect().width;
    }

    height() {
        return this.el.getBoundingClientRect().height;
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

        let animation = this.el.animate(keyframes, settings);  

        if (typeof cb === 'function') {
            animation.addEventListener('finish', evt => {
                cb();
            })
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

        let animation = this.el.animate(keyframes, settings);  

        if (typeof cb === 'function') {
            animation.addEventListener('finish', evt => {
                cb();
            })
        }

        return this;      
    }
}

class TeriyakiElements {
    constructor(nodeList) {
        this.elements = Array.from(nodeList);
    }

    addClass(cls) {
        this.elements.forEach(el => {
            el.classList.add(cls);
        })
    }    

    removeClass(cls) {
        this.elements.forEach(el => {
            el.classList.remove(cls);
        })
    }  

    text(txt) {
        if (typeof txt == 'string') {
            this.elements.forEach(el => {
                el.innerText = txt;
            })
        }
    }  

    html(txt) {
        if (typeof txt == 'string') {
            this.elements.forEach(el => {
                el.innerHTML = txt;
            })
        }
    }  

    html_unsafe(html) {
        let _type = typeof html;

        if (_type === 'string') {
            this.elements.forEach(el => {
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
            })

            return this;
        }        
    }

    wrap(wrapper) {
        if ($.is_teriyaki(wrapper)) {
            this.elements.forEach(el => {
                $.wrap(el, wrapper.el);
            })
        } else if ($.is_html_element(wrapper)) {
            this.elements.forEach(el => {
                $.wrap(el, wrapper);
            })
        } else if ($.is_html(wrapper)) {
            let el_wrapper = $.el(wrapper);

            this.elements.forEach(el => {
                $.wrap(el, el_wrapper);
            })                        
        }

        return this;
    }

    color(val) {
        this.elements.forEach(el => {
            el.style.setProperty('color', val);
        })
    }  

    show() {
        this.elements.forEach(el => {
            el.removeAttribute('hidden');
        })
    }

    hide() {
        this.elements.forEach(el => {
            el.setAttribute('hidden', '');
        })
    }

    attr(key, value) {
        if (key && typeof key == 'string') {
            if (value && typeof value == 'string') {
                this.elements.forEach(el => {
                    el.setAttribute(key, value);
                })
            }
        }
    }

    data(key, value) {
        if (key && typeof key == 'string') {
            if (value && typeof value == 'string') {
                this.elements.forEach(el => {
                    el.setAttribute('data-' + key, value);
                })
            }
        }

        return null;
    }

    css(styles) {
        if (typeof styles == 'object' ) {
            Object.keys(styles).forEach(key => {
                this.elements.forEach(el => {
                    el.style.setProperty(key, styles[key]);
                })
            })    
        }
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

        let animation_count = 0;

        this.elements.forEach(el => {
            let animation = el.animate(keyframes, settings); 
            animation_count++; 

            if (typeof cb === 'function') {
                animation.addEventListener('finish', evt => {
                    animation_count = animation_count - 1;

                    if (animation_count == 0) {
                        cb();
                    }
                })
            }            
        })

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

        let animation_count = 0;

        this.elements.forEach(el => {
            let animation = el.animate(keyframes, settings);  

            animation_count++;

            if (typeof cb === 'function') {
                animation.addEventListener('finish', evt => {
                    animation_count = animation_count - 1;

                    if (animation_count == 0) {
                        cb();
                    }
                })
            }            
        })

        return this;      
    }
}

export default $;