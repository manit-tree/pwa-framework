import Dialog from '../dialog/index.js';

class PWA {
    constructor(el, options = {}) {
        let default_options = {
            auto_insert_back_button: false
        }

        this.options = $.extend(default_options, options);
        this.el = el;
        this.x = 0;
        this.el.append($.el('<div class="overlay"></div>'));
    }

    load(id) {
        return new Promise((resolve, reject) => {
            let el = $('template[data-id="' + id + '"]').el;

            if (el) {
                let role = $.default(el.getAttribute('data-role'), 'page');

                if (role == 'page') {
                    let page = $($.el(el.innerHTML));

                    page.data('id', id);
                    page.addClass('active');
                    this.el.append(page.el);
                    $.page_stack.push({"id": id, "transition": ""});
                    resolve(page);
                } else if (role == 'sidebar') {
                    let sidebar = $($.el(el.innerHTML));

                    sidebar.data('id', id);
                    this.el.append(sidebar.el);
                    resolve(sidebar);                    
                }
            }
        })
    }

    navigate(id, transition = 'push-left', push_state = true) {
        return new Promise((resolve, reject) => {
            let active_page = this.el.querySelector('[data-role="page"].active');

            if (active_page) {
                if (id == $.default(active_page.getAttribute('data-id'), '')) {
                    return;
                }

                if (transition == 'push-left') {
                    setTimeout(() => {
                        active_page.style.setProperty('transform', 'translateX(-100vw)');
                    }, 0)
                } else if (transition == 'push-right') {
                    setTimeout(() => {
                        active_page.style.setProperty('transform', 'translateX(100vw)');
                    }, 0)                    
                }
            }

            let page = this.el.querySelector('[data-role="page"][data-id="' + id + '"]');

            if (!page) {
                let el = $('template[data-id="' + id + '"]').el;

                if (el) {
                    page = $.el(el.innerHTML);                    
                    page.setAttribute('data-id', id);
                    this.el.append(page);
                }       
            }             

            if (page) {          
                page.classList.add('before-active');

                if (transition == 'push-left') {
                    page.style.setProperty('transform', 'translateX(100vw)');
                
                    setTimeout(() => {
                        page.style.setProperty('transform', 'translateX(0)');                        
                    }, 10);
                } else if (transition == 'push-right') {
                    page.style.setProperty('transform', 'translateX(-100vw)');

                    setTimeout(() => {
                        page.style.setProperty('transform', 'translateX(0)');                        
                    }, 10);
                } else {
                    page.style.setProperty('left', this.x + 'vw');                    
                }

                if (push_state) {
                    $.pushState({"pwa": true}, '#' + id);
                    $.page_stack.push({"id": id, "transition": transition});

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
                },300)
                resolve(true);                
            }
        })
    }

    set_active_page(id) {
        let current_active = this.el.querySelector('[data-role="page"].active');

        if (current_active) {
            current_active.classList.remove('active');
        }

        let page = this.el.querySelector('[data-role="page"][data-id="' + id + '"]');

        if (page) {
            page.classList.remove('before-active');
            page.classList.add('active');
        }
    }

    query(selector) {
        return this.el.querySelector(selector);
    }

    queryAll(selector) {
        return this.el.querySelectorAll(selector);
    }

    show_overlay() {
        let overlay = this.query('& > .overlay');

        if (overlay) {
            overlay.classList.add('open');
        }
    }

    hide_overlay() {
        let overlay = this.query('& > .overlay');

        if (overlay) {
            overlay.classList.remove('open');
        }
    }

    toggle_sidebar() {
        let sidebar = this.query('[data-role="sidebar"]');

        if (sidebar) {
            if (sidebar.classList.contains('open')) {
                this.hide_overlay();
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-is-open');                                 
            } else {
                this.show_overlay();
                sidebar.classList.add('open');   
                document.body.classList.add('sidebar-is-open');                             
            }
        }
    }

    open_sidebar() {
        let sidebar = this.query('[data-role="sidebar"]');

        if (sidebar) {
            if (sidebar.classList.contains('open')) return; 

            this.show_overlay();
            sidebar.classList.add('open');   
            document.body.classList.add('sidebar-is-open');                             
        }
    }

    close_sidebar() {
        let sidebar = this.query('[data-role="sidebar"]');

        if (sidebar) {
            if (!sidebar.classList.contains('open')) return; 

            this.hide_overlay();
            sidebar.classList.remove('open');   
            document.body.classList.remove('sidebar-is-open');                             
        }
    }

    open_dialog(id) {
        let el = $('template[data-id="' + id + '"]').el;

        if (el) {
            let dialog = new Dialog();
            dialog.html(el.innerHTML);
            return dialog.open();
        }

        return Promise.resolve({status:404,description:'dialog not found!'});
    }

    page_dialog(id) {
        let el = $('template[data-id="' + id + '"]').el;

        if (el) {
            let dialog = new Dialog({
                id: 'page-dialog',
                width: '720'
            })

            dialog.html(el.innerHTML);

            let header = dialog.querySelector('header');

            if (header) {
                header.querySelectorAll('a[data-role="icon-button"]').forEach(el => {
                    el.remove();
                })

                header.append($.el('<a href="#" data-role="icon-button" class="right ui-round" data-rel="close"><span class="ui-icon-delete"></span></a>'));
            }

            let footer = dialog.querySelector('footer');

            if (footer) {
                footer.remove();
            }

            let popup = dialog.querySelector('.popup');

            if (popup) {
                popup.append($.el('<div class="flex-row"><a href="#" data-role="button" data-rel="close" class="ui-icon-inline ui-icon-check" style="margin-top:2em;">OK</a></div>'));
            }

            return dialog.open();
        }

        return Promise.resolve({status:404,description:'dialog not found!'});
    }

    show_message(message, title = "Message Box", width = '360') {
        let dialog = new Dialog({
            id:'show-message',
            width: width
        })

        let sb = new Array();

        sb.push('<div data-role="page">');
        sb.push('<header>');
        sb.push('<h1>' + title + '</h1>');
        sb.push('<a href="#" data-role="icon-button" class="right ui-round" data-rel="close"><span class="ui-icon-delete"></span></a>');
        sb.push('</header>');
        sb.push('<main>');
        sb.push('<p>' + message + '</p>');
        sb.push('<a href="#" data-rel="close" data-role="button">OK</a>');
        sb.push('</main>')
        sb.push('</div>');

        dialog.html(sb.join(''));
        return dialog.open();
    }

    confirm(message, title = "Confirm", width = '360') {
        let dialog = new Dialog({
            id:'confirm',
            width: width
        })

        let sb = new Array();

        sb.push('<div data-role="page">');
        sb.push('<header>');
        sb.push('<h1>' + title + '</h1>');
        sb.push('<a href="#" data-role="icon-button" class="right ui-round" data-rel="close"><span class="ui-icon-delete"></span></a>');
        sb.push('</header>');
        sb.push('<main>');
        sb.push('<p>' + message + '</p>');
        sb.push('<a href="#" data-rel="close" data-role="button" data-response=\'' + '{"status":200, "description":"ok"}' + '\'>OK</a>');
        sb.push('<a href="#" data-rel="close" data-role="button" data-response=\'' + '{"status":201, "description":"cancel"}' + '\'>CANCEL</a>');
        sb.push('</main>')
        sb.push('</div>');

        dialog.html(sb.join(''));
        return dialog.open();
    }
}

export default PWA; 