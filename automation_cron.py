import json
import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Configurar encoding UTF-8 en consola para evitar UnicodeEncodeError en Windows
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

load_dotenv()

# Inicializar cliente de Supabase
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase = None

if supabase_url and supabase_key:
    try:
        from supabase import create_client
        supabase = create_client(supabase_url, supabase_key)
        print("⚡ Conectado a Supabase en el cronjob de Python")
    except ImportError:
        print("⚠️ Advertencia: Instala 'supabase' y 'python-dotenv' para conectar con Supabase.")
    except Exception as e:
        print(f"❌ Error al inicializar cliente de Supabase: {e}")

DB_PATH = os.path.join(os.path.dirname(__file__), 'db.json')

def load_db():
    if supabase:
        try:
            print("🔄 Cargando base de datos desde Supabase...")
            # Leer perfiles
            prof_res = supabase.table('profiles').select('*').execute()
            db_profiles = prof_res.data
            
            # Leer metas
            goals_res = supabase.table('goals').select('*').execute()
            db_goals = goals_res.data
            
            # Leer automatizaciones
            autos_res = supabase.table('automations').select('*').execute()
            db_automations = autos_res.data
            
            return {
                "users": [
                    {
                        "id": "user_global_1",
                        "email": "user@example.com",
                        "passwordHash": "$2b$12$tQy2zYhK8XvW4rZ0N5uP1eF3k3x9Y7uV6o5i8N4a3d2c1b0"
                    }
                ],
                "profiles": [
                    {
                        "id": p["id"],
                        "name": p["name"],
                        "emoji": p.get("emoji", "👤"),
                        "color": p.get("color", "#667eea"),
                        "userId": "user_global_1"
                    } for p in db_profiles
                ],
                "goals": [
                    {
                        "id": int(g["id"]),
                        "profileId": g["profile_id"],
                        "name": g["name"],
                        "targetAmount": float(g["target_amount"]) if g.get("target_amount") is not None else 0.0,
                        "currentAmount": float(g["current_amount"]) if g.get("current_amount") is not None else 0.0,
                        "currency": g["currency"],
                        "transactions": g.get("transactions") or [],
                        "createdAt": g.get("created_at")
                    } for g in db_goals
                ],
                "automations": [
                    {
                        "id": a["id"],
                        "goalId": int(a["goal_id"]),
                        "profileId": a["profile_id"],
                        "actionType": a["action_type"],
                        "amount": float(a["amount"]) if a.get("amount") is not None else 0.0,
                        "frequency": a["frequency"],
                        "note": a.get("note", ""),
                        "lastRun": a.get("last_run"),
                        "nextRun": a.get("next_run"),
                        "createdAt": a.get("created_at")
                    } for a in db_automations
                ]
            }
        except Exception as e:
            print(f"❌ Error leyendo de Supabase, usando respaldo local: {e}")

    # Fallback local
    if not os.path.exists(DB_PATH):
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
                    "currentAmount": 100000.0,
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
                    "actionType": "remove",
                    "amount": 28.0,
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
    if supabase:
        try:
            print("🔄 Sincronizando cambios hacia Supabase...")
            
            # 1. Guardar perfiles
            if data.get("profiles"):
                upsert_profiles = [
                    {
                        "id": p["id"],
                        "name": p["name"],
                        "emoji": p.get("emoji"),
                        "color": p.get("color")
                    } for p in data["profiles"]
                ]
                supabase.table('profiles').upsert(upsert_profiles).execute()
                
                # Eliminar perfiles que ya no existen
                local_profile_ids = [p["id"] for p in data["profiles"]]
                supabase.table('profiles').delete().not_in('id', local_profile_ids).execute()
            
            # 2. Guardar metas
            if data.get("goals"):
                upsert_goals = [
                    {
                        "id": g["id"],
                        "profile_id": g["profileId"],
                        "name": g["name"],
                        "target_amount": g["targetAmount"] if g.get("targetAmount") else None,
                        "current_amount": g["currentAmount"],
                        "currency": g["currency"],
                        "transactions": g.get("transactions") or []
                    } for g in data["goals"]
                ]
                supabase.table('goals').upsert(upsert_goals).execute()
                
                # Eliminar metas que ya no existen
                local_goal_ids = [g["id"] for g in data["goals"]]
                supabase.table('goals').delete().not_in('id', local_goal_ids).execute()
                
            # 3. Guardar automatizaciones
            if data.get("automations"):
                upsert_autos = [
                    {
                        "id": a["id"],
                        "goal_id": a["goalId"],
                        "profile_id": a["profileId"],
                        "action_type": a["actionType"],
                        "amount": a["amount"],
                        "frequency": a["frequency"],
                        "note": a.get("note", ""),
                        "last_run": a.get("lastRun"),
                        "next_run": a.get("nextRun")
                    } for a in data["automations"]
                ]
                supabase.table('automations').upsert(upsert_autos).execute()
                
                # Eliminar automatizaciones que ya no existen
                local_auto_ids = [a["id"] for a in data["automations"]]
                supabase.table('automations').delete().not_in('id', local_auto_ids).execute()
                
            print("✅ Sincronización hacia Supabase completada con éxito")
        except Exception as e:
            print(f"❌ Error escribiendo en Supabase, guardando localmente en db.json: {e}")

    # Escribir localmente como respaldo
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def calculate_next_run_date(from_date_str, frequency):
    from_date = datetime.fromisoformat(from_date_str)
    from_date = from_date.replace(hour=1, minute=0, second=5, microsecond=0)
    
    if frequency == 'daily':
        next_date = from_date + timedelta(days=1)
    elif frequency == 'weekly':
        next_date = from_date + timedelta(weeks=1)
    elif frequency == 'monthly':
        month = from_date.month + 1
        year = from_date.year
        if month > 12:
            month = 1
            year += 1
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
