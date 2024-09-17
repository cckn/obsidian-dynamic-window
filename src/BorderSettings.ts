import { Setting } from "obsidian";
import MyPlugin from "../main";

export class BorderSettings {
	borderSettings: Setting[];

	constructor(private containerEl: HTMLElement, private plugin: MyPlugin) {
		this.borderSettings = [];
	}

	create(): void {
		this.containerEl.createEl("h3", { text: "Border settings" });

		new Setting(this.containerEl)
			.setName("Enable border")
			.setDesc(
				"Show a border when the window is inactive. This helps locate the window when it's transparent."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableBorder)
					.onChange(async (value) => {
						this.plugin.settings.enableBorder = value;
						await this.plugin.saveSettings();
						this.toggle(value);
					})
			);

		this.createBorderColorSetting();
		this.createBorderWidthSetting();

		this.toggle(this.plugin.settings.enableBorder);
	}

	createBorderColorSetting(): void {
		this.borderSettings.push(
			new Setting(this.containerEl)
				.setName("Border color")
				.setDesc(
					"Set the color of the border when the window is inactive. This helps identify the window when it's transparent."
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
	}

	createBorderWidthSetting(): void {
		this.borderSettings.push(
			new Setting(this.containerEl)
				.setName("Border width")
				.setDesc(
					"Set the width of the border in pixels. A thicker border can make the window easier to find when transparent."
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
	}

	toggle(show: boolean): void {
		this.borderSettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
	}
}
