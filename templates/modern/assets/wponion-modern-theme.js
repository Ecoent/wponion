"use strict";!function(s,n,d,p,e,o){var i=wp.hooks;e.fn.WPO_Modern_submenu=function(){var r=this;return r.elem.find(".wponion-submenus.subsubsub a").on("click",function(n){n.preventDefault();var e=d(this).attr("href");if(void 0!==(e=p.url_to_object(e))["section-id"]&&void 0!==e["parent-id"]){var o="wponion-tab-"+e["parent-id"],i=o+"-"+e["section-id"],t=r.elem.find("div#"+o+" div.wponion-section-wraps"),a=r.elem.find("div#"+o+" div#"+i);t.hide(),a.show(),d(this).parent().parent().find("a.current").removeClass("current"),d(this).addClass("current")}else d(".wponion-framework.wponion-module-settings .page-loader").show(),s.location.href=d(this).attr("href")}),r},e.fn.WPO_Modern_main_menu=function(){var a=this;return a.elem.find("nav.nav-tab-wrapper a").on("click",function(n){n.preventDefault();var e=d(this).attr("href");if(void 0!==(e=p.url_to_object(e))["parent-id"]){var o="wponion-tab-"+e["parent-id"],i=a.elem.find(" div.wponion-parent-wraps"),t=a.elem.find("div#"+o);i.hide(),t.show(),d(this).parent().find("a.nav-tab-active ").removeClass("nav-tab-active "),d(this).addClass("nav-tab-active ")}else d(".wponion-framework.wponion-module-settings .page-loader").show(),s.location.href=d(this).attr("href")}),a},i.addAction("wponion_before_init",function(){var n=d(".wponion-framework");n.hasClass("wponion-submenu-single-page")&&wponion_theme(".wponion-framework").WPO_Modern_submenu(),n.hasClass("wponion-single-page")&&wponion_theme(".wponion-framework").WPO_Modern_main_menu().WPO_Modern_submenu()})}(window,document,jQuery,$wponion,$wponion_theme);