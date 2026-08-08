"""
Run this script ONCE to create the database.
Usage:  python setup_db.py
It reads DB credentials from .env
"""
import os
import pymysql
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("DB_HOST", "localhost")
user = os.getenv("DB_USER", "root")
password = os.getenv("DB_PASSWORD", "")
db_name = os.getenv("DB_NAME", "lost_and_found")

print(f"Connecting to MySQL at {host} as {user}...")
try:
    conn = pymysql.connect(host=host, user=user, password=password)
    with conn.cursor() as cur:
        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        print(f"Database '{db_name}' is ready.")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
    print("\nPlease check your .env file credentials and make sure MySQL is running.")
