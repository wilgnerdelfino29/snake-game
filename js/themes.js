class Themes {
  static getCurrent = () => {
    let currentTheme;

    if (localStorage.getItem("snake-game-theme-index") !== null) {
      const nextThemeIndex = localStorage.getItem("snake-game-theme-index");
      currentTheme = Themes.availableThemes()[nextThemeIndex];
    }

    return currentTheme ?? Themes.modern;
  };

  static changeTheme = (callback) => {
    let nextThemeIndex =
      Themes.availableThemes().indexOf(Themes.getCurrent()) + 1;

    if (nextThemeIndex === Themes.availableThemes().length) {
      nextThemeIndex = 0;
    }

    localStorage.setItem("snake-game-theme-index", nextThemeIndex);
    callback();
  };

  static availableThemes = () => [
    Themes.modern,
    Themes.monochrome,
    Themes.retro,
    Themes.blackAndWhite,
    Themes.funny,
    Themes.glass,
  ];

  static modern = {
    cell: "rgb(24, 24, 37)",
    cellBorder: "rgb(34, 39, 56)",
    snake: "rgb(255, 255, 255)",
    snakeBorder: "rgb(255, 255, 255)",
    food: "rgb(170, 68, 68)",
    foodBorder: "rgb(170, 68, 68)",
    info: "rgb(221, 221, 221)",
    infoShadow: "rgb(24, 24, 37)",
    background: "rgb(34, 39, 56)",
  };

  static monochrome = {
    cell: "rgb(0, 0, 0)",
    cellBorder: "rgb(0, 255, 0)",
    snake: "rgb(0, 255, 0)",
    snakeBorder: "rgb(0, 255, 0)",
    food: "rgb(0, 254, 0)",
    foodBorder: "rgb(0, 254, 0)",
    info: "rgb(0, 255, 0)",
    infoShadow: "rgb(0, 30, 0)",
    background: "rgb(0, 0, 0)",
  };

  static retro = {
    cell: "rgb(0, 0, 0)",
    cellBorder: "rgb(0, 0, 0)",
    snake: "rgb(0, 255, 0)",
    snakeBorder: "rgb(0, 0, 0)",
    food: "rgb(255, 0, 0)",
    foodBorder: "rgb(255, 0, 0)",
    info: "rgb(221, 221, 221)",
    infoShadow: "rgb(0, 60, 0)",
    background: "rgb(0, 60, 0)",
  };

  static blackAndWhite = {
    cell: "rgb(90, 90, 90)",
    cellBorder: "rgb(90, 90, 90)",
    snake: "rgb(30, 30, 30)",
    snakeBorder: "rgb(30, 30, 30)",
    food: "rgb(180, 180, 180)",
    foodBorder: "rgb(180, 180, 180)",
    info: "rgb(180, 180, 180)",
    infoShadow: "rgb(30, 30, 30)",
    background: "rgb(20, 20, 20)",
  };

  static funny = {
    cell: "rgb(120, 200, 68)",
    cellBorder: "rgb(140, 200, 68)",
    snake: "rgb(30, 80, 220)",
    snakeBorder: "rgb(30, 80, 220)",
    food: "rgb(240, 68, 68)",
    foodBorder: "rgb(240, 68, 68)",
    info: "rgb(221, 221, 221)",
    infoShadow: "rgb(30, 130, 150)",
    background: "rgb(30, 130, 150)",
  };

  static glass = {
    cell: "rgb(30, 200, 200)",
    cellBorder: "rgb(30, 190, 190)",
    snake: "rgb(221, 221, 221)",
    snakeBorder: "rgb(20, 20, 20)",
    food: "rgb(200, 80, 120)",
    foodBorder: "rgb(20, 20, 20)",
    info: "rgb(30, 150, 150)",
    infoShadow: "rgb(221, 221, 221)",
    background: "rgb(221, 221, 221)",
  };
}
