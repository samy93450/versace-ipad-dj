# Contrôles effectués — 16 octobre 2026

## Réussis

- Syntaxe JavaScript des trois scripts.
- Initialisation complète des scripts dans un environnement DOM/audio simulé.
- Identifiants HTML uniques ; toutes les références locales aux images/scripts/manifest existent.
- Lecture, pause, reprise, arrêt, changement de titre et déplacement à 50 % du morceau.
- Trois états de répétition ; calcul du prochain morceau.
- Démarrage d’un fondu et annulation correcte de sa minuterie et de la seconde platine.
- Arrêt/pause/reprise radio depuis les commandes principales ; passage de la radio à un fichier local.
- Ouverture/fermeture exclusive des tiroirs MUSIC et RADIOS.
- Réveil sauvegardé ; indication rouge ; simulation sans suppression du réveil ; annulation et fermeture de l’alerte.
- Night Shift activé/désactivé ; indication rouge ; simulation et arrêt.
- Calcul du réveil aujourd’hui/demain, refus des heures invalides et minuit Paris en heure d’été/hiver.
- Extraction de la forme d’onde : un pic à la fin du fichier est bien inclus.
- Catalogue intégré de plus de 100 stations algériennes et plus de 2 000 françaises ; cela ne garantit pas chaque flux.
- Réponses HTTP et 1 024 octets audio récupérés sur El Bahdja, Jil FM, FIP et France Inter : audio/mpeg ou audio/aac, statuts 200/206 au contrôle. Pas de test d’écoute réel.
- Manifeste, icône d’accueil, chemins relatifs et index à la racine adaptés à une publication GitHub Pages de projet.
- Intégrité ZIP et contrôle des chemins de l’archive.

## Corrections apportées

Arrêt coupe désormais aussi la radio. Les connexions radio en attente sont invalidées lors d’un arrêt, d’un changement de source ou d’une alerte. Le bouton Lecture/Pause pilote la radio quand elle est la source sélectionnée. Une reprise locale annulée ne redémarre plus après l’attente du moteur audio. La répétition d’un morceau reste active même si l’enchaînement automatique est désactivé.

## Essais restant nécessaires sur l’appareil

Les contrôles de logique utilisent des objets audio et DOM simulés : ils ne prouvent pas la sortie sonore, les droits de lecture Safari, le rendu, les codecs, la voix française ni la fluidité sur un iPad réel. Aucun essai visuel dans un navigateur ou sur un appareil réel n’a été effectué dans cette session. Les dimensions 18 et 49 pouces n’ont pas été vérifiées physiquement.

À essayer dans Safari : importer deux morceaux, lire/pause/déplacer le curseur, tester un fondu, écouter les quatre radios prioritaires, tester les deux alertes avec le volume audible, puis ajouter à l’écran d’accueil et vérifier l’icône et le paysage. Tester une alarme dans deux minutes en gardant l’application visible. Il n’est pas possible de garantir un réveil application fermée ou iPad verrouillé.
