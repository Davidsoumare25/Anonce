// --- CONFIGURATION ---
const SB_URL = "https://hygkieeuiwgyvvqxyjmv.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z2tpZWV1aXdneXZ2cXh5am12Iiwicm9sZSI6Imh5Z2tpZWV1aXdneXZ2cXh5am12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTIyNDAsImV4cCI6MjA5MzM4ODI0MH0.NNP6q_OmIVfXLt-lIPBNY1HiGdw5gLlI2ZbwdNCMP_Y";

// Tentative d'initialisation de Supabase
let supabase;
try {
    supabase = window.supabase.createClient(SB_URL, SB_KEY);
    console.log("Supabase chargé avec succès");
} catch (e) {
    console.error("Erreur critique Supabase : ", e);
}

// --- FONCTION DE NAVIGATION (FORCEE) ---
// On utilise 'window' pour être sûr que le HTML voit la fonction
window.showView = function(viewId) {
    console.log("Tentative d'ouverture de la vue : " + viewId);
    
    // 1. Cacher toutes les vues
    const allViews = document.querySelectorAll('.view');
    allViews.forEach(v => {
        v.style.display = 'none'; // On force le cache en CSS direct
        v.classList.remove('active');
    });

    // 2. Afficher la vue demandée
    const target = document.getElementById(viewId);
    if (target) {
        target.style.display = 'block'; // On force l'affichage
        target.classList.add('active');
        console.log("Vue " + viewId + " affichée");
    } else {
        alert("Erreur : La vue '" + viewId + "' n'existe pas dans le HTML");
    }
};

// --- AUTHENTIFICATION ---
window.toggleAuthMode = function() {
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('btn-auth-submit');
    const toggle = document.getElementById('auth-toggle-text');
    
    if (title.innerText === "Connexion") {
        title.innerText = "Inscription";
        btn.innerText = "Créer mon compte";
        toggle.innerText = "Déjà inscrit ? Se connecter";
    } else {
        title.innerText = "Connexion";
        btn.innerText = "Se connecter";
        toggle.innerText = "Pas de compte ? S'inscrire";
    }
};

// --- INITIALISATION AU CHARGEMENT ---
window.onload = async function() {
    console.log("Page chargée, vérification session...");
    
    // On force l'affichage de la landing page par défaut au cas où
    window.showView('view-landing');

    if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            console.log("Utilisateur connecté, redirection accueil");
            window.showView('view-home');
        }
    }
};

// Gestion du bouton Valider
document.addEventListener('click', async function(e) {
    if (e.target && e.target.id === 'btn-auth-submit') {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-pw').value;
        const isSignUp = document.getElementById('auth-title').innerText === "Inscription";

        if (!email || !password) {
            alert("Remplissez tous les champs");
            return;
        }

        try {
            const { data, error } = isSignUp 
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) alert("Erreur : " + error.message);
            else location.reload();
        } catch (err) {
            console.error(err);
        }
    }
});
