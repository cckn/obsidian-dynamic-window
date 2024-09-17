import { Setting } from "obsidian";
import MyPlugin from "../main";

export class BorderSettings {
	borderSettings: Setting[];

	constructor(private containerEl: HTMLElement, private plugin: MyPlugin) {
		this.borderSettings = [];
	}

	create(): void {
		this.containerEl.createEl("h3", { text: "테두리 설정" });

		new Setting(this.containerEl)
			.setName("테두리 활성화")
			.setDesc(
				"창이 흐릿해질 때 테두리를 표시합니다. 이는 창이 투명할 때 위치를 파악하는 데 도움이 됩니다."
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
				.setName("테두리 색상")
				.setDesc(
					"흐릿해질 때의 테두리 색상. 창이 투명할 때 더 쉽게 식별할 수 있도록 도와줍니다."
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
				.setName("테두리 너비")
				.setDesc(
					"테두리의 너비(픽셀 단위). 더 두꺼운 테두리는 창이 투명할 때 찾기 쉽게 만들 수 있습니다."
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
