/*
  Projet : Casier V2/V3 — instantané des fiches publiées  ·  Version : 1.1.0  ·  Date : 20/11/2026
  Auteur : Tom Rougeaud  ·  Licence : CC BY-NC 4.0
  Réalisé avec l’aide de l’IA : Claude Sonnet 5.5 (Anthropic)
  Photo des fiches publiées du casier au 20/11/2026 (aucune clé, aucun identifiant de base de données).
  Champs : t = titre, u = adresse (suffixe de la base, ou adresse complète), v = version, d = date,
           k = famille (J jeu, O outil, C cours/manuel, E évaluation), x = description, g = mots-clés, i = couverture (dossier covers/), a = nom de l’aperçu (dossiers apercus/98 et apercus/mac).
  Pour mettre à jour : remplacer ce fichier ; les deux interfaces (/98 et /macintosh) le lisent.
*/
window.CASIER = {
  version: 2,
  date: "2026-11-20",
  base: "https://tom-rougeaud.github.io/",
  items: [
    { t: "MA SEANCE DE MATHS", u: "maseance/", v: "1", d: "2026-10-30", k: "O", g: ["Outil", "Pédagogie", "Bac Pro"], x: "Prépare tes séances et séquences de maths (3PM, CAP, Bac Pro) à partir de tes manuels : la progression de la classe se remplit automatiquement." },
    { t: "Automatismes de Maths en lycée Pro", u: "automatismes/", v: "1", d: "2026-10-29", k: "E", g: ["Évaluation", "Exerciseur", "CAP"], a: "automatismes", x: "AUTOMATHS génère en quelques clics des feuilles d’automatismes A4 imprimables, avec corrigé, à partir de plus de 450 notions classées par chapitre." },
    { t: "MathsNotes", u: "pad/", v: "10", d: "2026-09-25", k: "O", g: ["Outil", "Cours", "Maths"], a: "pad", x: "Éditeur de cours de mathématiques avec insertion facilitée du langage mathématique, de tableaux et de tableur." },
    { t: "Flash Maths", u: "flashmaths/", v: "3.3", d: "2026-10-01", k: "J", g: ["Jeu", "Maths", "Révisions"], a: "flashmaths", x: "Des automatismes de maths en direct, au tableau et sur les téléphones. CAP · Bac Pro · 3ᵉ Prépa-Métiers — gratuit, sans compte, sans publicité." },
    { t: "Éditeur CCF complet Maths Sciences", u: "ccf-maths", v: "1.28", d: "2026-05-07", k: "E", g: ["Évaluation", "Sciences", "Bac Pro"], a: "ccf-maths", x: "Outil de gestion et correction de CCF pour les enseignant(e)s de Maths-Sciences en lycée professionnel." },
    { t: "Manuel de Maths 3ème Série Pro", u: "3eme/", v: "", d: "2026-10-16", k: "C", g: ["Outil", "Maths", "En ligne"], a: "3eme", x: "Manuel interactif où chaque notion tient sur une page, avec des exemples tirés de la pop culture (séries, mangas, jeux)." },
    { t: "MATHS & MCV · Terminale MCV", u: "mcv/terminale/", v: "", d: "2026-10-06", k: "C", g: ["Cours", "Bac Pro", "Terminale"], a: "mcv-terminale", x: "Manuel interactif construit sur de vrais chiffres (ventes, inflation, épargne) pour lire le monde commercial." },
    { t: "MATHS & MCV · 1ère MCV", u: "mcv/1ere/", v: "", d: "2026-10-16", k: "C", g: ["Cours", "Bac Pro", "Première"], a: "mcv-1ere", x: "Un manuel interactif et une appli web gratuite qui font des mathématiques de 1MCV un outil du métier." },
    { t: "Manuel de Maths niveau CAP", u: "cap/", v: "1", d: "2026-10-30", k: "C", g: ["Outil", "CAP", "Smartphone"], a: "cap", x: "Mathématiques de CAP : références de la pop culture, vraies données, leçons pas à pas, entraînement corrigé." },
    { t: "MATHS & MCV · 2nde MRCU", u: "mcv/2de/", v: "3.1", d: "2026-10-13", k: "C", g: ["Cours", "Bac Pro", "Seconde"], a: "mcv-2de", x: "Un manuel interactif et une appli web gratuite qui font des mathématiques de 2de Bac Pro MRCU un outil du métier." },
    { t: "Maths Allophones · Niveau 1", u: "fls/", v: "", d: "2026-10-11", k: "C", g: ["Cours", "Maths", "FLS"], a: "fls", x: "Outil interactif pour les élèves allophones, pour aborder les mathématiques (niveau 1)." },
    { t: "Maths Allophones · Niveau 2", u: "fls2/", v: "", d: "2026-10-11", k: "C", g: ["Cours", "Maths", "FLS"], a: "fls2", x: "Outil interactif pour les élèves allophones, pour aborder les mathématiques (niveau 2)." },
    { t: "Maths Allophones · Niveau 3", u: "fls3/", v: "", d: "2026-10-11", k: "C", g: ["Cours", "FLS", "UPE2A"], a: "fls3", x: "Outil interactif pour les élèves allophones, pour aborder les mathématiques (niveau Bac Pro)." },
    { t: "Maths et MCV", u: "mcv/", v: "2", d: "2026-10-07", k: "C", g: ["Maths", "Bac Pro"], a: "mcv", x: "La vitrine interactive du programme de Bac Pro en maths pour les métiers du commerce et de la vente." },
    { t: "Maths Snake", u: "maths-snake/", v: "", d: "2026-10-06", k: "J", g: ["Jeu", "Révisions", "Maths"], a: "maths-snake", x: "Le jeu Snake que tout le monde connaît, mais en classe : le serpent mange la bonne réponse à une question de maths." },
    { t: "Lecture+", u: "lecture/", v: "", d: "2026-10-07", k: "O", g: ["Outil", "Collège", "Tablette"], a: "lecture", x: "Le prompteur qui fait progresser chaque lecteur(trice)." },
    { t: "TRADMATHS", u: "tradmaths/", v: "8", d: "2026-09-13", k: "O", g: ["Outil", "Pédagogie", "UPE2A"], x: "Une interface de traduction vocale multilingue pour les cours de maths en classe d’accueil, avec un glossaire en couleurs." },
    { t: "Pourcentage XP", u: "pourcent/", v: "5.0", d: "2026-09-11", k: "J", g: ["Jeu", "Révisions", "Bac Pro"], a: "pourcent", x: "Travail des automatismes liés aux pourcentages dans le secteur commercial." },
    { t: "Générateur de QCM PRONOTE", u: "pronote/", v: "1.19", d: "2026-07-29", k: "E", g: ["Évaluation", "IA", "Sciences"], a: "pronote", x: "Un QCM à importer dans PRONOTE en 30 secondes, à partir d’un prompt clé en main pour n’importe quelle IA." },
    { t: "Fabrique à Prompts · Maths", u: "fabrique-maths/", v: "1.05", d: "2026-04-17", k: "O", g: ["Outil", "IA", "Révisions"], a: "fabrique-maths", x: "Générateur de prompts sur mesure pour réviser les mathématiques en lycée professionnel." },
    { t: "Lore Master", u: "loremaster/", v: "1.5", d: "2026-10-20", k: "J", g: ["Jeu", "En ligne"], a: "loremaster", x: "Le quiz fantasy en direct : un Maître du Jeu ouvre un donjon, jusqu’à 30 aventurier(ère)s le rejoignent depuis leur téléphone." },
    { t: "Monnaie XP", u: "monnaie-xp/", v: "1.11", d: "2026-05-04", k: "J", g: ["Jeu", "Maths", "CAP"], a: "monnaie-xp", x: "Jeu éducatif qui transforme l’entraînement au rendu de monnaie en expérience gamifiée." },
    { t: "Chrono Séance", u: "chrono/", v: "1.13", d: "2026-06-02", k: "O", g: ["Outil", "Activité", "PC"], a: "chrono", x: "Outil pédagogique de gestion du temps en classe, 100 % local." },
    { t: "ABEL’s RUN", u: "ball/", v: "3.55", d: "2026-11-17", k: "J", g: ["Jeu", "PC", "Smartphone"], a: "ball", x: "Jeu de course minimaliste en 3D : une bille à guider du doigt, au pavé tactile ou au clavier, du niveau « Détente » au niveau « Folie ».", i: "covers/cover-ball-v1.webp" },
    { t: "QCM × ZIPGRADE", u: "zipgrade/", v: "1.14", d: "2026-06-12", k: "E", g: ["Évaluation", "Maths", "Sciences"], a: "zipgrade", x: "Créez des QCM pédagogiques à importer et corriger automatiquement dans Zipgrade." },
    { t: "Éditeur QCM × Plickers", u: "QCM/", v: "1.11", d: "2026-07-24", k: "E", g: ["Évaluation", "IA", "Sciences"], a: "QCM", x: "Générez en 30 secondes des QCM adaptés au lycée pro (maths, sciences, techno) à importer dans Plickers." },
    { t: "Progression Maths-Sciences et Techno", u: "progression", v: "1.22", d: "2026-05-04", k: "O", g: ["Pédagogie", "Bac Pro", "CAP"], a: "progression", x: "Suivez votre progression pédagogique en lycée pro (maths, sciences et techno)." },
    { t: "Grille Automatisée Oral DNB", u: "oral-dnb/", v: "1.09", d: "2026-06-06", k: "E", g: ["Évaluation", "Smartphone", "PC"], a: "oral-dnb", x: "Outil d’évaluation éditable pour l’oral du DNB en 3ème, avec notes, bilan automatisé et chronomètre." },
    { t: "Casier Pédagogique Numérique", u: "casier", v: "1.03", d: "2026-05-08", k: "O", g: ["Outil", "Projet", "Hors ligne"], x: "Centralisez les ressources et outils pédagogiques que vous avez créés : vous seul(e) y avez accès." },
    { t: "C’est moi le prof aujourd’hui !", u: "jeu-erreur-maths/", v: "1.05", d: "2026-02-12", k: "J", g: ["Jeu", "Maths", "Révisions"], a: "jeu-erreur-maths", x: "Jeu où l’apprenant(e) devient correcteur(trice) et doit justifier ses choix." },
    { t: "Adaptallo", u: "adaptallo/", v: "1.2.0", d: "2026-11-18", k: "O", g: ["Outil", "FLS", "IA"], a: "adaptallo", x: "Des documents en français accessible, avec étayages, pour les élèves allophones : prépare le prompt d’adaptation et aide à vérifier le résultat.", i: "covers/cover-adaptallo-v3.webp" },
    { t: "Maths MLDS · Mes maths pas à pas", u: "mlds/", v: "", d: "2026-11-06", k: "O", g: ["Exerciseur", "Collège", "Bac Pro"], a: "mlds", x: "Entraînement MLDS : dix thèmes de maths, trois paliers chacun, de la fin de collège au niveau bac pro.", i: "covers/cover-mlds-v3.webp" },
    { t: "Le numérique en français", u: "https://github.com/tom-rougeaud/numerique-allophones/blob/main/cahier/le-numerique-en-francais_eleve.pdf", v: "", d: "2026-11-13", k: "C", g: ["Cours", "FLS", "Activité"], a: "numerique", x: "Cahier de vocabulaire du numérique en FLS (46 pages, PDF) pour les élèves allophones qui débutent en français et à l’ordinateur.", i: "covers/cover-numerique-v3.webp" },
    { t: "Manga Master", u: "mangamaster/", v: "0.11.3", d: "2026-11-06", k: "J", g: ["Jeu", "Activité", "Smartphone"], a: "mangamaster", x: "Le quiz en direct des fans de mangas et d’animés : un(e) Sensei ouvre un dojo, les apprenti(e)s rejoignent avec un code ou un QR code.", i: "covers/cover-mangamaster-v3.webp" },
    { t: "La fuite d’Abel", u: "fuite-abel/", v: "1.13.0", d: "2026-11-18", k: "J", g: ["Jeu", "PC", "Smartphone"], a: "fuite-abel", x: "Jeu de course en 3D pour les jeunes enfants : on court, on saute, on se baisse, on ramasse des pièces et on échappe au poursuivant.", i: "covers/cover-fuite-abel-v3.webp" },
    { t: "XY Shooter", u: "shooter-xy/", v: "", d: "2026-04-17", k: "J", g: ["Jeu", "Exerciseur", "Première"], a: "shooter-xy", x: "Serious game sur les fonctions : coordonnées, trajectoires affines et paraboliques, discriminant et racines.", i: "covers/cover-shooter-xy-v3.webp" },
    { t: "BLOCMATHS Équations", u: "equations/", v: "", d: "2026-04-17", k: "J", g: ["Jeu", "Exerciseur", "Collège"], a: "equations", x: "Jeu de manipulation de blocs qui guide pas à pas vers la résolution d’équations, sur plusieurs niveaux.", i: "covers/cover-equations-v3.webp" }
  ]
};
