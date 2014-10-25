/*jslint node:true */
'use strict';
/**
Config file for sending E-Mails
Admin may change service, user and pass if he or she wants to use another mail-address
*/

module.exports = function () {
	return {
		service: 'Gmail',
		auth: {
			user: 'anfesys@gmail.com',
			pass: 'DaFSsi6Wfs!'
		}
	};
};
