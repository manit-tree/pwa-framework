import lazy_load from '../lazy-load/index.js';

class Dialog {
    constructor(options = {}) {
        let default_options = {
            "id":"dialog",
            "width":"500"
        }

        this.options = $.extend(default_options, options)
        this.dialog = $.el('<div data-role="dialog" data-id="' + this.options.id +'" style="--width:' + this.options.width + 'px;"><div class="popup"></div></div>');

        document.body.append(this.dialog);
    } 

    static closeAll() {
        $.dialogs.forEach(modal => {
            modal.destroy();
        })
    }

    querySelector(selector) {
        return this.dialog.querySelector(selector);
    }

    querySelectorAll(selector) {
        return this.dialog.querySelectorAll(selector);
    }

    html(html) {
        let popup = this.dialog.querySelector('.popup');
        $(popup).html_unsafe(html);
    }

    open() {
        return new Promise((resolve, reject) => {
            this.dialog.classList.add('before-open');

            setTimeout(() => {
                let popup = this.dialog.querySelector('.popup');

                if ($(popup).height() > (window.innerHeight * 0.9)) {
                    this.dialog.classList.add('overflow');
                }

                this.querySelectorAll('img.lazy').forEach(img => {
                    lazy_load(img);
                })

                this.dialog.classList.remove('before-open');
                this.resolve = resolve;
                this.dialog.classList.add('open');

                $.pushState({"dialog":true}, '#dialog-' + this.options.id);
                $.dialogs.push(this);
            }, 100)
        })
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

export default Dialog;