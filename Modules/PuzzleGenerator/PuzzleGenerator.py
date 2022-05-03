from ast import Raise
from ctypes import sizeof
from chess import Move
from chess.pgn import read_game, Game, GameNode
from dotenv import dotenv_values
import chess.engine as engine
import time
from GameAnalysis import GameAnalysis
def getGames(fileName: str)->list[Game]:
    """
    Creates game objects for each pgn in file
    """
    pgnFile=open(fileName)
    games = []
    game = read_game(pgnFile)
    while game is not None:
        games.append(game)
        game = read_game(pgnFile)
    return games
def analyseGameMeasurements(fileOutput: str)->None:
    games = getGames(r"C:\MyPuzzles\MyPuzzles.com\UnitTests\crackcubano_vs_gsvc.txt")
    gameAnalysis = None
    movePerformance = []
    sums = (0,0,0)
    count = 0
    for game in games:
        gameAnalysis = GameAnalysis(game.board(), 16,4)
        for move in game.mainline_moves():
            startTime = time.time_ns()
            gameAnalysis.updateBoard(move)
            gameAnalysis.getAnalysis(1,engine.INFO_ALL)
            endTime = time.time_ns()

            count+=1
            info = gameAnalysis.info
            nodes = info[0]["nodes"]
            nps = info[0]["nps"]
            responseTime = endTime-startTime
            sums = (sums[0]+nodes, sums[1]+nps, sums[2]+responseTime)
            data =str(nodes)+" "+str(nps)+" "+str(responseTime)+"\n"
            movePerformance.append(data)
    gameAnalysis.engine.close()
    with open(fileOutput, "a") as file:
        file.writelines(movePerformance)
        file.write("Averages:\n")
        file.write(str(sums[0]/count)+" "+str(sums[1]/count)+" "+str(sums[2]/count)+"\n")

def analyseGames()->None:
    puzzles = [] 
    games = getGames(dotenv_values(".env")["WEBSITE_PATH"]+"UnitTests/crackcubano_vs_gsvc.txt")
    gameAnalysis = None
    for game in games:
        gameAnalysis = GameAnalysis(game.board(), 16,4)
        count = 1
        for move in game.mainline_moves():
            if not gameAnalysis.updateBoard(move): exit(1)
            gameAnalysis.getAnalysis(1, engine.INFO_SCORE)
            if gameAnalysis.isWinning(0):
                continuation = []
                gameAnalysis.getAnalysis(2,engine.INFO_SCORE|engine.INFO_PV)
                fen = gameAnalysis.board.fen()
                turn = gameAnalysis.board.turn
                while gameAnalysis.isOnlyMove():
                    if not gameAnalysis.updateBoard(gameAnalysis.info[0]["pv"][0]): exit(1)
                    continuation.append(str(move))
                    gameAnalysis.getAnalysis(2,engine.INFO_SCORE|engine.INFO_PV)
                if(len(continuation)>0):
                    puzzles.append(continuation)        
                    gameAnalysis.board.set_board_fen(fen.split(" ")[0])
                    gameAnalysis.board.turn=turn
    gameAnalysis.stopEngine()
    return puzzles

    
print(str(analyseGames()))