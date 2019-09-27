//抓json資料
let data;
const request=new XMLHttpRequest();
//XMLHttpRequest()可讓網路透過js加載json，不用更新網頁就能獲取新的內容
request.open('GET','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97');//open開啟請求
//request.responseType='json';//告知server回傳json資料，此project用不到這行code
request.send();//send傳送請求
request.onload=function(){//onload，只要傳入請求成功，就會觸發此onload事件
	data=JSON.parse(request.responseText);//取得請求中的json資料並轉換它為物件，陣列
	data=data.result.records;//去掉用不到的部分，
}


//指定DOM元素
const selectPart=document.getElementsByClassName("selectForm");//現在selectPart是一個array
const hot1=document.getElementById("hot1");
const hot2=document.getElementById("hot2");
const hot3=document.getElementById("hot3");
const hot4=document.getElementById("hot4");
const currentPart=document.getElementById("currentPart");
const addAttractions=document.getElementById("addAttractions");
const pages=document.querySelector(".pages");
const pageNum=document.getElementById("pageNum");


//事件監聽
for(let i=0;i<selectPart.length;i++){
	selectPart[i].addEventListener('change',listClick);
}//getElementsByClassName搭配for迴圈使用
hot1.addEventListener('click',btnClick);
hot2.addEventListener('click',btnClick);
hot3.addEventListener('click',btnClick);
hot4.addEventListener('click',btnClick);
pages.addEventListener('click',getPageNum);


//functions
function getPageNum(e){//取得點擊的頁碼數，個人做法是建一個li標籤(display:none)存值
	pageNum.innerHTML=e.target.dataset.page;
	let pageData=[];
	if(pageNum.innerHTML==1){//假如頁碼是第一頁，則取得前八筆資料，以此類推
		//slice(從哪裡開始擷取,擷取該數以前的數字);
		pageData=storedData.slice(0,8);
	}else if(pageNum.innerHTML==2){
		pageData=storedData.slice(8,16);
	}else if(pageNum.innerHTML==3){
		pageData=storedData.slice(16,24);
	}else if(pageNum.innerHTML==4){
		pageData=storedData.slice(24,32);
	}else if(pageNum.innerHTML==5){
		pageData=storedData.slice(32,40);
	}
	showData(pageData);
}

function btnClick(e){//按鈕點擊發生
	//先過濾資料
	let filteredData=dataFilter(e.target.textContent);
	localStorageData(filteredData);//過濾資料後存入localStorage
	storedData=JSON.parse(localStorage.getItem('datas'))||[];
	currentPart.innerHTML=e.target.textContent;
	//過濾完後就可以將相符合的行政區內容印在網頁上
	filteredData=filteredData.splice(0,8);//一開始只能印前八筆資料，等有切換頁碼的行為再呼叫getPageNum函式
	showData(filteredData);
}

function listClick(e){//選單點擊發生
	let filteredData=dataFilter(e.target.value);
	localStorageData(filteredData);
	storedData=JSON.parse(localStorage.getItem('datas'))||[];
	currentPart.innerHTML=e.target.value;
	filteredData=filteredData.splice(0,8);
	showData(filteredData);
}

function showData(datas){//在html上增加要讀取的資料和html程式碼
	//用innerHTML寫入
	let insertHTML='';
	for(let i=0;i<datas.length;i++){
		insertHTML+=`<div class="attraction">
				<div class="imgPart">
					<img src="${datas[i].Picture1}" alt="" class="imgStyle">
					<p class="attractionName">${datas[i].Name}</p>
					<p class="attractionPart">${datas[i].Zone}</p>
				</div>
				<div class="detailPart">
					<ul>
						<li class="openTime"><img src="pictures/icons_clock.png" alt="">${datas[i].Opentime}</li>
						<li class="address"><img src="pictures/icons_pin.png" alt="">${datas[i].Add}</li>
						<li class="phoneNum"><img src="pictures/icons_phone.png" alt="" class="phone">${datas[i].Tel}<img src="pictures/icons_tag.png" alt="" class="tag"><span>${datas[i].Ticketinfo}</span></li>
					</ul>
				</div>
			</div>`
	}
	addAttractions.innerHTML=insertHTML;
}

function dataFilter(choosePart){//過濾和點擊按鈕不同的行政區
	let filteredData=[];
	for(let i=0;i<data.length;i++){
		if(choosePart===data[i].Zone){
			filteredData.push(data[i]);
		}
	}
	return filteredData;
}

let storedData=JSON.parse(localStorage.getItem('datas'))||[];//localStorage的部分
function localStorageData(datas){
	localStorage.setItem('datas', JSON.stringify(datas));
}