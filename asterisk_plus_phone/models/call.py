from datetime import datetime

from odoo import api, fields, models


class Call(models.Model):
    _inherit = 'asterisk_plus.call'

    recently = fields.Many2one("asterisk_plus_phone.recently_call")

    @api.model_create_multi
    def create(self, vals_list):
        for val in vals_list:
            recently = self.env['asterisk_plus_phone.recently_call'].search([
                ('calling_number', '=', val['calling_number']),
                '|', ('called_number', '=', val['called_number']),
                ('called_number', '=', val['calling_number']),
                ('calling_number', '=', val['called_number']),
            ], limit=1)
            if not recently:
                recently = self.env['asterisk_plus_phone.recently_call'].create({
                    'calling_number': val['calling_number'],
                    'called_number': val['called_number'],
                    'calling_user': val.get('calling_user'),
                    'answered_user': val.get('answered_user'),
                    'partner': val.get('partner'),
                    'last_call_date': datetime.utcnow()
                })
            else:
                recently.write({
                    'last_call_date': datetime.utcnow(),
                    'calling_number': val['calling_number'],
                    'called_number': val['called_number'],
                })
            val.update({"recently": recently.id})

        return super(Call, self).create(vals_list)

    def write(self, values):
        if 'partner' in values:
            self.recently.partner = values['partner']
        return super(Call, self).write(values)

    @api.model
    def get_widget_calls(self, domain, limit=None, offset=0, order='id desc', fields=[]):
        calls = self.env['asterisk_plus.call'].search(domain)
        read_fields = self.get_widget_fields()
        payload = []
        if isinstance(fields, list):
            read_fields.extend(fields)
        for call in calls:
            call_data = call.read(read_fields)[0]
            if call.called_users:
                call_data.update({'called_users': list(call.called_users.read(['id', 'name'])[0].values())})
            payload.append(call_data)
        return payload

    @staticmethod
    def get_widget_fields():
        return [
            "id",
            "duration_human",
            "called_number",
            "calling_number",
            "called_users",
            "calling_user",
            "partner",
            "direction",
            "started"
        ]