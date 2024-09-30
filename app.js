import $ from './modules/teriyaki/index.js';
import Dialog from './modules/dialog/index.js';
import PWA from './modules/pwa/index.js';

$.ready(evt => {
    console.log('ready');

    $.page_stack = new Array();
    $.dialogs = new Array();

    window.$ = $;
    window.Dialog = Dialog;

    let counter = 1;
    let main = $('body > main').el;
    let $pwa = new PWA(main);
    
    let click_handler = evt => {

        let el = evt.target;


        if (el.matches('a')) {
            evt.preventDefault();
            evt.stopPropagation();

            console.log('a-clicked:' + counter);
            console.log(el);
            counter++;

            let href = $.default(el.getAttribute('href'), '');
            let rel = $.default(el.getAttribute('data-rel'), '');

            if (href.startsWith('#')) {
                evt.preventDefault();
                evt.stopPropagation();

                if (href == '#') {
                    let rel = el.getAttribute('data-rel');

                    if (rel == 'back') {
                        history.back();
                    } else if (rel == 'close') {
                        if (el.closest('.popup')) {
                            history.back();
                        }
                    } else if (rel == 'toggle-sidebar') {
                        $pwa.toggle_sidebar();
                    }
                } else {
                    let id = href.substring(1);

                    if (rel == 'dialog') {
                        $pwa.page_dialog(id).then(response => {
                            if (response.status == 302) {
                                let link = response.link;

                                rel = $.default(link.getAttribute('data-rel'), '');
                                href = $.default(link.getAttribute('href'), '');
                                id = href.substring(1);

                                if (rel == 'dialog') {
                                    $pwa.page_dialog(id);
                                } else {
                                    $pwa.navigate(id).then(() => {
                                        window.scrollTo(0, 0);
                                    })
                                }
                            }   
                        })
                    } else {
                        if ($.dialogs.length > 0) {
                            Dialog.closeAll();
                        }

                        $pwa.navigate(id).then(() => {
                            window.scrollTo(0, 0);
                        })   
                    }
                }
            }

            if (el.closest('[data-role="sidebar"]')) {
                $pwa.close_sidebar();
            }
        } else if (el.matches('.overlay')) {
            if (document.body.classList.contains('sidebar-is-open')) {
                $pwa.close_sidebar();
            }
        }
    }
    
    window.addEventListener('popstate', evt => {
        let state = evt.state;

        if (!state) return;


        if (state.pwa) {
            evt.stopPropagation();

            if ($.page_stack.length > 0) {
                let node = $.page_stack.pop();
                let transition = node.transition;
                
                if ($.page_stack.length > 0) {
                    node = $.page_stack[$.page_stack.length - 1];

                    if (transition == 'push-left') {
                        transition = 'push-right';
                    } else if (transition == 'push-right') {
                        transition = 'push-left';
                    }

                    this.navigate(node.id, transition, false);
                }
            }
        } else if (state.dialog) {
            evt.stopPropagation();

            if ($.dialogs.length > 0) {
                let modal = $.dialogs.pop();
                let popup = modal.dialog.querySelector('.popup');

                popup.addEventListener('animationend', evt => {
                    let animation_name = evt.animationName;
                    
                    if (animation_name == 'pop-out') {
                        modal.destroy();
                    }    
                })

                modal.dialog.classList.add('transition-out');
            }            
        }
    })

    document.body.addEventListener('click', click_handler);

    window.$pwa = $pwa;

    $pwa.load('sidebar');
    $pwa.load('home');

})
