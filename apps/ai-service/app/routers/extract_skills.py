"""
Voice-to-Skill Extraction Pipeline
From doc 14 — AI Documentation, Section 3.

Pipeline:
1. Language detection (langdetect)
2. Translation to English (deep-translator)
3. NER-based skill extraction (spaCy / keyword matching)
4. Fuzzy matching against skill taxonomy (rapidfuzz, 80% threshold)
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from rapidfuzz import fuzz, process
import re

router = APIRouter()

# ─── Skill Taxonomy ─────────────────────────────────────

SKILL_TAXONOMY = {
    # Electrical
    "Electrician": {"category": "Electrical", "hi": "इलेक्ट्रीशियन", "aliases": ["bijli", "bijli ka kaam", "electrical work", "electric"]},
    "Wiring": {"category": "Electrical", "hi": "वायरिंग", "aliases": ["wire", "wiring work", "tar ka kaam"]},
    "Smart Home": {"category": "Electrical", "hi": "स्मार्ट होम", "aliases": ["smart home installation", "home automation"]},
    "EV Charger": {"category": "Electrical", "hi": "ईवी चार्जर", "aliases": ["ev charging", "electric vehicle charger"]},
    "Circuit Board": {"category": "Electrical", "hi": "सर्किट बोर्ड", "aliases": ["circuit repair", "pcb"]},
    "Solar Panel": {"category": "Electrical", "hi": "सोलर पैनल", "aliases": ["solar installation", "solar"]},
    
    # Plumbing
    "Plumber": {"category": "Plumbing", "hi": "प्लंबर", "aliases": ["plumbing", "nalkiwala", "paani ka kaam", "pipe"]},
    "Pipe Fitting": {"category": "Plumbing", "hi": "पाइप फिटिंग", "aliases": ["pipe work", "pipe fitting"]},
    "Leakage Repair": {"category": "Plumbing", "hi": "लीकेज रिपेयर", "aliases": ["leak fix", "leakage", "rishav"]},
    "Bath Fittings": {"category": "Plumbing", "hi": "बाथ फिटिंग", "aliases": ["bathroom fitting", "sanitary"]},
    
    # Carpentry
    "Carpenter": {"category": "Carpentry", "hi": "बढ़ई", "aliases": ["carpentry", "badhai", "lakdi ka kaam", "wood work"]},
    "Furniture": {"category": "Carpentry", "hi": "फर्नीचर", "aliases": ["furniture making", "furniture repair"]},
    "Cabinet Making": {"category": "Carpentry", "hi": "कैबिनेट", "aliases": ["cabinet", "almari", "wardrobe"]},
    
    # Painting
    "Painter": {"category": "Painting", "hi": "पेंटर", "aliases": ["painting", "rang ka kaam", "paint work", "distemper"]},
    "Wall Painting": {"category": "Painting", "hi": "दीवार पेंटिंग", "aliases": ["wall paint", "interior painting"]},
    "Waterproofing": {"category": "Painting", "hi": "वॉटरप्रूफिंग", "aliases": ["waterproof", "damp proof"]},
    
    # AC & Appliance
    "AC Technician": {"category": "AC Repair", "hi": "एसी तकनीशियन", "aliases": ["ac repair", "ac service", "ac", "air conditioner"]},
    "Refrigerator Repair": {"category": "AC Repair", "hi": "फ्रिज रिपेयर", "aliases": ["fridge repair", "fridge", "refrigerator"]},
    
    # Cleaning
    "Deep Cleaning": {"category": "Cleaning", "hi": "डीप क्लीनिंग", "aliases": ["cleaning", "safai", "deep clean"]},
    "Kitchen Cleaning": {"category": "Cleaning", "hi": "किचन सफाई", "aliases": ["kitchen clean", "rasoi safai"]},
    
    # Construction
    "Mason": {"category": "Construction", "hi": "मिस्त्री", "aliases": ["masonry", "mistri", "rajgir", "construction"]},
    "Tile Work": {"category": "Construction", "hi": "टाइल वर्क", "aliases": ["tiling", "tiles", "floor tiles"]},
    "Welding": {"category": "Construction", "hi": "वेल्डिंग", "aliases": ["welder", "welding work", "loha jodna"]},
    
    # Automotive
    "Mechanic": {"category": "Automotive", "hi": "मैकेनिक", "aliases": ["car mechanic", "bike mechanic", "gaadi repair", "automobile"]},
    
    # Cooking
    "Cook": {"category": "Cooking", "hi": "रसोइया", "aliases": ["cooking", "chef", "khana banana", "bawarchi"]},
    
    # Housekeeping
    "Maid": {"category": "Housekeeping", "hi": "घरेलू सहायिका", "aliases": ["housekeeping", "kaamwali", "ghar ka kaam"]},
    
    # Security
    "Security Guard": {"category": "Security", "hi": "सुरक्षा गार्ड", "aliases": ["guard", "chowkidar", "watchman", "security"]},
    
    # Delivery
    "Delivery Driver": {"category": "Delivery", "hi": "डिलीवरी ड्राइवर", "aliases": ["delivery", "driver", "courier"]},
}

# Build flat lists for fuzzy matching
ALL_SKILL_NAMES = list(SKILL_TAXONOMY.keys())
ALL_ALIASES = {}
for skill_name, data in SKILL_TAXONOMY.items():
    for alias in data["aliases"]:
        ALL_ALIASES[alias.lower()] = skill_name
    ALL_ALIASES[skill_name.lower()] = skill_name
    if data.get("hi"):
        ALL_ALIASES[data["hi"]] = skill_name


class ExtractSkillsRequest(BaseModel):
    transcript: str
    lang: Optional[str] = "auto"


class ExtractedSkill(BaseModel):
    skill_id: str
    name_en: str
    name_hi: Optional[str]
    category: str
    confidence: float


class ExtractSkillsResponse(BaseModel):
    skills: List[ExtractedSkill]
    detected_language: str
    translated_text: Optional[str]


def detect_language(text: str) -> str:
    """Detect the language of input text."""
    try:
        from langdetect import detect
        return detect(text)
    except:
        return "en"


def translate_to_english(text: str, source_lang: str) -> str:
    """Translate text to English if not already English."""
    if source_lang == "en":
        return text
    
    try:
        from deep_translator import GoogleTranslator
        translated = GoogleTranslator(source=source_lang, target='en').translate(text)
        return translated or text
    except:
        # Fallback: return as-is and rely on alias matching
        return text


def extract_skills_from_text(text: str) -> List[dict]:
    """
    Extract skills from text using fuzzy matching against taxonomy.
    Threshold: 80% match confidence.
    """
    extracted = []
    seen_skills = set()
    
    # Normalize text
    text_lower = text.lower().strip()
    
    # 1. Try exact alias matching first
    for alias, skill_name in ALL_ALIASES.items():
        if alias in text_lower and skill_name not in seen_skills:
            skill_data = SKILL_TAXONOMY[skill_name]
            extracted.append({
                "skill_id": skill_name.lower().replace(" ", "_"),
                "name_en": skill_name,
                "name_hi": skill_data.get("hi"),
                "category": skill_data["category"],
                "confidence": 0.95
            })
            seen_skills.add(skill_name)
    
    # 2. Fuzzy match remaining words/phrases
    words = re.split(r'[,;.!?\s]+', text_lower)
    # Also try 2-word and 3-word combinations
    phrases = words.copy()
    for i in range(len(words) - 1):
        phrases.append(f"{words[i]} {words[i+1]}")
    for i in range(len(words) - 2):
        phrases.append(f"{words[i]} {words[i+1]} {words[i+2]}")
    
    for phrase in phrases:
        if len(phrase) < 3:
            continue
        
        # Fuzzy match against all aliases
        results = process.extractBests(
            phrase, list(ALL_ALIASES.keys()),
            scorer=fuzz.ratio,
            score_cutoff=80,
            limit=3
        )
        
        for match_text, score, _ in results:
            skill_name = ALL_ALIASES[match_text]
            if skill_name not in seen_skills:
                skill_data = SKILL_TAXONOMY[skill_name]
                extracted.append({
                    "skill_id": skill_name.lower().replace(" ", "_"),
                    "name_en": skill_name,
                    "name_hi": skill_data.get("hi"),
                    "category": skill_data["category"],
                    "confidence": round(score / 100, 2)
                })
                seen_skills.add(skill_name)
    
    return extracted


@router.post("/extract-skills", response_model=ExtractSkillsResponse)
async def extract_skills(req: ExtractSkillsRequest):
    """
    Extract skills from a voice transcript.
    
    Pipeline:
    1. Detect language
    2. Translate to English if needed
    3. Fuzzy match against skill taxonomy
    4. Return extracted skills with confidence scores
    """
    # 1. Language detection
    detected_lang = req.lang if req.lang != "auto" else detect_language(req.transcript)
    
    # 2. Translation
    translated = req.transcript
    if detected_lang != "en":
        translated = translate_to_english(req.transcript, detected_lang)
    
    # 3. Also try matching against original text (for Hindi aliases)
    skills_from_original = extract_skills_from_text(req.transcript)
    skills_from_translated = extract_skills_from_text(translated)
    
    # 4. Merge and deduplicate
    seen = set()
    merged = []
    for skill in skills_from_original + skills_from_translated:
        if skill["skill_id"] not in seen:
            merged.append(skill)
            seen.add(skill["skill_id"])
    
    # Sort by confidence
    merged.sort(key=lambda x: x["confidence"], reverse=True)
    
    return ExtractSkillsResponse(
        skills=[ExtractedSkill(**s) for s in merged],
        detected_language=detected_lang,
        translated_text=translated if detected_lang != "en" else None
    )
