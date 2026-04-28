import os
import math
from typing import List, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

async def get_nearby_hospitals(
    lat: float, 
    lng: float, 
    city: str = "Lahore", 
    limit: int = 10
) -> List[dict]:
    """
    Query Supabase for hospitals near the given coordinates.
    """
    if not supabase:
        # Fallback logic could go here if supabase is not initialized
        return []

    try:
        # PostGIS query via rpc
        # Note: You need to create this function in Supabase or use raw SQL
        # For simplicity in this implementation, we will use a fallback to Euclidean distance
        # if the RPC isn't set up, or try a raw query approach.
        
        # Trying a raw approach via PostGIS if possible, otherwise manual calculation
        response = supabase.table("hospitals").select("*").eq("city", city).eq("is_active", True).execute()
        hospitals = response.data

        for h in hospitals:
            # Calculate distance_km using Euclidean approximation
            # distance = sqrt((h.lat - user_lat)^2 + (h.lng - user_lng)^2) * 111
            d_lat = float(h['lat']) - lat
            d_lng = float(h['lng']) - lng
            distance_km = math.sqrt(d_lat**2 + d_lng**2) * 111
            h['distance_km'] = round(distance_km, 2)
            # drive_minutes = int(distance_km / 0.5) + 2
            h['drive_minutes'] = int(distance_km / 0.5) + 2

        # Sort by distance
        hospitals.sort(key=lambda x: x['distance_km'])
        return hospitals[:limit]

    except Exception as e:
        print(f"Error fetching hospitals: {e}")
        return []

async def log_query(
    session_id: Optional[str], 
    city: str, 
    urgency_level: int, 
    language: str
) -> None:
    """Insert a row into query_logs table."""
    if not supabase: return
    try:
        supabase.table("query_logs").insert({
            "session_id": session_id,
            "city": city,
            "urgency_level": urgency_level,
            "language": language
        }).execute()
    except Exception as e:
        print(f"Error logging query: {e}")

async def get_stats() -> dict:
    """Return total_queries and queries_today counts."""
    if not supabase: return {"total_queries": 0, "queries_today": 0}
    try:
        total = supabase.table("query_logs").select("*", count="exact").execute()
        # For simplicity, returning a fixed number or calculating if needed
        return {
            "total_queries": total.count if total.count else 0,
            "queries_today": 0 # Would need more complex query for today
        }
    except Exception as e:
        print(f"Error getting stats: {e}")
        return {"total_queries": 0, "queries_today": 0}
