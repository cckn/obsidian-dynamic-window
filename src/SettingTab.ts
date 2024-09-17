import MyPlugin from "main";
import { App, Notice, PluginSettingTab, Setting } from "obsidian";

export class SettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Enable opacity change")
			.setDesc("Change window opacity based on focus state")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableOpacityChange)
					.onChange(async (value) => {
						this.plugin.settings.enableOpacityChange = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Focused opacity")
			.setDesc("Window opacity when focused (0.0 - 1.0)")
			.addText((text) =>
				text
					.setPlaceholder("1.0")
					.setValue(this.plugin.settings.focusOpacity.toString())
					.onChange(async (value) => {
						let num = parseFloat(value);
						if (!isNaN(num) && num >= 0 && num <= 1) {
							this.plugin.settings.focusOpacity = num;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("Blurred opacity")
			.setDesc("Window opacity when blurred (0.0 - 1.0)")
			.addText((text) =>
				text
					.setPlaceholder("0.88")
					.setValue(this.plugin.settings.blurOpacity.toString())
					.onChange(async (value) => {
						let num = parseFloat(value);
						if (!isNaN(num) && num >= 0 && num <= 1) {
							this.plugin.settings.blurOpacity = num;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("Enable window resize")
			.setDesc("Change window size and position based on focus state")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableWindowResize)
					.onChange(async (value) => {
						this.plugin.settings.enableWindowResize = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl).setName("Focused window").setHeading();

		new Setting(containerEl).setName("X coordinate").addText((text) =>
			text
				.setPlaceholder(this.plugin.settings.focusBounds.x.toString())
				.setValue(this.plugin.settings.focusBounds.x.toString())
				.onChange(async (value) => {
					let num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.focusBounds.x = num;
						await this.plugin.saveSettings();
					}
				})
		);

		new Setting(containerEl).setName("Y coordinate").addText((text) =>
			text
				.setPlaceholder(this.plugin.settings.focusBounds.y.toString())
				.setValue(this.plugin.settings.focusBounds.y.toString())
				.onChange(async (value) => {
					let num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.focusBounds.y = num;
						await this.plugin.saveSettings();
					}
				})
		);

		new Setting(containerEl).setName("Width").addText((text) =>
			text
				.setPlaceholder(
					this.plugin.settings.focusBounds.width.toString()
				)
				.setValue(this.plugin.settings.focusBounds.width.toString())
				.onChange(async (value) => {
					let num = parseInt(value);
					if (!isNaN(num) && num > 0) {
						this.plugin.settings.focusBounds.width = num;
						await this.plugin.saveSettings();
					}
				})
		);

		new Setting(containerEl).setName("Height").addText((text) =>
			text
				.setPlaceholder(
					this.plugin.settings.focusBounds.height.toString()
				)
				.setValue(this.plugin.settings.focusBounds.height.toString())
				.onChange(async (value) => {
					let num = parseInt(value);
					if (!isNaN(num) && num > 0) {
						this.plugin.settings.focusBounds.height = num;
						await this.plugin.saveSettings();
					}
				})
		);

		new Setting(containerEl).setName("Blurred window").setHeading();

		new Setting(containerEl).setName("X coordinate").addText((text) =>
			text
				.setPlaceholder(this.plugin.settings.blurBounds.x.toString())
				.setValue(this.plugin.settings.blurBounds.x.toString())
				.onChange(async (value) => {
					let num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.blurBounds.x = num;
						await this.plugin.saveSettings();
					}
				})
		);

		new Setting(containerEl).setName("Y coordinate").addText((text) =>
			text
				.setPlaceholder(this.plugin.settings.blurBounds.y.toString())
				.setValue(this.plugin.settings.blurBounds.y.toString())
				.onChange(async (value) => {
					let num = parseInt(value);
					if (!isNaN(num)) {
						this.plugin.settings.blurBounds.y = num;
						await this.plugin.saveSettings();
					}
				})
		);

		new Setting(containerEl).setName("Width").addText((text) =>
			text
				.setPlaceholder(
					this.plugin.settings.blurBounds.width.toString()
				)
				.setValue(this.plugin.settings.blurBounds.width.toString())
				.onChange(async (value) => {
					let num = parseInt(value);
					if (!isNaN(num) && num > 0) {
						this.plugin.settings.blurBounds.width = num;
						await this.plugin.saveSettings();
					}
				})
		);

		new Setting(containerEl).setName("Height").addText((text) =>
			text
				.setPlaceholder(
					this.plugin.settings.blurBounds.height.toString()
				)
				.setValue(this.plugin.settings.blurBounds.height.toString())
				.onChange(async (value) => {
					let num = parseInt(value);
					if (!isNaN(num) && num > 0) {
						this.plugin.settings.blurBounds.height = num;
						await this.plugin.saveSettings();
					}
				})
		);

		new Setting(containerEl)
			.setName("Save current window state")
			.setHeading();

		new Setting(containerEl)
			.setName("Save focused state")
			.setDesc("Save current window position and size as focused state")
			.addButton((button) =>
				button.setButtonText("Save").onClick(async () => {
					const electron = require("electron");
					const window = electron.remote
						? electron.remote.getCurrentWindow()
						: electron.getCurrentWindow();
					const bounds = window.getBounds();
					this.plugin.settings.focusBounds = {
						x: bounds.x,
						y: bounds.y,
						width: bounds.width,
						height: bounds.height,
					};
					await this.plugin.saveSettings();
					new Notice("Focused window state saved");
				})
			);

		new Setting(containerEl)
			.setName("Save blurred state")
			.setDesc("Save current window position and size as blurred state")
			.addButton((button) =>
				button.setButtonText("Save").onClick(async () => {
					const electron = require("electron");
					const window = electron.remote
						? electron.remote.getCurrentWindow()
						: electron.getCurrentWindow();
					const bounds = window.getBounds();
					this.plugin.settings.blurBounds = {
						x: bounds.x,
						y: bounds.y,
						width: bounds.width,
						height: bounds.height,
					};
					await this.plugin.saveSettings();
					new Notice("Blurred window state saved");
				})
			);
	}
}
