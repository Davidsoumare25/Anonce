// CONFIGURATION - On garde l'URL de base .co
const SB_URL = "https://hygkieeuiwgyvvqxyjmv.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z2tpZWV1aXdneXZ2cXh5am12Iiwicm9sZSI6Imh5Z2tpZWV1aXdneXZ2cXh5am12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTIyNDAsImV4cCI6MjA5MzM4ODI0MH0.NNP6q_OmIVfXLt-lIPBNY1HiGdw5gLlI2ZbwdNCMP_Y";

const supabase = window.supabase.createClient(SB_URL, SB_KEY);

// FONCTION DE NAVIGATION (Indispensable pour que les boutons répondent)
window.showView = function(viewId) {
    console.log("Changement vers : " + viewId);
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if(target) target.classList.add('active');
};

// CHANGER ENTRE CONNEXION ET INSCRIPTION
window.toggleAuthMode = function() {
    const title = document.getElementById('auth-title');
    if(title.innerText === "Connexion") {
        title.innerText = "Inscription";
        document.getElementById('auth-toggle-text').innerText = "Déjà un compte ? Connexion";
    } else {
        title.innerText = "Connexion";
        document.getElementById('auth-toggle-text').innerText = "S'inscrire";
    }
};

// ACTION DU BOUTON VALIDER (Auth)
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-auth-submit');
    if(btn) {
        btn.onclick = async () => {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-pw').value;
            const isSignUp = document.getElementById('auth-title').innerText === "Inscription";

            try {
                const { data, error } = isSignUp 
                    ? await supabase.auth.signUp({ email, password })
                    : await supabase.auth.signInWithPassword({ email, password });

                if (error) alert("Erreur : " + error.message);
                else {
                    alert(isSignUp ? "Compte créé ! Vérifiez vos emails." : "Bienvenue !");
                    location.reload();
                }
            } catch (err) {
                alert("Problème de connexion au serveur.");
            }
        };
    }
});

// LOGOUT
window.handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
};

// VERIFICATION AU DEMARRAGE
window.onload = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        showView('view-home');
    }
};
