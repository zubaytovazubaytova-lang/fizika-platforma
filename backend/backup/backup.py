"""
Har kuni SQLite ma'lumotlar bazasini backup qilish skripti.

Ishlatish:
    python backup/backup.py

Avtomatlashtirish (Windows Task Scheduler):
    Trigger: Har kuni soat 03:00
    Action:  python C:/.../fizika-platform/backend/backup/backup.py
"""
import shutil
import sys
from datetime import datetime
from pathlib import Path

BASE_DIR   = Path(__file__).resolve().parent.parent
DB_FILE    = BASE_DIR / 'db.sqlite3'
BACKUP_DIR = BASE_DIR / 'backup'

MAX_BACKUPS = 30  # 30 kunlik backup saqlanadi


def run():
    if not DB_FILE.exists():
        print(f'[XATO] DB topilmadi: {DB_FILE}')
        sys.exit(1)

    BACKUP_DIR.mkdir(exist_ok=True)
    stamp  = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    target = BACKUP_DIR / f'db_{stamp}.sqlite3'

    shutil.copy2(DB_FILE, target)
    print(f'[OK] Backup saqlandi: {target}')

    # Eski backuplarni tozalash
    backups = sorted(BACKUP_DIR.glob('db_*.sqlite3'))
    for old in backups[:-MAX_BACKUPS]:
        old.unlink()
        print(f'[TOZALANDI] {old.name}')


if __name__ == '__main__':
    run()
