// ==UserScript==
// @name           Relics of Avabur Stamina Badge
// @namespace      https://github.com/davidmcclelland/
// @author         Dave McClelland <davidmcclelland@gmail.com>
// @homepage       https://github.com/davidmcclelland/roa-stamina-bage
// @supportURL     https://github.com/davidmcclelland/roa-stamina-bage/issues
// @downloadURL    https://github.com/davidmcclelland/roa-stamina-bage/raw/master/roa-stamina-badge.user.js
// @description    Displays current stamina as a badge on top of the favicon
// @match          https://*.avabur.com/game*
// @version        0.0.1
// @run-at         document-end
// @connect        githubusercontent.com
// @connect        github.com
// @connect        self
// @require        https://cdn.rawgit.com/omichelsen/compare-versions/v3.1.0/index.js
// @require        https://cdn.rawgit.com/tommoor/tinycon/0.6.5/tinycon.min.js
// @license        LGPL-2.1
// @noframes
// ==/UserScript==

(function($) {
	'use strict';

	const INTERNAL_UPDATE_URL = "https://api.github.com/repos/davidmcclelland/roa-stamina-badge/contents/roa-stamina-badge.user.js";
	let checkForUpdateTimer = 0;

	function updateBadge() {
		const searchSpan = document.getElementById('autosRemaining');

        const staminaRemainingText = searchSpan.innerText || searchSpan.textContent;
        const staminaRemainingNumber = parseInt(staminaRemainingText, 10);

        Tinycon.setBubble(staminaRemainingNumber);
	}

	function checkForUpdate() {
	    let version = "";
	    $.get(INTERNAL_UPDATE_URL).done(function(res){
	        const match = atob(res.content).match(/\/\/\s+@version\s+([^\n]+)/);
            version = match[1];

	        if (compareVersions(GM_info.script.version, version) < 0) {
	            const message = "<li class=\"chat_notification\">RoA Stamina Badge has been updated to version "+version+"! <a href=\"https://github.com/davidmcclelland/roa-stamina-badge/raw/master/roa-stamina-badge.user.js\" target=\"_blank\">Update</a> | <a href=\"https://github.com/davidmcclelland/roa-stamina-badge/commits/master\" target=\"_blank\">Changelog</a></li>";
	            // TODO: Handle chat direction like ToA does
	            $("#chatMessageList").prepend(message);
	        }
			setTimeout(checkForUpdate, 24*60*60*1000);
	    });
	}

	function getMutationObserver() {
		return new MutationObserver(updateBadge)
	}

	checkForUpdateTimer = setTimeout(checkForUpdate, 10000);

	const observer = new MutationObserver(updateBadge);
	observer.observe(document.querySelector('#autosRemaining'), {
		childList: true
	});
})(jQuery);