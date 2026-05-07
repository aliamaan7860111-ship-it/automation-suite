import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "execution"))

import unittest
from filex_city_normalizer import normalize_city

class TestCityNormalizer(unittest.TestCase):
    # Direct alias hits
    def test_dubai_simple(self):
        self.assertEqual(normalize_city("Apt 1 Test Tower Silicon Oasis Dubai"), "Dubai")

    def test_abu_dhabi(self):
        self.assertEqual(normalize_city("Villa 1 Test Area Abu Dhabi"), "Abu Dhabi")

    def test_sharjah(self):
        self.assertEqual(normalize_city("Test Street, Villa No. 1 Sharjah"), "Sharjah")

    def test_ajman(self):
        self.assertEqual(normalize_city("Test Street, Test Area, Ajman"), "Ajman")

    def test_al_ain(self):
        self.assertEqual(normalize_city("Villa 1 Test Area Al Ain"), "Al Ain")

    # Filex spelling normalization
    def test_fujairah_maps_to_filex_fujeriah(self):
        self.assertEqual(normalize_city("Test Area Fujairah 1/1"), "Fujeriah")

    def test_umm_al_quwain_maps_to_filex_um_al_qwain(self):
        self.assertEqual(normalize_city("Some place Umm Al Quwain"), "Um Al Qwain")

    def test_ras_al_khaimah_hyphen(self):
        self.assertEqual(normalize_city("Test Villa Ras al-Khaimah"), "Ras Al Khaimah")

    # Typo / fuzzy
    def test_typo_dubaai(self):
        self.assertEqual(normalize_city("Test Building 1 jvc dubaai"), "Dubai")

    def test_typo_abudhabi_no_space(self):
        self.assertEqual(normalize_city("1 test building test area abudhabi"), "Abu Dhabi")

    # Tiebreaker: first city wins
    def test_two_cities_picks_first(self):
        self.assertEqual(normalize_city("Test Area Fujairah Abu Dhabi"), "Fujeriah")

    # No match
    def test_no_city_returns_none(self):
        self.assertIsNone(normalize_city("Random building street villa"))

    def test_empty_address(self):
        self.assertIsNone(normalize_city(""))

if __name__ == "__main__":
    unittest.main()
