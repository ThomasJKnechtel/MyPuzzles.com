from datetime import datetime
from distutils.log import error
from typing import Tuple
from chess.pgn import read_game, Game
from dotenv import dotenv_values
import chess.engine as engine
import ssl
import time
import urllib.request
import urllib.error
import pyodbc
import json
from sys import argv
from GameAnalysis import GameAnalysis

def getGames(fileName: str)->list[Game]:
    """
    Creates game objects for each pgn in file
    """
    try: pgnFile=open(fileName)
    except FileNotFoundError:
        error("File not found")
        exit(1)
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

def analyseGame(game: Game)->list[Tuple[str,str,str,str, str,int,int, int]]:
    """Generates puzzles for a game
    >>>analyseGame(getGames("game"))
    [[['d8d5'], '3r4/2R2pkp/1q2pbp1/p7/1p2Q3/1P3P2/4P2P/2R4K b - - 9 37'], [['b4e4'], '8/7R/4p3/4k1p1/1R6/1P3P2/2r4b/5K2 w - - 0 52'], ... 
    ... [['h7f7'], '8/7R/4p3/5kp1/4R3/1P3P2/2r4b/5K2 w - - 3 53']]]"""
    puzzles = [] 
    gameAnalysis = GameAnalysis(game.board(), 16,4)
    continuation = ""
    count = 0
    for move in game.mainline_moves():
        try:
            if continuation.split(' ')[count] == gameAnalysis.board.san(move):  ## if correct continuation being played update board 
                    if gameAnalysis.updateBoard(move):
                        count+=1
                        break
                    else:
                        print("Invalid Move in png at ln 70: " + move.uci()+" fen: "+gameAnalysis.board.fen())
        except Exception as e:
            print(e)
        continuation=''
        if not gameAnalysis.updateBoard(move):
            print("Invalid Move in png at ln 79: " + move.uci()+" fen: "+gameAnalysis.board.fen())
        gameAnalysis.getAnalysis(1, engine.INFO_SCORE)
        if gameAnalysis.isWinning(0):
          
            gameAnalysis.getAnalysis(2,engine.INFO_SCORE|engine.INFO_PV)
            fen = gameAnalysis.board.fen() ##sets position to return to
            while gameAnalysis.isOnlyMove():
                move =gameAnalysis.info[0]["pv"][0]
                count = 0 
                continuation+=gameAnalysis.board.san(move)+" "
                if not gameAnalysis.updateBoard(move): 
                    print("Invalid Move in png at ln 79: " + move.uci()+" fen: "+gameAnalysis.board.fen())
                    exit(1)
                gameAnalysis.getAnalysis(2,engine.INFO_SCORE|engine.INFO_PV)
            if(len(continuation)>0): 
                puzzles.append({'white':game.headers["White"],'black': game.headers["Black"], 'date':game.headers["Date"],'fen': fen,'continuation':continuation,'event': game.headers["Event"],'attempts':0,'success_rate':0,'user_id': 111})  
                gameAnalysis.board.set_fen(fen)
    gameAnalysis.stopEngine()
    return puzzles

def analyseGames(fileName: str):
    """analyze games for puzzles and returns list of puzzles"""
    puzzles = [] 
    games = getGames(dotenv_values(".env")["WEBSITE_PATH"]+fileName) #path stored in enviromental variable
    for game in games:
        puzzles+=analyseGame(game)
    return puzzles
    
def saveGames(player:str, oppoent="", nGames=1, gameTypes="", startDate=None, endDate=None):
    """saves pngs to Modules/PuzzleGenerator/gamePNGs.png.
     Request url format: https://lichess.org/api/games/user/chessiandoceo?vs=jdrc&rated=true&analysed=false&tags=true&clocks=false&evals=false&opening=false&max=8&since=1651377600000&until=1651723200000&perfType=ultraBullet%2Cbullet%2Cblitz%2Crapid%2Cclassical%2Ccorrespondence"""
    try: 
        ssl._create_default_https_context=ssl._create_unverified_context
        url="https://lichess.org/api/games/user/{p}?vs={o}&rated=true&tags=true&clocks=false&evals=false&opening=false&max={n}&since={sd}&until={ed}&perfType={gt}".format(p = player, o=oppoent, n=nGames, gt=gameTypes, sd=startDate, ed=endDate)
        urllib.request.urlretrieve(url, "Modules/PuzzleGenerator/gamePNGs.png")
    except urllib.error.HTTPError as ex:
        error(ex)
        exit(1)

def updateDataBase(puzzles: Tuple[str, str, datetime, str, str,str,int,int,int])->None:
    """updates the MyPuzzles.puzzles table with puzzles.
    >>>game = Game("gamePNG.png:)
    >>>updateDatabase(analyseGame(game))
    """
    cnxn = pyodbc.connect('DSN=WebsiteConnection;Trusted_Connection=yes;')
    cursor = cnxn.cursor()
    try: cursor.executemany("insert into [MyPuzzles.com].[dbo].[puzzles](white, black, date, fen, continuation, event, success_rate, attempts, user_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?)", puzzles)
    except pyodbc.Error as ex:
        error(ex)
        exit(1)
    cnxn.commit()
if __name__ == '__main__':
    
    gamePerameters = json.loads(argv[1])
    values = list(gamePerameters.values())
    keys =list( gamePerameters.keys())
    gameTypes = ''
    for i in range(len(values)):
        if(values[i]):
            gameTypes+=keys[i]+'%2C'
    

    saveGames(gamePerameters['playerName'], oppoent=gamePerameters['opponentName'], nGames=gamePerameters['numberGames'], gameTypes=gameTypes, startDate=gamePerameters['startDate'],endDate= gamePerameters['endDate'])
    print(json.dumps(analyseGames("/Modules/PuzzleGenerator/gamePNGs.png")))
    
    