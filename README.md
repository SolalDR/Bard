# Bard 

Librairie permettant de créer des interfaces 2.5D basé sur la librairie THREE.js
Son champs d'action commence au lancement d'un livre et continue jusqu'à son arrêt. 

## Contribute

Run Budo
``` bash
npm run dev
```

Run sass watching
``` bash
cd src/stylesheets/
sass --watch bard.sass:bard.css
```

## Architecture 

```
components
  |- Dictionnary 
  |- SpeechRecognition
elements
  |- Character
  |- Mesh
  |- Text
utils
  |- Animation
  |- Clock
  |- Easing
  |- Event
  |- OrbitControl
- Book
- BookNavigator
- Element
- Fragment 
- Action
- Scene
```
## Book 

L'objet Book correspond au livre couramment lu. C'est donc l'objet le plus haut niveau de bard puisque c'est le singleton contenant l'ensemble des fragments (Voir `Fragment`). L'objet Book dispose d'un objet `Scene` agissant en surcharge de la scène THREE.js. 

### BookNavigator
Cet objet permet comme son nom l'indique de naviguer dans le livre. Son but est de fluidifier la navigation de l'utilisateur. 
- Il assure le passage d'un fragment à un autre via des transitions
- Il charge en asynchrone les ressources nécessaire aux lancements des prochains Fragment 

## Scene 

La scène est une surcharge de `THREE.Scene`. Elle permet d'ajouter un contrôle supplémentaire et une assistance lors de l'ajout d'une nouvelle mesh dans la scène. 
Elle est divisé en trois grandes parties disposé sous forme de groupe `THREE.Group`. 
- Background
- Scene
- Foreground

Ces derniers ont des positions donnée dans la scène. 
Les différents objets `Mesh` développé appartiennent à l'un de ces grands groupes ce qui conditionne leurs positionnement par défaut lors de l'ajout à la scène. 

## Fragment 

Un fragment est un morceau de livre. Un livre est composé d'une multitude de fragments lié entre eux. Chaque fragment dispose de son propre contexte dans lequel il peut animer des élements, afficher du texte, intéragir avec l'utilisateur, etc... Il s'agit en quelques sortes du contrôleur faisant le pont entre les actions de l'utilisateur et le déroulement de l'histoire. 

## Element

Un élement est une division de fragment présentant une ou plusieurs intéractions avec l'utilisateur. Il existe plusieurs élements : 
- Text
- Mesh
- Character

Appartenant aux types: 
- text
- image
- sound
- obj3d
- obj2d

Chacun ont leurs propre comportements, méthodes et intéractions.
Chaque élément est stocké dans le dossier `/elements` et doit étendre l'objet `Element.js`.

### Mesh
Cet élément est un objet 3D classique. 
Il implémente certaines méthodes permettant d'animer plusieurs propriétés en même temps.  

### Character 
Cet élément permet de manipuler un objet3D ainsi qu'un rig. Il implémente certaines méthode utiles tels que `walk`, `run`, `idle` et implémente un système de crossfading pour permettre des transitions entres ces différentes animations.

### Text 
L'élément text est un élément HTML. Il permet d'instancier un `Dictionnary` qui va permettre à l'aide de son texte de lier les commandes vocales à des actions du fragments. 

## Action
Une action est le lien entre une intéraction de l'utilisateur ou un callback avec un changement dans l'état d'un des élement. 

## Utils

Que des classes utils agissant en helpers. 
- Animation : Permet d'animer facilement un changement de propriété. 
- Clock : Outils de raf classique
- Easing : Une liste de fonctions de easing 
- Event : Une classe abstraite implémentant un système évenementiel simple mais efficaces
- OrbitControl : L'OrbitControl de THREE.js, utile pour débugger.

## Components

Les components représentent des fonctionnalités indépendantes du rendu. Ils peuvent avoir un rôle dans l'intéraction avec l'utilisateur comme dans le cas de SpeechRecognition ou dans le chargement de ressource, etc...

#### SpeechRecognition
Il s'agit de l'objet permettant de manipuler les API de SpeechRecognition. A l'avenir il permettra de passer de Annyang à Google rapidemment. Il agit en surcouche pour ajouter, supprimer des commandes, mettre en pause son activité, proposer une interface de debuggage ou d'intéraction...

## Elements

 
