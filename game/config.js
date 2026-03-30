const questionsImgDirectory = './game/questions/img/';
const fps = 60;
const thresholdRatio = 0.75;
const maxLandAspectRatio = 0.7;
const maxPortraitAspectRatio = 10/16;
const debug = false;
const fullScreenViewsAmount = 6;
const views = 
[
	"titleScreen", 
	"introAnimation", 
	"game", 
	"end-level-screen", 
	"end-game-screen",
	"intro-game",
	"credits-screen", 
	"settings-screen", 
	"overlay-view",
];
const viewsColors = 
[
	"--color-green", //0 title 
	"--color-green", //1 intro level
	"--color-blue", //2 game 
	"--color-orange", //3 end view 
	"--color-orange", //4 end game view 
	"--color-blue", //5 intro game
	"--color-blue", //6 credit
];
const viewsRefResolutions = 
[
	[1100, 910], //title
	[1100, 910], //intro
	[670, 910], //game
	[800, 910], //end view
	[800, 910], //end game view
	[800, 910], //intro game
	[550, 900], //credit <--- Overlay
	[550, 900], //settings <--- Overlay
	[670, 910] //overlay view <---- has to be the same as game to match the layout
];
const viewsRefResolutionsPortrait = 
[
	[910, 910], //0 title 
	[550, 900], //1 intro
	[590, 900], //2 game
	[700, 800], //3 end view
	[700, 800], //4 end game view
	[700, 1100], //5 intro game
	[550, 900], //6 credits <--- Overlay
	[550, 900], //7 settings <--- Overlay
	[590, 900]  //8 overlay-view <--- Overlay <---- has to be the same as game to match the layout
];
const answerOverlayRefResolution = [670, 910];
const answerOverlayRefResolutionPortrait = [550, 800];
const charactersAvatars = ["assets/personaje-pato2.png", "assets/personaje-gato.png", "assets/personaje-perro.png"];
const charactersAvatarsStyles = ["pato-avatar", "cat-avatar", "dog-avatar"];
const charactersAnswerStyles = ["pato-answer", "cat-answer", "dog-answer"];
const completionLevelsTexts = [
	"Vamos bien. Para el próximo programa recuerda chequear antes cada contenido que te interese y así evitaremos la desinformación.",
	"Gran trabajo, sigue así y no olvides desconfiar de las grandes promesas.",
	"Excelente trabajo, sigue así y no olvides desconfiar de las grandes promesas. Wow!"
];
const gameIntroTexts = [
	"<b>Rope, Gata y Pato tienen un streaming</b> donde comparten información, videos y contenidos que le gustan con su comunidad. Están buscando a alguien para sumar al equipo de producción que <b>los ayude a identificar qué contenidos son confiables para su transmisión.</b> ¿Podrás ayudarlos?",
	"<b>Bienvenido al equipo de producción</b>, necesitamos que <b>nos ayudes a evitar que compartamos noticias falsas, engañosas o estafas en línea.</b> Entremos a la reunión de producción para ver qué se está conversando."
]
const levelsAmount = 6;
const roundsAmount = 2;