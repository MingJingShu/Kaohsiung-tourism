//抓json資料
$(document).ready(function () {
  console.log("ready");
});

let MyData;
const drowbar = document.querySelector(".drow-bar"); //表單生成

//console.log('drowbar ='+drowbar);
//console.log('drowbar.length ='+drowbar.length);
const hot1 = document.getElementById("hot1");
const hot2 = document.getElementById("hot2");
const hot3 = document.getElementById("hot3");
const hot4 = document.getElementById("hot4");
const currentPart = document.getElementById("currentPart"); //當前行政區
const DataContainer = document.getElementById("Data_container"); //資料輸出父級

//Click事件偵聽

hot1.addEventListener("click", btnClick);
hot2.addEventListener("click", btnClick);
hot3.addEventListener("click", btnClick);
hot4.addEventListener("click", btnClick);

const pages = document.querySelector(".pages");
console.log(pages);
pages.addEventListener("click", pageClick);

//初始化載入資料
const request = new XMLHttpRequest();
//XMLHttpRequest()可讓網路透過js加載json，不用更新網頁就能獲取新的內容
request.open(
  "GET",
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json"
); //open開啟請求
request.responseType = "json"; //告知server回傳json資料
request.send(); //send傳送請求
request.onload = function () {
  //onload，只要傳入請求成功，就會觸發此onload事件
  MyData = request.response;
  //console.log(typeof(MyData));
  MyData = MyData.result.records;
  ResetDrowBar(MyData);
};

function ResetDrowBar(MyData) {
  let selectPartName = [];
  for (var i = 0; i < MyData.length; i++) {
    //console.log(MyData[i].Zone);
    selectPartName.push(MyData[i].Zone);
  } //for
  //result 取出不重複的陣列
  let result = Array.from(new Set(selectPartName));
  //var result = Array.from(new Set(origin));
  //做出表單元素
  for (var i = 0; i < result.length; i++) {
    var OptionStr = document.createElement("option");
    OptionStr.textContent = result[i];
    OptionStr.className = "selectPart"; //單獨取class名
    drowbar.appendChild(OptionStr);
  }
  //ResetDrowBar
  var selectPart = document.getElementById("drow-bar");
  selectPart.addEventListener("change", listClick);
}
function listClick(e) {
  let filteredData = dataFilter(e.target.value);
  localStorageData(filteredData);
  console.log(e.target.value);
  currentPart.innerHTML = e.target.value; //行政區打印在網頁
  let changeArray = creatNewArray();
  showData(changeArray,0);
}
//<------------------------------------------------------
function btnClick(e) {
  let filteredData = dataFilter(e.target.textContent); //資料過濾
  localStorageData(filteredData);
  storedData = JSON.parse(localStorage.getItem("datas")) || [];
  currentPart.innerHTML = e.target.textContent; //行政區打印在網頁
  let changeArray = creatNewArray();
  showData(changeArray,0);
}

 function pageClick(e){
	if(e.target.nodeName !='LI'){return}
	let num = e.target.dataset.num - 1;	
	if(num <0){ num = 0};
	let changeArray = creatNewArray();
	showData(changeArray,num);

 }


function showData(array,num) {
  // only show first page
  let insertHTML = "";
  let nowPage = array[num];

  for (let i = 0; i < nowPage.length; i++) {
    insertHTML += `<div class="Data-set col_6">
				<div class="Data_title">
					<img class="img-set" src="${nowPage[i].Picture1}">
					<p class="part-Name">${nowPage[i].Name}</p>
					<p class="part-Name2">${nowPage[i].Zone}</p>
				</div>
				<div class="Data-content clearfix">
				<div class="col_12 text_wrap"><img src="image/icons_clock.png" alt="openTime-icon"><p>${nowPage[i].Opentime}</p></div>
				<div class="col_12 text_wrap"><img src="image/icons_pin.png" alt="Map_icon"><p>${nowPage[i].Add}</p></div>
				<div class="col_12 text_wrap"><img src="image/icons_phone.png" alt="phone-icon"><p>${nowPage[i].Tel}</p></div>
				<div class="col_12 text_wrap"><img src="image/icons_tag.png" alt="Tag-icon"><p>${nowPage[i].Ticketinfo}</p></div>
				</div>
			</div>
		`;
  }
  DataContainer.innerHTML = insertHTML;
}

function dataFilter(chooesArea) {
  let filteredData = [];
  for (let i = 0; i < MyData.length; i++) {
    if (chooesArea === MyData[i].Zone) {
      filteredData.push(MyData[i]);
    }
  }
  return filteredData;
}
function creatNewArray() {
  const newArray = [];
  let pagenum = 0;
  let array = JSON.parse(localStorage.getItem("datas"));
  array.forEach((item, i) => {
    if (i % 8 === 0) {
      newArray.push([]);
    }
    const page = parseInt(i / 8);
    newArray[page].push(item);
    pagenum = page;
  });

  if (pagenum >= 1 && pagenum != 0) {
    creatPage(pagenum);
  } else if (pagenum == 0) {
    pages.innerHTML = "";
  }
  return newArray
}
function creatPage(pagenum) {
  let str = "";
  for (let i = 1; i < pagenum + 2; i++) {
    console.log("pagenum i =" + i);
    str += '<li data-num ="' + i + '" href = "#">' + i + "</li>";
  }
  pages.innerHTML = str;
}

//localStrage存資料 無資料就存空陣列(只能存String)
//let storedData = JSON.parse(localStorage.getItem('datas')||[]);

function localStorageData(datas) {
  return localStorage.setItem("datas", JSON.stringify(datas));
}
