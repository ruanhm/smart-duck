class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.value}
                <style jsx>{`
                    .square {
                        background: #fff;
                        border: 1px solid #999;
                        float: left;
                        font-size: 24px;
                        font-weight: bold;
                        line-height: 34px;
                        height: 34px;
                        margin-right: -1px;
                        margin-top: -1px;
                        padding: 0;
                        text-align: center;
                        width: 34px;
                    }
                    
                    .square:focus {
                        outline: none;
                    }
                    
                    .kbd-navigation .square:focus {
                        background: #ddd;
                    }
                `}</style>
            </button>

        );
    }
}

class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }
    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }
    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({squares: squares,xIsNext:!this.state.xIsNext});
      }
    render() {
        const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
                <style jsx>{`
                    .board-row:after {
                        clear: both;
                        content: "";
                        display: table;
                      }
                      
                      .status {
                        margin-bottom: 10px;
                      }
                `}</style>
            </div>

        );
    }
}

export default class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
                <style>{`
                    body {
                        font: 14px "Century Gothic", Futura, sans-serif;
                        margin: 20px;
                    }
                      
                    ol, ul {
                        padding-left: 30px;
                    }
                    .game {
                        display: flex;
                        flex-direction: row;
                    }
                      
                    .game-info {
                        margin-left: 20px;
                    }
                `}</style>
            </div>
        );
    }
}


