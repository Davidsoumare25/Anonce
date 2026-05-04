// CONFIGURATION SUPABASE
const SB_URL = "https://hygkieeuiwgyvvqxyjmv.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z2tpZWV1aXdneXZ2cXh5am12Iiwicm9sZSI6Imh5Z2tpZWV1aXdneXZ2cXh5am12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTIyNDAsImV4cCI6MjA5MzM4ODI0MH0.NNP6q_OmIVfXLt-lIPBNY1HiGdw5gLlI2ZbwdNCMP_Y";

let supabase;

// Initialisation sécurisée
try {
    supabase = window.supabase.createClient(SB_URL, SB_KEY);
    console.log("Supabase initialisé avec succès");
} catch (e) {
    console.error("Erreur initialisation Supabase:", e);
}

// NAVIGATION ENTRE LES VUES
window.showView = function(viewId) {
    console.log("Tentative d'affichage de la vue :", viewId);
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));
    
    const targetView = document.getElementById(viewId);
    if(targetView) {
        targetView.classList.add('active');
        window.scrollTo(0, 0);
    } else {
        console.error("Vue introuvable :", viewId);
    }
};

// AUTHENTIFICATION
window.toggleAuthMode = function() {
    const title = document.getElementById('auth-title');
    const toggleText = document.getElementById('auth-toggle-text');
    if (title.innerText === "Connexion") {
        title.innerText = "Inscription";
        toggleText.innerText = "Déjà un compte ? Se connecter";
    } else {
        title.innerText = "Connexion";
        toggleText.innerText = "Pas de compte ? S'inscrire";
    }
};

// ACTIONS BOUTONS
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM chargé, boutons prêts");

    // Bouton de soumission Auth
    const btnAuth = document.getElementById('btn-auth-submit');
    if(btnAuth) {
        btnAuth.onclick = async () => {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-pw').value;
            const isSignUp = document.getElementById('auth-title').innerText === "Inscription";

            console.log("Tentative d'auth pour :", email);
            const { data, error } = isSignUp 
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) alert(error.message);
            else location.reload();
        };
    }
});

// MODAL PUBLICATION
window.openPublishModal = () => document.getElementById('modal-publish').classList.add('active');
window.closePublishModal = () => document.getElementById('modal-publish').classList.remove('active');

// VERIFICATION SESSION AU CHARGEMENT
window.onload = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        console.log("Utilisateur connecté :", session.user.email);
        showView('view-home');
        document.getElementById('user-display').innerText = session.user.email;
    } else {
        console.log("Aucun utilisateur connecté");
    }
};
