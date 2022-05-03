import unittest
import chess.pgn
import chess.engine as engine
import chess as chess
from dotenv import dotenv_values
import sys
sys.path.insert(1, dotenv_values(".env")["WEBSITE_PATH"]+"/Modules/PuzzleGenerator" )
from GameAnalysis import GameAnalysis

class TestAnalysis(unittest.TestCase):
    def setUp(self) -> None:
        self.gameAnalysis = GameAnalysis(None, 16, 4)

    def test_isWinning(self)->None:
        """test if function isWinning works.
        Cases: CentiPawn Score = 230, turn = WHITE return True
        Cases: CentiPawn Score = 230, turn = BLACK return True
        Cases: CentiPawn Score = 170, turn = WHITE return False
        Cases: CentiPawn Score = 170, turn = BLACK return False
        """
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(230),chess.WHITE))]
        self.assertTrue(self.gameAnalysis.isWinning(0))
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(170), chess.WHITE))]
        self.assertFalse(self.gameAnalysis.isWinning(0))
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(230), chess.BLACK))]
        self.assertTrue(self.gameAnalysis.isWinning(0))
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(170), chess.BLACK))]
        self.assertFalse(self.gameAnalysis.isWinning(0))
if __name__ == '__main__':
    unittest.main()