// ===== APLICACIÓN DE AHORRO - SCRIPT PRINCIPAL =====
// Datos globales
let goals = [];
let automations = [];
const settings = {
    language: 'es',
    currency: 'USD',
    supabaseUrl: '',
    supabaseKey: ''
};
let supabaseClient = null;
let currentGoalId = null;
let currentMoneyAction = null;

// Variables de perfiles
let profiles = [];
let currentProfileId = 'default_profile';
let allGoals = []; // Almacena TODAS las metas de todos los perfiles
let allAutomations = []; // Almacena TODAS las automatizaciones de todos los perfiles

// Traducciones completas
const translations = {
    es: {
        // Textos principales
        'app-title': 'MiAhorro - Tus Metas de Ahorro',
        'total-savings': '💰 Ahorro Track',
        'total-saved': 'Ahorro Track',
        'my-goals': 'Mis Metas',
        'start-saving-adventure': '¡Comienza tu aventura de ahorro!',
        'tap-plus-button': 'Toca el botón + para crear tu primera meta',
        'create-first-goal': 'Crea tu primera meta para visualizar tus ahorros',
        'no-limit': 'Sin límite',
        'goal-reached': '¡Meta alcanzada!',
        'export': 'Exportar',
        'import': 'Importar',
        
        // Configuración
        'settings': 'Configuración',
        'language': 'Idioma',
        'main-currency': 'Moneda Principal',
        'cancel': 'Cancelar',
        'save-changes': 'Guardar Cambios',
        'settings-saved': '¡Configuración guardada exitosamente!',
        
        // Nueva meta
        'new-goal': 'Nueva Meta',
        'goal-name': 'Nombre de la meta *',
        'goal-name-placeholder': 'Ej: Vacaciones, Auto nuevo, Casa...',
        'target-amount': 'Cantidad objetivo (opcional)',
        'currency': 'Moneda',
        'image-optional': 'Imagen (opcional)',
        'tap-add-image': 'Toca para agregar una imagen',
        'save-goal': 'Guardar Meta',
        'enter-goal-name': 'Por favor, ingresa un nombre para la meta',
        
        // Detalle de meta
        'goal-detail': 'Detalle de la Meta',
        'saved': 'Ahorrado',
        'target': 'Objetivo',
        'add': 'Agregar',
        'remove': 'Retirar',
        'edit': 'Editar',
        'transaction-history': 'Historial de Movimientos',
        
        // Agregar/Quitar dinero
        'add-money': 'Agregar Dinero',
        'remove-money': 'Retirar Dinero',
        'amount': 'Cantidad',
        'note-optional': 'Nota (opcional)',
        'note-placeholder': 'Ej: Ahorro mensual, Regalo, Bono...',
        'confirm': 'Confirmar',
        
        // Editar meta
        'edit-goal': 'Editar Meta',
        'goal-name-edit': 'Nombre de la meta',
        'target-amount-edit': 'Cantidad objetivo',
        'image': 'Imagen',
        'tap-change-image': 'Toca para cambiar la imagen',
        'save': 'Guardar',
        
        // Eliminar
        'confirm-delete': 'Confirmar Eliminación',
        'delete-confirmation': '¿Estás seguro de que deseas eliminar esta meta?',
        'action-undoable': 'Esta acción no se puede deshacer.',
        'delete': 'Eliminar',
        
        // Transacciones
        'added': 'Agregado',
        'removed': 'Retirado',
        'remaining': 'Faltan',
        'chart-title': 'Gráfico de Evolución',
        'chart-tooltip-placeholder': 'Toca un punto para ver detalles',
        'chart-empty': 'Agrega movimientos para ver el gráfico'
    },
    
    en: {
        // Main texts
        'app-title': 'MySavings - Your Savings Goals',
        'total-savings': '💰 Ahorro Track',
        'total-saved': 'Ahorro Track',
        'my-goals': 'My Goals',
        'start-saving-adventure': 'Start your savings journey!',
        'tap-plus-button': 'Tap the + button to create your first goal',
        'create-first-goal': 'Create your first goal to track your savings',
        'no-limit': 'No limit',
        'goal-reached': 'Goal achieved!',
        'export': 'Export',
        'import': 'Import',
        
        // Settings
        'settings': 'Settings',
        'language': 'Language',
        'main-currency': 'Main Currency',
        'cancel': 'Cancel',
        'save-changes': 'Save Changes',
        'settings-saved': 'Settings saved successfully!',
        
        // New goal
        'new-goal': 'New Goal',
        'goal-name': 'Goal name *',
        'goal-name-placeholder': 'Ex: Vacation, New car, House...',
        'target-amount': 'Target amount (optional)',
        'currency': 'Currency',
        'image-optional': 'Image (optional)',
        'tap-add-image': 'Tap to add an image',
        'save-goal': 'Save Goal',
        'enter-goal-name': 'Please enter a goal name',
        
        // Goal detail
        'goal-detail': 'Goal Details',
        'saved': 'Saved',
        'target': 'Target',
        'add': 'Add',
        'remove': 'Remove',
        'edit': 'Edit',
        'transaction-history': 'Transaction History',
        
        // Add/Remove money
        'add-money': 'Add Money',
        'remove-money': 'Remove Money',
        'amount': 'Amount',
        'note-optional': 'Note (optional)',
        'note-placeholder': 'Ex: Monthly savings, Gift, Bonus...',
        'confirm': 'Confirm',
        
        // Edit goal
        'edit-goal': 'Edit Goal',
        'goal-name-edit': 'Goal name',
        'target-amount-edit': 'Target amount',
        'image': 'Image',
        'tap-change-image': 'Tap to change image',
        'save': 'Save',
        
        // Delete
        'confirm-delete': 'Confirm Deletion',
        'delete-confirmation': 'Are you sure you want to delete this goal?',
        'action-undoable': 'This action cannot be undone.',
        'delete': 'Delete',
        
        // Transactions
        'added': 'Added',
        'removed': 'Removed',
        'remaining': 'Remaining',
        'chart-title': 'Evolution Chart',
        'chart-tooltip-placeholder': 'Tap a point to view details',
        'chart-empty': 'Add transactions to see the chart'
    },
    
    pt: {
        // Textos principais
        'app-title': 'MinhasPoupanças - Suas Metas de Poupança',
        'total-savings': '💰 Ahorro Track',
        'total-saved': 'Ahorro Track',
        'my-goals': 'Minhas Metas',
        'start-saving-adventure': 'Comece sua jornada de poupança!',
        'tap-plus-button': 'Toque no botão + para criar sua primeira meta',
        'create-first-goal': 'Crie sua primeira meta para acompanhar suas poupanças',
        'no-limit': 'Sem limite',
        'goal-reached': 'Meta alcançada!',
        'export': 'Exportar',
        'import': 'Importar',
        
        // Configurações
        'settings': 'Configurações',
        'language': 'Idioma',
        'main-currency': 'Moeda Principal',
        'cancel': 'Cancelar',
        'save-changes': 'Salvar Alterações',
        'settings-saved': 'Configurações salvas com sucesso!',
        
        // Nova meta
        'new-goal': 'Nova Meta',
        'goal-name': 'Nome da meta *',
        'goal-name-placeholder': 'Ex: Férias, Carro novo, Casa...',
        'target-amount': 'Valor objetivo (opcional)',
        'currency': 'Moeda',
        'image-optional': 'Imagem (opcional)',
        'tap-add-image': 'Toque para adicionar uma imagem',
        'save-goal': 'Salvar Meta',
        'enter-goal-name': 'Por favor, insira um nome para a meta',
        
        // Detalhe da meta
        'goal-detail': 'Detalhes da Meta',
        'saved': 'Poupado',
        'target': 'Objetivo',
        'add': 'Adicionar',
        'remove': 'Remover',
        'edit': 'Editar',
        'transaction-history': 'Histórico de Transações',
        
        // Adicionar/Remover dinheiro
        'add-money': 'Adicionar Dinheiro',
        'remove-money': 'Remover Dinheiro',
        'amount': 'Valor',
        'note-optional': 'Nota (opcional)',
        'note-placeholder': 'Ex: Poupança mensal, Presente, Bônus...',
        'confirm': 'Confirmar',
        
        // Editar meta
        'edit-goal': 'Editar Meta',
        'goal-name-edit': 'Nome da meta',
        'target-amount-edit': 'Valor objetivo',
        'image': 'Imagem',
        'tap-change-image': 'Toque para alterar a imagem',
        'save': 'Salvar',
        
        // Excluir
        'confirm-delete': 'Confirmar Exclusão',
        'delete-confirmation': 'Tem certeza de que deseja excluir esta meta?',
        'action-undoable': 'Esta ação não pode ser desfeita.',
        'delete': 'Excluir',
        
        // Transações
        'added': 'Adicionado',
        'removed': 'Removido',
        'remaining': 'Restam',
        'chart-title': 'Gráfico de Evolução',
        'chart-tooltip-placeholder': 'Toque num ponto para ver detalhes',
        'chart-empty': 'Adicione transações para ver o gráfico'
    },
    
    que: {
        // Textos principales
        'app-title': 'Qolqe Waqaychay - Qampa Metakuna',
        'total-savings': '💰 Ahorro Track',
        'total-saved': 'Ahorro Track',
        'my-goals': 'Ñuqapa Metakuna',
        'start-saving-adventure': '¡Qolqe waqaychay puriyta qallariy!',
        'tap-plus-button': '+ botonta ñit\'iy ñawpaq metaykita ruwanapaq',
        'create-first-goal': 'Ñawpaq metaykita ruway qolqeykita qhawanapaq',
        'no-limit': 'Mana sayay',
        'goal-reached': '¡Meta chayasqa!',
        'export': 'Lluqsichiy',
        'import': 'Yaykuchiy',
        
        // Configuración
        'settings': 'Allichay',
        'language': 'Simi',
        'main-currency': 'Hatun Qolqe',
        'cancel': 'Saqiy',
        'save-changes': 'Tikaykunata waqaychay',
        'settings-saved': '¡Allichay allinta waqaychasqa!',
        
        // Nueva meta
        'new-goal': 'Musuq Meta',
        'goal-name': 'Metapa sutin *',
        'goal-name-placeholder': 'Kayhinata: Samay, Musuq auto, Wasi...',
        'target-amount': 'Munasqa qolqe (munasqanman hina)',
        'currency': 'Qolqe',
        'image-optional': 'Siq\'i (munasqanman hina)',
        'tap-add-image': 'Ñit\'iy huk siq\'ita yapanapaq',
        'save-goal': 'Metata waqaychay',
        'enter-goal-name': 'Ama hina kay, metapa sutinta qillqay',
        
        // Detalle de meta
        'goal-detail': 'Metapa Willakuyninkunata',
        'saved': 'Waqaychasqa',
        'target': 'Meta',
        'add': 'Yapay',
        'remove': 'Hurquy',
        'edit': 'Allichay',
        'transaction-history': 'Qolqe Ruraykunapa Willakuynin',
        
        // Agregar/Quitar dinero
        'add-money': 'Qolqeta yapay',
        'remove-money': 'Qolqeta hurquy',
        'amount': 'Qolqe',
        'note-optional': 'Qillqasqa (munasqanman hina)',
        'note-placeholder': 'Kayhinata: Killapa qolqen, Sipiy, Yapay...',
        'confirm': 'Takyachiy',
        
        // Editar meta
        'edit-goal': 'Metata allichay',
        'goal-name-edit': 'Metapa sutin',
        'target-amount-edit': 'Munasqa qolqe',
        'image': 'Siq\'i',
        'tap-change-image': 'Ñit\'iy siq\'ita tikanaykipaq',
        'save': 'Waqaychay',
        
        // Eliminar
        'confirm-delete': 'Qichuy takyachiy',
        'delete-confirmation': '¿Chiqachu kay metata qichuyta munankichu?',
        'action-undoable': 'Kay rurayqa manam kutichikuyta atinchu.',
        'delete': 'Qichuy',
        
        // Transacciones
        'added': 'Yapasqa',
        'removed': 'Hurqusqa',
        'remaining': 'Faltasqa',
        'chart-title': 'Qhaway Waqaychay',
        'chart-tooltip-placeholder': 'Allinta qhaway metata ñit\'ispa',
        'chart-empty': 'Qolqeta churay qhawana siq\'ipaq'
    }
};

// Información de monedas
const currencyInfo = {
    USD: { name: 'Dólar', flag: '🇺🇸' },
    EUR: { name: 'Euro', flag: '🇪🇺' },
    COP: { name: 'Peso Colombiano', flag: '🇨🇴' },
    BRL: { name: 'Real', flag: '🇧🇷' },
    MXN: { name: 'Peso Mexicano', flag: '🇲🇽' },
    ARS: { name: 'Peso Argentino', flag: '🇦🇷' },
    CLP: { name: 'Peso Chileno', flag: '🇨🇱' },
    PEN: { name: 'Sol Peruano', flag: '🇵🇪' }
};

// Símbolos de monedas para formateo global uniforme (separador de miles con punto y decimal con coma)
const currencySymbols = {
    USD: '$',
    EUR: '€',
    COP: '$',
    BRL: 'R$',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    PEN: 'S/'
};

// ===== FUNCIONES DE FORMATEO DE NÚMEROS =====
function formatNumberInput(value) {
    if (value === undefined || value === null) return '';
    let str = value.toString();
    if (str === '') return '';
    
    // Verificamos si contiene una coma decimal
    const hasComma = str.includes(',');
    
    const parts = str.split(',');
    let integerPart = parts[0].replace(/\D/g, ''); // Mantener solo dígitos
    let decimalPart = parts[1] !== undefined ? parts[1].replace(/\D/g, '') : '';
    
    // Formatear la parte entera con puntos como separadores de miles
    if (integerPart.length > 3) {
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    // Reconstruir el valor
    let formatted = integerPart;
    if (hasComma) {
        formatted += ',' + decimalPart;
    }
    return formatted;
}

function formatNumberToInputString(num) {
    if (num === undefined || num === null) return '';
    // Convertir a string reemplazando punto decimal por coma decimal
    const str = num.toString().replace('.', ',');
    return formatNumberInput(str);
}

function parseFormattedNumber(value) {
    if (!value || value === '') return 0;
    let str = value.toString();
    // Quitar todos los puntos (separadores de miles)
    str = str.replace(/\./g, '');
    // Reemplazar la coma decimal por punto decimal
    str = str.replace(/,/g, '.');
    return parseFloat(str) || 0;
}

function setupNumberFormatting(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // Cambiar el tipo de input a text para permitir formateo
    input.type = 'text';
    input.inputMode = 'decimal'; // Mantener el teclado numérico en móviles
    
    // Remover event listeners previos si existen
    input.removeEventListener('input', input._formatHandler);
    input.removeEventListener('keydown', input._keydownHandler);
    input.removeEventListener('blur', input._blurHandler);
    
    // Handler para keydown - permitir solo números, punto/coma y teclas especiales
    input._keydownHandler = function(e) {
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];
        
        // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
            return;
        }
        
        // Permitir teclas especiales
        if (allowedKeys.includes(e.key)) {
            return;
        }
        
        // Permitir números
        if (e.key >= '0' && e.key <= '9') {
            return;
        }
        
        // Tratar tanto punto como coma como separador decimal (coma)
        if (e.key === '.' || e.key === ',') {
            if (e.target.value.includes(',')) {
                e.preventDefault();
                return;
            }
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const val = e.target.value;
            e.target.value = val.slice(0, start) + ',' + val.slice(end);
            e.target.setSelectionRange(start + 1, start + 1);
            e.preventDefault();
            e.target.dispatchEvent(new Event('input'));
            return;
        }
        
        // Bloquear todo lo demás
        e.preventDefault();
    };
    
    // Handler para input - formatear mientras se escribe
    input._formatHandler = function(e) {
        const cursorPosition = e.target.selectionStart;
        const oldValue = e.target.value;
        const newValue = formatNumberInput(oldValue);
        
        if (newValue !== oldValue) {
            e.target.value = newValue;
            
            // Calcular nueva posición del cursor (contando la diferencia de puntos insertados/removidos)
            let newCursorPosition = cursorPosition;
            const oldDots = (oldValue.slice(0, cursorPosition).match(/\./g) || []).length;
            const newDots = (newValue.slice(0, cursorPosition).match(/\./g) || []).length;
            const dotsDiff = newDots - oldDots;
            
            newCursorPosition = cursorPosition + dotsDiff;
            newCursorPosition = Math.max(0, Math.min(newCursorPosition, newValue.length));
            
            // Usar setTimeout para asegurar que el cursor se posicione correctamente
            setTimeout(() => {
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            }, 0);
        }
    };
    
    // Handler para blur - formatear al perder el foco
    input._blurHandler = function(e) {
        const value = e.target.value;
        if (value && value.trim() !== '') {
            e.target.value = formatNumberInput(value);
        }
    };
    
    // Agregar event listeners
    input.addEventListener('keydown', input._keydownHandler);
    input.addEventListener('input', input._formatHandler);
    input.addEventListener('blur', input._blurHandler);
}

// ===== FUNCIONES DE ALMACENAMIENTO =====
function mergeCurrentProfileGoals() {
    allGoals = allGoals.filter(g => g.profileId !== currentProfileId);
    goals.forEach(g => g.profileId = currentProfileId);
    allGoals = allGoals.concat(goals);
}

function initSupabase() {
    if (settings.supabaseUrl && settings.supabaseKey) {
        try {
            supabaseClient = supabase.createClient(settings.supabaseUrl, settings.supabaseKey);
            console.log('⚡ Supabase cliente inicializado con éxito');
            
            // Escuchar cambios de estado de autenticación
            supabaseClient.auth.onAuthStateChange(async (event, session) => {
                console.log("🔔 Evento de Auth:", event);
                updateAuthUI(session);
                if (event === 'SIGNED_IN') {
                    await syncFromSupabase();
                }
            });
        } catch (e) {
            console.error('❌ Error al inicializar Supabase:', e);
            supabaseClient = null;
        }
    } else {
        supabaseClient = null;
    }
}

function updateAuthUI(session) {
    const loginBtn = document.getElementById("login-google-btn");
    const profileMenu = document.getElementById("user-profile-menu");
    const avatarImg = document.getElementById("user-avatar");
    const emailSpan = document.getElementById("user-email");
    
    if (session && session.user) {
        if (loginBtn) loginBtn.style.display = "none";
        if (profileMenu) profileMenu.style.display = "flex";
        if (avatarImg) {
            avatarImg.src = session.user.user_metadata.avatar_url || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23667eea'/><text x='50' y='65' font-size='40' text-anchor='middle' fill='white'>👤</text></svg>";
        }
        if (emailSpan) emailSpan.textContent = session.user.email;
    } else {
        if (loginBtn) loginBtn.style.display = "flex";
        if (profileMenu) profileMenu.style.display = "none";
    }
}

async function signInWithGoogle() {
    if (!supabaseClient) {
        alert("Por favor, configura las credenciales de Supabase en Ajustes primero.");
        openSettings();
        return;
    }
    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    } catch (e) {
        console.error("Error al autenticar con Google:", e.message);
        alert("Error de autenticación con Google: " + e.message);
    }
}

async function signOut(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (!supabaseClient) return;
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        updateAuthUI(null);
        // Limpiar localStorage de metas al desautenticarse para privacidad
        localStorage.removeItem("miAhorroMetas");
        localStorage.removeItem("miAhorroProfiles");
        localStorage.removeItem("miAhorroAutomations");
        window.location.reload();
    } catch (e) {
        console.error("Error al cerrar sesión:", e.message);
    }
}

function toggleUserDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    const dropdown = document.getElementById("user-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Cerrar dropdown si se hace clic fuera
window.addEventListener("click", () => {
    const dropdown = document.getElementById("user-dropdown");
    if (dropdown && dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
    }
});

async function syncToSupabase() {
    if (!supabaseClient) return;
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            console.log('⚠️ Sincronización hacia Supabase omitida: no hay sesión activa.');
            return;
        }
        const activeUserId = user.id;
        console.log('🔄 Sincronizando datos locales hacia Supabase para el usuario:', activeUserId);
        
        // 1. Guardar perfiles
        if (profiles.length > 0) {
            const upsertProfiles = profiles.map(p => ({
                id: p.id,
                user_id: activeUserId,
                name: p.name,
                emoji: p.emoji,
                color: p.color
            }));
            const { error: errP } = await supabaseClient.from('profiles').upsert(upsertProfiles);
            if (errP) throw errP;
            
            // Eliminar perfiles locales que no estén en la lista
            const localProfileIds = profiles.map(p => p.id);
            await supabaseClient.from('profiles').delete().eq('user_id', activeUserId).not('id', 'in', `(${localProfileIds.map(id => `"${id}"`).join(',')})`);
        } else {
            await supabaseClient.from('profiles').delete().eq('user_id', activeUserId).neq('id', '');
        }
        
        // 2. Guardar metas
        if (allGoals.length > 0) {
            const upsertGoals = allGoals.map(g => ({
                id: Number(g.id),
                user_id: activeUserId,
                profile_id: g.profileId,
                name: g.name,
                target_amount: g.targetAmount || null,
                current_amount: g.currentAmount,
                currency: g.currency,
                transactions: g.transactions || []
            }));
            const { error: errG } = await supabaseClient.from('goals').upsert(upsertGoals);
            if (errG) throw errG;
            
            const localGoalIds = allGoals.map(g => Number(g.id));
            await supabaseClient.from('goals').delete().eq('user_id', activeUserId).not('id', 'in', `(${localGoalIds.join(',')})`);
        } else {
            await supabaseClient.from('goals').delete().eq('user_id', activeUserId).neq('id', 0);
        }
        
        // 3. Guardar automatizaciones
        if (allAutomations.length > 0) {
            const upsertAutos = allAutomations.map(a => ({
                id: a.id,
                user_id: activeUserId,
                goal_id: Number(a.goalId),
                profile_id: a.profileId,
                action_type: a.actionType,
                amount: a.amount,
                frequency: a.frequency,
                note: a.note || '',
                last_run: a.lastRun || null,
                next_run: a.nextRun || null
            }));
            const { error: errA } = await supabaseClient.from('automations').upsert(upsertAutos);
            if (errA) throw errA;
            
            const localAutoIds = allAutomations.map(a => a.id);
            await supabaseClient.from('automations').delete().eq('user_id', activeUserId).not('id', 'in', `(${localAutoIds.map(id => `"${id}"`).join(',')})`);
        } else {
            await supabaseClient.from('automations').delete().eq('user_id', activeUserId).neq('id', '');
        }
        
        console.log('✅ Sincronización hacia Supabase completada');
    } catch (e) {
        console.error('❌ Error sincronizando hacia Supabase:', e);
    }
}

async function syncFromSupabase() {
    if (!supabaseClient) return;
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            console.log('⚠️ Sincronización desde Supabase omitida: no hay sesión activa.');
            return;
        }
        console.log('🔄 Obteniendo datos del usuario autenticado desde Supabase...');
        
        const { data: dbProfiles, error: errProf } = await supabaseClient.from('profiles').select('*');
        if (errProf) throw errProf;
        
        const { data: dbGoals, error: errGoals } = await supabaseClient.from('goals').select('*');
        if (errGoals) throw errGoals;
        
        const { data: dbAutomations, error: errAutos } = await supabaseClient.from('automations').select('*');
        if (errAutos) throw errAutos;
        
        if (dbProfiles && dbProfiles.length > 0) {
            profiles = dbProfiles.map(p => ({
                id: p.id,
                name: p.name,
                emoji: p.emoji || '👤',
                color: p.color || '#667eea'
            }));
        }
        
        if (dbGoals) {
            allGoals = dbGoals.map(g => ({
                id: Number(g.id),
                profileId: g.profile_id,
                name: g.name,
                targetAmount: Number(g.target_amount) || 0,
                currentAmount: Number(g.current_amount) || 0,
                currency: g.currency,
                transactions: g.transactions || [],
                createdAt: g.created_at
            }));
        }
        
        if (dbAutomations) {
            allAutomations = dbAutomations.map(a => ({
                id: a.id,
                goalId: Number(a.goal_id),
                profileId: a.profile_id,
                actionType: a.action_type,
                amount: Number(a.amount) || 0,
                frequency: a.frequency,
                note: a.note || '',
                lastRun: a.last_run,
                nextRun: a.next_run,
                createdAt: a.created_at
            }));
        }
        
        // Guardar copia local de respaldo
        localStorage.setItem("miAhorroMetas", JSON.stringify(allGoals));
        localStorage.setItem("miAhorroProfiles", JSON.stringify(profiles));
        localStorage.setItem("miAhorroAutomations", JSON.stringify(allAutomations));
        
        loadActiveProfileData();
        updateGoalsUI();
        updateTotals();
        console.log('✅ Datos sincronizados correctamente desde Supabase');
    } catch (e) {
        console.error('❌ Error de sincronización desde Supabase:', e);
    }
}

function saveToStorage() {
    try {
        mergeCurrentProfileGoals();
        localStorage.setItem("miAhorroMetas", JSON.stringify(allGoals));
        localStorage.setItem("miAhorroSettings", JSON.stringify(settings));
        localStorage.setItem("miAhorroProfiles", JSON.stringify(profiles));
        localStorage.setItem("miAhorroCurrentProfileId", currentProfileId);
        localStorage.setItem("miAhorroAutomations", JSON.stringify(allAutomations));
        console.log('✅ Datos guardados localmente');
        
        if (supabaseClient) {
            syncToSupabase();
        }
    } catch (error) {
        console.error('❌ Error guardando localmente:', error);
    }
}

function loadFromStorage() {
    try {
        // Cargar primero configuraciones
        const settingsData = localStorage.getItem("miAhorroSettings");
        if (settingsData) Object.assign(settings, JSON.parse(settingsData));
        
        // Inicializar cliente Supabase si las credenciales existen
        initSupabase();
        
        const profilesData = localStorage.getItem("miAhorroProfiles");
        const activeProfileData = localStorage.getItem("miAhorroCurrentProfileId");
        
        if (profilesData) {
            profiles = JSON.parse(profilesData);
        }
        if (activeProfileData) {
            currentProfileId = activeProfileData;
        }

        if (profiles.length === 0) {
            console.log('⚠️ Creando perfil principal por defecto y migrando datos...');
            const defaultProfile = {
                id: 'default_profile',
                name: 'Principal',
                emoji: '👤',
                color: '#667eea'
            };
            profiles.push(defaultProfile);
            currentProfileId = 'default_profile';
            
            const rawGoals = localStorage.getItem("miAhorroMetas");
            let tempGoals = rawGoals ? JSON.parse(rawGoals) : [];
            tempGoals.forEach(g => {
                if (!g.profileId) g.profileId = 'default_profile';
            });
            allGoals = tempGoals;
            
            const rawAutomations = localStorage.getItem("miAhorroAutomations");
            let tempAutos = rawAutomations ? JSON.parse(rawAutomations) : [];
            tempAutos.forEach(a => {
                if (!a.profileId) a.profileId = 'default_profile';
            });
            allAutomations = tempAutos;

            localStorage.setItem("miAhorroProfiles", JSON.stringify(profiles));
            localStorage.setItem("miAhorroCurrentProfileId", currentProfileId);
            localStorage.setItem("miAhorroMetas", JSON.stringify(allGoals));
            localStorage.setItem("miAhorroAutomations", JSON.stringify(allAutomations));
        } else {
            const goalsData = localStorage.getItem("miAhorroMetas");
            if (goalsData) {
                allGoals = JSON.parse(goalsData);
                allGoals.forEach(g => {
                    if (!g.profileId) g.profileId = 'default_profile';
                });
            }
            
            const automationsData = localStorage.getItem("miAhorroAutomations");
            if (automationsData) {
                allAutomations = JSON.parse(automationsData);
                allAutomations.forEach(a => {
                    if (!a.profileId) a.profileId = 'default_profile';
                });
            }
        }
        
        loadActiveProfileData();
        console.log('✅ Datos locales cargados');
        
        // Si hay conexión de Supabase activa, sincronizar en segundo plano
        if (supabaseClient) {
            syncFromSupabase();
        }
    } catch (error) {
        console.error('❌ Error cargando datos locales:', error);
    }
}

function loadActiveProfileData() {
    goals = allGoals.filter(g => g.profileId === currentProfileId);
    automations = allAutomations.filter(a => a.profileId === currentProfileId);
    updateProfileBadgeHeader();
}

function updateProfileBadgeHeader() {
    const badge = document.getElementById("current-profile-badge");
    const emojiSpan = document.getElementById("header-profile-emoji");
    const nameSpan = document.getElementById("header-profile-name");
    
    const activeProf = profiles.find(p => p.id === currentProfileId);
    if (activeProf && badge && emojiSpan && nameSpan) {
        emojiSpan.textContent = activeProf.emoji;
        nameSpan.textContent = activeProf.name;
        badge.style.borderColor = activeProf.color;
        badge.style.background = `rgba(${hexToRgb(activeProf.color)}, 0.15)`;
    }
}

function hexToRgb(hex) {
    if (!hex || hex[0] !== '#') return '102, 126, 234';
    let c = hex.substring(1);
    if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

// ===== FUNCIONES DE CONFIGURACIÓN =====
function openSettings() {
    console.log('🔧 Abriendo configuración...');
    const modal = document.getElementById("settings-modal");
    if (modal) {
        modal.style.display = "flex";
        
        // Cargar valores actuales
        const langSelect = document.getElementById("language-select");
        const currencySelect = document.getElementById("currency-select");
        const urlInput = document.getElementById("supabase-url");
        const keyInput = document.getElementById("supabase-key");
        
        if (langSelect) langSelect.value = settings.language;
        if (currencySelect) currencySelect.value = settings.currency;
        if (urlInput) urlInput.value = settings.supabaseUrl || "";
        if (keyInput) keyInput.value = settings.supabaseKey || "";
        
        console.log('✅ Modal de configuración abierto');
    }
}

function closeSettings() {
    console.log('🔧 Cerrando configuración...');
    const modal = document.getElementById("settings-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

function saveSettings() {
    console.log('💾 Guardando configuración...');
    
    const langSelect = document.getElementById("language-select");
    const currencySelect = document.getElementById("currency-select");
    const urlInput = document.getElementById("supabase-url");
    const keyInput = document.getElementById("supabase-key");
    
    if (langSelect && currencySelect) {
        settings.language = langSelect.value;
        settings.currency = currencySelect.value;
        if (urlInput) settings.supabaseUrl = urlInput.value.trim();
        if (keyInput) settings.supabaseKey = keyInput.value.trim();
        
        // Inicializar o re-inicializar cliente Supabase
        initSupabase();
        
        saveToStorage();
        updateTotals();
        updateGoalsUI(); // Actualizar la interfaz con el nuevo idioma
        updateUILanguage(); // Actualizar todos los textos de la interfaz
        
        // Si hay una conexión Supabase nueva, subir los datos locales a Supabase
        if (supabaseClient) {
            syncToSupabase();
        }
        
        console.log(`✅ Configuración guardada - Idioma: ${settings.language}, Moneda: ${settings.currency}`);
        
        closeSettings();
        console.log('✅ Configuración guardada');
    }
}

// ===== FUNCIONES DE METAS =====
function openAddGoal() {
    console.log('➕ Abriendo nueva meta...');
    const modal = document.getElementById("add-goal-modal");
    if (modal) {
        modal.style.display = "flex";
        resetAddGoalForm();
        setupCurrencySelect();
        console.log('✅ Modal de nueva meta abierto');
    }
}

function closeAddGoal() {
    console.log('➕ Cerrando nueva meta...');
    const modal = document.getElementById("add-goal-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

function resetAddGoalForm() {
    const nameInput = document.getElementById("goal-name");
    const amountInput = document.getElementById("goal-amount");
    const currencySelect = document.getElementById("goal-currency");
    const imageInput = document.getElementById("goal-image");
    const imagePreview = document.getElementById("image-preview");
    
    if (nameInput) nameInput.value = "";
    if (amountInput) amountInput.value = "";
    if (currencySelect) currencySelect.value = settings.currency || "USD";
    if (imageInput) imageInput.value = "";
    
    // Limpiar preview de imagen
    if (imagePreview) {
        imagePreview.innerHTML = `
            <div class="upload-placeholder">
                <span class="upload-icon">📷</span>
                <span>Toca para agregar imagen</span>
            </div>
        `;
    }
}

function setupCurrencySelect() {
    const currencySelect = document.getElementById("goal-currency");
    if (currencySelect) {
        currencySelect.innerHTML = Object.entries(currencyInfo).map(([code, info]) => 
            `<option value="${code}">${info.flag} ${code} - ${info.name}</option>`
        ).join('');
        currencySelect.value = settings.currency;
    }
}

function saveGoal() {
    console.log('💾 Guardando nueva meta...');
    
    const nameInput = document.getElementById("goal-name");
    const amountInput = document.getElementById("goal-amount");
    const currencySelect = document.getElementById("goal-currency");
    const imageInput = document.getElementById("goal-image");
    
    if (!nameInput || !currencySelect) {
        console.error('❌ Elementos del formulario no encontrados');
        return;
    }
    
    const name = nameInput.value.trim();
    const amount = parseFormattedNumber(amountInput.value) || 0;
    const currency = currencySelect.value;
    const imageFile = imageInput ? imageInput.files[0] : null;
    
    if (!name) {
        console.warn('⚠️ Nombre de meta requerido');
        return;
    }
    
    const goal = {
        id: Date.now(),
        name: name,
        targetAmount: amount,
        currentAmount: 0,
        currency: currency,
        image: null,
        transactions: [],
        pockets: [],
        createdAt: new Date().toISOString()
    };
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            goal.image = e.target.result;
            goals.push(goal);
            saveToStorage();
            updateGoalsUI();
            updateTotals();
            closeAddGoal();
            console.log('✅ Meta guardada con imagen');
        };
        reader.readAsDataURL(imageFile);
    } else {
        goals.push(goal);
        saveToStorage();
        updateGoalsUI();
        updateTotals();
        closeAddGoal();
        console.log('✅ Meta guardada sin imagen');
    }
}

// ===== FUNCIONES DE UI =====
function updateGoalsUI() {
    const container = document.getElementById("goals-container");
    if (!container) {
        console.error('❌ Contenedor de metas no encontrado');
        return;
    }
    
    if (goals.length === 0) {
        const t = translations[settings.language] || translations.es;
        container.innerHTML = `
            <div class="empty-state">
                <p>${t['start-saving-adventure']}</p>
                <p>${t['tap-plus-button']}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = goals.map((goal, index) => {
        const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
        const remaining = goal.targetAmount > 0 ? Math.max(goal.targetAmount - goal.currentAmount, 0) : 0;
        const t = translations[settings.language] || translations.es;
        
        return `
            <div class="goal-card" data-goal-id="${goal.id}" data-index="${index}">
                <div class="goal-content" onclick="openGoalDetail(${goal.id})">
                    ${goal.image ? `<img src="${goal.image}" alt="${goal.name}" class="goal-image">` : '<div class="goal-icon">💰</div>'}
                    <div class="goal-info">
                        <h3>${goal.name}</h3>
                        <div class="goal-amounts">
                            <span class="saved">${formatCurrency(goal.currentAmount, goal.currency)}</span>
                            ${goal.targetAmount > 0 ? `<span class="target">de ${formatCurrency(goal.targetAmount, goal.currency)}</span>` : `<span class="target">${t['no-limit']}</span>`}
                        </div>
                        ${goal.targetAmount > 0 ? `
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="remaining">
                                ${remaining > 0 ? `${t['remaining']} ${formatCurrency(remaining, goal.currency)}` : t['goal-reached']}
                            </div>
                        ` : ''}
                        <div class="goal-date">
                            Creada: ${new Date(goal.createdAt).toLocaleDateString()}
                        </div>
                        ${(goal.pockets && goal.pockets.length > 0) ? `
                            <div class="goal-pockets-badge" onclick="event.stopPropagation(); openGoalDetail(${goal.id})">
                                👜 ${goal.pockets.length} bolsillo${goal.pockets.length !== 1 ? 's' : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="drag-handle" onclick="event.stopPropagation()">
                    <div class="drag-lines">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Agregar event listeners para drag and drop con long press
    setupDragAndDrop();
    
    console.log(`✅ UI actualizada con ${goals.length} metas`);
}

function updateTotals() {
    const totalsByCurrency = {};
    
    goals.forEach(goal => {
        if (!totalsByCurrency[goal.currency]) {
            totalsByCurrency[goal.currency] = 0;
        }
        totalsByCurrency[goal.currency] += goal.currentAmount;
    });
    
    const currenciesScroll = document.getElementById("currencies-scroll");
    if (!currenciesScroll) {
        console.error('❌ Contenedor de totales no encontrado');
        return;
    }
    
    if (Object.keys(totalsByCurrency).length === 0) {
        const t = translations[settings.language] || translations.es;
        currenciesScroll.innerHTML = `
            <div class="empty-totals">
                <p>${t['create-first-goal']}</p>
            </div>
        `;
        return;
    }
    
    const totalsHTML = Object.entries(totalsByCurrency).map(([currency, amount]) => {
        return `<div class="currency-total">
            <span class="currency-flag">${currencyInfo[currency]?.flag || '💰'}</span>
            <span class="currency-amount">${formatCurrency(amount, currency)}</span>
        </div>`;
    }).join('');
    
    currenciesScroll.innerHTML = totalsHTML;
    console.log('✅ Totales actualizados');
}

function formatCurrency(amount, currency) {
    try {
        const numberFormatter = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        const formattedNumber = numberFormatter.format(amount);
        const symbol = currencySymbols[currency] || currency;
        
        if (currency === 'EUR') {
            return `${formattedNumber}\u00A0${symbol}`;
        } else {
            return `${symbol}\u00A0${formattedNumber}`;
        }
    } catch (error) {
        return `${amount.toFixed(2)} ${currency}`;
    }
}

// ===== FUNCIONES DE DETALLE DE META =====
function openGoalDetail(goalId) {
    console.log('📊 Abriendo detalle de meta:', goalId);
    currentGoalId = goalId;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const modal = document.getElementById("goal-detail-modal");
    if (!modal) return;
    
    // Actualizar contenido del modal
    const nameElement = document.getElementById("detail-goal-name");
    const savedElement = document.getElementById("detail-saved-amount");
    const targetElement = document.getElementById("detail-target-amount");
    const t = translations[settings.language] || translations.es;
    
    if (nameElement) nameElement.textContent = goal.name;
    if (savedElement) savedElement.textContent = formatCurrency(goal.currentAmount, goal.currency);
    if (targetElement) targetElement.textContent = goal.targetAmount > 0 ? formatCurrency(goal.targetAmount, goal.currency) : t['no-limit'];
    
    // Actualizar imagen con formato más ancho
    const imageContainer = document.getElementById("detail-goal-image");
    if (imageContainer) {
        // Remover clase enlarged si existe
        imageContainer.classList.remove('enlarged');
        
        if (goal.image) {
            imageContainer.innerHTML = `<img src="${goal.image}" alt="${goal.name}">`;
            
            // Agregar evento de clic para zoom más ancho
            imageContainer.onclick = function() {
                imageContainer.classList.toggle('enlarged');
            };
        } else {
            imageContainer.innerHTML = `<div class="goal-icon">💰</div>`;
            imageContainer.onclick = null; // Remover evento si no hay imagen
        }
    }
    
    // Actualizar progreso
    if (goal.targetAmount > 0) {
        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
        
        const progressFill = document.getElementById("detail-progress-fill");
        const progressPercentage = document.getElementById("detail-progress-percentage");
        const remainingAmount = document.getElementById("detail-remaining-amount");
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressPercentage) progressPercentage.textContent = `${progress.toFixed(1)}%`;
        if (remainingAmount) remainingAmount.textContent = remaining > 0 ? `${t['remaining']} ${formatCurrency(remaining, goal.currency)}` : t['goal-reached'];
    }
    
    // Actualizar transacciones
    updateTransactionsList(goal);
    
    // Actualizar bolsillos
    updatePocketsGrid(goal);
    
    modal.style.display = "flex";
    
    // Dibujar el gráfico de evolución
    drawGoalChart(goal);
}

function closeGoalDetail() {
    const modal = document.getElementById("goal-detail-modal");
    if (modal) {
        modal.style.display = "none";
        currentGoalId = null;
    }
}

// ===== FUNCIONES DE DINERO (NOMBRES CORREGIDOS) =====
function showAddMoney() {
    console.log('💰 Abriendo agregar dinero...');
    currentMoneyAction = 'add';
    const titleElement = document.getElementById("money-modal-title");
    const t = translations[settings.language] || translations.es;
    if (titleElement) titleElement.textContent = t['add-money'];
    
    const amountInput = document.getElementById("money-amount");
    const noteInput = document.getElementById("money-note");
    if (amountInput) amountInput.value = "";
    if (noteInput) noteInput.value = "";
    
    const modal = document.getElementById("money-modal");
    if (modal) modal.style.display = "flex";
}

function showRemoveMoney() {
    console.log('💰 Abriendo quitar dinero...');
    currentMoneyAction = 'remove';
    const titleElement = document.getElementById("money-modal-title");
    const t = translations[settings.language] || translations.es;
    if (titleElement) titleElement.textContent = t['remove-money'];
    
    const amountInput = document.getElementById("money-amount");
    const noteInput = document.getElementById("money-note");
    if (amountInput) amountInput.value = "";
    if (noteInput) noteInput.value = "";
    
    const modal = document.getElementById("money-modal");
    if (modal) modal.style.display = "flex";
}

function closeMoneyModal() {
    const modal = document.getElementById("money-modal");
    if (modal) modal.style.display = "none";
    currentMoneyAction = null;
}

function saveMoneyTransaction() {
    const amountInput = document.getElementById("money-amount");
    const noteInput = document.getElementById("money-note");
    const t = translations[settings.language] || translations.es;
    
    if (!amountInput) return;
    
    const amount = parseFormattedNumber(amountInput.value);
    const note = noteInput ? noteInput.value.trim() : "";
    
    if (!amount || amount <= 0) {
        console.warn('⚠️ Cantidad válida requerida');
        return;
    }
    
    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal) return;
    
    const transaction = {
        id: Date.now(),
        amount: currentMoneyAction === 'add' ? amount : -amount,
        note: note || (currentMoneyAction === 'add' ? t['added'] : t['removed']),
        date: new Date().toISOString(),
        type: currentMoneyAction
    };
    
    // Actualizar cantidad actual
    if (currentMoneyAction === 'add') {
        goal.currentAmount += amount;
    } else {
        goal.currentAmount = Math.max(0, goal.currentAmount - amount);
    }
    
    // Agregar transacción
    if (!goal.transactions) goal.transactions = [];
    goal.transactions.unshift(transaction);
    
    // Guardar y actualizar UI
    saveToStorage();
    updateGoalsUI();
    updateTotals();
    
    // Actualizar modal de detalle si está abierto
    const detailModal = document.getElementById("goal-detail-modal");
    if (detailModal && detailModal.style.display === "flex") {
        openGoalDetail(currentGoalId);
    }
    
    closeMoneyModal();
    console.log(`✅ ${currentMoneyAction === 'add' ? t['added'] : t['removed']}: ${formatCurrency(amount, goal.currency)}`);
}

// ===== FUNCIONES DE EDICIÓN (NOMBRE CORREGIDO) =====
function openEditGoal() {
    console.log('✏️ Abriendo editar meta...');
    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal) return;
    
    const nameInput = document.getElementById("edit-goal-name");
    const amountInput = document.getElementById("edit-goal-amount");
    const currencySelect = document.getElementById("edit-goal-currency");
    const imagePreview = document.getElementById("edit-image-preview");
    
    if (nameInput) nameInput.value = goal.name;
    if (amountInput) amountInput.value = goal.targetAmount > 0 ? formatNumberToInputString(goal.targetAmount) : "";
    
    // Configurar select de monedas
    if (currencySelect) {
        currencySelect.innerHTML = Object.entries(currencyInfo).map(([code, info]) => 
            `<option value="${code}">${info.flag} ${code} - ${info.name}</option>`
        ).join('');
        currencySelect.value = goal.currency;
    }
    
    // Mostrar imagen actual o placeholder
    if (imagePreview) {
        if (goal.image) {
            imagePreview.innerHTML = `<img src="${goal.image}" alt="${goal.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else {
            imagePreview.innerHTML = `
                <div class="upload-placeholder">
                    <span class="upload-icon">📷</span>
                    <span>Toca para cambiar imagen</span>
                </div>
            `;
        }
    }
    
    const modal = document.getElementById("edit-goal-modal");
    if (modal) modal.style.display = "flex";
}

function closeEditGoal() {
    const modal = document.getElementById("edit-goal-modal");
    if (modal) modal.style.display = "none";
}

function saveEditGoal() {
    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal) return;
    
    const nameInput = document.getElementById("edit-goal-name");
    const amountInput = document.getElementById("edit-goal-amount");
    const currencySelect = document.getElementById("edit-goal-currency");
    const imageInput = document.getElementById("edit-goal-image");
    const t = translations[settings.language] || translations.es;
    
    if (!nameInput) return;
    
    const name = nameInput.value.trim();
    const amount = amountInput ? parseFormattedNumber(amountInput.value) || 0 : 0;
    const currency = currencySelect ? currencySelect.value : goal.currency;
    const imageFile = imageInput ? imageInput.files[0] : null;
    
    if (!name) {
        alert(t['enter-goal-name']);
        return;
    }
    
    // Función para actualizar la meta
    function updateGoal() {
        goal.name = name;
        goal.targetAmount = amount;
        goal.currency = currency;
        
        saveToStorage();
        updateGoalsUI();
        updateTotals();
        closeEditGoal();
        
        // Actualizar modal de detalle si está abierto
        const detailModal = document.getElementById("goal-detail-modal");
        if (detailModal && detailModal.style.display === "flex") {
            openGoalDetail(currentGoalId);
        }
        
        console.log('✅ Meta editada');
    }
    
    // Si hay una nueva imagen, procesarla
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            goal.image = e.target.result;
            updateGoal();
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Si no hay nueva imagen, mantener la actual
        updateGoal();
    }
}

// ===== FUNCIONES DE ELIMINACIÓN =====
function confirmDeleteGoal(goalId = currentGoalId) {
    console.log('🔍 Confirmando eliminación...');
    console.log('goalId recibido:', goalId);
    console.log('currentGoalId actual:', currentGoalId);
    
    if (!goalId) {
        console.error('❌ No se proporcionó goalId');
        return;
    }
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) {
        console.error('❌ No se encontró la meta con ID:', goalId);
        return;
    }
    
    console.log('Meta encontrada:', goal.name);
    currentGoalId = goalId;
    console.log('currentGoalId establecido a:', currentGoalId);
    
    const nameElement = document.getElementById("delete-goal-name");
    if (nameElement) nameElement.textContent = goal.name;
    
    const modal = document.getElementById("confirm-delete-modal");
    if (modal) {
        modal.style.display = "flex";
        console.log('✅ Modal de confirmación mostrado');
    } else {
        console.error('❌ No se encontró el modal de confirmación');
    }
}

function closeConfirmDelete() {
    const modal = document.getElementById("confirm-delete-modal");
    if (modal) modal.style.display = "none";
    currentGoalId = null;
}

function deleteGoal() {
    console.log('🗑️ Intentando eliminar meta...');
    console.log('currentGoalId:', currentGoalId);
    console.log('goals antes:', goals.length);
    
    if (!currentGoalId) {
        console.error('❌ No hay currentGoalId');
        return;
    }
    
    const goalIndex = goals.findIndex(g => g.id === currentGoalId);
    console.log('goalIndex encontrado:', goalIndex);
    
    if (goalIndex > -1) {
        const goalToDelete = goals[goalIndex];
        console.log('Meta a eliminar:', goalToDelete.name);
        
        goals.splice(goalIndex, 1);
        console.log('goals después:', goals.length);
        
        saveToStorage();
        updateGoalsUI();
        updateTotals();
        
        // Cerrar modales abiertos
        closeConfirmDelete();
        closeGoalDetail();
        
        console.log('✅ Meta eliminada exitosamente');
        
        // Eliminar el alert molesto
    } else {
        console.error('❌ No se encontró la meta con ID:', currentGoalId);
    }
}

// ===== FUNCIONES AUXILIARES =====
function formatDateHeader(dateString, locale = 'es') {
    const d = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const txYear = d.getFullYear();
    
    // Opciones de formateo
    const options = { day: 'numeric', month: 'long' };
    if (txYear !== currentYear) {
        options.year = 'numeric';
    }
    
    let formatted = '';
    try {
        const localeMap = {
            es: 'es-ES',
            en: 'en-US',
            pt: 'pt-BR',
            que: 'es-PE' // Fallback para Quechua en lo referente a la fecha del sistema local
        };
        const lang = localeMap[locale] || 'es-ES';
        formatted = d.toLocaleDateString(lang, options);
    } catch (e) {
        formatted = d.toLocaleDateString('es-ES', options);
    }
    
    return formatted.toUpperCase();
}

function updateTransactionsList(goal) {
    const container = document.getElementById("transactions-list");
    if (!container) return;
    const t = translations[settings.language] || translations.es;
    
    if (!goal.transactions || goal.transactions.length === 0) {
        container.innerHTML = '<p class="no-transactions">No hay transacciones aún</p>';
        return;
    }
    
    // Clonar y ordenar transacciones de más reciente a más antigua
    const sortedTx = [...goal.transactions].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Agrupar por día
    const groups = [];
    sortedTx.forEach(tx => {
        const txDate = new Date(tx.date);
        const groupKey = `${txDate.getFullYear()}-${txDate.getMonth() + 1}-${txDate.getDate()}`;
        
        let group = groups.find(g => g.key === groupKey);
        if (!group) {
            group = {
                key: groupKey,
                date: tx.date,
                transactions: []
            };
            groups.push(group);
        }
        group.transactions.push(tx);
    });
    
    // Generar el HTML
    let html = '';
    groups.forEach(group => {
        const headerText = formatDateHeader(group.date, settings.language);
        html += `<div class="transaction-group-header">${headerText}</div>`;
        
        group.transactions.forEach(transaction => {
            const time = new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isPositive = transaction.amount > 0;
            
            html += `
                <div class="transaction-item ${isPositive ? 'positive' : 'negative'}" data-tx-id="${transaction.id}">
                    <div class="transaction-info">
                        <span class="transaction-amount">${isPositive ? '+' : ''}${formatCurrency(Math.abs(transaction.amount), goal.currency)}</span>
                        <span class="transaction-note">${transaction.note || ''}</span>
                    </div>
                    <div class="transaction-date">
                        <span>${time}</span>
                    </div>
                    <div class="transaction-actions">
                        <button class="transaction-edit-btn" onclick="openEditTransactionModal(${goal.id}, ${transaction.id})" title="Editar">✏️</button>
                        <button class="transaction-delete-btn" onclick="confirmDeleteTransaction(${goal.id}, ${transaction.id})" title="Eliminar">🗑️</button>
                    </div>
                </div>
            `;
        });
    });
    
    container.innerHTML = html;
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("image-preview");
    
    if (file && preview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Meta" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
    }
}

// Función para manejar carga de imagen en modal de edición
function handleEditImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("edit-image-preview");
    
    if (file && preview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Meta" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
    }
}

// ===== EVENTOS GLOBALES =====
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// ===== BOLSILLOS (POCKETS) =====

const POCKET_EMOJIS = [
    '👜','💼','🎒','🛍️','👛','💰','🏦','🏧',
    '✈️','🏖️','🏠','🚗','📱','👗','👟','💄',
    '🍔','🎮','🎵','📚','🏋️','🎯','💊','🐶',
    '🌟','🎁','🎂','🌈','⚡','🔥','💎','🍀',
    '🏆','🚀','🌙','☀️','💝','🦋','🌺','🎨'
];

const POCKET_COLORS = [
    '#667eea','#f6a623','#4ecdc4','#ff6b6b','#a18cd1',
    '#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd',
    '#01abc5','#10ac84','#ee5a24','#c8d6e5','#8395a7',
    '#fd79a8','#e17055','#00b894','#6c5ce7','#fdcb6e'
];

let currentPocketAction = null; // 'add' | 'remove'
let currentPocketId = null;

// Render the pockets grid inside goal detail modal
function updatePocketsGrid(goal) {
    const grid = document.getElementById('pockets-grid');
    if (!grid) return;
    if (!goal.pockets) goal.pockets = [];

    if (goal.pockets.length === 0) {
        grid.innerHTML = `<div class="pockets-empty">Aún no tienes bolsillos. ¡Crea uno con el botón "Nuevo"!</div>`;
        return;
    }

    grid.innerHTML = goal.pockets.map(pocket => {
        const txCount = (pocket.transactions || []).length;
        return `
            <div class="pocket-card" style="--pocket-color: ${pocket.color || '#667eea'};" onclick="openPocketDetail('${pocket.id}')">
                <span class="pocket-card-emoji">${pocket.emoji || '👜'}</span>
                <div class="pocket-card-name">${pocket.name}</div>
                <span class="pocket-card-amount">${formatCurrency(pocket.amount || 0, goal.currency)}</span>
                <div class="pocket-card-tx-count">${txCount} movimiento${txCount !== 1 ? 's' : ''}</div>
            </div>
        `;
    }).join('');
}

// Open modal to create a new pocket
function openAddPocket() {
    const modal = document.getElementById('add-pocket-modal');
    if (!modal) return;

    // Reset form
    const nameInput = document.getElementById('pocket-name');
    if (nameInput) nameInput.value = '';

    // Fill emoji selector
    const emojiSelector = document.getElementById('pocket-emoji-selector');
    if (emojiSelector) {
        emojiSelector.innerHTML = POCKET_EMOJIS.map((em, i) => `
            <div class="pocket-emoji-option ${i === 0 ? 'selected' : ''}" onclick="selectPocketEmoji(this, '${em}')">${em}</div>
        `).join('');
        document.getElementById('pocket-emoji-selected').value = POCKET_EMOJIS[0];
    }

    // Fill color grid
    const colorGrid = document.getElementById('pocket-color-grid');
    if (colorGrid) {
        colorGrid.innerHTML = POCKET_COLORS.map((color, i) => `
            <div class="pocket-color-option ${i === 0 ? 'selected' : ''}" 
                 style="background:${color};" 
                 onclick="selectPocketColor(this, '${color}')"></div>
        `).join('');
        document.getElementById('pocket-color-selected').value = POCKET_COLORS[0];
    }

    modal.style.display = 'flex';
    setTimeout(() => { if (nameInput) nameInput.focus(); }, 100);
}

function closeAddPocket() {
    const modal = document.getElementById('add-pocket-modal');
    if (modal) modal.style.display = 'none';
}

function selectPocketEmoji(el, emoji) {
    document.querySelectorAll('#pocket-emoji-selector .pocket-emoji-option').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('pocket-emoji-selected').value = emoji;
}

function selectPocketColor(el, color) {
    document.querySelectorAll('#pocket-color-grid .pocket-color-option').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('pocket-color-selected').value = color;
}

function saveNewPocket() {
    const nameInput = document.getElementById('pocket-name');
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
        nameInput && nameInput.focus();
        return;
    }

    const emoji = document.getElementById('pocket-emoji-selected')?.value || '👜';
    const color = document.getElementById('pocket-color-selected')?.value || '#667eea';

    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal) return;

    if (!goal.pockets) goal.pockets = [];

    const newPocket = {
        id: 'pocket_' + Date.now(),
        name: name,
        emoji: emoji,
        color: color,
        amount: 0,
        transactions: [],
        createdAt: new Date().toISOString()
    };

    goal.pockets.push(newPocket);
    saveToStorage();
    updatePocketsGrid(goal);
    updateGoalsUI();
    closeAddPocket();
}

// Open pocket detail modal
function openPocketDetail(pocketId) {
    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal) return;
    if (!goal.pockets) goal.pockets = [];
    const pocket = goal.pockets.find(p => p.id === pocketId);
    if (!pocket) return;

    currentPocketId = pocketId;

    const modal = document.getElementById('pocket-detail-modal');
    if (!modal) return;

    // Set hero
    const titleEl = document.getElementById('pocket-detail-title');
    const emojiEl = document.getElementById('pocket-hero-emoji');
    const amountEl = document.getElementById('pocket-hero-amount');
    const heroEl   = document.getElementById('pocket-detail-hero');

    if (titleEl)  titleEl.textContent = pocket.name;
    if (emojiEl)  emojiEl.textContent = pocket.emoji || '👜';
    if (amountEl) amountEl.textContent = formatCurrency(pocket.amount || 0, goal.currency);
    if (heroEl)   heroEl.style.borderTop = `4px solid ${pocket.color || '#667eea'}`;

    // Set transactions
    updatePocketTransactionsList(pocket, goal.currency);

    modal.style.display = 'flex';
}

function closePocketDetail() {
    const modal = document.getElementById('pocket-detail-modal');
    if (modal) modal.style.display = 'none';
    currentPocketId = null;
}

function updatePocketTransactionsList(pocket, currency) {
    const container = document.getElementById('pocket-transactions-list');
    if (!container) return;
    if (!pocket.transactions || pocket.transactions.length === 0) {
        container.innerHTML = '<p class="no-transactions">No hay movimientos aún</p>';
        return;
    }

    const sorted = [...pocket.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    let html = '';
    sorted.forEach(tx => {
        const time = new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = new Date(tx.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const isPositive = tx.amount > 0;
        html += `
            <div class="transaction-item ${isPositive ? 'positive' : 'negative'}">
                <div class="transaction-info">
                    <span class="transaction-amount">${isPositive ? '+' : ''}${formatCurrency(Math.abs(tx.amount), currency)}</span>
                    <span class="transaction-note">${tx.note || ''}</span>
                </div>
                <div class="transaction-date">
                    <span>${dateStr} ${time}</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Add/Remove money to pocket
function showAddMoneyToPocket() {
    currentPocketAction = 'add';
    const titleEl = document.getElementById('pocket-money-modal-title');
    if (titleEl) titleEl.textContent = 'Agregar al bolsillo';
    const amountInput = document.getElementById('pocket-money-amount');
    const noteInput = document.getElementById('pocket-money-note');
    if (amountInput) amountInput.value = '';
    if (noteInput) noteInput.value = '';
    const modal = document.getElementById('pocket-money-modal');
    if (modal) modal.style.display = 'flex';
    setupNumberFormatting('pocket-money-amount');
    setTimeout(() => { if (amountInput) amountInput.focus(); }, 100);
}

function showRemoveMoneyFromPocket() {
    currentPocketAction = 'remove';
    const titleEl = document.getElementById('pocket-money-modal-title');
    if (titleEl) titleEl.textContent = 'Retirar del bolsillo';
    const amountInput = document.getElementById('pocket-money-amount');
    const noteInput = document.getElementById('pocket-money-note');
    if (amountInput) amountInput.value = '';
    if (noteInput) noteInput.value = '';
    const modal = document.getElementById('pocket-money-modal');
    if (modal) modal.style.display = 'flex';
    setupNumberFormatting('pocket-money-amount');
    setTimeout(() => { if (amountInput) amountInput.focus(); }, 100);
}

function closePocketMoneyModal() {
    const modal = document.getElementById('pocket-money-modal');
    if (modal) modal.style.display = 'none';
    currentPocketAction = null;
}

function savePocketMoneyTransaction() {
    const amountInput = document.getElementById('pocket-money-amount');
    const noteInput = document.getElementById('pocket-money-note');
    if (!amountInput) return;

    const amount = parseFormattedNumber(amountInput.value);
    if (!amount || amount <= 0) return;

    const note = noteInput ? noteInput.value.trim() : '';
    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal || !goal.pockets) return;
    const pocket = goal.pockets.find(p => p.id === currentPocketId);
    if (!pocket) return;

    const tx = {
        id: Date.now(),
        amount: currentPocketAction === 'add' ? amount : -amount,
        note: note || (currentPocketAction === 'add' ? 'Agregado' : 'Retirado'),
        date: new Date().toISOString(),
        type: currentPocketAction
    };

    if (!pocket.transactions) pocket.transactions = [];
    pocket.transactions.unshift(tx);

    if (currentPocketAction === 'add') {
        pocket.amount = (pocket.amount || 0) + amount;
    } else {
        pocket.amount = Math.max(0, (pocket.amount || 0) - amount);
    }

    saveToStorage();
    closePocketMoneyModal();

    // Refresh pocket detail modal
    const heroAmount = document.getElementById('pocket-hero-amount');
    if (heroAmount) heroAmount.textContent = formatCurrency(pocket.amount, goal.currency);
    updatePocketTransactionsList(pocket, goal.currency);

    // Also update the pockets grid in goal detail
    updatePocketsGrid(goal);
    // And refresh goal card badges
    updateGoalsUI();
}

// Delete pocket
function confirmDeletePocket() {
    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal || !goal.pockets) return;
    const pocket = goal.pockets.find(p => p.id === currentPocketId);
    if (!pocket) return;

    const label = document.getElementById('delete-pocket-name-label');
    if (label) label.textContent = `"${pocket.name}"`;

    const modal = document.getElementById('confirm-delete-pocket-modal');
    if (modal) modal.style.display = 'flex';
}

function closeConfirmDeletePocket() {
    const modal = document.getElementById('confirm-delete-pocket-modal');
    if (modal) modal.style.display = 'none';
}

function executeDeletePocket() {
    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal || !goal.pockets) return;
    goal.pockets = goal.pockets.filter(p => p.id !== currentPocketId);

    saveToStorage();
    updatePocketsGrid(goal);
    updateGoalsUI();
    closeConfirmDeletePocket();
    closePocketDetail();
}





// ===== FUNCIONES DE EXPORTACIÓN E IMPORTACIÓN =====
function exportData() {
    const data = {
        goals: goals,
        settings: settings,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `metas-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
}

function importData() {
    const fileInput = document.getElementById('import-file');
    fileInput.click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar que sea un archivo JSON
    if (!file.name.toLowerCase().endsWith('.json')) {
        alert('Error: Por favor seleccione un archivo JSON válido (.json)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Verificar que el contenido no esté vacío
            const content = e.target.result;
            if (!content || content.trim() === '') {
                alert('Error: El archivo está vacío.');
                return;
            }
            
            // Intentar parsear el JSON
            const data = JSON.parse(content);
            
            // Verificar que el JSON tenga la estructura esperada
            if (!data || typeof data !== 'object') {
                alert('Error: El archivo no contiene datos válidos.');
                return;
            }
            
            // Validar estructura del backup
            let hasValidData = false;
            
            if (data.goals && Array.isArray(data.goals)) {
                // Validar que las metas tengan la estructura correcta
                const validGoals = data.goals.every(goal => 
                    goal && 
                    typeof goal === 'object' && 
                    typeof goal.id === 'number' && 
                    typeof goal.name === 'string'
                );
                
                if (validGoals) {
                    goals = data.goals;
                    localStorage.setItem('miAhorroMetas', JSON.stringify(goals));
                    hasValidData = true;
                }
            }
            
            if (data.settings && typeof data.settings === 'object') {
                // Validar configuraciones básicas
                if (data.settings.language || data.settings.currency) {
                    settings = { ...settings, ...data.settings };
                    localStorage.setItem('miAhorroSettings', JSON.stringify(settings));
                    updateUILanguage();
                    hasValidData = true;
                }
            }
            
            if (!hasValidData) {
                alert('Error: El archivo no contiene datos de respaldo válidos.');
                return;
            }
            
            updateGoalsUI();
            updateTotals();
            
            const t = translations[settings.language] || translations.es;
            alert(t['import'] + ' completado exitosamente');
            
        } catch (error) {
            console.error('Error al importar:', error);
            
            // Mensajes de error más específicos
            let errorMessage = 'Error al importar el archivo. ';
            
            if (error instanceof SyntaxError) {
                errorMessage += 'El archivo no es un JSON válido. Verifique que el archivo no esté corrupto.';
            } else {
                errorMessage += 'Verifique que sea un archivo de respaldo válido de la aplicación.';
            }
            
            alert(errorMessage);
        } finally {
            // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
            event.target.value = '';
        }
    };
    
    reader.onerror = function() {
        alert('Error: No se pudo leer el archivo. Intente nuevamente.');
    };
    
    reader.readAsText(file);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando aplicación...');
    loadFromStorage();
    processAutomations();
    updateGoalsUI();
    updateTotals();
    updateUILanguage(); // Actualizar la interfaz con el idioma guardado
    
    // Configurar formateo de números para todos los inputs de cantidad
    setupNumberFormatting('goal-amount');
    setupNumberFormatting('money-amount');
    setupNumberFormatting('edit-goal-amount');
    setupNumberFormatting('automation-amount');
    setupNumberFormatting('transfer-amount');
    setupNumberFormatting('transfer-dest-amount');
    setupNumberFormatting('edit-tx-amount');
    
    // Configurar drag and drop después de cargar las metas
    setupDragAndDrop();
    
    // Configurar botones de exportación e importación
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-btn').addEventListener('click', importData);
    document.getElementById('import-file').addEventListener('change', handleFileImport);
    
    console.log('✅ Aplicación inicializada correctamente');
});

// ===== DRAG AND DROP - GHOST CLONE (ZERO LAG MÓVIL) =====
// Variables globales para drag and drop
let draggedElement = null;   // tarjeta original (placeholder invisible)
let dragGhost = null;        // clon flotante que sigue el dedo
let startY = 0;
let currentY = 0;
let initialIndex = -1;
let targetDropIndex = -1;    // índice donde soltar (calculado en move)
let isDragging = false;
let touchTimeout = null;
let isLongPress = false;
let isTicking = false;
let cardSnapPoints = [];     // centros Y de cada tarjeta (calculado 1 vez al iniciar)

function setupDragAndDrop() {
    const goalCards = document.querySelectorAll('.goal-card');

    goalCards.forEach((card) => {
        const dragHandle = card.querySelector('.drag-handle');
        if (!dragHandle) return;

        // Limpiar listeners anteriores clonando el nodo
        dragHandle.replaceWith(dragHandle.cloneNode(true));
        const newHandle = card.querySelector('.drag-handle');

        newHandle.addEventListener('touchstart', (e) => onDragStart(e, card, 'touch'), { passive: false });
        newHandle.addEventListener('mousedown',  (e) => onDragStart(e, card, 'mouse'), { passive: false });
        newHandle.addEventListener('dragstart',  (e) => e.preventDefault());
    });
}

function onDragStart(e, card, inputType) {
    e.preventDefault();
    e.stopPropagation();

    const handle = card.querySelector('.drag-handle');
    handle.classList.add('pressing');

    const clientY = inputType === 'touch' ? e.touches[0].clientY : e.clientY;
    startY = clientY;
    currentY = clientY;
    isLongPress = false;

    // Activar drag tras mantener presionado 300ms
    touchTimeout = setTimeout(() => {
        isLongPress = true;
        handle.classList.remove('pressing');
        handle.classList.add('drag-active');

        if (navigator.vibrate) navigator.vibrate(40);

        activateGhostDrag(card, inputType);
    }, 300);

    // Cancelar si el dedo se mueve antes del long press
    const abortMove = (ev) => {
        const y = inputType === 'touch' ? (ev.touches?.[0]?.clientY ?? currentY) : ev.clientY;
        if (Math.abs(y - startY) > 8) abort();
    };
    const abortUp = () => abort();

    const moveEvt = inputType === 'touch' ? 'touchmove' : 'mousemove';
    const upEvt   = inputType === 'touch' ? 'touchend'  : 'mouseup';

    document.addEventListener(moveEvt, abortMove, { passive: true });
    document.addEventListener(upEvt,   abortUp,   { once: true });

    function abort() {
        clearTimeout(touchTimeout);
        handle.classList.remove('pressing', 'drag-active');
        document.removeEventListener(moveEvt, abortMove);
        document.removeEventListener(upEvt,   abortUp);
    }
}

function activateGhostDrag(card, inputType) {
    isDragging = true;
    draggedElement = card;
    initialIndex = parseInt(card.dataset.index);
    targetDropIndex = initialIndex;

    // ── 1. Calcular snap points (centros Y de cada tarjeta) ──
    // Solo se hace UNA VEZ al iniciar el drag — cero getBoundingClientRect durante el move
    const allCards = Array.from(document.querySelectorAll('.goal-card'));
    cardSnapPoints = allCards.map((c) => {
        const r = c.getBoundingClientRect();
        return { element: c, centerY: r.top + r.height / 2, height: r.height };
    });

    // ── 2. Crear clon flotante (ghost) ──
    const rect = card.getBoundingClientRect();
    dragGhost = card.cloneNode(true);
    dragGhost.style.cssText = `
        position: fixed;
        left: ${rect.left}px;
        top: ${rect.top}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        margin: 0;
        z-index: 9999;
        pointer-events: none;
        opacity: 0.92;
        box-shadow: 0 16px 48px rgba(0,0,0,0.45);
        border-radius: 16px;
        transform: scale(1.03);
        transition: none;
        will-change: transform;
    `;
    document.body.appendChild(dragGhost);

    // ── 3. Ocultar tarjeta original como placeholder ──
    card.style.opacity = '0';
    card.style.pointerEvents = 'none';

    // ── 4. Registrar eventos de movimiento y soltar ──
    if (inputType === 'touch') {
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend',  onDragEnd,  { once: true });
        document.addEventListener('touchcancel', onDragEnd, { once: true });
    } else {
        document.addEventListener('mousemove', onDragMove, { passive: false });
        document.addEventListener('mouseup',   onDragEnd,  { once: true });
    }
}

function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    // Throttle con rAF — solo 1 actualización visual por frame
    if (!isTicking) {
        requestAnimationFrame(renderDragFrame);
        isTicking = true;
    }
}

function renderDragFrame() {
    isTicking = false;
    if (!isDragging || !dragGhost) return;

    // Mover el ghost — SOLO CSS transform, cero layout
    const deltaY = currentY - startY;
    dragGhost.style.transform = `translateY(${deltaY}px) scale(1.03)`;

    // Calcular a qué slot apunta el dedo (usando centros pre-cacheados)
    const ghostCenterY = currentY;
    let closest = initialIndex;
    let minDist = Infinity;
    cardSnapPoints.forEach((snap, idx) => {
        const dist = Math.abs(ghostCenterY - snap.centerY);
        if (dist < minDist) {
            minDist = dist;
            closest = idx;
        }
    });
    targetDropIndex = closest;

    // Mostrar indicador visual en tarjetas (desplazamiento suave con CSS)
    cardSnapPoints.forEach((snap, idx) => {
        if (snap.element === draggedElement) return;
        if (idx >= Math.min(initialIndex, targetDropIndex) && idx <= Math.max(initialIndex, targetDropIndex)) {
            const shift = initialIndex < targetDropIndex ? -snap.height - 16 : snap.height + 16;
            snap.element.style.transition = 'transform 0.18s ease';
            snap.element.style.transform = `translateY(${shift}px)`;
        } else {
            snap.element.style.transition = 'transform 0.18s ease';
            snap.element.style.transform = '';
        }
    });
}

function onDragEnd(e) {
    if (!isDragging) return;

    // ── Limpiar listeners ──
    document.removeEventListener('touchmove',   onDragMove);
    document.removeEventListener('mousemove',   onDragMove);
    document.removeEventListener('touchend',    onDragEnd);
    document.removeEventListener('touchcancel', onDragEnd);
    document.removeEventListener('mouseup',     onDragEnd);

    // ── Eliminar ghost ──
    if (dragGhost) {
        dragGhost.remove();
        dragGhost = null;
    }

    // ── Restaurar estilos de todas las tarjetas ──
    cardSnapPoints.forEach((snap) => {
        snap.element.style.transition = '';
        snap.element.style.transform  = '';
    });

    if (draggedElement) {
        draggedElement.style.opacity = '';
        draggedElement.style.pointerEvents = '';
        const handle = draggedElement.querySelector('.drag-handle');
        if (handle) handle.classList.remove('pressing', 'drag-active');
    }

    // ── Reordenar array y DOM (solo 1 vez al soltar) ──
    if (targetDropIndex !== initialIndex && targetDropIndex !== -1) {
        const goal = goals.splice(initialIndex, 1)[0];
        goals.splice(targetDropIndex, 0, goal);
        if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
        saveToStorage();
        updateGoalsUI();
    }

    // ── Reset ──
    draggedElement = null;
    isDragging = false;
    isLongPress = false;
    isTicking = false;
    startY = 0;
    currentY = 0;
    initialIndex = -1;
    targetDropIndex = -1;
    cardSnapPoints = [];
}

function moveGoal(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= goals.length || fromIndex === toIndex) return;
    const goal = goals.splice(fromIndex, 1)[0];
    goals.splice(toIndex, 0, goal);
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    saveToStorage();
    updateGoalsUI();
}



// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js?v=3')
            .then((registration) => {
                console.log('SW registered: ', registration);
                
                // Verificar actualizaciones
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nueva versión disponible
                            if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Detectar si la app está instalada
let deferredPrompt;
let isAppInstalled = false;

// Verificar si ya está instalada
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    isAppInstalled = true;
}

// Manejar el evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt disparado');
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar botón de instalación si no está instalada
    if (!isAppInstalled) {
        showInstallButton();
    }
});

// Función para mostrar botón de instalación
function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.textContent = '📱 Instalar App';
    installButton.className = 'install-btn';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        padding: 12px 16px;
        border-radius: 25px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    installButton.addEventListener('click', installApp);
    document.body.appendChild(installButton);
    
    // Ocultar después de 10 segundos
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.remove();
        }
    }, 10000);
}

// Función para instalar la app
async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Resultado de instalación: ${outcome}`);
        deferredPrompt = null;
        
        // Remover botón de instalación
        const installBtn = document.querySelector('.install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }
}

// Detectar cuando la app se instala
window.addEventListener('appinstalled', (evt) => {
    console.log('App instalada exitosamente');
    isAppInstalled = true;
    
    // Remover botón de instalación si existe
    const installBtn = document.querySelector('.install-btn');
    if (installBtn) {
        installBtn.remove();
    }
});

// Manejar cambios de conectividad
window.addEventListener('online', () => {
    console.log('Conexión restaurada');
    // Opcional: mostrar notificación de conexión restaurada
});

window.addEventListener('offline', () => {
    console.log('Sin conexión - modo offline');
    // Opcional: mostrar notificación de modo offline
});

// Prevenir zoom en doble tap en iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Manejar orientación de pantalla
function handleOrientationChange() {
    // Pequeño delay para que el navegador termine de cambiar la orientación
    setTimeout(() => {
        // Forzar recálculo de altura de viewport
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
}

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);

// Configurar altura de viewport inicial
handleOrientationChange();

console.log('🎯 Script cargado correctamente - Versión PWA Mejorada');

// Función para obtener traducción
function t(key) {
    return translations[settings.language]?.[key] || translations.es[key] || key;
}

// Función para actualizar toda la interfaz con traducciones
function updateUILanguage() {
    // Actualizar título de la página
    document.title = t('app-title');
    
    // Header
    const headerTitle = document.querySelector('.header-left h1');
    if (headerTitle) headerTitle.textContent = t('total-savings');
    
    // Sección de totales
    const totalSavedTitle = document.querySelector('.totals-section h2');
    if (totalSavedTitle) totalSavedTitle.textContent = t('total-saved');
    
    const emptyTotals = document.querySelector('.empty-totals p');
    if (emptyTotals) emptyTotals.textContent = t('create-first-goal');
    
    // Sección de metas
    const myGoalsTitle = document.querySelector('.section-header h2');
    if (myGoalsTitle) myGoalsTitle.textContent = t('my-goals');
    
    // Modal de configuración
    updateSettingsModal();
    
    // Modal de nueva meta
    updateNewGoalModal();
    
    // Modal de detalle
    updateGoalDetailModal();
    
    // Modal de dinero
    updateMoneyModal();
    
    // Modal de editar
    updateEditGoalModal();
    
    // Modal de confirmación
    updateConfirmDeleteModal();
}

function updateSettingsModal() {
    const settingsTitle = document.querySelector('#settings-modal .modal-title');
    if (settingsTitle) settingsTitle.textContent = t('settings');
    
    const languageLabel = document.querySelector('#settings-modal h4');
    if (languageLabel) languageLabel.textContent = t('language');
    
    const currencyLabel = document.querySelectorAll('#settings-modal h4')[1];
    if (currencyLabel) currencyLabel.textContent = t('main-currency');
    
    const cancelBtn = document.querySelector('#settings-modal .btn-secondary');
    if (cancelBtn) cancelBtn.textContent = t('cancel');
    
    const saveBtn = document.querySelector('#settings-modal .btn-primary');
    if (saveBtn) saveBtn.textContent = t('save-changes');
}

function updateNewGoalModal() {
    const newGoalTitle = document.querySelector('#add-goal-modal .modal-title');
    if (newGoalTitle) newGoalTitle.textContent = t('new-goal');
    
    const goalNameLabel = document.querySelector('label[for="goal-name"]');
    if (goalNameLabel) goalNameLabel.textContent = t('goal-name');
    
    const goalNameInput = document.getElementById('goal-name');
    if (goalNameInput) goalNameInput.placeholder = t('goal-name-placeholder');
    
    const goalAmountLabel = document.querySelector('label[for="goal-amount"]');
    if (goalAmountLabel) goalAmountLabel.textContent = t('target-amount');
    
    const currencyLabel = document.querySelector('label[for="goal-currency"]');
    if (currencyLabel) currencyLabel.textContent = t('currency');
    
    const imageLabel = document.querySelector('#add-goal-modal .form-group:last-of-type label');
    if (imageLabel) imageLabel.textContent = t('image-optional');
    
    const uploadText = document.querySelector('#add-goal-modal .upload-placeholder span:last-child');
    if (uploadText) uploadText.textContent = t('tap-add-image');
    
    const cancelBtn = document.querySelector('#add-goal-modal .btn-secondary');
    if (cancelBtn) cancelBtn.textContent = t('cancel');
    
    const saveBtn = document.querySelector('#add-goal-modal .btn-primary');
    if (saveBtn) saveBtn.textContent = t('save-goal');
}

function updateGoalDetailModal() {
    const detailTitle = document.querySelector('#goal-detail-modal .modal-title');
    if (detailTitle) detailTitle.textContent = t('goal-detail');
    
    const savedLabel = document.querySelector('.amount-box .amount-label');
    if (savedLabel) savedLabel.textContent = t('saved');
    
    const targetLabel = document.querySelectorAll('.amount-box .amount-label')[1];
    if (targetLabel) targetLabel.textContent = t('target');
    
    const addBtn = document.querySelector('.btn-add');
    if (addBtn) addBtn.textContent = t('add');
    
    const removeBtn = document.querySelector('.btn-remove');
    if (removeBtn) removeBtn.textContent = t('remove');
    
    const editBtn = document.querySelector('.btn-edit');
    if (editBtn) editBtn.textContent = t('edit');
    
    const historyTitle = document.querySelector('.transactions-section h4');
    if (historyTitle) historyTitle.textContent = t('transaction-history');
    
    const chartTitle = document.querySelector('#goal-detail-modal [data-translate="chart-title"]');
    if (chartTitle) chartTitle.textContent = t('chart-title');
}

function updateMoneyModal() {
    const amountLabel = document.querySelector('label[for="money-amount"]');
    if (amountLabel) amountLabel.textContent = t('amount');
    
    const noteLabel = document.querySelector('label[for="money-note"]');
    if (noteLabel) noteLabel.textContent = t('note-optional');
    
    const noteInput = document.getElementById('money-note');
    if (noteInput) noteInput.placeholder = t('note-placeholder');
    
    const cancelBtn = document.querySelector('#money-modal .btn-secondary');
    if (cancelBtn) cancelBtn.textContent = t('cancel');
    
    const confirmBtn = document.querySelector('#money-modal .btn-primary');
    if (confirmBtn) confirmBtn.textContent = t('confirm');
}

function updateEditGoalModal() {
    const editTitle = document.querySelector('#edit-goal-modal .modal-title');
    if (editTitle) editTitle.textContent = t('edit-goal');
    
    const nameLabel = document.querySelector('label[for="edit-goal-name"]');
    if (nameLabel) nameLabel.textContent = t('goal-name-edit');
    
    const amountLabel = document.querySelector('label[for="edit-goal-amount"]');
    if (amountLabel) amountLabel.textContent = t('target-amount-edit');
    
    const currencyLabel = document.querySelector('label[for="edit-goal-currency"]');
    if (currencyLabel) currencyLabel.textContent = t('currency');
    
    const imageLabel = document.querySelector('#edit-goal-modal .form-group:last-of-type label');
    if (imageLabel) imageLabel.textContent = t('image');
    
    const uploadText = document.querySelector('#edit-goal-modal .upload-placeholder span:last-child');
    if (uploadText) uploadText.textContent = t('tap-change-image');
    
    const cancelBtn = document.querySelector('#edit-goal-modal .btn-secondary');
    if (cancelBtn) cancelBtn.textContent = t('cancel');
    
    const saveBtn = document.querySelector('#edit-goal-modal .btn-primary');
    if (saveBtn) saveBtn.textContent = t('save');
}

function updateConfirmDeleteModal() {
    const deleteTitle = document.querySelector('#confirm-delete-modal .modal-title');
    if (deleteTitle) deleteTitle.textContent = t('confirm-delete');
    
    const confirmText = document.querySelector('#confirm-delete-modal p:first-of-type');
    if (confirmText) confirmText.textContent = t('delete-confirmation');
    
    const undoableText = document.querySelector('#confirm-delete-modal p:last-of-type strong');
    if (undoableText) undoableText.textContent = t('action-undoable');
    
    const deleteBtn = document.querySelector('#confirm-delete-modal .btn-danger');
    if (deleteBtn) deleteBtn.textContent = t('delete');
}

// ===== FUNCION DE DIBUJADO DE GRAFICO SVG =====
function drawGoalChart(goal) {
    const container = document.getElementById("chart-container");
    if (!container) return;
    
    // Limpiar contenedor
    container.innerHTML = "";
    
    // Si no hay transacciones, mostrar mensaje de vacío
    if (!goal.transactions || goal.transactions.length === 0) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "chart-empty";
        emptyDiv.textContent = t('chart-empty');
        container.appendChild(emptyDiv);
        return;
    }
    
    // Dimensiones internas del viewBox (independientes del tamaño de pantalla)
    const svgWidth = 300;
    const svgHeight = 140;
    
    const paddingLeft = 50;
    const paddingRight = 15;
    const paddingTop = 25;
    const paddingBottom = 15;
    
    const drawWidth = svgWidth - paddingLeft - paddingRight;
    const drawHeight = svgHeight - paddingTop - paddingBottom;
    
    // Reconstruir historial cronológico de balances
    const sortedTx = [...goal.transactions].sort((a, b) => {
        const dateA = new Date(a.date || a.id).getTime();
        const dateB = new Date(b.date || b.id).getTime();
        return dateA - dateB;
    });
    
    const points = [];
    const createdTime = new Date(goal.createdAt).getTime();
    
    // Punto inicial: creación de la meta
    points.push({
        time: createdTime,
        balance: 0,
        dateStr: new Date(goal.createdAt).toLocaleDateString(),
        note: ""
    });
    
    let currentBalance = 0;
    sortedTx.forEach(tx => {
        currentBalance += tx.amount;
        if (currentBalance < 0) currentBalance = 0;
        
        points.push({
            time: new Date(tx.date || tx.id).getTime(),
            balance: currentBalance,
            dateStr: new Date(tx.date || tx.id).toLocaleDateString(),
            note: tx.note || ""
        });
    });
    
    // Obtener balance máximo para el eje Y
    const balances = points.map(p => p.balance);
    let maxBalance = Math.max(...balances);
    
    // Refinar escala del eje Y para evitar exageraciones (mínimo de 100 de escala base si no hay objetivo)
    let maxScaleVal = goal.targetAmount > 0 ? Math.max(maxBalance, goal.targetAmount) : Math.max(100, maxBalance);
    
    // Escala final (por seguridad de no división por cero)
    if (maxScaleVal <= 0) maxScaleVal = 100;
    
    // Calcular coordenadas SVG Y para cada punto
    points.forEach(p => {
        p.y = paddingTop + (1 - (p.balance / maxScaleVal)) * drawHeight;
    });
    
    // Crear elemento SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("class", "chart-svg");
    
    // Definiciones (gradientes y estilos hover para las barras)
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--success-color)" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="var(--success-color)" stop-opacity="0.05"/>
        </linearGradient>
        <linearGradient id="chart-grad-neg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--danger-color)" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="var(--danger-color)" stop-opacity="0.05"/>
        </linearGradient>
        <style>
            .chart-bar {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
            }
            .chart-bar:hover, .chart-bar.active {
                filter: brightness(1.2);
                stroke-width: 2.2 !important;
            }
        </style>
    `;
    svg.appendChild(defs);
    
    // 1. Dibujar líneas de cuadrícula horizontales (0%, 50%, 100%)
    const gridYPositions = [paddingTop, paddingTop + drawHeight / 2, paddingTop + drawHeight];
    const gridValues = [maxScaleVal, maxScaleVal / 2, 0];
    
    gridYPositions.forEach((y, idx) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", paddingLeft);
        line.setAttribute("y1", y);
        line.setAttribute("x2", svgWidth - paddingRight);
        line.setAttribute("y2", y);
        line.setAttribute("class", "chart-grid-line");
        svg.appendChild(line);
        
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", paddingLeft - 8);
        label.setAttribute("y", y);
        label.setAttribute("class", "chart-label");
        label.setAttribute("text-anchor", "end");
        label.setAttribute("alignment-baseline", "middle");
        label.textContent = formatCurrency(gridValues[idx], goal.currency);
        svg.appendChild(label);
    });
    
    // 2. Dibujar línea de meta (Target) si existe
    if (goal.targetAmount > 0) {
        const targetY = paddingTop + (1 - (goal.targetAmount / maxScaleVal)) * drawHeight;
        
        const targetLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        targetLine.setAttribute("x1", paddingLeft);
        targetLine.setAttribute("y1", targetY);
        targetLine.setAttribute("x2", svgWidth - paddingRight);
        targetLine.setAttribute("y2", targetY);
        targetLine.setAttribute("stroke", "var(--primary-color)");
        targetLine.setAttribute("stroke-width", "1");
        targetLine.setAttribute("stroke-dasharray", "3 3");
        svg.appendChild(targetLine);
        
        const targetLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        targetLabel.setAttribute("x", svgWidth - paddingRight);
        targetLabel.setAttribute("y", targetY - 4);
        targetLabel.setAttribute("class", "chart-label");
        targetLabel.setAttribute("text-anchor", "end");
        targetLabel.setAttribute("fill", "var(--primary-color)");
        targetLabel.textContent = t('target');
        svg.appendChild(targetLabel);
    }
    
    // 3. Dibujar la etiqueta de tooltip/detalles fija arriba al centro
    const tooltipText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tooltipText.setAttribute("x", svgWidth / 2);
    tooltipText.setAttribute("y", 12);
    tooltipText.setAttribute("class", "chart-label");
    tooltipText.setAttribute("text-anchor", "middle");
    tooltipText.setAttribute("font-weight", "700");
    tooltipText.setAttribute("fill", "var(--text-primary)");
    tooltipText.textContent = t('chart-tooltip-placeholder');
    svg.appendChild(tooltipText);
    
    // Función para restablecer el tooltip
    const resetTooltip = () => {
        const bars = svg.querySelectorAll(".chart-bar");
        bars.forEach(b => {
            b.classList.remove("active");
            b.setAttribute("stroke-width", "1");
        });
        tooltipText.textContent = t('chart-tooltip-placeholder');
        tooltipText.setAttribute("fill", "var(--text-primary)");
    };
    
    // 4. Dibujar los gráficos de barra (columnas redondeadas)
    const numPoints = points.length;
    const spacing = numPoints > 1 ? drawWidth / (numPoints - 1) : drawWidth;
    const barWidth = Math.max(6, Math.min(22, (drawWidth / numPoints) - 4));
    
    points.forEach((p, idx) => {
        // El primer punto es la creación con balance 0
        const barHeight = (paddingTop + drawHeight) - p.y;
        if (barHeight <= 0) return; // No dibujar barras de altura cero
        
        const barX = paddingLeft + idx * spacing - barWidth / 2;
        const barY = p.y;
        
        // Determinar si la barra representa una bajada respecto a la anterior
        const isColNegative = idx > 0 && p.balance < points[idx - 1].balance;
        const colFill = isColNegative ? "url(#chart-grad-neg)" : "url(#chart-grad)";
        const colStroke = isColNegative ? "var(--danger-color)" : "var(--success-color)";
        
        // Radio de redondeado para esquinas superiores (máximo la mitad del ancho de la barra o la altura de la misma)
        const r = Math.min(4, barWidth / 2, barHeight);
        
        // Generar path de la columna con esquinas superiores redondeadas y base plana
        const pathD = `
            M ${barX} ${barY + barHeight}
            V ${barY + r}
            A ${r} ${r} 0 0 1 ${barX + r} ${barY}
            H ${barX + barWidth - r}
            A ${r} ${r} 0 0 1 ${barX + barWidth} ${barY + r}
            V ${barY + barHeight}
            Z
        `.trim();
        
        const barPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        barPath.setAttribute("d", pathD);
        barPath.setAttribute("fill", colFill);
        barPath.setAttribute("stroke", colStroke);
        barPath.setAttribute("stroke-width", "1");
        barPath.setAttribute("class", "chart-bar");
        
        // Interacción táctil y hover
        const showDetails = () => {
            const bars = svg.querySelectorAll(".chart-bar");
            bars.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("stroke-width", "1");
            });
            
            barPath.classList.add("active");
            barPath.setAttribute("stroke-width", "2.2");
            
            let detail = `${formatCurrency(p.balance, goal.currency)} • ${p.dateStr}`;
            if (p.note) {
                detail += ` (${p.note})`;
            }
            tooltipText.textContent = detail;
            tooltipText.setAttribute("fill", isColNegative ? "var(--danger-color)" : "var(--success-color)");
        };
        
        barPath.addEventListener("mouseenter", showDetails);
        barPath.addEventListener("touchstart", (e) => {
            e.preventDefault();
            showDetails();
        });
        
        svg.appendChild(barPath);
    });
    
    // Restablecer al hacer clic/tocar fuera
    svg.addEventListener("click", (e) => {
        if (!e.target.classList.contains("chart-bar")) {
            resetTooltip();
        }
    });
    svg.addEventListener("touchstart", (e) => {
        if (!e.target.classList.contains("chart-bar")) {
            resetTooltip();
        }
    }, { passive: true });
    
    container.appendChild(svg);
    console.log("📊 Gráfico de barras renderizado correctamente");
}

// ===== LOGICA DE AUTOMATIZACION =====

let currentAutomationAction = 'add'; // 'add' o 'remove'
let pendingNoteChangeRule = null;
let pendingNoteChangeData = null;

// Cargar y guardar en storage
function loadAutomationsFromStorage() {
    // Las automatizaciones se cargan de forma consolidada en loadFromStorage()
    console.log('ℹ️ Automatizaciones cargadas y aisladas por perfil.');
}

function mergeCurrentProfileAutomations() {
    allAutomations = allAutomations.filter(a => a.profileId !== currentProfileId);
    automations.forEach(a => a.profileId = currentProfileId);
    allAutomations = allAutomations.concat(automations);
}

function saveAutomationsToStorage() {
    try {
        mergeCurrentProfileAutomations();
        localStorage.setItem("miAhorroAutomations", JSON.stringify(allAutomations));
        console.log('✅ Automatizaciones guardadas');
    } catch (error) {
        console.error('❌ Error guardando automatizaciones:', error);
    }
}

// Fechas y cálculos de ejecución
function calculateFirstRunDate(frequency) {
    const now = new Date();
    const firstRun = new Date(now);
    // Programado justo después de las 1:00 AM (ej. 1:00:05 AM)
    firstRun.setHours(1, 0, 5, 0);
    
    // Si ya pasó la 1:00 AM de hoy, la primera ejecución es mañana
    if (now.getHours() >= 1) {
        firstRun.setDate(firstRun.getDate() + 1);
    }
    return firstRun.toISOString();
}

function calculateNextRunDate(fromDate, frequency) {
    const date = new Date(fromDate);
    date.setHours(1, 0, 5, 0); // Asegurar hora
    
    switch (frequency) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
    }
    return date.toISOString();
}

// Procesamiento de automatizaciones en segundo plano
function processAutomations() {
    const now = new Date();
    let updated = false;
    
    console.log('⏰ Procesando reglas de automatización...');
    
    automations.forEach(rule => {
        let nextRunDate = new Date(rule.nextRun);
        const goal = goals.find(g => g.id === Number(rule.goalId));
        
        if (!goal) {
            console.warn(`⚠️ Meta vinculada ${rule.goalId} no encontrada para la regla ${rule.note}`);
            return;
        }
        
        // Ejecutar todos los ciclos pendientes transcurridos
        while (now >= nextRunDate) {
            console.log(`⚡ Ejecutando regla '${rule.note}' programada para ${nextRunDate.toISOString()}`);
            
            const amount = rule.amount;
            const actionText = rule.actionType === 'add' ? 'Ingreso automático' : 'Retiro automático';
            const transaction = {
                id: Date.now() + Math.random(),
                amount: rule.actionType === 'add' ? amount : -amount,
                note: `${actionText} - Nota: ${rule.note}`,
                date: nextRunDate.toISOString(),
                type: rule.actionType,
                automationId: rule.id
            };
            
            // Alterar saldo SOLO en esa cuenta (Aislamiento de Cuentas)
            if (rule.actionType === 'add') {
                goal.currentAmount += amount;
            } else {
                goal.currentAmount = Math.max(0, goal.currentAmount - amount);
            }
            
            if (!goal.transactions) goal.transactions = [];
            goal.transactions.unshift(transaction);
            
            // Actualizar tiempos
            rule.lastRun = nextRunDate.toISOString();
            nextRunDate = new Date(calculateNextRunDate(nextRunDate, rule.frequency));
            rule.nextRun = nextRunDate.toISOString();
            updated = true;
        }
    });
    
    if (updated) {
        saveToStorage();
        saveAutomationsToStorage();
        updateGoalsUI();
        updateTotals();
        
        // Si el detalle de la meta está abierto, refrescarlo
        if (currentGoalId) {
            const detailModal = document.getElementById("goal-detail-modal");
            if (detailModal && detailModal.style.display === "flex") {
                openGoalDetail(currentGoalId);
            }
        }
    }
}

// UI: Abrir y Cerrar Menú de Automatizaciones
function openAutomationMenu() {
    const modal = document.getElementById("automation-modal");
    if (modal) {
        modal.style.display = "flex";
        showAutomationListView();
    }
}

function closeAutomationMenu() {
    const modal = document.getElementById("automation-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

function showAutomationListView() {
    document.getElementById("automation-list-view").style.display = "block";
    document.getElementById("automation-form-view").style.display = "none";
    renderAutomationsList();
}

// Render listado
function renderAutomationsList() {
    const container = document.getElementById("automation-rules-list");
    if (!container) return;
    
    if (automations.length === 0) {
        container.innerHTML = `<p class="no-transactions" style="text-align: center; margin-top: 20px;">No tienes reglas de automatización creadas.</p>`;
        return;
    }
    
    container.innerHTML = automations.map(rule => {
        const goal = goals.find(g => g.id === Number(rule.goalId));
        const goalName = goal ? goal.name : 'Cuenta eliminada';
        const currency = goal ? goal.currency : '';
        const freqText = {
            daily: 'Cada día',
            weekly: 'Cada semana',
            monthly: 'Cada mes',
            yearly: 'Cada año'
        }[rule.frequency];
        
        const actionSign = rule.actionType === 'add' ? '+' : '-';
        const actionColorClass = rule.actionType === 'add' ? 'success' : 'warning';
        const formattedAmount = formatCurrency(rule.amount, currency || 'USD');
        
        return `
            <div class="automation-card">
                <div class="automation-card-info">
                    <div class="automation-card-title">
                        <span>${rule.actionType === 'add' ? '📈' : '📉'}</span>
                        <strong>${rule.note}</strong>
                    </div>
                    <div class="automation-card-meta">
                        Cuenta: ${goalName}
                    </div>
                    <div class="automation-card-schedule">
                        Frecuencia: ${freqText} | Monto: <span style="font-weight: 700; color: var(--${actionColorClass}-color)">${actionSign}${formattedAmount}</span>
                    </div>
                    <div class="automation-card-schedule" style="font-size: 10px; margin-top: 4px; opacity: 0.7;">
                        Próxima ejec.: ${new Date(rule.nextRun).toLocaleString()}
                    </div>
                </div>
                <div class="automation-card-actions">
                    <button class="automation-card-btn" onclick="executeAutomationImmediate('${rule.id}')" title="Ejecutar Ahora" style="background: rgba(78, 205, 196, 0.2); color: var(--success-color);">⚡</button>
                    <button class="automation-card-btn" onclick="editAutomationRule('${rule.id}')" title="Editar">✏️</button>
                    <button class="automation-card-btn delete" onclick="deleteAutomationRule('${rule.id}')" title="Eliminar">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// Formulario: Crear y Editar
function showCreateAutomationForm() {
    document.getElementById("automation-form-title").textContent = "Nueva Regla de Automatización";
    document.getElementById("automation-id").value = "";
    
    // Cargar select de metas
    setupAutomationGoalSelect();
    
    setAutomationAction('add');
    
    document.getElementById("automation-amount").value = "";
    document.getElementById("automation-frequency").value = "daily";
    document.getElementById("automation-note").value = "";
    
    document.getElementById("automation-list-view").style.display = "none";
    document.getElementById("automation-form-view").style.display = "block";
}

function hideAutomationForm() {
    showAutomationListView();
}

function setupAutomationGoalSelect(selectedId = null) {
    const select = document.getElementById("automation-goal");
    if (!select) return;
    
    if (goals.length === 0) {
        select.innerHTML = `<option value="">Crea una meta primero</option>`;
        return;
    }
    
    select.innerHTML = goals.map(goal => 
        `<option value="${goal.id}">${goal.name} (${goal.currency})</option>`
    ).join('');
    
    if (selectedId) {
        select.value = selectedId;
    }
}

function setAutomationAction(action) {
    currentAutomationAction = action;
    const addBtn = document.getElementById("action-add-btn");
    const removeBtn = document.getElementById("action-remove-btn");
    
    if (action === 'add') {
        addBtn.className = "btn-action active-add";
        removeBtn.className = "btn-action";
    } else {
        addBtn.className = "btn-action";
        removeBtn.className = "btn-action active-remove";
    }
}

// Guardar regla
function saveAutomationRule() {
    const idInput = document.getElementById("automation-id").value;
    const goalId = document.getElementById("automation-goal").value;
    const amount = parseFormattedNumber(document.getElementById("automation-amount").value);
    const frequency = document.getElementById("automation-frequency").value;
    const note = document.getElementById("automation-note").value.trim();
    
    if (!goalId) {
        alert("Por favor, selecciona una cuenta/meta.");
        return;
    }
    if (!amount || amount <= 0) {
        alert("Por favor, ingresa un monto válido.");
        return;
    }
    if (!note) {
        alert("Por favor, ingresa una nota/concepto.");
        return;
    }
    
    const ruleData = {
        goalId: goalId,
        actionType: currentAutomationAction,
        amount: amount,
        frequency: frequency,
        note: note
    };
    
    if (idInput) {
        // Modo Edición
        const existingRule = automations.find(r => r.id === idInput);
        if (existingRule) {
            // Verificar si cambió la nota
            if (existingRule.note !== note) {
                // Almacenar datos temporalmente y mostrar opciones A/B
                pendingNoteChangeRule = existingRule;
                pendingNoteChangeData = ruleData;
                openAutomationOptionModal();
                return;
            }
            
            // Si la nota no cambió, actualizar el resto de parámetros directamente
            updateRuleParams(existingRule, ruleData);
            saveAutomationsToStorage();
            processAutomations(); // Procesar en caso de que cambie frecuencia y ya deba ejecutarse
            showAutomationListView();
        }
    } else {
        // Modo Creación (Sin límite de cambios)
        const newRule = {
            id: Date.now().toString(),
            goalId: goalId,
            actionType: currentAutomationAction,
            amount: amount,
            frequency: frequency,
            note: note,
            lastRun: null,
            nextRun: calculateFirstRunDate(frequency),
            createdAt: new Date().toISOString()
        };
        automations.push(newRule);
        saveAutomationsToStorage();
        processAutomations();
        showAutomationListView();
    }
}

function updateRuleParams(rule, newData) {
    rule.goalId = newData.goalId;
    rule.actionType = newData.actionType;
    rule.amount = newData.amount;
    
    // Si la frecuencia cambió, recalculamos la próxima ejecución a partir de hoy
    if (rule.frequency !== newData.frequency) {
        rule.frequency = newData.frequency;
        rule.nextRun = calculateFirstRunDate(newData.frequency);
    }
    
    rule.note = newData.note;
}

// Editar Regla
function editAutomationRule(id) {
    const rule = automations.find(r => r.id === id);
    if (!rule) return;
    
    document.getElementById("automation-form-title").textContent = "Editar Regla de Automatización";
    document.getElementById("automation-id").value = rule.id;
    
    setupAutomationGoalSelect(rule.goalId);
    setAutomationAction(rule.actionType);
    
    document.getElementById("automation-amount").value = formatNumberToInputString(rule.amount);
    document.getElementById("automation-frequency").value = rule.frequency;
    document.getElementById("automation-note").value = rule.note;
    
    document.getElementById("automation-list-view").style.display = "none";
    document.getElementById("automation-form-view").style.display = "block";
}

// Eliminar Regla
function deleteAutomationRule(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta regla de automatización?")) {
        automations = automations.filter(r => r.id !== id);
        saveAutomationsToStorage();
        renderAutomationsList();
    }
}

// Modales Opción A/B
function openAutomationOptionModal() {
    document.getElementById("automation-option-modal").style.display = "flex";
}

function closeAutomationOptionModal() {
    document.getElementById("automation-option-modal").style.display = "none";
    pendingNoteChangeRule = null;
    pendingNoteChangeData = null;
}

function confirmNoteChangeOption(option) {
    if (!pendingNoteChangeRule || !pendingNoteChangeData) return;
    
    const rule = pendingNoteChangeRule;
    const newData = pendingNoteChangeData;
    const oldNote = rule.note;
    const newNote = newData.note;
    
    // Actualizar parámetros de la regla
    updateRuleParams(rule, newData);
    
    if (option === 'B') {
        // Actualizar la nota también en el historial pasado para mantener el registro ordenado
        console.log(`🔄 Opción B: Actualizando historial de transacciones para la regla ${rule.id} (de "${oldNote}" a "${newNote}")`);
        
        let txUpdated = 0;
        goals.forEach(goal => {
            if (goal.transactions) {
                goal.transactions.forEach(tx => {
                    // Buscar coincidencia por automationId o por formato de nota antiguo si no tiene ID
                    const oldActionTextAdd = `Ingreso automático - Nota: ${oldNote}`;
                    const oldActionTextRemove = `Retiro automático - Nota: ${oldNote}`;
                    
                    const matchesId = tx.automationId === rule.id;
                    const matchesNote = tx.note === oldActionTextAdd || tx.note === oldActionTextRemove;
                    
                    if (matchesId || matchesNote) {
                        const actionText = tx.amount > 0 ? 'Ingreso automático' : 'Retiro automático';
                        tx.note = `${actionText} - Nota: ${newNote}`;
                        tx.automationId = rule.id; // Asegurar que tenga el ID
                        txUpdated++;
                    }
                });
            }
        });
        
        console.log(`✅ Se actualizaron ${txUpdated} transacciones en el historial`);
        saveToStorage(); // Guardar cambios en goals
        updateGoalsUI();
    } else {
        console.log('ℹ️ Opción A: Manteniendo intacto el historial anterior.');
    }
    
    saveAutomationsToStorage();
    processAutomations();
    
    closeAutomationOptionModal();
    showAutomationListView();
}

// Ejecutar regla inmediatamente (para pruebas o ejecución manual)
function executeAutomationImmediate(id) {
    const rule = automations.find(r => r.id === id);
    if (!rule) return;
    
    const goal = goals.find(g => g.id === Number(rule.goalId));
    if (!goal) {
        alert("La cuenta vinculada a esta regla ya no existe.");
        return;
    }
    
    const amount = rule.amount;
    const actionText = rule.actionType === 'add' ? 'Ingreso automático' : 'Retiro automático';
    
    const transaction = {
        id: Date.now() + Math.random(),
        amount: rule.actionType === 'add' ? amount : -amount,
        note: `${actionText} - Nota: ${rule.note} (Ejecución manual)`,
        date: new Date().toISOString(),
        type: rule.actionType,
        automationId: rule.id
    };
    
    // Aislamiento de cuentas
    if (rule.actionType === 'add') {
        goal.currentAmount += amount;
    } else {
        goal.currentAmount = Math.max(0, goal.currentAmount - amount);
    }
    
    if (!goal.transactions) goal.transactions = [];
    goal.transactions.unshift(transaction);
    
    // Avanzar la próxima ejecución para mantener el ciclo correcto
    rule.lastRun = new Date().toISOString();
    rule.nextRun = calculateNextRunDate(new Date().toISOString(), rule.frequency);
    
    saveToStorage();
    saveAutomationsToStorage();
    updateGoalsUI();
    updateTotals();
    renderAutomationsList();
    
    alert(`Ejecutado con éxito. Se aplicó el movimiento '${rule.note}' en tu cuenta.`);
}

// ===== FUNCIONES DEL SISTEMA DE MULTI-PERFILES (MULTI-PROFILE) =====

const profileEmojis = ['👤', '💼', '🏠', '✈️', '🚗', '🛍️', '🎓', '🍔', '🎮', '❤️', '🐾', '💡'];
const profileColors = ['#667eea', '#4ecdc4', '#feca57', '#ff6b6b', '#ff9ff3', '#45aaf2', '#2bcbba', '#20bf6b', '#a55eea', '#fed330', '#eb3b5a', '#fa8231'];

function renderEmojiGrid(selectedEmoji = '👤') {
    const grid = document.getElementById("emoji-grid");
    if (!grid) return;
    grid.innerHTML = profileEmojis.map(emoji => `
        <span class="emoji-item ${emoji === selectedEmoji ? 'selected' : ''}" onclick="selectProfileEmoji(this, '${emoji}')">${emoji}</span>
    `).join('');
    document.getElementById("profile-emoji-selected").value = selectedEmoji;
}

function selectProfileEmoji(element, emoji) {
    document.querySelectorAll(".emoji-item").forEach(item => item.classList.remove("selected"));
    element.classList.add("selected");
    document.getElementById("profile-emoji-selected").value = emoji;
}

function renderColorGrid(selectedColor = '#667eea') {
    const grid = document.getElementById("color-grid");
    if (!grid) return;
    grid.innerHTML = profileColors.map(color => `
        <div class="color-item ${color === selectedColor ? 'selected' : ''}" style="background-color: ${color};" onclick="selectProfileColor(this, '${color}')"></div>
    `).join('');
    document.getElementById("profile-color-selected").value = selectedColor;
}

function selectProfileColor(element, color) {
    document.querySelectorAll(".color-item").forEach(item => item.classList.remove("selected"));
    element.classList.add("selected");
    document.getElementById("profile-color-selected").value = color;
}

function openProfileSelector() {
    console.log('👤 Abriendo selector de perfiles...');
    const modal = document.getElementById("profile-selector-modal");
    if (!modal) return;
    
    const closeBtn = document.getElementById("profile-close-btn");
    if (closeBtn) {
        closeBtn.style.display = profiles.length > 0 ? "block" : "none";
    }
    
    renderProfilesList();
    modal.style.display = "flex";
}

function closeProfileSelector() {
    const modal = document.getElementById("profile-selector-modal");
    if (modal) modal.style.display = "none";
}

function renderProfilesList() {
    const container = document.getElementById("profiles-list");
    if (!container) return;
    
    container.innerHTML = profiles.map(prof => {
        const profGoals = allGoals.filter(g => g.profileId === prof.id);
        const goalCount = profGoals.length;
        
        const balancesByCurrency = {};
        profGoals.forEach(g => {
            balancesByCurrency[g.currency] = (balancesByCurrency[g.currency] || 0) + g.currentAmount;
        });
        
        const balanceStrings = Object.entries(balancesByCurrency).map(([curr, amt]) => {
            return formatCurrency(amt, curr);
        });
        
        const balanceText = balanceStrings.length > 0 ? balanceStrings.join(' \| ') : 'Sin fondos';
        const isActive = prof.id === currentProfileId;
        
        return `
            <div class="profile-card ${isActive ? 'active' : ''}" onclick="selectProfile('${prof.id}')">
                <div class="profile-card-left">
                    <div class="profile-card-avatar" style="background-color: ${prof.color};">
                        ${prof.emoji}
                    </div>
                    <div class="profile-card-details">
                        <div class="profile-card-name">${prof.name}</div>
                        <div class="profile-card-meta">${goalCount} ${goalCount === 1 ? 'cuenta' : 'cuentas'} • ${balanceText}</div>
                    </div>
                </div>
                <div class="profile-card-actions" onclick="event.stopPropagation()">
                    <button class="profile-card-btn" onclick="editProfile('${prof.id}')" title="Editar">✏️</button>
                    ${profiles.length > 1 ? `<button class="profile-card-btn delete" onclick="confirmDeleteProfile('${prof.id}')" title="Eliminar">🗑️</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function selectProfile(profileId) {
    if (profileId === currentProfileId) {
        closeProfileSelector();
        return;
    }
    
    console.log(`🔄 Cambiando al perfil: ${profileId}`);
    
    mergeCurrentProfileGoals();
    mergeCurrentProfileAutomations();
    
    currentProfileId = profileId;
    localStorage.setItem("miAhorroCurrentProfileId", currentProfileId);
    
    currentGoalId = null;
    currentMoneyAction = null;
    
    loadActiveProfileData();
    updateGoalsUI();
    updateTotals();
    closeProfileSelector();
    
    if (navigator.vibrate) navigator.vibrate(40);
    console.log(`✅ Perfil cambiado a: ${profileId}`);
}

function openCreateProfile(profileId = null) {
    const modal = document.getElementById("create-profile-modal");
    if (!modal) return;
    
    const title = document.getElementById("create-profile-title");
    const nameInput = document.getElementById("profile-name-input");
    const editIdInput = document.getElementById("profile-edit-id");
    
    if (profileId) {
        const prof = profiles.find(p => p.id === profileId);
        if (!prof) return;
        
        if (title) title.textContent = "Editar Perfil";
        if (nameInput) nameInput.value = prof.name;
        if (editIdInput) editIdInput.value = prof.id;
        
        renderEmojiGrid(prof.emoji);
        renderColorGrid(prof.color);
    } else {
        if (title) title.textContent = "Nuevo Perfil";
        if (nameInput) nameInput.value = "";
        if (editIdInput) editIdInput.value = "";
        
        renderEmojiGrid('👤');
        renderColorGrid('#667eea');
    }
    
    modal.style.display = "flex";
}

function closeCreateProfile() {
    const modal = document.getElementById("create-profile-modal");
    if (modal) modal.style.display = "none";
}

function saveNewProfile() {
    const nameInput = document.getElementById("profile-name-input");
    const editIdInput = document.getElementById("profile-edit-id");
    const emojiSelected = document.getElementById("profile-emoji-selected").value;
    const colorSelected = document.getElementById("profile-color-selected").value;
    
    if (!nameInput) return;
    const name = nameInput.value.trim();
    
    if (!name) {
        alert("Por favor, ingresa un nombre para el perfil.");
        return;
    }
    
    const editId = editIdInput ? editIdInput.value : "";
    
    if (editId) {
        const prof = profiles.find(p => p.id === editId);
        if (prof) {
            prof.name = name;
            prof.emoji = emojiSelected;
            prof.color = colorSelected;
            console.log('✅ Perfil editado:', editId);
        }
    } else {
        const newProf = {
            id: 'profile_' + Date.now(),
            name: name,
            emoji: emojiSelected,
            color: colorSelected
        };
        profiles.push(newProf);
        console.log('✅ Nuevo perfil creado:', newProf.id);
        selectProfile(newProf.id);
    }
    
    saveToStorage();
    renderProfilesList();
    updateProfileBadgeHeader();
    closeCreateProfile();
}

function editProfile(profileId) {
    openCreateProfile(profileId);
}

let profileToDeleteId = null;

function confirmDeleteProfile(profileId) {
    const prof = profiles.find(p => p.id === profileId);
    if (!prof) return;
    
    profileToDeleteId = profileId;
    const label = document.getElementById("delete-profile-name-label");
    if (label) label.textContent = prof.name;
    
    const modal = document.getElementById("confirm-delete-profile-modal");
    if (modal) modal.style.display = "flex";
}

function closeConfirmDeleteProfile() {
    const modal = document.getElementById("confirm-delete-profile-modal");
    if (modal) modal.style.display = "none";
    profileToDeleteId = null;
}

function executeDeleteProfile() {
    if (!profileToDeleteId) return;
    
    if (profiles.length <= 1) {
        alert("No puedes eliminar el único perfil existente.");
        closeConfirmDeleteProfile();
        return;
    }
    
    console.log('🗑️ Eliminando perfil y sus datos:', profileToDeleteId);
    
    profiles = profiles.filter(p => p.id !== profileToDeleteId);
    allGoals = allGoals.filter(g => g.profileId !== profileToDeleteId);
    allAutomations = allAutomations.filter(a => a.profileId !== profileToDeleteId);
    
    if (currentProfileId === profileToDeleteId) {
        currentProfileId = profiles[0].id;
        localStorage.setItem("miAhorroCurrentProfileId", currentProfileId);
    }
    
    localStorage.setItem("miAhorroProfiles", JSON.stringify(profiles));
    localStorage.setItem("miAhorroCurrentProfileId", currentProfileId);
    localStorage.setItem("miAhorroMetas", JSON.stringify(allGoals));
    localStorage.setItem("miAhorroAutomations", JSON.stringify(allAutomations));
    
    loadActiveProfileData();
    updateGoalsUI();
    updateTotals();
    
    closeConfirmDeleteProfile();
    renderProfilesList();
}

// ===== FUNCIONES PARA EDICIÓN MANUAL DE TRANSACCIONES =====

function openEditTransactionModal(goalId, transactionId) {
    console.log('✏️ Editando transacción:', transactionId, 'de cuenta:', goalId);
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const tx = goal.transactions.find(t => t.id === transactionId);
    if (!tx) return;
    
    document.getElementById("edit-tx-id").value = transactionId;
    document.getElementById("edit-tx-goal-id").value = goalId;
    
    const amountInput = document.getElementById("edit-tx-amount");
    const noteInput = document.getElementById("edit-tx-note");
    const dateInput = document.getElementById("edit-tx-date");
    const timeInput = document.getElementById("edit-tx-time");
    
    if (amountInput) {
        amountInput.value = formatNumberToInputString(Math.abs(tx.amount));
    }
    if (noteInput) {
        noteInput.value = tx.note || '';
    }
    
    // Precarga de fecha y hora desde el timestamp ISO guardado
    if (tx.date) {
        const txDate = new Date(tx.date);
        // Formato YYYY-MM-DD requerido por input[type=date]
        const yyyy = txDate.getFullYear();
        const mm = String(txDate.getMonth() + 1).padStart(2, '0');
        const dd = String(txDate.getDate()).padStart(2, '0');
        if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
        // Formato HH:MM requerido por input[type=time]
        const hh = String(txDate.getHours()).padStart(2, '0');
        const min = String(txDate.getMinutes()).padStart(2, '0');
        if (timeInput) timeInput.value = `${hh}:${min}`;
    } else {
        // Sin fecha guardada: usar la actual como fallback
        const now = new Date();
        if (dateInput) dateInput.value = now.toISOString().slice(0, 10);
        if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);
    }
    
    const modal = document.getElementById("edit-transaction-modal");
    if (modal) modal.style.display = "flex";
}

function closeEditTransactionModal() {
    const modal = document.getElementById("edit-transaction-modal");
    if (modal) modal.style.display = "none";
}

function saveEditTransaction() {
    const txId = Number(document.getElementById("edit-tx-id").value);
    const goalId = Number(document.getElementById("edit-tx-goal-id").value);
    const amountInput = document.getElementById("edit-tx-amount");
    const noteInput = document.getElementById("edit-tx-note");
    const dateInput = document.getElementById("edit-tx-date");
    const timeInput = document.getElementById("edit-tx-time");
    
    if (!amountInput) return;
    
    const newAmountAbs = parseFormattedNumber(amountInput.value);
    const newNote = noteInput ? noteInput.value.trim() : '';
    const newDateStr = dateInput ? dateInput.value : '';
    const newTimeStr = timeInput ? timeInput.value : '00:00';
    
    if (!newAmountAbs || newAmountAbs <= 0) {
        alert("Por favor, ingresa un monto válido.");
        return;
    }
    if (!newDateStr) {
        alert("Por favor, selecciona una fecha.");
        return;
    }
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const tx = goal.transactions.find(t => t.id === txId);
    if (!tx) return;
    
    const oldAmount = tx.amount;
    const isPositive = oldAmount > 0;
    
    const newAmount = isPositive ? newAmountAbs : -newAmountAbs;
    const diff = newAmount - oldAmount;
    
    // Reconstruir la fecha ISO a partir de fecha + hora seleccionadas por el usuario
    const [year, month, day] = newDateStr.split('-').map(Number);
    const [hours, minutes] = newTimeStr.split(':').map(Number);
    const newDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
    tx.amount = newAmount;
    tx.note = newNote;
    tx.date = newDate.toISOString();
    
    goal.currentAmount += diff;
    if (goal.currentAmount < 0) goal.currentAmount = 0;
    
    saveToStorage();
    updateGoalsUI();
    updateTotals();
    
    if (currentGoalId === goalId) {
        openGoalDetail(goalId);
    }
    
    closeEditTransactionModal();
    console.log('✅ Movimiento editado. Diferencia de saldo aplicada:', diff, '| Nueva fecha:', newDate.toLocaleString());
}

// ===== ELIMINAR MOVIMIENTO =====
let _deleteTxGoalId = null;
let _deleteTxId = null;

function confirmDeleteTransaction(goalId, transactionId) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const tx = goal.transactions.find(t => t.id === transactionId);
    if (!tx) return;

    _deleteTxGoalId = goalId;
    _deleteTxId = transactionId;

    // Rellenar el modal con info del movimiento
    const isPositive = tx.amount > 0;
    const amountStr = (isPositive ? '+' : '') + formatCurrency(Math.abs(tx.amount), goal.currency);
    const dateStr = new Date(tx.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const amountEl  = document.getElementById('del-tx-amount');
    const noteEl    = document.getElementById('del-tx-note');
    const dateEl    = document.getElementById('del-tx-date');
    const goalEl    = document.getElementById('del-tx-goal');
    const effectEl  = document.getElementById('del-tx-effect');

    if (amountEl)  amountEl.textContent  = amountStr;
    if (amountEl)  amountEl.className    = isPositive ? 'del-tx-positive' : 'del-tx-negative';
    if (noteEl)    noteEl.textContent    = tx.note || '(sin nota)';
    if (dateEl)    dateEl.textContent    = `${dateStr} a las ${timeStr}`;
    if (goalEl)    goalEl.textContent    = goal.name;
    if (effectEl)  effectEl.textContent  = isPositive
        ? `⚠️ Se descontarán ${formatCurrency(Math.abs(tx.amount), goal.currency)} del saldo de la meta.`
        : `⚠️ Se agregarán ${formatCurrency(Math.abs(tx.amount), goal.currency)} al saldo de la meta.`;

    const modal = document.getElementById('confirm-delete-tx-modal');
    if (modal) modal.style.display = 'flex';
}

function closeConfirmDeleteTx() {
    const modal = document.getElementById('confirm-delete-tx-modal');
    if (modal) modal.style.display = 'none';
    _deleteTxGoalId = null;
    _deleteTxId = null;
}

function executeDeleteTransaction() {
    if (_deleteTxGoalId === null || _deleteTxId === null) return;

    const goal = goals.find(g => g.id === _deleteTxGoalId);
    if (!goal) return;

    const txIndex = goal.transactions.findIndex(t => t.id === _deleteTxId);
    if (txIndex === -1) return;

    const tx = goal.transactions[txIndex];

    // Revertir el efecto del movimiento en el saldo
    goal.currentAmount -= tx.amount;
    if (goal.currentAmount < 0) goal.currentAmount = 0;

    // Eliminar la transacción
    goal.transactions.splice(txIndex, 1);

    saveToStorage();
    updateGoalsUI();
    updateTotals();

    // Refrescar modal de detalle si está abierto
    if (currentGoalId === _deleteTxGoalId) {
        openGoalDetail(_deleteTxGoalId);
    }

    closeConfirmDeleteTx();
    console.log('🗑️ Movimiento eliminado. Saldo actualizado.');
}



// ===== FUNCIONES PARA TRANSFERENCIAS ENTRE CUENTAS Y PERFILES =====

function showTransferModal() {
    console.log('💸 Abriendo transferencia desde cuenta:', currentGoalId);
    
    const srcGoal = goals.find(g => g.id === currentGoalId);
    if (!srcGoal) return;
    
    document.getElementById("transfer-src-name").value = `${srcGoal.name} (${srcGoal.currency}) - Saldo: ${formatCurrency(srcGoal.currentAmount, srcGoal.currency)}`;
    document.getElementById("transfer-src-id").value = srcGoal.id;
    
    const destProfileSelect = document.getElementById("transfer-dest-profile");
    if (destProfileSelect) {
        destProfileSelect.innerHTML = profiles.map(p => `
            <option value="${p.id}">${p.emoji} ${p.name} ${p.id === currentProfileId ? '(Este perfil)' : ''}</option>
        `).join('');
        destProfileSelect.value = currentProfileId;
    }
    
    onTransferProfileChange();
    
    const modal = document.getElementById("transfer-modal");
    if (modal) modal.style.display = "flex";
}

function closeTransferModal() {
    const modal = document.getElementById("transfer-modal");
    if (modal) modal.style.display = "none";
}

function onTransferProfileChange() {
    const destProfileId = document.getElementById("transfer-dest-profile").value;
    const destGoalSelect = document.getElementById("transfer-dest-goal");
    const srcGoalId = Number(document.getElementById("transfer-src-id").value);
    
    if (!destGoalSelect) return;
    
    const destGoals = allGoals.filter(g => g.profileId === destProfileId);
    const availableGoals = destGoals.filter(g => g.id !== srcGoalId);
    
    if (availableGoals.length === 0) {
        destGoalSelect.innerHTML = `<option value="">Sin cuentas disponibles</option>`;
    } else {
        destGoalSelect.innerHTML = availableGoals.map(g => `
            <option value="${g.id}">${g.name} (${g.currency})</option>
        `).join('');
    }
    
    onTransferGoalChange();
}

const mockExchangeRates = {
    'USD_EUR': 0.92, 'EUR_USD': 1.09,
    'USD_COP': 4000, 'COP_USD': 0.00025,
    'EUR_COP': 4350, 'COP_EUR': 0.00023,
    'USD_BRL': 5.40, 'BRL_USD': 0.19,
    'USD_MXN': 18.20, 'MXN_USD': 0.055,
    'USD_ARS': 900, 'ARS_USD': 0.0011,
    'USD_CLP': 930, 'CLP_USD': 0.0011,
    'USD_PEN': 3.75, 'PEN_USD': 0.27
};

function onTransferGoalChange() {
    const srcGoalId = Number(document.getElementById("transfer-src-id").value);
    const destGoalId = Number(document.getElementById("transfer-dest-goal").value);
    
    const srcGoal = allGoals.find(g => g.id === srcGoalId);
    const destGoal = allGoals.find(g => g.id === destGoalId);
    
    const exchangeSection = document.getElementById("transfer-exchange-section");
    const amountInput = document.getElementById("transfer-amount");
    const destAmountInput = document.getElementById("transfer-dest-amount");
    const rateLabel = document.getElementById("transfer-rate-label");
    
    if (!srcGoal || !destGoal) {
        if (exchangeSection) exchangeSection.style.display = "none";
        return;
    }
    
    if (srcGoal.currency !== destGoal.currency) {
        if (exchangeSection) exchangeSection.style.display = "block";
        
        const rateKey = `${srcGoal.currency}_${destGoal.currency}`;
        let rate = mockExchangeRates[rateKey];
        if (!rate) rate = 1.0;
        
        if (rateLabel) {
            rateLabel.textContent = `Tasa sugerida: 1 ${srcGoal.currency} = ${rate.toFixed(4)} ${destGoal.currency}`;
        }
        
        amountInput.oninput = function() {
            amountInput.value = formatNumberInput(amountInput.value);
            const srcAmt = parseFormattedNumber(amountInput.value);
            if (srcAmt > 0) {
                destAmountInput.value = formatNumberToInputString(Math.round(srcAmt * rate * 100) / 100);
            } else {
                destAmountInput.value = "";
            }
        };
        
        destAmountInput.oninput = function() {
            destAmountInput.value = formatNumberInput(destAmountInput.value);
        };
        
    } else {
        if (exchangeSection) exchangeSection.style.display = "none";
        
        amountInput.oninput = function() {
            amountInput.value = formatNumberInput(amountInput.value);
        };
    }
}

function saveTransferTransaction() {
    const srcGoalId = Number(document.getElementById("transfer-src-id").value);
    const destGoalId = Number(document.getElementById("transfer-dest-goal").value);
    const destProfileId = document.getElementById("transfer-dest-profile").value;
    
    const amountInput = document.getElementById("transfer-amount");
    const destAmountInput = document.getElementById("transfer-dest-amount");
    const noteInput = document.getElementById("transfer-note");
    
    if (!srcGoalId || !destGoalId) {
        alert("Por favor, selecciona una cuenta destino válida.");
        return;
    }
    
    const srcGoal = allGoals.find(g => g.id === srcGoalId);
    const destGoal = allGoals.find(g => g.id === destGoalId);
    
    if (!srcGoal || !destGoal) return;
    
    const srcAmount = parseFormattedNumber(amountInput.value);
    if (!srcAmount || srcAmount <= 0) {
        alert("Por favor, ingresa un monto válido a transferir.");
        return;
    }
    
    if (srcGoal.currentAmount < srcAmount) {
        alert(`Saldo insuficiente. Tu saldo es ${formatCurrency(srcGoal.currentAmount, srcGoal.currency)}`);
        return;
    }
    
    let destAmount = srcAmount;
    if (srcGoal.currency !== destGoal.currency) {
        destAmount = parseFormattedNumber(destAmountInput.value);
        if (!destAmount || destAmount <= 0) {
            alert("Por favor, ingresa un monto de destino válido.");
            return;
        }
    }
    
    const customNote = noteInput ? noteInput.value.trim() : "";
    const noteText = customNote ? ` - ${customNote}` : "";
    
    const srcProfile = profiles.find(p => p.id === srcGoal.profileId);
    const destProfile = profiles.find(p => p.id === destProfileId);
    
    const srcProfileName = srcProfile ? srcProfile.name : "Desconocido";
    const destProfileName = destProfile ? destProfile.name : "Desconocido";
    
    const debitTx = {
        id: Date.now(),
        amount: -srcAmount,
        note: `Transferencia enviada a [${destProfileName}] -> ${destGoal.name}${noteText}`,
        date: new Date().toISOString(),
        type: 'remove'
    };
    srcGoal.currentAmount -= srcAmount;
    if (!srcGoal.transactions) srcGoal.transactions = [];
    srcGoal.transactions.unshift(debitTx);
    
    const creditTx = {
        id: Date.now() + 1,
        amount: destAmount,
        note: `Transferencia recibida desde [${srcProfileName}] -> ${srcGoal.name}${noteText}`,
        date: new Date().toISOString(),
        type: 'add'
    };
    destGoal.currentAmount += destAmount;
    if (!destGoal.transactions) destGoal.transactions = [];
    destGoal.transactions.unshift(creditTx);
    
    saveToStorage();
    
    if (destProfileId === currentProfileId) {
        loadActiveProfileData();
    } else {
        goals = allGoals.filter(g => g.profileId === currentProfileId);
    }
    
    updateGoalsUI();
    updateTotals();
    closeTransferModal();
    closeGoalDetail();
    
    if (navigator.vibrate) navigator.vibrate([40, 80, 40]);
    alert("¡Transferencia realizada con éxito!");
}