const options = {
  root: null, // Use the viewport as the root
  rootMargin: "0px",
  threshold: 0.1 // Specify the threshold for intersection
}

const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const el = entry.target;

            function on_load(evt) {
                let el = evt.target;

                $(el).fadeIn(400, () => {
                    el.removeEventListener('load', on_load);
                    el.classList.remove('lazy');                                           
                    el.classList.remove('observed');                                           
                
                    let placeholder = el.closest('[data-role="placeholder"]');

                    if (placeholder) {
                        placeholder.classList.add('ux-ready');
                    }
                })

                if (typeof el.cb === 'function') {
                    el.cb(el);
                }
            }

            let src = el.getAttribute("data-src");

            if (src == '') {
                el.classList.remove('lazy'); 
                el.classList.remove('observed'); 
                
                if (typeof el.cb === 'function') {
                    el.cb(el);
                }
            } else {
                el.addEventListener('load', on_load);
                el.src = src;
            }

            observer.unobserve(el);
        }
    })
}

const load_image = (el) => {
    function on_load(evt) {
        let el = evt.target;

        $(el).fadeIn(400, () => {
            el.removeEventListener('load', on_load);
            el.classList.remove('lazy');                                           
        
            let placeholder = el.closest('[data-role="placeholder"]');

            if (placeholder) {
                placeholder.classList.add('ux-ready');
            }
        })

        if (typeof el.cb === 'function') {
            el.cb(el);
        }
    }

    let src = el.getAttribute("data-src");

    if (src == '') {
        el.classList.remove('lazy'); 
        
        if (typeof el.cb === 'function') {
            el.cb(el);
        }
    } else {
        el.addEventListener('load', on_load);
        el.src = src;
    }    
}

const observer = new IntersectionObserver(handleIntersection, options);

export default function lazy_load(el, cb = null, use_observer = true) {
    if (!el) return;

    let data_src = el.getAttribute('data-src');

    if (data_src) {
        if (data_src == 'images/blank.png') return;
    } else {
        return;
    }

    if (typeof cb === 'function') {
        el.cb = cb;
    }

    if (use_observer) {
        el.classList.add('observed');
        observer.observe(el);
    } else {
        load_image(el);
    }     
}

