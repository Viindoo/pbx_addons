
# -*- encoding: utf-8 -*-
{
    'name': 'Asterisk Plus HR',
    'live_test_url': 'https://pbx-demo-18.oduist.com/',
    'version': '2.0.1',
    'author': 'Oduist',
    'price': 0,
    'currency': 'EUR',
    'maintainer': 'Oduist',
    'support': 'support@oduist.com',
    'license': 'Other proprietary',
    'category': 'Phone',
    'summary': 'Asterisk Plus HR integration',
    'description': "",
    'depends': ['hr', 'asterisk_plus'],
    'data': [
        'security/server.xml',
        'views/hr_employee_views.xml',
        'views/hr_employee_public_views.xml',
    ],
    'demo': [],
    "qweb": ['static/src/xml/*.xml'],
    'installable': True,
    'application': False,
    'auto_install': False,
    'images': ['static/description/logo.png'],
}
