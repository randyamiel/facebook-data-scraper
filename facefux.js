
// @include        /^https?:\/\/facebook\.com\//

// @include        /^https?:\/\/[^\/]*\.facebook\.com\//
// @exclude        /^https?:\/\/[^\/]*(channel|static)[^\/]*facebook\.com\//
// @exclude        /^https?:\/\/[^\/]*facebook\.com\/.*(ai.php|morestories.php|generic.php|xti.php|plugins|connect|ajax|sound_iframe|l.php\?u)/
// @exclude        /^https?:\/\/[^\/]*\.facebook\.com\/help/
// @exclude        /^https?:\/\/[^\/]*\.facebook\.com\/support/
// @exclude        /^https?:\/\/[^\/]*\.facebook\.com\/saved/
// @connect        mbasic.facebook.com

// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest

*/
var define, exports; // Guard against global scope leak in ViolentMonkey extension

// Extension API
var Extension = (function() {
	var api = {
		"storage": {
			"get":
				function(keys, defaultValue, callback, prefix) {
					// Keys can be either a single keys or an array of keys
					if (typeof keys=="string") {
						callback(GM_getValue(prefix+keys,defaultValue));
					}
					else if (typeof keys=="object" && keys.length) {
						var values = {};
						for (var i=0; i<keys.length; i++) {
							var default_value;
							if (typeof defaultValue=="object" && defaultValue.length && i<defaultValue.length) {
								default_value = defaultValue[i];
							}
							values[keys[i]] = GM_getValue(prefix+keys[i],default_value);
						}
						callback(values);
					}
					return;
				}
			,
			"set":
				function(key,val,callback, prefix) {
					setTimeout(function() {
						var ret = GM_setValue(prefix+key,val); 
						if(typeof callback=="function") { 
							callback(key,val,ret); 
						} 
					},0);
				}
		},
		"ajax":function(urlOrObject,callback) {
			var details;
			var internalCallback = function(response) {
				var headers={};
				response.responseHeaders.split(/\r?\n/).forEach(function(header) {
					var val = header.split(/\s*:\s*/,2);
					headers[ val[0].toLowerCase() ] = val[1];
				});
				callback( response.responseText,response.status,headers );
			};
			if (typeof urlOrObject=="string") {
				details = {"method":"GET","url":urlOrObject,"onload":internalCallback };
			}
			else if (urlOrObject.url) {
				details = urlOrObject;
				details.onload = internalCallback;
			}
			else {
				alert("Invalid parameter passed to Extension.ajax");
				callback(null);
			}
			GM_xmlhttpRequest(details);
		}
	};
	// Backwards compat
	api.prefs = api.storage;
	return api;
})();

setTimeout(function() { // Fix for FF55.0b1
  GM_addStyle(`
#sfx_feature_tour {
  position: absolute;
  z-index: 999999;
  width: 500px;
  min-height: 300px;
  max-height: 90vh;
  top: 5vh;
  left: 5vw;
  background-color: white;
  border: 2px solid black;
  border-radius: 10px;
}

#sfx_trending_settings {
  display: none;
  font-weight: normal;
  clear: both;
  border: 1px solid #ccc;
  padding: 3px;
}
#sfx_trending_settings_link {
  line-height: 16px;
  margin-left: 10px;
  vertical-align: bottom;
  font-size: 11px;
  color: #777;
}
.sfx_trending_headline {
  color: #777;
  overflow: visible !important;
  overflow-wrap: normal;
  font-size: 11px !important;
  font-weight: normal;
}
li[data-topicid] > div {
  max-height: none !important;
}

.sfx_anonymous {
  border-radius: 3px;
  padding-left: 2px;
  padding-right: 2px;
}
.sfx_anonymous_1 {
  background-color: #E6A4B5;
  color: black !important;
}
.sfx_anonymous_2 {
  background-color: #EDC99A;
  color: black !important;
}
.sfx_anonymous_3 {
  background-color: #F3F190;
  color: black !important;
}
.sfx_anonymous_4 {
  background-color: #BBDB98;
  color: black !important;
}
.sfx_anonymous_5 {
  background-color: #EBCD3E;
  color: black !important;
}
.sfx_anonymous_6 {
  background-color: #6F308B;
  color: white !important;
}
.sfx_anonymous_7 {
  background-color: #DB6A29;
  color: white !important;
}
.sfx_anonymous_8 {
  background-color: #97CEE6;
  color: black !important;
}
.sfx_anonymous_9 {
  background-color: #B92036;
  color: white !important;
}
.sfx_anonymous_10 {
  background-color: #C2BC82;
  color: black !important;
}
.sfx_anonymous_11 {
  background-color: #7F8081;
  color: white !important;
}
.sfx_anonymous_12 {
  background-color: #62A647;
  color: white !important;
}
.sfx_anonymous_13 {
  background-color: #D386B2;
  color: black !important;
}
.sfx_anonymous_14 {
  background-color: #4578B3;
  color: white !important;
}
.sfx_anonymous_15 {
  background-color: #DC8465;
  color: black !important;
}
.sfx_anonymous_16 {
  background-color: #483896;
  color: white !important;
}
.sfx_anonymous_17 {
  background-color: #E1A131;
  color: black !important;
}
.sfx_anonymous_18 {
  background-color: #91288D;
  color: white !important;
}
.sfx_anonymous_19 {
  background-color: #E9E857;
  color: black !important;
}
.sfx_anonymous_20 {
  background-color: #7D1716;
  color: white !important;
}
.sfx_anonymous_21 {
  background-color: #93AD3C;
  color: black !important;
}
.sfx_anonymous_22 {
  background-color: #6E3515;
  color: white !important;
}
.sfx_anonymous_23 {
  background-color: #D12D27;
  color: white !important;
}
.sfx_anonymous_24 {
  background-color: #2C3617;
  color: white !important;
}
.sfx_anonymous_25 {
  background-color: #000000;
  color: white !important;
}

.sfx_bubble_note {
  position: fixed;
  min-height: 50px;
  min-width: 150px;
  max-height: 90vh;
  max-width: 50vw;
  margin: 10px;
  font-family: arial;
  background-color: #FFFFE5;
  color: black;
  border: 1px solid #3F5C71;
  font-size: 12px;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 0 5px #888888;
  z-index: 99999 !important;
  cursor: move;
  overflow: auto;
}
.sfx_bubble_note .sfx_bubble_note_title {
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
}
.sfx_bubble_note .sfx_bubble_note_subtitle {
  font-size: 12px;
  font-weight: bold;
  margin: 5px 0;
}
.sfx_bubble_note .sfx_bubble_note_data {
  white-space: pre;
  font-family: monospace;
  font-size: 11px;
  background-color: #ddd;
  overflow: auto;
  max-height: 50vh;
}
.sfx_bubble_note_top_right {
  right: 0;
  top: 0;
}
.sfx_bubble_note_bottom_right {
  right: 0;
  bottom: 0;
}
.sfx_bubble_note_top_left {
  left: 0;
  top: 0;
}
.sfx_bubble_note_bottom_left {
  left: 0;
  bottom: 0;
}

/* Comment Button */
.sfx_comment_button {
  float: right;
  padding: 4px 8px;
  margin: 4px;
  background-color: #5A74A8 !important;
  border: 1px solid #1A356E;
  color: white;
  font-weight: bold;
  font-size: 12px !important;
  line-height: 12px !important;
  border-radius: 3px;
}
.sfx_comment_button_msg {
  float: right;
  line-height: 12px;
  display: inline-block;
  margin: 4px;
  height: 14px;
  padding: 5px 4px;
  color: #9197A3;
}


#sfx_control_panel {
  position: fixed;
  min-width: 150px;
  max-width: 250px;
  border-radius: 3px;
  background-color: white;
  color: #404040;
  z-index: 99;
  opacity: .6;
  font-size: 12px;
  box-shadow: 0 0 5px rgba(105, 118, 136, 0.2), 0 5px 5px rgba(132, 143, 160, 0.2), 0 10px 10px rgba(132, 143, 160, 0.2), 0 20px 20px rgba(132, 143, 160, 0.2), 0 0 5px rgba(105, 118, 136, 0.3);
}
#sfx_control_panel:hover {
  opacity: 1;
}
#sfx_control_panel .sfx_cp_header {
  font-weight: bold;
  cursor: move;
  margin-bottom: 2px;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  vertical-align: top;
  padding: 5px;
  border-radius: 3px 3px 0 0;
  text-align: left;
  border: 0;
  color: #fff;
  background: linear-gradient(to right, #2C4372, #3B5998);
}
#sfx_control_panel .sfx_cp_section_label {
  background-color: #eee;
  font-size: 10px;
  font-family: arial,sans serif;
  font-weight: bold;
  padding: 3px;
}
#sfx_control_panel .sfx_cp_section_content {
  margin-bottom: 5px;
}

*[sfx_update_count]:before {
  display: block;
  border: 2px solid orange;
  border-radius: 5px;
  padding: 5px;
  background-color: white;
  content: "Updates: [" attr(sfx_update_count) "] " attr(sfx_update_tracking);
}

.sfx_insert_step_1 {
  margin: 2px;
  outline: 2px solid red;
}
.sfx_insert_step_2 {
  margin: 2px;
  outline: 2px solid green;
}
.sfx_insert_step_3 {
  margin: 2px;
  outline: 2px solid blue;
}
.sfx_insert_step_4 {
  margin: 2px;
  outline: 2px solid orange;
}
.sfx_insert_step_5 {
  margin: 2px;
  outline: 2px solid purple;
}
.sfx_insert_step_6 {
  margin: 2px;
  outline: 2px solid lime;
}
.sfx_insert_step_7 {
  margin: 2px;
  outline: 2px solid cyan;
}

.sfx_debug_tab {
  opacity: .5;
}
.sfx_debug_tab:hover {
  opacity: 1;
}

/*ELEMENTS*/
/* REUSABLE STYLES */
.sfx_info {
  font-size: 12px;
}
input {
  border: 1px solid #bec4cd;
  border-radius: 2px;
}
/* BUTTONS */
.sfx_button {
  background-color: #4267B2;
  border: 1px solid #4267B2;
  color: white;
  font-size: 12px;
  line-height: 22px;
  cursor: pointer;
  border-radius: 3px;
  padding: 2px 8px;
  font-weight: bold;
}
.sfx_button:hover {
  background-color: #365899;
}
.sfx_button.secondary {
  background-color: #e7e9ef;
  color: #000000;
  border-color: #d7dce5;
}
.sfx_button.secondary:hover {
  background-color: #d0d5e0;
}
/* DIALOG BOXES */
.sfx_dialog_title_bar {
  padding: 10px 12px;
  font-weight: bold;
  line-height: 28px;
  min-height: 28px;
  margin: -10px -10px 0;
  border: 0;
  margin-bottom: 10px;
  color: #fff;
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  vertical-align: top;
  background: linear-gradient(to right, #2C4372, #3B5998 80%);
}
.sfx_dialog_title_bar .sfx_button {
  letter-spacing: normal !important;
  background-color: #253860;
  border: 0;
}
.sfx_dialog_title_bar .sfx_button.secondary {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 0;
  font-weight: normal;
}
.sfx_dialog {
  z-index: 99999;
  overflow: hidden;
  position: fixed;
  top: 48px;
  left: 20px;
  width: 90vw;
  min-width: 500px;
  max-width: 1000px;
  max-height: 90vh;
  font-family: helvetica, arial, sans-serif;
  transition: height .5s linear;
  color: #404040;
  border: 0;
  border-radius: 3px;
  padding: 10px;
  background-color: #E9EBEE;
  box-shadow: 0 0 5px rgba(105, 118, 136, 0.2), 0 5px 5px rgba(132, 143, 160, 0.2), 0 10px 10px rgba(132, 143, 160, 0.2), 0 20px 20px rgba(132, 143, 160, 0.2);
}
#sfx_options_dialog_sections {
  flex: none;
  width: 125px;
}
#sfx_options_dialog_content {
  padding: 10px;
}
#sfx_options_dialog_body {
  background-color: white;
}
.sfx_options_dialog_section {
  padding: 6px 5px 6px 10px;
  background-color: #F6F7F9;
  font-weight: bold;
  margin: 2px;
  cursor: pointer;
}
.sfx_options_dialog_section.selected {
  background-color: #4267B2;
  color: white;
  cursor: auto;
}
.sfx_jewelCount {
  right: auto !important;
  left: 1px !important;
  top: 1px !important;
  padding: 0 !important;
}
.sfx_jewelCount > * {
  border: 1px solid white;
  min-height: 15px;
  padding: 1px 2px !important;
  font-size: 10px !important;
  line-height: 13px !important;
  color: white !important;
  background-color: #253860 /*#80aaff*/ /*2c4166*/ !important;
  border-radius: 3px !important;
}
/*END ELEMENTS*/

html.sfx_fix_timestamps abbr.livetimestamp:not(.sfx_no_fix_timestamp):before {
  content: attr(title) " (";
}
html.sfx_fix_timestamps abbr.livetimestamp:not(.sfx_no_fix_timestamp):after {
  content: ")";
}

.sfx_data_table {
  border-collapse: collapse;
}
.sfx_data_table th {
  font-weight: bold;
  background-color: #ccc;
  padding: 5px;
  border: 1px solid #666;
}
.sfx_data_table th.sortable {
  cursor: pointer;
}
.sfx_data_table th.sortable:hover {
  text-decoration: underline;
}
.sfx_data_table td {
  padding: 1px 5px;
  border: 1px solid #ddd;
}

html:not(.sfx_hide_show_all) .sfx_hide_hidden {
  display: none !important;
}
.sfx_hide_frame {
  position: absolute;
  z-index: 99999;
  opacity: .2;
  background-color: lime;
  outline: 2px solid lime;
  margin: 0 !important;
  font-weight: bold;
  text-align: center;
  color: transparent;
}
.sfx_hide_frame_hidden {
  color: white;
  background-color: red;
  outline: 2px solid red;
}
.sfx_hide_frame_hidden:hover {
  background-color: lime;
  outline: 2px solid red;
}
.sfx_hide_frame:hover {
  outline: 2px solid red;
  background-color: red;
  color: black;
  opacity: .5;
  cursor: pointer;
}
.sfx_hide_bubble {
  width: 400px;
}
.sfx_hide_bubble > div {
  margin: 10px 0;
}
.sfx_hide_bubble .sfx_button {
  margin-left: auto;
  margin-right: auto;
}

/* Note: Some styles are stored in JS to allow for customization */
/* Posts marked "read" should still show up when following notifications or showing a single post */
#facebook #pagelet_soft_permalink_posts .sfx_post_read > *,
#facebook[sfx_context_permalink="true"] .sfx_post_read > * {
  display: block !important;
}
#facebook #pagelet_soft_permalink_posts .sfx_post_read > *.sfx_post_marked_read_note,
#facebook[sfx_context_permalink="true"] .sfx_post_read > *.sfx_post_marked_read_note {
  display: none !important;
}
html:not(.sfx_show_read_posts) .sfx_post_read:not(.sfx_post_read_show) {
  /* Make sure to remove styles on the post itself that may have been put there by filters and change how the post is displayed */
  outline: none !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
}
html:not(.sfx_show_read_posts) .sfx_post_read:not(.sfx_post_read_show) > *:not(.sfx_post_marked_read_note) {
  display: none !important;
}
html .sfx_post_read.sfx_post_read_show > * {
  display: block !important;
}
.sfx_post_marked_read_note {
  opacity: .3;
  margin: 1px;
  font-size: 10px;
  cursor: pointer;
  padding: 0 5px;
}
.sfx_post_marked_read_note:hover {
  opacity: 1;
}
.sfx_cp_mark_all_read input {
  border-radius: 10px;
  font-size: 11px;
  padding: 2px 3px;
  line-height: 12px;
  font-weight: normal;
}
.sfx_cp_mark_all_read input[disabled="true"] {
  background-color: #eee;
  color: #aaa;
}
#sfx_post_action_tray {
  position: absolute;
  right: 32px;
  top: 1px;
  height: 16px;
  overflow: visible;
}
#sfx_post_action_tray > * {
  display: inline-block;
  width: 16px;
  height: 16px;
  float: right;
  cursor: pointer;
  margin-left: 7px;
  opacity: .5;
  font-size: 16px;
  line-height: 16px;
  background-color: transparent;
  background-repeat: no-repeat;
  color: #b1b5bb;
  z-index: 350;
}
#sfx_post_action_tray > *:hover {
  opacity: 1;
}
.sfx_post_action_menu {
  position: absolute;
  display: none;
  min-width: 150px;
  margin: 2px;
  padding: 4px;
  cursor: pointer;
  background-color: white;
  border: 1px solid #666;
  z-index: 9999;
}
.sfx_post_action_menu > div {
  padding: 4px 2px 4px 10px;
  font-size: 12px;
  font-family: arial, sans-serif;
}
.sfx_post_action_menu > div:hover {
  background-color: #7187B5;
  color: white;
}

#sfx_badge {
  position: fixed;
  z-index: 350;
  cursor: pointer;
}
#sfx_badge .sfx_sticky_note {
  white-space: nowrap;
}
#sfx_badge_logo {
  position: relative;
  z-index: 351;
  color: white;
  font-size: 9px;
  text-align: center;
  height: 30px;
  width: 30px;
  border-radius: 16px;
  opacity: .5;
  border: 2px solid transparent;
  box-shadow: 3px 3px 3px #1c1c1c;
  background: #2C4166 url(data:image/gif;base64,R0lGODlhFwAXAOYAAJOgv3%2BOr4KRsYWUtIiXt5GfvpmnxZimxJelw5mmxKCuzKCty6GuzKOwzaKvzKe00aWyz09hhFVnilZoi1lrjlxtkGh5mml6m2x9nmt8nW%2BAoW19nnGCo29%2FoHSEpXKCo3yMrH%2BPr4SUs4CProeWtYWUs4mYt4iXtoybuoqZuI6dvI2cupWkwpalwpakwZ2ryKCuy56syaGvzCxBZi1CZy5DaDFGazJHbDFFajNHbDVJbjZKbzhMcThMcDpOczpOcj1RdUBUeEBTd0JWekFVeERYe0VYfElcf1FkhlRniVhqjFxukGFzlGV3mHqLqjBFaTNIbDZLbzlOcv%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFMALAAAAAAXABcAAAe4gFMzg4SFhoeCh4Y9ShkeHUtSipNNLw%2BXlwxHk4YSmJcQAxQ7nIUlmAcbQ6WGOwuYH6yHEZ8JNrKFHJ8PE4Y1nDUFuyKDOUgCTJxFuw8NERgIlxecGsy7DUSTQArWnxWTNSTdmB7gTuOXATSKTyPMDiBJLA8mN4o4IbswG0CDFgY8FEER9wmFkEJR%2Bh3aQWDXCSi4fqzYlUIHrhkqdgGIcnGGjE8ufHScwQBVkJEzpsSI0cIIyimBAAA7) no-repeat center center;
}
#sfx_badge:hover #sfx_badge_logo {
  opacity: 1;
  border: 2px solid white;
  box-shadow: none;
}
#sfx_badge_menu {
  z-index: 350;
  display: none;
  position: absolute;
  background-color: transparent;
  color: black;
  width: 250px;
}
#sfx_badge_menu.left {
  right: 12px;
}
#sfx_badge_menu.right {
  left: 25px;
}
#sfx_badge_menu.down {
  top: 0;
}
#sfx_badge_menu.up {
  bottom: 15px;
}
#sfx_badge_menu.up #sfx_badge_menu_wrap {
  display: flex;
  flex-direction: column-reverse;
}
#sfx_badge_menu_wrap {
  background-color: white;
  border-radius: 4px;
  border-color: #ddd;
  padding: 10px;
  margin-top: 20px;
  box-shadow: 0 0 5px rgba(105, 118, 136, 0.2), 0 5px 5px rgba(132, 143, 160, 0.2), 0 10px 10px rgba(132, 143, 160, 0.2), 0 20px 20px rgba(132, 143, 160, 0.2), 0 0 5px rgba(105, 118, 136, 0.3);
}
.sfx_menu_section {
  margin-bottom: 10px;
}
.sfx_menu_section:last-child {
  margin-bottom: 0;
}
.sfx_menu_section .sfx_menu_section_title {
  color: #3B5998;
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #bec4cd;
  padding: 0 5px;
}
.sfx_menu_section .sfx_menu_item {
  padding: 3px 5px 3px 15px;
  font-size: 12px;
}
.sfx_menu_section .sfx_menu_item .sfx_news_title {
  font-size: 12px;
  color: #666;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1px 5px;
}
.sfx_menu_section .sfx_menu_item:hover {
  background-color: #7187B5;
  color: white;
}
.sfx_menu_section .sfx_menu_item:hover .sfx_news_title {
  color: white;
}
.sfx_menu_section .sfx_menu_item a.sfx_menu_item_content {
  text-decoration: none;
  color: inherit;
}

html.sfx_notification_popup {
  /* Gray out "likes" on comments
  ._33c[data-gt*="notif_type\\":\\"like\\""][data-gt*="subtype\\":\\"comment-"] {
    opacity:.4;
  }
  */
}
html.sfx_notification_popup #pagelet_bluebar,
html.sfx_notification_popup #pagelet_dock,
html.sfx_notification_popup #pagelet_ego_pane,
html.sfx_notification_popup #pagelet_sidebar,
html.sfx_notification_popup #pageFooter,
html.sfx_notification_popup #sfx_badge,
html.sfx_notification_popup .UIStandardFrame_SidebarAds {
  display: none !important;
}
html.sfx_notification_popup #globalContainer,
html.sfx_notification_popup .UIStandardFrame_Container,
html.sfx_notification_popup .UIStandardFrame_Content {
  width: 98% !important;
}
html.sfx_notification_popup .uiHeader {
  margin: 0 !important;
  padding-bottom: 0 !important;
}
html.sfx_notification_popup .UIStandardFrame_Container {
  padding-top: 0 !important;
}
html.sfx_notification_popup .UIStandardFrame_Content > .fcg {
  display: none !important;
}
html.sfx_notification_popup .jewelItemNew ._33e {
  border-left: 3px solid #4080FF !important;
}
html.sfx_notification_popup li.sfx_notification_selected {
  border-left: 3px solid red;
}
html.sfx_notification_popup #sfx_notification_popup_header {
  border: 1px solid #aaa;
  padding: 5px;
  margin: 2px;
}
html.sfx_notification_popup #sfx_notification_popup_header_actions > * {
  display: inline;
  margin-right: 10px;
}
html.sfx_notification_popup .sfx_sub_notification {
  padding-left: 50px;
}

.sfx_notification_count {
  background-color: #F40008;
  color: white;
  position: absolute;
  top: -3px;
  left: -3px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 1px;
  border: 1px solid #F40008;
  border-radius: 3px;
  z-index: 352;
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.9);
}

.sfx_filter_subscribed {
  opacity: .5;
  background-color: #d4ffd3;
}
.sfx_filter_subscribed .sfx_square_add {
  display: none;
}

.sfx_tweak_subscribed {
  opacity: .5;
  background-color: #afffbe;
}
.sfx_tweak_subscribed .sfx_square_add {
  display: none;
}

div.sfx_option {
  line-height: 24px;
  vertical-align: middle;
}
div.sfx_option input[type=checkbox]:not(.normal) ~ label {
  float: left;
  margin-right: 5px;
}
.sfx_square_control {
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 3px;
  padding: 0;
  display: inline-block;
  overflow: hidden;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  background-color: #fff;
  color: #4267B2;
  /*
  &:hover {
    opacity:.9;
  }*/
}
.sfx_square_add {
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 3px;
  padding: 0;
  display: inline-block;
  overflow: hidden;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  background-color: #fff;
  color: #4267B2;
  /*
  &:hover {
    opacity:.9;
  }*/
  color: white;
  background-color: #42b72a;
  box-shadow: none;
}
.sfx_square_delete {
  color: #a60000;
  background-color: white;
}
.sfx_dialog input[type=checkbox]:not(.normal) {
  display: none;
}
.sfx_dialog input[type=checkbox]:not(.normal) ~ label {
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 3px;
  padding: 0;
  display: inline-block;
  overflow: hidden;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  background-color: #fff;
  color: #4267B2;
  /*
  &:hover {
    opacity:.9;
  }*/
  box-shadow: inset 0 0 0 2px #3B5998;
  color: white;
}
.sfx_dialog input[type=checkbox]:not(.normal) ~ label:hover {
  opacity: 1;
}
.sfx_dialog input[type=checkbox]:not(.normal):checked ~ label {
  background-color: #3B5998;
  color: #fff;
}
.sfx_dialog input[type=checkbox]:not(.normal):checked ~ label:after {
  content: '\\2714';
  height: 20px;
  width: 20px;
  display: inline-block;
  font-size: 20px;
  line-height: 20px;
  color: white;
}
/* Section Headers displayed in right panel */
.sfx_options_dialog_section_header {
  margin: 6px 0 16px 0;
  font-size: 16px;
}
/* Options List Table */
.sfx_options_dialog_table {
  border-collapse: collapse;
  cell-spacing: 0;
  border-bottom: 1px solid #ccc;
  width: 95%;
  margin-top: 10px;
  margin-bottom: 5px;
}
.sfx_options_dialog_table thead {
  border-bottom: 2px solid #4267B2;
}
.sfx_options_dialog_table thead tr th {
  text-align: left;
  font-weight: bold;
  padding: 3px 5px;
  color: #4267B2;
}
.sfx_options_dialog_table tbody tr:hover td {
  background-color: #E9EBEE;
}
.sfx_options_dialog_table tbody td {
  border-top: 1px solid #ccc;
  padding: 3px;
  vertical-align: top;
}
.sfx_options_dialog_table tbody td.repeat {
  border-top: none;
  visibility: hidden;
}
.sfx_options_dialog_table .sfx_options_dialog_option_highlighted {
  background-color: #afffbe !important;
}
.sfx_options_dialog_table .sfx_options_dialog_option_title {
  font-size: 11px;
  font-weight: bold;
  width: 160px;
  padding-right: 20px;
}
.sfx_options_dialog_table .sfx_options_dialog_option_description {
  font-size: 12px;
  color: #5a5a5a;
}
.sfx_options_dialog_table .sfx_options_dialog_option_action {
  padding-right: 10px;
  padding-left: 10px;
}
.sfx_options_dialog_table .sfx_options_dialog_option_action input[type=checkbox] {
  transform: scale(1.25);
}
.sfx_options_dialog_table .sfx_options_dialog_option_disabled {
  opacity: .7;
}
#sfx_options_dialog_actions {
  float: right;
}
/* Dialog Panels */
.sfx_panel {
  padding: 5px;
}
.sfx_panel_title_bar {
  padding: 0 3px;
  color: #4267B2;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 5px;
}
.sfx_options_dialog_panel {
  padding: 5px;
}
.sfx_options_dialog_panel > div:last-child {
  margin-top: 10px;
}
.sfx_options_dialog_panel .sfx_options_dialog_panel {
  background-color: #e7e9ef;
  margin: 10px 0;
}
.sfx_options_dialog_panel .sfx_options_dialog_panel .sfx_panel_title_bar {
  font-size: 18px;
}
.sfx_options_dialog_panel .sfx_options_dialog_panel_button {
  float: right;
  margin: 5px;
}
/* Filter Styles */
.sfx_options_dialog_filter_list .sfx_options_dialog_filter {
  padding: 5px;
}
.sfx_options_dialog_filter_conditions,
.sfx_options_dialog_filter_actions {
  margin-top: 0;
}
.sfx_options_dialog_panel_header {
  font-weight: bold;
  margin: 30px 0 10px;
  color: #697688;
  font-size: 15px;
  background-color: #E9EBEE;
  padding: 10px;
}

.sfx_photo_tags:hover:after {
  content: attr(sfx_photo_tags) !important;
  color: white !important;
  font-size: 14px !important;
  font-weight: bold !important;
  text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000 !important;
}

.sfx_filter_hidden:not(.sfx_filter_hidden_show) > *:not(.sfx_filter_hidden_note) {
  display: none !important;
}
.sfx_filter_hidden.sfx_filter_hidden_show > *:not(.sfx_filter_hidden_note) {
  opacity: .5;
}
.sfx_filter_hidden.sfx_filter_hidden_show:hover > *:not(.sfx_filter_hidden_note) {
  opacity: 1;
}
.sfx_filter_hidden_note {
  padding: 0 5px;
  border: 1px dashed #333;
  font-size: 11px;
  opacity: .5;
  cursor: pointer;
  margin-top: 2px;
}
.sfx_filter_hidden_note:hover {
  opacity: 1;
}
/* "More Stories" Pager */
.sfx-pager-disabled {
  position: fixed !important;
  top: 20000px !important;
}

#sfx_control_panel .sfx_filter_tab {
  cursor: pointer;
  padding: 2px 10px 2px 5px;
  background-color: #F6F7F9;
}
#sfx_control_panel .sfx_filter_tab:hover {
  background-color: #5890FF;
}
#sfx_control_panel .sfx_filter_tab:hover .sfx_count {
  color: black;
}
#sfx_control_panel .sfx_filter_tab.selected {
  background-color: #4267B2;
  color: white;
}
#sfx_control_panel .sfx_filter_tab.selected .sfx_count {
  color: white;
}
#sfx_control_panel .sfx_count {
  font-style: italic;
  color: #999;
}
.sfx_filter_tab_hidden {
  display: none !important;
}

html.sfx_stealth_mode .UFILikeLink,
html.sfx_stealth_mode .FriendRequestAdd,
html.sfx_stealth_mode .addFriendText,
html.sfx_stealth_mode .UFIAddComment,
html.sfx_stealth_mode .UFIReplyLink,
html.sfx_stealth_mode .PageLikeButton,
html.sfx_stealth_mode .share_action_link,
html.sfx_stealth_mode .comment_link,
html.sfx_stealth_mode a[data-tooltip-content^="Like"] {
  display: none !important;
}

/* "Sticky" note */
.sfx_sticky_note {
  position: absolute;
  min-height: 14px;
  min-width: 150px;
  right: 100%;
  margin-right: 8px;
  top: 50%;
  font-family: arial;
  background-color: #FFFFE5;
  color: black;
  border: 1px solid #3F5C71;
  font-size: 12px;
  padding: 3px;
  text-align: center;
  border-radius: 6px;
  box-shadow: 0 0 5px #888888;
  z-index: 9999 !important;
}
.sfx_sticky_note_right {
  left: 100%;
  right: auto;
  margin-left: 8px;
  margin-right: auto;
}
.sfx_sticky_note_left {
  right: 100%;
  left: auto;
  margin-right: 8px;
  margin-left: auto;
}
.sfx_sticky_note_bottom {
  top: 200%;
  right: auto;
  left: -25%;
  margin-top: 8px;
  margin-right: 0;
  margin-left: -3px;
}
.sfx_sticky_note_top {
  top: -100%;
  right: auto;
  left: -25%;
  margin-bottom: 8px;
  margin-right: 0;
  margin-left: -3px;
}
.sfx_sticky_note_arrow_border {
  border-color: transparent transparent transparent #666666;
  border-style: solid;
  border-width: 7px;
  height: 0;
  width: 0;
  position: absolute;
  margin-top: -7px;
  top: 50%;
  right: -15px;
}
.sfx_sticky_note_right .sfx_sticky_note_arrow_border {
  border-color: transparent #666666 transparent transparent;
  top: 50%;
  right: auto;
  left: -15px;
}
.sfx_sticky_note_left .sfx_sticky_note_arrow_border {
  border-color: transparent transparent transparent #666666;
  top: 50%;
  right: -15px;
  left: auto;
}
.sfx_sticky_note_bottom .sfx_sticky_note_arrow_border {
  border-color: transparent transparent #666666 transparent;
  left: 50%;
  right: auto;
  top: -15px;
  margin-left: -7px;
  margin-top: 0;
}
.sfx_sticky_note_top .sfx_sticky_note_arrow_border {
  border-color: #666666 transparent transparent transparent;
  left: 50%;
  right: auto;
  top: auto;
  bottom: -15px;
  margin-left: -7px;
  margin-bottom: 0;
}
.sfx_sticky_note_arrow {
  border-color: transparent transparent transparent #ffa;
  border-style: solid;
  border-width: 7px;
  height: 0;
  width: 0;
  position: absolute;
  top: 50%;
  right: -13px;
  margin-top: -7px;
}
.sfx_sticky_note_right .sfx_sticky_note_arrow {
  border-color: transparent #ffa transparent transparent;
  top: 50%;
  right: auto;
  left: -13px;
}
.sfx_sticky_note_left .sfx_sticky_note_arrow {
  border-color: transparent transparent transparent #ffa;
  top: 50%;
  right: -13px;
  left: auto;
}
.sfx_sticky_note_bottom .sfx_sticky_note_arrow {
  border-color: transparent transparent #ffa transparent;
  left: 50%;
  right: auto;
  top: -13px;
  margin-left: -7px;
  margin-top: 0;
}
.sfx_sticky_note_top .sfx_sticky_note_arrow {
  border-color: #ffa transparent transparent transparent;
  left: 50%;
  right: auto;
  bottom: -13px;
  top: auto;
  margin-left: -7px;
  margin-bottom: 0;
}
.sfx_sticky_note_close {
  float: left;
  width: 9px;
  height: 9px;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  background-image: url("data:image/gif,GIF89a%07%00%07%00%91%00%00%00%00%00%FF%FF%FF%9C%9A%9C%FF%FF%FF!%F9%04%01%00%00%03%00%2C%00%00%00%00%07%00%07%00%00%02%0C%94%86%A6%B3j%C8%5Er%F1%B83%0B%00%3B");
  border: 1px solid transparent;
  float: right;
}
div.sfx_sticky_note_close:hover {
  background-image: url("data:image/gif,GIF89a%07%00%07%00%91%00%00%00%00%00%FF%FF%FF%FF%FF%FF%00%00%00!%F9%04%01%00%00%02%00%2C%00%00%00%00%07%00%07%00%00%02%0C%04%84%A6%B2j%C8%5Er%F1%B83%0B%00%3B");
  border: 1px solid black;
}

.sfx_hidden {
  display: none !important;
}
.sfx_clickable {
  cursor: pointer !important;
}
.sfx_link {
  text-decoration: underline !important;
  cursor: pointer !important;
}
.sfx_hover_link:hover {
  text-decoration: underline !important;
  cursor: pointer !important;
}
.sfx_info_icon {
  content: "i";
  position: absolute;
  display: block;
  left: 6px;
  top: 6px;
  width: 20px;
  height: 20px;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  font-style: italic;
  vertical-align: center;
  font-family: serif !important;
  font-weight: bold;
  background-color: #5890FF;
  color: white;
  padding: 0;
  border-radius: 20px;
}
.sfx_info {
  background-color: #FFFFE5;
  border: 1px solid #666;
  border-radius: 6px;
  padding: 7px;
  margin: 5px;
  font-family: arial;
  font-size: 12px;
  position: relative;
}
.sfx_info:not(.no_icon) {
  padding-left: 35px;
}
.sfx_info:not(.no_icon)::before {
  content: "i";
  position: absolute;
  display: block;
  left: 6px;
  top: 6px;
  width: 20px;
  height: 20px;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  font-style: italic;
  vertical-align: center;
  font-family: serif !important;
  font-weight: bold;
  background-color: #5890FF;
  color: white;
  padding: 0;
  border-radius: 20px;
}
.sfx_highlight {
  background-color: yellow;
  color: black;
}
.sfx_whats_this {
  color: #999;
  cursor: help;
  font-weight: normal !important;
}
.sfx_label_value {
  display: table;
  width: 95%;
  margin: 3px;
}
.sfx_label_value > * {
  display: table-cell;
}
.sfx_label_value input.sfx_wide {
  width: 100%;
}
.sfx_label_value > *:first-child {
  font-weight: bold;
  padding-right: 10px;
  width: 1px;
}
.sfx_label_value > .stretch {
  width: 100%;
}
*[data-title]:after {
  content: attr(data-title);
  font-size: 0;
  opacity: 0;
}
*[data-title]:hover:after {
  content: attr(data-title);
  position: absolute;
  margin-left: 7px;
  margin-top: 3px;
  font-size: 12px;
  background-color: #666;
  color: white;
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;
  z-index: 9999;
  opacity: .9;
  transition: font-size 0s 0s ease, opacity 0.3s 0.5s;
}
/* A "Help" icon with tooltip */
.sfx-help-icon:after {
  display: inline-block;
  height: 14px;
  width: 14px;
  vertical-align: middle;
  background-color: #7187B5;
  color: white;
  border-radius: 50%;
  content: "?";
  cursor: help;
  text-align: center;
  line-height: 12px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: normal;
}
/* FLEXBOX */
.flex-row,
.flex-column {
  display: flex;
}
.flex-row > *,
.flex-column > * {
  flex: auto;
  align-self: auto;
  overflow: auto;
}
.flex-row,
.flex-column {
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;
}
.flex-row {
  flex-direction: row;
}
.flex-column {
  flex-direction: column;
}
.flex-row-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
}
.flex-row-container > * {
  margin-right: 5px;
}
.flex-row-container > *:not(.stretch) {
  flex-shrink: 0 ;
}
.flex-row-container > .stretch {
  flex-grow: 1;
}
.flex-row-container > .stretch > .stretch {
  width: 100%;
}

/* Support Group Styles */
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper {
  margin-top: 7px !important;
  padding: 5px !important;
  border: 2px solid #3D5B99 !important;
  border-radius: 10px !important;
  background-color: #D8DFEA !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .userContent,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .userContent,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent {
  color: #333 !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .userContent a,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .userContent a,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent a,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent a,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .userContent .actorName a,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .userContent .actorName a,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent .actorName a,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent .actorName a {
  color: #3b5998 !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .uiStreamStory,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .uiStreamStory,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .uiStreamStory,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .uiStreamStory {
  text-align: left !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent div.actorName,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent div.actorName,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper div.actorName,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper div.actorName,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent h5.uiStreamMessage,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent h5.uiStreamMessage,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper h5.uiStreamMessage,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper h5.uiStreamMessage,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .messageBody div,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .messageBody div,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .messageBody div,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .messageBody div {
  display: inline;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .mainWrapper,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .mainWrapper,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .mainWrapper,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .mainWrapper {
  padding-top: 5px;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .actorPhoto,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .actorPhoto,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .actorPhoto,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .actorPhoto {
  margin-top: 6px;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .UFIBlingBox,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .UFIBlingBox,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .UFIBlingBox,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .UFIBlingBox {
  border-bottom: lightblue !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .UIActionLinks,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .UIActionLinks,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .UIActionLinks,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .UIActionLinks,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .uiStreamFooter ~ div,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .uiStreamFooter ~ div,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .uiStreamFooter ~ div,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .uiStreamFooter ~ div,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent form,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent form,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper form,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper form {
  display: none !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .text_exposed_show,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .text_exposed_show,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .text_exposed_show,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .text_exposed_show {
  display: block !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent .text_exposed_hide,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent .text_exposed_hide,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .text_exposed_hide,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .text_exposed_hide {
  display: none !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent:before,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent:before,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper:before,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper:before {
  content: "Please read the notes below before posting!";
  text-align: center;
  font-size: 18px !important;
  font-weight: bold !important;
  color: red !important;
  display: inline-block !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .fbUserContent:hover,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .fbUserContent:hover,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper:hover,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper:hover {
  height: auto;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea .UFIReplyLink,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea .UFIReplyLink {
  display: none;
}
/* Hide Reply links in other places */
html[sfx_url^="/groups/SFxOffTopic"] .UFIReplyLink {
  display: none;
}

.sfx_unread_filtered_message {
  padding: 3px 0;
  color: #2c4166;
  font-weight: bold;
}
.sfx_unread_filtered_message .count {
  display: inline-block;
  font-weight: normal !important;
  background-color: #2c4166 !important;
  color: white !important;
  border: 1px solid #aaa;
  padding: 0px 3px;
  border-radius: 4px;
}
.sfx_unread_filtered_message a {
  text-decoration: underline !important;
}

.sfx_watch {
  display: inline-block;
  width: 12px;
  height: 12px;
  opacity: .3;
  background: transparent url("data:image/gif;base64,R0lGODlhDAAMAMQAAG9vb%2Fr6%2BllZWfn5%2BUdHR1JSUvv7%2BzExMTY2NjMzM39%2Ff%2B%2Fv78DAwP7%2B%2FqOjoxkZGVRUVAAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAMAAwAAAVNoCQ2DvQ8kNOIUqNEcKyskhMJixQwSeSIkMgiFmFEIKIHjCWBPZKRQDMiijwlheJUMkQOEJEDw8AV%2BAZBoqyRjhBMKNU0AmAyYXU7KwQAOw%3D%3D") no-repeat;
}
.sfx_watch:hover {
  opacity: 1;
}


.mark_read_filter {
    background: url('data:image/gif;base64,R0lGODlhEAAQAIABALG1u////yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpENjNFRjc1MDgxOUQxMUU2QkNGRUVGQTY0MjZCNTFGMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpENjNFRjc1MTgxOUQxMUU2QkNGRUVGQTY0MjZCNTFGMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2M0VGNzRFODE5RDExRTZCQ0ZFRUZBNjQyNkI1MUYxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQ2M0VGNzRGODE5RDExRTZCQ0ZFRUZBNjQyNkI1MUYxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAABAAEAAAAiCMjxnA7Q+jW/Kd2hJWFHLjfWAmjkxpAminopNLlu/6FQA7');
}

.mark_read_wrench {
    background: url('data:image/gif;base64,R0lGODlhEAAQANUyALq9wra5v/39/bO3vd7f4rS4vvn5+vf3+O7v8P7+/rW4vvz8/bW5v7W5vujp69/h5Nze4fz8/O/w8ezt7/Lz9M3Q1Ly/xbO2vOHj5cDDyPX19srN0e7u8L7BxszP0rS4vbq+w/Hx8re7wLK2vObn6dvd4NPV2MLFycXIzMnM0Pb298vN0bu/xPj4+fn5+dja3cbJzrG1u////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNTEzNTkwRDgwMDExMUU2QjEwM0Y3OUQ5MTZEMkVGNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNTEzNTkwRTgwMDExMUU2QjEwM0Y3OUQ5MTZEMkVGNiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA1MTM1OTBCODAwMTExRTZCMTAzRjc5RDkxNkQyRUY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA1MTM1OTBDODAwMTExRTZCMTAzRjc5RDkxNkQyRUY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAMgAsAAAAABAAEAAABnJAmXAoRDyIyKFmEzMlkSRFLGB4DhGDWKxETECQFa1iQSQEkCetSDA8MGJIlja2YstSsQISMI91XjBaAEQLF32HKEQYh4cEQxQBjHMZdip8cwMgWSMeVTItFnMfBBFCLglEB5cNE1ZDIQUBHK5EDhK0QkEAOw==');
}

.social_fixer_watch {
    background: url('data:image/gif;base64,R0lGODlhDAAMAMQAAG9vb/r6+llZWfn5+UdHR1JSUvv7+zExMTY2NjMzM39/f+/v78DAwP7+/qOjoxkZGVRUVAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAMAAwAAAVNoCQ2DvQ8kNOIUqNEcKyskhMJixQwSeSIkMgiFmFEIKIHjCWBPZKRQDMiijwlheJUMkQOEJEDw8AV+AZBoqyRjhBMKNU0AmAyYXU7KwQAOw==');
}
`);
},0);

try {
// Libraries
// ===========
var XLib = function( args ) {
	args = args || {};

	// LOCAL CHANGE to prevent errors in Chrome:
	// -  !t.isImmediatePropagationStopped()
	// +  (!t.isImmediatePropagationStopped || !t.isImmediatePropagationStopped())
	// http://github.e-sites.nl/zeptobuilder/
	/*! Zepto 1.2.0 (generated with Zepto Builder) - zepto event - zeptojs.com/license */
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	/* eslint-disable */
	var Zepto = (function() {
		var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
			document = window.document,
			elementDisplay = {}, classCache = {},
			cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
			fragmentRE = /^\s*<(\w+|!)[^>]*>/,
			singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
			tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
			rootNodeRE = /^(?:body|html)$/i,
			capitalRE = /([A-Z])/g,

			// special attributes that should be get/set via method calls
			methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

			adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
			table = document.createElement('table'),
			tableRow = document.createElement('tr'),
			containers = {
				'tr': document.createElement('tbody'),
				'tbody': table, 'thead': table, 'tfoot': table,
				'td': tableRow, 'th': tableRow,
				'*': document.createElement('div')
			},
			readyRE = /complete|loaded|interactive/,
			simpleSelectorRE = /^[\w-]*$/,
			class2type = {},
			toString = class2type.toString,
			zepto = {},
			camelize, uniq,
			tempParent = document.createElement('div'),
			propMap = {
				'tabindex': 'tabIndex',
				'readonly': 'readOnly',
				'for': 'htmlFor',
				'class': 'className',
				'maxlength': 'maxLength',
				'cellspacing': 'cellSpacing',
				'cellpadding': 'cellPadding',
				'rowspan': 'rowSpan',
				'colspan': 'colSpan',
				'usemap': 'useMap',
				'frameborder': 'frameBorder',
				'contenteditable': 'contentEditable'
			},
			isArray = Array.isArray ||
				function(object){ return object instanceof Array }

		zepto.matches = function(element, selector) {
			if (!selector || !element || element.nodeType !== 1) return false
			var matchesSelector = element.matches || element.webkitMatchesSelector ||
				element.mozMatchesSelector || element.oMatchesSelector ||
				element.matchesSelector
			if (matchesSelector) return matchesSelector.call(element, selector)
			// fall back to performing a selector:
			var match, parent = element.parentNode, temp = !parent
			if (temp) (parent = tempParent).appendChild(element)
			match = ~zepto.qsa(parent, selector).indexOf(element)
			temp && tempParent.removeChild(element)
			return match
		}

		function type(obj) {
			return obj == null ? String(obj) :
			class2type[toString.call(obj)] || "object"
		}

		function isFunction(value) { return type(value) == "function" }
		function isWindow(obj)     { return obj != null && obj == obj.window }
		function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
		function isObject(obj)     { return type(obj) == "object" }
		function isPlainObject(obj) {
			return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
		}

		function likeArray(obj) {
			var length = !!obj && 'length' in obj && obj.length,
				type = $.type(obj)

			return 'function' != type && !isWindow(obj) && (
					'array' == type || length === 0 ||
					(typeof length == 'number' && length > 0 && (length - 1) in obj)
				)
		}

		function compact(array) { return filter.call(array, function(item){ return item != null }) }
		function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
		camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
		function dasherize(str) {
			return str.replace(/::/g, '/')
				.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
				.replace(/([a-z\d])([A-Z])/g, '$1_$2')
				.replace(/_/g, '-')
				.toLowerCase()
		}
		uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

		function classRE(name) {
			return name in classCache ?
				classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
		}

		function maybeAddPx(name, value) {
			return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
		}

		function defaultDisplay(nodeName) {
			var element, display
			if (!elementDisplay[nodeName]) {
				element = document.createElement(nodeName)
				document.body.appendChild(element)
				display = getComputedStyle(element, '').getPropertyValue("display")
				element.parentNode.removeChild(element)
				display == "none" && (display = "block")
				elementDisplay[nodeName] = display
			}
			return elementDisplay[nodeName]
		}

		function children(element) {
			return 'children' in element ?
				slice.call(element.children) :
				$.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
		}

		function Z(dom, selector) {
			var i, len = dom ? dom.length : 0
			for (i = 0; i < len; i++) this[i] = dom[i]
			this.length = len
			this.selector = selector || ''
		}

		// `$.zepto.fragment` takes a html string and an optional tag name
		// to generate DOM nodes from the given html string.
		// The generated DOM nodes are returned as an array.
		// This function can be overridden in plugins for example to make
		// it compatible with browsers that don't support the DOM fully.
		zepto.fragment = function(html, name, properties) {
			var dom, nodes, container

			// A special case optimization for a single tag
			if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

			if (!dom) {
				if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
				if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
				if (!(name in containers)) name = '*'

				container = containers[name]
				container.innerHTML = '' + html
				dom = $.each(slice.call(container.childNodes), function(){
					container.removeChild(this)
				})
			}

			if (isPlainObject(properties)) {
				nodes = $(dom)
				$.each(properties, function(key, value) {
					if (methodAttributes.indexOf(key) > -1) nodes[key](value)
					else nodes.attr(key, value)
				})
			}

			return dom
		}

		// `$.zepto.Z` swaps out the prototype of the given `dom` array
		// of nodes with `$.fn` and thus supplying all the Zepto functions
		// to the array. This method can be overridden in plugins.
		zepto.Z = function(dom, selector) {
			return new Z(dom, selector)
		}

		// `$.zepto.isZ` should return `true` if the given object is a Zepto
		// collection. This method can be overridden in plugins.
		zepto.isZ = function(object) {
			return object instanceof zepto.Z
		}

		// `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
		// takes a CSS selector and an optional context (and handles various
		// special cases).
		// This method can be overridden in plugins.
		zepto.init = function(selector, context) {
			var dom
			// If nothing given, return an empty Zepto collection
			if (!selector) return zepto.Z()
			// Optimize for string selectors
			else if (typeof selector == 'string') {
				selector = selector.trim()
				// If it's a html fragment, create nodes from it
				// Note: In both Chrome 21 and Firefox 15, DOM error 12
				// is thrown if the fragment doesn't begin with <
				if (selector[0] == '<' && fragmentRE.test(selector))
					dom = zepto.fragment(selector, RegExp.$1, context), selector = null
				// If there's a context, create a collection on that context first, and select
				// nodes from there
				else if (context !== undefined) return $(context).find(selector)
				// If it's a CSS selector, use it to select nodes.
				else dom = zepto.qsa(document, selector)
			}
			// If a function is given, call it when the DOM is ready
			else if (isFunction(selector)) return $(document).ready(selector)
			// If a Zepto collection is given, just return it
			else if (zepto.isZ(selector)) return selector
			else {
				// normalize array if an array of nodes is given
				if (isArray(selector)) dom = compact(selector)
				// Wrap DOM nodes.
				else if (isObject(selector))
					dom = [selector], selector = null
				// If it's a html fragment, create nodes from it
				else if (fragmentRE.test(selector))
					dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
				// If there's a context, create a collection on that context first, and select
				// nodes from there
				else if (context !== undefined) return $(context).find(selector)
				// And last but no least, if it's a CSS selector, use it to select nodes.
				else dom = zepto.qsa(document, selector)
			}
			// create a new Zepto collection from the nodes found
			return zepto.Z(dom, selector)
		}

		// `$` will be the base `Zepto` object. When calling this
		// function just call `$.zepto.init, which makes the implementation
		// details of selecting nodes and creating Zepto collections
		// patchable in plugins.
		$ = function(selector, context){
			return zepto.init(selector, context)
		}

		function extend(target, source, deep) {
			for (key in source)
				if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
					if (isPlainObject(source[key]) && !isPlainObject(target[key]))
						target[key] = {}
					if (isArray(source[key]) && !isArray(target[key]))
						target[key] = []
					extend(target[key], source[key], deep)
				}
				else if (source[key] !== undefined) target[key] = source[key]
		}

		// Copy all but undefined properties from one or more
		// objects to the `target` object.
		$.extend = function(target){
			var deep, args = slice.call(arguments, 1)
			if (typeof target == 'boolean') {
				deep = target
				target = args.shift()
			}
			args.forEach(function(arg){ extend(target, arg, deep) })
			return target
		}

		// `$.zepto.qsa` is Zepto's CSS selector implementation which
		// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
		// This method can be overridden in plugins.
		zepto.qsa = function(element, selector){
			var found,
				maybeID = selector[0] == '#',
				maybeClass = !maybeID && selector[0] == '.',
				nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
				isSimple = simpleSelectorRE.test(nameOnly)
			return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
				( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
				(element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
					slice.call(
						isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
							maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
								element.getElementsByTagName(selector) : // Or a tag
							element.querySelectorAll(selector) // Or it's not simple, and we need to query all
					)
		}

		function filtered(nodes, selector) {
			return selector == null ? $(nodes) : $(nodes).filter(selector)
		}

		$.contains = document.documentElement.contains ?
			function(parent, node) {
				return parent !== node && parent.contains(node)
			} :
			function(parent, node) {
				while (node && (node = node.parentNode))
					if (node === parent) return true
				return false
			}

		function funcArg(context, arg, idx, payload) {
			return isFunction(arg) ? arg.call(context, idx, payload) : arg
		}

		function setAttribute(node, name, value) {
			value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
		}

		// access className property while respecting SVGAnimatedString
		function className(node, value){
			var klass = node.className || '',
				svg   = klass && klass.baseVal !== undefined

			if (value === undefined) return svg ? klass.baseVal : klass
			svg ? (klass.baseVal = value) : (node.className = value)
		}

		// "true"  => true
		// "false" => false
		// "null"  => null
		// "42"    => 42
		// "42.5"  => 42.5
		// "08"    => "08"
		// JSON    => parse if valid
		// String  => self
		function deserializeValue(value) {
			try {
				return value ?
				value == "true" ||
				( value == "false" ? false :
					value == "null" ? null :
						+value + "" == value ? +value :
							/^[\[\{]/.test(value) ? $.parseJSON(value) :
								value )
					: value
			} catch(e) {
				return value
			}
		}

		$.type = type
		$.isFunction = isFunction
		$.isWindow = isWindow
		$.isArray = isArray
		$.isPlainObject = isPlainObject

		$.isEmptyObject = function(obj) {
			var name
			for (name in obj) return false
			return true
		}

		$.isNumeric = function(val) {
			var num = Number(val), type = typeof val
			return val != null && type != 'boolean' &&
				(type != 'string' || val.length) &&
				!isNaN(num) && isFinite(num) || false
		}

		$.inArray = function(elem, array, i){
			return emptyArray.indexOf.call(array, elem, i)
		}

		$.camelCase = camelize
		$.trim = function(str) {
			return str == null ? "" : String.prototype.trim.call(str)
		}

		// plugin compatibility
		$.uuid = 0
		$.support = { }
		$.expr = { }
		$.noop = function() {}

		$.map = function(elements, callback){
			var value, values = [], i, key
			if (likeArray(elements))
				for (i = 0; i < elements.length; i++) {
					value = callback(elements[i], i)
					if (value != null) values.push(value)
				}
			else
				for (key in elements) {
					value = callback(elements[key], key)
					if (value != null) values.push(value)
				}
			return flatten(values)
		}

		$.each = function(elements, callback){
			var i, key
			if (likeArray(elements)) {
				for (i = 0; i < elements.length; i++)
					if (callback.call(elements[i], i, elements[i]) === false) return elements
			} else {
				for (key in elements)
					if (callback.call(elements[key], key, elements[key]) === false) return elements
			}

			return elements
		}

		$.grep = function(elements, callback){
			return filter.call(elements, callback)
		}

		if (window.JSON) $.parseJSON = JSON.parse

		// Populate the class2type map
		$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
			class2type[ "[object " + name + "]" ] = name.toLowerCase()
		})

		// Define methods that will be available on all
		// Zepto collections
		$.fn = {
			constructor: zepto.Z,
			length: 0,

			// Because a collection acts like an array
			// copy over these useful array functions.
			forEach: emptyArray.forEach,
			reduce: emptyArray.reduce,
			push: emptyArray.push,
			sort: emptyArray.sort,
			splice: emptyArray.splice,
			indexOf: emptyArray.indexOf,
			concat: function(){
				var i, value, args = []
				for (i = 0; i < arguments.length; i++) {
					value = arguments[i]
					args[i] = zepto.isZ(value) ? value.toArray() : value
				}
				return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
			},

			// `map` and `slice` in the jQuery API work differently
			// from their array counterparts
			map: function(fn){
				return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
			},
			slice: function(){
				return $(slice.apply(this, arguments))
			},

			ready: function(callback){
				// need to check if document.body exists for IE as that browser reports
				// document ready when it hasn't yet created the body element
				if (readyRE.test(document.readyState) && document.body) callback($)
				else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
				return this
			},
			get: function(idx){
				return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
			},
			toArray: function(){ return this.get() },
			size: function(){
				return this.length
			},
			remove: function(){
				return this.each(function(){
					if (this.parentNode != null)
						this.parentNode.removeChild(this)
				})
			},
			each: function(callback){
				emptyArray.every.call(this, function(el, idx){
					return callback.call(el, idx, el) !== false
				})
				return this
			},
			filter: function(selector){
				if (isFunction(selector)) return this.not(this.not(selector))
				return $(filter.call(this, function(element){
					return zepto.matches(element, selector)
				}))
			},
			add: function(selector,context){
				return $(uniq(this.concat($(selector,context))))
			},
			is: function(selector){
				return this.length > 0 && zepto.matches(this[0], selector)
			},
			not: function(selector){
				var nodes=[]
				if (isFunction(selector) && selector.call !== undefined)
					this.each(function(idx){
						if (!selector.call(this,idx)) nodes.push(this)
					})
				else {
					var excludes = typeof selector == 'string' ? this.filter(selector) :
						(likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
					this.forEach(function(el){
						if (excludes.indexOf(el) < 0) nodes.push(el)
					})
				}
				return $(nodes)
			},
			has: function(selector){
				return this.filter(function(){
					return isObject(selector) ?
						$.contains(this, selector) :
						$(this).find(selector).size()
				})
			},
			eq: function(idx){
				return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
			},
			first: function(){
				var el = this[0]
				return el && !isObject(el) ? el : $(el)
			},
			last: function(){
				var el = this[this.length - 1]
				return el && !isObject(el) ? el : $(el)
			},
			find: function(selector){
				var result, $this = this
				if (!selector) result = $()
				else if (typeof selector == 'object')
					result = $(selector).filter(function(){
						var node = this
						return emptyArray.some.call($this, function(parent){
							return $.contains(parent, node)
						})
					})
				else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
				else result = this.map(function(){ return zepto.qsa(this, selector) })
				return result
			},
			closest: function(selector, context){
				var nodes = [], collection = typeof selector == 'object' && $(selector)
				this.each(function(_, node){
					while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
						node = node !== context && !isDocument(node) && node.parentNode
					if (node && nodes.indexOf(node) < 0) nodes.push(node)
				})
				return $(nodes)
			},
			parents: function(selector){
				var ancestors = [], nodes = this
				while (nodes.length > 0)
					nodes = $.map(nodes, function(node){
						if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
							ancestors.push(node)
							return node
						}
					})
				return filtered(ancestors, selector)
			},
			parent: function(selector){
				return filtered(uniq(this.pluck('parentNode')), selector)
			},
			children: function(selector){
				return filtered(this.map(function(){ return children(this) }), selector)
			},
			contents: function() {
				return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
			},
			siblings: function(selector){
				return filtered(this.map(function(i, el){
					return filter.call(children(el.parentNode), function(child){ return child!==el })
				}), selector)
			},
			empty: function(){
				return this.each(function(){ this.innerHTML = '' })
			},
			// `pluck` is borrowed from Prototype.js
			pluck: function(property){
				return $.map(this, function(el){ return el[property] })
			},
			show: function(){
				return this.each(function(){
					this.style.display == "none" && (this.style.display = '')
					if (getComputedStyle(this, '').getPropertyValue("display") == "none")
						this.style.display = defaultDisplay(this.nodeName)
				})
			},
			replaceWith: function(newContent){
				return this.before(newContent).remove()
			},
			wrap: function(structure){
				var func = isFunction(structure)
				if (this[0] && !func)
					var dom   = $(structure).get(0),
						clone = dom.parentNode || this.length > 1

				return this.each(function(index){
					$(this).wrapAll(
						func ? structure.call(this, index) :
							clone ? dom.cloneNode(true) : dom
					)
				})
			},
			wrapAll: function(structure){
				if (this[0]) {
					$(this[0]).before(structure = $(structure))
					var children
					// drill down to the inmost element
					while ((children = structure.children()).length) structure = children.first()
					$(structure).append(this)
				}
				return this
			},
			wrapInner: function(structure){
				var func = isFunction(structure)
				return this.each(function(index){
					var self = $(this), contents = self.contents(),
						dom  = func ? structure.call(this, index) : structure
					contents.length ? contents.wrapAll(dom) : self.append(dom)
				})
			},
			unwrap: function(){
				this.parent().each(function(){
					$(this).replaceWith($(this).children())
				})
				return this
			},
			clone: function(){
				return this.map(function(){ return this.cloneNode(true) })
			},
			hide: function(){
				return this.css("display", "none")
			},
			toggle: function(setting){
				return this.each(function(){
					var el = $(this)
						;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
				})
			},
			prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
			next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
			html: function(html){
				return 0 in arguments ?
					this.each(function(idx){
						var originHtml = this.innerHTML
						$(this).empty().append( funcArg(this, html, idx, originHtml) )
					}) :
					(0 in this ? this[0].innerHTML : null)
			},
			text: function(text){
				return 0 in arguments ?
					this.each(function(idx){
						var newText = funcArg(this, text, idx, this.textContent)
						this.textContent = newText == null ? '' : ''+newText
					}) :
					(0 in this ? this.pluck('textContent').join("") : null)
			},
			attr: function(name, value){
				var result
				return (typeof name == 'string' && !(1 in arguments)) ?
					(0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
					this.each(function(idx){
						if (this.nodeType !== 1) return
						if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
						else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
					})
			},
			removeAttr: function(name){
				return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
					setAttribute(this, attribute)
				}, this)})
			},
			prop: function(name, value){
				name = propMap[name] || name
				return (1 in arguments) ?
					this.each(function(idx){
						this[name] = funcArg(this, value, idx, this[name])
					}) :
					(this[0] && this[0][name])
			},
			removeProp: function(name){
				name = propMap[name] || name
				return this.each(function(){ delete this[name] })
			},
			data: function(name, value){
				var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

				var data = (1 in arguments) ?
					this.attr(attrName, value) :
					this.attr(attrName)

				return data !== null ? deserializeValue(data) : undefined
			},
			val: function(value){
				if (0 in arguments) {
					if (value == null) value = ""
					return this.each(function(idx){
						this.value = funcArg(this, value, idx, this.value)
					})
				} else {
					return this[0] && (this[0].multiple ?
							$(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
							this[0].value)
				}
			},
			offset: function(coordinates){
				if (coordinates) return this.each(function(index){
					var $this = $(this),
						coords = funcArg(this, coordinates, index, $this.offset()),
						parentOffset = $this.offsetParent().offset(),
						props = {
							top:  coords.top  - parentOffset.top,
							left: coords.left - parentOffset.left
						}

					if ($this.css('position') == 'static') props['position'] = 'relative'
					$this.css(props)
				})
				if (!this.length) return null
				if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
					return {top: 0, left: 0}
				var obj = this[0].getBoundingClientRect()
				return {
					left: obj.left + window.pageXOffset,
					top: obj.top + window.pageYOffset,
					width: Math.round(obj.width),
					height: Math.round(obj.height)
				}
			},
			css: function(property, value){
				if (arguments.length < 2) {
					var element = this[0]
					if (typeof property == 'string') {
						if (!element) return
						return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
					} else if (isArray(property)) {
						if (!element) return
						var props = {}
						var computedStyle = getComputedStyle(element, '')
						$.each(property, function(_, prop){
							props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
						})
						return props
					}
				}

				var css = ''
				if (type(property) == 'string') {
					if (!value && value !== 0)
						this.each(function(){ this.style.removeProperty(dasherize(property)) })
					else
						css = dasherize(property) + ":" + maybeAddPx(property, value)
				} else {
					for (key in property)
						if (!property[key] && property[key] !== 0)
							this.each(function(){ this.style.removeProperty(dasherize(key)) })
						else
							css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
				}

				return this.each(function(){ this.style.cssText += ';' + css })
			},
			index: function(element){
				return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
			},
			hasClass: function(name){
				if (!name) return false
				return emptyArray.some.call(this, function(el){
					return this.test(className(el))
				}, classRE(name))
			},
			addClass: function(name){
				if (!name) return this
				return this.each(function(idx){
					if (!('className' in this)) return
					classList = []
					var cls = className(this), newName = funcArg(this, name, idx, cls)
					newName.split(/\s+/g).forEach(function(klass){
						if (!$(this).hasClass(klass)) classList.push(klass)
					}, this)
					classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
				})
			},
			removeClass: function(name){
				return this.each(function(idx){
					if (!('className' in this)) return
					if (name === undefined) return className(this, '')
					classList = className(this)
					funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
						classList = classList.replace(classRE(klass), " ")
					})
					className(this, classList.trim())
				})
			},
			toggleClass: function(name, when){
				if (!name) return this
				return this.each(function(idx){
					var $this = $(this), names = funcArg(this, name, idx, className(this))
					names.split(/\s+/g).forEach(function(klass){
						(when === undefined ? !$this.hasClass(klass) : when) ?
							$this.addClass(klass) : $this.removeClass(klass)
					})
				})
			},
			scrollTop: function(value){
				if (!this.length) return
				var hasScrollTop = 'scrollTop' in this[0]
				if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
				return this.each(hasScrollTop ?
					function(){ this.scrollTop = value } :
					function(){ this.scrollTo(this.scrollX, value) })
			},
			scrollLeft: function(value){
				if (!this.length) return
				var hasScrollLeft = 'scrollLeft' in this[0]
				if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
				return this.each(hasScrollLeft ?
					function(){ this.scrollLeft = value } :
					function(){ this.scrollTo(value, this.scrollY) })
			},
			position: function() {
				if (!this.length) return

				var elem = this[0],
					// Get *real* offsetParent
					offsetParent = this.offsetParent(),
					// Get correct offsets
					offset       = this.offset(),
					parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

				// Subtract element margins
				// note: when an element has margin: auto the offsetLeft and marginLeft
				// are the same in Safari causing offset.left to incorrectly be 0
				offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
				offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

				// Add offsetParent borders
				parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
				parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

				// Subtract the two offsets
				return {
					top:  offset.top  - parentOffset.top,
					left: offset.left - parentOffset.left
				}
			},
			offsetParent: function() {
				return this.map(function(){
					var parent = this.offsetParent || document.body
					while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
						parent = parent.offsetParent
					return parent
				})
			}
		}

		// for now
		$.fn.detach = $.fn.remove

		// Generate the `width` and `height` functions
		;['width', 'height'].forEach(function(dimension){
			var dimensionProperty =
				dimension.replace(/./, function(m){ return m[0].toUpperCase() })

			$.fn[dimension] = function(value){
				var offset, el = this[0]
				if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
					isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
					(offset = this.offset()) && offset[dimension]
				else return this.each(function(idx){
					el = $(this)
					el.css(dimension, funcArg(this, value, idx, el[dimension]()))
				})
			}
		})

		function traverseNode(node, fun) {
			fun(node)
			for (var i = 0, len = node.childNodes.length; i < len; i++)
				traverseNode(node.childNodes[i], fun)
		}

		// Generate the `after`, `prepend`, `before`, `append`,
		// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
		adjacencyOperators.forEach(function(operator, operatorIndex) {
			var inside = operatorIndex % 2 //=> prepend, append

			$.fn[operator] = function(){
				// arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
				var argType, nodes = $.map(arguments, function(arg) {
						var arr = []
						argType = type(arg)
						if (argType == "array") {
							arg.forEach(function(el) {
								if (el.nodeType !== undefined) return arr.push(el)
								else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
								arr = arr.concat(zepto.fragment(el))
							})
							return arr
						}
						return argType == "object" || arg == null ?
							arg : zepto.fragment(arg)
					}),
					parent, copyByClone = this.length > 1
				if (nodes.length < 1) return this

				return this.each(function(_, target){
					parent = inside ? target : target.parentNode

					// convert all methods to a "before" operation
					target = operatorIndex == 0 ? target.nextSibling :
						operatorIndex == 1 ? target.firstChild :
							operatorIndex == 2 ? target :
								null

					var parentInDocument = $.contains(document.documentElement, parent)

					nodes.forEach(function(node){
						if (copyByClone) node = node.cloneNode(true)
						else if (!parent) return $(node).remove()

						parent.insertBefore(node, target)
						if (parentInDocument) traverseNode(node, function(el){
							if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
								(!el.type || el.type === 'text/javascript') && !el.src){
								var target = el.ownerDocument ? el.ownerDocument.defaultView : window
								target['eval'].call(target, el.innerHTML)
							}
						})
					})
				})
			}

			// after    => insertAfter
			// prepend  => prependTo
			// before   => insertBefore
			// append   => appendTo
			$.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
				$(html)[operator](this)
				return this
			}
		})

		zepto.Z.prototype = Z.prototype = $.fn

		// Export internal API functions in the `$.zepto` namespace
		zepto.uniq = uniq
		zepto.deserializeValue = deserializeValue
		$.zepto = zepto

		return $
	})()

	// If `$` is not yet defined, point it to `Zepto`
	window.Zepto = Zepto
	window.$ === undefined && (window.$ = Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function($){
		var _zid = 1, undefined,
			slice = Array.prototype.slice,
			isFunction = $.isFunction,
			isString = function(obj){ return typeof obj == 'string' },
			handlers = {},
			specialEvents={},
			focusinSupported = 'onfocusin' in window,
			focus = { focus: 'focusin', blur: 'focusout' },
			hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

		specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

		function zid(element) {
			return element._zid || (element._zid = _zid++)
		}
		function findHandlers(element, event, fn, selector) {
			event = parse(event)
			if (event.ns) var matcher = matcherFor(event.ns)
			return (handlers[zid(element)] || []).filter(function(handler) {
				return handler
					&& (!event.e  || handler.e == event.e)
					&& (!event.ns || matcher.test(handler.ns))
					&& (!fn       || zid(handler.fn) === zid(fn))
					&& (!selector || handler.sel == selector)
			})
		}
		function parse(event) {
			var parts = ('' + event).split('.')
			return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
		}
		function matcherFor(ns) {
			return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
		}

		function eventCapture(handler, captureSetting) {
			return handler.del &&
				(!focusinSupported && (handler.e in focus)) ||
				!!captureSetting
		}

		function realEvent(type) {
			return hover[type] || (focusinSupported && focus[type]) || type
		}

		function add(element, events, fn, data, selector, delegator, capture){
			var id = zid(element), set = (handlers[id] || (handlers[id] = []))
			events.split(/\s/).forEach(function(event){
				if (event == 'ready') return $(document).ready(fn)
				var handler   = parse(event)
				handler.fn    = fn
				handler.sel   = selector
				// emulate mouseenter, mouseleave
				if (handler.e in hover) fn = function(e){
					var related = e.relatedTarget
					if (!related || (related !== this && !$.contains(this, related)))
						return handler.fn.apply(this, arguments)
				}
				handler.del   = delegator
				var callback  = delegator || fn
				handler.proxy = function(e){
					e = compatible(e)
					if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) return
					e.data = data
					var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
					if (result === false) e.preventDefault(), e.stopPropagation()
					return result
				}
				handler.i = set.length
				set.push(handler)
				if ('addEventListener' in element)
					element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
			})
		}
		function remove(element, events, fn, selector, capture){
			var id = zid(element)
				;(events || '').split(/\s/).forEach(function(event){
				findHandlers(element, event, fn, selector).forEach(function(handler){
					delete handlers[id][handler.i]
					if ('removeEventListener' in element)
						element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
				})
			})
		}

		$.event = { add: add, remove: remove }

		$.proxy = function(fn, context) {
			var args = (2 in arguments) && slice.call(arguments, 2)
			if (isFunction(fn)) {
				var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
				proxyFn._zid = zid(fn)
				return proxyFn
			} else if (isString(context)) {
				if (args) {
					args.unshift(fn[context], fn)
					return $.proxy.apply(null, args)
				} else {
					return $.proxy(fn[context], fn)
				}
			} else {
				throw new TypeError("expected function")
			}
		}

		$.fn.bind = function(event, data, callback){
			return this.on(event, data, callback)
		}
		$.fn.unbind = function(event, callback){
			return this.off(event, callback)
		}
		$.fn.one = function(event, selector, data, callback){
			return this.on(event, selector, data, callback, 1)
		}

		var returnTrue = function(){return true},
			returnFalse = function(){return false},
			ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
			eventMethods = {
				preventDefault: 'isDefaultPrevented',
				stopImmediatePropagation: 'isImmediatePropagationStopped',
				stopPropagation: 'isPropagationStopped'
			}

		function compatible(event, source) {
			if (source || !event.isDefaultPrevented) {
				source || (source = event)

				$.each(eventMethods, function(name, predicate) {
					var sourceMethod = source[name]
					event[name] = function(){
						this[predicate] = returnTrue
						return sourceMethod && sourceMethod.apply(source, arguments)
					}
					event[predicate] = returnFalse
				})

				event.timeStamp || (event.timeStamp = Date.now())

				if (source.defaultPrevented !== undefined ? source.defaultPrevented :
						'returnValue' in source ? source.returnValue === false :
						source.getPreventDefault && source.getPreventDefault())
					event.isDefaultPrevented = returnTrue
			}
			return event
		}

		function createProxy(event) {
			var key, proxy = { originalEvent: event }
			for (key in event)
				if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

			return compatible(proxy, event)
		}

		$.fn.delegate = function(selector, event, callback){
			return this.on(event, selector, callback)
		}
		$.fn.undelegate = function(selector, event, callback){
			return this.off(event, selector, callback)
		}

		$.fn.live = function(event, callback){
			$(document.body).delegate(this.selector, event, callback)
			return this
		}
		$.fn.die = function(event, callback){
			$(document.body).undelegate(this.selector, event, callback)
			return this
		}

		$.fn.on = function(event, selector, data, callback, one){
			var autoRemove, delegator, $this = this
			if (event && !isString(event)) {
				$.each(event, function(type, fn){
					$this.on(type, selector, data, fn, one)
				})
				return $this
			}

			if (!isString(selector) && !isFunction(callback) && callback !== false)
				callback = data, data = selector, selector = undefined
			if (callback === undefined || data === false)
				callback = data, data = undefined

			if (callback === false) callback = returnFalse

			return $this.each(function(_, element){
				if (one) autoRemove = function(e){
					remove(element, e.type, callback)
					return callback.apply(this, arguments)
				}

				if (selector) delegator = function(e){
					var evt, match = $(e.target).closest(selector, element).get(0)
					if (match && match !== element) {
						evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
						return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
					}
				}

				add(element, event, callback, data, selector, delegator || autoRemove)
			})
		}
		$.fn.off = function(event, selector, callback){
			var $this = this
			if (event && !isString(event)) {
				$.each(event, function(type, fn){
					$this.off(type, selector, fn)
				})
				return $this
			}

			if (!isString(selector) && !isFunction(callback) && callback !== false)
				callback = selector, selector = undefined

			if (callback === false) callback = returnFalse

			return $this.each(function(){
				remove(this, event, callback, selector)
			})
		}

		$.fn.trigger = function(event, args){
			event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
			event._args = args
			return this.each(function(){
				// handle focus(), blur() by calling them directly
				if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
				// items in the collection might not be DOM elements
				else if ('dispatchEvent' in this) this.dispatchEvent(event)
				else $(this).triggerHandler(event, args)
			})
		}

		// triggers event handlers on current element just as if an event occurred,
		// doesn't trigger an actual event, doesn't bubble
		$.fn.triggerHandler = function(event, args){
			var e, result
			this.each(function(i, element){
				e = createProxy(isString(event) ? $.Event(event) : event)
				e._args = args
				e.target = element
				$.each(findHandlers(element, event.type || event), function(i, handler){
					result = handler.proxy(e)
					if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) return false
				})
			})
			return result
		}

		// shortcut methods for `.bind(event, fn)` for each event type
		;('focusin focusout focus blur load resize scroll unload click dblclick '+
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
		'change select keydown keypress keyup error').split(' ').forEach(function(event) {
			$.fn[event] = function(callback) {
				return (0 in arguments) ?
					this.bind(event, callback) :
					this.trigger(event)
			}
		})

		$.Event = function(type, props) {
			if (!isString(type)) props = type, type = props.type
			var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
			if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
			event.initEvent(type, bubbles, true)
			return compatible(event)
		}

	})(Zepto)
	/* eslint-enable */
	
	var x = Zepto;

	// Zepto extensions
	x.fn.innerText = function(){
		if (!(0 in this)) { return null; }
		if (document.createTreeWalker && NodeFilter) {
			return x.map(this, function(el) {
				var node, text=[]; walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
				while (node = walker.nextNode()) {
					text.push(node.nodeValue);
				}
				return text.join(" ");
			}).join(" ").replace(/\n+/g," ");
		}
		else {
			x.map(this, function (el) {
				return el['textContent'];
			}).join(" ").replace(/\n+/g, " ");
		}
	};
	x.fn.outerHTML = function() {
        if (!(0 in this)) { return null; }
		return x('<div>').append(this[0].cloneNode(true)).html();
	};
	x.fn.tagHTML = function() {
		return x('<div>').append(this[0].cloneNode(true)).html().replace(/>.*/,'>');
	};

	// Are we running in the page context or extension context?
	x.pagecontext = args.pagecontext || false;
	
	// Set an attribute on an Object using a possible deeply-nested path
	// Stole this from lodash _.set(object, path, value)
	// eslint-disable-next-line
	x.set=(function(){var h='[object Array]',g='[object Function]',p='[object String]';var k=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,m=/^\w*$/,l=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;var o=/\\(\\)?/g;var q=/^\d+$/;function n(b){return b==null?'':(b+'')}function f(b){return!!b&&typeof b=='object'}var j=Object.prototype;var b=j.toString;var d=9007199254740991;function r(b,c){b=(typeof b=='number'||q.test(b))?+b:-1;c=c==null?d:c;return b>-1&&b%1==0&&b<c}function t(b,d){var c=typeof b;if((c=='string'&&m.test(b))||c=='number'){return true}if(e(b)){return false}var f=!k.test(b);return f||(d!=null&&b in i(d))}function v(b){return typeof b=='number'&&b>-1&&b%1==0&&b<=d}function i(b){return c(b)?b:Object(b)}function s(b){if(e(b)){return b}var c=[];n(b).replace(l,function(d,b,f,e){c.push(f?e.replace(o,'$1'):(b||d))});return c}var e=function(c){return f(c)&&v(c.length)&&b.call(c)==h};function w(d){return c(d)&&b.call(d)==g}function c(c){var b=typeof c;return!!c&&(b=='object'||b=='function')}function x(c){return typeof c=='string'||(f(c)&&b.call(c)==p)}function u(e,d,k){if(e==null){return e}var i=(d+'');d=(e[i]!=null||t(d,e))?[i]:s(d);var f=-1,h=d.length,j=h-1,b=e;while(b!=null&&++f<h){var g=d[f];if(c(b)){if(f==j){b[g]=k}else if(b[g]==null){b[g]=r(d[f+1])?[]:{}}}b=b[g]}return e}return u})();
	
	// Test if a property is defined.
	x.def=function(o) {
		return typeof o!="undefined";
	};
	
	// Simple Pub/Sub
	x.pubsub_handlers = {};
	x.pubsub_messages = {}; // A list of all messages
	x.publish = function(event,data,republish,persist_messages) {
		if (typeof republish!="boolean") { republish=true; }
		if (typeof persist_messages!="boolean") { persist_messages=true; }
		data = data || {};
		var funcs = x.pubsub_handlers[event];
		if (funcs) {
			funcs.forEach(function(f) {
				try {
					f.call(x,event,data);
				} catch(e) {
					console.log(e);
				}
			});
		}
		// If we are running in the page context, send a message back to the extension code
		if (republish) {
			// Clone data before posting, to make sure that object references are not passed
			window.postMessage( {"sfx":true, "pagecontext":x.pagecontext, "message": { "event":event, "data":x.clone(data) } } , "*");
		}
		// Store this message in case a subscriber appears later and wants all past messages?
		if (persist_messages) {
			x.pubsub_messages[event] = x.pubsub_messages[event] || [];
			var messages = x.pubsub_messages[event];
			messages.push( {"event":event, "data":data} );
		}
	};
	// TODO: Wildcard subscriptions
	x.subscribe = function(event,func,receive_past_messages) {
		if (typeof receive_past_messages!="boolean") { receive_past_messages=false; }
		var events = (typeof event=="string") ? [event] : event;
		events.forEach(function(ev) {
			if (typeof x.pubsub_handlers[ev]=="undefined") {
				x.pubsub_handlers[ev]=[];
			}
			x.pubsub_handlers[ev].push(func);
			// If past messages are requested, fire this function for each of the past messages
			if (receive_past_messages) {
				var messages = x.pubsub_messages[ev];
				if (typeof messages!="undefined") {
					messages.forEach(function(msg) {
						func.call(x,msg.event,msg.data);
					});
				}
			}
		});
	};
	// Allow for passing of messages between extension and page contexts, using window.postMessage
	window.addEventListener('message', function(event) {
		if (event.data.sfx && event.data.pagecontext!=x.pagecontext) {
			// A message has been received from the other context
			x.publish(event.data.message.event, event.data.message.data, false);
		}
	});

	// A Generalized storage/persistence mechanism
	var ls = window.localStorage;
	x.storage = {
		"prefix":null,
		"data":{}, // keys are options, stats, etc
		"set":function(key,prop,val,callback,save) {
			// update stored value in memory
			if (typeof x.storage.data[key]=="undefined") {
				x.storage.data[key] = {};
			}
			var container = x.storage.data[key];
			// Single value set
			if (typeof prop!="object" && (typeof callback=="undefined"||typeof callback=="function"||callback==null)) {
				x.storage.set_or_delete(container,prop,val);
			}
			// Multiset
			else if (typeof prop=="object" && (typeof val=="undefined"||typeof val=="function")) {
				save=callback;
				callback = val;
				var prop2;
				for (prop2 in prop) {
					x.storage.set_or_delete(container,prop2,prop[prop2]);
				}
			}
			else {
			}
			if (false!==save) {
				x.storage.save(key, null, callback);
			}
			else if (typeof callback=="function") {
				callback(key,null);
			}
		},
		"set_or_delete":function(container,prop,val) {
			// Delete a value by setting it to undefined
			if (prop in container && typeof val=="undefined") {
				delete container[prop];
			}
			else {
				x.set(container, prop, val);
			}
		},
		"save":function(key,val,callback) {
			if (val==null && typeof x.storage.data[key]!="undefined") {
				val = x.storage.data[key];
			}
			else {
				x.storage.data[key] = val;
			}
			// persist
			Extension.storage.set(key, val, function (key, val, ret) {
				// post to localstorage to trigger updates in other windows
				var o = {"time": x.now(), "key": key};
				ls.setItem('x-storage', JSON.stringify(o));
				// Call the callback
				if (typeof callback == "function") {
					callback(key, val, ret);
				}
			}, (x.storage.prefix != null ? x.storage.prefix + '/' : ''));
		},
		"get":function(keys, defaultValue, callback, use_cache) {
			if (!!use_cache && typeof keys=="string" && typeof x.storage.data[keys]!="undefined") {
				if (typeof callback=="function") { return callback(x.storage.data[keys]); }
			}
			// TODO: Get multi values from cache!
			Extension.storage.get(keys, defaultValue, function(values) {
				var key, i;
				// Store the data in memory
				if (typeof keys=="string") {
					// Single value
					if (typeof x.storage.data[keys]=="undefined") {
						x.storage.update(keys, values);
					}
				}
				else {
					// Multi value
					for (i=0; i<keys.length; i++) {
						key = keys[i];
						x.storage.update(key,values[key]);
					}
				}
				if (typeof callback=="function") {
					callback(values);
				}
			}, (x.storage.prefix!=null?x.storage.prefix+'/':'') );
		},
		"refresh":function(key,callback) {
			if (typeof x.storage.data[key]!="undefined") {
				x.storage.get(key, null, callback, false);
			}
		}
		,"update":function(key,value) {
			x.storage.data[key] = value;
		}
	};
	// Use localStorage to communicate storage changes between windows and tabs.
	// Changes to localStorage trigger the 'storage' event in other windows on the same site.
	if (!x.pagecontext) {
		window.addEventListener('storage', function (e) {
			if ("x-storage"==e.key) {
				try {
					var json = JSON.parse(e.newValue); // {"time":123,"key":"key_name"}
					x.storage.refresh(json.key, function(data) {
						// Publish a message
						x.publish("storage/refresh", {"key":json.key,"data":data});
					});
				} catch(err) {
					console.log(err);
				}
			}
		},true);
	}

	// Sanitize HTML using the DOMPurify library, if available
	x.sanitize = function(html) {
		return (typeof DOMPurify!="undefined" ? DOMPurify.sanitize(html) : html);
	};
	x.fn.safe_html = function(html) {
		html = x.sanitize(html);
		return this.each(function(){ x(this).html(html); });
	};


	// http/ajax
	x.ajax = function(urlOrObject,callback) {
		// TODO: Allow for ajax from pagecontext
		Extension.ajax(urlOrObject,function(content,status,headers) {
			if (headers && /application\/json/.test(headers['content-type'])) {
				content = JSON.parse(content);
			}
			callback(content,status);
		});
	};
	x.ajax_dom = function(urlOrObject, callback) {
		x.ajax(urlOrObject, function(data) {
            var $dom = x('<div>');
			try {
                $dom.append(data);
			}
			catch(e) {}
            callback($dom);
		});
	};
	
	// css
	x.css = function(css,id) {
		x.when('head',function($head) {
			var s;
			if (id) {
				s = document.getElementById(id);
				if (s) {
					if (css) {
						s.textContent = css;
					}
					else {
						x(s).remove();
					}
					return;
				}
			}
			s = document.createElement('style');
			s.textContent = css;
			if (id) {
				s.id=id;
			}
			$head.append(s);
		});

	};
	
	// function execution in a <script> block (in page context)
	x.inject = function(code,args,windowVar) {
		if (!document || !document.createElement || !document.documentElement || !document.documentElement.appendChild) { return false; }
		var s = document.createElement('script');
		s.type = 'text/javascript';
		args = JSON.stringify(args||{});
		var result = windowVar?'window.'+windowVar+'=':'';
		code = result+'('+code.toString()+')('+args+');';
		if (windowVar) {
			// Post a window notification saying this variable is now defined
			code += 'window.postMessage({"sfxready":"'+windowVar+'"} , "*");';
		}
		s.text = code;
		document.documentElement.appendChild(s);
		s.parentNode.removeChild(s);
		return true;
	};
	
	// POLLING
	// Call a function repeatedly until it doesn't throw an exception or returns non-false
	x.poll = function(func,interval,max){
		interval=interval||500;
		max=max||50;
		var count=0;
		var f=function(){
			if(count++>max){return;}
			try{
				if (func(count)===false){ 
					setTimeout(f,interval); 
				}
			}
			catch(e){
				setTimeout(f,interval);
			}
		};
		f();
	};
	// A function that executes a function only when a selector returns a result
	x.when = function(selector, func) {
		var $results = x(selector);
		if ($results.length>0) {
			func($results);
		}
		else {
			setTimeout(function() {
				x.when(selector,func);
			},200);
		}
	};

	// Cookies
	x.cookie = {
		'get':function(n) { 
			try { 
				return unescape(document.cookie.match('(^|;)?'+n+'=([^;]*)(;|$)')[2]); 
			} catch(e) { 
				return null; 
			} 
		},
		'set':function() {}
	};
	
	// Logging
	x.log = function(){
		if (console && console.log) {
			var args = [];
			for (var i = 0; i < arguments.length; i++) {
				if (typeof arguments[i] == "object") {
					args.push(JSON.stringify(arguments[i], null, 3));
				}
				else {
					args.push(arguments[i]);
				}
			}
			console.log.apply(console,args);
		}
	};
	x.alert = function(msg) {
		if (typeof msg=="object") { msg=JSON.stringify(msg,null,3); }
		alert(msg);
	};

	// A "bind" function to support event capture mode
	x.bind = function(el, ev, func, capture) {
		if (typeof el == "string") {
			el = x(el);
			if (!el || el.length<1) { return ; }
			el = el[0];
		}
		else {
			el = X(el)[0];
		}
		if (typeof capture != "boolean") {
			capture = false;
		}
		if (el && el.addEventListener) {
			el.addEventListener(ev, func, capture);
		}
	};
	x.capture = function(el,ev,func) {
		x.bind(el,ev,func,true);
	};

	// A backwards-compatible replacement for the old QSA() function
	x.QSA = function(context,selector,func) {
		if (typeof selector=="function") {
			func=selector;
			selector=context;
			context=document;
		}
		x(selector,context).each(function() {
			func(this);
		});
	};
	
	// A util method to find a single element matching a selector
	x.find = function(selector) {
		var o = x(selector);
		return (o.length>0) ? o[0] : null;
	};
	
	// Find the real target of an event
	x.target = function(e,wrap){ var t=e.target; if (t.nodeType == 3){t=t.parentNode;} return wrap?x(t):t; };
	x.parent = function(el){ if(el&&el.parentNode) { return el.parentNode; } return null; };

	// A util method to clone a simple object
	x.clone = function(o) { if (!o) { return o; } return JSON.parse(JSON.stringify(o)); };

	// Some useful string methods
	x.match = function (str, regex, func) {
		if (typeof str != "string") {
			return null;
		}
		var m = str.match(regex);
		if (m && m.length) {
			if (typeof func == "function") {
				for (var i = regex.global ? 0 : 1; i < m.length; i++) {
					func(m[i]);
				}
				return m;
			} else {
				return m.length > 1 ? m[regex.global ? 0 : 1] : null;
			}
		}
		return null;
	};

	// Get a timestamp
	x.time = function() { return Date.now(); };
	x.now = x.time;
	x.today = function() {
		var d = new Date();
		return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
	};
	// Express a timestamp as a relative time "ago"
	x.ago = function(when, now, shortened, higher_resolution) {
		now = now || x.now();
		if (typeof shortened!="boolean") { shortened=true; }
		var diff = "";
		var delta = (now - when);
		var seconds = delta / x.seconds;
		if (seconds < 60) {
			return "just now";
		}
		var days = Math.floor(delta / x.days);
		if (days > 0) {
			diff += days+" day"+(days>1?"s":"")+" ";
			delta -= (days*x.days);
		}

		var hours = Math.floor(delta / x.hours );
		if (hours>0 && (higher_resolution || !diff)) {
			diff += hours + " " + (shortened ? "hr" : "hours")+" ";
			delta -= (hours*x.hours);
		}

		var minutes = Math.floor(delta / x.minutes);
		if (minutes>0 && (!diff || (higher_resolution && days<1))) {
			diff += minutes + " " + (shortened ? "mins" : "minutes") + " ";
		}
		if (!diff) {
			diff = "a while ";
		}
		return diff+"ago";
	};

	// Recurring tasks execute only at certain intervals
	x.seconds = 1000;
	x.minutes = x.seconds * 60;
	x.hours = x.minutes * 60;
	x.days = x.hours * 24;
	x.task = function(key, frequency, callback, elsecallback) {
		// Internally store the state of each task in a user pref
		x.storage.get('tasks',{},function(tasks) {
			if (typeof tasks[key]=="undefined") {
				tasks[key] = {"run_on": null};
			}
			var t = tasks[key];
			var now = x.now();
			// If we are past due, update the task and execute the callback
			if (!t.run_on || ((t.run_on+frequency) < now)) {
				t.run_on = now;
				x.storage.set('tasks',key, t, function() {
					callback();
				});
			}
			else if (typeof elsecallback=="function") {
				elsecallback(t.run_on);
			}
		},true);
	};

	// Semver Compare
	x.semver_compare = function (a, b) {
		var pa = a.split('.');
		var pb = b.split('.');
		for (var i = 0; i < 3; i++) {
			var na = Number(pa[i]);
			var nb = Number(pb[i]);
			if (na > nb) return 1;
			if (nb > na) return -1;
			if (!isNaN(na) && isNaN(nb)) return 1;
			if (isNaN(na) && !isNaN(nb)) return -1;
		}
		return 0;
	};

	// UI methods to simulate user actions
	x.ui = {
		"click": function(selector,bubble) {
			if (typeof bubble != "boolean") {
				bubble = true;
			}
			x(selector).each(function() {
				var e = document.createEvent('MouseEvents');
				e.initEvent('click', bubble, true, window, 0);
				this.dispatchEvent(e);
			});
		},
		"keypress": function(selector,code,type) {
			type = type || "keypress";
			x(selector).each(function() {
				var e = document.createEvent('KeyboardEvent');
				if (typeof code == "string") {
					code = code.charCodeAt(0);
				}
				if (e.initKeyboardEvent) {
					e.initKeyboardEvent(type, true, true, window, code, null, null);
				}
				else if (e.initKeyEvent) {
					e.initKeyEvent(type, true, true, window, false, false, false, false, false, code);
				}
				this.dispatchEvent(e);
			});
		},
		"scroll":function(pixels,el) {
			var $el = X(el || window);
			var scrollTop = $el.scrollTop();
			if (typeof scrollTop=="number") {
				$el.scrollTop(scrollTop+pixels);
			}
		}
	};

	// Draggable Objects
	x.draggable = function(el,dragend) {
		var $el = X(el);
		el = $el[0];
		$el.attr('draggable',true);
		var $undraggables = $el.find('*[draggable="false"]');
		if ($undraggables.length>0) {
			$undraggables.css({'cursor': 'auto'}).mouseenter(function() {$el.attr('draggable',false);}).mouseleave(function(e) {$el.attr('draggable',true);});
		}
		$el.on('dragstart',function(ev) {
			x.draggable.dragend = dragend;
			ev.dataTransfer.setData("text/plain",(el.offsetLeft - ev.clientX) + ',' + (el.offsetTop - ev.clientY));
			x.draggable.target = el;
		});
	};
	x.draggable.target = null;
	x.draggable.dragend = null;
	x(window).on('dragover',function(ev) {
		if (x.draggable.target) {
			ev.preventDefault();
			return false;
		}
	}).on('drop',function(ev){
		if (x.draggable.target) {
			var offset = ev.dataTransfer.getData("text/plain").split(',');
			var $el = x(x.draggable.target);
			var left = (ev.clientX + +offset[0]);
			if (left<0) { left=0; }
			var top = (ev.clientY + +offset[1]);
			if (top<0) { top=0; }
			$el.css('left', left + 'px');
			$el.css('top', top + 'px');
			$el.css('right', 'auto');
			$el.css('bottom', 'auto');
			ev.preventDefault();
			x.draggable.target = null;
			if (typeof x.draggable.dragend=="function") {
				x.draggable.dragend($el,left,top);
			}
			return false;
		}
	});
	// ELEMENT CREATION
	//
	// Create a document fragment, then optionally run a function with it as an argument
	x.fragment = function(html,func) {
		var frag = document.createDocumentFragment();
		var div = document.createElement('div');
		var selector;
		div.innerHTML = x.sanitize(html);
		while(div && div.firstChild) {
			frag.appendChild( div.firstChild );
		}
		if (typeof func=="function") {
			func(frag);
		}
		else if (typeof func=="object") {
			for (selector in func) {
				click(QS(frag,selector),func[selector],true,true);
			}
		}
		return frag;
	};

	// Observe DOM Changes
	x.on_attribute_change = function(el,attr,callback) {
		(new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (!attr || (mutation.attributeName==attr && el.getAttribute(attr)!=mutation.oldValue)) {
					callback(mutation.attributeName, mutation.oldValue);
				}
			});
		})).observe(el, {attributes: true, attributeOldValue: true});
	};

	x.return_false = function(){return false;};
	
	x.is_document_ready = function() { 
		if(document && document.readyState) { return (document.readyState=="interactive"||document.readyState=="complete"); }
		return (document && document.getElementsByTagName && document.getElementsByTagName('BODY').length>0); 
	};

	// Notes to be emitted in any sort of Support report
	x.support_note = function(who, what) {
		if (typeof x.support_notes == "undefined") {
			x.support_notes = {};
		}
		x.support_notes[who] = { who: who, what: what, when: x.now() };
	};

	// A "Ready" queue of functions to run once the event is triggered
	x.ready = (function() {
		var queue=[];
		var ready=false;
		var fire = function(o) {
			try {
				o.func();
			}
			catch(e) {
				x.log("Error in module: "+o.label);
			}
		};
		return function(label,f) {
			if (typeof label=="undefined") {
				// No arg passed, fire the queue
				ready = true;
				queue.forEach(function(o) {
					fire(o);
				});
				queue=[];
				return;
			}
			if (typeof label=="function") {
				f=label;
				label=null;
			}
			if (typeof f=="function") {
				var o = {"label":label, "func":f};
				if (ready) {
					fire(o);
				}
				else {
					queue.push( o );
				}
			}
		};
	})();

	// beforeReady() allows modules to halt execution or do things before normal execution
	x.beforeReady = (function() {
		var i,queue=[];
		return function(f) {
			if (typeof f!="function") {
				// fire the queue
				for (i=0; i<queue.length; i++) {
					if (queue[i](f)===false) {
						return false;
					}
				}
			}
			else {
				queue.push( f );
			}
		};
	})();

	return x;
};
var X = XLib();
/*
// Causes a bug in Facebook Settings when injected. Not needed yet anyway.
X.when('head',function() {
	X.inject(XLib,{pagecontext:true},'X');
});
*/


/*!
 * Vue.js v1.0.28
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Vue=e()}(this,function(){"use strict";function t(e,n,r){if(i(e,n))return void(e[n]=r);if(e._isVue)return void t(e._data,n,r);var s=e.__ob__;if(!s)return void(e[n]=r);if(s.convert(n,r),s.dep.notify(),s.vms)for(var o=s.vms.length;o--;){var a=s.vms[o];a._proxy(n),a._digest()}return r}function e(t,e){if(i(t,e)){delete t[e];var n=t.__ob__;if(!n)return void(t._isVue&&(delete t._data[e],t._digest()));if(n.dep.notify(),n.vms)for(var r=n.vms.length;r--;){var s=n.vms[r];s._unproxy(e),s._digest()}}}function i(t,e){return Mi.call(t,e)}function n(t){return Wi.test(t)}function r(t){var e=(t+"").charCodeAt(0);return 36===e||95===e}function s(t){return null==t?"":t.toString()}function o(t){if("string"!=typeof t)return t;var e=Number(t);return isNaN(e)?t:e}function a(t){return"true"===t||"false"!==t&&t}function h(t){var e=t.charCodeAt(0),i=t.charCodeAt(t.length-1);return e!==i||34!==e&&39!==e?t:t.slice(1,-1)}function l(t){return t.replace(Vi,c)}function c(t,e){return e?e.toUpperCase():""}function u(t){return t.replace(Bi,"$1-$2").replace(Bi,"$1-$2").toLowerCase()}function f(t){return t.replace(zi,c)}function p(t,e){return function(i){var n=arguments.length;return n?n>1?t.apply(e,arguments):t.call(e,i):t.call(e)}}function d(t,e){e=e||0;for(var i=t.length-e,n=new Array(i);i--;)n[i]=t[i+e];return n}function v(t,e){for(var i=Object.keys(e),n=i.length;n--;)t[i[n]]=e[i[n]];return t}function m(t){return null!==t&&"object"==typeof t}function g(t){return Ui.call(t)===Ji}function _(t,e,i,n){Object.defineProperty(t,e,{value:i,enumerable:!!n,writable:!0,configurable:!0})}function y(t,e){var i,n,r,s,o,a=function a(){var h=Date.now()-s;h<e&&h>=0?i=setTimeout(a,e-h):(i=null,o=t.apply(r,n),i||(r=n=null))};return function(){return r=this,n=arguments,s=Date.now(),i||(i=setTimeout(a,e)),o}}function b(t,e){for(var i=t.length;i--;)if(t[i]===e)return i;return-1}function w(t){var e=function e(){if(!e.cancelled)return t.apply(this,arguments)};return e.cancel=function(){e.cancelled=!0},e}function C(t,e){return t==e||!(!m(t)||!m(e))&&JSON.stringify(t)===JSON.stringify(e)}function $(t){return/native code/.test(t.toString())}function k(t){this.size=0,this.limit=t,this.head=this.tail=void 0,this._keymap=Object.create(null)}function x(){return fn.charCodeAt(vn+1)}function A(){return fn.charCodeAt(++vn)}function O(){return vn>=dn}function T(){for(;x()===Tn;)A()}function N(t){return t===kn||t===xn}function j(t){return Nn[t]}function E(t,e){return jn[t]===e}function S(){for(var t,e=A();!O();)if(t=A(),t===On)A();else if(t===e)break}function F(t){for(var e=0,i=t;!O();)if(t=x(),N(t))S();else if(i===t&&e++,E(i,t)&&e--,A(),0===e)break}function D(){for(var t=vn;!O();)if(mn=x(),N(mn))S();else if(j(mn))F(mn);else if(mn===An){if(A(),mn=x(),mn!==An){gn!==bn&&gn!==$n||(gn=wn);break}A()}else{if(mn===Tn&&(gn===Cn||gn===$n)){T();break}gn===wn&&(gn=Cn),A()}return fn.slice(t+1,vn)||null}function P(){for(var t=[];!O();)t.push(R());return t}function R(){var t,e={};return gn=wn,e.name=D().trim(),gn=$n,t=L(),t.length&&(e.args=t),e}function L(){for(var t=[];!O()&&gn!==wn;){var e=D();if(!e)break;t.push(H(e))}return t}function H(t){if(yn.test(t))return{value:o(t),dynamic:!1};var e=h(t),i=e===t;return{value:i?t:e,dynamic:i}}function I(t){var e=_n.get(t);if(e)return e;fn=t,pn={},dn=fn.length,vn=-1,mn="",gn=bn;var i;return fn.indexOf("|")<0?pn.expression=fn.trim():(pn.expression=D().trim(),i=P(),i.length&&(pn.filters=i)),_n.put(t,pn),pn}function M(t){return t.replace(Sn,"\\$&")}function W(){var t=M(Mn.delimiters[0]),e=M(Mn.delimiters[1]),i=M(Mn.unsafeDelimiters[0]),n=M(Mn.unsafeDelimiters[1]);Dn=new RegExp(i+"((?:.|\\n)+?)"+n+"|"+t+"((?:.|\\n)+?)"+e,"g"),Pn=new RegExp("^"+i+"((?:.|\\n)+?)"+n+"$"),Fn=new k(1e3)}function V(t){Fn||W();var e=Fn.get(t);if(e)return e;if(!Dn.test(t))return null;for(var i,n,r,s,o,a,h=[],l=Dn.lastIndex=0;i=Dn.exec(t);)n=i.index,n>l&&h.push({value:t.slice(l,n)}),r=Pn.test(i[0]),s=r?i[1]:i[2],o=s.charCodeAt(0),a=42===o,s=a?s.slice(1):s,h.push({tag:!0,value:s.trim(),html:r,oneTime:a}),l=n+i[0].length;return l<t.length&&h.push({value:t.slice(l)}),Fn.put(t,h),h}function B(t,e){return t.length>1?t.map(function(t){return z(t,e)}).join("+"):z(t[0],e,!0)}function z(t,e,i){return t.tag?t.oneTime&&e?'"'+e.$eval(t.value)+'"':U(t.value,i):'"'+t.value+'"'}function U(t,e){if(Rn.test(t)){var i=I(t);return i.filters?"this._applyFilters("+i.expression+",null,"+JSON.stringify(i.filters)+",false)":"("+t+")"}return e?t:"("+t+")"}function J(t,e,i,n){G(t,1,function(){e.appendChild(t)},i,n)}function q(t,e,i,n){G(t,1,function(){et(t,e)},i,n)}function Q(t,e,i){G(t,-1,function(){nt(t)},e,i)}function G(t,e,i,n,r){var s=t.__v_trans;if(!s||!s.hooks&&!rn||!n._isCompiled||n.$parent&&!n.$parent._isCompiled)return i(),void(r&&r());var o=e>0?"enter":"leave";s[o](i,r)}function Z(t){if("string"==typeof t){t=document.querySelector(t)}return t}function X(t){if(!t)return!1;var e=t.ownerDocument.documentElement,i=t.parentNode;return e===t||e===i||!(!i||1!==i.nodeType||!e.contains(i))}function Y(t,e){var i=t.getAttribute(e);return null!==i&&t.removeAttribute(e),i}function K(t,e){var i=Y(t,":"+e);return null===i&&(i=Y(t,"v-bind:"+e)),i}function tt(t,e){return t.hasAttribute(e)||t.hasAttribute(":"+e)||t.hasAttribute("v-bind:"+e)}function et(t,e){e.parentNode.insertBefore(t,e)}function it(t,e){e.nextSibling?et(t,e.nextSibling):e.parentNode.appendChild(t)}function nt(t){t.parentNode.removeChild(t)}function rt(t,e){e.firstChild?et(t,e.firstChild):e.appendChild(t)}function st(t,e){var i=t.parentNode;i&&i.replaceChild(e,t)}function ot(t,e,i,n){t.addEventListener(e,i,n)}function at(t,e,i){t.removeEventListener(e,i)}function ht(t){var e=t.className;return"object"==typeof e&&(e=e.baseVal||""),e}function lt(t,e){Ki&&!/svg$/.test(t.namespaceURI)?t.className=e:t.setAttribute("class",e)}function ct(t,e){if(t.classList)t.classList.add(e);else{var i=" "+ht(t)+" ";i.indexOf(" "+e+" ")<0&&lt(t,(i+e).trim())}}function ut(t,e){if(t.classList)t.classList.remove(e);else{for(var i=" "+ht(t)+" ",n=" "+e+" ";i.indexOf(n)>=0;)i=i.replace(n," ");lt(t,i.trim())}t.className||t.removeAttribute("class")}function ft(t,e){var i,n;if(vt(t)&&bt(t.content)&&(t=t.content),t.hasChildNodes())for(pt(t),n=e?document.createDocumentFragment():document.createElement("div");i=t.firstChild;)n.appendChild(i);return n}function pt(t){for(var e;e=t.firstChild,dt(e);)t.removeChild(e);for(;e=t.lastChild,dt(e);)t.removeChild(e)}function dt(t){return t&&(3===t.nodeType&&!t.data.trim()||8===t.nodeType)}function vt(t){return t.tagName&&"template"===t.tagName.toLowerCase()}function mt(t,e){var i=Mn.debug?document.createComment(t):document.createTextNode(e?" ":"");return i.__v_anchor=!0,i}function gt(t){if(t.hasAttributes())for(var e=t.attributes,i=0,n=e.length;i<n;i++){var r=e[i].name;if(Bn.test(r))return l(r.replace(Bn,""))}}function _t(t,e,i){for(var n;t!==e;)n=t.nextSibling,i(t),t=n;i(e)}function yt(t,e,i,n,r){function s(){if(a++,o&&a>=h.length){for(var t=0;t<h.length;t++)n.appendChild(h[t]);r&&r()}}var o=!1,a=0,h=[];_t(t,e,function(t){t===e&&(o=!0),h.push(t),Q(t,i,s)})}function bt(t){return t&&11===t.nodeType}function wt(t){if(t.outerHTML)return t.outerHTML;var e=document.createElement("div");return e.appendChild(t.cloneNode(!0)),e.innerHTML}function Ct(t,e){var i=t.tagName.toLowerCase(),n=t.hasAttributes();if(zn.test(i)||Un.test(i)){if(n)return $t(t,e)}else{if(jt(e,"components",i))return{id:i};var r=n&&$t(t,e);if(r)return r}}function $t(t,e){var i=t.getAttribute("is");if(null!=i){if(jt(e,"components",i))return t.removeAttribute("is"),{id:i}}else if(i=K(t,"is"),null!=i)return{id:i,dynamic:!0}}function kt(e,n){var r,s,o;for(r in n)s=e[r],o=n[r],i(e,r)?m(s)&&m(o)&&kt(s,o):t(e,r,o);return e}function xt(t,e){var i=Object.create(t||null);return e?v(i,Tt(e)):i}function At(t){if(t.components)for(var e,i=t.components=Tt(t.components),n=Object.keys(i),r=0,s=n.length;r<s;r++){var o=n[r];zn.test(o)||Un.test(o)||(e=i[o],g(e)&&(i[o]=Di.extend(e)))}}function Ot(t){var e,i,n=t.props;if(qi(n))for(t.props={},e=n.length;e--;)i=n[e],"string"==typeof i?t.props[i]=null:i.name&&(t.props[i.name]=i);else if(g(n)){var r=Object.keys(n);for(e=r.length;e--;)i=n[r[e]],"function"==typeof i&&(n[r[e]]={type:i})}}function Tt(t){if(qi(t)){for(var e,i={},n=t.length;n--;){e=t[n];var r="function"==typeof e?e.options&&e.options.name||e.id:e.name||e.id;r&&(i[r]=e)}return i}return t}function Nt(t,e,n){function r(i){var r=Jn[i]||qn;o[i]=r(t[i],e[i],n,i)}At(e),Ot(e);var s,o={};if(e.extends&&(t="function"==typeof e.extends?Nt(t,e.extends.options,n):Nt(t,e.extends,n)),e.mixins)for(var a=0,h=e.mixins.length;a<h;a++){var l=e.mixins[a],c=l.prototype instanceof Di?l.options:l;t=Nt(t,c,n)}for(s in t)r(s);for(s in e)i(t,s)||r(s);return o}function jt(t,e,i,n){if("string"==typeof i){var r,s=t[e],o=s[i]||s[r=l(i)]||s[r.charAt(0).toUpperCase()+r.slice(1)];return o}}function Et(){this.id=Qn++,this.subs=[]}function St(t){Yn=!1,t(),Yn=!0}function Ft(t){if(this.value=t,this.dep=new Et,_(t,"__ob__",this),qi(t)){var e=Qi?Dt:Pt;e(t,Zn,Xn),this.observeArray(t)}else this.walk(t)}function Dt(t,e){t.__proto__=e}function Pt(t,e,i){for(var n=0,r=i.length;n<r;n++){var s=i[n];_(t,s,e[s])}}function Rt(t,e){if(t&&"object"==typeof t){var n;return i(t,"__ob__")&&t.__ob__ instanceof Ft?n=t.__ob__:Yn&&(qi(t)||g(t))&&Object.isExtensible(t)&&!t._isVue&&(n=new Ft(t)),n&&e&&n.addVm(e),n}}function Lt(t,e,i){var n=new Et,r=Object.getOwnPropertyDescriptor(t,e);if(!r||r.configurable!==!1){var s=r&&r.get,o=r&&r.set,a=Rt(i);Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){var e=s?s.call(t):i;if(Et.target&&(n.depend(),a&&a.dep.depend(),qi(e)))for(var r,o=0,h=e.length;o<h;o++)r=e[o],r&&r.__ob__&&r.__ob__.dep.depend();return e},set:function(e){var r=s?s.call(t):i;e!==r&&(o?o.call(t,e):i=e,a=Rt(e),n.notify())}})}}function Ht(t){t.prototype._init=function(t){t=t||{},this.$el=null,this.$parent=t.parent,this.$root=this.$parent?this.$parent.$root:this,this.$children=[],this.$refs={},this.$els={},this._watchers=[],this._directives=[],this._uid=tr++,this._isVue=!0,this._events={},this._eventsCount={},this._isFragment=!1,this._fragment=this._fragmentStart=this._fragmentEnd=null,this._isCompiled=this._isDestroyed=this._isReady=this._isAttached=this._isBeingDestroyed=this._vForRemoving=!1,this._unlinkFn=null,this._context=t._context||this.$parent,this._scope=t._scope,this._frag=t._frag,this._frag&&this._frag.children.push(this),this.$parent&&this.$parent.$children.push(this),t=this.$options=Nt(this.constructor.options,t,this),this._updateRef(),this._data={},this._callHook("init"),this._initState(),this._initEvents(),this._callHook("created"),t.el&&this.$mount(t.el)}}function It(t){if(void 0===t)return"eof";var e=t.charCodeAt(0);switch(e){case 91:case 93:case 46:case 34:case 39:case 48:return t;case 95:case 36:return"ident";case 32:case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"ws"}return e>=97&&e<=122||e>=65&&e<=90?"ident":e>=49&&e<=57?"number":"else"}function Mt(t){var e=t.trim();return("0"!==t.charAt(0)||!isNaN(t))&&(n(e)?h(e):"*"+e)}function Wt(t){function e(){var e=t[c+1];if(u===ur&&"'"===e||u===fr&&'"'===e)return c++,n="\\"+e,p[ir](),!0}var i,n,r,s,o,a,h,l=[],c=-1,u=or,f=0,p=[];for(p[nr]=function(){void 0!==r&&(l.push(r),r=void 0)},p[ir]=function(){void 0===r?r=n:r+=n},p[rr]=function(){p[ir](),f++},p[sr]=function(){if(f>0)f--,u=cr,p[ir]();else{if(f=0,r=Mt(r),r===!1)return!1;p[nr]()}};null!=u;)if(c++,i=t[c],"\\"!==i||!e()){if(s=It(i),h=vr[u],o=h[s]||h.else||dr,o===dr)return;if(u=o[0],a=p[o[1]],a&&(n=o[2],n=void 0===n?i:n,a()===!1))return;if(u===pr)return l.raw=t,l}}function Vt(t){var e=er.get(t);return e||(e=Wt(t),e&&er.put(t,e)),e}function Bt(t,e){return Yt(e).get(t)}function zt(e,i,n){var r=e;if("string"==typeof i&&(i=Wt(i)),!i||!m(e))return!1;for(var s,o,a=0,h=i.length;a<h;a++)s=e,o=i[a],"*"===o.charAt(0)&&(o=Yt(o.slice(1)).get.call(r,r)),a<h-1?(e=e[o],m(e)||(e={},t(s,o,e))):qi(e)?e.$set(o,n):o in e?e[o]=n:t(e,o,n);return!0}function Ut(){}function Jt(t,e){var i=Nr.length;return Nr[i]=e?t.replace($r,"\\n"):t,'"'+i+'"'}function qt(t){var e=t.charAt(0),i=t.slice(1);return yr.test(i)?t:(i=i.indexOf('"')>-1?i.replace(xr,Qt):i,e+"scope."+i)}function Qt(t,e){return Nr[e]}function Gt(t){wr.test(t),Nr.length=0;var e=t.replace(kr,Jt).replace(Cr,"");return e=(" "+e).replace(Or,qt).replace(xr,Qt),Zt(e)}function Zt(t){try{return new Function("scope","return "+t+";")}catch(t){return Ut}}function Xt(t){var e=Vt(t);if(e)return function(t,i){zt(t,e,i)}}function Yt(t,e){t=t.trim();var i=gr.get(t);if(i)return e&&!i.set&&(i.set=Xt(i.exp)),i;var n={exp:t};return n.get=Kt(t)&&t.indexOf("[")<0?Zt("scope."+t):Gt(t),e&&(n.set=Xt(t)),gr.put(t,n),n}function Kt(t){return Ar.test(t)&&!Tr.test(t)&&"Math."!==t.slice(0,5)}function te(){Er.length=0,Sr.length=0,Fr={},Dr={},Pr=!1}function ee(){for(var t=!0;t;)t=!1,ie(Er),ie(Sr),Er.length?t=!0:(Zi&&Mn.devtools&&Zi.emit("flush"),te())}function ie(t){for(var e=0;e<t.length;e++){var i=t[e],n=i.id;Fr[n]=null,i.run()}t.length=0}function ne(t){var e=t.id;if(null==Fr[e]){var i=t.user?Sr:Er;Fr[e]=i.length,i.push(t),Pr||(Pr=!0,ln(ee))}}function re(t,e,i,n){n&&v(this,n);var r="function"==typeof e;if(this.vm=t,t._watchers.push(this),this.expression=e,this.cb=i,this.id=++Rr,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new cn,this.newDepIds=new cn,this.prevError=null,r)this.getter=e,this.setter=void 0;else{var s=Yt(e,this.twoWay);this.getter=s.get,this.setter=s.set}this.value=this.lazy?void 0:this.get(),this.queued=this.shallow=!1}function se(t,e){var i=void 0,n=void 0;e||(e=Lr,e.clear());var r=qi(t),s=m(t);if((r||s)&&Object.isExtensible(t)){if(t.__ob__){var o=t.__ob__.dep.id;if(e.has(o))return;e.add(o)}if(r)for(i=t.length;i--;)se(t[i],e);else if(s)for(n=Object.keys(t),i=n.length;i--;)se(t[n[i]],e)}}function oe(t){return vt(t)&&bt(t.content)}function ae(t,e){var i=e?t:t.trim(),n=Ir.get(i);if(n)return n;var r=document.createDocumentFragment(),s=t.match(Vr),o=Br.test(t),a=zr.test(t);if(s||o||a){var h=s&&s[1],l=Wr[h]||Wr.efault,c=l[0],u=l[1],f=l[2],p=document.createElement("div");for(p.innerHTML=u+t+f;c--;)p=p.lastChild;for(var d;d=p.firstChild;)r.appendChild(d)}else r.appendChild(document.createTextNode(t));return e||pt(r),Ir.put(i,r),r}function he(t){if(oe(t))return ae(t.innerHTML);if("SCRIPT"===t.tagName)return ae(t.textContent);for(var e,i=le(t),n=document.createDocumentFragment();e=i.firstChild;)n.appendChild(e);return pt(n),n}function le(t){if(!t.querySelectorAll)return t.cloneNode();var e,i,n,r=t.cloneNode(!0);if(Ur){var s=r;if(oe(t)&&(t=t.content,s=r.content),i=t.querySelectorAll("template"),i.length)for(n=s.querySelectorAll("template"),e=n.length;e--;)n[e].parentNode.replaceChild(le(i[e]),n[e])}if(Jr)if("TEXTAREA"===t.tagName)r.value=t.value;else if(i=t.querySelectorAll("textarea"),i.length)for(n=r.querySelectorAll("textarea"),e=n.length;e--;)n[e].value=i[e].value;return r}function ce(t,e,i){var n,r;return bt(t)?(pt(t),e?le(t):t):("string"==typeof t?i||"#"!==t.charAt(0)?r=ae(t,i):(r=Mr.get(t),r||(n=document.getElementById(t.slice(1)),n&&(r=he(n),Mr.put(t,r)))):t.nodeType&&(r=he(t)),r&&e?le(r):r)}function ue(t,e,i,n,r,s){this.children=[],this.childFrags=[],this.vm=e,this.scope=r,this.inserted=!1,this.parentFrag=s,s&&s.childFrags.push(this),this.unlink=t(e,i,n,r,this);var o=this.single=1===i.childNodes.length&&!i.childNodes[0].__v_anchor;o?(this.node=i.childNodes[0],this.before=fe,this.remove=pe):(this.node=mt("fragment-start"),this.end=mt("fragment-end"),this.frag=i,rt(this.node,i),i.appendChild(this.end),this.before=de,this.remove=ve),this.node.__v_frag=this}function fe(t,e){this.inserted=!0;var i=e!==!1?q:et;i(this.node,t,this.vm),X(this.node)&&this.callHook(me)}function pe(){this.inserted=!1;var t=X(this.node),e=this;this.beforeRemove(),Q(this.node,this.vm,function(){t&&e.callHook(ge),e.destroy()})}function de(t,e){this.inserted=!0;var i=this.vm,n=e!==!1?q:et;_t(this.node,this.end,function(e){n(e,t,i)}),X(this.node)&&this.callHook(me)}function ve(){this.inserted=!1;var t=this,e=X(this.node);this.beforeRemove(),yt(this.node,this.end,this.vm,this.frag,function(){e&&t.callHook(ge),t.destroy()})}function me(t){!t._isAttached&&X(t.$el)&&t._callHook("attached")}function ge(t){t._isAttached&&!X(t.$el)&&t._callHook("detached")}function _e(t,e){this.vm=t;var i,n="string"==typeof e;n||vt(e)&&!e.hasAttribute("v-if")?i=ce(e,!0):(i=document.createDocumentFragment(),i.appendChild(e)),this.template=i;var r,s=t.constructor.cid;if(s>0){var o=s+(n?e:wt(e));r=Gr.get(o),r||(r=qe(i,t.$options,!0),Gr.put(o,r))}else r=qe(i,t.$options,!0);this.linker=r}function ye(t,e,i){var n=t.node.previousSibling;if(n){for(t=n.__v_frag;!(t&&t.forId===i&&t.inserted||n===e);){if(n=n.previousSibling,!n)return;t=n.__v_frag}return t}}function be(t){for(var e=-1,i=new Array(Math.floor(t));++e<t;)i[e]=e;return i}function we(t,e,i,n){return n?"$index"===n?t:n.charAt(0).match(/\w/)?Bt(i,n):i[n]:e||i}function Ce(t){var e=t.node;if(t.end)for(;!e.__vue__&&e!==t.end&&e.nextSibling;)e=e.nextSibling;return e.__vue__}function $e(t,e,i){for(var n,r,s,o=e?[]:null,a=0,h=t.options.length;a<h;a++)if(n=t.options[a],s=i?n.hasAttribute("selected"):n.selected){if(r=n.hasOwnProperty("_value")?n._value:n.value,!e)return r;o.push(r)}return o}function ke(t,e){for(var i=t.length;i--;)if(C(t[i],e))return i;return-1}function xe(t,e){var i=e.map(function(t){var e=t.charCodeAt(0);return e>47&&e<58?parseInt(t,10):1===t.length&&(e=t.toUpperCase().charCodeAt(0),e>64&&e<91)?e:ms[t]});return i=[].concat.apply([],i),function(e){if(i.indexOf(e.keyCode)>-1)return t.call(this,e)}}function Ae(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function Oe(t){return function(e){return e.preventDefault(),t.call(this,e)}}function Te(t){return function(e){if(e.target===e.currentTarget)return t.call(this,e)}}function Ne(t){if(ws[t])return ws[t];var e=je(t);return ws[t]=ws[e]=e,e}function je(t){t=u(t);var e=l(t),i=e.charAt(0).toUpperCase()+e.slice(1);Cs||(Cs=document.createElement("div"));var n,r=_s.length;if("filter"!==e&&e in Cs.style)return{kebab:t,camel:e};for(;r--;)if(n=ys[r]+i,n in Cs.style)return{kebab:_s[r]+t,camel:n}}function Ee(t){var e=[];if(qi(t))for(var i=0,n=t.length;i<n;i++){var r=t[i];if(r)if("string"==typeof r)e.push(r);else for(var s in r)r[s]&&e.push(s)}else if(m(t))for(var o in t)t[o]&&e.push(o);return e}function Se(t,e,i){if(e=e.trim(),e.indexOf(" ")===-1)return void i(t,e);for(var n=e.split(/\s+/),r=0,s=n.length;r<s;r++)i(t,n[r])}function Fe(t,e,i){function n(){++s>=r?i():t[s].call(e,n)}var r=t.length,s=0;t[0].call(e,n)}function De(t,e,i){for(var r,s,o,a,h,c,f,p=[],d=i.$options.propsData,v=Object.keys(e),m=v.length;m--;)s=v[m],r=e[s]||Hs,h=l(s),Is.test(h)&&(f={name:s,path:h,options:r,mode:Ls.ONE_WAY,raw:null},o=u(s),null===(a=K(t,o))&&(null!==(a=K(t,o+".sync"))?f.mode=Ls.TWO_WAY:null!==(a=K(t,o+".once"))&&(f.mode=Ls.ONE_TIME)),null!==a?(f.raw=a,c=I(a),a=c.expression,f.filters=c.filters,n(a)&&!c.filters?f.optimizedLiteral=!0:f.dynamic=!0,f.parentPath=a):null!==(a=Y(t,o))?f.raw=a:d&&null!==(a=d[s]||d[h])&&(f.raw=a),p.push(f));return Pe(p)}function Pe(t){return function(e,n){e._props={};for(var r,s,l,c,f,p=e.$options.propsData,d=t.length;d--;)if(r=t[d],f=r.raw,s=r.path,l=r.options,e._props[s]=r,p&&i(p,s)&&Le(e,r,p[s]),null===f)Le(e,r,void 0);else if(r.dynamic)r.mode===Ls.ONE_TIME?(c=(n||e._context||e).$get(r.parentPath),Le(e,r,c)):e._context?e._bindDir({name:"prop",def:Ws,prop:r},null,null,n):Le(e,r,e.$get(r.parentPath));else if(r.optimizedLiteral){var v=h(f);c=v===f?a(o(f)):v,Le(e,r,c)}else c=l.type===Boolean&&(""===f||f===u(r.name))||f,Le(e,r,c)}}function Re(t,e,i,n){var r=e.dynamic&&Kt(e.parentPath),s=i;void 0===s&&(s=Ie(t,e)),s=We(e,s,t);var o=s!==i;Me(e,s,t)||(s=void 0),r&&!o?St(function(){n(s)}):n(s)}function Le(t,e,i){Re(t,e,i,function(i){Lt(t,e.path,i)})}function He(t,e,i){Re(t,e,i,function(i){t[e.path]=i})}function Ie(t,e){var n=e.options;if(!i(n,"default"))return n.type!==Boolean&&void 0;var r=n.default;return m(r),"function"==typeof r&&n.type!==Function?r.call(t):r}function Me(t,e,i){if(!t.options.required&&(null===t.raw||null==e))return!0;var n=t.options,r=n.type,s=!r,o=[];if(r){qi(r)||(r=[r]);for(var a=0;a<r.length&&!s;a++){var h=Ve(e,r[a]);o.push(h.expectedType),s=h.valid}}if(!s)return!1;var l=n.validator;return!(l&&!l(e))}function We(t,e,i){var n=t.options.coerce;return n&&"function"==typeof n?n(e):e}function Ve(t,e){var i,n;return e===String?(n="string",i=typeof t===n):e===Number?(n="number",i=typeof t===n):e===Boolean?(n="boolean",i=typeof t===n):e===Function?(n="function",i=typeof t===n):e===Object?(n="object",i=g(t)):e===Array?(n="array",i=qi(t)):i=t instanceof e,{valid:i,expectedType:n}}function Be(t){Vs.push(t),Bs||(Bs=!0,ln(ze))}function ze(){for(var t=document.documentElement.offsetHeight,e=0;e<Vs.length;e++)Vs[e]();return Vs=[],Bs=!1,t}function Ue(t,e,i,n){this.id=e,this.el=t,this.enterClass=i&&i.enterClass||e+"-enter",this.leaveClass=i&&i.leaveClass||e+"-leave",this.hooks=i,this.vm=n,this.pendingCssEvent=this.pendingCssCb=this.cancel=this.pendingJsCb=this.op=this.cb=null,this.justEntered=!1,this.entered=this.left=!1,this.typeCache={},this.type=i&&i.type;var r=this;["enterNextTick","enterDone","leaveNextTick","leaveDone"].forEach(function(t){r[t]=p(r[t],r)})}function Je(t){if(/svg$/.test(t.namespaceURI)){var e=t.getBoundingClientRect();return!(e.width||e.height)}return!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)}function qe(t,e,i){var n=i||!e._asComponent?ti(t,e):null,r=n&&n.terminal||gi(t)||!t.hasChildNodes()?null:oi(t.childNodes,e);return function(t,e,i,s,o){var a=d(e.childNodes),h=Qe(function(){n&&n(t,e,i,s,o),r&&r(t,a,i,s,o)},t);return Ze(t,h)}}function Qe(t,e){e._directives=[];var i=e._directives.length;t();var n=e._directives.slice(i);Ge(n);for(var r=0,s=n.length;r<s;r++)n[r]._bind();return n}function Ge(t){if(0!==t.length){var e,i,n,r,s={},o=0,a=[];for(e=0,i=t.length;e<i;e++){var h=t[e],l=h.descriptor.def.priority||ro,c=s[l];c||(c=s[l]=[],a.push(l)),c.push(h)}for(a.sort(function(t,e){return t>e?-1:t===e?0:1}),e=0,i=a.length;e<i;e++){var u=s[a[e]];for(n=0,r=u.length;n<r;n++)t[o++]=u[n]}}}function Ze(t,e,i,n){function r(r){Xe(t,e,r),i&&n&&Xe(i,n)}return r.dirs=e,r}function Xe(t,e,i){for(var n=e.length;n--;)e[n]._teardown()}function Ye(t,e,i,n){var r=De(e,i,t),s=Qe(function(){r(t,n)},t);return Ze(t,s)}function Ke(t,e,i){var n,r,s=e._containerAttrs,o=e._replacerAttrs;return 11!==t.nodeType&&(e._asComponent?(s&&i&&(n=pi(s,i)),o&&(r=pi(o,e))):r=pi(t.attributes,e)),e._containerAttrs=e._replacerAttrs=null,function(t,e,i){var s,o=t._context;o&&n&&(s=Qe(function(){n(o,e,null,i)},o));var a=Qe(function(){r&&r(t,e)},t);return Ze(t,a,o,s)}}function ti(t,e){var i=t.nodeType;return 1!==i||gi(t)?3===i&&t.data.trim()?ii(t,e):null:ei(t,e)}function ei(t,e){if("TEXTAREA"===t.tagName){if(null!==Y(t,"v-pre"))return ui;var i=V(t.value);i&&(t.setAttribute(":value",B(i)),t.value="")}var n,r=t.hasAttributes(),s=r&&d(t.attributes);return r&&(n=ci(t,s,e)),n||(n=hi(t,e)),n||(n=li(t,e)),!n&&r&&(n=pi(s,e)),n}function ii(t,e){if(t._skip)return ni;var i=V(t.wholeText);if(!i)return null;for(var n=t.nextSibling;n&&3===n.nodeType;)n._skip=!0,n=n.nextSibling;for(var r,s,o=document.createDocumentFragment(),a=0,h=i.length;a<h;a++)s=i[a],r=s.tag?ri(s,e):document.createTextNode(s.value),o.appendChild(r);return si(i,o,e)}function ni(t,e){nt(e)}function ri(t,e){function i(e){if(!t.descriptor){var i=I(t.value);t.descriptor={name:e,def:Ds[e],expression:i.expression,filters:i.filters}}}var n;return t.oneTime?n=document.createTextNode(t.value):t.html?(n=document.createComment("v-html"),i("html")):(n=document.createTextNode(" "),i("text")),n}function si(t,e){return function(i,n,r,o){for(var a,h,l,c=e.cloneNode(!0),u=d(c.childNodes),f=0,p=t.length;f<p;f++)a=t[f],h=a.value,a.tag&&(l=u[f],a.oneTime?(h=(o||i).$eval(h),a.html?st(l,ce(h,!0)):l.data=s(h)):i._bindDir(a.descriptor,l,r,o));st(n,c)}}function oi(t,e){for(var i,n,r,s=[],o=0,a=t.length;o<a;o++)r=t[o],i=ti(r,e),n=i&&i.terminal||"SCRIPT"===r.tagName||!r.hasChildNodes()?null:oi(r.childNodes,e),s.push(i,n);return s.length?ai(s):null}function ai(t){return function(e,i,n,r,s){for(var o,a,h,l=0,c=0,u=t.length;l<u;c++){o=i[c],a=t[l++],h=t[l++];var f=d(o.childNodes);a&&a(e,o,n,r,s),h&&h(e,f,n,r,s)}}}function hi(t,e){var i=t.tagName.toLowerCase();if(!zn.test(i)){var n=jt(e,"elementDirectives",i);return n?fi(t,i,"",e,n):void 0}}function li(t,e){var i=Ct(t,e);if(i){var n=gt(t),r={name:"component",ref:n,expression:i.id,def:Ys.component,modifiers:{literal:!i.dynamic}},s=function(t,e,i,s,o){n&&Lt((s||t).$refs,n,null),t._bindDir(r,e,i,s,o)};return s.terminal=!0,s}}function ci(t,e,i){if(null!==Y(t,"v-pre"))return ui;if(t.hasAttribute("v-else")){var n=t.previousElementSibling;if(n&&n.hasAttribute("v-if"))return ui}for(var r,s,o,a,h,l,c,u,f,p,d=0,v=e.length;d<v;d++)r=e[d],s=r.name.replace(io,""),(h=s.match(eo))&&(f=jt(i,"directives",h[1]),f&&f.terminal&&(!p||(f.priority||so)>p.priority)&&(p=f,c=r.name,a=di(r.name),o=r.value,l=h[1],u=h[2]));return p?fi(t,l,o,i,p,c,u,a):void 0}function ui(){}function fi(t,e,i,n,r,s,o,a){var h=I(i),l={name:e,arg:o,expression:h.expression,filters:h.filters,raw:i,attr:s,modifiers:a,def:r};"for"!==e&&"router-view"!==e||(l.ref=gt(t));var c=function(t,e,i,n,r){l.ref&&Lt((n||t).$refs,l.ref,null),t._bindDir(l,e,i,n,r)};return c.terminal=!0,c}function pi(t,e){function i(t,e,i){var n=i&&mi(i),r=!n&&I(s);v.push({name:t,attr:o,raw:a,def:e,arg:l,modifiers:c,expression:r&&r.expression,filters:r&&r.filters,interp:i,hasOneTime:n})}for(var n,r,s,o,a,h,l,c,u,f,p,d=t.length,v=[];d--;)if(n=t[d],r=o=n.name,s=a=n.value,f=V(s),l=null,c=di(r),r=r.replace(io,""),f)s=B(f),l=r,i("bind",Ds.bind,f);else if(no.test(r))c.literal=!Ks.test(r),i("transition",Ys.transition);else if(to.test(r))l=r.replace(to,""),i("on",Ds.on);else if(Ks.test(r))h=r.replace(Ks,""),"style"===h||"class"===h?i(h,Ys[h]):(l=h,i("bind",Ds.bind));else if(p=r.match(eo)){if(h=p[1],l=p[2],"else"===h)continue;u=jt(e,"directives",h,!0),u&&i(h,u)}if(v.length)return vi(v)}function di(t){var e=Object.create(null),i=t.match(io);if(i)for(var n=i.length;n--;)e[i[n].slice(1)]=!0;return e}function vi(t){return function(e,i,n,r,s){for(var o=t.length;o--;)e._bindDir(t[o],i,n,r,s)}}function mi(t){for(var e=t.length;e--;)if(t[e].oneTime)return!0}function gi(t){return"SCRIPT"===t.tagName&&(!t.hasAttribute("type")||"text/javascript"===t.getAttribute("type"))}function _i(t,e){return e&&(e._containerAttrs=bi(t)),vt(t)&&(t=ce(t)),e&&(e._asComponent&&!e.template&&(e.template="<slot></slot>"),e.template&&(e._content=ft(t),t=yi(t,e))),bt(t)&&(rt(mt("v-start",!0),t),t.appendChild(mt("v-end",!0))),t}function yi(t,e){var i=e.template,n=ce(i,!0);if(n){var r=n.firstChild;if(!r)return n;var s=r.tagName&&r.tagName.toLowerCase();return e.replace?(t===document.body,n.childNodes.length>1||1!==r.nodeType||"component"===s||jt(e,"components",s)||tt(r,"is")||jt(e,"elementDirectives",s)||r.hasAttribute("v-for")||r.hasAttribute("v-if")?n:(e._replacerAttrs=bi(r),wi(t,r),r)):(t.appendChild(n),t)}}function bi(t){if(1===t.nodeType&&t.hasAttributes())return d(t.attributes)}function wi(t,e){for(var i,n,r=t.attributes,s=r.length;s--;)i=r[s].name,n=r[s].value,e.hasAttribute(i)||oo.test(i)?"class"===i&&!V(n)&&(n=n.trim())&&n.split(/\s+/).forEach(function(t){ct(e,t)}):e.setAttribute(i,n)}function Ci(t,e){if(e){for(var i,n,r=t._slotContents=Object.create(null),s=0,o=e.children.length;s<o;s++)i=e.children[s],(n=i.getAttribute("slot"))&&(r[n]||(r[n]=[])).push(i);for(n in r)r[n]=$i(r[n],e);if(e.hasChildNodes()){var a=e.childNodes;if(1===a.length&&3===a[0].nodeType&&!a[0].data.trim())return;r.default=$i(e.childNodes,e)}}}function $i(t,e){var i=document.createDocumentFragment();t=d(t);for(var n=0,r=t.length;n<r;n++){var s=t[n];!vt(s)||s.hasAttribute("v-if")||s.hasAttribute("v-for")||(e.removeChild(s),s=ce(s,!0)),i.appendChild(s)}return i}function ki(t){function e(){}function n(t,e){var i=new re(e,t,null,{lazy:!0});return function(){return i.dirty&&i.evaluate(),Et.target&&i.depend(),i.value}}Object.defineProperty(t.prototype,"$data",{get:function(){return this._data},set:function(t){t!==this._data&&this._setData(t)}}),t.prototype._initState=function(){this._initProps(),this._initMeta(),this._initMethods(),this._initData(),this._initComputed()},t.prototype._initProps=function(){var t=this.$options,e=t.el,i=t.props;e=t.el=Z(e),this._propsUnlinkFn=e&&1===e.nodeType&&i?Ye(this,e,i,this._scope):null},t.prototype._initData=function(){var t=this.$options.data,e=this._data=t?t():{};g(e)||(e={});var n,r,s=this._props,o=Object.keys(e);for(n=o.length;n--;)r=o[n],s&&i(s,r)||this._proxy(r);Rt(e,this)},t.prototype._setData=function(t){t=t||{};var e=this._data;this._data=t;var n,r,s;for(n=Object.keys(e),s=n.length;s--;)r=n[s],r in t||this._unproxy(r);for(n=Object.keys(t),s=n.length;s--;)r=n[s],i(this,r)||this._proxy(r);e.__ob__.removeVm(this),Rt(t,this),this._digest()},t.prototype._proxy=function(t){if(!r(t)){var e=this;Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get:function(){return e._data[t]},set:function(i){e._data[t]=i}})}},t.prototype._unproxy=function(t){r(t)||delete this[t]},t.prototype._digest=function(){for(var t=0,e=this._watchers.length;t<e;t++)this._watchers[t].update(!0)},t.prototype._initComputed=function(){var t=this.$options.computed;if(t)for(var i in t){var r=t[i],s={enumerable:!0,configurable:!0};"function"==typeof r?(s.get=n(r,this),s.set=e):(s.get=r.get?r.cache!==!1?n(r.get,this):p(r.get,this):e,s.set=r.set?p(r.set,this):e),Object.defineProperty(this,i,s)}},t.prototype._initMethods=function(){var t=this.$options.methods;if(t)for(var e in t)this[e]=p(t[e],this)},t.prototype._initMeta=function(){var t=this.$options._meta;if(t)for(var e in t)Lt(this,e,t[e])}}function xi(t){function e(t,e){for(var i,n,r,s=e.attributes,o=0,a=s.length;o<a;o++)i=s[o].name,ho.test(i)&&(i=i.replace(ho,""),n=s[o].value,Kt(n)&&(n+=".apply(this, $arguments)"),r=(t._scope||t._context).$eval(n,!0),r._fromParent=!0,t.$on(i.replace(ho),r))}function i(t,e,i){if(i){var r,s,o,a;for(s in i)if(r=i[s],qi(r))for(o=0,a=r.length;o<a;o++)n(t,e,s,r[o]);else n(t,e,s,r)}}function n(t,e,i,r,s){var o=typeof r;if("function"===o)t[e](i,r,s);else if("string"===o){var a=t.$options.methods,h=a&&a[r];h&&t[e](i,h,s)}else r&&"object"===o&&n(t,e,i,r.handler,r)}function r(){this._isAttached||(this._isAttached=!0,this.$children.forEach(s))}function s(t){!t._isAttached&&X(t.$el)&&t._callHook("attached")}function o(){this._isAttached&&(this._isAttached=!1,this.$children.forEach(a))}function a(t){t._isAttached&&!X(t.$el)&&t._callHook("detached")}t.prototype._initEvents=function(){var t=this.$options;t._asComponent&&e(this,t.el),i(this,"$on",t.events),i(this,"$watch",t.watch)},t.prototype._initDOMHooks=function(){this.$on("hook:attached",r),this.$on("hook:detached",o)},t.prototype._callHook=function(t){this.$emit("pre-hook:"+t);var e=this.$options[t];if(e)for(var i=0,n=e.length;i<n;i++)e[i].call(this);this.$emit("hook:"+t)}}function Ai(){}function Oi(t,e,i,n,r,s){this.vm=e,this.el=i,this.descriptor=t,this.name=t.name,this.expression=t.expression,this.arg=t.arg,this.modifiers=t.modifiers,this.filters=t.filters,this.literal=this.modifiers&&this.modifiers.literal,this._locked=!1,this._bound=!1,this._listeners=null,this._host=n,this._scope=r,this._frag=s}function Ti(t){t.prototype._updateRef=function(t){var e=this.$options._ref;if(e){var i=(this._scope||this._context).$refs;t?i[e]===this&&(i[e]=null):i[e]=this}},t.prototype._compile=function(t){var e=this.$options,i=t;if(t=_i(t,e),this._initElement(t),1!==t.nodeType||null===Y(t,"v-pre")){var n=this._context&&this._context.$options,r=Ke(t,e,n);Ci(this,e._content);var s,o=this.constructor;e._linkerCachable&&(s=o.linker,s||(s=o.linker=qe(t,e)));var a=r(this,t,this._scope),h=s?s(this,t):qe(t,e)(this,t);
this._unlinkFn=function(){a(),h(!0)},e.replace&&st(i,t),this._isCompiled=!0,this._callHook("compiled")}},t.prototype._initElement=function(t){bt(t)?(this._isFragment=!0,this.$el=this._fragmentStart=t.firstChild,this._fragmentEnd=t.lastChild,3===this._fragmentStart.nodeType&&(this._fragmentStart.data=this._fragmentEnd.data=""),this._fragment=t):this.$el=t,this.$el.__vue__=this,this._callHook("beforeCompile")},t.prototype._bindDir=function(t,e,i,n,r){this._directives.push(new Oi(t,this,e,i,n,r))},t.prototype._destroy=function(t,e){if(this._isBeingDestroyed)return void(e||this._cleanup());var i,n,r=this,s=function(){!i||n||e||r._cleanup()};t&&this.$el&&(n=!0,this.$remove(function(){n=!1,s()})),this._callHook("beforeDestroy"),this._isBeingDestroyed=!0;var o,a=this.$parent;for(a&&!a._isBeingDestroyed&&(a.$children.$remove(this),this._updateRef(!0)),o=this.$children.length;o--;)this.$children[o].$destroy();for(this._propsUnlinkFn&&this._propsUnlinkFn(),this._unlinkFn&&this._unlinkFn(),o=this._watchers.length;o--;)this._watchers[o].teardown();this.$el&&(this.$el.__vue__=null),i=!0,s()},t.prototype._cleanup=function(){this._isDestroyed||(this._frag&&this._frag.children.$remove(this),this._data&&this._data.__ob__&&this._data.__ob__.removeVm(this),this.$el=this.$parent=this.$root=this.$children=this._watchers=this._context=this._scope=this._directives=null,this._isDestroyed=!0,this._callHook("destroyed"),this.$off())}}function Ni(t){t.prototype._applyFilters=function(t,e,i,n){var r,s,o,a,h,l,c,u,f;for(l=0,c=i.length;l<c;l++)if(r=i[n?c-l-1:l],s=jt(this.$options,"filters",r.name,!0),s&&(s=n?s.write:s.read||s,"function"==typeof s)){if(o=n?[t,e]:[t],h=n?2:1,r.args)for(u=0,f=r.args.length;u<f;u++)a=r.args[u],o[u+h]=a.dynamic?this.$get(a.value):a.value;t=s.apply(this,o)}return t},t.prototype._resolveComponent=function(e,i){var n;if(n="function"==typeof e?e:jt(this.$options,"components",e,!0))if(n.options)i(n);else if(n.resolved)i(n.resolved);else if(n.requested)n.pendingCallbacks.push(i);else{n.requested=!0;var r=n.pendingCallbacks=[i];n.call(this,function(e){g(e)&&(e=t.extend(e)),n.resolved=e;for(var i=0,s=r.length;i<s;i++)r[i](e)},function(t){})}}}function ji(t){function i(t){return JSON.parse(JSON.stringify(t))}t.prototype.$get=function(t,e){var i=Yt(t);if(i){if(e){var n=this;return function(){n.$arguments=d(arguments);var t=i.get.call(n,n);return n.$arguments=null,t}}try{return i.get.call(this,this)}catch(t){}}},t.prototype.$set=function(t,e){var i=Yt(t,!0);i&&i.set&&i.set.call(this,this,e)},t.prototype.$delete=function(t){e(this._data,t)},t.prototype.$watch=function(t,e,i){var n,r=this;"string"==typeof t&&(n=I(t),t=n.expression);var s=new re(r,t,e,{deep:i&&i.deep,sync:i&&i.sync,filters:n&&n.filters,user:!i||i.user!==!1});return i&&i.immediate&&e.call(r,s.value),function(){s.teardown()}},t.prototype.$eval=function(t,e){if(lo.test(t)){var i=I(t),n=this.$get(i.expression,e);return i.filters?this._applyFilters(n,null,i.filters):n}return this.$get(t,e)},t.prototype.$interpolate=function(t){var e=V(t),i=this;return e?1===e.length?i.$eval(e[0].value)+"":e.map(function(t){return t.tag?i.$eval(t.value):t.value}).join(""):t},t.prototype.$log=function(t){var e=t?Bt(this._data,t):this._data;if(e&&(e=i(e)),!t){var n;for(n in this.$options.computed)e[n]=i(this[n]);if(this._props)for(n in this._props)e[n]=i(this[n])}console.log(e)}}function Ei(t){function e(t,e,n,r,s,o){e=i(e);var a=!X(e),h=r===!1||a?s:o,l=!a&&!t._isAttached&&!X(t.$el);return t._isFragment?(_t(t._fragmentStart,t._fragmentEnd,function(i){h(i,e,t)}),n&&n()):h(t.$el,e,t,n),l&&t._callHook("attached"),t}function i(t){return"string"==typeof t?document.querySelector(t):t}function n(t,e,i,n){e.appendChild(t),n&&n()}function r(t,e,i,n){et(t,e),n&&n()}function s(t,e,i){nt(t),i&&i()}t.prototype.$nextTick=function(t){ln(t,this)},t.prototype.$appendTo=function(t,i,r){return e(this,t,i,r,n,J)},t.prototype.$prependTo=function(t,e,n){return t=i(t),t.hasChildNodes()?this.$before(t.firstChild,e,n):this.$appendTo(t,e,n),this},t.prototype.$before=function(t,i,n){return e(this,t,i,n,r,q)},t.prototype.$after=function(t,e,n){return t=i(t),t.nextSibling?this.$before(t.nextSibling,e,n):this.$appendTo(t.parentNode,e,n),this},t.prototype.$remove=function(t,e){if(!this.$el.parentNode)return t&&t();var i=this._isAttached&&X(this.$el);i||(e=!1);var n=this,r=function(){i&&n._callHook("detached"),t&&t()};if(this._isFragment)yt(this._fragmentStart,this._fragmentEnd,this,this._fragment,r);else{var o=e===!1?s:Q;o(this.$el,this,r)}return this}}function Si(t){function e(t,e,n){var r=t.$parent;if(r&&n&&!i.test(e))for(;r;)r._eventsCount[e]=(r._eventsCount[e]||0)+n,r=r.$parent}t.prototype.$on=function(t,i){return(this._events[t]||(this._events[t]=[])).push(i),e(this,t,1),this},t.prototype.$once=function(t,e){function i(){n.$off(t,i),e.apply(this,arguments)}var n=this;return i.fn=e,this.$on(t,i),this},t.prototype.$off=function(t,i){var n;if(!arguments.length){if(this.$parent)for(t in this._events)n=this._events[t],n&&e(this,t,-n.length);return this._events={},this}if(n=this._events[t],!n)return this;if(1===arguments.length)return e(this,t,-n.length),this._events[t]=null,this;for(var r,s=n.length;s--;)if(r=n[s],r===i||r.fn===i){e(this,t,-1),n.splice(s,1);break}return this},t.prototype.$emit=function(t){var e="string"==typeof t;t=e?t:t.name;var i=this._events[t],n=e||!i;if(i){i=i.length>1?d(i):i;var r=e&&i.some(function(t){return t._fromParent});r&&(n=!1);for(var s=d(arguments,1),o=0,a=i.length;o<a;o++){var h=i[o],l=h.apply(this,s);l!==!0||r&&!h._fromParent||(n=!0)}}return n},t.prototype.$broadcast=function(t){var e="string"==typeof t;if(t=e?t:t.name,this._eventsCount[t]){var i=this.$children,n=d(arguments);e&&(n[0]={name:t,source:this});for(var r=0,s=i.length;r<s;r++){var o=i[r],a=o.$emit.apply(o,n);a&&o.$broadcast.apply(o,n)}return this}},t.prototype.$dispatch=function(t){var e=this.$emit.apply(this,arguments);if(e){var i=this.$parent,n=d(arguments);for(n[0]={name:t,source:this};i;)e=i.$emit.apply(i,n),i=e?i.$parent:null;return this}};var i=/^hook:/}function Fi(t){function e(){this._isAttached=!0,this._isReady=!0,this._callHook("ready")}t.prototype.$mount=function(t){if(!this._isCompiled)return t=Z(t),t||(t=document.createElement("div")),this._compile(t),this._initDOMHooks(),X(this.$el)?(this._callHook("attached"),e.call(this)):this.$once("hook:attached",e),this},t.prototype.$destroy=function(t,e){this._destroy(t,e)},t.prototype.$compile=function(t,e,i,n){return qe(t,this.$options,!0)(this,t,e,i,n)}}function Di(t){this._init(t)}function Pi(t,e,i){return i=i?parseInt(i,10):0,e=o(e),"number"==typeof e?t.slice(i,i+e):t}function Ri(t,e,i){if(t=po(t),null==e)return t;if("function"==typeof e)return t.filter(e);e=(""+e).toLowerCase();for(var n,r,s,o,a="in"===i?3:2,h=Array.prototype.concat.apply([],d(arguments,a)),l=[],c=0,u=t.length;c<u;c++)if(n=t[c],s=n&&n.$value||n,o=h.length){for(;o--;)if(r=h[o],"$key"===r&&Hi(n.$key,e)||Hi(Bt(s,r),e)){l.push(n);break}}else Hi(n,e)&&l.push(n);return l}function Li(t){function e(t,e,i){var r=n[i];return r&&("$key"!==r&&(m(t)&&"$value"in t&&(t=t.$value),m(e)&&"$value"in e&&(e=e.$value)),t=m(t)?Bt(t,r):t,e=m(e)?Bt(e,r):e),t===e?0:t>e?s:-s}var i=null,n=void 0;t=po(t);var r=d(arguments,1),s=r[r.length-1];"number"==typeof s?(s=s<0?-1:1,r=r.length>1?r.slice(0,-1):r):s=1;var o=r[0];return o?("function"==typeof o?i=function(t,e){return o(t,e)*s}:(n=Array.prototype.concat.apply([],r),i=function(t,r,s){return s=s||0,s>=n.length-1?e(t,r,s):e(t,r,s)||i(t,r,s+1)}),t.slice().sort(i)):t}function Hi(t,e){var i;if(g(t)){var n=Object.keys(t);for(i=n.length;i--;)if(Hi(t[n[i]],e))return!0}else if(qi(t)){for(i=t.length;i--;)if(Hi(t[i],e))return!0}else if(null!=t)return t.toString().toLowerCase().indexOf(e)>-1}function Ii(i){function n(t){return new Function("return function "+f(t)+" (options) { this._init(options) }")()}i.options={directives:Ds,elementDirectives:fo,filters:mo,transitions:{},components:{},partials:{},replace:!0},i.util=Kn,i.config=Mn,i.set=t,i.delete=e,i.nextTick=ln,i.compiler=ao,i.FragmentFactory=_e,i.internalDirectives=Ys,i.parsers={path:mr,text:Ln,template:qr,directive:En,expression:jr},i.cid=0;var r=1;i.extend=function(t){t=t||{};var e=this,i=0===e.cid;if(i&&t._Ctor)return t._Ctor;var s=t.name||e.options.name,o=n(s||"VueComponent");return o.prototype=Object.create(e.prototype),o.prototype.constructor=o,o.cid=r++,o.options=Nt(e.options,t),o.super=e,o.extend=e.extend,Mn._assetTypes.forEach(function(t){o[t]=e[t]}),s&&(o.options.components[s]=o),i&&(t._Ctor=o),o},i.use=function(t){if(!t.installed){var e=d(arguments,1);return e.unshift(this),"function"==typeof t.install?t.install.apply(t,e):t.apply(null,e),t.installed=!0,this}},i.mixin=function(t){i.options=Nt(i.options,t)},Mn._assetTypes.forEach(function(t){i[t]=function(e,n){return n?("component"===t&&g(n)&&(n.name||(n.name=e),n=i.extend(n)),this.options[t+"s"][e]=n,n):this.options[t+"s"][e]}}),v(i.transition,Vn)}var Mi=Object.prototype.hasOwnProperty,Wi=/^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/,Vi=/-(\w)/g,Bi=/([^-])([A-Z])/g,zi=/(?:^|[-_\/])(\w)/g,Ui=Object.prototype.toString,Ji="[object Object]",qi=Array.isArray,Qi="__proto__"in{},Gi="undefined"!=typeof window&&"[object Object]"!==Object.prototype.toString.call(window),Zi=Gi&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,Xi=Gi&&window.navigator.userAgent.toLowerCase(),Yi=Xi&&Xi.indexOf("trident")>0,Ki=Xi&&Xi.indexOf("msie 9.0")>0,tn=Xi&&Xi.indexOf("android")>0,en=Xi&&/iphone|ipad|ipod|ios/.test(Xi),nn=void 0,rn=void 0,sn=void 0,on=void 0;if(Gi&&!Ki){var an=void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend,hn=void 0===window.onanimationend&&void 0!==window.onwebkitanimationend;nn=an?"WebkitTransition":"transition",rn=an?"webkitTransitionEnd":"transitionend",sn=hn?"WebkitAnimation":"animation",on=hn?"webkitAnimationEnd":"animationend"}var ln=function(){function t(){i=!1;var t=e.slice(0);e.length=0;for(var n=0;n<t.length;n++)t[n]()}var e=[],i=!1,n=void 0;if("undefined"!=typeof Promise&&$(Promise)){var r=Promise.resolve(),s=function(){};n=function(){r.then(t),en&&setTimeout(s)}}else if("undefined"!=typeof MutationObserver){var o=1,a=new MutationObserver(t),h=document.createTextNode(String(o));a.observe(h,{characterData:!0}),n=function(){o=(o+1)%2,h.data=String(o)}}else n=setTimeout;return function(r,s){var o=s?function(){r.call(s)}:r;e.push(o),i||(i=!0,n(t,0))}}(),cn=void 0;"undefined"!=typeof Set&&$(Set)?cn=Set:(cn=function(){this.set=Object.create(null)},cn.prototype.has=function(t){return void 0!==this.set[t]},cn.prototype.add=function(t){this.set[t]=1},cn.prototype.clear=function(){this.set=Object.create(null)});var un=k.prototype;un.put=function(t,e){var i,n=this.get(t,!0);return n||(this.size===this.limit&&(i=this.shift()),n={key:t},this._keymap[t]=n,this.tail?(this.tail.newer=n,n.older=this.tail):this.head=n,this.tail=n,this.size++),n.value=e,i},un.shift=function(){var t=this.head;return t&&(this.head=this.head.newer,this.head.older=void 0,t.newer=t.older=void 0,this._keymap[t.key]=void 0,this.size--),t},un.get=function(t,e){var i=this._keymap[t];if(void 0!==i)return i===this.tail?e?i:i.value:(i.newer&&(i===this.head&&(this.head=i.newer),i.newer.older=i.older),i.older&&(i.older.newer=i.newer),i.newer=void 0,i.older=this.tail,this.tail&&(this.tail.newer=i),this.tail=i,e?i:i.value)};var fn,pn,dn,vn,mn,gn,_n=new k(1e3),yn=/^in$|^-?\d+/,bn=0,wn=1,Cn=2,$n=3,kn=34,xn=39,An=124,On=92,Tn=32,Nn={91:1,123:1,40:1},jn={91:93,123:125,40:41},En=Object.freeze({parseDirective:I}),Sn=/[-.*+?^${}()|[\]\/\\]/g,Fn=void 0,Dn=void 0,Pn=void 0,Rn=/[^|]\|[^|]/,Ln=Object.freeze({compileRegex:W,parseText:V,tokensToExp:B}),Hn=["{{","}}"],In=["{{{","}}}"],Mn=Object.defineProperties({debug:!1,silent:!1,async:!0,warnExpressionErrors:!0,devtools:!1,_delimitersChanged:!0,_assetTypes:["component","directive","elementDirective","filter","transition","partial"],_propBindingModes:{ONE_WAY:0,TWO_WAY:1,ONE_TIME:2},_maxUpdateCount:100},{delimiters:{get:function(){return Hn},set:function(t){Hn=t,W()},configurable:!0,enumerable:!0},unsafeDelimiters:{get:function(){return In},set:function(t){In=t,W()},configurable:!0,enumerable:!0}}),Wn=void 0,Vn=Object.freeze({appendWithTransition:J,beforeWithTransition:q,removeWithTransition:Q,applyTransition:G}),Bn=/^v-ref:/,zn=/^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i,Un=/^(slot|partial|component)$/i,Jn=Mn.optionMergeStrategies=Object.create(null);Jn.data=function(t,e,i){return i?t||e?function(){var n="function"==typeof e?e.call(i):e,r="function"==typeof t?t.call(i):void 0;return n?kt(n,r):r}:void 0:e?"function"!=typeof e?t:t?function(){return kt(e.call(this),t.call(this))}:e:t},Jn.el=function(t,e,i){if(i||!e||"function"==typeof e){var n=e||t;return i&&"function"==typeof n?n.call(i):n}},Jn.init=Jn.created=Jn.ready=Jn.attached=Jn.detached=Jn.beforeCompile=Jn.compiled=Jn.beforeDestroy=Jn.destroyed=Jn.activate=function(t,e){return e?t?t.concat(e):qi(e)?e:[e]:t},Mn._assetTypes.forEach(function(t){Jn[t+"s"]=xt}),Jn.watch=Jn.events=function(t,e){if(!e)return t;if(!t)return e;var i={};v(i,t);for(var n in e){var r=i[n],s=e[n];r&&!qi(r)&&(r=[r]),i[n]=r?r.concat(s):[s]}return i},Jn.props=Jn.methods=Jn.computed=function(t,e){if(!e)return t;if(!t)return e;var i=Object.create(null);return v(i,t),v(i,e),i};var qn=function(t,e){return void 0===e?t:e},Qn=0;Et.target=null,Et.prototype.addSub=function(t){this.subs.push(t)},Et.prototype.removeSub=function(t){this.subs.$remove(t)},Et.prototype.depend=function(){Et.target.addDep(this)},Et.prototype.notify=function(){for(var t=d(this.subs),e=0,i=t.length;e<i;e++)t[e].update()};var Gn=Array.prototype,Zn=Object.create(Gn);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(t){var e=Gn[t];_(Zn,t,function(){for(var i=arguments.length,n=new Array(i);i--;)n[i]=arguments[i];var r,s=e.apply(this,n),o=this.__ob__;switch(t){case"push":r=n;break;case"unshift":r=n;break;case"splice":r=n.slice(2)}return r&&o.observeArray(r),o.dep.notify(),s})}),_(Gn,"$set",function(t,e){return t>=this.length&&(this.length=Number(t)+1),this.splice(t,1,e)[0]}),_(Gn,"$remove",function(t){if(this.length){var e=b(this,t);return e>-1?this.splice(e,1):void 0}});var Xn=Object.getOwnPropertyNames(Zn),Yn=!0;Ft.prototype.walk=function(t){for(var e=Object.keys(t),i=0,n=e.length;i<n;i++)this.convert(e[i],t[e[i]])},Ft.prototype.observeArray=function(t){for(var e=0,i=t.length;e<i;e++)Rt(t[e])},Ft.prototype.convert=function(t,e){Lt(this.value,t,e)},Ft.prototype.addVm=function(t){(this.vms||(this.vms=[])).push(t)},Ft.prototype.removeVm=function(t){this.vms.$remove(t)};var Kn=Object.freeze({defineReactive:Lt,set:t,del:e,hasOwn:i,isLiteral:n,isReserved:r,_toString:s,toNumber:o,toBoolean:a,stripQuotes:h,camelize:l,hyphenate:u,classify:f,bind:p,toArray:d,extend:v,isObject:m,isPlainObject:g,def:_,debounce:y,indexOf:b,cancellable:w,looseEqual:C,isArray:qi,hasProto:Qi,inBrowser:Gi,devtools:Zi,isIE:Yi,isIE9:Ki,isAndroid:tn,isIOS:en,get transitionProp(){return nn},get transitionEndEvent(){return rn},get animationProp(){return sn},get animationEndEvent(){return on},nextTick:ln,get _Set(){return cn},query:Z,inDoc:X,getAttr:Y,getBindAttr:K,hasBindAttr:tt,before:et,after:it,remove:nt,prepend:rt,replace:st,on:ot,off:at,setClass:lt,addClass:ct,removeClass:ut,extractContent:ft,trimNode:pt,isTemplate:vt,createAnchor:mt,findRef:gt,mapNodeRange:_t,removeNodeRange:yt,isFragment:bt,getOuterHTML:wt,mergeOptions:Nt,resolveAsset:jt,checkComponentAttr:Ct,commonTagRE:zn,reservedTagRE:Un,warn:Wn}),tr=0,er=new k(1e3),ir=0,nr=1,rr=2,sr=3,or=0,ar=1,hr=2,lr=3,cr=4,ur=5,fr=6,pr=7,dr=8,vr=[];vr[or]={ws:[or],ident:[lr,ir],"[":[cr],eof:[pr]},vr[ar]={ws:[ar],".":[hr],"[":[cr],eof:[pr]},vr[hr]={ws:[hr],ident:[lr,ir]},vr[lr]={ident:[lr,ir],0:[lr,ir],number:[lr,ir],ws:[ar,nr],".":[hr,nr],"[":[cr,nr],eof:[pr,nr]},vr[cr]={"'":[ur,ir],'"':[fr,ir],"[":[cr,rr],"]":[ar,sr],eof:dr,else:[cr,ir]},vr[ur]={"'":[cr,ir],eof:dr,else:[ur,ir]},vr[fr]={'"':[cr,ir],eof:dr,else:[fr,ir]};var mr=Object.freeze({parsePath:Vt,getPath:Bt,setPath:zt}),gr=new k(1e3),_r="Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat",yr=new RegExp("^("+_r.replace(/,/g,"\\b|")+"\\b)"),br="break,case,class,catch,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,in,instanceof,let,return,super,switch,throw,try,var,while,with,yield,enum,await,implements,package,protected,static,interface,private,public",wr=new RegExp("^("+br.replace(/,/g,"\\b|")+"\\b)"),Cr=/\s/g,$r=/\n/g,kr=/[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\"']|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g,xr=/"(\d+)"/g,Ar=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,Or=/[^\w$\.](?:[A-Za-z_$][\w$]*)/g,Tr=/^(?:true|false|null|undefined|Infinity|NaN)$/,Nr=[],jr=Object.freeze({parseExpression:Yt,isSimplePath:Kt}),Er=[],Sr=[],Fr={},Dr={},Pr=!1,Rr=0;re.prototype.get=function(){this.beforeGet();var t,e=this.scope||this.vm;try{t=this.getter.call(e,e)}catch(t){}return this.deep&&se(t),this.preProcess&&(t=this.preProcess(t)),this.filters&&(t=e._applyFilters(t,null,this.filters,!1)),this.postProcess&&(t=this.postProcess(t)),this.afterGet(),t},re.prototype.set=function(t){var e=this.scope||this.vm;this.filters&&(t=e._applyFilters(t,this.value,this.filters,!0));try{this.setter.call(e,e,t)}catch(t){}var i=e.$forContext;if(i&&i.alias===this.expression){if(i.filters)return;i._withLock(function(){e.$key?i.rawValue[e.$key]=t:i.rawValue.$set(e.$index,t)})}},re.prototype.beforeGet=function(){Et.target=this},re.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))},re.prototype.afterGet=function(){Et.target=null;for(var t=this.deps.length;t--;){var e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}var i=this.depIds;this.depIds=this.newDepIds,this.newDepIds=i,this.newDepIds.clear(),i=this.deps,this.deps=this.newDeps,this.newDeps=i,this.newDeps.length=0},re.prototype.update=function(t){this.lazy?this.dirty=!0:this.sync||!Mn.async?this.run():(this.shallow=this.queued?!!t&&this.shallow:!!t,this.queued=!0,ne(this))},re.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||(m(t)||this.deep)&&!this.shallow){var e=this.value;this.value=t;this.prevError;this.cb.call(this.vm,t,e)}this.queued=this.shallow=!1}},re.prototype.evaluate=function(){var t=Et.target;this.value=this.get(),this.dirty=!1,Et.target=t},re.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},re.prototype.teardown=function(){if(this.active){this.vm._isBeingDestroyed||this.vm._vForRemoving||this.vm._watchers.$remove(this);for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1,this.vm=this.cb=this.value=null}};var Lr=new cn,Hr={bind:function(){this.attr=3===this.el.nodeType?"data":"textContent"},update:function(t){this.el[this.attr]=s(t)}},Ir=new k(1e3),Mr=new k(1e3),Wr={efault:[0,"",""],legend:[1,"<fieldset>","</fieldset>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]};Wr.td=Wr.th=[3,"<table><tbody><tr>","</tr></tbody></table>"],Wr.option=Wr.optgroup=[1,'<select multiple="multiple">',"</select>"],Wr.thead=Wr.tbody=Wr.colgroup=Wr.caption=Wr.tfoot=[1,"<table>","</table>"],Wr.g=Wr.defs=Wr.symbol=Wr.use=Wr.image=Wr.text=Wr.circle=Wr.ellipse=Wr.line=Wr.path=Wr.polygon=Wr.polyline=Wr.rect=[1,'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events"version="1.1">',"</svg>"];var Vr=/<([\w:-]+)/,Br=/&#?\w+?;/,zr=/<!--/,Ur=function(){if(Gi){var t=document.createElement("div");return t.innerHTML="<template>1</template>",!t.cloneNode(!0).firstChild.innerHTML}return!1}(),Jr=function(){if(Gi){var t=document.createElement("textarea");return t.placeholder="t","t"===t.cloneNode(!0).value}return!1}(),qr=Object.freeze({cloneNode:le,parseTemplate:ce}),Qr={bind:function(){8===this.el.nodeType&&(this.nodes=[],this.anchor=mt("v-html"),st(this.el,this.anchor))},update:function(t){t=s(t),this.nodes?this.swap(t):this.el.innerHTML=t},swap:function(t){for(var e=this.nodes.length;e--;)nt(this.nodes[e]);var i=ce(t,!0,!0);this.nodes=d(i.childNodes),et(i,this.anchor)}};ue.prototype.callHook=function(t){var e,i;for(e=0,i=this.childFrags.length;e<i;e++)this.childFrags[e].callHook(t);for(e=0,i=this.children.length;e<i;e++)t(this.children[e])},ue.prototype.beforeRemove=function(){var t,e;for(t=0,e=this.childFrags.length;t<e;t++)this.childFrags[t].beforeRemove(!1);for(t=0,e=this.children.length;t<e;t++)this.children[t].$destroy(!1,!0);var i=this.unlink.dirs;for(t=0,e=i.length;t<e;t++)i[t]._watcher&&i[t]._watcher.teardown()},ue.prototype.destroy=function(){this.parentFrag&&this.parentFrag.childFrags.$remove(this),this.node.__v_frag=null,this.unlink()};var Gr=new k(5e3);_e.prototype.create=function(t,e,i){var n=le(this.template);return new ue(this.linker,this.vm,n,t,e,i)};var Zr=700,Xr=800,Yr=850,Kr=1100,ts=1500,es=1500,is=1750,ns=2100,rs=2200,ss=2300,os=0,as={priority:rs,terminal:!0,params:["track-by","stagger","enter-stagger","leave-stagger"],bind:function(){var t=this.expression.match(/(.*) (?:in|of) (.*)/);if(t){var e=t[1].match(/\((.*),(.*)\)/);e?(this.iterator=e[1].trim(),this.alias=e[2].trim()):this.alias=t[1].trim(),this.expression=t[2]}if(this.alias){this.id="__v-for__"+ ++os;var i=this.el.tagName;this.isOption=("OPTION"===i||"OPTGROUP"===i)&&"SELECT"===this.el.parentNode.tagName,this.start=mt("v-for-start"),this.end=mt("v-for-end"),st(this.el,this.end),et(this.start,this.end),this.cache=Object.create(null),this.factory=new _e(this.vm,this.el)}},update:function(t){this.diff(t),this.updateRef(),this.updateModel()},diff:function(t){var e,n,r,s,o,a,h=t[0],l=this.fromObject=m(h)&&i(h,"$key")&&i(h,"$value"),c=this.params.trackBy,u=this.frags,f=this.frags=new Array(t.length),p=this.alias,d=this.iterator,v=this.start,g=this.end,_=X(v),y=!u;for(e=0,n=t.length;e<n;e++)h=t[e],s=l?h.$key:null,o=l?h.$value:h,a=!m(o),r=!y&&this.getCachedFrag(o,e,s),r?(r.reused=!0,r.scope.$index=e,s&&(r.scope.$key=s),d&&(r.scope[d]=null!==s?s:e),(c||l||a)&&St(function(){r.scope[p]=o})):(r=this.create(o,p,e,s),r.fresh=!y),f[e]=r,y&&r.before(g);if(!y){var b=0,w=u.length-f.length;for(this.vm._vForRemoving=!0,e=0,n=u.length;e<n;e++)r=u[e],r.reused||(this.deleteCachedFrag(r),this.remove(r,b++,w,_));this.vm._vForRemoving=!1,b&&(this.vm._watchers=this.vm._watchers.filter(function(t){return t.active}));var C,$,k,x=0;for(e=0,n=f.length;e<n;e++)r=f[e],C=f[e-1],$=C?C.staggerCb?C.staggerAnchor:C.end||C.node:v,r.reused&&!r.staggerCb?(k=ye(r,v,this.id),k===C||k&&ye(k,v,this.id)===C||this.move(r,$)):this.insert(r,x++,$,_),r.reused=r.fresh=!1}},create:function(t,e,i,n){var r=this._host,s=this._scope||this.vm,o=Object.create(s);o.$refs=Object.create(s.$refs),o.$els=Object.create(s.$els),o.$parent=s,o.$forContext=this,St(function(){Lt(o,e,t)}),Lt(o,"$index",i),n?Lt(o,"$key",n):o.$key&&_(o,"$key",null),this.iterator&&Lt(o,this.iterator,null!==n?n:i);var a=this.factory.create(r,o,this._frag);return a.forId=this.id,this.cacheFrag(t,a,i,n),a},updateRef:function(){var t=this.descriptor.ref;if(t){var e,i=(this._scope||this.vm).$refs;this.fromObject?(e={},this.frags.forEach(function(t){e[t.scope.$key]=Ce(t)})):e=this.frags.map(Ce),i[t]=e}},updateModel:function(){if(this.isOption){var t=this.start.parentNode,e=t&&t.__v_model;e&&e.forceUpdate()}},insert:function(t,e,i,n){t.staggerCb&&(t.staggerCb.cancel(),t.staggerCb=null);var r=this.getStagger(t,e,null,"enter");if(n&&r){var s=t.staggerAnchor;s||(s=t.staggerAnchor=mt("stagger-anchor"),s.__v_frag=t),it(s,i);var o=t.staggerCb=w(function(){t.staggerCb=null,t.before(s),nt(s)});setTimeout(o,r)}else{var a=i.nextSibling;a||(it(this.end,i),a=this.end),t.before(a)}},remove:function(t,e,i,n){if(t.staggerCb)return t.staggerCb.cancel(),void(t.staggerCb=null);var r=this.getStagger(t,e,i,"leave");if(n&&r){var s=t.staggerCb=w(function(){t.staggerCb=null,t.remove()});setTimeout(s,r)}else t.remove()},move:function(t,e){e.nextSibling||this.end.parentNode.appendChild(this.end),t.before(e.nextSibling,!1)},cacheFrag:function(t,e,n,r){var s,o=this.params.trackBy,a=this.cache,h=!m(t);r||o||h?(s=we(n,r,t,o),a[s]||(a[s]=e)):(s=this.id,i(t,s)?null===t[s]&&(t[s]=e):Object.isExtensible(t)&&_(t,s,e)),e.raw=t},getCachedFrag:function(t,e,i){var n,r=this.params.trackBy,s=!m(t);if(i||r||s){var o=we(e,i,t,r);n=this.cache[o]}else n=t[this.id];return n&&(n.reused||n.fresh),n},deleteCachedFrag:function(t){var e=t.raw,n=this.params.trackBy,r=t.scope,s=r.$index,o=i(r,"$key")&&r.$key,a=!m(e);if(n||o||a){var h=we(s,o,e,n);this.cache[h]=null}else e[this.id]=null,t.raw=null},getStagger:function(t,e,i,n){n+="Stagger";var r=t.node.__v_trans,s=r&&r.hooks,o=s&&(s[n]||s.stagger);return o?o.call(t,e,i):e*parseInt(this.params[n]||this.params.stagger,10)},_preProcess:function(t){return this.rawValue=t,t},_postProcess:function(t){if(qi(t))return t;if(g(t)){for(var e,i=Object.keys(t),n=i.length,r=new Array(n);n--;)e=i[n],r[n]={$key:e,$value:t[e]};return r}return"number"!=typeof t||isNaN(t)||(t=be(t)),t||[]},unbind:function(){if(this.descriptor.ref&&((this._scope||this.vm).$refs[this.descriptor.ref]=null),this.frags)for(var t,e=this.frags.length;e--;)t=this.frags[e],this.deleteCachedFrag(t),t.destroy()}},hs={priority:ns,terminal:!0,bind:function(){var t=this.el;if(t.__vue__)this.invalid=!0;else{var e=t.nextElementSibling;e&&null!==Y(e,"v-else")&&(nt(e),this.elseEl=e),this.anchor=mt("v-if"),st(t,this.anchor)}},update:function(t){this.invalid||(t?this.frag||this.insert():this.remove())},insert:function(){this.elseFrag&&(this.elseFrag.remove(),this.elseFrag=null),this.factory||(this.factory=new _e(this.vm,this.el)),this.frag=this.factory.create(this._host,this._scope,this._frag),this.frag.before(this.anchor)},remove:function(){this.frag&&(this.frag.remove(),this.frag=null),this.elseEl&&!this.elseFrag&&(this.elseFactory||(this.elseFactory=new _e(this.elseEl._context||this.vm,this.elseEl)),this.elseFrag=this.elseFactory.create(this._host,this._scope,this._frag),this.elseFrag.before(this.anchor))},unbind:function(){this.frag&&this.frag.destroy(),this.elseFrag&&this.elseFrag.destroy()}},ls={bind:function(){var t=this.el.nextElementSibling;t&&null!==Y(t,"v-else")&&(this.elseEl=t)},update:function(t){this.apply(this.el,t),this.elseEl&&this.apply(this.elseEl,!t)},apply:function(t,e){function i(){t.style.display=e?"":"none"}X(t)?G(t,e?1:-1,i,this.vm):i()}},cs={bind:function(){var t=this,e=this.el,i="range"===e.type,n=this.params.lazy,r=this.params.number,s=this.params.debounce,a=!1;if(tn||i||(this.on("compositionstart",function(){a=!0}),this.on("compositionend",function(){a=!1,n||t.listener()})),this.focused=!1,i||n||(this.on("focus",function(){t.focused=!0}),this.on("blur",function(){t.focused=!1,t._frag&&!t._frag.inserted||t.rawListener()})),this.listener=this.rawListener=function(){if(!a&&t._bound){var n=r||i?o(e.value):e.value;t.set(n),ln(function(){t._bound&&!t.focused&&t.update(t._watcher.value)})}},s&&(this.listener=y(this.listener,s)),this.hasjQuery="function"==typeof jQuery,this.hasjQuery){var h=jQuery.fn.on?"on":"bind";jQuery(e)[h]("change",this.rawListener),n||jQuery(e)[h]("input",this.listener)}else this.on("change",this.rawListener),n||this.on("input",this.listener);!n&&Ki&&(this.on("cut",function(){ln(t.listener)}),this.on("keyup",function(e){46!==e.keyCode&&8!==e.keyCode||t.listener()})),(e.hasAttribute("value")||"TEXTAREA"===e.tagName&&e.value.trim())&&(this.afterBind=this.listener)},update:function(t){t=s(t),t!==this.el.value&&(this.el.value=t)},unbind:function(){var t=this.el;if(this.hasjQuery){var e=jQuery.fn.off?"off":"unbind";jQuery(t)[e]("change",this.listener),jQuery(t)[e]("input",this.listener)}}},us={bind:function(){var t=this,e=this.el;this.getValue=function(){if(e.hasOwnProperty("_value"))return e._value;var i=e.value;return t.params.number&&(i=o(i)),i},this.listener=function(){t.set(t.getValue())},this.on("change",this.listener),e.hasAttribute("checked")&&(this.afterBind=this.listener)},update:function(t){this.el.checked=C(t,this.getValue())}},fs={bind:function(){var t=this,e=this,i=this.el;this.forceUpdate=function(){e._watcher&&e.update(e._watcher.get())};var n=this.multiple=i.hasAttribute("multiple");this.listener=function(){var t=$e(i,n);t=e.params.number?qi(t)?t.map(o):o(t):t,e.set(t)},this.on("change",this.listener);var r=$e(i,n,!0);(n&&r.length||!n&&null!==r)&&(this.afterBind=this.listener),this.vm.$on("hook:attached",function(){ln(t.forceUpdate)}),X(i)||ln(this.forceUpdate)},update:function(t){var e=this.el;e.selectedIndex=-1;for(var i,n,r=this.multiple&&qi(t),s=e.options,o=s.length;o--;)i=s[o],n=i.hasOwnProperty("_value")?i._value:i.value,i.selected=r?ke(t,n)>-1:C(t,n)},unbind:function(){this.vm.$off("hook:attached",this.forceUpdate)}},ps={bind:function(){function t(){var t=i.checked;return t&&i.hasOwnProperty("_trueValue")?i._trueValue:!t&&i.hasOwnProperty("_falseValue")?i._falseValue:t}var e=this,i=this.el;this.getValue=function(){return i.hasOwnProperty("_value")?i._value:e.params.number?o(i.value):i.value},this.listener=function(){var n=e._watcher.get();if(qi(n)){var r=e.getValue(),s=b(n,r);i.checked?s<0&&e.set(n.concat(r)):s>-1&&e.set(n.slice(0,s).concat(n.slice(s+1)))}else e.set(t())},this.on("change",this.listener),i.hasAttribute("checked")&&(this.afterBind=this.listener)},update:function(t){var e=this.el;qi(t)?e.checked=b(t,this.getValue())>-1:e.hasOwnProperty("_trueValue")?e.checked=C(t,e._trueValue):e.checked=!!t}},ds={text:cs,radio:us,select:fs,checkbox:ps},vs={priority:Xr,twoWay:!0,handlers:ds,params:["lazy","number","debounce"],bind:function(){this.checkFilters(),this.hasRead&&!this.hasWrite;var t,e=this.el,i=e.tagName;if("INPUT"===i)t=ds[e.type]||ds.text;else if("SELECT"===i)t=ds.select;else{if("TEXTAREA"!==i)return;t=ds.text}e.__v_model=this,t.bind.call(this),this.update=t.update,this._unbind=t.unbind},checkFilters:function(){var t=this.filters;if(t)for(var e=t.length;e--;){var i=jt(this.vm.$options,"filters",t[e].name);("function"==typeof i||i.read)&&(this.hasRead=!0),i.write&&(this.hasWrite=!0)}},unbind:function(){this.el.__v_model=null,this._unbind&&this._unbind()}},ms={esc:27,tab:9,enter:13,space:32,delete:[8,46],up:38,left:37,right:39,down:40},gs={priority:Zr,acceptStatement:!0,keyCodes:ms,bind:function(){if("IFRAME"===this.el.tagName&&"load"!==this.arg){var t=this;this.iframeBind=function(){ot(t.el.contentWindow,t.arg,t.handler,t.modifiers.capture)},this.on("load",this.iframeBind)}},update:function(t){if(this.descriptor.raw||(t=function(){}),"function"==typeof t){this.modifiers.stop&&(t=Ae(t)),this.modifiers.prevent&&(t=Oe(t)),this.modifiers.self&&(t=Te(t));var e=Object.keys(this.modifiers).filter(function(t){return"stop"!==t&&"prevent"!==t&&"self"!==t&&"capture"!==t});e.length&&(t=xe(t,e)),this.reset(),this.handler=t,this.iframeBind?this.iframeBind():ot(this.el,this.arg,this.handler,this.modifiers.capture)}},reset:function(){var t=this.iframeBind?this.el.contentWindow:this.el;this.handler&&at(t,this.arg,this.handler)},unbind:function(){this.reset()}},_s=["-webkit-","-moz-","-ms-"],ys=["Webkit","Moz","ms"],bs=/!important;?$/,ws=Object.create(null),Cs=null,$s={deep:!0,update:function(t){"string"==typeof t?this.el.style.cssText=t:qi(t)?this.handleObject(t.reduce(v,{})):this.handleObject(t||{})},handleObject:function(t){var e,i,n=this.cache||(this.cache={});for(e in n)e in t||(this.handleSingle(e,null),delete n[e]);for(e in t)i=t[e],i!==n[e]&&(n[e]=i,this.handleSingle(e,i))},handleSingle:function(t,e){if(t=Ne(t))if(null!=e&&(e+=""),e){var i=bs.test(e)?"important":"";i?(e=e.replace(bs,"").trim(),this.el.style.setProperty(t.kebab,e,i)):this.el.style[t.camel]=e;
}else this.el.style[t.camel]=""}},ks="http://www.w3.org/1999/xlink",xs=/^xlink:/,As=/^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/,Os=/^(?:value|checked|selected|muted)$/,Ts=/^(?:draggable|contenteditable|spellcheck)$/,Ns={value:"_value","true-value":"_trueValue","false-value":"_falseValue"},js={priority:Yr,bind:function(){var t=this.arg,e=this.el.tagName;t||(this.deep=!0);var i=this.descriptor,n=i.interp;n&&(i.hasOneTime&&(this.expression=B(n,this._scope||this.vm)),(As.test(t)||"name"===t&&("PARTIAL"===e||"SLOT"===e))&&(this.el.removeAttribute(t),this.invalid=!0))},update:function(t){if(!this.invalid){var e=this.arg;this.arg?this.handleSingle(e,t):this.handleObject(t||{})}},handleObject:$s.handleObject,handleSingle:function(t,e){var i=this.el,n=this.descriptor.interp;if(this.modifiers.camel&&(t=l(t)),!n&&Os.test(t)&&t in i){var r="value"===t&&null==e?"":e;i[t]!==r&&(i[t]=r)}var s=Ns[t];if(!n&&s){i[s]=e;var o=i.__v_model;o&&o.listener()}return"value"===t&&"TEXTAREA"===i.tagName?void i.removeAttribute(t):void(Ts.test(t)?i.setAttribute(t,e?"true":"false"):null!=e&&e!==!1?"class"===t?(i.__v_trans&&(e+=" "+i.__v_trans.id+"-transition"),lt(i,e)):xs.test(t)?i.setAttributeNS(ks,t,e===!0?"":e):i.setAttribute(t,e===!0?"":e):i.removeAttribute(t))}},Es={priority:ts,bind:function(){if(this.arg){var t=this.id=l(this.arg),e=(this._scope||this.vm).$els;i(e,t)?e[t]=this.el:Lt(e,t,this.el)}},unbind:function(){var t=(this._scope||this.vm).$els;t[this.id]===this.el&&(t[this.id]=null)}},Ss={bind:function(){}},Fs={bind:function(){var t=this.el;this.vm.$once("pre-hook:compiled",function(){t.removeAttribute("v-cloak")})}},Ds={text:Hr,html:Qr,for:as,if:hs,show:ls,model:vs,on:gs,bind:js,el:Es,ref:Ss,cloak:Fs},Ps={deep:!0,update:function(t){t?"string"==typeof t?this.setClass(t.trim().split(/\s+/)):this.setClass(Ee(t)):this.cleanup()},setClass:function(t){this.cleanup(t);for(var e=0,i=t.length;e<i;e++){var n=t[e];n&&Se(this.el,n,ct)}this.prevKeys=t},cleanup:function(t){var e=this.prevKeys;if(e)for(var i=e.length;i--;){var n=e[i];(!t||t.indexOf(n)<0)&&Se(this.el,n,ut)}}},Rs={priority:es,params:["keep-alive","transition-mode","inline-template"],bind:function(){this.el.__vue__||(this.keepAlive=this.params.keepAlive,this.keepAlive&&(this.cache={}),this.params.inlineTemplate&&(this.inlineTemplate=ft(this.el,!0)),this.pendingComponentCb=this.Component=null,this.pendingRemovals=0,this.pendingRemovalCb=null,this.anchor=mt("v-component"),st(this.el,this.anchor),this.el.removeAttribute("is"),this.el.removeAttribute(":is"),this.descriptor.ref&&this.el.removeAttribute("v-ref:"+u(this.descriptor.ref)),this.literal&&this.setComponent(this.expression))},update:function(t){this.literal||this.setComponent(t)},setComponent:function(t,e){if(this.invalidatePending(),t){var i=this;this.resolveComponent(t,function(){i.mountComponent(e)})}else this.unbuild(!0),this.remove(this.childVM,e),this.childVM=null},resolveComponent:function(t,e){var i=this;this.pendingComponentCb=w(function(n){i.ComponentName=n.options.name||("string"==typeof t?t:null),i.Component=n,e()}),this.vm._resolveComponent(t,this.pendingComponentCb)},mountComponent:function(t){this.unbuild(!0);var e=this,i=this.Component.options.activate,n=this.getCached(),r=this.build();i&&!n?(this.waitingFor=r,Fe(i,r,function(){e.waitingFor===r&&(e.waitingFor=null,e.transition(r,t))})):(n&&r._updateRef(),this.transition(r,t))},invalidatePending:function(){this.pendingComponentCb&&(this.pendingComponentCb.cancel(),this.pendingComponentCb=null)},build:function(t){var e=this.getCached();if(e)return e;if(this.Component){var i={name:this.ComponentName,el:le(this.el),template:this.inlineTemplate,parent:this._host||this.vm,_linkerCachable:!this.inlineTemplate,_ref:this.descriptor.ref,_asComponent:!0,_isRouterView:this._isRouterView,_context:this.vm,_scope:this._scope,_frag:this._frag};t&&v(i,t);var n=new this.Component(i);return this.keepAlive&&(this.cache[this.Component.cid]=n),n}},getCached:function(){return this.keepAlive&&this.cache[this.Component.cid]},unbuild:function(t){this.waitingFor&&(this.keepAlive||this.waitingFor.$destroy(),this.waitingFor=null);var e=this.childVM;return!e||this.keepAlive?void(e&&(e._inactive=!0,e._updateRef(!0))):void e.$destroy(!1,t)},remove:function(t,e){var i=this.keepAlive;if(t){this.pendingRemovals++,this.pendingRemovalCb=e;var n=this;t.$remove(function(){n.pendingRemovals--,i||t._cleanup(),!n.pendingRemovals&&n.pendingRemovalCb&&(n.pendingRemovalCb(),n.pendingRemovalCb=null)})}else e&&e()},transition:function(t,e){var i=this,n=this.childVM;switch(n&&(n._inactive=!0),t._inactive=!1,this.childVM=t,i.params.transitionMode){case"in-out":t.$before(i.anchor,function(){i.remove(n,e)});break;case"out-in":i.remove(n,function(){t.$before(i.anchor,e)});break;default:i.remove(n),t.$before(i.anchor,e)}},unbind:function(){if(this.invalidatePending(),this.unbuild(),this.cache){for(var t in this.cache)this.cache[t].$destroy();this.cache=null}}},Ls=Mn._propBindingModes,Hs={},Is=/^[$_a-zA-Z]+[\w$]*$/,Ms=Mn._propBindingModes,Ws={bind:function(){var t=this.vm,e=t._context,i=this.descriptor.prop,n=i.path,r=i.parentPath,s=i.mode===Ms.TWO_WAY,o=this.parentWatcher=new re(e,r,function(e){He(t,i,e)},{twoWay:s,filters:i.filters,scope:this._scope});if(Le(t,i,o.value),s){var a=this;t.$once("pre-hook:created",function(){a.childWatcher=new re(t,n,function(t){o.set(t)},{sync:!0})})}},unbind:function(){this.parentWatcher.teardown(),this.childWatcher&&this.childWatcher.teardown()}},Vs=[],Bs=!1,zs="transition",Us="animation",Js=nn+"Duration",qs=sn+"Duration",Qs=Gi&&window.requestAnimationFrame,Gs=Qs?function(t){Qs(function(){Qs(t)})}:function(t){setTimeout(t,50)},Zs=Ue.prototype;Zs.enter=function(t,e){this.cancelPending(),this.callHook("beforeEnter"),this.cb=e,ct(this.el,this.enterClass),t(),this.entered=!1,this.callHookWithCb("enter"),this.entered||(this.cancel=this.hooks&&this.hooks.enterCancelled,Be(this.enterNextTick))},Zs.enterNextTick=function(){var t=this;this.justEntered=!0,Gs(function(){t.justEntered=!1});var e=this.enterDone,i=this.getCssTransitionType(this.enterClass);this.pendingJsCb?i===zs&&ut(this.el,this.enterClass):i===zs?(ut(this.el,this.enterClass),this.setupCssCb(rn,e)):i===Us?this.setupCssCb(on,e):e()},Zs.enterDone=function(){this.entered=!0,this.cancel=this.pendingJsCb=null,ut(this.el,this.enterClass),this.callHook("afterEnter"),this.cb&&this.cb()},Zs.leave=function(t,e){this.cancelPending(),this.callHook("beforeLeave"),this.op=t,this.cb=e,ct(this.el,this.leaveClass),this.left=!1,this.callHookWithCb("leave"),this.left||(this.cancel=this.hooks&&this.hooks.leaveCancelled,this.op&&!this.pendingJsCb&&(this.justEntered?this.leaveDone():Be(this.leaveNextTick)))},Zs.leaveNextTick=function(){var t=this.getCssTransitionType(this.leaveClass);if(t){var e=t===zs?rn:on;this.setupCssCb(e,this.leaveDone)}else this.leaveDone()},Zs.leaveDone=function(){this.left=!0,this.cancel=this.pendingJsCb=null,this.op(),ut(this.el,this.leaveClass),this.callHook("afterLeave"),this.cb&&this.cb(),this.op=null},Zs.cancelPending=function(){this.op=this.cb=null;var t=!1;this.pendingCssCb&&(t=!0,at(this.el,this.pendingCssEvent,this.pendingCssCb),this.pendingCssEvent=this.pendingCssCb=null),this.pendingJsCb&&(t=!0,this.pendingJsCb.cancel(),this.pendingJsCb=null),t&&(ut(this.el,this.enterClass),ut(this.el,this.leaveClass)),this.cancel&&(this.cancel.call(this.vm,this.el),this.cancel=null)},Zs.callHook=function(t){this.hooks&&this.hooks[t]&&this.hooks[t].call(this.vm,this.el)},Zs.callHookWithCb=function(t){var e=this.hooks&&this.hooks[t];e&&(e.length>1&&(this.pendingJsCb=w(this[t+"Done"])),e.call(this.vm,this.el,this.pendingJsCb))},Zs.getCssTransitionType=function(t){if(!(!rn||document.hidden||this.hooks&&this.hooks.css===!1||Je(this.el))){var e=this.type||this.typeCache[t];if(e)return e;var i=this.el.style,n=window.getComputedStyle(this.el),r=i[Js]||n[Js];if(r&&"0s"!==r)e=zs;else{var s=i[qs]||n[qs];s&&"0s"!==s&&(e=Us)}return e&&(this.typeCache[t]=e),e}},Zs.setupCssCb=function(t,e){this.pendingCssEvent=t;var i=this,n=this.el,r=this.pendingCssCb=function(s){s.target===n&&(at(n,t,r),i.pendingCssEvent=i.pendingCssCb=null,!i.pendingJsCb&&e&&e())};ot(n,t,r)};var Xs={priority:Kr,update:function(t,e){var i=this.el,n=jt(this.vm.$options,"transitions",t);t=t||"v",e=e||"v",i.__v_trans=new Ue(i,t,n,this.vm),ut(i,e+"-transition"),ct(i,t+"-transition")}},Ys={style:$s,class:Ps,component:Rs,prop:Ws,transition:Xs},Ks=/^v-bind:|^:/,to=/^v-on:|^@/,eo=/^v-([^:]+)(?:$|:(.*)$)/,io=/\.[^\.]+/g,no=/^(v-bind:|:)?transition$/,ro=1e3,so=2e3;ui.terminal=!0;var oo=/[^\w\-:\.]/,ao=Object.freeze({compile:qe,compileAndLinkProps:Ye,compileRoot:Ke,transclude:_i,resolveSlots:Ci}),ho=/^v-on:|^@/;Oi.prototype._bind=function(){var t=this.name,e=this.descriptor;if(("cloak"!==t||this.vm._isCompiled)&&this.el&&this.el.removeAttribute){var i=e.attr||"v-"+t;this.el.removeAttribute(i)}var n=e.def;if("function"==typeof n?this.update=n:v(this,n),this._setupParams(),this.bind&&this.bind(),this._bound=!0,this.literal)this.update&&this.update(e.raw);else if((this.expression||this.modifiers)&&(this.update||this.twoWay)&&!this._checkStatement()){var r=this;this.update?this._update=function(t,e){r._locked||r.update(t,e)}:this._update=Ai;var s=this._preProcess?p(this._preProcess,this):null,o=this._postProcess?p(this._postProcess,this):null,a=this._watcher=new re(this.vm,this.expression,this._update,{filters:this.filters,twoWay:this.twoWay,deep:this.deep,preProcess:s,postProcess:o,scope:this._scope});this.afterBind?this.afterBind():this.update&&this.update(a.value)}},Oi.prototype._setupParams=function(){if(this.params){var t=this.params;this.params=Object.create(null);for(var e,i,n,r=t.length;r--;)e=u(t[r]),n=l(e),i=K(this.el,e),null!=i?this._setupParamWatcher(n,i):(i=Y(this.el,e),null!=i&&(this.params[n]=""===i||i))}},Oi.prototype._setupParamWatcher=function(t,e){var i=this,n=!1,r=(this._scope||this.vm).$watch(e,function(e,r){if(i.params[t]=e,n){var s=i.paramWatchers&&i.paramWatchers[t];s&&s.call(i,e,r)}else n=!0},{immediate:!0,user:!1});(this._paramUnwatchFns||(this._paramUnwatchFns=[])).push(r)},Oi.prototype._checkStatement=function(){var t=this.expression;if(t&&this.acceptStatement&&!Kt(t)){var e=Yt(t).get,i=this._scope||this.vm,n=function(t){i.$event=t,e.call(i,i),i.$event=null};return this.filters&&(n=i._applyFilters(n,null,this.filters)),this.update(n),!0}},Oi.prototype.set=function(t){this.twoWay&&this._withLock(function(){this._watcher.set(t)})},Oi.prototype._withLock=function(t){var e=this;e._locked=!0,t.call(e),ln(function(){e._locked=!1})},Oi.prototype.on=function(t,e,i){ot(this.el,t,e,i),(this._listeners||(this._listeners=[])).push([t,e])},Oi.prototype._teardown=function(){if(this._bound){this._bound=!1,this.unbind&&this.unbind(),this._watcher&&this._watcher.teardown();var t,e=this._listeners;if(e)for(t=e.length;t--;)at(this.el,e[t][0],e[t][1]);var i=this._paramUnwatchFns;if(i)for(t=i.length;t--;)i[t]();this.vm=this.el=this._watcher=this._listeners=null}};var lo=/[^|]\|[^|]/;Ht(Di),ki(Di),xi(Di),Ti(Di),Ni(Di),ji(Di),Ei(Di),Si(Di),Fi(Di);var co={priority:ss,params:["name"],bind:function(){var t=this.params.name||"default",e=this.vm._slotContents&&this.vm._slotContents[t];e&&e.hasChildNodes()?this.compile(e.cloneNode(!0),this.vm._context,this.vm):this.fallback()},compile:function(t,e,i){if(t&&e){if(this.el.hasChildNodes()&&1===t.childNodes.length&&1===t.childNodes[0].nodeType&&t.childNodes[0].hasAttribute("v-if")){var n=document.createElement("template");n.setAttribute("v-else",""),n.innerHTML=this.el.innerHTML,n._context=this.vm,t.appendChild(n)}var r=i?i._scope:this._scope;this.unlink=e.$compile(t,i,r,this._frag)}t?st(this.el,t):nt(this.el)},fallback:function(){this.compile(ft(this.el,!0),this.vm)},unbind:function(){this.unlink&&this.unlink()}},uo={priority:is,params:["name"],paramWatchers:{name:function(t){hs.remove.call(this),t&&this.insert(t)}},bind:function(){this.anchor=mt("v-partial"),st(this.el,this.anchor),this.insert(this.params.name)},insert:function(t){var e=jt(this.vm.$options,"partials",t,!0);e&&(this.factory=new _e(this.vm,e),hs.insert.call(this))},unbind:function(){this.frag&&this.frag.destroy()}},fo={slot:co,partial:uo},po=as._postProcess,vo=/(\d{3})(?=\d)/g,mo={orderBy:Li,filterBy:Ri,limitBy:Pi,json:{read:function(t,e){return"string"==typeof t?t:JSON.stringify(t,null,arguments.length>1?e:2)},write:function(t){try{return JSON.parse(t)}catch(e){return t}}},capitalize:function(t){return t||0===t?(t=t.toString(),t.charAt(0).toUpperCase()+t.slice(1)):""},uppercase:function(t){return t||0===t?t.toString().toUpperCase():""},lowercase:function(t){return t||0===t?t.toString().toLowerCase():""},currency:function(t,e,i){if(t=parseFloat(t),!isFinite(t)||!t&&0!==t)return"";e=null!=e?e:"$",i=null!=i?i:2;var n=Math.abs(t).toFixed(i),r=i?n.slice(0,-1-i):n,s=r.length%3,o=s>0?r.slice(0,s)+(r.length>3?",":""):"",a=i?n.slice(-1-i):"",h=t<0?"-":"";return h+e+o+r.slice(s).replace(vo,"$1,")+a},pluralize:function(t){var e=d(arguments,1),i=e.length;if(i>1){var n=t%10-1;return n in e?e[n]:e[i-1]}return e[0]+(1===t?"":"s")},debounce:function(t,e){if(t)return e||(e=300),y(t,e)}};return Ii(Di),Di.version="1.0.28",setTimeout(function(){Mn.devtools&&Zi&&Zi.emit("init",Di)},0),Di});
//# sourceMappingURL=vue.min.js.map
// Vue Customizations specific to Social Fixer
Vue.directive('tooltip', function (o) {
    this.el.setAttribute('data-hover','tooltip');
    if (o) {
        o.content && this.el.setAttribute('data-tooltip-content', o.content);
        o.uri && this.el.setAttribute('data-tooltip-uri',o.uri);
        this.el.setAttribute('data-tooltip-delay', (typeof o.delay!="undefined") ? o.delay : 1000);
        o.position && this.el.setAttribute('data-tooltip-position', o.position);
        o.align && this.el.setAttribute('data-tooltip-alignh', o.align);
        if (o.icon) {
            this.el.className="sfx-help-icon";
            this.el.setAttribute('data-tooltip-delay',1);
        }
    }
    else {
        this.el.setAttribute('data-tooltip-content', this.expression);
        if (this.el.getAttribute('data-tooltip-delay')==null) {
            this.el.setAttribute('data-tooltip-delay', "1000");
        }
    }
});
Vue.filter('highlight', function(words, query){
    var iQuery = new RegExp(query, "ig");
    return words.toString().replace(iQuery, function(matchedTxt,a,b){
        return ('<span class=\'sfx_highlight\'>' + matchedTxt + '</span>');
    });
});
Vue.filter('date', function(val){
    return (new Date(val)).toString().replace(/\s*GMT.*/,'');
});
Vue.filter('ago', function(val){
	return X.ago(val);
});

// Custom Components

// Option Checkbox
Vue.component('sfx-checkbox', {
    template:`<span><input id="sfx-cb-{{key}}" type="checkbox" v-on:click="click"/><label for="sfx-cb-{{key}}"></label></span>`,
    props: ['key'],
    activate: function(done) {
        this.$cb = X(this.$el.firstChild);
        this.$cb.prop('checked', FX.option(this.key));
        done();
    },
    methods: {
        click:function() {
            this.$cb.addClass('sfx_saving');
            FX.option(this.key, this.$cb.prop('checked'), true, function() {
                this.$cb.removeClass('sfx_saving');
            });
        }
    }

});
// For Vue Templates
// =============================
function template(appendTo,template,data,methods,computed,events) {
    var frag = document.createDocumentFragment();
    var ready = function(){};
    var v = new Vue(X.extend({
        "el":frag
        ,"template":template
        ,"data":data
        ,"methods":methods
        ,"computed":computed
        ,"replace":false
        ,"ready":function() { ready(v); }
    },events));
    if (appendTo) {
        v.$appendTo(appendTo); // Content has already been sanitized
    }
    var o = {
        "$view":v,
        "fragment":frag,
        "ready": function(func) {
            if (v._isReady) { func(); }
            else { ready=func; }
            return o;
        }
    };
    return o;
}

/*
 * This is a small library specific to Facebook functionality / extensions
 */
var FX = (function() {
    var css_queue = [];
    var on_page_load_queue = [];
    var on_page_unload_queue = [];
    var on_content_loaded_queue = [];
    var on_options_load_queue = [];
    var html_class_names = [];

    var fire_queue = function (arr, reset, arg) {
        if (!arr || !arr.length) {
            return;
        }
        arr.forEach(function (func) {
            try {
                func(arg);
            } catch(e) {
                console.log(e);
                console.log(e.toString());
                console.log(e.stack);
            }
        });
        if (reset) {
            arr.length = 0;
        }
    };

    // Monitor for hash change to detect when navigation has happened
    // TODO: Even for popups like photo viewer?!
    var page_transitioning = false;
    var page_transition = function() {
        if (page_transitioning) { return; } // Already initiated
        page_transitioning = true;
        // Fire the unload queue
        fire_queue(on_page_unload_queue);
        page_transitioning = false;
        fire_queue(on_page_load_queue);
    };
    // Monkey patch the pushState/replaceState calls in the main window to capture the event.
    // This will tell us if navigation happened that wasn't a full page reload
    // Detect changes through window.addEventListener(pushState|replaceState)
    var watch_history = function() {
        var _wr = function (type) {
            var orig = history[type];
            return function (state,title,url) {
                var url_change = (url && url!=location.href && !/theater/.test(url));
                var rv = orig.apply(this, arguments);
                if (url_change) {
                    var e = new Event(type);
                    e.arguments = arguments;
                    window.dispatchEvent(e);
                }
                return rv;
            };
        };
        window.history.pushState = _wr('pushState');
        window.history.replaceState = _wr('replaceState');
    };
    X.inject(watch_history);
    // Now listen for the state change events
    window.addEventListener("pushState",page_transition,false);
    window.addEventListener("replaceState",page_transition,false);

    // Facebook uses the HTML5 window.history.pushState() method to change url's in newer browsers.
    // Older browsers will use the hashchange approach
    window.addEventListener('hashchange',page_transition,false);
    window.addEventListener('DOMContentLoaded',function() {
    });

    // Public API
    var fx = {};
    fx.css = function(css_text) {
        css_queue.push(css_text);
    };
    fx.css_dump = function() {
        if (css_queue.length==0) { return; }
        var css = css_queue.join('');
        X.css(css,'sfx_css');
    };

    // OPTIONS
    // -------
    // options : A hash of ALL available options, as defined by modules, along with default values
    fx.options = {};
    // is_options_loaded : Once options is loaded, this flag flips
    fx.is_options_loaded = false;
    fx.add_option = function(key,o) {
        o = o || {};
        o.key = key;
        o.type = o.type || 'checkbox';
        if (typeof o['default']=="undefined" && o.type=="checkbox") {
            o['default'] = false;
        }
        this.options[key] = o;
    };
    fx.option =function(key,value,save,callback) {
        // The defined option
        var o = fx.options[key];
        if (typeof value!="undefined") {
            // SET the value
            X.storage.set('options',key,value,function() {
                fx.fire_option_update(key,value);
                if (typeof callback=="function") {
                    callback();
                }
            },save);
            return value;
        }
        // GET the value
        // If it's defined in the storage layer, get that
        if (typeof X.storage.data.options!="undefined" && typeof X.storage.data.options[key]!="undefined") {
            return X.storage.data.options[key];
        }
        // Else if it's defined as an option, return the default value
        if (typeof o!="undefined" && typeof o['default']!="undefined") {
            return o['default'];
        }
        // Default return null
        return null;
    };
    // Attach event listeners to controls in the DOM to change Options
    fx.attach_options = function($dom) {
        $dom=X($dom);
        $dom.find('*[sfx-option]').each(function(i,input) {
            var $input = X(input);
            if ($input.attr('sfx-option-attached')) { return; }
            var type = input.type;
            var option_key = $input.attr('sfx-option');
            if (!option_key || !fx.options[option_key]) { return; }
            var val = fx.option(option_key);
            $input.attr('sfx-option-attached','true');
            if (type=="checkbox") {
                // Checked by default?
                if (val) {
                    input.checked = true;
                }
                $input.click(function() {
                    val = !val;
                    fx.option(option_key,val);
                });
            }
            else if (type=="number") {
                if (val) {
                    input.value = val;
                }
                $input.change(function() {
                    fx.option(option_key,input.value);
                });
            }
            else {
                alert("FX.attach_options - Unhandled input type "+type);
            }
        });
    };
    fx.save_options = function(callback) {
        X.storage.save('options',null,callback);
    };
    fx.options_loaded = function(options) {
        fire_queue(on_options_load_queue,false,options);
        FX.css_dump();
        FX.html_class_dump();
        fx.is_options_loaded=true;
    };
    fx.on_options_load = function(func) {
        // If options are already loaded, just fire the func
        if (fx.is_options_loaded) {
            func();
        }
        else {
            on_options_load_queue.push(func);
        }
    };
    fx.on_option = function(option_name, value, func) {
        if (typeof value=="function") {
            func = value;
            value = true;
        }
        fx.on_options_load(function() {
            if (fx.option(option_name)==value) {
                func(fx.option(option_name));
            }
        });
    };
    var option_update_listeners = {};
    fx.on_option_update = function(option_name, func) {
        if (typeof option_update_listeners[option_name]=="undefined") { option_update_listeners[option_name]=[]; }
        option_update_listeners[option_name].push(func);
    };
    fx.fire_option_update = function(option_name,val) {
        var listeners = option_update_listeners[option_name];
        if (typeof listeners=="undefined") { return; }
        listeners.forEach(function(f) {
            f(val);
        });
    };
    fx.on_option_live = function(option_name, func) {
        fx.on_options_load(function() {
            func(fx.option(option_name));
        });
        fx.on_option_update(option_name, func);
    };
    // Pass-through to non-option storage
    fx.storage = function(key) {
        return X.storage.data[key];
    };

    fx.add_html_class = function(name) {
        html_class_names.push(name);
        if (X.is_document_ready()) {
            FX.html_class_dump();
        }
    };
    fx.html_class_dump = function() {
        // Add HTML classes to the HTML tag
        if (html_class_names.length>0) {
            var h=document.getElementsByTagName('HTML')[0];
            h.className = (h.className?h.className:'') + ' ' + html_class_names.join(' ');
            html_class_names.length = 0;
        }
    };
    fx.on_page_load = function(func) {
        on_page_load_queue.push(func);
    };
    fx.on_page_unload = function(func) {
        on_page_unload_queue.push(func);
    };
    fx.on_content_loaded = function(func) {
        if (fx.dom_content_loaded) {
            func();
        }
        else {
            on_content_loaded_queue.push(func);
        }
    };
	fx.dom_content_loaded = false;
    fx.fire_content_loaded = function() {
        // Queue or Fire the DOMContentLoaded functions
        var content_loaded = function() {
            fx.dom_content_loaded = true;
			FX.html_class_dump();
            fire_queue(on_content_loaded_queue,true);
            fire_queue(on_page_load_queue);
            FX.html_class_dump();
        };
        if (X.is_document_ready()) {
            content_loaded();
        }
        else {
            window.addEventListener('DOMContentLoaded',function() {
				content_loaded();
			},false);
        }
    };

    // Dynamic content insertion
    fx.domNodeInsertedHandlers = [];
    fx.on_content_inserted = function(func) {
        fx.domNodeInsertedHandlers.push(func);
    };
    fx.on_content = function(func) {
        // Inserted content
        fx.on_content_inserted(func);
        // Static content on page load
        fx.on_content_loaded(function() {
            func(X(document.body));
        });
    };
    fx.on_selector = function(selector,func) {
        var f = function($o) {
            var $items = $o.find(selector);
            if ($o.is(selector)) {
                $items = $items.add($o);
            }
            $items.forEach(function(item) {
                func(X(item));
            });
        };
        fx.on_content(f);
    };

    // Navigation Context
    fx.context = {"type":null, "id":null};
    fx.on_page_load(function() {
        var url = window.location.href;
        url = url.replace(/^.*?facebook.com/,"");
        query = url.match(/\?/) ? url.replace(/.*\?/,"") : "";
        url = url.replace(/\?.*$/,"");

        if (url=="/" || url=="/home.php") {
            fx.context.type = "newsfeed";
            fx.context.id = null;
        }
        else {
            var context = url.match(/\/([^\/]+)\/([^\/]+)/);
            if (context && context[2] == "posts") { // facebook.com/$id/posts
                fx.context.type = "posts";
                fx.context.id = context[1];
            }
            else if (context) {                     // facebook.com/$type/$id
                fx.context.type = context[1];
                fx.context.id = context[2];
            }
            else {                                  // facebook.com/$id
                fx.context.type = "profile";
                fx.context.id = (url.match(/^\/([^\/]+)/))[1];
            }
        }
        fx.context.permalink = (
            /^\/[^\/]*\/posts\/\d+/.test(url) ||    // facebook.com/$user/posts/$id
            url == "/permalink.php" ||              // facebook.com/permalink.php?story_fbid=$id
            /^\/groups\//.test(url) && (
                /view=permalink/.test(query) ||     // facebook.com/groups/$group?view=permalink&id=$id
                /multi_permalinks=/.test(query) ||  // facebook.com/groups/$group/?multi_permalinks=$id
                /\/permalink\//.test(url)           // facebook.com/groups/$group/permalink/$id
            )
        );
        var $html = X('html');
        var $group_permalink = $html.find('a._5pcq[href^="/groups/"]');
        if (fx.context.permalink && $group_permalink.length) {
            // <a class="_5pcq" href="/groups/$group/permalink/$id/" target="">
            fx.context.type = "groups";
            var href = $group_permalink.attr('href');
            fx.context.id = (href.match(/^\/groups\/([^\/]+)/))[1];
        }

        $html.attr('sfx_url',url);
        $html.attr('sfx_context_type',fx.context.type);
        $html.attr('sfx_context_id',fx.context.id);
        $html.attr('sfx_context_permalink',fx.context.permalink);

        X.support_note('sfx_context', `{ url: ${url}, type: ${fx.context.type}, id: ${fx.context.id}, permalink: ${fx.context.permalink} }`);

        // DEBUG
        //bubble_note(url+"<br>"+fx.context.type+"<br>"+fx.context.id, {id:"sfxcontext",draggable:false});
    });

    // "Reflow" a news feed page when posts have been hidden/shown, so Facebook's code kicks in and resizes containers
    fx.reflow = function(scroll_to_top) {
        if (typeof scroll_to_top!="boolean") { scroll_to_top=false; }
        // Show all substreams by force
        try { X('div[id^="substream_"]').css('height', 'auto').find('.hidden_elem').removeClass('hidden_elem'); } catch(e) {}
        // Trigger Facebook's code to re-flow
        setTimeout(function() {
//        window.dispatchEvent(new Event('resize'));
            if (scroll_to_top) {
                window.scrollTo(0, 3);
            }
        },50);
    };

    fx.mutations_disabled = false;
	fx.disable_mutations = function() { fx.mutations_disabled=true; };
	fx.enable_mutations = function() { fx.mutations_disabled=false; };
    var ignoreDomInsertedRegex = /(sfx|DOMControl_shadow|highlighterContent|uiContextualDialogPositioner|UFIList|timestampContent|tooltipText)/i;
    var ignoreDomInsertedParentRegex = /(highlighter|fbChatOrderedList)/;
    var ignoreTagNamesRegex = /^SCRIPT|LINK|INPUT|BR|STYLE|META|IFRAME|AUDIO|EMBED$/i;
    var ignoreMutation = function(o) {
        if (o.nodeType!=1) { return true; }
        if (ignoreTagNamesRegex.test(o.tagName)) { return true; }
        if (ignoreDomInsertedRegex.test(o.className) || /sfx/.test(o.id)) { return true; }
        if (o.parentNode && o.parentNode.className && ignoreDomInsertedParentRegex.test(o.parentNode.className)) {
            return true;
        }
		return fx.mutations_disabled;
    };
    var domnodeinserted = function (o) {
        if (ignoreMutation(o)) { return; }
        var $o = X(o);
        for (var i=0; i<fx.domNodeInsertedHandlers.length; i++) {
            // If a handler returns true, it has handled it, no need to continue to other handlers
            if (fx.domNodeInsertedHandlers[i]($o)) {
                return;
            }
        }
    };
    if (typeof MutationObserver!="undefined" || global_options.use_mutation_observers) {
        var _observer = function(records) {
            for (var i=0; i<records.length; i++) {
                var r = records[i];
                if (r.type!="childList" || !r.addedNodes || !r.addedNodes.length) { continue; }
                var added = r.addedNodes;
                for (var j=0; j<added.length; j++) {
                    domnodeinserted(added[j]);
                }
            }
        };
        X(function() {
            new MutationObserver(_observer).observe(document.body, { childList: true, subtree: true });
        });
    } else {
        X(document).on('DOMNodeInserted',function(e) {
            domnodeinserted(e.target);
        });
    }

    // Return the API
    // ==============
    return fx;
})();


// Main Source
// ===========
// ========================================================
// Anonymize Screens
// ========================================================
X.ready( 'anonymize', function() {
	// Add a menu item
	var item = {"html":"Anonymize Screen","message":"menu/anonymize", "tooltip":"Anonymize the current screen to make it suitable for screenshots to be shared without showing friends' names"};
	X.publish('menu/add',{"section":"actions", "item":item});
	X.publish('post/action/add', {"section": "wrench", "label": "Anonymize Post", "message": "post/action/anonymize"});

	// This function gets fired when the menu item is clicked
	X.subscribe("menu/anonymize",function() {
		anonymize(document);
	});
	X.subscribe("post/action/anonymize", function(msg,data) {
		anonymize(X("#"+data.id));
	});

	var anonymize = function(context) {
		var namehash = {};
		var colorhash = {};
		var colorcount = 1;
		var namecount = 1;
		var grouphash = {};
		var groupcount = 1;
		var eventhash = {};
		var eventcount = 1;
		var anon_names = ["Mario Speedwagon","Anna Sthesia","Paul Molive","Anna Mull","Paige Turner","Bob Frapples","Walter Melon","Nick R. Bocker","Barb Ackue","Buck Kinnear","Greta Life","Ira Membrit","Shonda Leer","Brock Lee","Maya Didas","Rick O'Shea","Pete Sariya","Sal Monella","Sue Vaneer","Cliff Hanger","Barb Dwyer","Terry Aki","Cory Ander","Robin Banks","Jimmy Changa","Barry Wine","Wilma Mumduya","Zack Lee","Don Stairs","Peter Pants","Hal Appeno ","Otto Matic","Tom Foolery","Al Dente","Holly Graham","Frank N. Stein","Barry Cade","Phil Anthropist ","Marvin Gardens","Phil Harmonic ","Arty Ficial","Will Power","Juan Annatoo","Curt N. Call","Max Emum","Minnie Mum","Bill Yerds","Matt Innae","Polly Science","Tara Misu","Gerry Atric","Kerry Oaky","Mary Christmas","Dan Druff","Jim Nasium","Ella Vator","Sal Vidge","Bart Ender","Artie Choke","Hans Olo","Marge Arin","Hugh Briss","Gene Poole","Ty Tanic","Lynn Guini","Claire Voyant","Marty Graw","Olive Yu","Gene Jacket","Tom Atoe","Doug Out","Beau Tie","Serj Protector","Marcus Down","Warren Peace","Bud Jet","Barney Cull","Marion Gaze","Ed Itorial","Rick Shaw","Ben Effit","Kat E. Gory","Justin Case","Aaron Ottix","Ty Ballgame","Barry Cuda","John Withawind","Joe Thyme","Mary Goround","Marge Arita","Frank Senbeans","Bill Dabear","Ray Zindaroof","Adam Zapple","Matt Schtick","Sue Shee","Chris P. Bacon","Doug Lee Duckling","Sil Antro","Cal Orie","Sara Bellum","Al Acart","Marv Ellis","Evan Shlee","Terry Bull","Mort Ission","Ken Tucky","Louis Ville","Fred Attchini","Al Fredo","Reed Iculous","Chip Zinsalsa","Matt Uhrafact","Mike Roscope","Lou Sinclark","Faye Daway","Tom Ollie","Sam Buca","Phil Anderer","Sam Owen","Mary Achi","Curtis E. Flush","Holland Oats","Eddy Kitt","Al Toesacks","Elle Bowdrop","Anna Lytics","Sara Bellum","Phil Erup","Mary Nara","Vic Tory","Bobby Pin","Juan Soponatime","Dante Sinferno","Faye Sbook","Carrie R. Pigeon","Ty Pryder","Cole Slaw","Luke Warm","Travis Tee","Clara Fication","Paul Itician","Deb Utant","Moe Thegrass","Carol Sell","Scott Schtape","Cody Pendant","Frank Furter","Barry Dalive","Mort Adella","Ray Diation","Mack Adamia","Farrah Moan","Theo Retical","Eda Torial","Tucker Doubt","Cara Larm","Abel Body","Sal Ami","Colin Derr","Mark Key","Sven Gineer","Benny Ficial","Reggie Stration","Lou Ow","Lou Tenant","Nick Knack","Patty Whack","Dan Delion","Terry Torial","Indy Nile","Ray Volver","Minnie Strone","Gustav Wind","Vinny Gret","Joyce Tick","Cliff Diver","Earl E. Riser","Cooke Edoh","Jen Youfelct","Reanne Carnation","Gio Metric","Claire Innet","Marsha Mello"];
		// Randomize the anon_names array
		for (var i = anon_names.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = anon_names[i]; anon_names[i] = anon_names[j]; anon_names[j] = temp;
		}
		X.QSA(context,`.uiProfilePhoto,
		        .profilePic,
		        img.bfb_friend_activity_img,
		        .UIImageBlock_MED_Image img,
		        #navAccountPic img,
		        a.UIImageBlock_ENT_Image img,
		        .smallPic .img,
		        .fbChatOrderedList .pic,
		        img[src*=fbcdn-profile-],
		        .UFIActorImage,
		        img.tickerStoryImage,
                a[data-hovercard*="user.php"] img,
                a[data-hovercard*="page.php"] img`,function(i) {
			if (i.parentNode && i.parentNode.href && i.parentNode.href.indexOf("photo.php")>=0) { return; } // photo, not profile pic
			if (i.src && i.src.indexOf("external.ak.fbcdn")>=0) { return; } // External img
			if (i.parentNode && X(i.parentNode).hasClass('UIImageBlock_MED_Image')) {
				i.src="data:image/gif;base64,R0lGODlhMgAyAMQAAPP1%2Bdzh7eXp8tHY58jR4s3V5O7x9vn6%2FOru9NTa6Pz9%2Funs8%2Fb4%2BvX2%2Bv7%2B%2F%2Fb3%2Btrg7MvT5MfQ4vj5%2B9fd6t7k7uPn8MbO4czT5PHz%2BNXc6dbc6dLZ6MbP4f%2F%2F%2F8TN4CH5BAAAAAAALAAAAAAyADIAAAX%2FYCeOZGmeaKqubJt%2BcCzPdG3feK7vfF8PFcMk4ivaCIGMZ%2BkJGJ8xDYBJHUCNmAd164FcexWuGPHVLcToR%2FkmQLvV61nETffGY206unGPKfViDn0wDIBogx8HhmIdg4qLWxeDE5BbjX1alUyIU5pLiH%2BaCohnnhODBY%2BeG32lnh5wcRCvSwt9A7RNfRK5HIO5RH2znraIrwSIH6GLgskBmgbJHxeaCdIfBpCj1x%2BQVtzLdNwwnYDjiYuX15AY3LyLGtcEmvHJGpoC0nmQfMkKnsHidLCQC0FAKBgQ5KKSwZeRDeUWUjngZIcEC%2F8k0lnQzsaAbBoXNaAwgwKlkKIqA3wIAQA7";
			}
			else {
				i.src="data:image/gif;base64,R0lGODlh1ACuAPcAALjB2f%2F%2F%2F%2BPm8Njc6dTY58LJ3sDI3vL09%2B7w9dDW5dDV5cbM38PDw5KSkra%2F2LfA2LfA2bW%2F2LS%2B17W%2B17bA2LfB2f7%2B%2Fvz8%2Ff39%2FrvD2rS917W%2B2LW%2F177G3Ofp8fr6%2FLrC2tba6MTL3%2FLy99HW5sfO4b3F2%2Bbo8fv7%2FbnB2e3t7c3T5MLJ3cXM39PY57bA2b%2FG3LO81urs8%2Bzu9N3g7ODj7sHI3e%2Fw9tnd6szR4ra%2F1%2FHy9%2BLl78DH3fX2%2Btzf67vE29PX5unr8ufq8rzE28bN4PT1%2BcvR4uTn8Orr88DH3Ojq8vX2%2Bfj4%2Bvn5%2B7jB2N3h7N7h7Nzg7P79%2FtXa6Pf4%2B%2FP0%2BM3S4%2BXo8brC2fv7%2FOzt9NDV5sPK3vLz9%2F%2F%2B%2F8fN4Pb3%2BsXN4LvE2t%2Fi7bnC2ubp8fPz%2BMXL3%2BHl77O91vz7%2FeXo8Onr8%2BPm78DI3bO%2B1%2B3v9bzE2tfb6MnP4s7T5PT1%2BOLk7uHk7tLX57O91%2B7w9uvt88jO4e7v9djc6r3F3LjA2dvb29PY5s3T49%2Fj7tzg68vR48bM4KysrPDy9vPz9%2BDk7sHJ3dLX5vb2%2Btne6vf4%2Bs%2FV5dre6tre67nC2eDj7fHx9ubo8Ovt9Nvf69HX5ujr8vj5%2B%2F38%2Ff3%2B%2FszR47K81snO4fP1%2BdXa58jO4Ojq8fDx97rD2rvC2v7%2B%2F77F3M7T47zD2vr6%2B7vD2drd6rS%2B1r7G27K81bvD28nQ4b%2FH3PLy9tfc6ejq8%2F%2F%2F%2Fr%2FH3fj4%2B%2Fb2%2Bb3E29ba6dbb6Nbb6dTZ6NHV5uzt9eTm7%2F39%2Fff3%2Bu3u9O3u9b7F28bN4cfN4be%2F2PT0%2BPT0%2BfLx9%2FDy98vS4%2Fn6%2FOLk7%2Fn6%2B%2BHk7%2Fz8%2FsDI3PHz99LW5uHk7ff3%2B%2Bfq8fn4%2B8rQ4srQ4%2BPl77S%2B2MHH3u%2Fx9%2Bvs8%2BTm8OXn8PX1%2BOXn8f7%2F%2F8jP4MjP4fb4%2Bu7v9vL0%2BPv8%2FbS%2F2MzS4%2Bjp8fX3%2Bt7i7d%2Fj7fDx9s%2FU5M%2FU5cfO4Ors9PLz%2BLa%2B18LK3ubo8iH5BAAAAAAALAAAAADUAK4AAAj%2FABkEGEiwoMGDCBMqXMiwocOHECNKnEixIgOBFTNq3Mixo8ePGS%2BCHEmypMmTH0WiXMmypcuRKl%2FKnEmzJsGYNnPq3NkR50AAQIMKHUq0qNGjSJMqXcq0qdOnUKMaPegzgNSrWLNq3cq1K1KqGAt6HUu2rNmzTcEeRMu2rdu3UNUahEu3rt22csXe3cu3b9S8BP0KHkxYKOCfhRMrrnvY6uLHkM02jky5stbJljNrZop5s%2BfPhg1WBX0XAgUHDh6Qftp5NVoKESRISGFCSQ9ArtOKDhs491gHEyKoRqNA05AZO%2Bw8IqPad9LWzq9S0OMARh8qZrhd%2BGJwR4Hm0afu%2F14bHirsDRW6UMFyZqGXDhzKH4Uu%2FygECRxMlKCh6EPDNSVIUJ94BY02oFEVOCBBFnWksUhEbkxwYFH0TSgBBY388I4FE2ExAQQTDlVhfaiVIMAFGX0gjwYhhlYgb4hN6IAOIpiDAkfVHKEBiC2OGJ0Eq9iDwUcXCKMDeAf6mFsEDkhiBUkWuOGLgBMquVoEJiCB0ilFSJjkeHOVB8EEzIzAUickOEDBgFZ6BoEDBKDYkgVQALCmfG1q9oIDUnAo0wljRIAnmHr55gAIWtbkBwyChpdnZRRkMY9OlyjRqHOPRgbBA%2BnwdAMRL0SXKWQR4MDTQOcAwGNuoy7mwAJy8v9kgSMbYEpob6tRwMmpBFkBRAW%2BtZoYB4jAwytBJHjpmrCFaUDJsQRl4kCwt8b42QMgzADtQI%2FYMO2y1ToGmgM2uLJtAFNIQ%2BVqzA4WQS3nDvTHuqS1K1gE2sQbQA3fshvuag78oK8HqoL7InnjWqJvHCCsCpq9fjnggb4jZIDkZxD3JbG%2B0Fhs8E0wivvZxvE6Q8vFnmXMlwMy6GtBByhvpvJeFNCjbwAwfzyQgaBRUMXNOft7cJjjJuFy0PX%2BS5oDJ%2BiLDhAxazbzXSSfW3HUmU1tV9XbXq1zADyPPHG8XgsNMsIjY6LvIh6bvXPIAEOhbzmVOIyx0uMKHO8JBbv%2FDTbcS%2Bt9LsF2p4z3yCHoWwwAwPodtmcRcKEvDf0mPXShn0UwzOSVP3w45CvoG0Xnd1%2BOa%2BZi6BsCvZ6bbi3kqcebhxqsfq4ZBXDEfq4Ls5Aus%2B2WQfAGGZfoa0QNLYRq%2BdlEbwYBGzcT1EbfpTOPuWYQtBx9AFukUnjWwFfmgMLb8%2B044J45YOr2hdS6%2FNtoaxaP5NsHE8P58Wc2QQnbT1EH679zncg0E4ECNCF6HwCD%2B1pnvdPdThm3iJ4PeoC1ymgNLg%2BoxD6ix48yVJAyF4TLBBKlr0zo4WuP04wannUzMiiLgfBr3mYmEITozeFSMPxb%2FjLjAFAY42YEwGH1%2F2J4PT2x4Ebx%2BgIimoFC9I1MCPryQxm%2BJ7XwWcYBLWDCucLQhwW%2BT4cydFMHfAAtDIjAd4YTYG5iwANo3QACVAxgA183sjxAixEfBJ8aXeOALnziWMmy1R5X8wAgKIJXH0CDF%2FEXRs8kqI2n2kPbajfI1WjAEao4FSPgICorasYBLPjZTnRxBSEysoigeYC2dhKJDDjKk5oRxx94ggRTntKBS2PBkHRyhRdSco4DJE0FIADFnBihA3cSJDCjowEu%2BKkmUfDlL4mIS9K8AAQ7sMkaWIDGL6ZwNRJIgE1osEhqVdI3FPgHTXYAhGR28py5ccAbeiGTC9ABgOZcZnliUf8ImSCjH40rTwj9EoF8PJMlk7BlPqlJxyXlYJctoYJCpwlGVLomAg99SQgm2sQdXjSjLtkom2CZOZC2RKT1GWhfJuACmWxDmspkaDBzIwFcyIQNMF1oRavpmhikQSbkwKdOv%2BmaCYzNJaPIwhNSSlLnlYEYMjmGEtz5Tn1GpzpekEkCOepNJ%2FqmgAd8CQauINSONhKcRYiVS1wQCqbCczWByAAkaGIGE7jVqq6BAAiS8IGDvuQaN%2FBHN4e404aOTAQ8IUE5b2nY9LGCJ4YYbBrxupoJrE8nHqCqWS3qGQnkgie8SMEr3%2BrIDByAJxfoQhwnK9OvFsE%2FO1HHMMrK2sL%2FztQzGiAFr7AQn5jaNjeq0R5PmNADyeqRsp%2FRgAggypMgxCCgjL0tpAQkijhAKxKSyMAEjBsZlaLlPmNYwRaYeywvuKADF%2BqqRxeToAkQwQV72F4A7ACJcXAgAqtdjHfHsl0bwIKM8iWIN%2B7QggrQVjH73coDNuCAUuDBCQFGyBS6QYgnpNeCTaWaBDKwgjZoIcILsUA0BgGICfQWMgmOyps0YIM5mAnEDwmDIdBw3%2FzuJcVOocAEnqCPGoQBxhNxwhKOAILtIjjDbHmABORAgmICOSM3AAY2JqBZvuAYKQ%2BgMgugkI0ne4QJ1ABDlrnLlisX5QEaeMUhMKFWL3cE%2FwNb2IQsNFBluJg5KA%2BIgA5ggAMEuBklVqjHGal8lzvfJwUl4AGE%2F8wSFJhiBa24sJ2RfJUESYAIQeCDXxnNkhsMwBYScICNuZJiDjjAAJN4Eqdt0o4aiOA%2B0JUMpZ0CgSO14A7TWDVPPHGCbwDgQ2hR6QQeUIIhwFbXp7rADFbw61H%2FZdZK0TE7TrBpZJ%2BKD%2FgIBJlZA%2B2jZHkX1viwtV2WhBYQ2itTc0AKhCHKcUfvAlGQw2KvMjMJ9GAJ7gbxPdYB7K2obAKHAHC%2BI3yBEIja390WigRI0OaBB1gKEYj1s0nLlIWT1%2BERlgIF8vichP%2BaDkjE%2BJNXl5V2UaADz%2FsQuZtRsIwTTxy5THEAJFXuZXc0jN7djkARLk7zCH9hEAf%2BSs6H0PM%2Fn2EMziaKsB7QCHEX3cuE2LaIoK2Byz79yWYIOoFgjuUUCPfqQDaCCerccYobxQGNCCvYYayCAFzgCFqfutmLMgFwrP3JbQ8ADljE7bkTxQG%2FuDuQ8x6OB0i87Fw%2FigPwIHi2DyQZqEg6UFr1AHw3PsJ5P4MJOO4iYF7%2B8xCpCuhHzxDRk%2F70jUG96j2%2FetWbvvWnZ0AiGkD72tv%2B9rjPve53z%2Fve%2B%2F73wA%2B%2B8IdP%2FOIbPxGCuIjyl8%2F85jv%2F%2BdCPvvSnT%2F3qW%2F%2F62M%2B%2B9rfPAEEEBAA7";
			}
		});
		X.QSA(context,'#navAccountName,#navTimeline a',function(o) {
			if (X(o,'img')){return;}
			var c=o.innerHTML;
			if (o.href) { 
				if (o.href.indexOf("?")>-1) {
					if (/profile.php/.test(o.href)) {
						c = o.href.replace(/(profile.php[^\&]+).*/,"$1");
					}
					else {
						c = o.href.substring(0,o.href.indexOf("?")); 
					}
				}
				else {
					c=o.href;
				}
			}
			if (!namehash[c]) { colorhash[c]=colorcount++; if(colorcount>24) { colorcount=1; } namehash[c] = "Me"; }
			X(o).text(namehash[c]).addClass('sfx_anonymous sfx_anonymous_'+colorhash[c]);
		});
		X.QSA(context,'.UFIReplySocialSentenceLinkText,.actorName a,a.actorName,a.ego_title,span.blueName,a.passiveName,.fbxWelcomeBoxName,*[data-hovercard*="user"],*[data-hovercard*="page"],*[data-hovercard*="group"],a[href*="/profile.php"],.headerTinymanName,.UFICommentActorName,.UFILikeSentence a[href^="http"],#navTimeline a,.tickerFeedMessage .passiveName, a.profileLink, #friends_reminders_link .fbRemindersTitle strong',function(o) {
			if (X(o).find('img').length>0 || X(o).hasClass('sfx_anonymous')){return;}
			var c=o.innerHTML;
			if (o.href) { 
				if (o.href.indexOf("?")>-1) {
					if (/profile.php/.test(o.href)) {
						c = o.href.replace(/(profile.php[^\&]+).*/,"$1");
					}
					else {
						c = o.href.substring(0,o.href.indexOf("?")); 
					}
				}
				else {
					c=o.href;
				}
			}
			if (!namehash[c]) { colorhash[c]=colorcount++; if(colorcount>24) { colorcount=1; } namehash[c] = anon_names[namecount++ % anon_names.length]; }
			X(o).text(namehash[c]).addClass('sfx_anonymous sfx_anonymous_'+colorhash[c]);
		});
		// Friend names in Like sentence
		X.QSA(context,'a[href^="/ufi/reaction"] span[data-hover]', function(o) {
			X(o).safe_html( o.innerHTML.replace(/.*? and (\d+.*)$/,"$1") );
		});
		X.QSA(context,'#groupSideNav .linkWrap',function(o) {
			var c = o.innerHTML;
			if (!grouphash[c]) { grouphash[c] = "Group #"+(groupcount++); }
			X(o).text(grouphash[c]);
		});
		// Try to anonymize names in the ticker that are not friends
		X.QSA(context,'.tickerFeedMessage .fwb',function(token) {
			try {
				if (token.nextSibling.nodeType==3) {
					token.textContent = "another user";
				}
			}
			catch (e) { }
		});
		X.QSA(context,'.tickerFeedMessage',function(msg) {
			try {
				if (/ (on|likes) [^']+'s /.test(msg.innerHTML)) {
					msg.innerHTML = msg.innerHTML.replace(/ (on|likes) [^']+'s /,' $1 someone\'s ');
				}
			}
			catch (e) { }
		});
        X.QSA(context,'.tickerFeedMessage',function(msg) {
            try {
                if (/posted in/.test(msg.innerHTML)) {
                    msg.innerHTML = msg.innerHTML.replace(/posted in [^\.]+/,'posted');
                }
            }
            catch (e) { }
        });
		// Anonymize Friend lists
		X.QSA(context,'#listsNav .linkWrap, #pinnedNav li[data-type="type_friend_list"] .linkWrap',function(o) { X(o).text('Friend List'); });
		// Anonymize Pages
		X.QSA(context,'#pagesNav .linkWrap, #pinnedNav li[data-type="type_page"] .linkWrap',function(o) { X(o).text('Page'); });
		// Anonymize Groups
		X.QSA(context,'#groupsNav .linkWrap, #pinnedNav li[data-type="type_group"] .linkWrap',function(o) { X(o).text('Group'); });
		// Events
		X.QSA(context,'#pagelet_reminders #event_reminders_link .fbRemindersTitle, #eventsNav .linkWrap',function(o) { X(o).text('Event'); });
	};
});

FX.add_option('run_on_apps', {"title": 'Run On Apps and Games Pages', "description": 'Run Social Fixer on apps and games pages from apps.facebook.com.', "default": true});
X.beforeReady(function(options) {
    if (/apps.facebook.com/.test(location.href)) {
        if (!options) {
            // Don't run modules yet until prefs are loaded
            return false;
        }
        else {
            //Otherwise check prefs to see if modules should run
            return FX.option('run_on_apps');
        }
    }
});

// =============================================
// "Bubble" Notes are panels to display... notes
// =============================================
function bubble_note(content,options) {
    options = options || {};
    options.position = options.position || "top_right";
    if (typeof options.close!="boolean") { options.close=false; }
    options.id = options.id||"";
    if (typeof options.draggable!="boolean") { options.draggable=true; }
    // If ID is passed, remove old one if it exists
    if (options.id) {
        X('#'+options.id).remove();
    }

    // Bubble note content is generated entirely from within code and is untainted - safe
    var c = X(`<div id="${options.id}" style="${options.style}" class="sfx_bubble_note sfx_bubble_note_${options.position} ${options.className}"></div>`);
    if (options.close) {
        c.append(`<div class="sfx_sticky_note_close"></div>`);
    }
    if (options.title) {
        c.append(`<div class="sfx_bubble_note_title">${options.title}</div>`);
    }
    if (typeof content=="string") {
        c.append(`<div class="sfx_bubble_note_content">${content}</div>`);
    }
    else {
        c.append(content);
    }
    // Close functionality
    c.find('.sfx_sticky_note_close, .sfx_button_close').click(function() {
        if (typeof options.callback=="function") {
            options.callback(c);
        }
        c.remove();
    });

    FX.on_content_loaded(function() {
        X(document.body).append(c);
        if (options.draggable) {
            X.draggable(c[0]);
        }
    });
    return c;
}
// Hide all bubble notes when ESC is pressed
X(window).on('keyup',function(event) {
    if (event.keyCode==27) {
        X('.sfx_bubble_note').remove();
    }
});

// A popup that remembers not to show itself next time
function context_message(key,content,options) {
    options = options || {};
    X.storage.get('messages',{},function(messages) {
        if (typeof messages[key]=="undefined") {
            // Show the message
            // Add an option to now show the message in the future
            content += `
                <div style="margin:15px 0 15px 0;"><input type="checkbox" class="sfx_dont_show" checked> Don't show this message again</div>
                <div><input type="button" class="sfx_button sfx_button_close" value="OK, Got It"></div>
            `;
            options.close = true;
            options.id = "sfx_content_message_"+key;
            options.title = `<div class="sfx_info_icon">i</div>${options.title}`;
            options.style="padding-left:35px;";
            options.callback = function($popup) {
                if ($popup.find('.sfx_dont_show').prop('checked')) {
                    X.storage.set('messages',key,X.now(),function() {});
                }
            };
            return bubble_note(content,options);
        }
    },true);
}
// ========================================================
// Fix Comments
// ========================================================
X.ready('comment_button', function () {
  var title = "Fix Enter In Comments & Replies";
  FX.add_option('comment_button', {"title": title, "description": "Use Enter to add a new line instead of submitting comments & replies.", "default": false});
  FX.add_option('comment_button_ctrl', {"title": title, "description": "Use Ctrl+Enter to submit comments & replies.", "default": false});
  FX.add_option('comment_button_hint', {"hidden": true, "default": true});

  FX.on_options_load(function () {
    var fix_comments_on = FX.option('comment_button');
    var comment_button_ctrl = FX.option('comment_button_ctrl');
    var show_hint = FX.option('comment_button_hint');
    var fix_comments_disabled = false;

    // Provide the ability to dispatch React events
    X.inject(function () {
      return function (target_selector, type, data) {
        var resolved = false; // So only one of the fixes will fire
        var target = document.querySelector(target_selector);
        var err = "";

        // Set a timeout so if it fails, revert back to default behavior
        setTimeout(function () {
          if (!resolved) {
            document.querySelector('html').setAttribute("sfx_fix_comments_disabled", "true");
            var msg = "Uh-oh, that didn't work.  Please disable the two 'Enter' options and check Social Fixer User Support for further instructions (no need to report it, you won't be the first).  For now, 'Enter' will submit and 'Shift+Enter' will make paragraph breaks (normal Facebook behavior).";
            if (err) {
              msg += err;
            }
            alert(msg);
            document.querySelector('.sfx_comment_button').style.display = "none";
            document.querySelector('.sfx_comment_button_msg').textContent = "Press Enter to submit comment";
          }
        }, 1500);

        if (target) {
          data.srcElement = target;
          data.target = target;
        }
        data.currentTarget = document;
        data.view = window;

        [
          'ReactDOM',
          'ReactDOMFiber-prod',
          'ReactDOM-prod',
          'ReactDOMStack-prod',
          'ReactDOM-fb',
        ].forEach(function (attempt) {
          if (!resolved) { // Avoid even trying extra requireLazy() calls
            window.requireLazy([attempt], function (ReactDOM) {
              if (!resolved) { // In case two effective functions are both invoked asynchronously
                try {
                  ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMEventListener.dispatchEvent(type, data);
                  resolved = true;
                } catch(e) {
                  err = e.toString();
                }
              }
            });
          }
        });
      };
    }, {}, "sfx_dispatch_react_event");

    var dispatch_enter_event = function (target_selector, shiftKey) {
      X.inject(function (data) {
        // eslint-disable-next-line no-undef
        sfx_dispatch_react_event(data.target_selector, data.type, data.event);
      }, {
        "target_selector": target_selector
        , "type": "topKeyDown"
        , "event": {
          altKey: false
          , bubbles: true
          , cancelBubble: false
          , cancelable: true
          , charCode: 0
          , clipboardData: undefined
          , ctrlKey: false
          , defaultPrevented: false
          , detail: 0
          , eventPhase: 3
          , keyCode: 13
          , keyIdentifier: "Enter"
          , keyLocation: 0
          , layerX: 0
          , layerY: 0
          , metaKey: false
          , pageX: 0
          , pageY: 0
          , path: []
          , repeat: false
          , returnValue: true
          , shiftKey: shiftKey
          , srcElement: null
          , target: null
          , timeStamp: +(new Date())
          , type: "keydown"
          , which: 13
        }
      });
    };

    (function () {
      var dispatch_react_event = false;
      var react_target_selector = null;
      var comment_id = 0;
      var submit = function () {
        if (dispatch_react_event) {
          dispatch_enter_event(react_target_selector, false);
        }
      };
      X.capture(window, 'keydown', function (e) {
        if (!fix_comments_disabled && document.querySelector('html').getAttribute('sfx_fix_comments_disabled')) {
          fix_comments_disabled = true;
        }
        if (fix_comments_disabled) {
          return;
        }
        var $t = X.target(e, true);
        var t = $t[0];
        if (($t.closest(".UFIAddCommentInput").length > 0 && $t.closest('#birthday_reminders_dialog').length == 0)) {
          var editable = ("true" == t.getAttribute('contenteditable') || t.getAttribute('data-reactid'));
          if (editable) {
            dispatch_react_event = true;
            if (!t.getAttribute("sfx_comment_id")) {
              t.setAttribute("sfx_comment_id", comment_id++);
            }
            react_target_selector = t.tagName + '[sfx_comment_id="' + t.getAttribute('sfx_comment_id') + '"]';
            t.tabIndex = 9998;
          }
          var $button = null;
          var $container = $t.closest('.textBoxContainer,.UFICommentContainer');
          if ($container.length) {
            var $note_container = $container.parent();
            $button = $note_container.find('.sfx_comment_button');
            if (fix_comments_on && !$button.length) {
              $button = X('<input class="sfx_comment_button" type="button" value="Submit Comment" style="cursor:pointer;" tabIndex="9999">');
              $button.click(function () {
                submit();
                if (t.focus) {
                  t.focus();
                }
              });
              $note_container.append($button);
              if (comment_button_ctrl) {
                $button.after('<span class="sfx_comment_button_msg">(Ctrl+Enter also submits)</span>');
              }
            }
            else if (!fix_comments_on && show_hint && $note_container.find('.sfx_comment_button_msg').length == 0) {
              var $note = X('<span class="sfx_comment_button_msg">Social Fixer can prevent Enter from submitting comments & replies! <a class="sfx_link sfx_link_options" style="color:inherit;">Options</a> <a class="sfx_link sfx_link_hide" style="color:inherit;">Hide</a></a></span>');
              $note.find('.sfx_link_options').click(function () {
                X.publish("menu/options", {"highlight_title": title});
              });
              $note.find('.sfx_link_hide').click(function () {
                X.storage.set('options', 'comment_button_hint', false, function () {
                  show_hint = false;
                  $note.remove();
                });
              });
              $note_container.append($note);
            }
          }
          if ($button && editable && fix_comments_on) {
            if (e.keyCode == 13) {
              e.preventDefault();
              e.stopPropagation();
              if (comment_button_ctrl && e.ctrlKey) {
                submit();
                if (t.focus) {
                  t.focus();
                }
              }
              else if (dispatch_react_event) {
                dispatch_enter_event(react_target_selector, true);
              }
            }
          }
        }
      });
    })();

  });

});

// Insert a control to expand and highlight comments
X.ready( 'comment_navigator', function() {
    FX.add_option('navigator_always', {"title": 'Comment Navigator', "description": "Add the Comment Navigator to each post", "default": false});
    FX.add_option('navigator_watch', {"title": 'Comment Navigator', "description": "Watch Comment Navigator while expanding", "default": false});
    X.publish('post/action/add', {"section": "wrench", "label": "Add Comment Navigator", "message": "post/action/commentnavigator/add"});
    X.subscribe(['post/action/commentnavigator/add', 'post/action/commentnavigator/add/always'], function (msg, data) {
        var dom_id = data.id;
        var sfx_id = data.sfx_id;
        var $post = X(document.getElementById(dom_id));

        var expander_selector =
            ':not(.UFIAddCommentLink) > .UFICommentLink,' +     /* Xyz replied . N Replies */
            '.UFIPagerLink,' +                                     /* View N more comments */
            'a._ipm[href*="comment"]:not([sfx_clicked]),' +  /* N Comments: search results */
            'a._5v47.fss[role="button"],' +      /* "See More" on individual comment/reply */
            'a.see_more_link:not([sfx_clicked])';                  /* "See More" on a post */
        var post_time = ($post.find('abbr[data-utime]').first().attr('data-utime') || 0) * X.seconds;
        var now = X.now();
        // Operational parameters
        var expand_limit = 25;
        var link_highlight_ms = 1.0 * X.seconds;
        var click_interval_ms = 0.4 * X.seconds;
        var refractory_interval_ms = 1.3 * X.seconds;

        var data = {
            "post_time": post_time
            , "now": now
            , "max": (now - post_time)
            , "range": 0
            , "show_expand_all": true
            , "limit": expand_limit
            , "active": false
        };
        var scroll_to_expander = function () {
            var offs = $post.find('div.sfx_expander').offset();
            var top_tgt = offs.top - (window.innerHeight / 2);
            window.scrollTo(0, top_tgt < 0 ? 0 : top_tgt);
        };
        var expanders = function () {
            return $post.find(expander_selector).filter(function () {
                var $e = X(this);
                return (!$e.find('*[aria-busy],.UFICollapseIcon').length);
            });
        };
        var methods = {
            "expand": function () {
                var self = this;
                var limit = data.limit;
                var expand_all = function () {
                    var expand_progress_bar = function() {
                        var pct = 100 * limit / expand_limit;
                        $post.find('div.sfx_expander_bar')
                             .css("background", 'linear-gradient(to right, rgba(124,157,189,.3) ' + pct + '%, transparent ' + pct + '%)');
                    };
                    self.show_expand_all = expanders().length;
                    var clicked = false;
                    expanders().each(function (i, o) {
                        try {
                            data.active = true;
                            expand_progress_bar();
                            var $o = X(o);
                            var was_clicked_ms = $o.attr('sfx_clicked');
                            if (was_clicked_ms && X.now() - was_clicked_ms < refractory_interval_ms) {
                                //console.log("skipped due to recent click time");
                            }
                            else {
                                $o.css('background-color', 'yellow');
                                setTimeout(function () {
                                    $o.css('background-color', '');
                                }, link_highlight_ms);
                                if (FX.option('navigator_watch')) {
                                    var offs = $o.offset();
                                    var top_tgt = offs.top - (window.innerHeight / 2);
                                    window.scrollTo(0, top_tgt < 0 ? 0 : top_tgt);
                                }
                                // Avoid following dangerous onclick or href
                                var curr_href = $o.attr('href');
                                var saved_onclick = undefined;
                                var saved_href = undefined;
                                if (curr_href) {
                                    if (curr_href == '#' && !/text_expose|reflow/.test(o.onclick)) {
                                        //console.log("Defusing onclick '" + o.onclick + "' of: " + $o.html());
                                        saved_onclick = o.onclick;
                                        o.onclick = X.return_false;
                                    }
                                    if (/^https*:|^\//.test(curr_href)) {
                                        //console.log("Defusing href '" + curr_href + "'of: " + $o.html());
                                        saved_href = curr_href;
                                        $o.removeAttr('href');
                                    }
                                }
                                $o.attr('sfx_clicked', X.now());
                                X.ui.click($o);
                                if (saved_onclick) {
                                    //console.log("Repairing onclick");
                                    o.onclick = saved_onclick;
                                }
                                if (saved_href) {
                                    //console.log("Repairing href");
                                    $o.attr('href', saved_href);
                                }
                                clicked = true;
                                limit--;
                                data.limit = limit;
                            }
                            if (limit > 0) {
                                //console.log("calling again, " + limit + " / " + self.show_expand_all + " to go");
                                setTimeout(function () {
                                    expand_all();
                                }, click_interval_ms);
                            }
                            else {
                                expand_progress_bar();
                                limit = expand_limit;
                                data.limit = limit;
                                data.active = false;
                            }
                            return false; // Only click the first one
                        } catch (e) {
                            alert(e);
                        }
                    });
                    self.show_expand_all = expanders().length;
                    if (self.show_expand_all == 0) {
                        data.active = false;
                    }
                    expand_progress_bar();
                    if (FX.option('navigator_watch') && !data.active) {
                        setTimeout(function () {
                            self.show_expand_all = expanders().length;
                            scroll_to_expander();
                        }, 0.8 * X.seconds);
                    }
                };
                expand_all();
            }
            , "mouseover": function () {

            }
            , "change": function () {
                var now = this.now;
                var range = this.range;
                $post.find('form abbr[data-utime]').each(function (i, o) {
                    var $o = X(o);
                    var ut = (+$o.attr('data-utime') || 0) * 1000;
                    if (!ut) {
                        return;
                    }
                    if (ut > now - range) {
                        $o.css('background-color', 'yellow');
                    }
                    else {
                        $o.css('background-color', '');
                        //                    $o.closest('.UFIComment').css('outline','');
                    }
                });

            }
            , "ago": function () {
                return X.ago(now - this.range, now, true, true);
            }
        };
        var html = `<div class="sfx_expander" style="border:1px solid #E1E2E3;padding:10px;">
<div v-if="show_expand_all" class="sfx_link sfx_expander_bar" style="float:right;" @click="expand"><span v-if="(active)">Expanding</span><span v-else>Click to expand</span> <span v-if=(show_expand_all==1)>the</span><span v-else><span v-if="(show_expand_all>limit)">{{limit}} of </span><span v-else>all </span>{{show_expand_all}}</span> hidden item<span v-if="(show_expand_all>1)">s</span></div>
                <div>Highlight comments newer than: <b>{{ago()}}</b></div>
                <div><input v-model="range" type="range" min="0" max="{{max}}" style="width:95%;" @v-bind:mouseover="mouseover" @change="change"></div>
            </div>`;
        $post.find('div.sfx_expander').remove();
        data.show_expand_all = expanders().length;
        var $vue = template(null, html, data, methods);
        $post.find('form .UFIContainer').before($vue.fragment);
        if (! /always/.test(msg)) {
            scroll_to_expander();
        }
    });
    if (FX.option('navigator_always')) {
        X.subscribe(["post/add", "post/update"], function (msg, data) {
            if (data.sfx_id) {
                X.publish('post/action/commentnavigator/add/always', data);
            }
        }, false);
    }
});

// =====================================
// Post Filter: Move/Copy To Tab
// =====================================
X.ready( 'control_panel', function() {
    FX.add_option('control_panel_x', {"hidden": true, "default": 0});
    FX.add_option('control_panel_y', {"hidden": true, "default": 50});
    FX.add_option('control_panel_right', {"hidden": true, "default": false});
    FX.add_option('control_panel_bottom', {"hidden": true, "default": false});
    FX.add_option('reset_control_panel_position', {"title": 'Find Control Panel', "section": "Advanced", "description": "Reset the position of the Control Panel to the upper left", "type": "action", "action_text": "Find Control Panel", "action_message": "cp/reset_position"});

    var $vm, data;
    var reset = function () {
        X('#sfx_control_panel').remove();
        data = {
            "sections": []
        };
        control_panel_created = false;
    };
    reset();

    // Reset the position
    X.subscribe("cp/reset_position", function () {
        FX.option('control_panel_x', null, false);
        FX.option('control_panel_y', null, false);
        FX.option('control_panel_right', null, false);
        FX.option('control_panel_bottom', null, false);
        X.storage.save("options");
        position_control_panel(null, null, false);
    });

    // Add a SECTION
    X.subscribe("cp/section/add", function (msg, section_data) {
        create_control_panel();
        section_data.order = section_data.order || 999;
        // {"name", "id", "help", "order"}
        data.sections.push(section_data);
    });

    var control_panel_created = false;
    var create_control_panel = function () {
        if (control_panel_created || X.find('#sfx_control_panel')) {
            return;
        }
        control_panel_created = true;

        var html = `<div id="sfx_control_panel">
                <div class="sfx_cp_header" v-tooltip="{icon:false,content:'The Social Fixer Control Panel is where tabs appear from filters you have defined and other controls may appear, depending on options selected.\n\nTo hide it completely, click the X in the upper right.'}"><span @click="close" style="float:right;display:inline-block;width:10px;cursor:pointer;text-align:center;border:1px solid #aaa;border-radius:4px;font-weight:normal;letter-spacing:0;">X</span>SFX Control Panel</div>
                <div class="sfx_cp_data">
                    <div class="sfx_cp_section" v-for="section in sections | orderBy 'order'">
                        <div class="sfx_cp_section_label" v-tooltip="{content:section.help,position:'right',delay:300}">{{{section.name}}}</div>
                        <div class="sfx_cp_section_content" id="{{section.id}}"></div>
                    </div>
                </div>
            </div>
            `;
        var actions = {
            "close":function() {
                var msg = "Hiding the Control Panel will:\n\n";
                msg += (FX.option('show_mark_all_read')?"     - Disable 'Mark All Read'\n":"");
                msg += (FX.option('always_show_tabs')?"     - Always Show Tab List\n":"");
                var filters = FX.storage('filters');
                var tab_filters = [];
                (filters||[]).forEach(function(f) {
                    try {
                        if (!f.enabled) { return; }
                        f.actions.forEach(function(a) {
                            if ("move-to-tab"==a.action || "copy-to-tab"==a.action) {
								tab_filters.push(f);
								return false;
							}
                        });
                    } catch(e){}
                });
                if (tab_filters.length) {
                    msg += "     - Disable the following filters because their actions move posts to tabs:\n";
                    tab_filters.forEach(function(f) {
                        msg += "          "+f.title+"\n";
                    });
                }
                if (confirm(msg)) {
                    FX.option('show_mark_all_read',false);
                    FX.option('always_show_tabs',false);
                    tab_filters.forEach(function(f) {
                        f.enabled = false;
                    });
					X.storage.save('filters',null,function() {
						alert("Refresh the page for the changes to take effect");
                    });
                }

            }
        };
        var v = template(document.body, html, data, actions).ready(function () {
            // Position it
            position_control_panel(null, null, false);

            // Make it draggable
            X.draggable('#sfx_control_panel', function (el, x, y) {
                position_control_panel(x, y, true);
            });
        });
        $vm = v.$view; // The Vue instance, to access the $set method
    };
    var position_control_panel = function (x, y, save) {
        var $cp = X('#sfx_control_panel');
        if (!$cp.length) {
            return;
        }
        var right = FX.option('control_panel_right');
        var bottom = FX.option('control_panel_bottom');
        var snap_tolerance = 15;
        var reposition = false;
        if (typeof x == "undefined" || x == null || typeof y == "undefined" || y == null) {
            // Re-position it with saved options
            x = +FX.option('control_panel_x');
            y = +FX.option('control_panel_y');
            reposition = true;
        }
        var h = $cp[0].offsetHeight;
        var w = $cp[0].offsetWidth;

        // Constrain it to the screen
        if (x < 1) {
            x = 1;
        }
        if (!reposition) {
            right = (window.innerWidth && x + w > (window.innerWidth - snap_tolerance)); // Off the right side, snap it to the right
        }
        if (y < 40) {
            y = 40;
        }
        if (!reposition) {
            bottom = (window.innerHeight && y + h > (window.innerHeight - snap_tolerance)); // Off the bottom, snap to bottom
        }

        // Position it
        if (right) {
            $cp.css({'right': 0, 'left': ''});
        }
        else {
            $cp.css({'left': x, 'right': ''});
        }
        if (bottom) {
            $cp.css({'bottom': 0, 'top': ''});
        }
        else {
            $cp.css({'top': y, 'bottom': ''});
        }

        // Persist the control panel location
        if (false !== save) {
            FX.option('control_panel_x', x, false);
            FX.option('control_panel_y', y, false);
            FX.option('control_panel_right', right, false);
            FX.option('control_panel_bottom', bottom, false);
            X.storage.save("options");
        }
    };
    // On window resize, make sure control panel is on the screen
    X(window).resize(function () {
        position_control_panel();
    });
    FX.on_options_load(function () {
        if (FX.option('always_show_control_panel')) {
            FX.on_page_load(function () {
                create_control_panel();
            });
        }
    });

    // If options are updated from another tab, move the control panel
    X.subscribe("storage/refresh", function (msg, data) {
        if ("options" == data.key) {
            position_control_panel(null, null, false);
        }
    });

    // When the page unloads to navigate, remove the control panel
    FX.on_page_unload(reset);
});

X.ready('debug_insertion_order', function() {
    FX.add_option('debug_show_insertion_order', {"section":"Debug", "title": 'Show Insertion Order', "description": "Highlight portions of posts that are lazily inserted after the post appears on the page.", "default": false});
    FX.on_option('debug_show_insertion_order', function() {
        FX.on_content_inserted(function ($o) {
            var insertion_step = $o.closest('.sfx_inserted').attr('sfx_step') || 0;
            insertion_step++;
            $o.attr('sfx_step', insertion_step);
            $o.addClass("sfx_insert_step_" + insertion_step);
            $o.addClass("sfx_inserted");
        });
    });
});


X.ready( 'debug_post_html', function() {
    // Add an item to the wrench PAI
    X.publish('post/action/add', {"section": "wrench", "label": "Show Post HTML", "message": "post/action/post_html"});
    X.subscribe("post/action/post_html", function (msg, data) {
        var html = X('<div>').append( X(document.getElementById(data.id)).clone(true) ).html().replace(/</g,'&lt;').replace(/>/g,'&gt;');

        var Ctrl = (/Macintosh|Mac OS X/.test(sfx_user_agent)) ? 'Command' : 'Ctrl';
        var content = `
        <div draggable="false">Click in the box, press ${Ctrl}+a to select all, then ${Ctrl}+c to copy.</div>
        <div draggable="false">
            <textarea style="white-space:pre-wrap;width:500px;height:250px;overflow:auto;background-color:white;">${html}</textarea>
        </div>
        `;
        bubble_note(content, {"position": "top_right", "title": "Post Debug HTML", "close": true});
    });
});

X.ready('debug_post_update_tracking', function() {
    FX.add_option('debug_post_update_tracking', {"section":"Debug", "title": 'Track Post Updates', "description": "Track how often a post receives DOM updates and display the timing", "default": false});
    FX.on_option('debug_post_update_tracking', function() {
        X.subscribe(['post/add','post/update'], function(msg,data) {
            var now = X.now();
            //var data = {"id": id, "dom": $post, "sfx_id": sfx_id};
            var $post = data.dom;
            var size = $post.innerText().length;

            if (msg=="post/add") {
                $post.attr('sfx_update_count','0');
                $post.attr('sfx_update_start',now);
                $post.attr('sfx_update_size',size);
                $post.attr('sfx_update_tracking','');
            }
            else if (msg=="post/update") {
                var count = +$post.attr('sfx_update_count');
                $post.attr('sfx_update_count',++count);
                var time = +$post.attr('sfx_update_start');
                var elapsed = (now-time);
                var original_size = $post.attr('sfx_update_size');
                var size_delta = size - original_size;

                $post.attr('sfx_update_tracking', $post.attr('sfx_update_tracking')+` @${elapsed}ms : ${data.inserted_tag}#${data.inserted_id||'null'} ${size_delta} bytes`);
            }
        });
    });
});


X.ready( 'disable_tooltips', function() {
    FX.add_option('disable_tooltips', {"title": 'Disable Tooltips', "section": "Advanced", "description": "If you are an Advanced user and no longer need to see the helpful tooltips that pop up when hovering over some things, you can entirely disable them here.", "default": false});

    FX.on_options_load(function () {
        if (FX.option('disable_tooltips')) {
            Vue.directive('tooltip', function (o) {
            });
        }
    });
});

// ========================================================
// Display Tweaks
// ========================================================
X.ready( 'display_tweaks', function() {
	FX.add_option('tweaks_enabled', {
		"section": "Display Tweaks"
		, "hidden": true
		, "default": true
	});
	FX.on_options_load(function () {
		var tweaks = FX.storage('tweaks');
		if (!tweaks || !tweaks.length || !FX.option('tweaks_enabled')) {
			return;
		}
		for (var i = 0; i < tweaks.length; i++) {
			if (tweaks[i].enabled && !tweaks[i].disabled) {
				X.css(tweaks[i].css, 'sfx_tweak_style_' + i);
			}
		}
	});
});

X.ready( 'donate', function() {
    FX.add_option('sfx_option_show_donate2',
        {
            "section": "Advanced"
            , "title": 'Show Donate Message'
            , "description": 'Show a reminder every so often to support Social Fixer development through donations.'
            , "default": true
        }
    );
    FX.on_options_load(function () {
        // Before showing the donate message, wait at least 5 days after install to not annoy people
        X.storage.get('stats', {}, function (stats) {
            if (stats && stats.installed_on && (X.now() - stats.installed_on > 5 * X.days) && userid != "anonymous") {
                X.task('sfx_option_show_donate', 30 * X.days, function () {
                    if (FX.option('sfx_option_show_donate2')) {
                        X.when('#sfx_badge', function () {
                            X.publish("menu/options", {"section": "Donate", "data": {"sfx_option_show_donate": true}});
                        });
                    }
                });
            }
        }, true);
    });
});

// =========================================================
// External CSS
// =========================================================
X.ready( 'external_css', function() {
    // XXX This should have a 'Test' button to immediately request it,
    // report if it's (1) missing, (2) not HTTPS (or bad certificate
    // chain blah blah), or (3) not mime type text/css.
    // OR: automatically test whenever changed...
    FX.add_option('external_css_url', {"section": "Advanced", "type": "text", "title": 'External CSS url', "description": 'URL of external CSS to be included in the page.  NOTE: browser may require HTTPS, and that server presents MIME type text/css.', "default": ""});
    FX.on_options_load(function () {
        var url = X.sanitize(FX.option('external_css_url'));
        if (url) {
            X.when('head', function ($head) {
                $head.append(`<link id="sfx_external_css" rel="stylesheet" type="text/css" href="${url}">`);
            });
        }
    });
});

// =========================================================
// Fix timestamps
// =========================================================
X.ready( 'fix_timestamps', function() {
	FX.add_option('fix_timestamps', {"title": 'Fix Post Timestamps', "description": 'Change post and comment timestamps from relative times (1hr) to absolute date/time.', "default": true});
    FX.add_option('fix_timestamps_short', {"title": 'Fix Post Timestamps', "description": 'Use short date/time format', "default": false});

	FX.on_options_load(function () {
		var use_short = FX.option('fix_timestamps_short');
		FX.on_content_loaded(function () {
			if (FX.option('fix_timestamps')) {
				X('html').addClass("sfx_fix_timestamps");

				var remove_current_year = new RegExp(", " + (new Date()).getFullYear());
				//<abbr class="_35 timestamp" data-utime="1369109136.835" title="Today">11:05pm</abbr>
				//<abbr class="timestamp livetimestamp" data-utime="1369109191" title="Monday, May 20, 2013 at 11:06pm">3 minutes ago</abbr>
				function fix_timestamps(o) {
					if (X.find('#MessagingDashboard')) {
						return;
					}
					o.find('abbr[data-utime][title]').each(function (i, a) {
						a = X(a);
						// If the timestamp is already in long form, don't apply the conversion
						if (/at/.test(a.html())) {
							a.addClass('sfx_no_fix_timestamp');
						}

						if (use_short) {
                            var utime = new Date(a.attr('data-utime')*1000);
                            if (utime) {
                                a.attr('title',utime.toLocaleString());
							}
						}
						else {
                            var title = a.attr('title') || "";
                            a.attr('title', title.replace(remove_current_year, ""));
						}
					});
				}

				fix_timestamps(X(document.body));

				X.subscribe(["post/add", "post/update"], function (msg, data) {
					fix_timestamps(data.dom);
				});

			}
		});
	});
});
X.ready( 'font_family', function() {
	FX.add_option('font_family', {
		"section": "User Interface"
		, "title": "Custom Font"
		, "description": "Set a custom font name using CSS syntax to override the default Facebook fonts. You may add multiple fonts, separated by comma."
		, "type": "text"
		, "default": ""
	});
	FX.on_options_load(function () {
		var font = FX.option('font_family');
		if (font) {
			var css = 'body, body *, #facebook body, #facebook body._-kb { font-family:' + font + ' !important; }';
			FX.css(css);
		}
	});
});

/*
    FX.on_selector(".uiContextualLayerPositioner", function($layer) {
        var profile_link = $layer.find('a[href*="ref=hovercard"]').first().attr('href');
        if (profile_link) {
            // Don't process this hovercard more than once
            if ($layer.attr("sfx_processed")) { return; }
            $layer.attr("sfx_processed",true);

            var id = X.match(profile_link,/\/([^\/\?]+)\?/);

            var $attrs = $layer.find("table .uiList");
            $attrs.append(`<li><b>UserID: </b>${id}</li>`);
            $attrs.append(`<li><div style="float:left;display:inline-block;font-weight:bold;">Comment: </div><div style="display:inline-block;float:left;border:1px solid #ccc;padding:2px;" contenteditable="true">This is a custom editable comment</div></li>`);
            $attrs.append(`<li style="clear:both;font-weight:bold;">Custom attribute 2</li>`);
        }
    })
*/
X.ready('friend_manager', function() {
	FX.add_option('friend_tracker', {"title": 'Friend Manager', "description": "Enable Friend Manager (Unfriend Tracker)", "default": true});

	FX.add_option('friend_tracker_alert_unfriend', {"hidden":true, "default":true});
  FX.add_option('friend_tracker_alert_name_change', {"hidden":true, "default":true});
	FX.add_option('friend_tracker_update_frequency', {"hidden":true, "default": 1 });

	// Load the friends pref
	var friends = X.clone(FX.storage('friends'));
	var custom_fields = FX.option('friend_custom_fields');

	X.subscribe("friends/options", function(msg,d) {
		// Render the friends dialog content
		var sections = [
			{"key":"alerts", "name":"Alerts"}
			,{"key":"options", "name":"Options"}
			,{"key":"list", "name":"Friend List"}
			,{"key":"details", "name":"Friend Details"}
			,{"key":"data", "name":"Raw Data"}
		];
		var dialog = `<div id="sfx_friend_dialog" class="sfx_dialog flex-column" style="transition: height .01s;">
	<div id="sfx_options_dialog_header" class="sfx_dialog_title_bar" style="cursor:move;" @click="collapse">
		Friend Manager - Social Fixer
		<div id="sfx_options_dialog_actions" draggable="false" >
			<input draggable="false" type="button" class="sfx_button secondary" @click.stop="close" value="Close">
		</div>
	</div>
	<div id="sfx_options_dialog_body" class="flex-row" draggable="false">
		<div id="sfx_options_dialog_sections">
			<div v-for="section in sections" @click="select_section(section.key)" class="sfx_options_dialog_section {{selected_section==section.key?'selected':''}}">{{section.name}}</div>
		</div>
		<div id="sfx_options_dialog_content">
			<div class="sfx_options_dialog_content_section">
				<div v-show="selected_section=='options'" style="line-height:32px;">
					<div><sfx-checkbox key="friend_tracker_alert_unfriend"></sfx-checkbox> Track and alert when someone unfriends or re-friends me</div>
					<div><sfx-checkbox key="friend_tracker_alert_name_change"></sfx-checkbox> Track and alert when a friend changes their name</div>
					<div>Check for friend changes after this many hours: <input type="number" min="1" max="99" v-model="frequency" @change="update_frequency()"/></div>
					<div>Update your friends list and check for changes immediately: <input type="button" @click="check_now()" class="sfx_button" value="Check Now"></div>
				</div>
				<div v-show="selected_section=='alerts'" id="sfx_friend_alerts"></div>
				<div v-show="selected_section=='list'">
					<div v-if="!list_loaded">Loading...</div>
					<div v-if="list_loaded">
						<div style="margin-bottom:3px;">
                            <b>Filter: </b><input type="text" v-model="filter">
                            <b>Show:</b>
                            <a @click.prevent="set_limit(10)" class="sfx_link">10</a>
                            <a @click.prevent="set_limit(50)" class="sfx_link">50</a>
                            <a @click.prevent="set_limit(250)" class="sfx_link">250</a>
                            <a @click.prevent="set_limit(500)" class="sfx_link">500</a>
                            <a @click.prevent="set_limit(9999)" class="sfx_link">all</a>
                            friends per page
                            <div v-show="limit<9999">
                                Showing {{limit}} friends per page.
                                <b>Current Page: </b> <a @click.prevent="set_page(-1)" class="sfx_link">&lt;&lt;</a> {{page+1}} <a @click.prevent="set_page(1)" class="sfx_link">&gt;&gt;</a>
                            </div>
                        </div>
						<table class="sfx_data_table">
							<thead>
								<tr>
									<th>&nbsp;</th>
									<th class="sortable" @click="order('name')">Name</th>
									<th class="sortable" @click="order('first')">First</th>
									<th class="sortable" @click="order('last')">Last</th>
									<th class="sortable" @click="order('id')">ID</th>
									<th class="sortable" @click="order('tracker.status')">Status</th>
									<th v-for="field in custom_fields">{{field}}</th>
									<th class="sortable" @click="order('id')">Added</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="f in friends | filterBy filter | orderBy orderkey sortorder | limitBy limit (page*limit)">
									<td><img src="{{f.photo}}" style="height:48px;width:48px;"></td>
									<td class="sfx_hover_link" style="font-weight:bold;" @click="select_user(f.id)">{{f.name}}</td>
									<td>{{f.first}}</td>
									<td>{{f.last}}</td>
									<td>{{f.id}}</td>
									<td>{{f.tracker.status}}</td>
									<td v-for="field in custom_fields">{{f.data[field]}}</td>
									<td>{{f.tracker.added_on | date}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div v-show="selected_section=='details'">
					<div v-if="!selected_user">
						Click on a friend in the "List" section.
					</div>
					<div v-else>
						<img src="{{selected_user.photo}}" style="float:left;margin-right:20px;"><span style="font-size:120%;font-weight:bold;">{{selected_user.name}}</span>
						<br style="clear:both;">

						This section will be used for future functionality that will enhance your friends list even more!

						<!--
						<b>Custom Fields</b> : Fields below are created by you and maintained in the Options tab. You can define any fields, and any value in those fields per user.
						<div v-for="field in custom_fields" style="margin:10px;border:1px solid #ccc;padding:10px;">
							<b>{{field}}</b>: <input v-model="selected_user.data[field]">
						</div>
						-->
					</div>
				</div>
				<div v-show="selected_section=='data'" style="white-space:pre;font-family:monospace;">{{friends | json}}</div>
			</div>
		</div>
	</div>
</div>
`;
		var data = {
			"sections": sections
			,"selected_section":"alerts"
			,"friends": friends
			,"list_loaded":false
			,"orderkey":"name"
			,"sortorder":1
			,"filter":""
			,"selected_user":null
			,"custom_fields":X.clone(custom_fields)
			,"frequency":FX.option("friend_tracker_update_frequency")
      ,"limit":50
      ,"page":0
		};
		if (d&&d.selected) {
			data.selected_section=d.selected;
    }
    // Count friends

		var actions= {
			"select_section": function (key) {
				this.selected_section=key;
				var self = this;
				if (key=="list") {
					// Lazy load the list for better performance
					setTimeout(function() {
						Vue.nextTick(function () {
							self.list_loaded = true;
						});
					},100);
				}
			},
			"select_user": function(id) {
				this.selected_user = friends[id];
				this.select_section('details');
			},
			"order": function(key) {
				this.sortorder = (this.orderkey == key) ? -1*this.sortorder : 1;
				this.orderkey = key;
			},
			"close": function() {
				X('#sfx_friend_dialog').remove();
			},
			"check_now": function() {
				X.publish("friends/update");
			},
			"update_frequency":function(val) {
				alert(this.frequency);
			},
      "set_limit":function(l) {
			this.limit=l;
			this.page=0;
      },
      "set_page":function(p) {
			this.page += p;
			if (this.page<0) { this.page=0; }
      }
		};
		template(document.body, dialog, data, actions).ready(function () {
			X.draggable('#sfx_friend_dialog');
			Vue.nextTick(function() {
				var alerts = find_alerts(friends);
				render_alerts(alerts, "just now", false, X('#sfx_friend_alerts'));
				if (!alerts || alerts.length==0) {
					actions.select_section("list");
				}
			});
		});

	});

	var retrieve_friends = function(cb) {
		X.ajax(`https://www.facebook.com/ajax/typeahead/first_degree.php?viewer=${userid}&filter[0]=user&options[0]=friends_only&__a=1&t=${X.now()}`, function(content) {
			try {
				var json = JSON.parse(content.replace(/^[^{]*/, ''));
				cb(json.payload.entries);
			} catch(e) {
				cb(null);
			}
		});
	};

	var update_friends = function(cb) {
		// Retrieve friends list
		var now = X.now();
		retrieve_friends(function(list) {
			if (list==null) {
				return cb(null);
			}

			var i, f, uid, sfx_friend;
			// For each friend, create the default record if needed
			for (i=0; i<list.length; i++) {
				f = list[i];
				uid = f.uid;
				sfx_friend = friends[uid];
				if (typeof sfx_friend == "undefined" || typeof sfx_friend.tracker=="undefined") {
					sfx_friend = {
						"id":f.uid
						,"name":f.text
						,"first":f.firstname
						,"last":f.lastname
						,"photo":f.photo
						,"tracker": {
							"added_on":now
							,"status":"friend"
							,"updated_on":now
							,"acknowledged_on":null
						}
					};
					friends[uid] = sfx_friend;
				}
				// check for updated photo and name
				if (f.text!=sfx_friend.name) {
					sfx_friend.old_name = sfx_friend.name;
					sfx_friend.name = f.text;
					sfx_friend.dirty = true;
				}
				if (sfx_friend.photo != f.photo) {
					sfx_friend.dirty = true;
				}
				sfx_friend.photo = f.photo;
				sfx_friend.checked_on = now;
			}

			// Loop over friends to check for changes
			for (uid in friends) {
				f = friends[uid];
				var tracker = f.tracker;

				// NEW Friend
				if (tracker.added_on==now) {
					f.dirty = true;
				}

				// RE-FRIENDED
				else if (now == f.checked_on && tracker.status!="friend") {
					tracker.status = "refriend";
					tracker.updated_on=now;
					tracker.acknowledged_on=null;
					f.dirty = true;
				}

				// REMOVED Friend
				// (Not found in new list, but they existed in old list)
				else if (now !== f.checked_on && (tracker.status=="friend" || tracker.status=="refriend")) {
					tracker.status="unfriended";
					tracker.updated_on=now;
					tracker.acknowledged_on=null;
					tracker.blocked=null;
					f.dirty = true;
				}

				// Update this friend record?
				if (f.dirty) {
					delete f.dirty;
					X.storage.set( "friends",uid,f,null,false );
				}
			}

			// Persist the updated friends list
			X.storage.save("friends", null, function(){ if (typeof cb=="function") { cb(); } });
		});
	};

	var find_alerts = function(friends) {
		var i;
		var alerts = [];
		var friend_tracker_alert_unfriend = FX.option('friend_tracker_alert_unfriend');
		var friend_tracker_alert_name_change = FX.option('friend_tracker_alert_name_change');

		for (i in friends) {
			var f = X.clone(friends[i]);
			if (!f || !f.tracker) { continue; }
			var t = f.tracker;
			var u = t.updated_on;
			var ack = t.acknowledged_on;

			if (friend_tracker_alert_unfriend) {
        // Unfriend
        if (t.status == "unfriended" && (!ack || ack < u)) {
          alerts.push({"type": "unfriend", "friend": f});
          // Fire off an ajax request to see if this person's account is still there?
					(function(friend_ref){
						X.ajax("https://m.facebook.com/"+friend_ref.id, function(content,status) {
              if (status==404) {
                friend_ref.removed = true;
              }
            });
          })(f);
        }
        // Re-friend
        if (t.status == "refriend") {
          alerts.push({"type": "refriend", "friend": f});
          // TODO: Check if blocked?
        }
      }
      if (friend_tracker_alert_name_change) {
        // name change
        if (f.old_name) {
          alerts.push({"type": "name_change", "friend": f});
        }
      }
		}
		return alerts;
	};

	var update_jewel_count = function(alerts) {
		if (!alerts) { return; }
		var count = alerts.length;
		// If only unfriend alerts exist, make it negative
		if (alerts.every( function(e){e.type=='unfriend';} )) {
			count = 0-count;
		}
		var el = document.getElementById('sfx_friend_jewel_count');
		if (el) {
			if (count==0) { X(el).remove(); }
			else { X(el).find('span').text(count); }
		}
		else {
			var $c = X('#requestsCountValue');
			var $clone = X($c.parent()[0].cloneNode(true)).addClass("sfx_jewelCount");
			$clone.find('*[id]').removeAttr('id');
			$clone.attr('id', 'sfx_friend_jewel_count');
			$clone.find('span').text(count).removeClass('hidden_elem');
			var $container = $c.closest('.jewelButton');
			$container.css('opacity', 1).append($clone);
		}
	};

	var show_alerts = function(ago) {
		if (!ago) { ago="just now"; }
		var alerts = find_alerts(friends);
		if (alerts && alerts.length>0) {
			X.when('#requestsCountValue', function($c) {
				update_jewel_count(alerts);
			});

			// Watch for an inner selector to load since it is async, then attach to an outer container
			FX.on_selector('.requestsJewelLinks', function () {
				if (document.getElementById('sfx_friend_changes')) { return; }
				render_alerts(alerts, ago, true, X('#fbRequestsList_wrapper'));
			});
		}
	};

	var render_alerts = function(alerts, ago, show_header, $prependTo) {
		try {
			var data = {
				"alerts": alerts
				,"ago":ago
				,"show_header":show_header
			};
			var t = `<div id="sfx_friend_changes" style="max-height:300px;overflow:auto;border-bottom:1px solid rgb(221,223,226);">
	<div v-if="show_header" style="padding:8px 12px 6px 12px;border-bottom:1px solid rgb(221,223,226);">
		<a @click.prevent="settings" style="float:right;">Settings</a>
		<div><span style="font-size:12px;font-weight:bold;">Friend Changes</span> <span style="font-size:11px;font-style:italic;">(via Social Fixer, updated {{ago}})</span></div>
	</div>
	<div v-if="alerts && alerts.length" v-for="a in alerts" style="padding:6px 12px;border-bottom:1px solid rgb(221,223,226);">
		<div style="float:right;height:50px;vertical-align:middle;line-height:50px;">
			<span @click="ok(a)" style="padding:5px 8px;font-size:12px;font-weight:bold;background-color:rgb(246, 247, 249);border:1px solid rgb(206, 208, 212);border-radius:2px;cursor:pointer;">Okay</span>
		</div>
		<img src="{{a.friend.photo}}" style="height:48px;margin-right:10px;display:inline-block;">
		<div style="display:inline-block;height:50px;overflow:hidden;">
			<template v-if="a.type=='name_change'">
				{{a.friend.old_name}}<br>
				is now known as<br>
				<a href="/{{a.friend.id}}" style="font-weight:bold;">{{a.friend.name}}</a><br>
			</template>
			<template v-if="a.type=='unfriend'">
				<a href="/{{a.friend.id}}" style="font-weight:bold;">{{a.friend.name}}</a><br>
				is no longer your friend. <span v-show="a.friend.removed" style="color:red;text-decoration:underline;cursor:help;" v-tooltip="This account is not available. This person has either disabled or removed their account, blocked you, or this is a result of a Facebook glitch (which is not uncommon). If they are still your friend but their profile is temporarily unavailable, they will appear as re-friended when it returns.">Account Not Found!</span><br>
				<i>{{a.friend.tracker.updated_on | ago}}</i>
			</template>
			<template v-if="a.type=='refriend'">
				<a href="/{{a.friend.id}}" style="font-weight:bold;">{{a.friend.name}}</a><br>
				is now your friend again! <br>
				<i>{{a.friend.tracker.updated_on | ago}}</i>
			</template>
		</div>
	</div>
	<div v-if="!alerts || alerts.length==0" style="line-height:50px;vertical-align:middle;color:rgb(117,117,117);background-color:rgb(246,247,249);text-align:center;">
		No changes
	</div>
</div>
`;
			var actions = {
				"ok": function(a) {
					var f = friends[a.friend.id];
					// Resolve based on the type of the alert
					if (a.type=="unfriend") {
						f.tracker.acknowledged_on=X.now();
					}
					else if (a.type=="refriend") {
						f.tracker.status="friend";
					}
					else if (a.type=="name_change") {
						delete f.old_name;
					}
					// Update and persist
					X.storage.set( "friends",f.id,f,function() {
						// Remove the alert
						var i = data.alerts.indexOf(a);
						data.alerts.splice(i,1);
						update_jewel_count(data.alerts);
					} );
				}
				,"settings": function() {
					X.publish("friends/options",{"selected":"options"});
				}
			};
			var $v = template(null, t, data, actions);
			$prependTo.prepend( $v.fragment );
		} catch (e) {
			alert(e);
		}
	};

	FX.on_options_load(function() {
		if (FX.option('friend_tracker')) {
      // Add wrench menu item
			X.publish("menu/add", {"section": "options", "item": {'html': 'Friend Manager', 'message': 'friends/options'}});

			// Update friends list and check for changes
			X.task('friend_update', FX.option('friend_tracker_update_frequency') * X.hours, function () {
				update_friends(show_alerts);
			}, function (run_on) {
				show_alerts(X.ago(run_on, null, true, true));
			});

			X.subscribe('friends/update', function () {
				update_friends(function () {
					show_alerts();
					alert("Update Complete");
				});
			});
		}
	});
});

// =========================================================
// Hide parts of the page
// =========================================================
X.ready( 'hide', function() {
// Add an Option to trigger the popup in case people don't find it in the wrench menu
	FX.add_option('hide_parts_of_page',
		{
			"section": "User Interface",
			"title": 'Hide Things',
			"description": 'Under the Wrench menu you will find an item to "Hide/Show Parts of the Page". Use this to hide or show different parts of the page that Social Fixer knows how to process. You can also access this functionality using the button to the right.',
			"type": "action",
			"action_message": "options/close,hide/on",
			"action_text": "Hide Things"
		}
	);
    FX.add_option('hide_parts_of_page_custom',
        {
            "section": "Debug",
            "title": 'Custom Hideables',
            "description": 'Define a custom JSON structure to be used instead of the server-side JSON for hideables.',
            "type": "textarea",
			"default":""
        }
    );
	FX.on_options_load(function () {
		var menu_item = {"html": 'Hide/Show Parts of the Page', "message": "hide/on", "tooltip": "Select which parts of the page you want to hide so they never show up."};
		X.publish("menu/add", {"section": "actions", "item": menu_item});

		var hiddens = FX.storage('hiddens') || {};
		if (typeof hiddens.length != "undefined") {
			hiddens = {};
		}

		var resolve = function (hideable) {
			var o = X(hideable.selector);
			if (hideable.parent) {
				o = o.closest(hideable.parent);
			}
			return o;
		};

		//  Two ways to hide things:
		// (1) Pure CSS if the hideable has no parent, or
		// (2) by watching for DOM insertions
		var id;
		var css = [], hiddens_with_parents = [];
		var set_css_rules = function () {
			css = [];
			hiddens_with_parents = [];
			for (id in hiddens) {
				var hidden = hiddens[id];
				var o = resolve(hidden);

				// (1)
				if (!hidden.parent) {
					css.push(`html:not(.sfx_hide_show_all) ${hidden.selector} { display:none !important; }`);
					o.addClass("sfx_hide_hidden");
				}
				// (2)
				else {
					hiddens_with_parents.push(hidden);
				}
			}
			if (css.length > 0) {
				var csstext = css.join(' ');
				X.css(csstext, 'sfx_hideables');
			}
		};
		set_css_rules();
		// Watch for DOM insertions and check for things to hide
		FX.on_content(function (o) {
			hiddens_with_parents.forEach(function (hidden) {
				X(hidden.selector, o).closest(hidden.parent).addClass("sfx_hide_hidden");
			});
		});

		X.subscribe("hide/on", function () {
			// Display the bubble popup
			var content = X(`
					<div class="sfx_hide_bubble">
						<div>Areas of the page that are available to be hidden are highlighted in green. Click a box to mark it as hidden, and it will turn red to mark your choice.</div>
						<div>Facebook's code changes frequently, and new panels or objects are also created. In these cases, Social Fixer will automatically update itself as code can be found to hide content areas. If you find an area you would like to hide that Social Fixer doesn't know about yet, suggest it in the Support Group and we'll see if we can add it. Unfortunately, not everything can be hidden with code.</div>
						<div>When finished, click the button below. Hidden areas will vanish and remain hidden each time you visit Facebook. To see them again, use the same menu item under the wrench.</div>
						<div><input type="button" class="sfx_button" value="Done Hiding"></div>
					</div>
				`);

			var popup = bubble_note(content, {"position": "top_right", "title": "Hide Parts of the Page"});
			popup.find('.sfx_button').click(function () {
				X.publish("hide/off");
				popup.remove();
			});

			var show_hideables = function (content) {
                if (content && content.hideables && content.hideables.length > 0) {
                    X('html').addClass('sfx_hide_show_all');
                    content.hideables.forEach(function (hideable) {
                        var o = resolve(hideable);
                        var hidden = false;
                        if (o.length) {
                            var el = o[0];
                            var overflow = o.css('overflow');
                            o.css('overflow', 'auto');
                            var rect = el.getBoundingClientRect();
                            var h = rect.height;
                            var w = rect.width;
                            o.css('overflow', overflow);
                            hideable.name = X.sanitize(hideable.name);
                            var wrapper = X(`<div title="${hideable.name}" class="sfx_hide_frame" style="width:${w}px;height:${h}px;font-size:${h / 1.5}px;line-height:${h}px;">X</div>`);
                            if (hiddens[hideable.id]) {
                                wrapper.addClass("sfx_hide_frame_hidden");
                                hidden = true;
                            }
                            wrapper.click(function () {
                                hidden = !hidden;
                                wrapper.toggleClass("sfx_hide_frame_hidden", hidden);
                                o.toggleClass("sfx_hide_hidden", hidden);
                                if (hidden) {
                                    hiddens[hideable.id] = hideable;
                                }
                                else {
                                    delete hiddens[hideable.id];
                                }
                            });
                            o.before(wrapper);
                        }
                    });
                }
            };
			var hide_parts_of_page_custom = FX.option('hide_parts_of_page_custom');
			if (hide_parts_of_page_custom) {
				try {
                    var json = JSON.parse(hide_parts_of_page_custom);
                    show_hideables(json);
                } catch(e) {
					alert("ERROR Parsing custom JSON: "+e.toString());
				}
			}
			else {
                X.ajax("https://matt-kruse.github.io/socialfixerdata/hideable.json", show_hideables);
			}
		});

		X.subscribe("hide/off", function () {
			X('html').removeClass('sfx_hide_show_all');
			X('.sfx_hide_frame').remove();
			// Persist hidden areas
			X.storage.save('hiddens', hiddens, function () {
				set_css_rules();
			});
		});
	});
});

// Hide hovercards
X.ready('trending_bars', function() {
    FX.add_option('hide_hovercards', {
        "section": "User Interface"
        , "title": "Hide Hovercards"
        , "description": "Don't show the popup panel when hovering over user names or profile photos, unless the Ctrl key is held down."
        , "default": false
    });
    FX.on_option('hide_hovercards', function () {
        X.capture(window, 'mouseover', function (e) {
            var $t = X.target(e, true);
            if ($t.parent().is('a')) {
                $t = $t.parent();
            }
            var hc = $t.attr('data-hovercard');
            if (e.ctrlKey) {
                var xhc = $t.attr('data-x-hovercard');
                if (xhc) {
                    $t.attr('data-hovercard', xhc);
                }
            }
            else if ($t.is('a') && !/\/pubcontent/.test(hc)) {
                $t.attr('data-x-hovercard', hc);
                $t.removeAttr('data-hovercard');
            }
        });
    });
});

// =========================================================
// Add Post Action Icons, including Mark Read
// =========================================================
X.ready( 'mark_read', function() {
	FX.add_option('post_actions', {"title": 'Post Actions', "description": "Add actions to individual posts to Mark them as 'Read', etc.", "default": true});
	FX.add_option('show_mark_all_read', {"title": 'Mark All Read/Undo', "description": "Add a Mark All Read button and Undo button to the control panel to Mark all visible posts as 'Read' or undo Marking posts as 'Read'.", "default": false});
	FX.add_option('mark_all_read_next', {"section": "Advanced", "title": 'Mark All Read - Next', "description": "When Mark All Read is clicked and filter tabs are visible, automatically jump to the next tab with unread stories.", "default": true});
	FX.add_option('clear_cache', {"title": 'Clear "Mark Read" Story Data', "section": "Advanced", "description": "Clear all cached data about posts' 'Read' status. This will un-Mark all 'Read' posts!", "type": "action", "action_text": "Clear Data Now", "action_message": "cache/clear"});
	FX.add_option('clean_cache_frequency', {"title": '"Mark Read" Cache Cleaning Frequency', "section": "Advanced", "description": "Clean the cache of old story data every how many hours?", "type": "number", "default": 24});
	FX.add_option('clean_cache_age', {"title": '"Mark Read" Cache Cleaning Age', "section": "Advanced", "description": "When cleaning cached story data, clean post data that is this many days old.", "type": "number", "default": 4});
	FX.add_option('hide_mark_read_groups', {"title": 'Mark Read', "description": "Hide posts marked as 'Read' when viewing a Group.", "default": true});
	FX.add_option('hide_mark_read_pages', {"title": 'Mark Read', "description": "Hide posts marked as 'Read' when viewing a Page or Timeline.", "default": true});
	FX.add_option('mark_read_display_message', {"title": 'Mark Read', "description": "Display a small post timestamp where posts Marked as 'Read' and hidden would have been.", "default": true});
	FX.add_option('mark_read_style', {"section": "Advanced", "title": 'Mark Read Style', "description": "CSS style to be applied to posts that are Marked 'Read'.", "type": "text", "default": "outline:1px dashed red;"});

	(function () {
		var postdata_log = {}; // Keyed by DOM id!
		X.subscribe("log/postdata", function (msg, data) {
			if (!data.id) {
				return;
			}
			if (!postdata_log[data.id] || !postdata_log[data.id][0]) {
				postdata_log[data.id] = [X.now()];
			}
			postdata_log[data.id].push(((X.now() - postdata_log[data.id][0]) / X.seconds).toFixed(3) + ' ' + data.message);
		});
		X.subscribe("log/postdata/get", function (msg, data) {
			if (typeof data.callback != "function") {
				return;
			}
			data.callback(postdata_log[data.id]);
		});
	})();
// Clear Cache
	X.subscribe("cache/clear", function (msg, data) {
		X.storage.save("postdata", {}, function () {
			alert("Social Fixer cache has been cleared");
		});
	});
	FX.on_options_load(function () {
		if (!FX.option('post_actions')) {
			return;
		}

		// Write out CSS based on "mark read" style
		var mark_read_style = FX.option('mark_read_style');
		FX.css(`
		.sfx_post_read > *:not(.sfx_post_marked_read_note), 
		#facebook #pagelet_soft_permalink_posts .sfx_post_read > *,
		#facebook[sfx_context_permalink="true"] .sfx_post_read > * {
			${mark_read_style};
		}
	`);

		// Add an option to the wrench menu to toggle stories marked as read
		var menu_item = {"html": "Show posts marked 'Read'", "message": "post/toggle_read_posts", "tooltip": "If posts are Marked as 'Read' and hidden, toggle their visibility."};
		X.publish("menu/add", {"section": "actions", "item": menu_item});

		var show_read = false;
		X.subscribe("post/toggle_read_posts", function () {
			show_read = !show_read;
			menu_item.html = show_read ? "Hide posts Marked 'Read'" : "Show posts Marked 'Read'";
			X('html').toggleClass("sfx_show_read_posts", show_read);
			FX.reflow();
		});

		// Logic to handle post actions
		var postdata = FX.storage('postdata') || {};

		// On a regular interval, clean out the postdata cache of old post data
		// Also do other data cleansing tasks here
		var clean_cache_frequency = FX.option('clean_cache_frequency') || +FX.options['clean_cache_frequency']['default'] || 24;
		var clean_cache_age = FX.option('clean_cache_age') || +FX.options['clean_cache_age']['default'] || 7;
		X.task('clean_postdata_cache', clean_cache_frequency * X.hours, function () {
			var post_id, cleaned_count = 0;
			if (!postdata) {
				return;
			}
			for (post_id in postdata) {
				var data = postdata[post_id];
				var read_on = data.read_on;
				var age = X.now() - read_on;
				var clean_me = 0;
				// Purge old items
				if (age > clean_cache_age * X.days) {
					clean_me = 1;
				}
				// post_id can be all digits or colon-separated digits like "12345:2"
				if (!/^[0-9:]+$/.test(post_id)) {
					clean_me = 1;
				}
				// read_on is a date stamp: must be just digits
				// (could also check for plausible time range?)
				if (!/^[0-9]+$/.test(data.read_on)) {
					clean_me = 1;
				}
				// Left over from 742eb642d241b4521a79139a5146dc3205a3c83b
				if (data.last_updated) {
					delete postdata[post_id].last_updated;
					cleaned_count++;
				}
				if (clean_me) {
					delete postdata[post_id];
					cleaned_count++;
				}
			}
			// Save the postdata back to storage
			if (cleaned_count > 0) {
				X.storage.save("postdata", postdata);
			}
		});

		var init_postdata = function (id) {
			if (typeof postdata[id] == "undefined") {
				postdata[id] = {};
			}
			return postdata[id];
		};

		var mark_all_added = false;
		FX.on_page_unload(function () {
			mark_all_added = false;
		});

		FX.on_content_loaded(function () {
			var action_data = {
				id: null,
				sfx_id: null,
				$post: null,
				read: false,
				show_mark_read: true,
				filters_enabled: FX.option('filters_enabled'),
				wrench_items: [],
				filter_items: []
			};
			var actions = {
				"mark_unmark": function (e) {
					var data = {"sfx_id": action_data.sfx_id};
					data.dir = e.shiftKey ? "above"
					         : e.ctrlKey || e.altKey || e.metaKey ? "below"
					         : "post";
					X.publish("post/mark_unmark", data);
				}
				, "action_menu_click": function (item) {
					var key, data = {"id": action_data.id, "sfx_id": action_data.sfx_id};
					if (item.data) {
						for (key in item.data) {
							data[key] = item.data[key];
						}
					}
					X.publish(item.message, data);
				}
			};
			var Ctrl = (/Macintosh|Mac OS X/.test(sfx_user_agent)) ? 'Command' : 'Ctrl';
			var html = `<div id="sfx_post_action_tray">
			<div v-if="show_mark_read && !read" @click="mark_unmark($event)" v-tooltip="Mark this post as 'Read', so it doesn't appear in your feed anymore. Shift+Click Marks as 'Read' all posts above here; ${Ctrl}+Click Marks below here.">&#10004;</div>
			<div v-if="show_mark_read && read" @click="mark_unmark($event)" v-tooltip="Un-Mark this post as 'Read', so it shows up in your feed again.">X</div>
			<div v-if="!show_mark_read" @click="mark_unmark($event)" v-tooltip="Marking this post 'Read' will only hide it in the current session, as it lacks a unique Facebook identifier. Posts like this may be Markable in the future.">&#9083;</div>
			<div v-if="wrench_items.length>0" @click="wrench_menu()" id="sfx_mark_read_wrench" class="mark_read_wrench"></div>
			<div v-if="filters_enabled && filter_items.length>0" @click="filter_menu()" id="sfx_mark_read_filter" class="mark_read_filter"></div>
		</div>
		<div v-if="wrench_items.length>0" id="sfx_post_wrench_menu" class="sfx_post_action_menu">
			<div v-for="item in wrench_items" @click="action_menu_click(item)">{{item.label}}</div>
		</div>
		<div v-if="filter_items.length>0" id="sfx_post_filter_menu" class="sfx_post_action_menu">
			<div v-for="item in filter_items" @click="action_menu_click(item)">{{item.label}}</div>
		</div>
		`;

			var undo = {
				posts_marked_read: []
				, undo_disabled: true
			};
			var hide_read = function ($post) {
				if (!$post.hasClass('sfx_post_read')) {
					if (FX.context.type == "groups" && !FX.option('hide_mark_read_groups')) {
						return;
					}
					if (FX.context.type == "profile" && !FX.option('hide_mark_read_pages')) {
						return;
					}
					if (FX.option('mark_read_display_message')) {
						var ts = $post.find('abbr.timestamp,abbr.sfx_no_fix_timestamp').attr('title');
						ts = ts ? 'Read: [ ' + ts + ' ]' : 'Hidden Post';
						var note = X(`<div class="sfx_post_marked_read_note" title="This post was hidden because it was previously Marked as 'Read'. Click to view.">${ts}</div>`);
						note.on('click', function () {
							note.parent().toggleClass('sfx_post_read_show');
						});
						$post.prepend(note);
					}
					$post.addClass('sfx_post_read');
					X.publish("post/hide_read", {"id": $post.attr('id')});
				}
			};
			var unhide_read = function ($post) {
				if ($post.hasClass('sfx_post_read')) {
					$post.removeClass('sfx_post_read');
					X.publish("post/unhide_read", {"id": $post.attr('id')});
				}
			};
			// Mark Read/Unread controllers
			X.subscribe("post/mark_unread", function (msg, data) {
				var sfx_id = data.sfx_id;
				var $post = data.post || action_data.$post;

				undo.posts_marked_read = [$post];
				undo.mark = true;
				undo.undo_disabled = false;

				var pdata = postdata[sfx_id];
				delete pdata.read_on;

				X.storage.set("postdata", sfx_id, pdata, function () {
					unhide_read($post);
				}, false !== data.save);
			});
			X.subscribe("post/mark_read", function (msg, data) {
				var sfx_id = data.sfx_id;
				var $post = data.post || action_data.$post;

				undo.posts_marked_read = [$post];
				undo.mark = false;
				undo.undo_disabled = false;

				var pdata = init_postdata(sfx_id);
				var t = X.now();
				pdata.read_on = t;

				postdata[sfx_id] = pdata;
				X.storage.set("postdata", sfx_id, pdata, function () {
					hide_read($post);
					FX.reflow();
				}, false !== data.save);
			});
			X.subscribe(["post/mark_all_read", "post/mark_unmark"], function (msg, data) {
				if (typeof data.dir == "undefined") {
					data.dir = "all";
				}
				var $curr_post = data.post || action_data.$post;
				var mark = (data.dir == "all") || !$curr_post || !$curr_post.hasClass('sfx_post_read');
				if (data.dir == "post") {
					X.publish(mark ? "post/mark_read" : "post/mark_unread", data);
					return;
				}
				var marked = 0;
				var not_marked = 0;
				var marking = (data.dir == "all" || data.dir == "above");
				var unmark_one = false;
				var posts = [];
				var pivot_post = $curr_post ? +$curr_post.attr('sfx_post') : null;
				if ($curr_post && data.dir == "above") {
					// Any existing selection gets extended by shift-click,
					// then distorted by hiding & reflow; just abolish it:
					window.getSelection().removeAllRanges();
				}
				X(`*[sfx_post]`).each(function () {
					var $post = X(this);
					var this_post = +$post.attr('sfx_post');
					if (this_post == pivot_post) {
						if (data.dir == "above") {
							// Mark Read Above excludes the current post
							marking = false;
							// Must be on a 'Read' post to invoke Unmark,
							// so it *includes* current post
							if (!mark) {
								unmark_one = true;
							}
						}
						else if (data.dir == "below") {
							// Mark Read Below includes the current post
							marking = true;
						}
					}
					if (!marking && !unmark_one) {
						not_marked++;
						return;
					}
					unmark_one = false;
					if ("none" != $post.css('display') && mark == !$post.hasClass('sfx_post_read')) {
						posts.push($post);
						var pub_msg = mark ? "post/mark_read" : "post/mark_unread";
						var pub_data = {
							sfx_id: $post.attr('sfx_id'),
							save: false, // Don't persist until the end
							post: $post
						};
						X.publish(pub_msg, pub_data);
						marked++;
					}
				});
				if (marked > 0) {
					X.storage.save("postdata");
					undo.posts_marked_read = posts;
					undo.mark = !mark;
					undo.undo_disabled = false;
					FX.reflow(data.dir == "above" && !show_read);
				}
				if (mark && not_marked == 0 && FX.option('mark_all_read_next')) {
					X.publish("filter/tab/next");
				}
			});
			X.subscribe("post/undo_mark_read", function (msg, data) {
				if (undo.posts_marked_read.length > 0) {
					var undo_msg = undo.mark ? "post/mark_read" : "post/mark_unread";
					undo.posts_marked_read.forEach(function ($post) {
						var sfx_id = $post.attr('sfx_id');
						X.publish(undo_msg, {"sfx_id": sfx_id, "save": false, "post": $post});
					});
					X.storage.save("postdata");
					undo.posts_marked_read = [];
					undo.undo_disabled = true;
					FX.reflow();
				}
				else {
					alert("Nothing to Undo!");
				}
			});

			var add_post_action_tray = function () {
				if (document.getElementById('sfx_post_action_tray') == null) {
					template(document.body, html, action_data, actions);
					X('#sfx_mark_read_wrench').click(function (ev) {
						var menu = X('#sfx_post_wrench_menu');
						menu.css('left', ev.pageX + 'px');
						menu.css('top', ev.pageY + 'px');
						menu.show();
						ev.stopPropagation();
					});
					X('#sfx_mark_read_filter').click(function (ev) {
						var menu = X('#sfx_post_filter_menu');
						menu.css('left', ev.pageX + 'px');
						menu.css('top', ev.pageY + 'px');
						menu.show();
						ev.stopPropagation();
					});
				}
			};
			X(window).click(function () {
				X('#sfx_post_filter_menu, #sfx_post_wrench_menu').hide();
			});

			X.subscribe(["post/add", "post/update"], function (msg, data) {
				// If it's already read, hide it
				var sfx_id = data.sfx_id;
				if (sfx_id) {
					if (typeof postdata[sfx_id] != "undefined") {
						if (postdata[sfx_id].read_on) {
							hide_read(data.dom);
						}
					}
				}

				if (msg == "post/add") {
					var sfx_post = +data.dom.attr('sfx_post');
					// Add the "Mark All Read" button to the control panel if necessary
					if (!mark_all_added && FX.option('show_mark_all_read')) {
						mark_all_added = true;
						X.publish("cp/section/add", {
							"name": "Post Controller"
							, "order": 10
							, "id": "sfx_cp_post_controller"
							, "help": "Act on all visible posts at once"
						});
						// Wait until that has been rendered before attaching to it
						Vue.nextTick(function () {
							// The content container will have been created by now
							var html = `<div class="sfx_cp_mark_all_read" style="text-align:center;">
                    		<input type="button" class="sfx_button" value="Mark All Read" @click="mark_all_read">
                    		<input type="button" class="sfx_button" v-bind:disabled="undo_disabled" value="Undo ({{posts_marked_read.length}})" @click="undo_mark_read">
                		</div>`;
							var methods = {
								"mark_all_read": function () {
									X.publish("post/mark_all_read");
								},
								"undo_mark_read": function () {
									X.publish("post/undo_mark_read");
								}
							};
							template('#sfx_cp_post_controller', html, undo, methods);
						});
					}

					// When the mouse moves over the post, add the post action tray
					data.dom.on('mouseenter', function (e) {
						// Don't add it if it's already present.
						// Also allow user control: adding PAI can be slow with
						// many posts loaded.
						// Not Shift- or Ctrl- as those are mark-all-above/below
						// and might well be pressed 'on descent into' a post's
						// prospective PAI.
							if (e.altKey || e.metaKey || action_data.$post == data.dom) {
							return;
						}
						action_data.$post = data.dom;
						action_data.id = action_data.$post.attr('id');
						action_data.sfx_id = action_data.$post.attr('sfx_id');
						if (!action_data.sfx_id) {
							action_data.show_mark_read = false;
						}
						else {
							action_data.show_mark_read = true;
							action_data.read = (postdata[action_data.sfx_id] && postdata[action_data.sfx_id].read_on);
						}
						add_post_action_tray();
						data.dom.append(document.getElementById('sfx_post_action_tray'));
					});
				}
			}, true);

			X.subscribe("post/action/add", function (msg, data) {
				if (data.section == "wrench") {
					action_data.wrench_items.push(data);
				}
				else if (data.section == "filter") {
					action_data.filter_items.push(data);
				}
			}, true);

			X.publish('post/action/add', {"section": "wrench", "label": "Post Data", "message": "post/action/postdata"});
			X.subscribe('post/action/postdata', function (msg, data) {
				var log = [];
				X.publish("log/postdata/get", {
					"id": data.id, "callback": function (pdata) {
						log = pdata;
					}
				});
				log = log.slice(1).join('<br>');
				var data_content = JSON.stringify(postdata[action_data.id] || {}, null, 3);
				var content = `
				<div draggable="false">This popup shows what Social Fixer remembers about this post.</div>
				<div draggable="false" class="sfx_bubble_note_data">Post ID: ${action_data.sfx_id}<br>DOM ID: ${action_data.id}</div>
				<div draggable="false">Data stored for this post:</div>
				<div draggable="false" class="sfx_bubble_note_data">${data_content}</div>
				<div draggable="false">Processing Log:</div>
				<div draggable="false" class="sfx_bubble_note_data">${log}</div>
			`;
				// Remove the previous one, if it exists
				X('#sfx_post_data_bubble').remove();
				var note = bubble_note(content, {"position": "top_right", "title": "Post Data", "id": "sfx_post_data_bubble", "close": true});
			});
		});
	});
});

FX.add_option('disabled', {"hidden": true, "default":false});
X.beforeReady(function(options) {
	// Prevent modules from running until we decide if SFX is disabled, which we can't do until options are loaded
	if (!options) { return false; }
	// Check to see if SFX is disabled
	if (FX.option('disabled')) {
		// If we're disabled, we still need to add the wrench
		init_wrench(true);
		FX.fire_content_loaded();
		return false;
	}
});
X.ready( 'menu', function() {
	init_wrench(false);
});
var init_wrench = function(disabled) {
	FX.add_option('badge_x', {"hidden": true, "default": -64});
	FX.add_option('badge_y', {"hidden": true, "default": 5});
	FX.add_option('reset_wrench_position', {"title": 'Find Wrench Menu', "section": "Advanced", "description": "If your wrench menu badge somehow gets positioned so you can't see it, click here to reset its position to the upper right corner.", "type": "action", "action_text": "Find Wrench Menu", "action_message": "menu/reset_position"});
	FX.add_option('news_alerts', {"title": 'Social Fixer News', "section": "Advanced", "description": "Check for official news or blog posts from the Social Fixer team so you don't miss out on updates, updated filters, important news, etc. (Estimated frequency is one post a week)", "default": true});
	var actions = {
		"add": function (section, menu_item) {
			data.sections[section].items.push(menu_item);
		}
		, "click": function (message) {
			if (message) {
				X.publish(message);
			}
		}
		, "toggle": function () {
			var $badge = X('#sfx_badge');
			var $menu = X('#sfx_badge_menu');
			if ($menu.css('display') == 'none') {
				$menu.css('visibility', 'hidden');
				$menu.show();
				// Figure out which direction to pop the menu
				var window_width = document.body.clientWidth || window.innerWidth;
				var window_height = window.innerHeight;
				var left = $badge[0].offsetLeft;
				var top = $badge[0].offsetTop;

				if (left <= window_width / 2) {
					$menu.addClass('right').removeClass('left');
				}
				else {
					$menu.addClass('left').removeClass('right');
				}

				if (top <= window_height / 2) {
					$menu.addClass('down').removeClass('up');
				}
				else {
					$menu.addClass('up').removeClass('down');
				}
				$menu.css('visibility', '');
			}
			else {
				X('#sfx_badge_menu').hide();
			}
		}
		, "hide": function () {
			X('#sfx_badge_menu').hide();
		}
		, "notify": function (id, count) {
			if (count > 0) {
				X.publish("notify/set", {"target": '#' + id, "count": count});
			}
			else {
				X.publish("notify/clear", {"target": '#' + id});
			}
			update_total_notify();
		}
	};
	var update_total_notify = function () {
		var count = 0;
		X('#sfx_badge_menu').find('.sfx_notification_count').forEach(function (c) {
			count += (+c.innerHTML || 0);
		});
		data.notify_count = count;
	};
	var data = {
		"notify_count": 0,
		"sections": {
			"options": {
				"title": "Options",
				"items": [],
				"order": 1
			},
			"actions": {
				"title": "Actions",
				"items": [],
				"order": 2
			},
			"links": {
				"title": "Links",
				"items": [],
				"order": 3
			},
			"debug": {
				"title": "Debug",
				"items": [],
				"order": 4
			},
			"other": {
				"title": "Other",
				"items": [],
				"order": 5
			}
		}
	};
	var html = `
		<div id="sfx_badge" @click.stop="toggle">
			<div class="sfx_notification_count" v-if="notify_count>0">{{notify_count}}</div>
			<div id="sfx_badge_menu">
				<div id="sfx_badge_menu_wrap">
					<div v-for="section in sections | orderBy 'order'" class="sfx_menu_section" id="sfx_menu_section_{{$key}}">
						<div v-if="section.items.length" class="sfx_menu_section_title">{{section.title}}</div>
						<div v-for="item in section.items" id="{{item.id}}" class="sfx_menu_item" @click="click(item.message);" data-hover="tooltip" data-tooltip-position="left" data-tooltip-delay="500" data-tooltip-content="{{item.tooltip}}">
							<a v-if="item.url" href="{{item.url}}" class="sfx_menu_item_content" style="display:block;">{{{item.html}}}</a>
							<div v-else class="sfx_menu_item_content">{{{item.html}}}</div>
						</div>
					</div>
				</div>
			</div>
			<div id="sfx_badge_logo"></div>
		</div>
	`;

	FX.on_content_loaded(function (doc) {
		if (X.find('#login_form')) {
			return;
		} // Don't show on login

		// If the badge already exists for some reason, remove it and re-add it
		// Only known reason is >1 SFX running at once.  Collect version of other
		// SFX, then save our version in the DOM to facilitate warning about it.
		var $old_badge = X('#sfx_badge');
		if ($old_badge.length) {
			var old_buildstr = $old_badge.attr('sfx_buildstr') ||  // other SFX's name
			                   "old";                              // or older nameless
			$old_badge.remove();
		}

		// Attach the menu template to the DOM
		template("body", html, data, actions).ready(function () {
			position_badge(null, null, false);
			X.draggable('#sfx_badge', function (el, x, y) {
				position_badge(x, y);
			});
		});
		var $new_badge = X('#sfx_badge');
		$new_badge.attr('sfx_buildstr', sfx_buildstr);
		if (old_buildstr) {
			$new_badge.attr('old_buildstr', old_buildstr);
		}

		// If this is the first install, show the user where the badge is
		FX.on_options_load(function () {
			var stats = FX.storage('stats');
			if (!stats.installed_on) {
				var note = sticky_note("#sfx_badge", "left", "Social Fixer is installed! Start here &rarr;", {"close": false});
				X('#sfx_badge').mouseover(function () {
					note.remove();
					stats.installed_on = X.now();
					X.storage.set('stats', "installed_on", X.now());
				});
			}
		});
	});

	var position_badge = function (x, y, save) {
		var $badge = X('#sfx_badge');
		var reposition = false;
		if (typeof x == "undefined" || x == null || typeof y == "undefined" || y == null) {
			// Re-position it with saved options
			x = +FX.option('badge_x');
			y = +FX.option('badge_y');
			reposition = true;
		}
		var h = $badge[0].offsetHeight, w = $badge[0].offsetWidth;
		var window_width = document.body.clientWidth || window.innerWidth;
		var window_height = window.innerHeight;
		// If dragged, adjust
		if (!reposition) {
			if (x < 1) {
				x = 1;
			}
			else if (x > (window_width - w)) {
				x = window_width - w;
			}
			if (y < 1) {
				y = 1;
			}
			else if (y > (window_height - h)) {
				y = window_height - h;
			}

			// If the position is on the right half or bottom half of the screen, store it as negative so it's relative to the opposite edge
			if (x > window_width / 2) {
				x = x - window_width;
			}
			if (y > window_height / 2) {
				y = y - window_height;
			}
		}
		else {
			// Make sure it's on the screen
			if (x > (window_width - w)) {
				x = window_width - w;
			}
			else if (x < -window_width) {
				x = 0;
			}
			if (y > (window_height - h)) {
				h = window_height - h;
			}
			else if (y < -window_height) {
				y = 0;
			}
		}

		// Position it
		$badge.css({'left': (x > 0 ? x : (window_width + x)), 'top': (y > 0 ? y : (window_height + y))});

		// Persist the control panel location
		if (false !== save) {
			FX.option('badge_x', x, false);
			FX.option('badge_y', y, false);
			X.storage.save("options");
		}
	};

	actions.add('links', {'id': 'sfx_badge_menu_item_page', 'html': 'Social Fixer News/Blog', url: 'https://www.facebook.com/socialfixer', 'message': 'menu/news_clicked'});
	actions.add('links', {'html': 'Support Group', 'url': 'https://www.facebook.com/groups/412712822130938/'});
	if (disabled) {
		actions.add('options', {'html': 'Social Fixer is <span style="color:red;font-weight:bold;">Disabled</span>.<br>Click here to Enable.</span>', 'message': 'menu/enable'});

		// Create a keyboard shortcut to restore the wrench menu in case it gets lost
		X(window).on('keypress', function (e) {
			if ((e.keyCode == 24 || e.key == "X") && e.ctrlKey && e.shiftKey) {
				X.publish("menu/reset_position");
			}
		});
	}
	else {
		actions.add('options', {'html': 'Social Fixer Options <span style="font-size:10px;color:#aaa;">(Ctrl+Shift+X)</span>', 'message': 'menu/options'});
		actions.add('links', {'html': 'Donate To Support Development', 'url': 'http://socialfixer.com/donate.html'});
		actions.add('other', {'html': 'Version ' + sfx_buildstr, 'message': 'menu/about_clicked'});
		actions.add('other', {'html': 'Disable Social Fixer', 'message': 'menu/disable'});
	}

	// Listen for enable/disable
	X.subscribe('menu/disable', function() {
		if (confirm("This will disable all Social Fixer functionality, but the wrench will still appear so you can re-enable.\n\nThe page will be automatically refreshed after disabling.\n\nAre you sure you want to disable?")) {
			X.storage.set('options','disabled',true,function() {
				window.location.reload();
			});
		}
	});
	X.subscribe('menu/enable', function() {
		X.storage.set('options','disabled',false,function() {
			window.location.reload();
		});
	});

	// Listen for messages to add items to the menu
	X.subscribe('menu/add', function (msg, data) {
		actions.add(data.section, data.item);
	}, true);

	X(window).click(actions.hide);
	window.addEventListener('resize', function () {
		position_badge();
	});
	// If options are updated from another tab, move the control panel
	X.subscribe("storage/refresh", function (msg, data) {
		if ("options" == data.key) {
			position_badge(null, null, false);
		}
	});

	X.subscribe("menu/reset_position", function (msg, data) {
		var undef;
		X.storage.set('options', {'badge_x': undef, 'badge_y': undef}, function () {
			position_badge();
		});
	});

	// About
	X.subscribe('menu/about_clicked', function () {
		X.publish("menu/options", {"section": "About"});
	});

	// If disabled, stop now!
	if (disabled) { return; }

	// NEWS CHECK
	// Check for Posts to the Social Fixer Page and alert if there are new ones
	FX.on_options_load(function () {
		X.task('news_alerts', 1 * X.seconds, function () {
			if (FX.option('news_alerts')) {
				X.when('#sfx_badge_menu_item_page', function ($item) {
					var now = X.now();
					X.storage.get('stats', {}, function (stats) {
						if (!stats || !stats.sfx_news_checked_on) {
							X.storage.set("stats", "sfx_news_checked_on", now, function () {
							});
						}
						else {
							X.ajax("https://matt-kruse.github.io/socialfixerdata/news.json", function (json) {
								if (!json || !json.news) {
									return;
								}
								var count = 0, title = null;
								json.news.reverse().forEach(function (news) {
									if (news.time > stats.sfx_news_checked_on) {
										$item.find('a').attr('href', news.href);
										title = X.sanitize(news.title);
										count++;
									}
								});
								actions.notify('sfx_badge_menu_item_page', count);

								if (count>0) {
                                    // Add a "clear notification" link
                                    var $clear = X(`<div style="text-align:right;font-size:11px;color:#777;" class="sfx_link sfx_clear_notification_link">clear notification</div>`);
                                    $clear.click(function () {
                                        clear_news_notification();
                                    });
                                    $item.before($clear);
                                }
								if (count == 1) {
									if (title) {
										$item.find('.sfx_menu_item_content').append('<div class="sfx_news_title">' + title + '</div>'); // sanitized
									}
								}
							});
						}
					});
				});
			}
		});
	});
	var clear_news_notification = function() {
        X.storage.set("stats", "sfx_news_checked_on", X.now(), function () {
            actions.notify('sfx_badge_menu_item_page', 0);
            X('.sfx_news_title,.sfx_clear_notification_link').remove();
        });
	};
	X.subscribe('menu/news_clicked', function (msg, data) {
		// Clear when clicked
        clear_news_notification();
	});

	// Create a keyboard shortcut to open Options
	X(window).on('keypress', function (e) {
		if ((e.keyCode == 24 || e.key == "X") && e.ctrlKey && e.shiftKey) {
			X.publish("menu/options");
		}
	});
};

// =========================================================
// For Message links to open Messenger instead of a chat box
// =========================================================
X.ready( 'message_links_to_messenger', function() {
	FX.add_option('messages_open_in_full_window', {"title": 'Open Messages In full Window', "description": "When clicking a chat message in the blue bar dropdown, open the message in a full window instead of a chat box.", "default": false});
	FX.on_options_load(function () {
		if (FX.option('messages_open_in_full_window')) {
			X.bind(document.documentElement, 'click', function (e) {
				var $t = X.target(e, true);
				var href = $t.closest('a.messagesContent[href*="facebook.com/messages"]').attr('href');
				var role = $t.attr('role') || '';
				if (href && role != 'button') {
					window.open(href);
					e.stopPropagation();
					e.preventDefault();
				}
			}, true);
		}
	});
});

// =========================================================
// Force the main Newsfeed to the Most Recent view
// =========================================================
X.ready( 'most_recent', function() {
	FX.add_option('auto_switch_to_recent_stories', {"title": 'Automatically Switch to Most Recent view of the main Newsfeed', "description": "Facebook defaults to Top Stories. This option detects this view and automatically switches you to the chronological Most Recent view.", "default": false});
    FX.add_option('auto_switch_hide_message', {"section":"Advanced", "title": 'Hide Most Recent switch messages', "description": "When automatically switched to the Most Recent news feed, hide the message that appears to inform you of the switch.", "default": false});
	FX.add_option('redirect_home_links', {"section": "User Interface", "title": 'Home Links', "description": 'Force the F logo and Home link in the blue header bar to reload the page so Social Fixer features continue to work.', "default": true});
	FX.on_options_load(function () {
		// Redirect F logo home link
		var recent_href = function(old_href, addend) {
			if (/[&?]sk=h_chr/.test(old_href)) {
				return old_href;
			}
			addend = 'sk=h_chr' + (addend ? '&' + addend : '');
			if (/[&?]sk=h_nor/.test(old_href)) {
				return old_href.replace(/sk=h_nor/, addend);
			}
			var frag = '';
			if (/#/.test(old_href)) {
				/([^#]*)(#.*)/.test(old_href);
				frag = RegExp.$2;
				old_href = RegExp.$1;
			}
			return old_href + (/\?/.test(old_href) ? '&' : '?') + addend + frag;
		};
		var already_most_recent = function(href) {
			if (/sk=h_chr/.test(href)) {
				return true;
			}
			var uiIconTextTxt = X('.uiIconText').text();
			// English-only test
			if (uiIconTextTxt && /Viewing most recent stories/.test(uiIconTextTxt)) {
				return true;
			}
			// All-languages test, as long as classes don't change
			var c24Txt = X('._c24').text();
			if (c24Txt && uiIconTextTxt && c24Txt == uiIconTextTxt && c24Txt.length > 0) {
				return true;
			}
			return false;
		};
		if (FX.option('redirect_home_links')) {
			var capture = function ($a) {
				X.capture($a, 'click', function (e) {
					if (FX.option('auto_switch_to_recent_stories')) {
						$a.attr('href', recent_href($a.attr('href')));
					}
					e.stopPropagation();
				});
			};
			FX.on_page_load(function () {
				X.when('h1[data-click="bluebar_logo"] a', capture);
				X.when('div[data-click="home_icon"] a', capture);
			});
		}
		// Force Most Recent
		FX.on_content_loaded(function () {
			if (FX.option('auto_switch_to_recent_stories')) {
				var redirect = false;
				var href = window.location.href;
                if (/sfx_switch=true/.test(href)) {
                    if (!FX.option('auto_switch_hide_message')) {
                        var note = sticky_note(X('#sfx_badge')[0], 'left', 'Auto-switched to Most Recent', {close: false});
                        setTimeout(function () {
                            note.remove();
                        }, 3.0 * X.seconds);
                    }
                    return;
                }
				if (already_most_recent(href)) {
					return;
				}
				var redirect_now = function () {
					// Failsafe in case redirect doesn't cause reload
					setTimeout(function () {
						X(document.body).css('opacity', '1');
					}, 2.0 * X.seconds);
					X(document.body).css('opacity', '.2');
					setTimeout(function () {
						window.location.href = recent_href(href, 'sfx_switch=true');
					}, 0.2 * X.seconds);
				};
				if (/sk=h_nor/.test(href)) {
					redirect_now();
				}
				else if (!/sk=h_chr/.test(href)) {
					X.poll(function (count) {
						if (!X.find('div[id^="topnews_main_stream"]')) {
							return false;
						}
						redirect_now();
					}, 200, 20);
				}
			}
		});
	});
});

// =========================================================
// Popup Notifications in a new window
// =========================================================
X.ready( 'notification_popup', function() {
    FX.add_option('notification_popup', {"section": "User Interface", "title": 'Notification Popup', "description": "Add a link in the Notifications dropdown header to pop up Notifications in a new window.", "default": true});
    FX.add_option('notification_popup_auto_refresh', {"section": "User Interface", "title": 'Notification Popup', "description": "Automatically refresh the notification popup window when new notifications arrive.", "default": true});
    FX.add_option('notification_popup_new_tab', {"hidden": true, "title": 'Notification Popup', "description": "Open notifications in a new tab instead of the opener", "default": false});
    FX.add_option('notification_popup_group', {"hidden": true, "title": 'Notification Popup', "description": "Group Notifications on the same post together", "default": true});

    FX.on_options_load(function () {
        if (!FX.option('notification_popup')) {
            return;
        }

        var notif_window = null;
        X.when('#fbNotificationsFlyout .uiHeaderActions', function ($actions) {
            // Separator
            $actions.prepend(X(`<span role="presentation" aria-hidden="true"> · </span>`));

            var Ctrl = (/Macintosh|Mac OS X/.test(sfx_user_agent)) ? 'Command' : 'Ctrl';
            var $link = X(`<a href="https://www.facebook.com/notifications?sfx_notification_popup=true" target="SFX_NOTIFICATIONS" data-hover="tooltip" data-tooltip-position="below" data-tooltip-content="Social Fixer: Open a Notifications Dashboard in a new window (with ${Ctrl}: new tab).")>Open In Popup</a>`);
            $link.click(function (e) {
                if (e.ctrlKey) { return true; }
                try {
                    notif_window.focus();
                }
                catch (e) {
                    var h = 500;
                    try {
                        h = window.outerHeight;
                    } catch (e) {
                    }
                    notif_window = window.open($link.attr('href'), 'SFX_NOTIFICATIONS', `width=480,height=${h},top=0,left=0`);
                }
                return false;
            });
            $actions.prepend($link);

            // FB's JS shifts the tab-focus to the first focusable element when you open pop-outs
            // Add a dummy element at the front of header actions to prevent the main link's tooltip from appearing
            // https://www.facebook.com/1669346019760488
            $actions.prepend(X(`<span style="outline:0;" tabindex="0">&nbsp;</span>`));
        });
        // Capture clicks in the notification popup window
        if (/sfx_notification_popup=true/.test(location.href)) {
            FX.add_html_class('sfx_notification_popup');
            var notif_context = {};
            if (FX.option('notification_popup_group')) {
                FX.on_content(function ($c) {
                    var selector = 'li[data-gt]:not(.sfx_notification)';
                    var $li = ($c.is(selector)) ? $c : $c.find(selector);
                    $li.forEach(function (li) {
                        try {
                            var $li = X(li);
                            var id = JSON.parse($li.attr('data-gt')).content_id;
                            if (!id) {
                                return;
                            }
                            if (typeof notif_context[id] == "undefined") {
                                // This is the first notif for this context, leave it
                                notif_context[id] = $li;
                                $li.addClass("sfx_notification");
                            }
                            else {
                                // Move this li up to be under the first one
                                notif_context[id].after(li);
                                $li.addClass("sfx_sub_notification");
                                $li.addClass("sfx_notification");
                            }
                        } catch (e) {
                        }
                    });
                });
            }
            FX.on_content_loaded(function () {
                X.bind('#content', 'click', function (e) {
                    var $a = X.target(e, true).closest('a');
                    var href = $a.attr('href');
//                    if ($a.attr('role') == "button") {
//                        return;
//                    }
                    var target = null;
                    if (href && href != "" && href != "#" && /notif/.test(href)) {
                        e.stopPropagation();
                        e.preventDefault();
                        try {
                            if (!target) {
                                target = window.opener;
                            }
                            if (FX.option('notification_popup_new_tab')) {
                                target.open(href);
                            }
                            else {
                                target.location.href = href;
                            }
                            target.focus();
                        }
                        catch (e) {
                            target = window.open(href);
                        }
                        X('.sfx_notification_selected').removeClass('sfx_notification_selected');
                        $a.closest('li').addClass('sfx_notification_selected');
                    }
                    return true;
                }, true);
                // Add a place for SFX controls
                var data = {
                    "count": null,
                    "new_tab": FX.option('notification_popup_new_tab'),
                    "group": FX.option('notification_popup_group')
                };
                var actions = {
                    "refresh": function () {
                        window.location.reload();
                    }
                    , "mark_all_read": function () {
                        var $a = X('#fbNotificationsJewelHeader ~ * > a[role="button"]');
                        X.ui.click($a, false);
                    }
                    , "toggle_new_tab": function () {
                        FX.option('notification_popup_new_tab', !FX.option('notification_popup_new_tab'), true);
                    }
                    , "toggle_group": function () {
                        FX.option('notification_popup_group', !FX.option('notification_popup_group'), true, this.refresh);
                    }
                };

                var html = `
                    <div id="sfx_notification_popup_header">
                        <div id="sfx_notification_popup_header_actions">
                            <span class="sfx_link" @click.capture.prevent.stop="mark_all_read">Mark All Read</span>
                            <span>
                                <input type="checkbox" v-model="new_tab" @click="toggle_new_tab"> Open links in new tab/window
                            </span>
                            <span>
                                <input type="checkbox" v-model="group" @click="toggle_group"> Group Notifications
                            </span>
                        </div> 
                        <div v-if="count>0">{{count}} new notification{{count>1?"s":""}}. <a href="#" @click.prevent="refresh">Refresh</a>.</div>
                    </div>
                `;
                var $t = template(null, html, data, actions);
                X('#globalContainer').before($t.fragment);
                // Check for new notifications and alert
                setInterval(function () {
                    var count = X('#notificationsCountValue').text();
                    if (count && data.count == null) {
                        data.count = count;
                    }
                    else if (count && +count > 0 && +count > data.count) {
                        if (FX.option('notification_popup_auto_refresh')) {
                            window.location.reload();
                        }
                        data.count = +count;
                    }
                }, 2000);
            });
        }
    });
});

X.ready('notify', function() {
    X.subscribe("notify/set", function (msg, data) {
        var $target = X(data.target);
        var position = $target.css('position');
        if (position == "" || position == "static") {
            $target.css('position', 'relative');
        }
        var $counter = $target.find('.sfx_notification_count');
        if (!$counter.length) {
            $target.prepend('<div class="sfx_notification_count">0</div>');
            $counter = $target.find('.sfx_notification_count');
        }
        var count = +$counter.html() || 0;
        if (typeof data.count != "undefined") {
            count = data.count;
        }
        if (typeof data.increment != "undefined") {
            count++;
        }
        $counter.text(count);
    });

    X.subscribe("notify/increment", function (msg, data) {
        data.increment = true;
        X.publish("notify/set", data);
    });

    X.subscribe("notify/clear", function (msg, data) {
        X(data.target).find('.sfx_notification_count').remove();
    });
});

X.ready('options', function() {
    FX.add_option('show_filtering_tooltips', {"hidden":true, "default": true});
	FX.on_options_load(function () {
		// Update Tweaks and Filtes in the background every so often
		X.task('update_filter_subscriptions', 4 * X.hours, function () {
			update_subscribed_filters(FX.storage('filters'));
		});
		X.task('update_tweak_subscriptions', 4 * X.hours, function () {
			update_subscribed_tweaks(FX.storage('tweaks'));
		});

		// Update user subscriptions with data from the server
		var retrieve_filter_subscriptions = function (user_filters, callback) {
			X.ajax("https://matt-kruse.github.io/socialfixerdata/filters.json", function (content) {
				if (content && content.filters && content.filters.length > 0) {
					// Mark the subscribed ones
					mark_subscribed_filters(content.filters, user_filters);
					if (callback) {
						callback(content.filters);
					}
				}
			});
		};
		// Mark filter subscriptions as subscribed if the user has added them
		var mark_subscribed_filters = function (subscriptions, user_filters) {
			// Build up a list of user filter id's
			var subscription_ids = {};
			if (user_filters && user_filters.length) {
				user_filters.forEach(function (f) {
					if (f.id) {
						subscription_ids[f.id] = true;
					}
				});
			}
			subscriptions = subscriptions || [];
			if (subscriptions && subscriptions.length) {
				subscriptions.forEach(function (filter) {
					filter.subscribed = (!!subscription_ids[filter.id]);
				});
			}
		};
		var update_subscribed_filters = function (user_filters, callback) {
			retrieve_filter_subscriptions(user_filters, function (subscriptions) {
				if (!subscriptions || subscriptions.length < 1) {
					return;
				}
				var any_dirty = false;
				// Loop through the subscriptions to see if user filters need to be updated
				var subscribed = {};
				if (user_filters && user_filters.length) {
					user_filters.forEach(function (f) {
						if (f.id) {
							subscribed[f.id] = f;
						}
					});
				}
				subscriptions = subscriptions || [];
				if (subscriptions && subscriptions.length) {
					subscriptions.forEach(function (filter) {
						var user_filter = subscribed[filter.id];
						if (!user_filter) {
							return;
						}
						var key, dirty = false;
						// Map the properties of the subscription to the user filter
						// Don't overwrite the entire object because things like 'enabled' are stored locally
						for (key in filter) {
							if (key == "subscribed" || key == "enabled") {
								continue;
							}
							// Check to see if the user filter data needs updated
							// If user has customized actions, don't over-write, otherwise update
							if (key == 'actions' && filter.configurable_actions && user_filter.custom_actions) {
								continue;
							}
							if (JSON.stringify(user_filter[key]) != JSON.stringify(filter[key])) {
								user_filter[key] = filter[key];
								dirty = true;
							}
						}
						if (dirty) {
							user_filter.subscription_last_updated_on = X.now();
							any_dirty = true;
						}
					});
				}
				// if any of the subscriptions were dirty, save the filters
				if (any_dirty) {
					X.storage.save('filters', X.clone(user_filters), function () {
					});
				}
				if (callback) {
					callback(subscriptions);
				}
			});
		};

		// Update user subscriptions with data from the server
		var retrieve_tweak_subscriptions = function (user_tweaks, callback) {
			X.ajax("https://matt-kruse.github.io/socialfixerdata/tweaks.json", function (content) {
				if (content && content.tweaks && content.tweaks.length > 0) {
					// Mark the subscribed ones
					mark_subscribed_tweaks(content.tweaks, user_tweaks);
					if (callback) {
						callback(content.tweaks);
					}
				}
			});
		};
		// Mark tweak subscriptions as subscribed if the user has added them
		var mark_subscribed_tweaks = function (subscriptions, user_tweaks) {
			// Build up a list of user tweak id's
			var subscription_ids = {};
			if (user_tweaks && user_tweaks.length) {
				user_tweaks.forEach(function (f) {
					if (f.id) {
						subscription_ids[f.id] = true;
					}
				});
			}
			subscriptions = subscriptions || [];
			if (subscriptions && subscriptions.length) {
				subscriptions.forEach(function (tweak) {
					tweak.subscribed = (!!subscription_ids[tweak.id]);
				});
			}
		};
		var update_subscribed_tweaks = function (user_tweaks, callback) {
			retrieve_tweak_subscriptions(user_tweaks, function (subscriptions) {
				if (!subscriptions || subscriptions.length < 1) {
					return;
				}
				var any_dirty = false;
				// Loop through the subscriptions to see if user tweaks need to be updated
				var subscribed = {};
				if (user_tweaks && user_tweaks.length) {
					user_tweaks.forEach(function (f) {
						if (f.id) {
							subscribed[f.id] = f;
						}
					});
				}
				subscriptions = subscriptions || [];
				if (subscriptions && subscriptions.length) {
					subscriptions.forEach(function (tweak) {
						var user_tweak = subscribed[tweak.id];
						if (!user_tweak) {
							return;
						}
						var key, dirty = false;
						// Map the properties of the subscription to the user tweak
						// Don't overwrite the entire object because things like 'enabled' are stored locally
						for (key in tweak) {
							if (key == "subscribed") {
								continue;
							}
							// Check to see if the user tweak data needs updated
							if (JSON.stringify(user_tweak[key]) != JSON.stringify(tweak[key])) {
								user_tweak[key] = tweak[key];
								dirty = true;
							}
						}
						if (dirty) {
							user_tweak.subscription_last_updated_on = X.now();
							any_dirty = true;
						}
					});
				}
				// if any of the subscriptions were dirty, save the tweaks
				if (any_dirty) {
					X.storage.save('tweaks', X.clone(user_tweaks), function () {

					});
				}
				if (callback) {
					callback(subscriptions);
				}
			});
		};

		// Options Dialog
		var sections = [
            {'name': 'Search', 'description': 'Options with a title or description matching your search text (at least 3 characters) will appear below.'}
			, {'name': 'General', 'description': ''}
			, {'name': 'Hide Posts', 'description': ''}
			, {'name': 'Filters', 'description': ''}
			, {'name': 'User Interface', 'description': ''}
			, {'name': 'Display Tweaks', 'description': ''}
			, {'name': 'Tips', 'description': 'These are not features of Social Fixer - they are useful Facebook tips that users may not know about, or that I think are especially useful.'}
			, {'name': 'Advanced', 'description': ''}
			, {'name': 'Experiments', 'description': 'These features are a work in progress, not fully functional, or possibly confusing to users.'}
			, {'name': 'Data Import/Export', 'description': ''}
			, {'name': 'Support', 'url': 'https://matt-kruse.github.io/socialfixerdata/support.html', 'property': 'content_support'}
			, {'name': 'Donate', 'url': 'https://matt-kruse.github.io/socialfixerdata/donate.html', 'property': 'content_donate'}
			, {'name': 'About', 'url': 'https://matt-kruse.github.io/socialfixerdata/about.html', 'property': 'content_about'}
            , {'name': 'Debug', 'className':'sfx_debug_tab', 'description':`These are debugging tools to help developers and those needing support. These are not normal features. Play with them if you wish, or visit them if asked to by the Support Team.`}
		];
		var data = {
			"action_button": null
			, "show_action_buttons": true
			, "sections": sections
			, "filters": null
			, "show_filtering_tooltips": FX.option('show_filtering_tooltips')
			, "editing_filter": null
			, "editing_filter_index": -1
			, "filter_subscriptions": null
			, "tweak_subscriptions": null
			, "tweaks": null
			, "editing_tweak": null
			, "editing_tweak_index": -1
			, "show_advanced": false
			, "options": FX.options
			, "user_options": ""
			, "user_options_message": null
			, "storage_size": JSON.stringify(X.storage.data).length
			, "supports_download_attribute": 'download' in document.createElement('a') // https://stackoverflow.com/a/12112905
			, "content_about": "Loading..."
			, "content_donate": "Loading..."
			, "sfx_option_show_donate": false
			, "content_support": "Loading..."
			, "buildstr": sfx_buildstr
			, "user_agent": sfx_user_agent
			, "userscript_agent": sfx_userscript_agent
			, "support_notes": null
			, "searchtext":null
		};
		X.subscribe('menu/options', function (event, event_data) {
			if (!event_data) { event_data={}; }
			try {
				if (X('#sfx_options_dialog').length) {
					return;
				}

				// Prepare data for options dialog display.
				// We can't work on the real options object, in case the user cancels.
				// So we need to work on a copy, then overlay it when they save.

				// Convert the options into section-based options
				sections.forEach(function (section_object) {
					var sectionName = section_object.name;
					section_object.options = [];
					if (event_data.section) {
						section_object.selected = (event_data.section == sectionName);
					}
					else {
						section_object.selected = (sectionName == 'General');
					}
					for (k in FX.options) {
						var opt = FX.options[k];
						if ((sectionName == 'General' && !opt.section) || (sectionName == opt.section)) {
							opt.newValue = opt.value = FX.option(opt.key);
							section_object.options.push(opt);
						}
						if (opt.title && opt.title==event_data.highlight_title) {
							opt.highlighted=true;
						}
					}

					section_object.options = section_object.options.sort(function (a, b) {
						var x = (a.title || "") + " " + (a.description || "");
						var y = (b.title || "") + " " + (b.description || "");
						if (x < y)
							return -1;
						if (x > y)
							return 1;
						return 0;
					});
				});

				var filters = X.clone(X.storage.data['filters']);
				filters.forEach(function (o) {
					// Make sure every filter has rules and actions
					if (!X.def(o.rules)) {
						o.rules = [];
					}
					if (!X.def(o.actions)) {
						o.actions = [];
					}
				});
				data.filters = filters;

				var tweaks = X.clone(X.storage.data['tweaks']);
				data.tweaks = tweaks;

				if (X.support_notes) {
					data.support_notes = X.support_notes;
				}

				// Render the options dialog content
				var dialog = `<div id="sfx_options_dialog" class="sfx_dialog flex-column" style="transition: height .01s;">
	<div id="sfx_options_dialog_header" class="sfx_dialog_title_bar" style="cursor:move;" @click="collapse">
		Social Fixer
		<div id="sfx_options_dialog_actions" v-if="show_action_buttons" draggable="false" >
			<input draggable="false" v-if="action_button=='done_editing_filter'" class="sfx_options_dialog_panel_button sfx_button" type="button" value="Done Editing Filter" @click.stop="close_filter">
			<input draggable="false" v-if="action_button=='done_editing_tweak'" class="sfx_options_dialog_panel_button sfx_button" type="button" value="Done Editing Tweak" @click.stop="close_tweak">
			<input draggable="false" v-if="!action_button" class="sfx_button" type="button" @click.stop="save" value="Save Changes">
			<input draggable="false" type="button" class="sfx_button secondary" @click.stop="cancel" value="Cancel">
		</div>
	</div>
	<div id="sfx_options_dialog_body" class="flex-row" draggable="false">
		<div id="sfx_options_dialog_sections">
			<template v-for="section in sections">
				<template v-if="section.name=='Search'">
					<div @click="select_section(section)" class="sfx_options_dialog_section {{section.selected?'selected':''}} {{section.className}}"><input style="width:90%;" placeholder="Search..." @keyup="search" v-model="searchtext"></div>
				</template>
				<template v-else>
					<div @click="select_section(section)" class="sfx_options_dialog_section {{section.selected?'selected':''}} {{section.className}}">{{section.name}}</div>
				</template>
			</template>
		</div>
		<div id="sfx_options_dialog_content">
			<div v-if="section.selected" v-for="section in sections" class="sfx_options_dialog_content_section">
				<template v-if="section.name=='Filters'">
					<div id="sfx_options_dialog_filters" class="sfx_options_dialog_filters">

					    <div v-if="!editing_filter" class="sfx_options_dialog_filter_list">
					        <div class="">
					            <span class="sfx_button" style="float:right;background-color:green;" onclick="window.open('https://github.com/matt-kruse/SocialFixer/wiki/Post-Filtering#filter-list','SFX_FILTER_HELP','width=1024,height=600');"><b>[?]</b> Open Filter Help</span>
					            Post Filters let you hide posts, put them in tabs, or change their appearance based on their content. They execute in the order below for each post.
					            <br style="clear:both;">
					        </div>
					        <div class="sfx_option" style="margin:10px 10px;font-size:14px;float:left;">
					            <input id="filters_enabled" type="checkbox" v-model="options.filters_enabled.newValue"/><label for="filters_enabled"></label> Post Filtering enabled
					        </div>
					        <div class="sfx_option" style="margin:10px 10px;font-size:14px;float:left;">
					            <input id="filters_enabled_pages" type="checkbox" v-model="options.filters_enabled_pages.newValue"/><label for="filters_enabled_pages"></label> Filter on Pages/Timelines
					        </div>
					        <div class="sfx_option" style="margin:10px 10px;font-size:14px;float:left;">
					            <input id="filters_enabled_groups" type="checkbox" v-model="options.filters_enabled_groups.newValue"/><label for="filters_enabled_groups"></label> Filter in Groups
					        </div>
					        <div class="sfx_options_dialog_panel_header" style="clear:both;">Active Filters</div>
					        <div>
					            <input type="button" class="sfx_button" value="Create A New Filter" @click="add_filter">
					        </div>
					        <table class="sfx_options_dialog_table">
					            <thead>
					            <tr>
					                <th>Title</th>
					                <th>Description</th>
					                <th style="text-align:center;">Actions</th>
					                <th style="text-align:center;">Stop On<br>Match</th>
					                <th style="text-align:center;">Enabled</th>
					            </tr>
					            </thead>
					            <tbody>
					            <tr v-for="filter in filters" v-bind:class="{'!sfx_options_dialog_option_enabled':filter.disabled}">
					                <td class="sfx_options_dialog_option_title">{{filter.title}}<div v-if="filter.id" style="font-weight:normal;font-style:italic;color:#999;margin-top:5px;">(Subscription)</div></td>
					                <td class="sfx_options_dialog_option_description">
					                    {{filter.description}}
					                    <div v-if="filter.id && filter.subscription_last_updated_on" style="font-style:italic;color:#999;margin-top:5px;">Subscription last updated: {{ago(filter.subscription_last_updated_on)}}</div>
					                </td>
					                <td class="sfx_options_dialog_option_action" style="white-space:nowrap;">
					                    <span class="sfx_square_control" v-tooltip="Edit" @click="edit_filter(filter,$index)">&#9998;</span>
					                    <span class="sfx_square_control sfx_square_delete"  v-tooltip="Delete" @click="delete_filter(filter)">&times;</span>
					                    <span class="sfx_square_control" v-tooltip="Move Up (Hold Ctrl to move to top)" @click="up(filter, $event)">&#9650;</span>
					                    <span v-if="$index<filters.length-1" class="sfx_square_control" v-tooltip="Move Down" @click="down(filter)">&#9660;</span>
					                </td>
					                <td style="text-align:center;">
					                    <input id="sfx_stop_{{$index}}" type="checkbox" v-model="filter.stop_on_match"/><label for="sfx_stop_{{$index}}" data-tooltip-delay="100" v-tooltip="If a post matches this filter, don't process the filters that follow, to prevent it from being double-processed. For most situations, this should remain checked."></label>
					                </td>
					                <td style="text-align:center;">
					                    <input id="sfx_filter_{{$index}}" type="checkbox" v-model="filter.enabled"/><label for="sfx_filter_{{$index}}"></label>
					                </td>
					            </tr>
					            </tbody>
					        </table>

					        <div v-if="filter_subscriptions">
					            <div class="sfx_options_dialog_panel_header">Filter Subscriptions</div>
					            <div>The pre-defined filters below are available for you to use. These "Filter Subscriptions" will be automatically maintained for you, so as Facebook changes or more keywords are needed to match a specific topic, your filters will be updated without you needing to do anything!</div>
					            <table class="sfx_options_dialog_table">
					                <thead>
					                <tr>
					                    <th>Title</th>
					                    <th>Description</th>
					                    <th>Actions</th>
					                </tr>
					                </thead>
					                <tbody>
					                <tr v-for="filter in filter_subscriptions" v-bind:class="{'sfx_filter_subscribed':filter.subscribed}">
					                    <template v-if="version_check(filter)">
					                    <td class="sfx_options_dialog_option_title">{{filter.title}}</td>
					                    <td class="sfx_options_dialog_option_description">{{filter.description}}</td>
					                    <td class="sfx_options_dialog_option_action">
					                        <span class="sfx_square_add" v-tooltip="Add To My Filters" @click="add_subscription(filter)">+</span>
					                    </td>
					                    </template>
					                </tr>
					                </tbody>
					            </table>
					        </div>
					    </div>

					    <div v-if="editing_filter" class="sfx_options_dialog_panel">
					        <div style="float:right;">
					            <!--<input type="checkbox" class="normal" v-model="show_filtering_tooltips" @click="toggle_tooltips"> Show Tooltips-->
					            <span class="sfx_button" style="background-color:green;" onclick="window.open('https://github.com/matt-kruse/SocialFixer/wiki/Post-Filtering#edit-filter','SFX_FILTER_HELP','width=1024,height=600');"><b>[?]</b> Open Filter Help</span>
					        </div>
					        <div class="sfx_panel_title_bar">
					            Edit Filter
					            <br style="clear:both;">
					        </div>
					        <div class="sfx_info" v-if="editing_filter.id">
					            This filter is a subscription, so its definition is stored on the SocialFixer.com server and updated automatically for you. If you wish to edit this filter, you can do so but it will "break" the subscription and your copy will be local and no longer updated automatically as Facebook changes.
					            <br><input type="button" class="sfx_button" value="Convert to local filter" @click="editing_filter.id=null"/>
					        </div>
					        <div class="sfx_label_value">
					            <div>Title:</div>
					            <div><input class="sfx_wide" v-model="editing_filter.title" v-bind:disabled="editing_filter.id"/></div>
					        </div>
					        <div class="sfx_label_value">
					            <div>Description:</div>
					            <div><input class="sfx_wide" v-model="editing_filter.description" v-bind:disabled="editing_filter.id"></div>
					        </div>
					        <div class="sfx_options_dialog_filter_conditions sfx_options_dialog_panel">
					            <div class="sfx_panel_title_bar">
					                IF ...
					                <br style="clear:both;">
					            </div>
					            <div v-for="rule in editing_filter.rules">
					                <div class="flex-row-container">
					                    <div><select v-if="$index>0" v-model="editing_filter.match" v-bind:disabled="editing_filter.id"><option value="ALL" data-tooltip-delay="100" v-tooltip="Choose whether all conditions must be met (AND) or if any of the conditions must be met (OR)">AND<option value="ANY">OR</select></div>
					                    <div><select v-model="rule.target" v-bind:disabled="editing_filter.id" data-tooltip-delay="100" v-tooltip="Which attribute of the post do you want to match on?\nSee the Filter Help for a full explanation of each type">
					                        <option value="any">Any Post Content</option>
					                        <option value="content">Post Text Content</option>
					                        <option value="action">Post Action</option>
					                        <option value="author">Author</option>
					                        <option value="app">App/Game Name</option>
					                        <option value="link_url">Link URL</option>
					                        <option value="link_text">Link Text</option>
					                        <option value="day">Day of the Week</option>
					                        <option value="age">Post Age</option>
					                        <option value="image">Picture of </option>
					                    </select></div>
					                    <template v-if="rule.target=='day'">
					                        <div style="padding-left:10px;" data-tooltip-delay="100" v-tooltip="Choose which days of the week this filter should be active">
					                            is
					                            <input type="checkbox" class="normal" v-model="rule.condition.day_0" v-bind:disabled="editing_filter.id"> Sun
					                            <input type="checkbox" class="normal" v-model="rule.condition.day_1" v-bind:disabled="editing_filter.id"> Mon
					                            <input type="checkbox" class="normal" v-model="rule.condition.day_2" v-bind:disabled="editing_filter.id"> Tue
					                            <input type="checkbox" class="normal" v-model="rule.condition.day_3" v-bind:disabled="editing_filter.id"> Wed
					                            <input type="checkbox" class="normal" v-model="rule.condition.day_4" v-bind:disabled="editing_filter.id"> Thu
					                            <input type="checkbox" class="normal" v-model="rule.condition.day_5" v-bind:disabled="editing_filter.id"> Fri
					                            <input type="checkbox" class="normal" v-model="rule.condition.day_6" v-bind:disabled="editing_filter.id"> Sat
					                        </div>
					                    </template>
					                    <template v-if="rule.target=='age'">
					                        <div style="padding-left:10px;">
					                            is
					                            <select v-model="rule.operator" v-bind:disabled="editing_filter.id">
					                                <option value="gt">Greater Than</option>
					                                <option value="lt">Less Than</option>
					                            </select>
					                            <input type="number" min="1" style="width:40px;" v-model="rule.condition.value" size="3" v-bind:disabled="editing_filter.id">
					                            <select v-model="rule.condition.units" v-bind:disabled="editing_filter.id">
					                                <option value="h">Hours</option>
					                                <option value="d">Days</option>
					                            </select>
					                        </div>
					                    </template>
					                    <template v-if="rule.target=='image'">
					                        <div class="stretch" data-tooltip-delay="100" v-tooltip="Match keywords in Facebook's auto-generated description, if they exist. This is not always reliable (yet) due to Facebook's inconsistent labeling.">
					                            <input class="stretch" v-model="rule.condition.text" v-bind:disabled="editing_filter.id">
					                        </div>
					                    </template>
					                    <template v-if="rule.target!='day' && rule.target!='age' && rule.target!='image'">
					                        <div>
					                            <select v-model="rule.operator" v-bind:disabled="editing_filter.id">
					                                <option value="contains">Contains</option>
					                                <option value="not_contains">Does NOT Contain</option>
					                                <option value="equals">Equals Exactly</option>
					                                <option value="startswith">Starts With</option>
					                                <option value="endswith">Ends With</option>
					                                <option value="matches">Matches Regex</option>
					                                <option value="not_matches">Does NOT Match Regex</option>
					                                <option value="contains_selector">Matches CSS Selector</option>
					                                <option value="not_contains_selector">Does NOT Match CSS Selector</option>
					                            </select>
					                        </div>
					                        <div class="stretch" style="white-space:nowrap;">
					                            <span v-if="rule.operator=='matches' || rule.operator=='not_matches'" style="margin-left:10px;font-weight:bold;">/</span>
					                            <input v-if="rule.operator=='contains' || rule.operator=='not_contains' || rule.operator=='equals' || rule.operator=='startswith' || rule.operator=='endswith' || rule.operator=='contains_selector' || rule.operator=='not_contains_selector'" class="stretch" v-on:focus="clear_test_regex" v-on:blur="test_regex" v-model="rule.condition.text" v-bind:disabled="editing_filter.id">
					                            <input v-if="rule.operator=='matches' || rule.operator=='not_matches'" class="stretch" v-model="rule.condition.text" style="max-width:70%;" v-bind:disabled="editing_filter.id">
					                            <div style="white-space:normal;" v-if="rule.operator=='equals' || rule.operator=='contains' || rule.operator=='not_contains'">(Separate words by pipe | to match multiple)</div>
					                            <span v-if="rule.operator=='matches' || rule.operator=='not_matches'" style="font-weight:bold;">/</span>
					                            <input v-if="rule.operator=='matches' || rule.operator=='not_matches'" v-model="rule.condition.modifier" size="2" v-bind:disabled="editing_filter.id" data-tooltip-delay="100" v-tooltip="Regular Expression modifier, such as 'i' for case-insensitive">
					                            <span v-if="rule.operator=='matches' || rule.operator=='not_matches'" class="sfx_link" @click="regex_test(rule.condition)" data-tooltip-delay="100" v-tooltip="Test your regular expression against text to make sure it matches as you expect."> [test]</span>
					                        </div>
					                        <div v-if="rule.operator=='contains' || rule.operator=='not_contains'" style="white-space:nowrap;padding-left:5px;">
					                            <input type="checkbox" class="normal" v-model="rule.match_partial_words" v-bind:disabled="editing_filter.id" data-tooltip-delay="100" v-tooltip="Check this if you want the text to be a partial match. For example, if 'book' should also match 'Facebook'. If unchecked, only whole words will be matched.">
					                            <span v-if="(!editing_filter.id || rule.match_partial_words)"> Match partial words</span>
					                        </div>
					                    </template>
					                    <span v-if="editing_filter.rules.length>1" class="sfx_square_control sfx_square_delete" style="margin:0 10px;" v-tooltip="Delete" @click="delete_rule(rule)">&times;</span>
					                </div>
					            </div>
					            <div v-if="!editing_filter.id">
					                <input type="button" class="sfx_button" value="Add A Condition" @click="add_condition">
					            </div>
					        </div>
					        <div class="sfx_options_dialog_filter_actions sfx_options_dialog_panel">
					            <div class="sfx_panel_title_bar">... THEN</div>
					            <div class="sfx_info" v-if="editing_filter.id && editing_filter.configurable_actions && editing_filter.actions[0].action==''">
					                This Filter Subscription defines the rules above, but the action to take is up to you to define. When updated automatically, the rules above will be updated but your selected actions are personal to you.
					            </div>
					            <div class="sfx_info" v-if="editing_filter.id && editing_filter.configurable_actions && editing_filter.actions[0].action!=''">
					                The Actions to take when this filter subscription matches may be changed. If you change the actions, the criteria above will continue to be updated but your customized actions will not be over-written when the filter updates itself.
					            </div>
					            <div class="flex-row-container" v-for="action in editing_filter.actions">
					                <select v-model="action.action" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions" data-tooltip-delay="100" v-tooltip="If the conditions match, what action should be taken on the post?">
					                    <option value=""></option>
					                    <option value="hide">Hide post</option>
					                    <option value="css">Add CSS</option>
					                    <option value="class">Add CSS Class</option>
					                    <option value="replace">Replace text</option>
					                    <option value="move-to-tab">Move post to tab</option>
					                    <option value="copy-to-tab">Copy post to tab</option>
					                </select>
					                <span v-if="action.action=='hide'">
					                    <input type="checkbox" class="normal" v-model="action.show_note"  data-tooltip-delay="100" v-tooltip="This will leave a small message in your feed to let you know that a post was hidden." v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions"> Show a note where the post would have been.
					                    <span v-if="action.show_note">Optional Custom Message: <input v-model="action.custom_note" size="20" data-tooltip-delay="100" v-tooltip="Customize the message displayed to be anything you wish."></span>
					                </span>
					                <span v-if="action.action=='css'">
					                    CSS: <input v-model="action.content" size="45" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                    To Selector: <input v-model="action.selector" size="25" data-tooltip-delay="100" v-tooltip="Apply the CSS to the element(s) specified by the selector. To target the whole post container, leave blank." v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                </span>
					                <span class="stretch" v-if="action.action=='class'">
					                    <input v-model="action.content" size="45" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions" data-tooltip-delay="100" v-tooltip="Add a class name to the post container. This is useful in conunction with a Display Tweak to customize CSS">
					                </span>
					                <span v-if="action.action=='replace'">
					                    Find: <input v-model="action.find" size="25" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                    Replace With: <input v-model="action.replace" size="25" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                </span>
					                <span v-if="action.action=='move-to-tab' || action.action=='copy-to-tab'">
					                    Tab Name: <input v-model="action.tab" size="45" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                </span>
					                <span v-if="editing_filter.actions.length>1" class="sfx_square_control sfx_square_delete" style="margin:0 10px;" v-tooltip="Delete" @click="delete_action(action)">&times;</span>
					            </div>
					            <div v-if="!editing_filter.id || editing_filter.configurable_actions">
					                <input type="button" class="sfx_button" value="Add An Action" @click="add_action">
					            </div>
					        </div>
					        <div class="sfx_link" @click="show_advanced=!show_advanced" v-tooltip="{position:'above',content:'View the underlying JSON data structure for this filter. The filter can be edited manually here, or you can paste in filter code from someone else to copy their filter exactly.',delay:500}">{{show_advanced?"Hide Advanced Code &#9650;":"Show Advanced Code &#9660;"}}</div>
					        <textarea v-if="show_advanced" style="width:90%;height:150px;font-size:11px;font-family:monospace;" v-model="editing_filter|json" v-bind:disabled="editing_filter.id"></textarea>
					    </div>
					</div>
				</template>
				<template v-if="section.name=='Data Import/Export'">
					<div class="sfx_info">Here you can export all of Social Fixer's stored data, including options, filters, and which stories have been read. WARNING: Importing will overwrite your existing settings!</div>
					Total storage space used: {{storage_size | currency '' 0}} bytes<br><br>
					<input type="button" class="sfx_button" value="Save To File" @click="save_to_file()" v-if="supports_download_attribute"> <input type="button" class="sfx_button" value="Load From File" @click="load_from_file()"> <input type="button" class="sfx_button" value="Reset All Data" @click="reset_data()"><br><br>
					<input type="button" class="sfx_button" value="Export To Textbox" @click="populate_user_options()"> <input type="button" class="sfx_button" value="Import From Textbox" @click="import_data_from_textbox()">
					<br><br>
					<div v-if="user_options_message" class="sfx_info">{{user_options_message}}</div>
					<textarea id="sfx_user_data" v-model="user_options|json" style="width:95%;height:50vh;font-family:courier new,monospace;font-size:11px;"></textarea>
				</template>
				<template v-if="section.name!='Filters'">
					<div v-if="section.description" style="margin-bottom:15px;">{{section.description}}</div>
					<table class="sfx_options_dialog_table">
						<tr v-for="opt in section.options | filterBy !opt.hidden | orderBy title" v-if="!opt.hidden" class="{{opt.highlighted?'sfx_options_dialog_option_highlighted':''}}">
							<td class="sfx_options_dialog_option_title {{($index==0 || section.options[$index-1].title!=opt.title)?'':'repeat'}}">{{{opt.title | highlight searchtext}}}</td>
							<td class="sfx_options_dialog_option_description">{{{opt.description | highlight searchtext}}}
								<input v-if="opt.type=='text'" v-model="opt.newValue" style="display:block;width:{{opt.width || '50%'}};"/>
								<input v-if="opt.type=='number'" type="number" min="{{opt.min||1}}" max="{{opt.max||999}}" v-model="opt.newValue"/>
								<textarea v-if="opt.type=='textarea'" v-model="opt.newValue" style="display:block;width:95%;height:100px;"></textarea>
							</td>
							<td class="sfx_options_dialog_option_action">
								<template v-if="opt.type=='checkbox'">
									<input id="sfx_option_{{opt.key}}" type="checkbox" v-model="opt.newValue"/><label for="sfx_option_{{opt.key}}"></label>
								</template>
								<template v-if="opt.type=='link'">
									<input type="button" data-href="{{opt.url}}" onclick="window.open(this.getAttribute('data-href'));" class="sfx_button" value="GO!">
								</template>
								<template v-if="opt.type=='action'">
									<input type="button" @click="message(opt.action_message)" class="sfx_button" value="{{opt.action_text}}">
								</template>
							</td>
						</tr>
					</table>

					<!-- Custom Section Displays -->
					<template v-if="section.name=='Hide Posts'">
						<b>Easily hide posts from your feed by keyword or phrase.</b>
						<br><br>
						Just enter each keyword or phrase you want to hide on a separate line in the text box. Any post containing one of those words will be hidden, and a small message will be shown in its place. To have more control over filtering, advanced post filtering can be setup in the "Filters" tab.
						<br><br>
						<input type="checkbox" class="normal" v-model="options.hide_posts_show_hidden_message.newValue"> Show a message in place of hidden posts in the news feed
						<br>
						<input type="checkbox" class="normal" v-model="options.hide_posts_show_match.newValue"> Show the word or phrase that matched in the hidden post message
						<br>
						<input type="checkbox" class="normal" v-model="options.hide_posts_partial.newValue"> Match partial words (example: "the" will also match "them")
						<br>
						<input type="checkbox" class="normal" v-model="options.hide_posts_case_sensitive.newValue"> Match Case
						<br>
						Hide posts with these keywords or phrases (each on its own line):<br>
						<textarea v-model="options.hide_posts_text.newValue" style="width:80%;height:150px;"></textarea>

					</template>
					<template v-if="section.name=='Display Tweaks'">
						<div v-if="!editing_tweak">
						    <div class="">
						        Display Tweaks are small snippets of CSS which change the appearance of the page. They can do anything from changing colors and fonts to hiding parts of the page or completely changing the layout. Advanced users can add their own tweaks, but most users will want to select some from the list of available Tweaks.
						    </div>
						    <div class="sfx_option" style="margin:10px 0;font-size:14px;"><input id="tweaks_enabled" type="checkbox" v-model="options.tweaks_enabled.newValue"/><label for="tweaks_enabled"></label> Tweaks enabled</div>
						    <div>
						        <input type="button" class="sfx_button" value="Create A New Tweak" @click="add_tweak">
						    </div>
						    <div v-if="tweaks.length" class="sfx_options_dialog_panel_header">Active Tweaks</div>
						    <table v-if="tweaks.length" class="sfx_options_dialog_table">
						        <thead>
						        <tr>
						            <th>Title</th>
						            <th>Description</th>
						            <th style="text-align:center;">Actions</th>
						            <th style="text-align:center;">Enabled</th>
						        </tr>
						        </thead>
						        <tbody>
						        <tr v-for="tweak in tweaks" v-bind:class="{'sfx_options_dialog_option_disabled':tweak.disabled}">
						            <td class="sfx_options_dialog_option_title">{{tweak.title}}<div v-if="tweak.id" style="font-weight:normal;font-style:italic;color:#999;margin-top:5px;">(Subscription)</div></td>
						            <td class="sfx_options_dialog_option_description">
						                {{tweak.description}}
						                <div v-if="tweak.id && tweak.subscription_last_updated_on" style="font-style:italic;color:#999;margin-top:5px;">Subscription last updated: {{ago(tweak.subscription_last_updated_on)}}</div>
						            </td>
						            <td class="sfx_options_dialog_option_action" style="white-space:nowrap;">
						                <span class="sfx_square_control" title="Edit" @click="edit_tweak(tweak,$index)">&#9998;</span>
						                <span class="sfx_square_control sfx_square_delete"  title="Delete" @click="delete_tweak(tweak)">&times;</span>
						            </td>
						            <td>
						                <input id="sfx_tweak_{{$index}}" type="checkbox" @change="toggle_tweak(tweak,$index)" v-model="tweak.enabled"/><label for="sfx_tweak_{{$index}}"></label>
						            </td>
						        </tr>
						        </tbody>
						    </table>

						    <div v-if="tweak_subscriptions">
						        <div class="sfx_options_dialog_panel_header">Available Display Tweaks (Snippets)</div>
						        <div>
						            Below is a list of display tweaks maintained by the Social Fixer team which you may find useful. When you add them to your list, they will be automatically updated to continue functioning if Facebook changes its layout or code.
						        </div>
						        <table class="sfx_options_dialog_table">
						            <thead>
						            <tr>
						                <th>Title</th>
						                <th>Description</th>
						                <th>Add</th>
						            </tr>
						            </thead>
						            <tbody>
						            <tr v-for="tweak in tweak_subscriptions" v-bind:class="{'sfx_tweak_subscribed':tweak.subscribed}">
						                <td class="sfx_options_dialog_option_title">{{tweak.title}}</td>
						                <td class="sfx_options_dialog_option_description">{{tweak.description}}</td>
						                <td class="sfx_options_dialog_option_action">
						                    <span class="sfx_square_add" title="Add To My Tweaks" @click="add_tweak_subscription(tweak)">+</span>
						                </td>
						            </tr>
						            </tbody>
						        </table>
						    </div>
						    <div v-else>
						        Loading Available Tweaks...
						    </div>
						</div>

						<div v-if="editing_tweak" class="sfx_options_dialog_panel">
						    <div class="sfx_panel_title_bar">Edit Tweak</div>
						    <div class="sfx_label_value">
						        <div>Title:</div>
						        <div><input class="sfx_wide" v-model="editing_tweak.title"></div>
						    </div>
						    <div class="sfx_label_value">
						        <div>Description: </div>
						        <div><input class="sfx_wide" v-model="editing_tweak.description"></div>
						    </div>
						    <div>CSS:<br/>
						        <textarea style="width:90%;height:250px;font-size:11px;font-family:monospace;" v-model="editing_tweak.css"></textarea>
						    </div>
						</div>
					</template>
					<template v-if="section.name=='About'"><div id="sfx_options_content_about">{{{content_about}}}</div></template>
					<template v-if="section.name=='Donate'">
						<div v-if="sfx_option_show_donate" style="margin-bottom:10px;">
							<input id="sfx_option_show_donate" type="checkbox" v-model="options.sfx_option_show_donate.newValue"/><label for="sfx_option_show_donate"></label> Remind me every so often to help support Social Fixer through donations.
						</div>
						<div id="sfx_options_content_donate">{{{content_donate}}}</div>
					</template>
					<template v-if="section.name=='Support'">
						<div style="font-family:monospace;font-size:11px;border:1px solid #ccc;margin-bottom:5px;padding:7px;">{{user_agent}}<br>Social Fixer {{buildstr}}
							<br><span v-if="userscript_agent">{{userscript_agent}}</span>
							<br><span v-if="support_notes"><br>Support Notes:<br>
								<span v-for="note in support_notes">{{note.who}}: {{note.what}}<br></span>
							</span>
						</div>
						<div id="sfx_options_content_support">{{{content_support}}}</div>
					</template>
				</template>
			</div>
		</div>
	</div>
</div>
`;
				var close_options = function () {
					X('#sfx_options_dialog').remove();
				};
				X.subscribe('options/close', function () {
					close_options();
				});

				var save_options = function () {
					var undef, opt, sectionName, key, options_to_save = {};
					// Iterate each option
					for (key in FX.options) {
						opt = FX.options[key];
						// Only save non-default settings that have changed
						if (opt.newValue != opt.value) {
							// If it's the default, erase it from options so it will be overriden by the default
							if (opt.newValue == opt['default']) {
								options_to_save[key] = undef;
							}
							else {
								options_to_save[key] = opt.newValue;
							}
							FX.fire_option_update(key,options_to_save[key]);
						}
						// Empty out the newValue
						opt.newValue = null;
					}
					// Store the data in memory
					X.storage.data.filters = X.clone(filters);
					X.storage.data.tweaks = X.clone(tweaks);

					// persist
					X.storage.set('options', options_to_save, function () {
						X.storage.save('filters', null, function () {
							X.storage.save('tweaks', null, function () {
								close_options();
								var position = X('#sfx_badge_menu').hasClass('right') ? 'right' : 'left';
								var note = sticky_note(X('#sfx_badge')[0], position, ' Saved!  <b style="color:red;">Reload all Facebook tabs</b> for changes to take effect! ', {close: false});
								setTimeout(function () {
									note.remove();
								}, 6000);
							});
						});
					});
				};

				var import_data = function (json) {
					var key, user_data;
					var keys = [];
					this.user_options_message = null;
					try {
						user_data = JSON.parse(json);
						for (key in user_data) {
							var d = X.clone(user_data[key]);
							X.storage.data[key] = d;
							X.storage.save(key, null, function () {
							});
							keys.push(key);
						}
						var $note = X(`<div>Successfully imported keys: ${keys.join(", ")}.<br><br><span class="sfx_button">REFRESH THE PAGE</span> immediately to activate the changes!`);
						$note.find('.sfx_button').click(function() {
							window.location.reload();
						});
						data.show_action_buttons = false;
						X('#sfx_options_dialog_body').css("padding","50px").html('').append($note);
					} catch (e) {
						this.user_options_message = "Error importing data: " + e.toString();
					}
				};

				var key;
				if (event_data && event_data.data) {
					for (key in event_data.data) {
						data[key] = event_data.data[key];
					}
				}
				var methods = {
					"save": save_options
					, "cancel": function () {
						if (this.editing_filter) {
							this.action_button = null;
							this.editing_filter = null;
						}
						else if (this.editing_tweak) {
							this.action_button = null;
							this.editing_tweak = null;
						}
						else {
							close_options();
						}
					}
					, "collapse": function () {
						X('#sfx_options_dialog_body').toggle();
					}
					, "message": function (msg) {
						if (msg) {
							var messages = msg.split(/\s*,\s*/);
							if (messages && messages.length > 0) {
								messages.forEach(function (m) {
									X.publish(m, {});
								});
							}
						}
					}
					, "search": function() {
						var search_section = this.sections[0];
                        search_section.options.splice(0,search_section.options.length);
                        if (this.searchtext && this.searchtext.length>2) {
                            var regex = new RegExp(this.searchtext,"i");
                            for (k in FX.options) {
                                var opt = FX.options[k];
                                if (regex.test(opt.title) || regex.test(opt.description)) {
                                    search_section.options.push(opt);
                                }
                            }
                        }
					}
					, "select_section": function (section) {
						this.editing_filter = null;
						this.action_button = null;
						sections.forEach(function (s) {
							s.selected = false;
						});
						section.selected = true;
						X.publish("menu/options/section", section.name);
					}
					, "ago": function (when) {
						return X.ago(when);
					}
					, "version_check": function (filter) {
						return (!filter.min_version || X.semver_compare(sfx_version, filter.min_version) >= 0);
					}
					, "clear_test_regex": function (ev) {
						var input = X(ev.target);
						input.attr('data-hover', null).css('background-color', '');
					}
					, "test_regex": function (ev) {
						var input = X(ev.target);
						try {
							var r = new RegExp(input.val());
							input.css('background-color', '');
						}
						catch (e) {
							input.css('background-color', '#e00');
							input.attr('data-hover', 'tooltip');
							input.attr('data-tooltip-content', "Invalid Regular Expression syntax: " + e.message);
							input.attr('data-tooltip-delay', '1');
						}
					}
					, "save_to_file": function () {
						// Firefox requires link to be inserted in <body> before clicking
						// https://stackoverflow.com/a/27116581
						var $link = X('<a style="position:absolute;top:0;left:-10px;visibility:hidden;" aria-hidden="true" tabindex="-1"></a>');
						$link.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(X.storage.data, null, '  ')));
						$link.attr('download', `Social Fixer Settings (${X.today()}).txt`);
						X(document.body).append($link);
						X.ui.click($link, false);
						$link.remove();
					}
					, "load_from_file": function () {
						var $input = X('<input type="file" accept="text/*">');
						$input.change(function (ev) {
							if (ev.target.files && ev.target.files[0]) {
								var reader = new FileReader();

								reader.onload = function (e) {
									import_data.call(this, e.target.result);
								}.bind(this);

								reader.onerror = function (e) {
									this.user_options_message = 'Error importing data: ' + e.toString();
								}.bind(this);
					
								reader.readAsText(ev.target.files[0]);
							}
						}.bind(this));
						X.ui.click($input, false);
					}
					, "populate_user_options": function () {
						this.user_options = X.clone(X.storage.data);
						this.user_options_message = null;
					}
					, "import_data_from_textbox": function () {
						import_data.call(this, X('#sfx_user_data').val());
					}
					, "reset_data": function () {
						if (confirm('Are you sure?\n\nResetting your data will ERASE all user preferences, "read" story data, installed filters, etc.')) {
							X.storage.save('options', {});
							X.storage.save('filters', []);
							X.storage.save('tweaks', []);
							X.storage.save('hiddens', {});
							X.storage.save('postdata', {});
							X.storage.save('friends', {});
							X.storage.save('stats', {});
							alert("All data has been reset. Please refresh the page.");
						}
					}
					// FILTERS
					, "edit_filter": function (filter, index) {
						this.editing_filter = X.clone(filter);
						this.editing_filter_index = index;
						this.action_button = 'done_editing_filter';
					}
					, "delete_filter": function (filter) {
						if (confirm('Are you sure you want to remove this filter?')) {
							this.filters.$remove(filter);
							mark_subscribed_filters(data.filter_subscriptions, filters);
						}
					}
					, "up": function (filter,$event) {
						if ($event.ctrlKey) {
							this.filters.$remove(filter);
							this.filters.unshift(filter);
						}
						else {
							for (var i = 0; i < this.filters.length; i++) {
								if (this.filters[i] == filter && i > 0) {
									this.filters.$set(i, this.filters[i - 1]);
									this.filters.$set(i - 1, filter);
									return;
								}
							}
						}
					}
					, "down": function (filter) {
						for (var i = 0; i < this.filters.length; i++) {
							if (this.filters[i] == filter && i < this.filters.length - 1) {
								this.filters.$set(i, this.filters[i + 1]);
								this.filters.$set(i + 1, filter);
								return;
							}
						}
					}
					, "close_filter": function () {
						this.editing_filter.updated_on = X.time();
						// If it's a subscription and actions are configurable and they have changed, flag as such
						var orig = this.filters[this.editing_filter_index];
						if (orig.id && orig.configurable_actions) {
							var original_actions = JSON.stringify(orig.actions);
							var new_actions = JSON.stringify(this.editing_filter.actions);
							if (original_actions != new_actions) {
								// Updated actions!
								this.editing_filter.custom_actions = true;
							}
						}
						this.filters[this.editing_filter_index] = X.clone(this.editing_filter);
						this.editing_filter = null;
						this.action_button = null;
						mark_subscribed_filters(data.filter_subscriptions, filters);
					}
					, "add_filter": function () {
						var new_filter = {"match": "ALL", "enabled": true, "stop_on_match": true, "rules": [{"target": "any", "operator": "contains"}], "actions": [{"action": "hide"}]};
						new_filter.added_on = X.time();
						this.filters.push(new_filter);
						this.edit_filter(this.filters[this.filters.length - 1], this.filters.length - 1);
						this.action_button = 'done_editing_filter';
					}
					, "add_subscription": function (filter) {
						var f = X.clone(filter);
						f.enabled = true;
						if (!f.actions || !f.actions.length) {
							f.actions = [{"action": ""}];
							f.configurable_actions = true;
						}
						this.filters.push(f);
						mark_subscribed_filters(data.filter_subscriptions, filters);
						//if (f.configurable_actions) {
						//	this.editing_filter = f;
						//	this.action_button = 'done_editing_filter';
						//}
					}
					, "add_condition": function () {
						this.editing_filter.rules.push({"target": "any", "operator": "contains"});
					}
					, "delete_rule": function (rule) {
						this.editing_filter.rules.$remove(rule);
					}
					, "add_action": function () {
						this.editing_filter.actions.push({});
					}
					, "delete_action": function (action) {
						this.editing_filter.actions.$remove(action);
					}
					, "regex_test": function (condition) {
						var text = condition.text;
						var modifier = condition.modifier;
						X.publish("test/regex", {"text": text, "modifier": modifier});
					}
					// TWEAKS
					, "edit_tweak": function (tweak, index) {
						this.editing_tweak = X.clone(tweak);
						this.editing_tweak_index = index;
						this.action_button = 'done_editing_tweak';
					}
					, "delete_tweak": function (tweak) {
						if (confirm('Are you sure you want to remove this tweak?')) {
							this.tweaks.$remove(tweak);
							mark_subscribed_tweaks(data.tweak_subscriptions, tweaks);
						}
					}
					, "close_tweak": function () {
						this.editing_tweak.updated_on = X.time();
						if (this.editing_tweak.enabled) {
							X.css(this.editing_tweak.css, 'sfx_tweak_style_' + this.editing_tweak_index);
						}
						this.tweaks[this.editing_tweak_index] = X.clone(this.editing_tweak);
						this.editing_tweak = null;
						this.action_button = null;
					}
					, "add_tweak": function () {
						var new_tweak = {"title": "", "description": "", "enabled": true};
						new_tweak.added_on = X.time();
						this.tweaks.push(new_tweak);
						this.edit_tweak(this.tweaks[this.tweaks.length - 1], this.tweaks.length - 1);
						this.action_button = 'done_editing_tweak';
					}
					, "add_tweak_subscription": function (tweak) {
						var o = X.clone(tweak);
						o.enabled = true;
						this.tweaks.push(o);
						mark_subscribed_tweaks(data.tweak_subscriptions, tweaks);
						X.css(o.css, 'sfx_tweak_style_' + this.tweaks.length - 1);
					}
					, "toggle_tweak": function (tweak, index) {
						var css = tweak.enabled ? tweak.css : null;
						X.css(css, 'sfx_tweak_style_' + index);
					}
				};
				template(document.body, dialog, data, methods).ready(function () {
					X.draggable('#sfx_options_dialog');

					// If a default section was passed in, publish that event
					if (event_data.section) {
						X.publish("menu/options/section", event_data.section);
					}
				});
			} catch (e) {
				alert(e);
			}
		}, true);

		X.subscribe("menu/options/section", function (msg, msgdata) {
			// If the section has dynamic data, load it
			sections.forEach(function (s) {
				if (s.name == msgdata && s.property && s.url) {
					X.ajax(s.url, function (content) {
						data[s.property] = X.sanitize(content);
					});
				}
			});
			if (msgdata == "Filters") {
				// Retrieve filters
				retrieve_filter_subscriptions(data.filters, function (subscriptions) {
					data.filter_subscriptions = subscriptions;
				});
			}
			if (msgdata == "Display Tweaks") {
				// Retrieve tweaks
				retrieve_tweak_subscriptions(data.tweaks, function (subscriptions) {
					data.tweak_subscriptions = subscriptions;
				});
			}
		});

		// If opening from an "options" url, open options immediately
		FX.on_content_loaded(function () {
			if (/sfx_options=true/.test(location.href)) {
				X.publish("menu/options");
			}
		});
	});
});

X.ready( 'photo_tags', function() {
	FX.add_option('photo_tags', {
		"section": "User Interface"
		, "title": "Show Photo Tags"
		, "description": "Display the tags that Facebook automatically puts on photos when you hover over them."
		, "default": false
	});
	FX.on_option('photo_tags', function() {
		FX.on_selector('img[alt^="Image may contain:"]', function($img) {
			$img.closest('a').attr('sfx_photo_tags',$img.attr('alt')).addClass('sfx_photo_tags');
		});
	});
});

// =====================================================
// Apply Filters to posts when they are added or updated
// =====================================================
// Filters depend on options, so wait until they load
X.ready('post_filters', function() {
    FX.add_option('filters_enabled', {"section": "Filters", "hidden": true, "default": true});
    FX.add_option('filters_enabled_pages', {"section": "Filters", "hidden": true, "default": false});
    FX.add_option('filters_enabled_groups', {"section": "Filters", "hidden": true, "default": false});
    FX.add_option('filters_forced_processing_delay', {"type":"number", "section":"Advanced", "title":"Post Filter Force Delay", "description":"The time in ms after which post filtering will be forced even if all the content is not yet available", "default":1000});

    FX.add_option('hide_posts_text', {"hidden":true, "type":"textarea", "section":"Hide Posts", "title":"Hide Posts Keywords", "default":""});
    FX.add_option('hide_posts_show_hidden_message', {"hidden":true, "section":"Hide Posts", "title":"Show hidden post message", "default":true});
    FX.add_option('hide_posts_show_match', {"hidden":true, "section":"Hide Posts", "title":"Show Matching Text", "default":true});
    FX.add_option('hide_posts_partial', {"hidden":true, "section":"Hide Posts", "title":"Match Partial Words", "default":true});
    FX.add_option('hide_posts_case_sensitive', {"hidden":true, "section":"Hide Posts", "title":"Case Sensitive", "default":false});

    var sfx_post_data = {};
    var sfx_filter_trace = {};
    var filter_trace = function (id, msg) {
        if (!sfx_filter_trace[id][0]) {
            sfx_filter_trace[id] = [X.now()];
        }
        sfx_filter_trace[id].push(((X.now() - sfx_filter_trace[id][0]) / X.seconds).toFixed(3) + ' ' + msg);
    };
    X.subscribe("log/filter", function (msg, data) {
        filter_trace(data.id, data.message);
    });

    FX.on_options_load(function () {
        var FORCED_PROCESSING_DELAY = +FX.option('filters_forced_processing_delay');

        var show_filtering_disabled_message_displayed = false;
        var show_filtering_disabled_message = function () {
            if (show_filtering_disabled_message_displayed) {
                return;
            }
            show_filtering_disabled_message_displayed = true;
            var msg = "By default, post filtering only affects the main Newsfeed.<br>You can change this in Options if you wish.";
            context_message("filter_disabled_message", msg, {"title": "Post Filtering Disabled"});
        };
        FX.on_page_unload(function () {
            show_filtering_disabled_message_displayed = false;
        });

        var filters = X.clone(FX.storage('filters'));

        // If there are any "Hide Posts" keywords defined, create a filter to hide them
        var hide_posts_text = FX.option('hide_posts_text');
        if (hide_posts_text) {

            var keywords = hide_posts_text.trim().replace(/([^\w\s\n])/g,"\\$1").split(/\s*\n\s*/);
            var keywords_regex = "(" + keywords.join('|') + ")";
            if (!FX.option('hide_posts_partial')) {
                keywords_regex = "(?:^|\\b)" + keywords_regex + "(?:\\b|$)";
            }
            var modifier = FX.option('hide_posts_case_sensitive') ? null : "i";
            var show_note = FX.option('hide_posts_show_hidden_message');
            var filter = {
                "match": "ALL",
                "enabled": true,
                "stop_on_match": true,
                "rules": [
                    {
                        "target": "any",
                        "operator": "matches",
                        "condition": {
                            "text": keywords_regex,
                            "modifier": modifier
                        }
                    }
                ],
                "actions": [
                    {
                        "action": "hide",
                        "show_note": show_note,
                        "custom_note": "Post Hidden by keyword" + (FX.option('hide_posts_show_match')?": $1":"")
                    }
                ],
                "title": "Hide Posts"
            };
            filters.unshift(filter);
        }

        var filter_post = function (msg, data, is_add) {
            // If this is a permalink (single story) page, don't run any filters
            if (FX.context.permalink) {
                return false;
            }

            var post = data.dom;
            var dom_id = data.id;
            var sfx_id = data.sfx_id;
            var post_data;

            post_data = sfx_post_data[dom_id];
            if (msg == "post/add") {
                sfx_post_data[dom_id] = {"sfx_id": sfx_id, "dom_id": dom_id, "id": dom_id};
                post_data = sfx_post_data[dom_id];
                sfx_filter_trace[dom_id] = [];
            }
            else {
                // In case of update, sfx_id might have been set
                if (sfx_id && !post_data.sfx_id) {
                    post_data.sfx_id = sfx_id;
                }
            }

            // If the post has already been properly filtered, don't do anything
            if (post.attr('sfx_filtered')) {
                return false;
            }
            // If there are no child nodes or content, then this is a shell - don't do anything yet
            if (!post[0].childNodes || post[0].childNodes.length==0 || !post.innerText()) {
                return false;
            }

            // Before filtering this post, check to see where it lives and if we should filter it
            if (FX.context.type == "profile" && !FX.option('filters_enabled_pages')) {
                filter_trace(dom_id, "Not filtering post because filtering is disabled on Pages/Timelines");
                show_filtering_disabled_message();
                return false;
            }
            if (FX.context.type == "groups" && !FX.option('filters_enabled_groups')) {
                filter_trace(dom_id, "Not filtering post because filtering is disabled in Groups");
                show_filtering_disabled_message();
                return false;
            }
            // Disable all filtering in some groups (support, etc)
            if (FX.context.type == "groups" && FX.option('filters_enabled_groups')) {
                if (/^(412712822130938|164440957000149|551488248212943|SFxSnipDev|SocialFixerSupportTeam|SocialFixerUserSupport)$/.test(FX.context.id)) {
                    var msg = "Social Fixer automatically disables filtering in support groups,<br>to avoid confusion from posts not showing.<br>Your filters will not be applied here.";
                    context_message("filter_disabled_in_support_message", msg, {"title": "Post Filtering Disabled"});
                    return false;
                }
            }

            // FILTER THE POST!
            // ================
            var result = apply_filters(post, post_data, filters, false);
            if (typeof result=="undefined") {
                // Couldn't apply filters, try again on post/update, since the attr will not have been set
                // Force it after a certain amount of time, if it's already been filtered the attr will have been set, so no worries
                setTimeout(function() {
                    if (post.attr('sfx_filtered')) { return; }
                    post.attr('sfx_filtered','true');
                    post.attr('sfx_filtered_forced','true');
                    apply_filters(post, post_data, filters, true);
                },FORCED_PROCESSING_DELAY);
            }
            else {
                // Filters were successfully applied, even if they didn't filter anything
                post.attr('sfx_filtered','true');
            }
        };

        // Only filter posts if filtering is enabled
        if (FX.option('filters_enabled') && filters && filters.length > 0) {
            X.subscribe("post/add", filter_post, true);
            X.subscribe("post/update", filter_post, false);
        }

    });

    // Extract parts of the post that can be filtered on
    // NOTE: If a part can't be found (so its match is undefined), set the value as null.
    // If it is found but has no value, then set the value as empty string
    var extract = {
        "author": function (o, data) {
            //data.author = null;
            //data.authorContent = [];
            var a = o.find('a[data-hovercard*="id="]').filter(function () {
                return (X(this).find('img').length == 0);
            }).first();
            if (a.length) {
                data.author = a[0].innerHTML;
                // Store a reference to the author link itself
                data.authorContent = [a];
            }
            return data.author;
        },
        "link_url": function (o, data) {
            //data.link_url = null;
            var a = o.find('a[onmouseover^="LinkshimAsyncLink.swap"]');
            if (a.length) {
                data.link_url = "";
            }
            a.forEach(function (a) {
                a = X(a);
                var url = a.attr('onmouseover');
                if (!url) {
                    return;
                }
                if (url) {
                    url = url.replace(/^.*?"(.*?)".*/, "$1").replace(/\\\//g, "/");
                }
                data.link_url += " " + url;
            });
            return data.link_url;
        },
        "link_text": function (o, data) {
            //data.link_text = null;
            // Look for an attachment image
            var $el = o.find('.fbStoryAttachmentImage').closest('a').parent().next();
            if ($el.length) {
                data.link_text = $el.text();
            }
            return data.link_text;
        },
        "type": function (o, data) {
            // todo?
        },
        "all_content": function (o, data) {
            data.all_content = o.innerText() || '';
            var form_content = o.find('form').innerText();
            // The form contains comments, likes, etc. Remove it from post content
            data.all_content = data.all_content.replace(form_content,'');
            return data.all_content;
        },
        "content": function (o, data) {
            //data.content = null;
            data.userContent = [];
            var str = "";
            // Store a reference to all userContent areas, in case we need to manipulate them (replace text, etc)
            var els = o.find('.userContent');
            if (els.length==0) {
                els = o.find('.userContentWrapper');
            }
            els.forEach(function (el) {
                el = X(el);
                str += el.innerText() + ' ';
                data.userContent.push(el);
            });
            if (str) {
                data.content = str;
            }
            return data.content;
        },
        "action": function (o, data) {
            //data.action = null;
            // Store a reference to all actionContent areas, in case we need to manipulate them (replace text, etc)
            data.actionContent = [];
            var str = "";
            o.find('.fbUserContent h5, .userContentWrapper h5, ._5pcr h5, h5._5pbw').forEach(function (el) {
                el = X(el);
                str += el.text() + ' ';
                data.actionContent.push(el);
            });
            if (str) {
                data.action = str;
            }
            return data.action;
        },
        "app": function (o, data) {
            //data.app = null;
            var app = o.find('a[data-appname]').attr('data-appname');
            if (app) {
                data.app = app;
            }
            return data.app;
        }
    };

    // Util method to replace text content in text nodes
    function replaceText(rootNode, find, replace) {
        var children = rootNode.childNodes;
        for (var i = 0; i < children.length; i++) {
            var aChild = children[i];
            if (aChild.nodeType == 3) {
                var storedText = '';
                // If the parent node has an attribute storing the text value, check it to see if it's changed.
                // This is a method to prevent text replace actions from triggering another mutation event and repeatedly changing the same text.
                // This really only happens if the replace text is a superset of the find text.
                if (aChild.parentNode) {
                    storedText = aChild.parentNode.getAttribute('sfx_node_text') || '';
                }
                var nodeValue = aChild.nodeValue;
                if (nodeValue != storedText) {
                    var newVal = nodeValue.replace(find, replace);
                    if (newVal != nodeValue) {
                        aChild.nodeValue = newVal;
                        aChild.parentNode.setAttribute('sfx_node_text', newVal);
                    }
                }
            }
            else {
                replaceText(aChild, find, replace);
            }
        }
    }

    // Run filters to take actions on a post
    function apply_filters(post, data, filters, force_processing) {
        if (!filters || filters.length == 0) {
            return false;
        }
        var k;
        var updated_post_data = {}; // With each filtering run, re-extract pieces and update the record
        var match = false;
        filter_trace(data.id, `BEGIN Filtering`);
        if (force_processing) {
            filter_trace(data.id, `Force filtering enabled`);
        }
        for (var i = 0; i < filters.length; i++) {
            var filter = filters[i];
            if (filter.enabled === false) {
                filter_trace(data.id, `Filter #${i + 1} (${filter.title}) Disabled`);
                continue;
            }
            filter_trace(data.id, `Filter #${i + 1} (${filter.title})`);
            var result = apply_filter(post, data, updated_post_data, filter, force_processing);
            if (typeof result=="undefined") { // Some rules could not be executed
                filter_trace(data.id, `END Filtering because a condition could not be tested yet.`);
                return; // undefined
            }
            if (result) {
                match = true;
                if (filter.stop_on_match) {
                    filter_trace(data.id, `Filter processing stopped because "Stop on Match" is active`);
                    break;
                }
            }
        }
        filter_trace(data.id, `END Filtering. Filtered=${match}`);
        // Update the post's data with the new rxtracted data
        for (k in updated_post_data) {
            data[k] = updated_post_data[k];
        }
        return match;
    }

    // Extract one type of data from a post, to filter against
    function extract_post_data(post,extracted_data,type) {
        // If it's already been extracted in this run of filtering, return it
        if (typeof extracted_data[type]!="undefined") {
            return extracted_data[type];
        }
        return extract[type](post, extracted_data);
    }

    // Execute a single filter on a post
    function apply_filter(post, data, updated_data, filter, force_processing) {
        if (!filter || !filter.rules || !filter.rules.length > 0 || !filter.actions) {
            return false;
        }
        var all_match = true;
        var any_match = false;
        var abort = false;
        // XXX Should be applied at input time so user sees the change
        // XXX May break legit pipe matchers: /foo\||bar/ or /bar|foo\|/
        // XXX Any other fun-yet-fixable mistakes users like to make?
        function fix_regexp_mistakes(regexp) {
            return regexp
                         .replace(/^\s*\|/,'')	// Leading pipe
                         .replace(/\|\|+/g,'|')	// Double (or more) pipes
                         .replace(/\|\s*$/,'')	// Trailing pipe
            ;
        }
        filter.rules.forEach(function (rule) {
            if (abort) { return; }
            try {
                if (any_match && "ANY" === filter.match) {
                    return; // Already matched a condition
                }
                if (!all_match && "ALL" === filter.match) {
                    return; // Already failed on one rule, don't continue
                }
                var match = false;
                var operator = rule.operator;

                // Handle "NOT" operators
                var not = false;
                if (/^not_/.test(operator)) {
                    not = true;
                    operator = operator.replace(/^not_/,'');
                }

                // The "selector" rule isn't text-based, special case to handle first
                if ("contains_selector" == operator) {
                    filter_trace(data.id, ` -> Looking for ${not?'NOT ':''}selector: ${rule.condition.text}`);
                    var contains = null;
                    var condition = rule.condition.text.replace(/\:contains\((.+?)\)\s*$/, function(_,m) {
                        contains = m || "";
                        contains = contains.replace(/^["']/,"").replace(/["']$/,"");
                        return "";
                    });
                    var found = false;
                    var selector_matches = post.find(condition);
                    if (!contains) {
                        if (selector_matches.length>0) {
                            found = true;
                        }
                    }
                    else {
                        var contains_regex = new RegExp(contains);
                        selector_matches.each(function() {
                            if (contains_regex.test(X(this).innerText())) {
                                found = true;
                                return false;
                            }
                        });
                    }

                    if ( (found && !not) || (!found && not) ) {
                        match = true;
                        filter_trace(data.id, " -> Match!");
                    }
                }
                else if ("day"==rule.target) {
                    var dow = (new Date()).getDay();
                    if (rule.condition["day_"+dow]) {
                        match = true;
                        filter_trace(data.id, `Day of week is ${dow} - match!`);
                    }
                }
                else if ("age"==rule.target) {
                    //var post_time = extract_post_data(post, updated_data, 'post_time');
                    var post_time = (post.find('abbr[data-utime]').first().attr('data-utime') || 0) * X.seconds;
                    if (post_time) {
                        var check = rule.condition.value;
                        if (rule.condition.units=='h') { check *= X.hours; }
                        if (rule.condition.units=='d') { check *= X.days; }
                        var age = X.now() - post_time;
                        filter_trace(data.id, `Post age is ${age}ms and must be ${rule.operator} ${check}ms`);
                        if (rule.operator=="gt" && (age>check)) {
                            match = true;
                        }
                        else if (rule.operator=="lt" && (age<check)) {
                            match = true;
                        }
                    }
                }
                else if ("image"==rule.target) {
                    var caption = post.find('img[alt*=":"]').attr('alt');
                    if (caption) {
                        var condition_text = fix_regexp_mistakes(rule.condition.text);
                        match = new RegExp(condition_text,'i').test(caption);
                    }
                }
                // The rest are content selector rules
                else {
                    // If the regex has a leading or trailing | it will match everything - prevent that
                    var condition_text = fix_regexp_mistakes(rule.condition.text);
                    var target = "";
                    if (rule.target == "any") {
                        target = extract_post_data(post, updated_data, 'all_content');
                    }
                    else {
                        target = extract_post_data(post, updated_data, rule.target);
                    }
                    if (typeof target=="undefined") {
                        if (force_processing) {
                            // Act like target's empty so /^$/ matches successfully
                            filter_trace(data.id, ` -> Rule target doesn't exist (yet): ${rule.target}; acting as if it were null`);
                            target = null;
                        }
                        else {
                            filter_trace(data.id, ` -> Rule target doesn't exist (yet): ${rule.target}; defer filtering until later`);
                            abort = true;
                            return;
                        }
                    }
                    if (target==null) {
                        match = false;
                        //return;
                    }
                    else if ("equals" == operator) {
                        match = new RegExp("^" + condition_text + "$").test(target);
                    }
                    else if ("contains" == operator) {
                        if (rule.match_partial_words) {
                            var regex = new RegExp(condition_text, "i");
                        }
                        else {
                            var regex = new RegExp("(?:^|\\b)(?:" + condition_text + ")(?:\\b|$)", "i");
                        }
                        filter_trace(data.id, ` -> Testing ${not?'NOT ':''}RegExp: ` + regex.toString());
                        var results = regex.exec(target);
                        if ( (results!=null && !not) || (results==null&&not) ) {
                            match = true;
                            data.regex_match = results;
                        }
                        filter_trace(data.id, match ? " -> Matched Text: '" + RegExp.lastMatch + "'" : "No match");
                    }
                    else if ("startswith" == operator) {
                        var regex = RegExp("^" + condition_text, "i");
                        filter_trace(data.id, " -> Testing RegExp: " + regex.toString());
                        match = regex.test(target);
                        filter_trace(data.id, match ? " -> Matched Text: '" + RegExp.lastMatch + "'" : "No match");
                    }
                    else if ("endswith" == operator) {
                        var regex = new RegExp(condition_text + "$", "i");
                        filter_trace(data.id, " -> Testing RegExp: " + regex.toString());
                        match = regex.test(target);
                        filter_trace(data.id, match ? " -> Matched Text: '" + RegExp.lastMatch + "'" : "No match");
                    }
                    else if ("contains_in" == operator) {
                        var conditions = condition_text.split(/\s*,\s*/);
                        conditions.forEach(function (condition) {
                            if (!match && new RegExp(condition, "i").test(target)) {
                                match = true;
                            }
                        });
                    }
                    else if ("in" == operator) {
                        var conditions = condition_text.split(/,/);
                        conditions.forEach(function (condition) {
                            if (!match && new RegExp("^" + condition + "$", "i").test(target)) {
                                match = true;
                            }
                        });
                    }
                    else if ("matches" == operator) {
                        var regex = new RegExp(condition_text, (rule.condition.modifier || ''));
                        filter_trace(data.id, `Testing ${not?'NOT ':''}RegExp: ` + regex.toString());
                        var results = regex.exec(target);
                        if ( (results!=null && !not) || (results==null&&not) ) {
                            match = true;
                            data.regex_match = results;
                        }
                        filter_trace(data.id, match ? " -> Matched Text: '" + RegExp.lastMatch + "'" : "No match");

                    }
                }
                if (match) {
                    any_match = true;
                }
                else if (all_match) {
                    all_match = false;
                }
            } catch (e) {
                filter_trace(data.id, "ERROR: " + e.message);
            }
        });

        if (abort) {
            return; // undefined
        }

        // Were enough rules satisfied to execute the actions?
        if (!any_match || (filter.match == "ALL" && !all_match)) {
            return false;
        }

        // Filter matched! Execute the actions
        filter.actions.forEach(function (action) {
            apply_action(post, data, updated_data, action, filter);
        });

        // Filter matched
        return true;
    }

// Apply a single filter action to a post
    function apply_action(post, data, updated_data, action, filter) {
        if ("class" == action.action) {
            filter_trace(data.id, `Applying CSS class '${action.content}'`);
            post.addClass(action.content);
        }
        else if ("css" == action.action) {
            var css_target = action.selector ? post.find(action.selector) : post;
            var rules = action.content.split(/\s*;\s*/);
            filter_trace(data.id, `Applying CSS '${action.content}'`);
            rules.forEach(function (rule) {
                var parts = rule.split(/\s*:\s*/);
                if (parts && parts.length > 1) {
                    css_target.css(parts[0], parts[1]);
                }
            });
        }
        else if ("replace" == action.action) {
            filter_trace(data.id, `Replacing '${action.find}' with '${action.replace}'`);
            console.log("userContent", updated_data.userContent);
            if (typeof updated_data.userContent=="undefined") {
                extract_post_data(post, updated_data, "content");
            }
			console.log("userContent", updated_data.userContent);
            if (updated_data.userContent) {
				updated_data.userContent.forEach(function (usercontent) {
                    replaceText(usercontent[0], new RegExp(action.find, "gi"), action.replace);
                });
            }
            if (updated_data.authorContent) {
				updated_data.authorContent.forEach(function (authorcontent) {
                    replaceText(authorcontent[0], new RegExp(action.find, "gi"), action.replace);
                });
            }
        }
        else if ("hide" == action.action) {
            if (never_hide(post, data, updated_data)) { return; }
            if (!post.hasClass('sfx_filter_hidden')) {
                post.addClass("sfx_filter_hidden");
                filter_trace(data.id, `Hiding Post`);
                if (action.show_note) {
                    post.prepend(filter_hidden_note(filter, action, data));
                }
            }
        }
        else if ("move-to-tab" == action.action) {
            var tab_name = regex_replace_vars(action.tab, data.regex_match);
            filter_trace(data.id, `Moving to tab '${tab_name}'`);
            X.publish("filter/tab/move", {"tab": tab_name, "post": post, "data": data});
        }
        else if ("copy-to-tab" == action.action) {
            var tab_name = regex_replace_vars(action.tab, data.regex_match);
            filter_trace(data.id, `Copying to tab '${tab_name}'`);
            X.publish("filter/tab/copy", {"tab": tab_name, "post": post, "data": data});
        }
    }

    function regex_replace_vars(str, matches) {
        if (!str || !matches || !matches.length) {
            return str;
        }
        return str.replace(/\$(\d+)/g, function (m) {
            var i = m[1];
            if (i < matches.length) {
                return matches[i];
            }
            return "";
        });
    }

    function never_hide($post,data,updated_data) {
        if ($post.find('a[href*="/socialfixer/"]').length) {
            return true; // Never hide posts from Social Fixer!
        }
        return false;
    }

    function filter_hidden_note(filter, action, data) {
        var css = action.css || '';
        if (action.custom_note) {
            var note_text = regex_replace_vars(action.custom_note, data.regex_match);
            var note = X(`<div class="sfx_filter_hidden_note" style="${css}">${note_text}</div>`);
        }
        else {
            var note = X(`<div class="sfx_filter_hidden_note" style="${css}">Post hidden by filter "${filter.title}". Click to toggle post.</div>`);
        }
        note.on('click', function () {
            note.closest('*[sfx_post]').toggleClass('sfx_filter_hidden_show');
        });
        return note;
    }

    // Add actions to the post action tray
    X.publish('post/action/add', {"section": "filter", "label": "Edit Filters", "message": "menu/options", "data": {"section": "Filters"}});
    X.publish('post/action/add', {"section": "filter", "label": "Filter Debugger", "message": "post/action/filter/debug"});
    X.subscribe('post/action/filter/debug', function (msg, data) {
        var data_content = JSON.stringify(sfx_post_data[data.id], null, 3);
        var trace = sfx_filter_trace[data.id];
        var trace_content = trace ? trace.slice(1).join('<br>') : 'No Trace';
        var content = `
        <div>This popup gives details about how this post was processed for filtering.</div>
        <div draggable="false" class="sfx_bubble_note_subtitle">Filtering Trace</div>
        <div draggable="false" class="sfx_bubble_note_data">${trace_content}</div>
        <div draggable="false" class="sfx_bubble_note_subtitle">Raw Extracted Post Data</div>
        <div draggable="false" class="sfx_bubble_note_data">${data_content}</div>
    `;
        var note = bubble_note(content, {"position": "top_right", "title": "Post Filtering Debug", "close": true});
    });
});

// =====================================
// Post Filter: Move/Copy To Tab
// =====================================
X.ready('post_tabs', function() {
    FX.add_option('always_show_tabs', {
        "section": "Advanced"
        , "title": "Always Show Tab List"
        , "description": "Always show the list of Tabs in the Control Panel, even if no posts have been moved to tabs yet."
        , "default": false
    });
    var $tab_vm = null, tab_data, all_posts, unfiltered_posts, processed_posts, tab_list_added;
    var reset = function () {
        tab_data = {
            "post_count": 0,
            "post_count_read": 0,
            "filtered_count": 0,
            "filtered_count_read": 0,
            "tabs": {},
            "selected_tab": null,
            "show_all": false
        };
        all_posts = {};
        unfiltered_posts = {};
        processed_posts = {};
        tab_list_added = false;
    };
    reset();
    FX.on_page_unload(reset);
// When a post is hidden because it was 'read', update tab counts
    X.subscribe("post/hide_read", function (msg, data) {
        var id = data.id, key;
        // Look for this post in all the tabs to increase the "read count"
        for (key in tab_data.tabs) {
            if (typeof tab_data.tabs[key].posts[id] != "undefined") {
                // This post exists in this tab
                tab_data.tabs[key].read_count++;
            }
        }
        if (typeof unfiltered_posts[id] != "undefined") {
            tab_data.filtered_count_read++;
        }
        if (typeof all_posts[id] != "undefined") {
            tab_data.post_count_read++;
        }
    });
// When a post is unhidden because it was 'unread', update tab counts
    X.subscribe("post/unhide_read", function (msg, data) {
        var id = data.id, key;
        // Look for this post in all the tabs to decrease the "read count"
        for (key in tab_data.tabs) {
            if (typeof tab_data.tabs[key].posts[id] != "undefined") {
                // This post exists in this tab
                tab_data.tabs[key].read_count--;
            }
        }
        if (typeof unfiltered_posts[id] != "undefined") {
            tab_data.filtered_count_read--;
        }
        if (typeof all_posts[id] != "undefined") {
            tab_data.post_count_read--;
        }
    });
    var remove_post_from_other_tabs = function (dom_id, is_read) {
        // Look for this post in all the tabs
        var key;
        for (key in tab_data.tabs) {
            if (typeof tab_data.tabs[key].posts[dom_id] != "undefined") {
                // This post exists in this tab
                delete tab_data.tabs[key].posts[dom_id];
                //tab_data.tabs[key].read_count -= (is_read?1:0);
                tab_data.tabs[key].post_count--;
            }
        }
        if (typeof unfiltered_posts[dom_id] != "undefined") {
            delete unfiltered_posts[dom_id];
            tab_data.filtered_count--;
            tab_data.filtered_count_read -= (is_read ? 1 : 0);
        }
    };
// Move to the next tab in the list
    X.subscribe("filter/tab/next", function (msg, data) {
        if (!$tab_vm) {
            return;
        }
        // Get the list of tab names, in order
        var keys = Object.keys(tab_data.tabs).sort(function (a, b) {
            return a > b;
        });
        for (var i = 0; i < keys.length - 1; i++) {
            if (tab_data.tabs[keys[i]].selected) {
                for (var j = i + 1; j < keys.length; j++) {
                    if (tab_data.tabs[keys[j]].read_count < tab_data.tabs[keys[j]].post_count) {
                        $tab_vm.select_tab(tab_data.tabs[keys[j]]);
                        return;
                    }
                }
                return;
            }
        }
    });
    var create_tab_container_dom = function () {
        if (tab_list_added || X.find('#sfx_cp_filter_tabs')) {
            return;
        }
        tab_list_added = true;
        X.publish("cp/section/add", {
            "name": 'Filter Tabs <span class="sfx_count">(unread / total)</span>'
            , "id": "sfx_cp_filter_tabs"
            , "order": 50
            , "help": "The Filtered Feed shows the filtered view of the feed, with posts removed that have been moved to tabs.\n\nThe All Posts view shows every post in the feed, even if it has been filtered to a tab."
        });
        var html = `<div class="sfx_cp_tabs" style="max-height:60vh;overflow:auto;">
                    <div v-bind:class="{'selected':(show_all&&!selected_tab)}" class="sfx_filter_tab" @click="select_all()">All Posts <span class="sfx_count">(<span class="sfx_unread_count" v-if="post_count_read>0">{{post_count-post_count_read}}/</span>{{post_count}})</span></div>
                    <div v-if="post_count!=filtered_count" v-bind:class="{'selected':(!show_all&&!selected_tab)}" class="sfx_filter_tab" @click="select_filtered()">Filtered Feed <span class="sfx_count">(<span class="sfx_unread_count" v-if="filtered_count_read>0">{{filtered_count-filtered_count_read}}/</span>{{filtered_count}})</span></div>
                    <div v-for="tab in tabs | orderBy 'name'" class="sfx_filter_tab" v-bind:class="{'selected':tab.selected}" @click="select_tab(tab)">{{tab.name}} <span class="sfx_count">(<span class="sfx_unread_count" v-if="tab.read_count>0">{{tab.post_count-tab.read_count}}/</span>{{tab.post_count}})</span></div>
                </div>`;
        var methods = {
            "select_tab": function (tab) {
                if (tab_data.selected_tab) {
                    tab_data.selected_tab.selected = false;
                }
                tab_data.selected_tab = tab;
                tab.selected = true;
                X(`*[sfx_post]`).each(function () {
                    var $post = X(this);
                    if (typeof tab.posts[$post.attr('id')] != "undefined") {
                        $post.removeClass('sfx_filter_tab_hidden');
                    }
                    else {
                        $post.addClass('sfx_filter_tab_hidden');
                    }
                });
                FX.reflow(true);
            },
            "select_all": function () {
                if (this.selected_tab) {
                    this.selected_tab.selected = false;
                }
                this.selected_tab = null;
                this.show_all = true;
                X(`*[sfx_post]`).each(function () {
                    X(this).removeClass('sfx_filter_tab_hidden');
                });
                FX.reflow(true);
            },
            "select_filtered": function () {
                if (this.selected_tab) {
                    this.selected_tab.selected = false;
                }
                this.selected_tab = null;
                this.show_all = false;

                X(`*[sfx_post]`).each(function () {
                    var $post = X(this);
                    if (typeof unfiltered_posts[$post.attr('id')] != "undefined") {
                        $post.removeClass('sfx_filter_tab_hidden');
                    }
                    else {
                        $post.addClass('sfx_filter_tab_hidden');
                    }
                });
                FX.reflow(true);
            }
        };
        // Wait until the section is added before adding the content
        Vue.nextTick(function () {
            var v = template('#sfx_cp_filter_tabs', html, tab_data, methods);
            $tab_vm = v.$view; // The Vue instance, to access the $set method below
        });
    };
    var create_tab_container = function (tablist) {
        create_tab_container_dom();
        if (tablist) {
            X.when('#sfx_cp_filter_tabs', function () {
                tablist.forEach(function (t) {
                    create_tab(t);
                });
            });
        }
    };

// When the page first loads, show the tab container if tab filters are defined or `always_show_tabs'
    FX.on_options_load(function () {
        var always = FX.option('always_show_tabs');
        var show_cp = always;
        var tabs = [];
        var tab_list_added = false;
        // Only show tab list if we're filtering & there are actual tabbing filters; or `always_show_tabs'
        // XXX should be sensitive to filters_enabled_pages, filters_enabled_groups, and support groups?
        if (!FX.context.permalink) {
            if (always && FX.option('filters_enabled')) {
                (FX.storage('filters') || []).forEach(function (filter) {
                    if (!filter.enabled) {
                        return;
                    }
                    (filter.actions || []).forEach(function (action) {
                        if ((action.action == "copy-to-tab" || action.action == "move-to-tab") && action.tab != "$1") {
                            tabs.push(action.tab);
                            show_cp = true;
                        }
                    });
                });
            }
            if (show_cp) {
                X.subscribe("post/add", function () {
                    if (!tab_list_added) {
                        create_tab_container(tabs);
                        tab_list_added = true;
                    }
                });
                FX.on_page_unload(function () {
                    tab_list_added = false;
                });
            }
         }
    });

    var create_tab = function (tabname) {
        if (!tab_data.tabs[tabname]) {
            Vue.set(tab_data.tabs, tabname, {"name": tabname, "posts": {}, "selected": false, "post_count": 0, "read_count": 0});
        }
    };

    var add_to_tab = function (tabname, dom_id, post, copy) {
        create_tab(tabname);

        var is_read = post.hasClass('sfx_post_read') ? 1 : 0;
        // If moving, first remove the post from other tabs
        if (!copy) {
            remove_post_from_other_tabs(dom_id, is_read);
        }

        // Add the post to the new tab
        Vue.set(tab_data.tabs[tabname].posts, dom_id, {});

        tab_data.tabs[tabname].post_count++;
        // If this post has already been marked as read, increment the read_count now, because it won't be ticked later
        tab_data.tabs[tabname].read_count += is_read;

        // Show or Hide the post depending on what we are looking at now and where it should go
        if (!tab_data.selected_tab && !copy) { // Currently Showing the news feed, post shouldn't be here because it is moved to tab
            post.addClass('sfx_filter_tab_hidden');
        }
        else if (tab_data.selected_tab && tab_data.selected_tab.name == tabname) { // Showing a tab and the post belongs here
            post.removeClass('sfx_filter_tab_hidden');
        }
        else if (tab_data.selected_tab == null && copy) { // Showing the filtered feed, but the post should stay in the filtered feed too
            post.removeClass('sfx_filter_tab_hidden');
        }
        else {

        }
    };
    X.subscribe(["filter/tab/move", "filter/tab/copy"], function (msg, data) {
        try {
            var dom_id = data.data.dom_id;
            var tab_name = data.tab;
            var key = dom_id + dom_id + "/" + tab_name;
            // Check to see if post has already been processed to this tab, to avoid double-processing
            if (typeof processed_posts[key] == "undefined") {
                processed_posts[key] = true;
                create_tab_container();
                Vue.nextTick(function () {
                    add_to_tab(tab_name, dom_id, data.post, msg == "filter/tab/copy");
                });
            }
            else {
            }
        } catch (e) {
            alert(e);
        }
    });
// When new posts are added, if a tab is selected, hide them so the filter can decide whether to show them
    X.subscribe("post/add", function (msg, data) {
        tab_data.post_count++;
        if (tab_data.selected_tab) {
            data.dom.addClass('sfx_filter_tab_hidden');
        }
        tab_data.filtered_count++;
        all_posts[data.id] = {};
        unfiltered_posts[data.id] = {};
    });
});

X.ready( 'post_font', function() {
	FX.add_option('post_font_size', {
		"section": "User Interface"
		, "title": "Post Body Font Size"
		, "description": "Set a custom size for the body text of posts (FB default is 14). This will also force short status updates that Facebook enlarges to be the same size as all other posts."
		, "type": "number"
        , "min": 5
		, "default": ""
	});
    FX.add_option('post_font_family', {
        "section": "User Interface"
        , "title": "Post Body Font Family"
        , "description": "Set a custom font to be used only on post body text."
		, "type": "text"
        , "default": ""
    });
    FX.add_option('post_comment_font_size', {
        "section": "User Interface"
        , "title": "Post Comment Font Size"
        , "description": "Set a custom size for the font used in comments to posts."
        , "type": "number"
		, "min": 5
        , "default": ""
    });
    FX.add_option('post_comment_font_family', {
        "section": "User Interface"
        , "title": "Post Comment Font Family"
        , "description": "Set a custom font to be used only on the comments to posts."
        , "type": "text"
        , "default": ""
    });

	FX.on_options_load(function () {
		var post_font_size = FX.option('post_font_size');
        var post_font_family = FX.option('post_font_family');
        var post_comment_font_size = FX.option('post_comment_font_size');
        var post_comment_font_family = FX.option('post_comment_font_family');

        var css = "";
		if (post_font_size && +post_font_size>5) {
			css += `.userContent, .userContent *:not([aria-hidden="true"]) { font-size: ${post_font_size}px !important; }`;
		}
        if (post_font_family) {
            css += `.userContent, .userContent * { font-family: "${post_font_family}" !important; }`;
        }
        if (post_comment_font_size && +post_comment_font_size>5) {
            css += `.UFICommentContent, .UFICommentContent *:not([aria-hidden="true"]) { font-size: ${post_comment_font_size}px !important; }`;
        }
        if (post_comment_font_family) {
            css += `.UFICommentContent, .UFICommentContent * { font-family: "${post_comment_font_family}" !important; }`;
        }

		if (css) {
            FX.css(css);
        }
	});
});

// Universal (when FB is finished processing): <div data-fte="1" data-ftr="1" aria-labelledby="...">
// News Feed: id = hyperfeed_story_id_5605f5aa3e0ae5300811688
// Timeline: id = tl_unit_-2124908222973793679
// Group: id = mall_post_764394977004741:6
// Page: data-ft*="top_level_post_id"
// Global vars to be used in other components
var selector_catch_all = 'div[aria-labelledby][data-fte="1"][data-ftr="1"]';
var selector_news_feed = '*[id^="hyperfeed_story_id_"]';
var selector_timeline = '*[id^="tl_unit_"]';
var selector_group = '*[id^="mall_post_"]';
var selector_page = 'div[data-ft*="top_level_post_id"]:not(.fbFeedTickerStory)';
var post_selector = [selector_catch_all, selector_news_feed, selector_timeline, selector_group, selector_page].join(',');

X.ready('post_processor', function() {
	var sfx_post_selector = '*[sfx_post]';
	var sfx_post_id = 1;
	var max_posts = 50;
	var post_count = 0;
	var pager_selector = '#pagelet_group_pager, #www_pages_reaction_see_more_unit, *[data-testid="fbfeed_placeholder_story"] ~ a';

	FX.add_option('max_post_load_count', {"section": "Advanced", "title": 'Post Auto-Loading', "description": 'How many posts should be allowed to load before being paused.', "type": "text", "default": max_posts});
// When options are loaded and whenever 'max_post_load_count' is set, update the max posts value
	FX.on_option_live('max_post_load_count', function(val) {
		max_posts = val || max_posts;
	});

// When the page is first loaded, scan it for posts that exist as part of the static content
	FX.on_content_loaded(function () {
//		setTimeout(function () {
			// Find and handle inserted posts
			FX.on_content_inserted(function (o) {
				// If the inserted node lives within a <form> then it's in the reaction part of the post, we don't need to re-process
				if (o.is('form') || o.closest('form').length) {
					return;
				}

				var posts = find_and_process_posts(o);
				// If no posts processed, just part of a post may have been inserted, we need to check
				if (!posts || !posts.length) {

					var post = o.closest(sfx_post_selector);
					if (post.length == 1) {
						var id = post.attr('id');

						// The inserted content was inside of a post container
						// Process the post. If it's already been done, it will just exit
						process_post(id,true);
						var sfx_id = post.attr('sfx_id');

						X.publish("log/postdata", {"id": id, "message": "Calling post/update"});
						X.publish("post/update", {"id": id, "sfx_id": sfx_id, "dom": post, "inserted_tag":o[0].tagName, "inserted_id":o.attr('id')}, false, true); // Do not persist update messages

					}
				}
			});

			find_and_process_posts(X(document.body));

//		}, 0);
	});

	// Find and identify posts within any DOM element
// This can be fired at document load, or any time content is inserted.
	function find_and_process_posts(container) {
		var posts = container.find(post_selector);
		if (container.is(post_selector)) {
			posts = posts.add(container);
		}
		posts.each(function (i, post) {
			var $post = X(post);
			// Delay the processing of each post so it is async
			// The post may have internal DOM updates before it's processed, so we avoid processing the post multiple times
//			setTimeout(function () {
				process_post($post.attr('id'));
//			}, 50);
		});
		return posts;
	}

	// Do the initial process a post and mark it as being seen by SFX
	function process_post(id, is_update) {
		var $post = X(document.getElementById(id)); // Group posts have : in the id, which causes Zepto to crash

		// Sometimes an empty post container gets inserted, then removed and re-inserted with content
		// Before processing a container, make sure it's not just a shell
		X.publish("log/postdata", {"id": id, "message": "processing post id=" + id});

		// The initial processing recognizes a post and marks it as such
		var is_new = false;
		if (!$post.attr('sfx_post')) {
			$post.attr('sfx_post', sfx_post_id++); // Mark this post as processed
			X.publish("log/postdata", {"id": id, "message": "sfx_post=" + $post.attr('sfx_post')});
			is_new = true;
		}
		// Check for the sfx_id, which is a post's unique identifier to SFX
		var sfx_id = $post.attr('sfx_id');
		if (!sfx_id) {
			sfx_id = get_post_id($post);
			if (sfx_id) {
				// All known IDs are large integers.  Anything else is some
				// FB change which needs human intervention to adapt to.
				if (/^[0-9]+/.test(sfx_id)) {
					X.publish("log/postdata", {"id": id, "message": "found sfx_id=" + sfx_id});
					$post.attr('sfx_id', sfx_id);
				}
				else {
					X.publish("log/postdata", {"id": id, "message": "UNEXPECTED sfx_id=" + sfx_id});
					if (X.support_note) {
						X.support_note('post_processor', "UNEXPECTED sfx_id=" + sfx_id);
					}
				}
			}
		}

        var data = {
            "id": id
            , "dom": $post
            , "sfx_id": sfx_id
        };

        if (is_new) {
			X.publish("log/postdata", {"id": id, "message": "Calling post/add"});
			X.publish("post/add", data);

			// If we have processed too many posts, stop here
			if (post_count++ > max_posts) {
				var pager = X(pager_selector);
				if (pager.is('a')) {
					pager = pager.parent();
				}
				if (!pager.hasClass('sfx-pager-disabled')) {
					var newpager = X(`<div class="sfx_info sfx-pager" style="cursor:pointer;">Social Fixer has paused automatic loading of more than ${max_posts} posts to prevent Facebook from going into an infinite loop. <b>Click this message</b> to continue loading about <input type="number" min="1" value="${max_posts}" style="width:7ch;" size="4" sfx-option="max_post_load_count"> more posts.<br></div>`);
					FX.attach_options(newpager);
					try {
						newpager.find('input').click(function () {
							// Don't bubble up to newpager
							return false;
						});
						newpager.click(function () {
							newpager.remove();
							pager.removeClass('sfx-pager-disabled');
							post_count = 0;
							setTimeout(function () {
								FX.reflow(false);
								X.ui.scroll(3);
							}, 100);
						});
					} catch (e) {
						alert(e);
					}
					pager.first().before(newpager);
					pager.addClass('sfx-pager-disabled');
					setTimeout(function () {
						X.ui.scroll(3);
					}, 100);
				}
			}
		}
	}

// When navigating, reset post count
	FX.on_page_unload(function () {
		sfx_post_id = 1;
		post_count = 0;
	});

	var regex_fbid = /fbid=(\d+)/;
	var regex_post = /\/(?:posts|videos|permalink)\/(\d+)/;
	var regex_gallery = /\/photos\/\w\.[\d\.]+\/(\d+)/;

	function get_post_id_internal($post) {
		var id = $post.attr('id');
		var input = $post.find('input[name="ft_ent_identifier"][value]');
		if (input) {
			var value = input.attr('value');
			if (value) {
				return value;
			}       
		}
		// FB change circa 2017-01-19, seems to be coming and
		// going on individual accounts; handle both.  Old "href"
		// value now in "data-lynx-async-dest"; href points to
		// l.facebook.com/[url-encoded version of correct URL].
		// EXAMPLE: <a class="_5pcq" href="https://l.facebook.com/?u=https%3A%2F%2Fwww.facebook.com%2Fromana.machado%2Fposts%2F10155700442037926&e=ATPPp2GmoWgV2yVfCsLPeZGYp-x283eWqnQAuqhtUzgWDJyiC36sb8m75XmdN3zvRXcESqnR3ReXdLIisS-SMeJpBLEKr10suyvS556iVcu7cNc3Nxix97NWZPJku1cCDAJpp_VT-kduchAMexGYke7-pJJD5AuFqTblhwno0Bt6YFiAw3YzBHm7K7Hp5aSmsDo0pooH-_BfuMUSLEvkGTmIXx_FZ-j793sImqE0ZQ99-H21JXYqmhelqPW2iJPffDZNWwf9ter4Xg" target="" data-lynx-async-dest="/romana.machado/posts/10155700442037926">
		var permalink = $post.find('abbr.timestamp,abbr[data-utime][title]').parent();
		var href = permalink.attr('data-lynx-async-dest');
		if (!href || href == "#") {
			href = permalink.attr('href');
		}
		if (href) {
			if (regex_fbid.test(href) || regex_post.test(href) || regex_gallery.test(href)) {
				return RegExp.$1;
			}
			return href;
		}
		return null;
	}

	function get_post_id($post) {
    var id = $post.attr('id');
		var sfx_id = get_post_id_internal($post);

		// 2017-03-12: most IDs are simply long strings of digits, but some
		// are of the form digits:2, where "2" so far has only been seen to
		// be a single digit.  And ft_ent_identifier may be of the form:
		//    "846660526:10158243768475527:47:1489321690:10158243768475527:2"
		// in which "10158243768475527:2" is a proper ID; that is,
		// https://facebook.com/10158243768475527:2 points to that post.
		//
		// In a collected ID with multiple digit:digit sets, take the last
		// set of digits if it's >1 digit long; take the last two if the
		// last one is a single digit.
		if (/(\d+:\d)$/.test(sfx_id) || /:(\d+)$/.test(sfx_id)) {
			sfx_id = RegExp.$1;
		}

		X.publish("log/postdata", {"id": id, "message": "get_post_id=" + sfx_id == null ? "null" : sfx_id});
		return sfx_id;
	}
});

X.ready('regex_tester', function() {
    X.subscribe("test/regex", function (msg, data) {
        var text = data.text || '';
        var modifier = data.modifier || '';
        var content = `
        <div draggable="false">Mozilla Developer Network: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank">Regular Expressions Documentation</a></div>
        <div draggable="false" class="sfx_label_value">
            <div>Expression: </div>
            <div><input id="sfx_regex_tester_expression" size="25" value="${text}"></div>
        </div>
        <div draggable="false" class="sfx_label_value">
            <div>Modifiers: </div>
            <div><input id="sfx_regex_tester_modifier" size="5" value="${modifier}"> [ g i m ]</div>
        </div>
        <div draggable="false"><b>Test String:</b><br>
            <textarea id="sfx_regex_tester_string" style="width:250px;height:75px;"></textarea>
        </div>
        <div draggable="false">
            <input type="button" class="sfx_button" value="Test" onclick="document.getElementById('sfx_regex_tester_results').innerHTML=document.getElementById('sfx_regex_tester_string').value.replace(new RegExp('('+document.getElementById('sfx_regex_tester_expression').value+')',document.getElementById('sfx_regex_tester_modifier').value),'<span style=&quot;background-color:cyan;font-weight:bold;&quot;>$1</span>');">        
        </div>
        <div draggable="false">
            <div><b>Results:</b></div>
            <div id="sfx_regex_tester_results" style="white-space:pre;"></div>
        </div>

    `;
        bubble_note(content, {"position": "top_right", "title": "Regular Expression Tester", "close": true});
    });
});
// =========================================================
// Remove Columns
// =========================================================
X.ready('remove_columns', function() {
    FX.add_option('remove_left_column', {"section": "User Interface", "title": 'Remove Left Column', "description": 'Remove the left column of shortcuts and make posts a bit wider', "default": false});
    FX.on_options_load(function () {
        var cn = "hasLeftCol";
        if (FX.option('remove_left_column')) {
            X.when('body', function ($body) {
                $body.removeClass(cn);
                X.on_attribute_change($body[0], 'class', function () {
                    if ($body.hasClass("SettingsPage")) {
                        $body.addClass(cn);
                    }
                    else {
                        $body.removeClass(cn);
                    }
                });
            });
        }
    });

    FX.add_option('remove_ticker_sidebar', {"section": "User Interface", "title": 'Remove Sidebar', "description": 'Remove the "ticker" sidebar on the right side.', "default": false});
    FX.on_options_load(function () {
        var html = null;
        if (FX.option('remove_ticker_sidebar')) {
            X.poll(function () {
                if (!html || html.length == 0) {
                    html = X('html');
                }
                if (html && html.length && html.hasClass('sidebarMode')) {
                    html.removeClass('sidebarMode');
                }
                return false;
            }, 100, 100);
        }
    });
/*
    FX.add_option('remove_right_column', {"section": "User Interface", "title": 'Remove Right Column', "description": 'Remove the right column of widgets and make posts a bit wider', "default": false});
    FX.on_options_load(function () {
        var contentCol = null;
        if (FX.option('remove_right_column')) {
            FX.css("#rightCol { display:none !important; }");
            X.poll(function () {
                if (!contentCol || contentCol.length == 0) {
                    contentCol = X('#contentCol');
                }
                if (contentCol && contentCol.length && contentCol.hasClass('hasRightCol')) {
                    contentCol.removeClass('hasRightCol');
                }
                return false;
            }, 100, 100);
        }
    });
*/
});

X.ready('sfx_collision', function () {
	// Don't run this if the page was loaded a long time ago:
	//
	// Firefox (and family?) seem to update already-installed web_extensions by
	// injecting the new script into the already running page where the old one
	// was previously injected.  Social Fixer sees that the page was previously
	// meddled with (by its own previous version!) -- but we need to ignore it.
	//
	// Collision check doesn't need to fire every time as long as it eventually
	// notifies the user on some later page load.
	//
	// Refs:
	//
	// https://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface
	// https://developer.mozilla.org/en-US/docs/Web/API/Performance/timing

	if (performance && performance.timing && performance.timing.domLoading) {
		if (X.now() - performance.timing.domLoading > 10 * X.seconds) {
			return;
		}
	}

	X.when('#sfx_badge', function () {
		// Allow all version(s) to finish init & fighting over badge
		setTimeout(function () {
			var collision_alert = function (ver_msg, advice) {
				alert(`\
WARNING: two or more copies of Social Fixer are running at once! 

This one is:  version "${sfx_buildstr}". 
The other is: version "${ver_msg}". 

Please disable all older versions to avoid unexpected behavior! 

SEE http://tiny.cc/sfx-only-1 on removing old versions. 
SEE http://tiny.cc/sfx-saveprefs on saving and transferring preferences. 
SEE http://tiny.cc/sfx-ug ('Social Fixer User Support' group on FB) for help. 
${advice ? "\n" + advice + "\n" : ""} 
You may copy this text with CONTROL-C or COMMAND-C.`
				);
				X.support_note('sfx_collision', `Other: '${ver_msg}'`);
			};

			var $badge = X('#sfx_badge');
			var old_buildstr = $badge.attr('old_buildstr');
			var badge_buildstr = $badge.attr('sfx_buildstr');

			// Intentionally not an else-chain: intended & tested
			// to detect multiple classes of old version at once.

			// These divs existed in at least versions 5.968 through 12.0
			if (X("div.bfb_theme_extra_div").length > 0) {
				collision_alert("below 15.0.0",
				"NOTE: preferences from this version cannot be transferred, but should be saved for manual reference."
				);
			}
			// Another >=15 SFX without collision detection
			if (!badge_buildstr || old_buildstr == "old") {
				collision_alert("between 15.0.0 and 16.0.1");
			}
			// Another >=16 SFX with collision detection who created badge 1st
			// (if we created badge 1st, he complains for us)
			if (old_buildstr && old_buildstr != "old" && old_buildstr != sfx_buildstr) {
				collision_alert(old_buildstr);
			}
		}, 8000);
	});
});

FX.on_options_load(function () {
    X.storage.get('stats', {}, function (stats) {
        var today = X.today();
        if (today > (stats.last_ping || 0)) {
            stats.last_ping = today;
            X.ajax("https://SocialFixer.com/version.txt", function (ver) {
                X.storage.set('stats', "last_ping", today, function () {

                });
            });
        }
    }, true);
});
// =========================================================
// "Stealth" Mode
// =========================================================
X.ready('stealth_mode', function() {
	FX.add_option('stealth_mode', {"title": 'Stealth Mode', "description": 'Stealth Mode is a simple toggle in the wrench menu that hides or shows things you might accidentally click on when you don\'t mean to. It hides "Like" and "Add Friend" links and buttons, "Comment" fields, etc. Enabling this makes the wrench menu item appear.', "default": true});
    FX.add_option('stealth_mode_active', {"hidden":true, "default": false});

	FX.on_option('stealth_mode',function () {
		var menu_item = {"html": 'Enable "Stealth Mode"', "message": "stealth/toggle", "tooltip": "Hide comment input, Like buttons, Add Friend buttons, and other controls so you don't accidentally click on them."};
		X.publish("menu/add", {"section": "actions", "item": menu_item});

		var set_active = function() {
            menu_item.html = stealth_mode_active ? '<b>Disable "Stealth Mode"</b>' : 'Enable "Stealth Mode"';
            X('html').toggleClass("sfx_stealth_mode", stealth_mode_active);
        };
        var stealth_mode_active = FX.option('stealth_mode_active');
        set_active();

		X.subscribe("stealth/toggle", function () {
            stealth_mode_active = !stealth_mode_active;
            set_active();

			FX.option('stealth_mode_active',stealth_mode_active);
		});
	});
});

// ===================================================
// STICKY NOTES
// ===================================================
// o = Object to point to
// position = left | right
// content = stuff in the note
// pref = ?
// closefunc = ?
// opts = ?
function sticky_note(o,position,content,data) {
	data = data || {};
	var c = X(`
		<div class="sfx_sticky_note sfx_sticky_note_${position}">
			<div class="sfx_sticky_note_close"></div>
			<div>${content}</div>
			<div class="sfx_sticky_note_arrow_border"></div>
			<div class="sfx_sticky_note_arrow"></div>
		</div>
	`);
	var $o = X(o);
	o = $o[0];
	var ps = $o.css('position');
	if (ps!="relative" && ps!="absolute" && ps!="fixed") {
		o.style.position="relative";
	}
	try {
		c.css('visibility', 'hidden').appendTo(o);
	} catch(e) { alert(e); }
	var height = c[0].offsetHeight;
	c[0].style.marginTop = -(height/2) + "px";
	c[0].style.visibility="visible";
	// Close functionality
	var close = c.find('.sfx_sticky_note_close');
	if (false!==data.close) {
		close.click(function() {
			c.remove();
		});
		if (typeof data.closefunc=="function") {
			data.closefunc();
		}
	}
	else {
		close.remove();
	}
	return c;
}

// Check to make sure that the extension's storage is working correctly
X.ready('storage_check', function() {
    X.task('storage_check', 1*X.days, function() {
        FX.on_options_load(function () { setTimeout(function() {
            var now = X.now();
            var success = null;
            var error = function (err) {
                success = false;
                // Oops, storage didn't work!
                var error_msg="";
                if (err) {
                    error_msg = "<br><br>Error: "+err;
                }
                var version_info = "<br><br>" + sfx_user_agent + "<br>Social Fixer " + sfx_buildstr + "<br>" + sfx_userscript_agent;
                bubble_note("Social Fixer may have trouble saving your settings. If your settings won't stick, please let us know. See 'Support' under Options for contact info." + error_msg + version_info, {"close": true, "title": "Extension Storage Warning", "style": "width:300px;"});
                X.support_note('storage_check', err);
            };
            setTimeout(function () {
                if (success === null) {
                    error("Timeout waiting for storage response");
                }
            }, 8000);
            try {
                X.storage.set('storage_check', 'storage_checked_on', now, function () {
                    // Storage should have persisted by now
                    // Try retrieving it
                    try {
                        X.storage.get('storage_check', null, function (stats) {
                            if (!stats || !stats.storage_checked_on || (Math.abs(now - stats.storage_checked_on) > 60 * X.seconds)) {
                                var e = null;
                                if (!stats) { e="No stats"; }
                                else if (!stats.storage_checked_on) { e="stats.storage_checked_on doesn't exist"; }
                                else if ((Math.abs(now - stats.storage_checked_on) > 60 * X.seconds)) { e="stats.storage_checked_on = "+Math.abs(now - stats.storage_checked_on); }
                                return error(e);
                            }
                            success = true;
                        }, false);
                    } catch(e) {
                        error(e);
                    }
                });
            } catch(e) {
                error(e);
            }
        },1000);
        });
    });
});

X.ready('stretch_wide', function() {
        FX.add_option('stretch_wide',
            {
                    "section": "User Interface",
                    "title": 'Stretch Wide',
                    "description": 'The option to stretch the screen to full width is no longer a part of Social Fixer, because it was difficult to maintain and caused undesireable side-effects. If you use Stylish, browse the available "wide" styles by clicking the button to the right.',
                    "type": "link",
                    "url": "https://userstyles.org/styles/browse?as=1&per_page=25&search_terms=facebook+wide"
            }
        );
});

X.ready('tip_autoplay_videos', function() {
    FX.add_option('tip_autoplay_videos',
        {
            "section": "Tips",
            "title": 'Disable Auto-Play Videos',
            "description": 'You can prevent videos from automatically playing in posts as you scroll past them by disabling the auto-play option in your settings.',
            "type": "link",
            "url": "https://www.facebook.com/settings?tab=videos&sfx_highlight_autoplay=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/tab=videos\&sfx_highlight_autoplay=true/.test(location.href)) {
            X('form[action*="autoplay"]').closest('li').css('outline', '4px solid yellow');
        }
    });
});

X.ready('tip_friends_privacy', function() {
    FX.add_option('tip_friends_privacy',
        {
            "section": "Tips",
            "title": 'Make Your Friends List Private',
            "description": 'Hackers often create fake accounts using your publicly-available name and profile picture. Then they send friend requests to all your friends, pretending to be you and saying that you had to create a new account. You can prevent this kind of attack by not making your Friends list visible to these hackers.\nChange your Friends List privacy to "Friends" (or Custom).',
            "type": "link",
            "url": "https://www.facebook.com/settings/?tab=privacy&section=friendlist&view&sfx_tip_friends_privacy=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/sfx_tip_friends_privacy=true/.test(location.href)) {
            var selector = '._55pi[data-testid="privacy_selector_8787365733"]';
            X.when(selector, function (item) {
                item.css('outline', '3px solid yellow');
                setTimeout(function () {
                    X.ui.click(item);
                }, 1000);
            });
        }
    });
});

X.ready('tip_hide_birthday', function() {
    FX.add_option('tip_hide_birthday',
        {
            "section": "Tips",
            "title": 'Hide Your Birthday',
            "description": 'If you aren\'t the kind of person who wants all your acquaintances writing on your wall on your birthday, you can hide your birthday so none of your friends get alerted that it\'s your birthday.',
            "type": "link",
            "url": "https://www.facebook.com/me/about?section=contact-info&pnref=about&sfx_hide_birthday=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/sfx_hide_birthday=true/.test(location.href)) {
            var selector = 'a[ajaxify*="field_type=birth"]';
            X.when(selector, function (item) {
                item = item.first();
                item.css('outline', '3px solid yellow');
                item[0].scrollIntoView();
                setTimeout(function () {
                    X.ui.click(item);
                    X.when('form[ajaxify*="save/birthday/"] a', function (edit) {
                        edit = edit.first();
                        edit.css('outline', '3px solid yellow');
                        setTimeout(function () {
                            X.ui.click(edit);
                        }, 1000);
                    });
                }, 1000);
            });
        }
    });
});

X.ready('tip_live_video_notifications', function() {
    FX.add_option('tip_live_video_notifications',
        {
            "section": "Tips",
            "title": 'Disable Live Video Notifications',
            "description": 'Disable the notifications that Facebook sends when friends or pages "go live" with video.',
            "type": "link",
            "url": "https://www.facebook.com/settings?tab=notifications&section=on_facebook&view&highlight_live_video=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/highlight_live_video=true/.test(location.href)) {
            X('form[ajaxify*="live_video"]').closest('li').css('outline', '4px solid yellow');
        }
    });
});

X.ready('tip_page_notifications', function() {
    FX.add_option('tip_page_notifications',
        {
            "section": "Tips",
            "title": 'Get Notified When Pages Post',
            "description": 'Facebook has a built-in feature that sends you a Notification whenever a Page that you choose makes a post, so you never miss anything important. Click the button to be shown how to subscribe to Social Fixer Page notifications.',
            "type": "link",
            "url": "https://www.facebook.com/socialfixer?sfx_notifications=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/socialfixer\?sfx_notifications=true/.test(location.href)) {
            var likedButtonSelector = '.likedButton';
            var followingButtonSelector = '._55pi[data-testid="page_timeline_followed_button_test_id"]';

            X.when(`${likedButtonSelector}, ${followingButtonSelector}`, function () {
                // Try the following button first
                var button = X(followingButtonSelector);
                if (!button) {
                    button = X(likedButtonSelector);
                }
                button = button.first();
                button.parent().css('outline', '3px solid yellow');
                setTimeout(function () {
                    X.ui.click(button);
                    setTimeout(function () {
                        var notif = X('a[ajaxify^="/pages/get_notification/?tab=notif"]').closest('li').next();
                        notif.css('outline', '3px solid yellow');
                    }, 500);
                }, 1000);
            });
        }
    });
});

X.ready('tip_timeline_posts', function() {
    FX.add_option('tip_timeline_posts',
        {
            "section": "Tips",
            "title": 'Restrict Posts To Your Timeline',
            "description": `If you want to prevent friends and others from writing on your Timeline (which may show up in other friends' Newsfeeds), you can restrict permissions to Only Me so no one can write on your wall.`,
            "type": "link",
            "url": "https://www.facebook.com/settings?tab=timeline&section=posting&view&sfx_write_timeline=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/sfx_write_timeline=true/.test(location.href)) {
            var selector = '._55pi[data-testid="privacy_selector_10153940308610734"]';
            X.when(selector, function (item) {
                item.css('outline', '3px solid yellow');
                setTimeout(function () {
                    X.ui.click(item);
                }, 1000);
            });
        }
    });
});

X.ready('unread_filtered_messages', function() {
    FX.add_option('check_unread_filtered_messages', {
        "title": "Check For Filtered Messages"
        , "description": "Facebook hides Messages from people outside your network and doesn't alert you. This feature alerts you if there are any unread messages that Facebook has filtered."
        , "default": true
    });
    FX.on_option('check_unread_filtered_messages', function () {
        X.ajax_dom("https://mbasic.facebook.com/messages/?folder=other", function($dom) {
            var count = $dom.find('h3 > strong').length;
            if (count) {
                X.when('#mercurymessagesCountValue', function($o) {
                    var $clone = X($o.parent()[0].cloneNode(true)).addClass("sfx_jewelCount");
                    $clone.find('*[id]').removeAttr('id');
                    $clone.find('span').text(count).removeClass('hidden_elem');
                    var $container = $o.closest('.jewelButton');
                    $container.css('opacity',1).append( $clone );

                    // Is this the new Messenger format?
                    var isMessenger = $container.parent().find('a[href*="/messages/t/"]').length>0; // !!/\/t\//.test($container.parent().find('.seeMore').attr('href'));
                    var mailbox = isMessenger ? "/filtered/" : "/other?action=recent-messages";

                    // Add a message to the flyout
                    var tooltip = "When you receive Messages from people Facebook doesn't think you know, it filters them and doesn't inform you. Social Fixer adds this notification so you don't miss messages. This feature can be disabled in Options.";
                    var msg = `You have <span class="count">${count}</span> unread <a href="/messages${mailbox}">Filtered Message${count>1?'s':''}</a>`;
                    msg += ` <span style="margin-left:5px;" class="sfx_whats_this" data-hover="tooltip" data-tooltip-content="${tooltip}">(What's this?)</span>`;
                    var $msg = X('<div>').addClass("sfx_unread_filtered_message").safe_html(msg);
                    $container.parents('.uiToggle').find('.jewelHeader').append($msg);

                });
            }
        });
    });
});

// ===================================================
// Add a link to watch posts in SFX Watch util
// ===================================================
X.ready('social_fixer_watch', function() {
	FX.add_option('sfx_watch', {"section": "Experiments", "title": 'Social Fixer Watch', "description": "Add an icon to each post (next to the timestamp) that adds the story to the Social Fixer Watch utility, letting you track new Likes, Comments, and Shares.", "default": false});
	FX.on_content(function (o) {
		if (FX.option('sfx_watch')) {
			o.find('abbr.timestamp,abbr[data-utime]')
				.parent('a:not(.sfx_watched):not(.uiLinkSubtle)')
				.addClass('sfx_watched')
				.after(`
				<a class="sfx_watch" href="#" title="Add to Social Fixer Watch" onclick="window.open('http://socialfixer.com/watch/?'+encodeURIComponent(this.parentNode.querySelector('.sfx_watched').getAttribute('href')),'SFX_WATCH');return false;"></a>
			`);
		}
	});
});

var sfx_version = "21.1.0";
var sfx_buildtype = "greasemonkey";
var sfx_buildstr = sfx_version + " (" + sfx_buildtype + ")";
var sfx_user_agent = "Browser: " + navigator.userAgent;
var sfx_userscript_agent = undefined;
if (sfx_buildtype == "greasemonkey") {
   sfx_userscript_agent = "Script running under " +
      ((typeof GM_info === "undefined") ?
         "unknown v:unknown" :
         (GM_info.scriptHandler || "Greasemonkey") + " v:" + (GM_info.version || "unknown"));
}
var global_options = {
	"use_mutation_observers":true
};
var global = {};

// Stop running under certain conditions
// =====================================
var prevent_running = false;
if (window.top != window.self) { prevent_running=true; } // no frames
else if (/\/l.php\?u|\/ai.php|\/plugins\/|morestories\.php/.test(location.href)) { prevent_running=true; }
var runat = X.is_document_ready()?"document-end":"document-start";

// This actually executes module code by firing X.ready()
var run_modules = function() {
	// This tells each module to run itself
	X.ready();
	// First add any CSS that has been built up
	FX.css_dump();
	// Queue or Fire the DOMContentLoaded functions
	FX.fire_content_loaded();
};

// Should we even run at all?
if (!prevent_running) {
	// Allow modules to delay early execution of modules (until prefs are loaded) by returning false from beforeReady()
	if (X.beforeReady()!==false) {
		run_modules();
	}

  // Load Options (async)
  var bootstrap = function() {
    X.storage.get(['options', 'filters', 'tweaks', 'hiddens', 'postdata', 'friends', 'stats', 'tasks', 'messages'], [{}, [], [], {}, {}, {}, {}, {}, {}], function (options) {
      if (X.beforeReady(options) !== false) {
        run_modules();
        FX.options_loaded(options);
      }
    });
  };

  // Find out who we are
	// ===================
  userid = X.cookie.get('c_user') || "anonymous";
  // Prefix stored pref keys with userid so multiple FB users in the same browser can have separate prefs
  X.storage.prefix = userid;
	// If there is no user-level data stored, check to see if there is a global non-prefixed data.
	// If so, offer the user the chance to copy over those prefs
	// This is only needed for a while, until every user is transitioned over, then this code can be removed.
	X.storage.get('stats',null,function(stats) {
		var migrate_prefs = false;
		if (stats==null) {
			// No user-level data
			// Grab global data
      X.storage.prefix = null;
      X.storage.get(['options', 'filters', 'tweaks', 'hiddens', 'postdata', 'friends', 'stats', 'tasks', 'messages'], [{}, [], [], {}, {}, {}, {}, {}, {}], function (options) {
        if ((!stats || !stats.installed_on) && options && options.stats && options.stats.installed_on) {
          migrate_prefs = true;
          // Save all the options to user-level
          X.storage.prefix = userid;
          // These are all async, but it's fine
          X.storage.save('options', options.options);
          X.storage.save('filters', options.filters);
          X.storage.save('tweaks', options.tweaks);
          X.storage.save('hiddens', options.hiddens);
          X.storage.save('postdata', options.postdata);
          // Clear out the friends, because this is particularly problematic
          X.storage.save('friends', {});
          X.storage.save('stats', options.stats);
          X.storage.save('tasks', options.tasks);
          X.storage.save('messages', options.messages);

          // Inform the user of what happened
          alert('Social Fixer preferences will now be stored separately per user. Your existing settings have been copied over to your current user.\n\nClick OK to automatically refresh the page and have it take effect.');
          setTimeout(function () {
            window.location.reload(true);
          }, 750);
        }
        else {
          bootstrap();
        }
      });
		}
		else {
      bootstrap();
    }
	});
}

} catch(e) {
	console.log(e);
}
