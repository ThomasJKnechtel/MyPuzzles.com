import chess
import chess.engine as engine


class GameAnalysis:
    """Provides Analysis of a chess game"""
    def __init__(self, board: chess.Board, hash:int, threads: int) -> None:
        self.board = board
        self.previous_cp = 0
        self.info = None
        self.engine = engine.SimpleEngine.popen_uci(r"C:\Users\Thomas\OneDrive\JS Files\stockfish-9-win\Windows\stockfish_9_x64.exe")
        self.engine.configure({"Threads":threads})
        self.engine.configure({"hash":hash})
        
    def getAnalysis(self, topMoveCount: int, infoType):
        """Updates the objects info object with data from engine"""
        self.info = self.engine.analyse(self.board, engine.Limit(depth=12),multipv=topMoveCount, info=infoType)
    def updateBoard(self, move: str)->bool:
        """Update board position with move if legal"""
        if(self.board.is_legal(move)):
            self.board.push(move)
            return True
        return False
    def isWinning(self, line: int):
        """Check if current position has winning line i.e. CP score > 2 or Mate"""
        score = self.info[line]["score"].relative
        if score.is_mate():
            return True
        elif score.score()>180:
            return True
        return False
    def isOnlyMove(self):
        """Check if only one winning move"""
        if self.isWinning(0) and not self.isWinning(1):
            return True
        return False
    def stopEngine(self):
        """Stops engine"""
        self.engine.close()
    def getMove(self, ply: int)->chess.Move:
        """Returns best move at ply"""
        if self.info[0]['pv']>ply:
            return self.info[0]['pv'][0]
        else: return None