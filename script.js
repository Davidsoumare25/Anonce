// CONFIGURATION SUPABASE
const SB_URL = "https://hygkieeuiwgyvvqxyjmv.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z2tpZWV1aXdneXZ2cXh5am12Iiwicm9sZSI6Imh5Z2tpZWV1aXdneXZ2cXh5am12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTIyNDAsImV4cCI6MjA5MzM4ODI0MH0.NNP6q_OmIVfXLt-lIPBNY1HiGdw5gLlI2ZbwdNCMP_Y";
const supabase = window.supabase.createClient(SB_URL, SB_KEY);

let currentUser = null;
let isSignUp = false;

// 1. GESTION DES VUES (Navigation sans recharger)
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    window.scrollTo(0,0);
}

// 2. AUTHENTIFICATION
async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        showView('view-home');
        document.getElementById('user-display').innerText = currentUser.email;
    }
}

function toggleAuthMode() {
    isSignUp = !isSignUp;
    document.getElementById('auth-title').innerText = isSignUp ? "Inscription" : "Connexion";
    document.getElementById('auth-toggle-text').innerText = isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire";
}

document.getElementById('btn-auth-submit').onclick = async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-pw').value;

    const { data, error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else {
        if (isSignUp) alert("Vérifiez votre boîte mail !");
        location.reload();
    }
};

async function handleLogout() {
    await supabase.auth.signOut();
    location.reload();
}

// 3. MODAL PUBLICATION
function openPublishModal() { document.getElementById('modal-publish').classList.add('active'); }
function closePublishModal() { document.getElementById('modal-publish').classList.remove('active'); }

// 4. INITIALISATION
window.onload = () => {
    checkUser();
};

