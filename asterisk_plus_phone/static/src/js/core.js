/** @odoo-module **/
import {registry} from "@web/core/registry"
import {PhoneSysTray} from "@asterisk_plus_phone/components/tray/tray"
import {Phone} from "@asterisk_plus_phone/components/phone/phone"
import {uid} from "web.session"

const {EventBus} = owl.core

export const phoneService = {
    dependencies: ["user"],
    async start(env, {user}) {
        if (!await user.hasGroup('asterisk_plus.group_asterisk_user') &&
            !await user.hasGroup('asterisk_plus.group_asterisk_admin')) return

        if (env.services.router.current.pathname.includes("/web")) {
            const phone_enabled = await env.services.orm.call("asterisk_plus.settings", "get_param", ['phone_enabled'])
            const {user_config} = await env.services.orm.call('res.users', 'get_sip_user_config', [uid])

            if (phone_enabled && user_config) {
                let bus = new EventBus()
                registry.category("systray").add('phoneSysTray', {Component: PhoneSysTray, props: {bus}})
                registry.category("main_components").add('mainPhone', {Component: Phone, props: {bus}})
            }
        } else {
            console.log(`[Phone] Doesn't work on path: ${env.services.router.current.pathname}`)
        }
    }
}
registry.category("services").add("phone", phoneService)