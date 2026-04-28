DEMO_RESPONSE = {
    "urgency_level": 4,
    "urgency_label": "Go to Hospital",
    "urgency_color": "red",
    "patient_explanation": "آپ کے بچے کو تیز بخار ہے اور یہ 2 دن سے جاری ہے۔ اسے فوری طور پر ہسپتال لے جانا چاہیے۔",
    "key_symptoms": ["High Fever (103°F)", "Duration: 2 days"],
    "recommended_hospitals": [
        {
            "rank": 1,
            "id": "h1",
            "name": "Services Hospital Lahore",
            "address": "Jail Road, Lahore",
            "phone": "042-99231386",
            "distance_km": 1.2,
            "drive_minutes": 5,
            "cost_tier": 1,
            "has_er": True,
            "open_24h": True,
            "recommendation_reason": "Nearest government hospital with a specialized pediatric emergency unit.",
            "directions_note": "Opposite Punjab Institute of Cardiology on Jail Road."
        },
        {
            "rank": 2,
            "id": "h2",
            "name": "Children's Hospital Lahore",
            "address": "Ferozepur Road, Lahore",
            "phone": "042-99230371",
            "distance_km": 3.5,
            "drive_minutes": 10,
            "cost_tier": 1,
            "has_er": True,
            "open_24h": True,
            "recommendation_reason": "Specialized pediatric care, highly recommended for children with high fever.",
            "directions_note": "Near Ferozepur Road, accessible via Metro Bus."
        },
        {
            "rank": 3,
            "id": "h3",
            "name": "Hameed Latif Hospital",
            "address": "New Garden Town, Lahore",
            "phone": "042-35883741",
            "distance_km": 2.8,
            "drive_minutes": 8,
            "cost_tier": 2,
            "has_er": True,
            "open_24h": True,
            "recommendation_reason": "Private option with excellent emergency services and pediatricians.",
            "directions_note": "Near Gaddafi Stadium."
        }
    ],
    "cost_estimate": {
        "cost_breakdown": [
            {"item": "Emergency Consultation", "range_min_pkr": 500, "range_max_pkr": 1000, "notes": "Government hospital ER fee"},
            {"item": "Complete Blood Count (CBC)", "range_min_pkr": 400, "range_max_pkr": 800, "notes": "To check for infection"},
            {"item": "Initial Medicines", "range_min_pkr": 300, "range_max_pkr": 600, "notes": "Fever reducers and hydration"}
        ],
        "total_range_min_pkr": 1200,
        "total_range_max_pkr": 2400,
        "most_likely_total_pkr": 1800,
        "most_likely_caveat": "Assumes outpatient treatment. If admission is required, costs will increase.",
        "admission_risk": True,
        "admission_cost_note": "PKR 500-2,000 per night at Services Hospital.",
        "what_to_bring": ["Original CNIC", "Child's Vaccination Card", "PKR 3,000 cash for immediate expenses"],
        "cost_saving_tip": "Services Hospital provides free emergency medicines if available in stock."
    },
    "follow_up": {
        "immediate_actions": [
            "بچے کے سر پر ٹھنڈے پانی کی پٹیاں رکھیں",
            "فوری طور پر سروسز ہسپتال روانہ ہوں",
            "گھر کے کسی فرد کو مطلع کریں"
        ],
        "at_hospital_steps": [
            "ہسپتال پہنچ کر ایمرجنسی وارڈ میں جائیں",
            "نرس کو بتائیں: 'بچے کو دو دن سے 103 بخار ہے'",
            "بچے کا شناختی کارڈ یا ب-فارم ساتھ رکھیں"
        ],
        "warning_signs": [
            "سانس لینے میں دشواری",
            "جسم کا نیلا پڑنا",
            "جھٹکے لگنا (fits)"
        ],
        "home_care_if_waiting": [
            "بچے کو ہلکے کپڑے پہنائیں",
            "پانی اور مائعات زیادہ پلائیں"
        ],
        "reassurance_note": "آپ ایک ذمہ دار والدین ہیں، بروقت ہسپتال لے جانا بہترین فیصلہ ہے۔",
        "emergency_number": "1122",
        "share_message": "میں بچے کو لے کر سروسز ہسپتال ایمرجنسی جا رہی ہوں۔ اس کا بخار 103 ہے اور وہ دو دن سے ٹھیک نہیں ہو رہا۔"
    },
    "language": "ur",
    "city": "Lahore",
    "processing_time_ms": 4500,
    "demo_mode": True
}
