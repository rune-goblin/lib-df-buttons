/// <reference path="./ToolType.d.ts" />

import SETTINGS from "../common/Settings.mjs";
import ControlManagerImpl from "./ControlManager.mjs";

SETTINGS.init('lib-df-buttons');

Hooks.once('init', () => {
	ui.moduleControls = new ControlManagerImpl();

	SETTINGS.register('position', {
		scope: 'client',
		choices: {
			right: 'LIB_DF_BUTTONS.choices.right',
			left: 'LIB_DF_BUTTONS.choices.left',
			top: 'LIB_DF_BUTTONS.choices.top',
			bottom: 'LIB_DF_BUTTONS.choices.bottom'
		},
		name: 'LIB_DF_BUTTONS.name',
		hint: 'LIB_DF_BUTTONS.hint',
		config: false,
		default: 'left',
		onChange: () => ui.moduleControls.render()
	});

	// Soft Dependency on `libwrapper`. Only use it if it already exists
	if (game.modules.get('libWrapper')?.active) {
		libWrapper.register(SETTINGS.MOD_NAME, 'Sidebar.prototype.expand', /**@this {Sidebar}*/function (/**@type {Function}*/wrapped) {
			Hooks.callAll('collapseSidebarPre', this, !this._collapsed);
			wrapped();
		}, 'WRAPPER');
		libWrapper.register(SETTINGS.MOD_NAME, 'Sidebar.prototype.collapse', /**@this {Sidebar}*/function (/**@type {Function}*/wrapped) {
			Hooks.callAll('collapseSidebarPre', this, !this._collapsed);
			wrapped();
		}, 'WRAPPER');
	}// Otherwise do the traditional style of monkey-patch wrapper
	else {
		Sidebar.prototype.expand_ORIG = Sidebar.prototype.expand;
		Sidebar.prototype.expand = /**@this {Sidebar}*/function() {
			Hooks.callAll('collapseSidebarPre', this, !this._collapsed);
			Sidebar.prototype.expand_ORIG.bind(this)();
		};
		Sidebar.prototype.collapse_ORIG = Sidebar.prototype.collapse;
		Sidebar.prototype.collapse = /**@this {Sidebar}*/function() {
			Hooks.callAll('collapseSidebarPre', this, !this._collapsed);
			Sidebar.prototype.collapse_ORIG.bind(this)();
		};
	}
});
Hooks.once('setup', () => ui.moduleControls.initialize());
Hooks.once('ready', () => ui.moduleControls.render(true));
