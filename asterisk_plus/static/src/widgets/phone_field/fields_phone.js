/** @odoo-module **/
import basic_fields from 'web.basic_fields'

const Phone = basic_fields.FieldPhone

Phone.include({

    init() {
        this._super.apply(this, arguments)
        this.enableCall = 'enable_call' in this.attrs.options ? this.attrs.options.enable_call : true
        this.attrs.options.enable_call = this.enableCall
    },

    getFocusableElement() {
        if (this.enableCall && this.mode === 'readonly') {
            return this.$el.filter('.' + this.className).find('a')
        }
        return this._super.apply(this, arguments)
    },

    _onClickPhone: function (ev) {
        ev.preventDefault()
        ev.stopPropagation()

        return this._rpc({
            model: 'asterisk_plus.server',
            method: 'originate_call',
            args: [this.value, this.model, parseInt(this.res_id)],
        })
    },

    _renderReadonly: function () {
        const def = this._super.apply(this, arguments)
        if (this.enableCall && this.value) {
            const $composerButton = $('<a>', {
                title: 'Click to Call',
                href: '',
                class: 'ml-3 d-inline-flex align-items-center o_field_phone',
                html: $('<small>', {class: 'font-weight-bold ml-1', html: 'Call'}),
            })
            $composerButton.prepend($('<i>', {class: 'fa fa-phone'}))
            $composerButton.on('click', this._onClickPhone.bind(this))
            this.$el = this.$el.add($composerButton)
        }
        return def
    },
})

