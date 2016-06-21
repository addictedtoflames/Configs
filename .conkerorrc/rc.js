//Set editor to vim
editor_shell_command = "xterm -rv -e vim";

//Uses HJKL keys for page navigation
require("global-overlay-keymap");
define_key(content_buffer_normal_keymap, "j", "cmd_scrollLineDown");
define_key(content_buffer_normal_keymap, "k", "cmd_scrollLineUp");
define_key_alias( "C-k", "C-p");
define_key_alias( "C-j", "C-n");
define_key(content_buffer_normal_keymap, "C-h", "back");
define_key(content_buffer_normal_keymap, "Backspace", "back");
define_key(content_buffer_normal_keymap, "C-l", "forward");
define_key(content_buffer_normal_keymap, "h", "buffer-next");
define_key(content_buffer_normal_keymap, "l", "buffer-previous");

//Open URL in new window
define_key(content_buffer_normal_keymap, "C-g", "find-url-new-buffer");
define_key(content_buffer_normal_keymap, "n", "find-url-new-buffer");
define_key(content_buffer_normal_keymap, "F", "follow-new-buffer");

//Manages auto-save/resume
require("session.js");
session_auto_save_file();
session_auto_save_auto_load(true);

//Webjumps
define_webjump("Arch Wiki", "https://wiki.archlinux.org/index.php?title=Special%3ASearch&profile=default&search=%s&fulltext=Search", $alternative="https://wiki.archlinux.org");

//Selection searches
function create_selection_search(webjump, key) {
    interactive(webjump+"-selection-search",
                "Search " + webjump + " with selection contents",
                "find-url-new-buffer",
                $browser_object = function (I) {
                    return webjump + " " + I.buffer.top_frame.getSelection();});
    define_key(content_buffer_normal_keymap, key.toUpperCase(), webjump + "-selection-search");

    interactive("prompted-"+webjump+"-search", null,
                function (I) {
                    var term = yield I.minibuffer.read_url($prompt = "Search "+webjump+":",
                                                           $initial_value = webjump+" ",
                                                           $select = false);
                    browser_object_follow(I.buffer, FOLLOW_DEFAULT, term);
                });
    define_key(content_buffer_normal_keymap, key, "prompted-" + webjump + "-search");
}
// examples
// create_selection_search("g","l");
create_selection_search("wikipedia","w");
// create_selection_search("dictionary","d");
// create_selection_search("myspace","y");
// create_selection_search("amazon","a");
create_selection_search("youtube","y");
create_selection_search("duckduckgo","a");

//Bind number keys
function define_switch_buffer_key (key, buf_num) {
    define_key(default_global_keymap, key,
               function (I) {
                   switch_to_buffer(I.window,
                                    I.window.buffers.get_buffer(buf_num));
               });
}
for (let i = 0; i < 10; ++i) {
    define_switch_buffer_key(String((i+1)%10), i);
}
