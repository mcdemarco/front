import { gameinfo } from "@abstractplay/gameslib";
export const setRendererColourOpts = ({
  options,
  metaGame,
  isParticipant,
  settings,
  context,
  globalMe,
}) => {
  options.colourContext = context;
  let optioncolours = [];
  // deprecated in favour of explicit customizations
  // option will be removed at some point
  if (settings.color === "blind") {
    options.colourBlind = true;
  }
  // deprecated in favour of explicit customizations
  // named palettes will be removed at some point
  if (settings.color !== "standard" && settings.color !== "blind") {
    console.log(`Looking for a palette named ${settings.color}`);
    const palette = globalMe.palettes?.find((p) => p.name === settings.color);
    if (palette !== undefined) {
      optioncolours = [...palette.colours];
    }
    options.coloursGlobal = false;
  }

  if (globalMe?.customizations?.[metaGame]) {
    const custom = globalMe.customizations[metaGame];
    if (
      custom.palette &&
      Array.isArray(custom.palette) &&
      custom.palette.length > 0
    ) {
      optioncolours = [...custom.palette];
      options.coloursGlobal = false;
    }
    options.contextGlobal = false;
  } else if (globalMe?.customizations?._default) {
    const custom = globalMe.customizations._default;
    if (
      custom.palette &&
      Array.isArray(custom.palette) &&
      custom.palette.length > 0
    ) {
      optioncolours = [...custom.palette];
      options.coloursGlobal = true;
    }
    options.contextGlobal = true;
  }
  // extend all palettes to 12 colours
  if (optioncolours.length > 0 && optioncolours.length < 12) {
    while (optioncolours.length < 12) {
      optioncolours.push(null);
    }
  }

  // handle "Always use my colour" preference
  if (
    optioncolours !== undefined &&
    Array.isArray(optioncolours) &&
    optioncolours.length > 0 &&
    globalMe?.settings?.all?.myColor &&
			isParticipant > 0 &&
			metaGame
  ) {

    console.log("b4", optioncolours);
    const info = gameinfo.get(metaGame);
    const temp = info?.customizations || [];
		const customizationHints = temp.filter(h => "player" in h);

    if (customizationHints.length > 0) {
      //If the game itself has rearranged the palette, need a different swap.
			const player1Idx = customizationHints.find(h => h.player === 1).num - 1 || 0;
			const mycolorTemp = optioncolours[player1Idx];
			console.log(mycolorTemp);
			const myplayerIdx = customizationHints.find(h => h.player === isParticipant + 1).num - 1;
			optioncolours[player1Idx] = optioncolours[myplayerIdx];
			console.log("mid", optioncolours);

			optioncolours[myplayerIdx] = mycolorTemp;

			console.log("after", optioncolours);
			
    } else {
      const mycolor = optioncolours.shift();
      optioncolours.splice(isParticipant, 0, mycolor);
    }
  }
  // set option
  if (optioncolours.length > 0) {
    options.colours = [...optioncolours];
  }
};
