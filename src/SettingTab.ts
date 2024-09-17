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

		containerEl.createEl("h2", { text: "창 투명도 및 크기 설정" });

		new Setting(containerEl)
			.setName("포커스 여부에 따른 투명도 사용")
			.setDesc(
				"이 옵션을 활성화하면 포커스 여부에 따라 창의 투명도가 변경됩니다."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableOpacityChange)
					.onChange(async (value) => {
						this.plugin.settings.enableOpacityChange = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("포커스 시 투명도")
			.setDesc("창이 포커스를 받을 때의 투명도 (0.0 ~ 1.0)")
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
			.setName("포커스 잃었을 때 투명도")
			.setDesc("창이 포커스를 잃었을 때의 투명도 (0.0 ~ 1.0)")
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
			.setName("포커스 여부에 따른 창 크기 및 위치 사용")
			.setDesc(
				"이 옵션을 활성화하면 포커스 여부에 따라 창의 크기와 위치가 변경됩니다."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableWindowResize)
					.onChange(async (value) => {
						this.plugin.settings.enableWindowResize = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h3", { text: "포커스 시 창 크기 및 위치" });

		new Setting(containerEl)
			.setName("X 좌표")
			.setDesc("창의 X 좌표를 설정합니다.")
			.addText((text) =>
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
			);

		new Setting(containerEl)
			.setName("Y 좌표")
			.setDesc("창의 Y 좌표를 설정합니다.")
			.addText((text) =>
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
			);

		new Setting(containerEl)
			.setName("너비")
			.setDesc("창의 너비를 설정합니다.")
			.addText((text) =>
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

		new Setting(containerEl)
			.setName("높이")
			.setDesc("창의 높이를 설정합니다.")
			.addText((text) =>
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
			);

		containerEl.createEl("h3", {
			text: "포커스 잃었을 때 창 크기 및 위치",
		});

		new Setting(containerEl)
			.setName("X 좌표")
			.setDesc("창의 X 좌표를 설정합니다.")
			.addText((text) =>
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
			);

		new Setting(containerEl)
			.setName("Y 좌표")
			.setDesc("창의 Y 좌표를 설정합니다.")
			.addText((text) =>
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
			);

		new Setting(containerEl)
			.setName("너비")
			.setDesc("창의 너비를 설정합니다.")
			.addText((text) =>
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

		new Setting(containerEl)
			.setName("높이")
			.setDesc("창의 높이를 설정합니다.")
			.addText((text) =>
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

		containerEl.createEl("h3", { text: "현재 창 상태 저장" });

		new Setting(containerEl)
			.setName("현재 창 상태 저장 (포커스 시)")
			.setDesc("현재 창의 위치와 크기를 포커스 시 설정으로 저장합니다.")
			.addButton((button) =>
				button.setButtonText("저장").onClick(async () => {
					const { remote } = require("electron");
					const window = remote.getCurrentWindow();
					const bounds = window.getBounds();
					this.plugin.settings.focusBounds = {
						x: bounds.x,
						y: bounds.y,
						width: bounds.width,
						height: bounds.height,
					};
					await this.plugin.saveSettings();
					new Notice("포커스 시 창 상태가 저장되었습니다.");
				})
			);

		new Setting(containerEl)
			.setName("현재 창 상태 저장 (포커스 잃었을 때)")
			.setDesc(
				"현재 창의 위치와 크기를 포커스 잃었을 때 설정으로 저장합니다."
			)
			.addButton((button) =>
				button.setButtonText("저장").onClick(async () => {
					const { remote } = require("electron");
					const window = remote.getCurrentWindow();
					const bounds = window.getBounds();
					this.plugin.settings.blurBounds = {
						x: bounds.x,
						y: bounds.y,
						width: bounds.width,
						height: bounds.height,
					};
					await this.plugin.saveSettings();
					new Notice("포커스 잃었을 때 창 상태가 저장되었습니다.");
				})
			);
	}
}
