// main.ts
import { Notice, Plugin } from "obsidian";
import { SettingTab } from "./src/SettingTab";

interface WindowBounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface AllwaysOnTopSettings {
	enableOpacityChange: boolean;

	focusOpacity: number;
	blurOpacity: number;

	enableWindowResize: boolean;
	focusBounds: WindowBounds;
	blurBounds: WindowBounds;
	enableBorder: boolean;
	borderColor: string;
	borderWidth: number;
}

const DEFAULT_SETTINGS: AllwaysOnTopSettings = {
	enableOpacityChange: true,
	focusOpacity: 1.0,
	blurOpacity: 0.5,
	enableWindowResize: false,
	focusBounds: { x: 100, y: 100, width: 800, height: 600 },
	blurBounds: { x: 150, y: 150, width: 700, height: 500 },
	enableBorder: true,
	borderColor: "#FF5733",
	borderWidth: 2,
};

export default class MyPlugin extends Plugin {
	settings: AllwaysOnTopSettings;
	focusHandler: () => void;
	blurHandler: () => void;

	async onload() {
		await this.loadSettings();

		const electron = require("electron");
		const window = electron.remote
			? electron.remote.getCurrentWindow()
			: electron.getCurrentWindow();

		// 창 항상 위에 설정
		window.setAlwaysOnTop(true);

		// 초기 창 설정
		this.applySettings(window, document.hasFocus());

		// 이벤트 핸들러 설정
		this.focusHandler = () => {
			this.applySettings(window, true);
		};

		this.blurHandler = () => {
			this.applySettings(window, false);
		};

		if (window.on) {
			window.on("focus", this.focusHandler);
			window.on("blur", this.blurHandler);
		} else if (window.addEventListener) {
			window.addEventListener("focus", this.focusHandler);
			window.addEventListener("blur", this.blurHandler);
		}

		// 설정 탭 추가
		this.addSettingTab(new SettingTab(this.app, this));

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");
	}

	onunload() {
		console.log("Unloading Window Opacity and Size Plugin");

		const electron = require("electron");
		const window = electron.remote
			? electron.remote.getCurrentWindow()
			: electron.getCurrentWindow();

		// 창 항상 위 설정 해제 및 초기화
		window.setAlwaysOnTop(false);
		window.setOpacity(1.0);
		window.setBounds({ x: 100, y: 100, width: 800, height: 600 });

		if (window.removeListener) {
			window.removeListener("focus", this.focusHandler);
			window.removeListener("blur", this.blurHandler);
		} else if (window.removeEventListener) {
			window.removeEventListener("focus", this.focusHandler);
			window.removeEventListener("blur", this.blurHandler);
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	applySettings(window: any, isFocused: boolean) {
		const body = document.body;

		if (this.settings.enableOpacityChange) {
			if (isFocused) {
				window.setOpacity(this.settings.focusOpacity);
			} else {
				window.setOpacity(this.settings.blurOpacity);
			}
		}

		if (this.settings.enableWindowResize) {
			if (isFocused) {
				window.setBounds(this.settings.focusBounds);
			} else {
				window.setBounds(this.settings.blurBounds);
			}
		}

		if (this.settings.enableBorder) {
			if (isFocused) {
				body.style.border = "none";
			} else {
				body.style.border = `${this.settings.borderWidth}px solid ${this.settings.borderColor}`;
			}
		} else {
			body.style.border = "none";
		}
	}
}
