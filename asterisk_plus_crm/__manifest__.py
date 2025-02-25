
# -*- encoding: utf-8 -*-
{
    'name': 'Asterisk Plus CRM',
    'live_test_url': 'https://pbx-demo-15.oduist.com/',
    'version': '2.0.1',
    'author': 'Oduist',
    'price': 0,
    'currency': 'EUR',
    'maintainer': 'Oduist',
    'support': 'support@oduist.com',
    'license': 'Other proprietary',
    'category': 'Phone',
    'summary': 'Asterisk Plus CRM integration',
    'description': "",
    'depends': ['crm', 'utm', 'asterisk_plus'],
    'data': [
        'security/server.xml',
        'views/crm_lead.xml',
        'views/call.xml',
        'views/utm.xml',
        'views/settings.xml',

    ],
    'demo': [],
    "qweb": ['static/src/xml/*.xml'],
    'installable': True,
    'application': False,
    'auto_install': False,
    'images': ['static/description/logo.png'],
}
