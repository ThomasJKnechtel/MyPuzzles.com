import chess.pgn
import time
from GameAnalysis import GameAnalysis
def getGames(fileName: str)->list:
    """
    Creates game objects for each pgn in file
    """
    pgnFile=open(fileName)
    games = []
    game = chess.pgn.read_game(pgnFile)
    while game is not None:
        games.append(game)
        game = chess.pgn.read_game(pgnFile)
    return games
def analyseGames()->None:
    games = getGames(r"C:\MyPuzzles\MyPuzzles.com\UnitTests\crackcubano_vs_gsvc.txt")
    gameAnalysis = None
    for game in games:
        gameAnalysis = GameAnalysis(game.board())
        for move in game.mainline_moves():
            gameAnalysis.updateBoard(move)
            gameAnalysis.getAnalysis(1)
            print(gameAnalysis.info[0]['nodes'])
    gameAnalysis.engine.close()
    
analyseGames()
