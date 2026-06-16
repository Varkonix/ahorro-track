import json
import os
import sys
from datetime import datetime, timedelta

# Configurar encoding UTF-8 en consola para evitar UnicodeEncodeError en Windows
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

DB_PATH = os.path.join(os.path.dirname(__file__), 'db.json')

def load_db():
    if not os.path.exists(DB_PATH):
        # Initial database state
        initial_data = {
            "users": [
                {
                    "id": "user_global_1",
                    "email": "user@example.com",
                    "passwordHash": "$2b$12$tQy2zYhK8XvW4rZ0N5uP1eF3k3x9Y7uV6o5i8N4a3d2c1b0"
                }
            ],
            "profiles": [
                {
                    "id": "profile_1",
                    "userId": "user_global_1",
                    "name": "Principal",
                    "emoji": "👤",
                    "color": "#667eea"
                }
            ],
            "goals": [
                {
                    "id": 101,
                    "profileId": "profile_1",
                    "name": "Cuenta de Ahorro",
                    "targetAmount": 100000.0,
                    "currentAmount": 100000.0,  # Initial balance 100,000 according to requirement
                    "currency": "USD",
                    "transactions": [],
                    "createdAt": datetime.now().isoformat()
                }
            ],
            "automations": [
                {
                    "id": "rule_1",
                    "goalId": 101,
                    "profileId": "profile_1",
                    "actionType": "remove",  # Retiro (-)
                    "amount": 28.0,  # Discount of 28 daily
                    "frequency": "daily",
                    "note": "Agua",
                    "lastRun": None,
                    "nextRun": (datetime.now().replace(hour=1, minute=0, second=5, microsecond=0)).isoformat(),
                    "createdAt": datetime.now().isoformat()
                }
            ]
        }
        with open(DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(initial_data, f, indent=2, ensure_ascii=False)
        print(f"[DB] Base de datos inicial creada en {DB_PATH}")

    with open(DB_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_db(data):
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def calculate_next_run_date(from_date_str, frequency):
    from_date = datetime.fromisoformat(from_date_str)
    # Ensure it's 1:00:05 AM
    from_date = from_date.replace(hour=1, minute=0, second=5, microsecond=0)
    
    if frequency == 'daily':
        next_date = from_date + timedelta(days=1)
    elif frequency == 'weekly':
        next_date = from_date + timedelta(weeks=1)
    elif frequency == 'monthly':
        # Simple month increment
        month = from_date.month + 1
        year = from_date.year
        if month > 12:
            month = 1
            year += 1
        # Handle end-of-month days safely
        day = min(from_date.day, 28)
        next_date = from_date.replace(year=year, month=month, day=day)
    elif frequency == 'yearly':
        next_date = from_date.replace(year=from_date.year + 1)
    else:
        next_date = from_date + timedelta(days=1)
        
    return next_date.isoformat()

def run_automations():
    db = load_db()
    now = datetime.now()
    updated = False

    print(f"\n[{now.strftime('%Y-%m-%d %H:%M:%S')}] Procesando reglas de automatización...")

    for rule in db["automations"]:
        next_run_date = datetime.fromisoformat(rule["nextRun"])
        goal = next((g for g in db["goals"] if g["id"] == int(rule["goalId"])), None)

        if not goal:
            print(f"Warning: Meta vinculada {rule['goalId']} no encontrada para la regla '{rule['note']}'.")
            continue

        # Seguridad de multi-tenancy a nivel de perfil
        if goal.get("profileId") != rule.get("profileId"):
            print(f"❌ ALERTA DE SEGURIDAD: La regla '{rule['note']}' (Perfil: {rule.get('profileId')}) intentó operar en la cuenta '{goal['name']}' (Perfil: {goal.get('profileId')}). Operación cancelada.")
            continue

        while now >= next_run_date:
            amount = rule["amount"]
            action_text = "Ingreso automático" if rule["actionType"] == "add" else "Retiro automático"
            old_amount = goal["currentAmount"]

            # Alter balance only on that account (Aislamiento de Cuentas)
            if rule["actionType"] == "add":
                goal["currentAmount"] += amount
            else:
                goal["currentAmount"] = max(0.0, goal["currentAmount"] - amount)

            transaction = {
                "id": datetime.now().timestamp() + 1.1,
                "amount": amount if rule["actionType"] == "add" else -amount,
                "note": f"{action_text} - Nota: {rule['note']}",
                "date": next_run_date.isoformat(),
                "type": rule["actionType"],
                "automationId": rule["id"]
            }

            if "transactions" not in goal or not goal["transactions"]:
                goal["transactions"] = []
            goal["transactions"].insert(0, transaction)

            print(f"Executed rule '{rule['note']}' ({'+' if rule['actionType'] == 'add' else '-'}{amount}) en '{goal['name']}':")
            print(f"   Saldo anterior: {old_amount} -> Nuevo saldo: {goal['currentAmount']}")

            rule["lastRun"] = next_run_date.isoformat()
            next_run_date = datetime.fromisoformat(calculate_next_run_date(next_run_date.isoformat(), rule["frequency"]))
            rule["nextRun"] = next_run_date.isoformat()
            updated = True

    if updated:
        save_db(db)
        print("[DB] Base de datos actualizada y guardada correctamente.")
    else:
        print("[INFO] No hay ejecuciones pendientes para procesar.")

def edit_automation_note(rule_id, new_note, option):
    db = load_db()
    rule = next((r for r in db["automations"] if r["id"] == rule_id), None)

    if not rule:
        print(f"Error: No se encontró la regla con ID '{rule_id}'")
        return

    old_note = rule["note"]
    rule["note"] = new_note

    print(f"\nEditing rule '{rule_id}': Cambiando nota de \"{old_note}\" a \"{new_note}\"")

    if option in ('B', 'b'):
        tx_updated = 0
        for goal in db["goals"]:
            if "transactions" in goal:
                for tx in goal["transactions"]:
                    old_action_text_add = f"Ingreso automático - Nota: {old_note}"
                    old_action_text_remove = f"Retiro automático - Nota: {old_note}"

                    matches_id = tx.get("automationId") == rule["id"]
                    matches_note = tx["note"] in (old_action_text_add, old_action_text_remove)

                    if matches_id or matches_note:
                        action_text = "Ingreso automático" if tx["amount"] > 0 else "Retiro automático"
                        tx["note"] = f"{action_text} - Nota: {new_note}"
                        tx["automationId"] = rule["id"]
                        tx_updated += 1
        print(f"Option B selected: Se actualizaron {tx_updated} transacciones en el historial pasado.")
    else:
        print(f"Option A selected: El historial anterior se mantiene intacto. Solo los nuevos movimientos usarán \"{new_note}\".")

    save_db(db)
    print("[DB] Base de datos guardada.")

def show_status():
    db = load_db()
    print("\n===== ESTADO DE LA BASE DE DATOS (MULTI-PERFIL) =====")
    print(f"Usuarios globales: {len(db.get('users', []))}")
    print(f"Perfiles activos: {len(db.get('profiles', []))}")
    for p in db.get("profiles", []):
        print(f"  * [{p['id']}] {p['emoji']} {p['name']} (Usuario: {p['userId']})")
    
    print(f"\nCuentas/Metas ({len(db['goals'])}):")
    for goal in db["goals"]:
        print(f"- [ID: {goal['id']}] [Perfil: {goal.get('profileId')}] {goal['name']}: Saldo actual = {goal['currentAmount']} {goal['currency']}")
        txs = goal.get("transactions", [])
        print(f"  Historial de Transacciones ({len(txs)}):")
        for tx in txs[:5]:
            print(f"    * [{tx['date']}] { '+' if tx['amount'] > 0 else ''}{tx['amount']} | {tx['note']}")
        if len(txs) > 5:
            print(f"    * ... y {len(txs) - 5} transacciones más")

    print(f"\nReglas de Automatización ({len(db['automations'])}):")
    for rule in db["automations"]:
        goal = next((g for g in db["goals"] if g["id"] == int(rule["goalId"])), None)
        print(f"- [ID: {rule['id']}] Nota/Concepto: \"{rule['note']}\"")
        print(f"  Vínculo: {goal['name'] if goal else 'Meta Desconocida'} ({'Ingreso' if rule['actionType'] == 'add' else 'Retiro'})")
        print(f"  Detalles: Monto = {rule['amount']} | Frecuencia = {rule['frequency']}")
        print(f"  Próxima corrida: {rule['nextRun']}")
    print("=======================================")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == '--run':
            run_automations()
        elif command == '--edit':
            if len(sys.argv) < 5:
                print("Error: Faltan parámetros para --edit. Uso: python automation_cron.py --edit <id> <nueva_nota> <A|B>")
            else:
                edit_automation_note(sys.argv[2], sys.argv[3], sys.argv[4])
        elif command == '--status':
            show_status()
        else:
            print("Comandos disponibles: --run, --status, --edit <id> <nueva_nota> <A|B>")
    else:
        print("\n=== MiAhorro Automatizaciones Backend Python Cronjob ===")
        run_automations()
        show_status()
