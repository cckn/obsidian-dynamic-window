import { Setting } from "obsidian";
import MyPlugin from "../main";

export class OpacitySettings {
	opacitySettings: Setting[];

	constructor(private containerEl: HTMLElement, private plugin: MyPlugin) {
		this.opacitySettings = [];
	}

	create(): void {
		const { containerEl } = this;

		containerEl.createEl("h3", { text: "Opacity settings" });

		new Setting(containerEl)
			.setName("Change opacity based on focus")
			.setDesc("Adjust window transparency when app gains or loses focus")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableOpacityChange)
					.onChange(async (value) => {
						this.plugin.settings.enableOpacityChange = value;
						await this.plugin.saveSettings();
						this.toggle(value);
					})
			);

		this.createFocusedOpacitySetting();
		this.createBlurredOpacitySetting();
	}

	createFocusedOpacitySetting(): void {
		this.opacitySettings.push(
			new Setting(this.containerEl)
				.setName("Focused opacity")
				.setDesc("Set opacity when app is in focus (0.0 - 1.0)")
				.addText((text) =>
					text
						.setPlaceholder("1.0")
						.setValue(this.plugin.settings.focusOpacity.toString())
						.onChange(async (value) => {
							const num = parseFloat(value);
							if (!isNaN(num) && num >= 0 && num <= 1) {
								this.plugin.settings.focusOpacity = num;
								await this.plugin.saveSettings();
							}
						})
				)
		);
	}

	createBlurredOpacitySetting(): void {
		this.opacitySettings.push(
			new Setting(this.containerEl)
				.setName("Blurred opacity")
				.setDesc("Set opacity when app loses focus (0.0 - 1.0)")
				.addText((text) =>
					text
						.setPlaceholder("0.5")
						.setValue(this.plugin.settings.blurOpacity.toString())
						.onChange(async (value) => {
							const num = parseFloat(value);
							if (!isNaN(num) && num >= 0 && num <= 1) {
								this.plugin.settings.blurOpacity = num;
								await this.plugin.saveSettings();
							}
						})
				)
		);
	}

	toggle(show: boolean): void {
		this.opacitySettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
	}
}
