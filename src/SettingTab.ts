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

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.focusedSettings = [];
		this.blurredSettings = [];
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
					})
			);

		// Focused Window Settings Subgroup
		containerEl.createEl("h4", { text: "Focused Window Settings" });

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
			);

		this.focusedSettings.push(
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

		this.focusedSettings.push(
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

		this.focusedSettings.push(
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

		this.focusedSettings.push(
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
		containerEl.createEl("h4", { text: "Blurred Window Settings" });

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
			);

		this.blurredSettings.push(
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

		this.blurredSettings.push(
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

		this.blurredSettings.push(
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

		this.blurredSettings.push(
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
			.setDesc("Show a border around the window when blurred. This helps locate the window when it's transparent.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableBorder)
					.onChange(async (value) => {
						this.plugin.settings.enableBorder = value;
						await this.plugin.saveSettings();
						this.plugin.applySettings(window, document.hasFocus());
					})
			);

		new Setting(containerEl)
			.setName("Border color")
			.setDesc("Color of the border when blurred. Helps identify the window more easily when it's transparent.")
			.addText((text) =>
				text
					.setPlaceholder("#FF5733")
					.setValue(this.plugin.settings.borderColor)
					.onChange(async (value) => {
						this.plugin.settings.borderColor = value;
						await this.plugin.saveSettings();
						this.plugin.applySettings(window, document.hasFocus());
					})
			);

		new Setting(containerEl)
			.setName("Border width")
			.setDesc("Width of the border in pixels. A thicker border can make the window easier to find when transparent.")
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
			);
	}

	updateFocusedSettingsUI() {
		const bounds = this.plugin.settings.focusBounds;
		(this.focusedSettings[0].components[0] as TextComponent).setValue(
			bounds.x.toString()
		);
		(this.focusedSettings[1].components[0] as TextComponent).setValue(
			bounds.y.toString()
		);
		(this.focusedSettings[2].components[0] as TextComponent).setValue(
			bounds.width.toString()
		);
		(this.focusedSettings[3].components[0] as TextComponent).setValue(
			bounds.height.toString()
		);
	}

	updateBlurredSettingsUI() {
		const bounds = this.plugin.settings.blurBounds;
		(this.blurredSettings[0].components[0] as TextComponent).setValue(
			bounds.x.toString()
		);
		(this.blurredSettings[1].components[0] as TextComponent).setValue(
			bounds.y.toString()
		);
		(this.blurredSettings[2].components[0] as TextComponent).setValue(
			bounds.width.toString()
		);
		(this.blurredSettings[3].components[0] as TextComponent).setValue(
			bounds.height.toString()
		);
	}
}
