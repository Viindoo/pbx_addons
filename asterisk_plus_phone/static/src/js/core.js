/** @odoo-module **/
import {registry} from "@web/core/registry"
import {PhoneSysTray} from "@asterisk_plus_phone/components/tray/tray"
import {Phone} from "@asterisk_plus_phone/components/phone/phone"
import {EventBus} from "@odoo/owl"
import {user} from "@web/core/user"

const uid = user.userId

export const phoneService = {
    dependencies: ["orm"],
    async start(env, {orm}) {
        if (!await user.hasGroup('asterisk_plus.group_asterisk_user') &&
            !await user.hasGroup('asterisk_plus.group_asterisk_admin')) return

        const pathname = document.location.pathname
        if (pathname.includes("/odoo")) {
            const phone_enabled = await orm.call("asterisk_plus.settings", "get_param", ['phone_enabled'])
            const {user_config} = await orm.call('res.users', 'get_sip_user_config', [uid])

            if (phone_enabled && user_config) {
                let bus = new EventBus()
                registry.category("systray").add('phoneSysTray', {Component: PhoneSysTray, props: {bus}})
                registry.category("main_components").add('mainPhone', {Component: Phone, props: {bus}})
            }
        } else {
            console.log(`[Phone] Doesn't work on path: ${pathname}`)
        }
    }
}
registry.category("services").add("phone", phoneService)