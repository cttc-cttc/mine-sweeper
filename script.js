/*
    m,M : 지뢰(mine)
*/
const M_IMAGE = './images/mine.png';
const EXPLOSION_IMAGE = './images/explosion.png';
const FLAG_IMAGE = './images/flag.png';
const X_MARK_IMAGE = './images/x.png';

const board = document.querySelector('.board > ul');
const domMImg = document.getElementById('mImg');
const domMCnt = document.getElementById('mCnt');
const domMNum = document.getElementById('mNum');
const domGameStatus = document.getElementById('gameStatus');

let row = -1;
let col = -1;
let mNum = -1;
let width = -1;
let height = -1;
let fontSize = -1;

// 기본 우클릭 막기
window.oncontextmenu = function() {
    return false;
}

window.onload = function() {
    domMImg.innerHTML = '<img src="'+ M_IMAGE +'">';
    level(1);
}

function init() {
    drawBoard();
    setM();
}

// 지뢰를 랜덤한 위치에 mNum만큼 생성
// 생성하다가 위치가 겹치면 겹치지 않을 때 까지 다시 생성
function setM() {
    let mArr = new Array();
    for(let i=0; i<mNum; i++) {
        const mX = Math.floor(Math.random() * col);
        const mY = Math.floor(Math.random() * row);
        const mLoc = [mX, mY];
        let isDup = false;
        
        for(let j=0; j<mArr.length; j++) {
            if(JSON.stringify(mArr[j]) === JSON.stringify(mLoc)) {
                isDup = true;
                i--;
                break;
            }
        }
        if(!isDup)
            mArr.push(mLoc);
    }
    
    // 지뢰 위치 matrix에 커스텀 속성 m 설정
    mArr.forEach(loc => {
        const x = loc[0];
        const y = loc[1];
        const li = board.childNodes[y].childNodes[0].childNodes[x];
        li.setAttribute('m', 1);
    });
}

// matrix를 생성하면서 각 matrix(li)에 좌클릭, 우클릭 이벤트 연결
function drawBoard() {
    for (let i=0; i<row; i++) {
        const li = document.createElement('li');
        const ul = document.createElement('ul');
        for (let j=0; j<col; j++) {
            const li = document.createElement('li');
            li.classList.add('matrix');
            li.style.setProperty('width', width+'px');
            li.style.setProperty('height', height+'px');
            li.style.setProperty('font-size', fontSize+'px');
            li.addEventListener('click', e => {
                if(e.currentTarget.classList.contains('matrix') && !e.currentTarget.classList.contains('flag'))
                    leftClickMatrix(e.currentTarget, j, i);
            });
            li.addEventListener('mouseup', e => {
                if(e.currentTarget.classList.contains('matrix'))
                    rightClickMatrix(e);
            });
            ul.append(li);
        }
        li.append(ul);
        board.append(li);
    }
    domMCnt.innerHTML = mNum;
    domMNum.innerHTML = mNum;
    domGameStatus.innerHTML = '';
}
function rightClickMatrix(e) {
    if(e.which == 3 || e.button == 2) {
        const target = e.currentTarget;
        if(!target.classList.contains('flag')) {
            target.innerHTML = '<img src="'+ FLAG_IMAGE +'">';
            target.classList.add('flag');
            domMCnt.innerHTML = Number(domMCnt.innerHTML) - 1;
        } else {
            target.classList.remove('flag');
            target.innerHTML = '';
            domMCnt.innerHTML = Number(domMCnt.innerHTML) + 1;
        }
    }
}
function leftClickMatrix(target, x, y) {
    // 지뢰 클릭
    if(target.getAttribute('m') == 1) {
        target.style.background = '#751919'; // 진한 빨강
        const lis = document.querySelectorAll('.matrix');
        
        for(let i=0; i<lis.length; i++) {
            const li = lis.item(i);
            li.classList.remove('matrix');
            
            if(li.getAttribute('m') == 1 && !li.classList.contains('flag')) {
                if(li === target)
                    target.innerHTML = '<img src="'+ EXPLOSION_IMAGE +'">';
                else
                    li.innerHTML = '<img src="'+ M_IMAGE +'">';

            } else if(li.getAttribute('m') != 1 && li.classList.contains('flag'))
                li.innerHTML = '<img src="'+ X_MARK_IMAGE +'">';
        }
        domGameStatus.innerHTML = 'Game Over..';

    } else {
        target.style.background = '#A3B0A5'; // 회색
        const dirArr = new Array();
        let mCnt = 0;
        mCnt += checkDirection(target, dirArr, x-1, y-1); // ↖
        mCnt += checkDirection(target, dirArr, x  , y-1); // ↑
        mCnt += checkDirection(target, dirArr, x+1, y-1); // ↗
        mCnt += checkDirection(target, dirArr, x-1, y  ); // ←
        mCnt += checkDirection(target, dirArr, x+1, y  ); // →
        mCnt += checkDirection(target, dirArr, x-1, y+1); // ↙
        mCnt += checkDirection(target, dirArr, x  , y+1); // ↓
        mCnt += checkDirection(target, dirArr, x+1, y+1); // ↘
        target.classList.remove('matrix');
        
        if(mCnt == 0) {
            dirArr.forEach(li => {
                li.click();
            });
        } else
            target.innerHTML = mCnt;
        
        endCheck();
    }
}
function endCheck() {
    const lis = document.querySelectorAll('.matrix');
    let isEnd = true;
    for(let i=0; i<lis.length; i++) {
        const li = lis.item(i);
        if(li.getAttribute('m') != 1) { // 클릭 가능한 지뢰가 아닌 위치가 남아 있다는 뜻
            isEnd = false;
            break;
        }
    }
    if(isEnd) {
        lis.forEach(li => {
            li.style.background = '#DCE7DD'; // 밝은 회색
            li.classList.remove('matrix');
        });
        domGameStatus.innerHTML = 'Clear!';
    }
}
function checkDirection(target, dirArr, x, y) {
    if(x<0 || y<0 || x==col || y==row)
        return 0;

    const li = board.childNodes[y].childNodes[0].childNodes[x];
    const isM = li.getAttribute('m');
    dirArr.push(li);
    return isM == 1 ? Number(isM) : 0;
}

function reset() {
    board.innerHTML = '';
    init();
}

function level(lev) {
    if(lev == 1)
        setLevelValue(5, 7, 5, 70, 70, 45);
    else if(lev == 2)
        setLevelValue(8, 10, 15, 50, 50, 35);
    else
        setLevelValue(11, 13, 25, 40, 40, 27);
}

function setLevelValue(rowVal, colVal, mNumVal, widthVal, heightVal, fontSizeVal) {
    row = rowVal;
    col = colVal;
    mNum = mNumVal;
    width = widthVal;
    height = heightVal;
    fontSize = fontSizeVal;
    reset();
}