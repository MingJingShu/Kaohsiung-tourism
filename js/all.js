//抓json資料
let MyData;
const drowbar = document.querySelector('.drow-bar');//表單生成

//console.log('drowbar ='+drowbar);
//console.log('drowbar.length ='+drowbar.length);
const hot1=document.getElementById("hot1");
const hot2=document.getElementById("hot2");
const hot3=document.getElementById("hot3");
const hot4=document.getElementById("hot4");
const currentPart=document.getElementById("currentPart");//當前行政區
const DataContainer=document.getElementById("Data-container");//資料輸出父級

//Click事件偵聽

hot1.addEventListener('click',btnClick);
hot2.addEventListener('click',btnClick);
hot3.addEventListener('click',btnClick);
hot4.addEventListener('click',btnClick);
//pages.addEventListener('click',getPageNum);

//初始化載入資料
const request=new XMLHttpRequest();
//XMLHttpRequest()可讓網路透過js加載json，不用更新網頁就能獲取新的內容
request.open('GET','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97');//open開啟請求
request.responseType = 'json';//告知server回傳json資料
request.send();//send傳送請求
request.onload=function(){//onload，只要傳入請求成功，就會觸發此onload事件
	 MyData = request.response;
	//console.log(typeof(MyData));
	MyData = MyData.result.records;
	Reset(MyData);

}

function Reset (MyData){
	let selectPartName = [];
	for(var i = 0; i< MyData.length; i++){
		//console.log(MyData[i].Zone);
		selectPartName.push(MyData[i].Zone);
	}//for
	//result 取出不重複的陣列
	let result = Array.from(new Set(selectPartName));
	//var result = Array.from(new Set(origin));
	//做出表單元素
	for(var i = 0 ;i<result.length ; i++){

		var OptionStr =document.createElement('option');
		OptionStr.textContent = result[i];
		OptionStr.className = 'selectPart';//單獨取class名
		drowbar.appendChild(OptionStr);

		//console.log('OptionStr ='+ OptionStr.textContent);
		//console.log('result ='+ result[i]);
		//result[i].addEventListener('change',listClick(e));
	}

//console.log('result.length ='+ result.length);


//change事件加入
//const selectPart = document.getElementById("drow-bar");
var selectPart = document.getElementById("drow-bar");
	selectPart.addEventListener('change',listClick);


}//Reset

function btnClick(e)
{
	
	let filteredData=dataFilter(e.target.textContent);//資料過濾
	localStorageData(filteredData);
	//storedData=JSON.parse(localStorage.getItem('datas'))||[];

	currentPart.innerHTML = e.target.textContent;//行政區打印在網頁

	//顯示前八筆資料 等有切換行為在呼叫getPageNum函式
	filteredData = filteredData.splice(0,8);
	showData(filteredData);
	//console.log('e.target.textContent ='+e.target.textContent);
	//console.log('btnClick'+e);
	//console.log('typeof ='+typeof(e));

}

function listClick(e)
{
	console.log('listClick finsh');
	let filteredData=dataFilter(e.target.value);
	localStorageData(filteredData);
	console.log(e.target.value);
	//storedData=JSON.parse(localStorage.getItem('datas'))||[];
	currentPart.innerHTML = e.target.value;//行政區打印在網頁

	//顯示前八筆資料 等有切換行為在呼叫getPageNum函式
	filteredData = filteredData.splice(0,8);
	showData(filteredData);
}

function showData(datas)//
{
	let insertHTML = '';

	console.log('typeof(datas) ='+typeof(datas));
	console.log('datas.length ='+datas.length);
	
	console.log('JSON.stringify(datas) ='+JSON.stringify(datas));
	
	for(let i =  0; i<datas.length;i++)
	{
		insertHTML +=`<div class="Data-set col-6">
				<div class="Data-title">
					<img class="img-set" src="${datas[i].Picture1}">
					<p class="part-Name">${datas[i].Name}</p>
					<p class="part-Name2">${datas[i].Zone}</p>
				</div>
				<div class="Data-content clearfix">
					<div class="col-12"><img src="image/icons_clock.png" alt="openTime-icon">${datas[i].Opentime}</div>
					<div class="col-12"><img src="image/icons_pin.png" alt="Map_icon">${datas[i].Add}</div>
					<div class="col-6"><img src="image/icons_phone.png" alt="phone-icon">${datas[i].Tel}</div>
					<div class="col-6 right-set"><img src="image/icons_tag.png" alt="Tag-icon">${datas[i].Ticketinfo}</div>
				</div>
			</div>
		`

		//console.log('datas[i].Name ='+datas[i].Name);
	}
	DataContainer.innerHTML = insertHTML;
}

function dataFilter(chooesPart)
{
	let filteredData =[];
	for(let i =0; i<MyData.length; i++)
	{
		if(chooesPart ===MyData[i].Zone){
			filteredData.push(MyData[i]);
			}
	}
	return filteredData;
}


//localStrage存資料 無資料就存空陣列(只能存String)
//let storedData = JSON.parse(localStorage.getItem('datas')||[]);

function localStorageData(datas)
{
	localStorage.setItem('datas', JSON.stringify(datas));
}