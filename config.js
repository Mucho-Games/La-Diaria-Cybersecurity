const questionsImgDirectory = './game/questions/img/';
const fps = 60;
const thresholdRatio = 0.75;
const maxLandAspectRatio = 0.7;
const maxPortraitAspectRatio = 10/16;
const debug = false;
const views = 
[
	"titleScreen", 
	"introAnimation", 
	"game", 
	"end-level-screen", 
	"credits-screen", 
	"settings-screen", 
	"overlay-view"
];
const viewsColors = 
[
	"--color-green", 
	"--color-green", 
	"--color-blue", 
	"--color-orange", 
	"--color-blue"
];
const viewsRefResolutions = 
[
	[1100, 910], //title
	[1100, 910], //intro
	[670, 910], //game
	[800, 910], //end view
	[550, 900], //credit
	[550, 900], //settings
	[670, 910] //overlay view <---- has to be the same as game to match the layout
];
const viewsRefResolutionsPortrait = 
[
	[910, 910], //title
	[550, 900], //intro
	[550, 800], //game
	[700, 800], //end view
	[550, 900], //credits
	[550, 900], //settings
	[550, 800] //overlay-view <---- has to be the same as game to match the layout
];
const answerOverlayRefResolution = [670, 910];
const answerOverlayRefResolutionPortrait = [550, 800];
const levelsAmount = 3;
const charactersAvatars = ["assets/personaje-pato2.png", "assets/personaje-gato.png", "assets/personaje-perro.png"];
const charactersAvatarsStyles = ["pato-avatar", "cat-avatar", "dog-avatar"];
const charactersAnswerStyles = ["pato-answer", "cat-answer", "dog-answer"];