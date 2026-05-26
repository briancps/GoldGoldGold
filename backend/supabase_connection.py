import os
from supabase import create_client
from dotenv import load_dotenv

# Load variables from the .env file into the operating system
# Allows os.environ to read these variables and use them
load_dotenv() 

sb_url = os.environ.get("SUPABASE_URL")
sb_service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Creates an instance of supabase client using create_client(url, key) 
supabase_client = create_client(sb_url, sb_service_role_key)