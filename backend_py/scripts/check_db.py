import sqlite3

conn = sqlite3.connect('foundercrm.db')
cursor = conn.cursor()

# Get list of tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("Tables in database:", [t[0] for t in tables])

# For each table, print structure
for table in tables:
    print(f"\nStructure of {table[0]}:")
    cursor.execute(f"PRAGMA table_info('{table[0]}')")
    print(cursor.fetchall())

conn.close()