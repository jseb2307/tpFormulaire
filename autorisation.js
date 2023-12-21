


const body = document.body;
const radioGroup = document.getElementsByName('periode');
const calendrierJournee = document.getElementById('calendrierJournee');
const calendrierPeriode = document.getElementById('calendrierPeriode');
const joursAbsenceLabel = document.getElementById('joursAbsenceLabel');
const today = new Date();
const jourFormate = today.toISOString().split('T')[0];// date  au format YYYY-MM-DD
const formationSuivie = document.getElementById('formationSuivie');
let heureDebut = document.getElementById('heureDebutJourneeIn');
let heureFin = document.getElementById('heureFinJourneeIn');
let dateDebutValue;
let dateFinValue;
let diffEnJours;
let periodeValue;
let valeurCaseCochee;

/* ================== HEADER ========================== */

// Fonction pour afficher ou masquer les éléments en fonction de la période sélectionnée
function toggleCalendriers(periodeValue) {
    if (periodeValue === 'journee') {
        calendrierJournee.classList.remove('hidden');
        calendrierPeriode.classList.add('hidden');
        joursAbsenceLabel.classList.add('hidden');
    } else if (periodeValue === 'periode') {
        calendrierJournee.classList.add('hidden');
        calendrierPeriode.classList.remove('hidden');
        // Afficher le label des jours d'absence
        joursAbsenceLabel.classList.remove('hidden');
    }
}
/* ============================== FONCTION DATE MIN ET DATE FIN PERIODE ================================ */
/*                                              &
/*================================ CALCUL DE NB DE J D'ABSENCES==========================================*/


// Fonction pour définir dynamiquement la date minimale pour le calendrier de journee
function setMinDateForJournee() {
  // Date minimale dans le champ de date pour le calendrier de journee et période début
  document.getElementById('dateJournee').min = jourFormate;
  document.getElementById('dateDebut').min = jourFormate;

}

// Fonction pour définir dynamiquement la date minimale pour le champ de date de fin
function setMinDateForDateFin(dateDebutValue) {
  // Vérifier si le champ de date de début n'est pas vide
  if (dateDebutValue) {
      dateDebut = new Date(dateDebutValue);

    // Ajouter un jour à la date de début
    dateDebut.setDate(dateDebut.getDate() + 1);

    // Formater la date de début au format YYYY-MM-DD
    formattedDateDebut = dateDebut.toISOString().split('T')[0];

    // Définir la date minimale pour le champ de date de fin
    document.getElementById('dateFin').min = formattedDateDebut;
    

  } else {
    console.error("Le champ de date de début est vide.");
  }
}

// Bloquer dans le calendrier de date de début tout ce qui est avant aujourd'hui
document.getElementById('dateDebut').min = jourFormate;

// Fonction pour calculer la différence entre deux dates et afficher le résultat
function calculerDifferenceDates() {
   dateDebutValue = document.getElementById('dateDebut').value;
   dateFinValue = document.getElementById('dateFin').value;

  

  // Calculer la différence entre les dates et afficher dans la console
  if (dateDebutValue && dateFinValue) {
    const diffEnMillisecondes = new Date(dateFinValue) - new Date(dateDebutValue);
     diffEnJours = diffEnMillisecondes / (1000 * 60 * 60 * 24);

    

    console.log(diffEnJours);

    document.getElementById('joursAbsenceLabel').textContent = 'Soit ' + diffEnJours + ' jours complets';
  }

  return {
    dateDebutValue : dateDebutValue,
    dateFinValue : dateFinValue,
    diffEnJours : diffEnJours
  };
  
  
}

// Ajouter des événements pour déclencher les fonctions lorsque les valeurs changent
document.getElementById('dateJournee').addEventListener('change', function () {
  periodeValue = 'journee';
  setMinDateForJournee();
  setMinDateForDateFin(this.value);
  calculerDifferenceDates();
  
});

document.getElementById('dateDebut').addEventListener('change', function () {
  periodeValue = 'periode';
  setMinDateForJournee();
  setMinDateForDateFin(this.value);
  calculerDifferenceDates();
});

document.getElementById('dateFin').addEventListener('change', function () {
  periodeValue = 'periode';
  setMinDateForJournee();
  calculerDifferenceDates();
});
/* ============================= FONCTION HEURE MAX ET MIN =========================================== */
function isTimeInRange(time, minTime, maxTime) {
  return time >= minTime && time <= maxTime;
}

document.getElementById('heureDebutJourneeIn').addEventListener('input', function() {
  let selectedStartTime = new Date('1970-01-01T' + this.value);
  let selectedEndTime = new Date('1970-01-01T' + document.getElementById('heureFinJourneeIn').value);

  let minTime = new Date('1970-01-01T08:00');
  let maxTime = new Date('1970-01-01T17:00');

  if (!isTimeInRange(selectedStartTime, minTime, maxTime) || selectedStartTime >= selectedEndTime) {
    alert('Veuillez sélectionner une heure de début entre 8h et 17h.');
    this.value = ''; // vide si non valide
  }
});

document.getElementById('heureFinJourneeIn').addEventListener('input', function() {
  let selectedStartTime = new Date('1970-01-01T' + document.getElementById('heureDebutJourneeIn').value);
  let selectedEndTime = new Date('1970-01-01T' + this.value);

  let minTime = new Date('1970-01-01T08:00');
  let maxTime = new Date('1970-01-01T17:00');

  if (!isTimeInRange(selectedEndTime, minTime, maxTime) || selectedEndTime <= selectedStartTime) {
    alert('Veuillez sélectionner une heure de fin valide.');
    this.value = ''; 
  }
});

/* ========================= PASSAGE JOURNEE / PERIODE ======================= */

//  écouteur pour le changement de bouton radio
radioGroup.forEach(function(radio) {
    radio.addEventListener('change', function() {
        periodeValue = this.value;
        toggleCalendriers(periodeValue);

        return periodeValue;
    });
});


// Initialiser l'affichage en fonction du bouton radio forcé au démarrage
const boutonRadioForce = document.querySelector('input[name="periode"]:checked');
toggleCalendriers(boutonRadioForce.value);

/* =========================== CHARGEMENT DE LA SECTION MOTIF ABSENCE ================================= */

 // Chemin complet du fichier JSON
const jsonFilePath = "data.json";
const nomGroupe = 'motif_unique';

// récupéreration le fichier JSON
fetch(jsonFilePath)
  .then(response => {
    // Vérifier si la requête a réussi 
    if (!response.ok) {
      throw new Error(`Erreur de chargement JSON : ${response.status}`);
    }
    // Analyser la réponse en tant que JSON et retourner la reponse
    return response.json();
  })
  .then(data => {
    // Utilisation des données JSON
    console.log(data);

    // Mise en page de la section avec l'objet JSON
    const motifAbsenceSection = document.querySelector('.motifAbsence');
    const nomGroupe = 'motif_unique';

    data.motifs.forEach((motif, index) => {
      const motifDiv = document.createElement('div');
      motifDiv.innerHTML = `<h3>${motif.code} : ${motif.libelle}</h3>`;

      if (motif.options.length > 0) {
        const radioContainer = document.createElement('div');

        motif.options.forEach((option, optionIndex) => {
          const radioLabel = document.createElement('label');
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = nomGroupe;
          radio.value = option;

          // Cocher le premier bouton radio au démarrage
          if (index === 0 && optionIndex === 0) {
            radio.checked = true;
          }

          radioLabel.appendChild(radio);
          radioLabel.appendChild(document.createTextNode(option));

          radioContainer.appendChild(radioLabel);
        });

        motifDiv.appendChild(radioContainer);
      }

      motifAbsenceSection.appendChild(motifDiv);
    });

  })
  .catch(error => {
    // Gérer les erreurs de chargement JSON
    console.error('Erreur de chargement JSON :', error);
  });

  
/* ====================================== VALIDATION ====================================== */

// Gestionnaire d'événements pour le bouton de validation en dehors de la fonction fetch
document.getElementById('validerButton').addEventListener('click', function () {
  // Récupérez les informations du formulaire
   boutonRadioCoché = document.querySelector(`input[name="${nomGroupe}"]:checked`);
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;

  // Vérifiez s'il y a une case cochée
  if (boutonRadioCoché) {
    // Récupérez la valeur de la case cochée
     valeurCaseCochee = boutonRadioCoché.value;
    console.log("Case cochée :", valeurCaseCochee);

    // Fait apparaître la section des signatures
    document.getElementById('signaturesSection').style.display = 'block';

    // Désactivation des boutons radio
    const boutonsRadio = document.querySelectorAll(`input[name="${nomGroupe}"]`);
    boutonsRadio.forEach(bouton => bouton.disabled = true);
    
    desactiverElementsRequis();

    radioGroup.forEach(radio => {
    radio.disabled = true;
});
try {
  // GENERER LE FICHIER JSON
   generateJsonFile();

  // GENERER LE PDF Pour le génerer il faut mettre en parametre window.location.href = 'recap.html'; =======================================
   generatePDF();

  // Lancement de la page RECAP uniquement si les opérations précédentes réussissent
  window.location.href = 'recap.html';
} catch (error) {
  console.error("Une erreur s'est produite :", error);
  // Gérer l'erreur si nécessaire
}
} else {
console.log("Aucune case cochée");
}
});

/* ==================== RENDRE LES ELMENTS DE LA PAGE NON SELECTIONNABLE ======= */

function desactiverElementsRequis() {
  // Récupérer les éléments requis
  const elementsRequis = document.querySelectorAll('[required]');

  // Désactiver chaque élément requis
  elementsRequis.forEach(element => {
      element.disabled = true;
  });
}

/* =============================== GENERER LE JSON================= */
//Fonction génération du json
function generateJsonFile() {
  //Acquisition du Formdata
  let formData = {
      nom: nom.value,
      prenom: prenom.value,
      formation_suivie: formationSuivie.value,
      typeAutorisation: periodeValue,
      dateDebut: dateDebutValue,
      dateFin: dateFinValue,
      nbJourAbsence: diffEnJours,
      heureDebut: heureDebut.value,
      heureFin: heureFin.value,
      motif : valeurCaseCochee
  };

  // Conversion au format json
  let jsonData = JSON.stringify(formData, null, 2);

  // Stocker le JSON dans le stockage local pour recuperer le json directement
  localStorage.setItem('absenceFormData', jsonData);

  // création d'un blob contenant les données en json
  let blob = new Blob([jsonData], { type: 'application/json' });

  // Création du nom de fichier incluant l'absence de nom, prénom et la date du jour
  let currentDate = new Date();
  let fileName = `absence_${formData.nom || 'inconnu'}_${formData.prenom || 'inconnu'}_${currentDate.toISOString().split('T')[0]}.json`;


  // création du lien de téléchargement
  let a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = fileName;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
}
/* ============================= GENERER PDF DE LA PAGE ============================= */
function generatePDF() {
  // Configurer les options pour html2pdf

  const widthInMm = 210; 
  const heightInMm = 297;
  const headerHeight = 20; 

  const pdf = new html2pdf(document.body, {
    margin: [1,1,1,1], // Marge en pixels
    filename: 'myDocument.pdf',
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: [widthInMm, heightInMm + headerHeight], orientation: 'portrait' }
  });

  pdf.save();
}





