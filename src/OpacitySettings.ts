import { Setting } from "obsidian";
import MyPlugin from "../main";

export class OpacitySettings {
	opacitySettings: Setting[];

	constructor(private containerEl: HTMLElement, private plugin: MyPlugin) {
		this.opacitySettings = [];
	}

	create(): void {
		const { containerEl } = this;

		containerEl.createEl("h3", { text: "투명도 설정" });

		new Setting(containerEl)
			.setName("투명도 변경 활성화")
			.setDesc("포커스 상태에 따라 창 투명도 변경")
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
				.setName("포커스 상태 투명도")
				.setDesc("창이 포커스된 상태일 때의 투명도 (0.0 - 1.0)")
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
	}

	createBlurredOpacitySetting(): void {
		this.opacitySettings.push(
			new Setting(this.containerEl)
				.setName("블러 상태 투명도")
				.setDesc("창이 블러 상태일 때의 투명도 (0.0 - 1.0)")
				.addText((text) =>
					text
						.setPlaceholder("0.5")
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
	}

	toggle(show: boolean): void {
		this.opacitySettings.forEach((setting) => {
			setting.settingEl.style.display = show ? "block" : "none";
		});
	}
}
