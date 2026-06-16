/**
 * ===== SCRIPT BACKEND CRONJOB DE AUTOMATIZACIÓN =====
 * Este script procesa las reglas de automatización configuradas.
 * Puede ser ejecutado de forma programada a la 1:00 AM todos los días.
 * 
 * Uso: node automation_cron.js [opciones]
 * Opciones:
 *   --run             Ejecuta el procesamiento de automatizaciones pendientes (comportamiento cronjob regular)
 *   --edit <id> <nueva_nota> <opcion_A_o_B>
 *                     Simula la edición de una nota de regla y aplica la opción A o B al historial.
 *   --status          Muestra el estado actual de las cuentas (metas) y reglas.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Cargar Base de Datos Local
function loadDB() {
    if (!fs.existsSync(DB_PATH)) {
        // Inicializar base de datos vacía si no existe
        const initialData = {
            users: [
                {
                    id: "user_global_1",
                    email: "user@example.com",
                    passwordHash: "$2b$12$tQy2zYhK8XvW4rZ0N5uP1eF3k3x9Y7uV6o5i8N4a3d2c1b0"
                }
            ],
            profiles: [
                {
                    id: "profile_1",
                    userId: "user_global_1",
                    name: "Principal",
                    emoji: "👤",
                    color: "#667eea"
                }
            ],
            goals: [
                {
                    id: 101,
                    profileId: "profile_1",
                    name: "Cuenta de Ahorro",
                    targetAmount: 100000,
                    currentAmount: 100000, // Saldo inicial 100,000 según el ejemplo
                    currency: "USD",
                    transactions: [],
                    createdAt: new Date().toISOString()
                }
            ],
            automations: [
                {
                    id: "rule_1",
                    goalId: 101,
                    profileId: "profile_1",
                    actionType: "remove", // Retiro (-)
                    amount: 28, // Descuento de 28 diario según el ejemplo
                    frequency: "daily",
                    note: "Agua",
                    lastRun: null,
                    nextRun: getTodayAtOneAM().toISOString(),
                    createdAt: new Date().toISOString()
                }
            ]
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
        console.log(`📁 Base de datos inicial creada en ${DB_PATH}`);
    }
    
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function getTodayAtOneAM() {
    const date = new Date();
    date.setHours(1, 0, 5, 0); // 1:00 AM (justo después)
    return date;
}

// Fechas y cálculos de frecuencia
function calculateNextRunDate(fromDate, frequency) {
    const date = new Date(fromDate);
    date.setHours(1, 0, 5, 0);
    
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

// 1. Ejecutar Automatizaciones
function runAutomations() {
    const db = loadDB();
    const now = new Date();
    let updated = false;

    console.log(`\n⏰ [${now.toLocaleString()}] Procesando reglas de automatización...`);

    db.automations.forEach(rule => {
        let nextRunDate = new Date(rule.nextRun);
        const goal = db.goals.find(g => g.id === Number(rule.goalId));

        if (!goal) {
            console.log(`⚠️ Meta vinculada ${rule.goalId} no encontrada para la regla '${rule.note}'.`);
            return;
        }

        // Validación de seguridad estricta: Aislamiento a nivel de perfil
        if (goal.profileId !== rule.profileId) {
            console.log(`❌ ALERTA DE SEGURIDAD: La regla '${rule.note}' (Perfil: ${rule.profileId}) intentó operar en la cuenta '${goal.name}' (Perfil: ${goal.profileId}). Operación cancelada.`);
            return;
        }

        // Ejecutar ciclos pendientes transcurridos
        while (now >= nextRunDate) {
            const amount = rule.amount;
            const actionText = rule.actionType === 'add' ? 'Ingreso automático' : 'Retiro automático';
            const oldAmount = goal.currentAmount;
            
            // Alterar saldo SOLO en esa cuenta (Aislamiento de Cuentas)
            if (rule.actionType === 'add') {
                goal.currentAmount += amount;
            } else {
                goal.currentAmount = Math.max(0, goal.currentAmount - amount);
            }
            
            const transaction = {
                id: Date.now() + Math.random(),
                amount: rule.actionType === 'add' ? amount : -amount,
                note: `${actionText} - Nota: ${rule.note}`,
                date: nextRunDate.toISOString(),
                type: rule.actionType,
                automationId: rule.id
            };
            
            if (!goal.transactions) goal.transactions = [];
            goal.transactions.unshift(transaction);

            console.log(`⚡ Ejecutada regla '${rule.note}' (${rule.actionType === 'add' ? '+' : '-'}${amount}) en '${goal.name}':`);
            console.log(`   Saldo anterior: ${oldAmount} -> Nuevo saldo: ${goal.currentAmount}`);
            
            // Actualizar tiempos
            rule.lastRun = nextRunDate.toISOString();
            nextRunDate = new Date(calculateNextRunDate(nextRunDate, rule.frequency));
            rule.nextRun = nextRunDate.toISOString();
            updated = true;
        }
    });

    if (updated) {
        saveDB(db);
        console.log(`✅ Base de datos actualizada y guardada correctamente.`);
    } else {
        console.log(`ℹ️ No hay ejecuciones pendientes para procesar.`);
    }
}

// 2. Editar Nota de Automatización (Simulación de Opción A/B)
function editAutomationNote(ruleId, newNote, option) {
    const db = loadDB();
    const rule = db.automations.find(r => r.id === ruleId);

    if (!rule) {
        console.log(`❌ Error: No se encontró la regla con ID '${ruleId}'`);
        return;
    }

    const oldNote = rule.note;
    rule.note = newNote; // Actualizar nota en la regla

    console.log(`\n✏️ Editando regla '${ruleId}': Cambiando nota de "${oldNote}" a "${newNote}"`);

    if (option === 'B' || option === 'b') {
        // Opción B: Actualizar también historial pasado
        let txUpdated = 0;
        db.goals.forEach(goal => {
            if (goal.transactions) {
                goal.transactions.forEach(tx => {
                    // Coincide por automationId o por formato de nota anterior
                    const oldActionTextAdd = `Ingreso automático - Nota: ${oldNote}`;
                    const oldActionTextRemove = `Retiro automático - Nota: ${oldNote}`;
                    
                    const matchesId = tx.automationId === rule.id;
                    const matchesNote = tx.note === oldActionTextAdd || tx.note === oldActionTextRemove;

                    if (matchesId || matchesNote) {
                        const actionText = tx.amount > 0 ? 'Ingreso automático' : 'Retiro automático';
                        tx.note = `${actionText} - Nota: ${newNote}`;
                        tx.automationId = rule.id; // Vincular explícitamente
                        txUpdated++;
                    }
                });
            }
        });
        console.log(`✅ Opción B seleccionada: Se actualizaron ${txUpdated} transacciones en el historial pasado.`);
    } else {
        // Opción A: Mantener el historial intacto
        console.log(`ℹ️ Opción A seleccionada: El historial anterior se mantiene intacto. Solo los nuevos movimientos automáticos usarán "${newNote}".`);
    }

    saveDB(db);
    console.log(`💾 Base de datos guardada.`);
}

// 3. Mostrar Estado
function showStatus() {
    const db = loadDB();
    console.log(`\n===== ESTADO DE LA BASE DE DATOS (MULTI-PERFIL) =====`);
    
    console.log(`Usuarios globales: ${db.users ? db.users.length : 0}`);
    console.log(`Perfiles activos: ${db.profiles ? db.profiles.length : 0}`);
    if (db.profiles) {
        db.profiles.forEach(p => {
            console.log(`  * [${p.id}] ${p.emoji} ${p.name} (Usuario: ${p.userId})`);
        });
    }
    
    console.log(`\nCuentas/Metas (${db.goals.length}):`);
    db.goals.forEach(goal => {
        console.log(`- [ID: ${goal.id}] [Perfil: ${goal.profileId}] ${goal.name}: Saldo actual = ${goal.currentAmount} ${goal.currency}`);
        console.log(`  Historial de Transacciones (${goal.transactions ? goal.transactions.length : 0}):`);
        if (goal.transactions && goal.transactions.length > 0) {
            goal.transactions.slice(0, 5).forEach(tx => {
                console.log(`    * [${new Date(tx.date).toLocaleDateString()} ${new Date(tx.date).toLocaleTimeString()}] ${tx.amount > 0 ? '+' : ''}${tx.amount} | ${tx.note}`);
            });
            if (goal.transactions.length > 5) console.log(`    * ... y ${goal.transactions.length - 5} transacciones más`);
        } else {
            console.log(`    * Sin transacciones`);
        }
    });

    console.log(`\nReglas de Automatización (${db.automations.length}):`);
    db.automations.forEach(rule => {
        const goal = db.goals.find(g => g.id === Number(rule.goalId));
        console.log(`- [ID: ${rule.id}] Nota/Concepto: "${rule.note}"`);
        console.log(`  Vínculo: ${goal ? goal.name : 'Meta Desconocida'} (${rule.actionType === 'add' ? 'Ingreso' : 'Retiro'})`);
        console.log(`  Detalles: Monto = ${rule.amount} | Frecuencia = ${rule.frequency}`);
        console.log(`  Próxima corrida: ${new Date(rule.nextRun).toLocaleString()}`);
    });
    console.log(`=======================================`);
}

// Parsear Argumentos de CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === '--run') {
    runAutomations();
} else if (command === '--edit') {
    const ruleId = args[1];
    const newNote = args[2];
    const option = args[3]; // 'A' o 'B'

    if (!ruleId || !newNote || !option) {
        console.log("❌ Error: Faltan parámetros para --edit. Uso: node automation_cron.js --edit <id> <nueva_nota> <A|B>");
    } else {
        editAutomationNote(ruleId, newNote, option);
    }
} else if (command === '--status') {
    showStatus();
} else {
    // Si se corre sin argumentos, por defecto inicializamos la BD y ejecutamos
    console.log(`\n=== MiAhorro Automatizaciones Backend Cronjob ===`);
    console.log(`Uso:`);
    console.log(`  node automation_cron.js --run            Procesa automatizaciones pendientes`);
    console.log(`  node automation_cron.js --status         Muestra el estado actual`);
    console.log(`  node automation_cron.js --edit <id> <nueva_nota> <A|B>    Edita nota con opción A o B`);
    console.log(`\nCorriendo por defecto inicialización y ejecución regular...`);
    runAutomations();
    showStatus();
}
