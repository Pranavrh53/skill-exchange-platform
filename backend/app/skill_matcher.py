import mysql.connector
import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
from flask import current_app
from functools import lru_cache

# Connect to MySQL using Flask config
def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Pranavrh123$",
        database="skill_exchange"
    )


# Fetch skills data from MySQL
@lru_cache(maxsize=32)
def fetch_skills():
    conn = connect_db()
    query = """
    SELECT u.id as user_id, u.name as username, 'offered' as skill_type, 
           s.name as skill_name, '' as description
    FROM users u
    JOIN user_offered_skills us ON u.id = us.user_id
    JOIN skills s ON us.skill_id = s.id
    
    UNION ALL
    
    SELECT u.id as user_id, u.name as username, 'requested' as skill_type, 
           s.name as skill_name, '' as description
    FROM users u
    JOIN user_required_skills us ON u.id = us.user_id
    JOIN skills s ON us.skill_id = s.id
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df

# Preprocess text: Clean skill name + description
def preprocess_text(text):
    if pd.isnull(text):
        return ""
    text = text.lower()  # Lowercase
    text = text.translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
    tokens = word_tokenize(text)  # Tokenize
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]  # Remove stop words
    return ' '.join(tokens)

# Load and preprocess data
@lru_cache(maxsize=32)
def load_data():
    df_skills = fetch_skills()
    # Combine skill_name and description, then preprocess
    df_skills['processed_text'] = (df_skills['skill_name'] + ' ' + df_skills['description'].fillna('')).apply(preprocess_text)
    
    # Separate offered and requested skills
    offered = df_skills[df_skills['skill_type'] == 'offered'].groupby('user_id')['processed_text'].apply(' '.join).reset_index()
    requested = df_skills[df_skills['skill_type'] == 'requested'].groupby('user_id')['processed_text'].apply(' '.join).reset_index()
    
    # Merge into one DataFrame
    users_df = pd.merge(offered, requested, on='user_id', how='outer', suffixes=('_offered', '_requested'))
    users_df = users_df.merge(df_skills[['user_id', 'username']].drop_duplicates(), on='user_id')
    
    # Fill NaN for users with only offered or requested skills
    users_df['processed_text_offered'] = users_df['processed_text_offered'].fillna('')
    users_df['processed_text_requested'] = users_df['processed_text_requested'].fillna('')
    
    return users_df
if __name__ == "__main__":
    users_df = load_data()
    print(users_df.head())
    print(users_df.columns)
