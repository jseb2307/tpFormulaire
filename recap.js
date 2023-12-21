
       // Récupérer l'objet JSON depuis le stockage local
       const jsonDataString = localStorage.getItem('absenceFormData');


    if (jsonDataString) {
    // Convertir la chaîne JSON en objet JavaScript
    const jsonData = JSON.parse(jsonDataString);

  
    let infoContainer = document.getElementById('synthese-container');

    
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            // Créer un élément de paragraphe pour chaque propriété
            let paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = `<strong>${key}:</strong> ${jsonData[key]}`;

            // Ajout au conteneur
            infoContainer.appendChild(paragraphElement);
        }
    }
} else {
    console.log('Aucune donnée disponible.');
}