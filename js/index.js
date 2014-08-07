/* 
  L'idée est de "dessiner en texte", c'est-à-dire avec des traits prenant la forme d'un texte pré-enregistré, en l'occurence 
  ici le poème Les Djinns de Victor Hugo. 
  Pour cela on utilisera la possibilité de dessiner directement dans le navigateur avec Canvas, la position de 
  la souris (prenant en compte les clics), et surtout la propriété fillText de canvas qui permet de remplir un trait
  avec du texte.
  Le script va prendre la forme suivante :
   1 - Définition des variables globales et du texte.
   2 - Définition de la fonction principale appelée/déclenchée au chargement de la page et qui aura pour objectif de définir
        la zone de dessin pour le canvas et les événements de la souris pour interagir dessus.
   3 - Définition des fonctions d'interaction (quand je clique il se passe ca, quand je double-clique ceci, etc.).
   4 - La fonction principale pour dessiner effectivement du texte.
   5 - Deux fonctions "utilitaires" de rendus pour donner une forme particulière, avec des aspérités et des reliefs, au texte.
   6 - Et bien sûr l'initialisation de la fonction définie en (2) en fin de script.

  //EDIT
  S'ajoute à ce script des short codes pour gérer l'apparition d'une fenêtre modale pour choisir le texte et
  pour gérer la prise en compte du choix de texte par le script qui suit, ainsi qu'un script pour la sauvegarde.
*/






// DEFINITION DES VARIABLES GLOBALES
//1. Enregistrement des strophes dans autant de variables
var letters1 = "Murs, ville Et port, Asile De mort, Mer grise Où brise La brise, Tout dort.";
var letters2 = "Dans la plaine Naît un bruit, C'est l'haleine De la nuit. Elle brame Comme une âme Qu'une flamme Toujours suit.";
var letters3 = "La voix plus haute Semble un grelot. – D'un nain qui saute C'est le galop : Il fuit, s'élance, Puis en cadence Sur un pied danse Au bout d'un flot.";
var letters4 = "La rumeur approche ; L'écho la redit. C'est comme la cloche D'un couvent maudit ; – Comme un bruit de foule, Qui tonne et qui roule, Et tantôt s'écroule Et tantôt grandit,";
var letters5 = "Dieu ! la voix sépulcrale Des Djinns ! – Quel bruit ils font ! Fuyons sous la spirale De l'escalier profond ! Déjà, s'éteint ma lampe, Et l'ombre de la rampe, Qui le long du mur rampe, Monte jusqu'au plafond.";
var letters6 = "C'est l'essaim des Djinns qui passe, Et tourbillonne en sifflant.Les ifs, que leur vol fracasse, Craquent comme un pin brûlant ; Leur troupeau, lourd et rapide, Volant dans l'espace vide, Semble un nuage livide Qui porte un éclair au flanc.";
var letters7 = "Ils sont tout près ! – Tenons fermée Cette salle où nous les narguons. Quel bruit dehors ! hideuse armée De vampires et de dragons ! La poutre du toit descellée Ploie ainsi qu'une herbe mouillée, Et la vieille porte rouillée Tremble, à déraciner ses gonds !";
var letters8 = "Cris de l'enfer ! voix qui hurle et qui pleure ! L'horrible essaim, poussé par l'aquilon, Sans doute, ô ciel ! s'abat sur ma demeure. Le mur fléchit sous le noir bataillon. La maison crie et chancelle, penchée, Et l'on dirait que, du sol arrachée, Ainsi qu'il chasse une feuille séchée, Le vent la roule avec leur tourbillon !";
var letters9 = "Prophète ! si ta main me sauve De ces impurs démons des soirs, J'irai prosterner mon front chauve Devant tes sacrés encensoirs ! Fais que sur ces portes fidèles Meure leur souffle d'étincelles, Et qu'en vain l'ongle de leurs ailes Grince et crie à ces vitraux noirs !";
var letters10 = "Ils sont passés ! – Leur cohorte S'envole, et fuit, et leurs pieds Cessent de battre ma porte De leurs coups multipliés. L'air est plein d'un bruit de chaînes, Et, dans les forêts prochaines, Frissonnent tous les grands chênes, Sous leur vol de feu pliés !";
var letters11 = "De leurs ailes lointaines Le battement décroît, Si confus dans les plaines, Si faible, que l'on croit Ouïr la sauterelle Crier d'une voix grêle, Ou pétiller la grêle Sur le plomb d'un vieux toit.";
var letters12 = "D'étranges syllabes Nous viennent encor ; – Ainsi des Arabes Quand sonne le cor, Un chant sur la grève Par instants s’élève, Et l'enfant qui rêve Fait des rêves d'or !";
var letters13 = "Les Djinns funèbres, Fils du trépas, Dans les ténèbres Pressent leurs pas ; Leur essaim gronde : Ainsi, profonde, Murmure une onde Qu'on ne voit pas.";
var letters14 = "Ce bruit vague Qui s'endort, C'est la vague Sur le bord ; C'est la plainte, Presque éteinte, D'une sainte Pour un mort.";
var letters15 = "On doute La nuit… J'écoute : – Tout fuit, Tout passe ; L'espace Efface Le bruit.";
//2. Letters est la variable globale du texte qui sera dessiné. Par défaut nous la faisons correspondre avec la première strophe.
var letters = letters1 ;
//3. Variables pour les reliefs du dessins (taille minimale, sélection d'une lettre, angle, couleur, etc.)
var counter = 0;
var minFontSize = 3;
var angleDistortion = 0;
var letter = letters[counter];
var textColor = 'black' ;
//4. Variables globales du Canvas
var canvas;
var context;
//5. Variables de position
var mouse = {
  /* Pour la souris on a besoin de 3 informations : l'abscisse, l'ordonnée et si le bouton de clic est enfoncé (auquel cas l'écriture sera autorisé).
     c'est ce dernier élément qui se cache derrière l'appellationa purement arbitraire "write".
     Par défaut, x et y sont set à 0, mais dès que la souris bouge (mousemove) on ferra évoluer ces coordonnées en temps réel via un EventListener. */
  x: 0, 
  y: 0, 
  write: false
};
var position = {
  /* L'idée est de cliquer puis de guider avec la souris pour dessiner le chemin du texte. 
     Distinguons donc la position du curseur de la souris (mouse) de la position du clic qui est la position où démarre le texte (position).
     Par défaut, x et y sont également set à 0 comme la mouse. La position évolue uniquement au clic (mousedown), c'est-à-dire au moment où l'on commence le dessin. */
  x: 0, 
  y: 0
};
//console.log(letters);




//EDIT : PRISE EN COMPTE DU CHOIX UTILISATEUR POUR LE TEXTE
//1. Choix de la strophe
$('.btn-group1 a').click(function() {
  if ($(this).hasClass( "selected" )) { //si l'utilisateur décoche une strophe
    $(this).removeClass("selected"); //on enlève la classe "selected"
    $('#edit').html('Remplacez-moi par votre message !');
  }
  else { //si l'utilisateur coche une strophe
    $('.btn-group1 a').removeClass("selected"); //on enlève toutes les classes selected..
    $(this).addClass("selected");//...pour la placer sur l'élément sélectionné uniquement...
    letters = window[$('.btn-group1 a.selected').data('role')];//...et on récupère la valeur de cet élément.
    $('#edit').html(letters); //On insère cette valeur (la strophe) dans le #edit pour prévisualisation.
  };
});
//2. Enregistrement dans la variable letters du texte à dessiner + animation de la fenêtre modale
$('a#finish').click(function() {
     counter = 0;
     letters = $('#edit').html() + ' '; //L'espace ajouté permet d'éviter que la fin du texte soit collée avec le début du texte suivant.
     minFontSize = 3;
     angleDistortion = 0;
     letter = letters[counter];
     console.log(letters);
     $('#modal').css("z-index", "-200");
     $('#modal').css("right", "-2500px");//Quand le choix de texte est pris, on sort la boîte modale de l'interface.
});





//EDIT : SAUVEGARDE
$("#submit").click(function(e) {
  e.preventDefault();
  canvas.toBlob(function(blob) { //transformation du canvas en format Blob...
    saveAs(blob, "foo_from_canvas.png"); //...puis sauvegarde du format Blob vers du png + choix du titre de l'image
  });
});





// DEFINITION DE LA FONCTION PRINCIPALE
function init() {
  //initialiser le canvas et son contexte
  canvas = document.getElementById( 'canvas' );
  context = canvas.getContext( '2d' );
  //préciser la taille du canvas, ici l'intégralité de la fenêtre
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //déclenchement des fonctions correspondantes (deuxième argument) selon l'événement spécifié (premier argument)
  canvas.addEventListener('mousemove', mouseMove, false); //le troisième argument (false) empêche la propagation.
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup',   mouseUp,   false);
  canvas.addEventListener('mouseout',  mouseUp,  false);  
  canvas.addEventListener('dblclick', doubleClick, false);
}





//DEFINITION DES 4 FONCTIONS D'INTERACTION
/* Pour que le texte suive le parcours de la souris, il faut pouvoir enregistrer la position du curseur en temps réel.
   Pour cela on utilise l'événement mousemove (dès que la souris bouge) pour enregistrer les différentes positions du curseur,
   puis dessiner au fur et à mesure le texte. */
function mouseMove (e){
  mouse.x = e.pageX;
  mouse.y = e.pageY;
  draw();
  /* Donc dès que la souris bouge, les coordonnées de sa position sont enregistrées et utilisées en temps réel par la fonction draw()
     afin de continuer le dessin. */
  //Masquer le message de nettoyage
  $('#nettoyage').hide();
}

function mouseDown(e){
  /* Le dessin ne peut commencer que lorsque le click est maintenu.
     Pour cela, on crée un événement "au maintien du clic" qui crée une condition.
     Cette condition remplie (true), la fonction draw() peut faire son effet (voir la structure conditionnelle de la fonction). */
  mouse.write = true;
  //la position du texte est alors celle de la mouse
  position.x = e.pageX;
  position.y = e.pageY;  
  //Modifier le z-index des boutons de couleur permettra de dessiner dessus et de ne pas interrompre le dessin.
  $('#editControls').css("z-index", "-10");
}

function mouseUp(e){
  //Quand le clic est relaché, il n'est plus possible d'écrire, puisque la condition n'est plus remplie (false).
    mouse.write = false;
    //Fin du dessin donc il faut s'assurer que les boutons de couleurs sont bien cliquables.
    $('#editControls').css("z-index", "20");
}

function doubleClick(e) {
  //Fonctionnalité supplémentaire : au double clic, le canvas est réinitialisé (effacé).
  //Le message de nettoyage est affiché.
  $('#nettoyage').show();
  canvas.width = canvas.width; 
}





// FONCTION PRINCIPALE POUR DESSINER
function draw() {
/* C'est ici que l'on utilise le booléen (write) précisé dans les propriétés de la mouse.
   Quand le bouton est enfoncé (mousedown), ce booléen est sur true.
   Quand le bouton est relâché (mouseup), ce booléen est sur false.
   Nous souhaitons que le dessin commence quand le bouton est enfoncé, donc l'idée est de définir cette fonction
   uniquement quand ce booléen est sur true, donc quand mouse.write (la propriété write de mouse) renvoie un OK. */
 if ( mouse.write ) {
      //Distance entre le premier clic (démarrage du dessin) et la position de la souris (dessin).
      //À noter que cette distance, basée sur des coordonnées, nécessite pour être calculée une fonction définie plus bas.
    var d = distance( position, mouse ); 
      /* fontSize est intéressant puisqu'il s'agit d'une variable qui varie en fonction de la distance précédente.
         On utilisera cette variation pour faire également varier la taille de la police.
         Plus on s'éloigne de la position initiale, plus le texte sera gros.
         Pour mieux percevoir l'évolution de la taille, on divise la distance d (ici par 4) avant de l'ajouter à la taille initiale.
         Cela permet de rendre cette évolution de la taille plus lente, et donc plus visible. */
    var fontSize = minFontSize + d/4; 
    var letter = letters[counter];
    /* La foncton textWidth() définie plus bas fait deux choses : elle associe les deux dernières variables (chaque lettre et une 
       taille de police qui varie), et elle retourne la taille du trait de texte dessiné.
       Cette dernière taille est enregistrée dans la variable stepSize. */
    var stepSize = textWidth( letter, fontSize );
    
    if (d > stepSize) {
    /* Quand d est supérieure à stepSize, cela signifie que le curseur de la souris (mouse) est allé plus loin que le dernier endroit
       où du texte a été tracé. Cela vaut également quand stepSize=0 (pas de texte tracé).
       Cette condition implique donc que dès que le curseur bouge, le trou qui le sépare de son ancienne position est comblé par du texte. */

      //Prise en compte de l'angle (arcTangente) éventuellement effectué par le tracé du curseur.
      var angle = Math.atan2(mouse.y-position.y, mouse.x-position.x);
      //Application de la taille de police, qui évoluera au fur et à mesure de l'avancée du texte, du fait de sa dépendance à d.
      context.font = fontSize + "px Georgia";
      //Application de la couleur, qui évolue en fonction du choix utilisateur.
      context.fillStyle = textColor;
      //Enregistrement dans le contexte des propriétés de rendu.
      context.save();
      context.translate( position.x, position.y);
      context.rotate( angle );
      context.fillText(letter,0,0);
      //Remise à défaut des propriétés de rendu du contexte.
      context.restore();
      /* Le remplissager du trait se fait lettre par lettre (puisque letter = letter[counter]). 
         Entre chaque lettre il y a donc un restore() du contexte, ainsi qu'un nouveau save() qui enregistre une taille de police différente.
         C'est pourquoi chaque lettre a une taille supérieure à la lettre précédente.
         Cependant pour éviter l'escalade de taille et revenir à quelque chose qui fasse plus "variation", le counter est remis à 0 par cycle. */
      counter++;
      if (counter > letters.length-1) {
        counter = 0;
      }    
    //console.log (position.x + Math.cos( angle ) * stepSize)
      position.x = position.x + Math.cos(angle) * stepSize;
      position.y = position.y + Math.sin(angle) * stepSize;

      }
  }     
}





//FONCTIONS POUR LE RENDU
//1. Obtenir la distance entre le premier clic (démarrage du dessin) et la position de la souris (dessin) (cf utilisation plus haut)
function distance( a, b ){
  /* Pour obtenir "facilement" la distance entre deux coordonnées, il faut utiliser Pythagore.
     La distance entre deux points est une droite.
     Avec la différence de distance en abscisse et la différence de distance en ordonnée, cette droite forment un triangle.
     xs sera la taille du trait horizontal de ce triangle.
     ys sera la taille du trait vertical de ce triangle.
     On cherche à obtenir l'hypoténuse, qui sera égale à la racine carrée de la somme de xs au carré et ys au carré. */
  var xs = 0;
  var ys = 0;
 
  xs = b.x - a.x;
  xs2 = xs * xs;

  ys = b.y - a.y;
  ys2 = ys * ys;
    //Cette dernière ligne renvoie bien la valeur de l'hypoténuse : 
    //la racine carré (sqrt, pour square root) de la somme d'xs au carré (xs2) et d'ys au carré (ys2).
  return Math.sqrt( xs2 + ys2 );
};

//2. Changer dynamiquement la taille (size) de police
function textWidth( string, size ) {
  context.font = size + "px Georgia";
  //retour de la taille du trait dessiné, quis era enregistrée dans stepsize. 
  if ( context.fillText ) {
    return context.measureText( string ).width;
  } else if ( context.mozDrawText) {
    return context.mozMeasureText( string );
  }
  
};


//EDIT : récupérer la couleur choisie par l'utilisateur pour l'insérer dans la variable de couleur du texte
$('#editControls a').click(function() {
    textColor = $(this).data('role');
});


//EDIT : COMPORTEMENT DE LA FENÊTRE MODALE
$('a#modify').click(function() {
  var foo = $('#modal').css("right");
  if ( foo == "-250px") { //Quand la fenêtre modale est sur l'interface, le clic déclenche la disparition de celle-ci.
    $('#modal').css("z-index", "-200");
    $('#modal').css("right", "-2500px");
  }
  else { //Quand la fenêtre modale est sur hors de l'interface, le clic déclenche l'apparition de celle-ci.
    $('#modal').css("z-index", "200");
    $('#modal').css("right", "-250px");
  }
});

$('a#delete').click(function() { //La fenêtre modale disparaît au clic sur le bouton "Annuler".
     $('#modal').css("z-index", "-200");
     $('#modal').css("right", "-2500px");
});



//Ne pas oublier enfin de finir le script en appelant la fonction d'initialisation.
init();

