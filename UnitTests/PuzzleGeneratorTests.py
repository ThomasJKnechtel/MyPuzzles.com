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
    def test_updateBoard(self):
        """test if AnalysisGame.updateBoard updates the board fen correctly and returns true if valid move"""
        fenStart = "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
        self.gameAnalysis.board = chess.Board(fenStart)
        self.assertTrue(self.gameAnalysis.updateBoard(chess.Move.from_uci('b5c6')))
        self.assertEqual("r1bqkb1r/pppp1ppp/2B2n2/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4", self.gameAnalysis.board.fen())

        fenStart = "r1bqkb1r/ppp2ppp/2p2n2/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5"
        self.gameAnalysis.board = chess.Board(fenStart)
        self.assertTrue(self.gameAnalysis.updateBoard(chess.Move.from_uci('e1g1')))
        self.assertEqual("r1bqkb1r/ppp2ppp/2p2n2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 5", self.gameAnalysis.board.fen())

        fenStart = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        self.gameAnalysis.board = chess.Board(fenStart)
        self.assertFalse(self.gameAnalysis.updateBoard(chess.Move.from_uci('c1g2')))
        self.assertEqual(fenStart, self.gameAnalysis.board.fen())
        
        
    def test_isWinning(self)->None:
        """test if function isWinning returns true if a player is winning.
        Cases: Relative CentiPawn Score = 230, turn = WHITE return True
        Cases: Relative CentiPawn Score = 230, turn = BLACK return True
        Cases: Relative CentiPawn Score = 170, turn = WHITE return False
        Cases: Relative CentiPawn Score = 170, turn = BLACK return False
        Cases: Relative Mate in 3, turn = BLACK return False
        """
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(181),chess.WHITE))]
        self.assertTrue(self.gameAnalysis.isWinning(0))
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(170), chess.WHITE))]
        self.assertFalse(self.gameAnalysis.isWinning(0))
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(181), chess.BLACK))]
        self.assertTrue(self.gameAnalysis.isWinning(0))
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(170), chess.BLACK))]
        self.assertFalse(self.gameAnalysis.isWinning(0))
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Mate(3), chess.BLACK))]
        self.assertTrue(self.gameAnalysis.isWinning(0))
    def test_isOnlyMove(self)->None:
        """test if function isOnlyMove returns true if only move.
        Cases: info= [{'score': PovScore(engine.Cp(181, chess.WHITE))},{'score': PovScore(engine.Cp(180, chess.WHITE))}] return True
        Cases: info= [{'score': PovScore(engine.Cp(300, chess.BLACK))},{'score': PovScore(engine.Cp(190, chess.BLACK))}] return False"""
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(181),chess.WHITE)),engine.InfoDict(score =engine.PovScore(engine.Cp(180),chess.WHITE))]
        self.assertTrue(self.gameAnalysis.isOnlyMove())
        self.gameAnalysis.info = [engine.InfoDict(score =engine.PovScore(engine.Cp(300),chess.BLACK)),engine.InfoDict(score =engine.PovScore(engine.Cp(190),chess.BLACK))]
        self.assertFalse(self.gameAnalysis.isOnlyMove())
    def tearDown(self) -> None:
        self.gameAnalysis.stopEngine()
        self.info = None
if __name__ == '__main__':
    unittest.main()