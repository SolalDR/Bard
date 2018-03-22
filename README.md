# Bard 

Librairie permettant de créer des interfaces 2.5D contrôler vocalement basés sur la librairie THREE.js

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
  |- SpeechRecognition        | Reconnaissance vocale   
  |- AlertManager             | Message envoyé à l'utilisateur : Info, Warning, Error
  |- Control                  | Menu de l'interface de contrôle
elements
  |- Space (bg)               | Un fond étoilé en particules
  |- Character                | Personnage avec rig et contrôlable
  |- Mesh                     | Objet 3D standard
  |- Text                     | Text dynamique, réagis à la commande vocale et gère plusieurs TexNode  
  |- TextNode                 | Fragment de text
  |- Svg                      | Element SVG 
utils
  |- Animation                | Un objet permettant d'animer une valeur selon un interval
  |- Clock                    | Horloge utiliser pour le raf
  |- Easing                   | Ensemble de fonction de easing pour l'animation
  |- Event                    | Classe abstraite permettant l'implémentation d'un système évenementiel basique
  |- OrbitControl             | THREE.OrbitControl
  |- Levenshtein              | Calcul de proximité syntaxique d'une phrase (Reconnaissance vocale)

- Book                        | Container principale du livre, singleton
- Navigator                   | Permet la navigation entre fragments, implémente les contrôle utilisateur
- Element                     | Element de la scène
- Fragment                    | Fragment d'histoire
- Action                      | Procédure changeant l'état d'1 ou plusieurs éléments au sein d'un fragment
- Scene                       | Scène de rendu 3D 
```

 
