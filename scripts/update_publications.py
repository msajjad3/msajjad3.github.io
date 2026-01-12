#!/usr/bin/env python3
"""
Automated Google Scholar publications updater
Run this script manually or via GitHub Actions
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Try to import scholarly, but provide fallback if not installed
try:
    from scholarly import scholarly
    HAS_SCHOLARLY = True
except ImportError:
    HAS_SCHOLARLY = False
    print("scholarly library not installed. Using fallback data.")

def get_publications_from_scholar():
    """Fetch publications from Google Scholar"""
    if not HAS_SCHOLARLY:
        return get_fallback_publications()
    
    try:
        print("Searching for author on Google Scholar...")
        
        # Search for your profile - you might need to adjust the search query
        search_query = scholarly.search_author('Muhammad Sajjad')
        author = next(search_query)
        
        # Fill author details
        author = scholarly.fill(author)
        print(f"Found author: {author['name']}")
        
        publications = []
        for i, pub in enumerate(author['publications'][:10]):  # Get latest 10
            try:
                scholarly.fill(pub)
                
                publication = {
                    'title': pub['bib'].get('title', ''),
                    'authors': pub['bib'].get('author', ''),
                    'venue': pub['bib'].get('venue', ''),
                    'year': pub['bib'].get('pub_year', ''),
                    'abstract': pub.get('bib', {}).get('abstract', ''),
                    'url': pub.get('pub_url', ''),
                    'citations': pub.get('num_citations', 0)
                }
                publications.append(publication)
                print(f"  - Added: {publication['title'][:50]}...")
                
            except Exception as e:
                print(f"  - Error processing publication {i}: {e}")
                continue
        
        return publications
        
    except Exception as e:
        print(f"Error fetching from Google Scholar: {e}")
        return get_fallback_publications()

def get_fallback_publications():
    """Fallback publications if Google Scholar fails"""
    print("Using fallback publications data...")
    
    return [
        {
            "title": "Rethinking disaster resilience in high-density cities: Towards an urban resilience knowledge system",
            "authors": "Sajjad, M., Chan, J.C.L., Chopra, S.S.",
            "venue": "Sustainable Cities and Society",
            "year": "2021",
            "url": "https://doi.org/10.1016/j.scs.2021.102850",
            "citations": 45
        },
        {
            "title": "Assessing hazard vulnerability, habitat conservation, and restoration for the enhancement of mainland China's coastal resilience",
            "authors": "Sajjad, M., Li, Y., Tang, Z., Cao, L., Liu, X.",
            "venue": "Earth's Future",
            "year": "2018",
            "url": "https://doi.org/10.1002/2017EF000676",
            "citations": 28
        }
    ]

def update_publications_json():
    """Update the publications JSON file"""
    # Get publications
    publications = get_publications_from_scholar()
    
    # Prepare data
    data = {
        'last_updated': datetime.now().isoformat(),
        'count': len(publications),
        'publications': publications
    }
    
    # Ensure data directory exists
    data_dir = Path('data')
    data_dir.mkdir(exist_ok=True)
    
    # Save to file
    output_file = data_dir / 'publications.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Successfully updated {len(publications)} publications to {output_file}")
    print(f"📅 Last updated: {data['last_updated']}")
    
    return len(publications)

if __name__ == "__main__":
    count = update_publications_json()
    sys.exit(0 if count > 0 else 1)
