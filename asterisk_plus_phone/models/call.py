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
