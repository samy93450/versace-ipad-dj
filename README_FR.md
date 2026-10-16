# ASM DJ — iPad · GitHub Pages

Version préparée le 16 octobre 2026. Interface noire et dorée, fichiers musicaux complets, mix automatique, radios, réveil et Night Shift.

## Publier sur GitHub Pages

1. Décompressez ce ZIP.
2. Créez un dépôt GitHub, puis ajoutez **tout le contenu** du dossier décompressé à sa racine : index.html, style.css, les trois scripts, manifest.webmanifest, .nojekyll et le dossier assets. Ne téléversez pas seulement le ZIP.
3. Dans le dépôt : Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save. Si votre branche porte un autre nom, sélectionnez-la.
4. Attendez la publication et ouvrez le lien HTTPS indiqué par GitHub. Aucune compilation, clé API ni installation npm n’est nécessaire.

## Installer sur iPad

Ouvrez le lien GitHub Pages dans Safari, puis Partager → Sur l’écran d’accueil. L’icône Méduse fournie est déclarée pour Safari et le manifeste. Le système applique son propre masque d’icône. Le paysage est conseillé pour la console complète et la rangée de commandes. Les tailles physiques dépendent du zoom et de l’écran.

## Utiliser

- MUSIC → importer vos fichiers audio complets depuis Fichiers. Lecture/pause, précédent, suivant, arrêt, répétition et sourdine sont disponibles. La barre rouge permet d’avancer et reculer.
- Analyser estime le tempo et l’énergie ; Ordre DJ rapproche les morceaux. Ce classement reste une estimation, sans reconnaissance de tonalité ni synchronisation automatique des temps. Le fondu chevauche les titres complets ; aucun extrait commercial n’est fourni.
- RADIOS → choisir une station, ou ajouter un flux HTTPS. El Bahdja et Jil FM ont des accès directs prioritaires. Lecture/pause et Arrêt de la console commandent aussi la radio sélectionnée.
- RÉVEIL → heure, message, activation, test, simulation et report de cinq minutes. Réveil ponctuel, à la prochaine occurrence de l’heure locale de l’appareil.
- NIGHT SHIFT → activer l’annonce quotidienne de minuit, heure de Paris, et choisir une voix française. Les alertes vocales bouclent jusqu’à leur arrêt.

## Limites à connaître

Les alarmes nécessitent l’application ouverte au premier plan, avec le son autorisé et audible. Safari fermé, iPad verrouillé ou application suspendue : le déclenchement n’est pas garanti. La demande de maintien de l’écran reste soumise au navigateur et à iPadOS. L’icône d’accueil ne transforme pas l’application en réveil natif.

Les fichiers musicaux restent locaux et doivent être réimportés après rechargement/fermeture. Les réglages du réveil, Night Shift et radios ajoutées sont conservés par le navigateur lorsque son stockage est autorisé. L’export M3U contient les noms et l’ordre, pas les fichiers musicaux.

Les radios nécessitent Internet ; disponibilité, débit, restrictions et autorisation d’analyse audio dépendent des diffuseurs. Aucun débit supérieur à la source n’est créé. Si une radio interdit l’analyse CORS, elle peut être lue en mode direct avec un spectre décoratif signalé dans le panneau radio. Les formats dépendent du décodeur Safari. L’analyse et la forme d’onde sont limitées aux fichiers de 100 Mio ; l’import accepte jusqu’à 500 Mio par fichier.

Le site ne contient pas de cache hors ligne ni de service de réveil en arrière-plan. Les notifications système ne sont demandées que si le navigateur les propose ; l’alerte intégrée reste disponible au premier plan.

Consultez VERIFICATIONS.md pour la portée exacte des contrôles réalisés.
