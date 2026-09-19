import math
import re
from typing import Dict, Any, List, Tuple

class EntityResolver:
    """Calculates multi-metric semantic and syntactic similarity across name variations and handles."""

    @staticmethod
    def clean_string(s: str) -> str:
        if not s:
            return ""
        return re.sub(r'[^a-zA-Z0-9\s]', '', s).lower().strip()

    @classmethod
    def levenshtein_similarity(cls, s1: str, s2: str) -> float:
        s1 = cls.clean_string(s1)
        s2 = cls.clean_string(s2)
        if not s1 and not s2:
            return 1.0
        if not s1 or not s2:
            return 0.0
        if s1 == s2:
            return 1.0
            
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
            
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                cost = 0 if s1[i - 1] == s2[j - 1] else 1
                dp[i][j] = min(
                    dp[i - 1][j] + 1,       # deletion
                    dp[i][j - 1] + 1,       # insertion
                    dp[i - 1][j - 1] + cost  # substitution
                )
        dist = dp[m][n]
        max_len = max(m, n)
        return max(0.0, 1.0 - (dist / max_len))

    @classmethod
    def jaro_winkler_similarity(cls, s1: str, s2: str) -> float:
        s1 = cls.clean_string(s1)
        s2 = cls.clean_string(s2)
        if s1 == s2:
            return 1.0
        if not s1 or not s2:
            return 0.0

        len1, len2 = len(s1), len(s2)
        max_dist = max(len1, len2) // 2 - 1
        match = 0
        s1_matches = [False] * len1
        s2_matches = [False] * len2

        for i in range(len1):
            start = max(0, i - max_dist)
            end = min(i + max_dist + 1, len2)
            for j in range(start, end):
                if s2_matches[j]:
                    continue
                if s1[i] == s2[j]:
                    s1_matches[i] = True
                    s2_matches[j] = True
                    match += 1
                    break

        if match == 0:
            return 0.0

        transpositions = 0
        k = 0
        for i in range(len1):
            if not s1_matches[i]:
                continue
            while not s2_matches[k]:
                k += 1
            if s1[i] != s2[k]:
                transpositions += 1
            k += 1

        m = float(match)
        jaro = (m / len1 + m / len2 + (m - transpositions / 2.0) / m) / 3.0

        # Winkler prefix boost (up to 4 chars)
        prefix_len = 0
        for i in range(min(4, len1, len2)):
            if s1[i] == s2[i]:
                prefix_len += 1
            else:
                break

        return min(1.0, jaro + 0.1 * prefix_len * (1.0 - jaro))

    @classmethod
    def token_set_similarity(cls, s1: str, s2: str) -> float:
        t1 = set(cls.clean_string(s1).split())
        t2 = set(cls.clean_string(s2).split())
        if not t1 or not t2:
            return 0.0
        intersection = t1.intersection(t2)
        union = t1.union(t2)
        return len(intersection) / float(len(union))

    @classmethod
    def resolve_name_and_alias(cls, canonical: str, observed: str) -> Dict[str, Any]:
        """Performs multi-signal entity resolution between two name/handle representations."""
        c_clean = cls.clean_string(canonical)
        o_clean = cls.clean_string(observed)

        # Check handle substring / abbreviation rules:
        # e.g. "John Kumar" vs "johnk" -> first name exact + last initial
        words = c_clean.split()
        is_initialism_match = False
        if len(words) >= 2:
            first, last = words[0], words[-1]
            if o_clean == f"{first}{last[0]}" or o_clean == f"{first[0]}{last}" or o_clean == f"{first}{last}":
                is_initialism_match = True
            elif o_clean.startswith(first) or o_clean.endswith(last):
                is_initialism_match = True

        jw = cls.jaro_winkler_similarity(canonical, observed)
        lev = cls.levenshtein_similarity(canonical, observed)
        tok = cls.token_set_similarity(canonical, observed)

        composite = (jw * 0.45) + (lev * 0.25) + (tok * 0.30)
        if is_initialism_match and composite < 0.85:
            composite = max(composite, 0.88)

        is_match = composite >= 0.70
        return {
            "canonical": canonical,
            "observed": observed,
            "jaro_winkler": round(jw, 3),
            "levenshtein": round(lev, 3),
            "token_set": round(tok, 3),
            "composite_similarity": round(composite, 3),
            "is_resolved_match": is_match,
            "confidence_level": "HIGH" if composite >= 0.85 else ("MEDIUM" if composite >= 0.70 else "LOW")
        }
