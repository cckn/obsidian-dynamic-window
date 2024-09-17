import MyPlugin from "main";
import {
	App,
	Notice,
	PluginSettingTab,
	Setting,
	TextComponent,
} from "obsidian";

export class SettingTab extends PluginSettingTab {
	plugin: MyPlugin;
	focusedSettings: Setting[];
	blurredSettings: Setting[];
	opacitySettings: Setting[];
	resizeSettings: Setting[];
	borderSettings: Setting[];

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.focusedSettings = [];
		this.blurredSettings = [];
		this.opacitySettings = [];
		this.resizeSettings = [];
		this.borderSettings = [];
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Opacity Settings Group
		containerEl.createEl("h3", { text: "Opacity Settings" });

		new Setting(containerEl)
			.setName("Enable opacity change")
			.setDesc("Change window opacity based on focus state")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableOpacityChange)
					.onChange(async (value) => {
						this.plugin.settings.enableOpacityChange = value;
						await this.plugin.saveSettings();
						this.toggleOpacitySettings(value);
					})
			);

		this.opacitySettings.push(
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
				)
		);

		this.opacitySettings.push(
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
				)
		);

		// Window Resize Settings Group
		containerEl.createEl("h3", { text: "Window Resize Settings" });

		new Setting(containerEl)
			.setName("Enable window resize")
			.setDesc("Change window size and position based on focus state")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableWindowResize)
					.onChange(async (value) => {
						this.plugin.settings.enableWindowResize = value;
						await this.plugin.saveSettings();
						this.toggleResizeSettings(value);
					})
			);

		// Focused Window Settings Subgroup
		this.resizeSettings.push(
			new Setting(containerEl)
				.setName("Memorize current window state as focused")
				.setDesc(
					"Save current window position and size for the focused state"
				)
				.addButton((button) =>
					button.setButtonText("Memorize").onClick(async () => {
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
						this.updateFocusedSettingsUI();
						new Notice("Current window state memorized as focused");
					})
				)
		);

		this.resizeSettings.push(
			new Setting(containerEl).setName("X coordinate").addText((text) =>
				text
					.setPlaceholder(
						this.plugin.settings.focusBounds.x.toString()
					)
					.setValue(this.plugin.settings.focusBounds.x.toString())
					.onChange(async (value) => {
						let num = parseInt(value);
						if (!isNaN(num)) {
							this.plugin.settings.focusBounds.x = num;
							await this.plugin.saveSettings();
						}
					})
			)
		);

		this.resizeSettings.push(
			new Setting(containerEl).setName("Y coordinate").addText((text) =>
				text
					.setPlaceholder(
						this.plugin.settings.focusBounds.y.toString()
					)
					.setValue(this.plugin.settings.focusBounds.y.toString())
					.onChange(async (value) => {
						let num = parseInt(value);
						if (!isNaN(num)) {
							this.plugin.settings.focusBounds.y = num;
							await this.plugin.saveSettings();
						}
					})
			)
		);

		this.resizeSettings.push(
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
			)
		);

		this.resizeSettings.push(
			new Setting(containerEl).setName("Height").addText((text) =>
				text
					.setPlaceholder(
						this.plugin.settings.focusBounds.height.toString()
					)
					.setValue(
						this.plugin.settings.focusBounds.height.toString()
					)
					.onChange(async (value) => {
						let num = parseInt(value);
						if (!isNaN(num) && num > 0) {
							this.plugin.settings.focusBounds.height = num;
							await this.plugin.saveSettings();
						}
					})
			)
		);

		// Blurred Window Settings Subgroup
		this.resizeSettings.push(
			new Setting(containerEl)
				.setName("Memorize current window state as blurred")
				.setDesc(
					"Save current window position and size for the blurred state"
				)
				.addButton((button) =>
					button.setButtonText("Memorize").onClick(async () => {
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
						this.updateBlurredSettingsUI();
						new Notice("Current window state memorized as blurred");
					})
				)
		);

		this.resizeSettings.push(
			new Setting(containerEl).setName("X coordinate").addText((text) =>
				text
					.setPlaceholder(
						this.plugin.settings.blurBounds.x.toString()
					)
					.setValue(this.plugin.settings.blurBounds.x.toString())
					.onChange(async (value) => {
						let num = parseInt(value);
						if (!isNaN(num)) {
							this.plugin.settings.blurBounds.x = num;
							await this.plugin.saveSettings();
						}
					})
			)
		);

		this.resizeSettings.push(
			new Setting(containerEl).setName("Y coordinate").addText((text) =>
				text
					.setPlaceholder(
						this.plugin.settings.blurBounds.y.toString()
					)
					.setValue(this.plugin.settings.blurBounds.y.toString())
					.onChange(async (value) => {
						let num = parseInt(value);
						if (!isNaN(num)) {
							this.plugin.settings.blurBounds.y = num;
							await this.plugin.saveSettings();
						}
					})
			)
		);

		this.resizeSettings.push(
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
			)
		);

		this.resizeSettings.push(
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
			)
		);

		// Border Settings Group
		containerEl.createEl("h3", { text: "Border Settings" });

		new Setting(containerEl)
			.setName("Enable border")
			.setDesc(
				"Show a border around the window when blurred. This helps locate the window when it's transparent."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableBorder)
					.onChange(async (value) => {
						this.plugin.settings.enableBorder = value;
						await this.plugin.saveSettings();
						this.toggleBorderSettings(value);
					})
			);

		this.borderSettings.push(
			new Setting(containerEl)
				.setName("Border color")
				.setDesc(
					"Color of the border when blurred. Helps identify the window more easily when it's transparent."
				)
				.addText((text) =>
					text
						.setPlaceholder("#FF5733")
						.setValue(this.plugin.settings.borderColor)
						.onChange(async (value) => {
							this.plugin.settings.borderColor = value;
							await this.plugin.saveSettings();
							this.plugin.applySettings(
								window,
								document.hasFocus()
							);
						})
				)
		);

		this.borderSettings.push(
			new Setting(containerEl)
				.setName("Border width")
				.setDesc(
					"Width of the border in pixels. A thicker border can make the window easier to find when transparent."
				)
				.addText((text) =>
					text
						.setPlaceholder("2")
						.setValue(this.plugin.settings.borderWidth.toString())
						.onChange(async (value) => {
							const num = parseInt(value);
							if (!isNaN(num) && num >= 0) {
								this.plugin.settings.borderWidth = num;
								await this.plugin.saveSettings();
								this.plugin.applySettings(
									window,
									document.hasFocus()
								);
							}
						})
				)
		);

		this.toggleOpacitySettings(this.plugin.settings.enableOpacityChange);
		this.toggleResizeSettings(this.plugin.settings.enableWindowResize);
		this.toggleBorderSettings(this.plugin.settings.enableBorder);
	}

	toggleOpacitySettings(show: boolean) {
		this.opacitySettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
	}

	toggleResizeSettings(show: boolean) {
		this.resizeSettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
	}

	toggleBorderSettings(show: boolean) {
		this.borderSettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
	}

	updateFocusedSettingsUI() {
		const bounds = this.plugin.settings.focusBounds;
		(this.resizeSettings[1].components[0] as TextComponent).setValue(
			bounds.x.toString()
		);
		(this.resizeSettings[2].components[0] as TextComponent).setValue(
			bounds.y.toString()
		);
		(this.resizeSettings[3].components[0] as TextComponent).setValue(
			bounds.width.toString()
		);
		(this.resizeSettings[4].components[0] as TextComponent).setValue(
			bounds.height.toString()
		);
	}

	updateBlurredSettingsUI() {
		const bounds = this.plugin.settings.blurBounds;
		(this.resizeSettings[6].components[0] as TextComponent).setValue(
			bounds.x.toString()
		);
		(this.resizeSettings[7].components[0] as TextComponent).setValue(
			bounds.y.toString()
		);
		(this.resizeSettings[8].components[0] as TextComponent).setValue(
			bounds.width.toString()
		);
		(this.resizeSettings[9].components[0] as TextComponent).setValue(
			bounds.height.toString()
		);
	}
}
