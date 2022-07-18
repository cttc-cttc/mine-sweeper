/*
    m,M : 지뢰(mine)
*/
const M_NUM = 10;
const ROWS = 8;
const COLS = 10;
const M_IMAGE = './images/mine.png';
const EXPLOSION_IMAGE = './images/explosion.png';
const FLAG_IMAGE = './images/flag.png';
const X_MARK_IMAGE = './images/x.png';

const board = document.querySelector('.board > ul');

// 기본 우클릭 막기
window.oncontextmenu = function() {
    return false;
}

init();

function init() {
    drawBoard();
    setM();
}

// 지뢰를 랜덤한 위치에 M_NUM만큼 생성
// 생성하다가 위치가 겹치면 겹치지 않을 때 까지 다시 생성
function setM() {
    let mArr = new Array();
    for(let i=0; i<M_NUM; i++) {
        const mX = Math.floor(Math.random() * COLS);
        const mY = Math.floor(Math.random() * ROWS);
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
        const mImg = document.createElement('img');
        mImg.src = M_IMAGE;
        const li = board.childNodes[y].childNodes[0].childNodes[x];
        li.setAttribute('m', 1);
        li.prepend(mImg);
    });
}

// matrix를 생성하면서 각 matrix(li)에 클릭 이벤트를 연결
function drawBoard() {
    for (let i = 0; i < ROWS; i++) {
        const li = document.createElement('li');
        const ul = document.createElement('ul');
        for (let j = 0; j < COLS; j++) {
            const li = document.createElement('li');
            li.classList.add('matrix');
            li.addEventListener('click', e => {
                clickMatrix(e.currentTarget, j, i);
            });
            ul.append(li);
        }
        li.append(ul);
        board.append(li);
    }
}
function clickMatrix(target, x, y) {
    if(target.getAttribute('m') == 1) {
        target.style.background = '#751919'; // 진한 빨강
        target.classList.remove('matrix');
        target.removeEventListener('click', this);

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
        target.removeEventListener('click', this);
        
        if(mCnt == 0) {
            dirArr.forEach(li => {
                li.click();
            });
        } else {
            target.innerHTML = mCnt;
        }
    }
}
function checkDirection(target, dirArr, x, y) {
    if(x<0 || y<0 || x==COLS || y==ROWS || !target.classList.contains('matrix'))
        return 0;
    const li = board.childNodes[y].childNodes[0].childNodes[x];
    const isM = li.getAttribute('m');
    dirArr.push(li);
    return isM == 1 ? Number(isM) : 0;
}

