/** @odoo-module **/
"use strict"
import {useService} from "@web/core/utils/hooks"
import {setFocus} from "@asterisk_plus_phone/js/utils"
const {Component, useState} = owl
const {onMounted, onWillStart, useRef} = owl.hooks
const {loadJS} = owl.utils

export class PhoneSysTray extends Component {
    static template = 'asterisk_plus_phone.menu'

    constructor() {
        super(...arguments)
        this.bus = this.props.bus
        this.state = useState({
            isDisplay: false,
            inCall: false,
            isContextMenu: false,
            isReportModal: false,
        })
        this.sentry_enabled = false
        this.rMenu = useRef('rMenu')
        this.bugDescription = useRef('bugDescription')
    }

    setup() {
        super.setup()
        this.notification = useService("notification")
        this.orm = useService("orm")

        onMounted(() => {
            this.bus.on('busTraySetState', this, function ({isDisplay, inCall}) {
                this.state.isDisplay = isDisplay
                this.state.inCall = inCall
            })

            const self = this
            this.orm.call("asterisk_plus.settings", "get_param", ['sentry_enabled']).then((response) => {
                if (response === true) {
                    self.sentry_enabled = true
                    self.rMenu.el.addEventListener("focusout", function () {
                        self.state.isContextMenu = false
                    })
                    loadJS('https://js-de.sentry-cdn.com/9e7c3efe3d24ce38c0a454974408187b.min.js')
                }
            })
        })
    }

    _onClick() {
        this.bus.trigger('busPhoneToggleDisplay')
    }

    _onClickHangUp() {
        this.bus.trigger('busPhoneHangUp')
        this.state.isDisplay = false
        this.state.inCall = false
    }

    _onContextmenu(ev) {
        if (this.sentry_enabled) {
            ev.preventDefault();
            this.state.isContextMenu = true
            setFocus(this.rMenu.el)
        }
    }

    _onClickBugReport() {
        this.state.isContextMenu = false
        this.state.isReportModal = true
    }

    _onClickCloseReport() {
        this.state.isReportModal = false
        this.bugDescription.el.value = ''
        this.bugDescription.el.style.border = ''
    }

    _onClickSendReport() {
        const bugDescription = this.bugDescription.el.value
        if (!bugDescription) {
            this.notification.add('Missing "Bug Description"', {title: 'Phone', sticky: false, type: 'warning'})
            this.bugDescription.el.style.border = '2px solid #d92929'
        } else {
            this.state.isReportModal = false
            this.notification.add('Report sent successfully!', {title: 'Phone', sticky: false, type: 'info'})
            this.bus.trigger('busBugReport')
            setTimeout(() => Sentry.captureMessage(`[Phone] - Bug report: ${bugDescription}`), 1500)
            this.bugDescription.el.style.border = ''
            this.bugDescription.el.value = ''

        }
    }
}