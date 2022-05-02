import chess
import chess.engine as engine


class GameAnalysis:

    def __init__(self, board: chess.Board) -> None:
        self.board = board
        self.previous_cp = 0
        self.info = None
        self.engine = engine.SimpleEngine.popen_uci(r"C:\Users\Thomas\OneDrive\JS Files\stockfish-9-win\Windows\stockfish_9_x64.exe")
        self.engine.configure({"Threads":4})
        self.engine.configure({"hash":16})
        
    def getAnalysis(self, topMoveCount: int):
        """Updates the objects info object with data from engine"""
        self.info = self.engine.analyse(self.board, engine.Limit(depth=12),multipv=topMoveCount, info=engine.Info.ALL)
    def updateBoard(self, move: str)->bool:
        """Update board position with move if legal"""
        if(self.board.is_legal(move)):
            self.board.push(move)
            return True
        return False

